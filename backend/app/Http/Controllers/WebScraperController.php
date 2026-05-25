<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Webscaner;
use App\Models\WebscanerChunk;
use App\Models\WebscanerMetadata;
use App\Services\EmbeddingService;

class WebScraperController extends Controller
{
    protected EmbeddingService $embeddingService;

    public function __construct(EmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }
    public function scrape(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $url = $request->input('url');

        try {
            $response = Http::timeout(15)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; SawtiaBot/1.0)'])
                ->get($url);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch the website.'], 422);
            }

            $html = $response->body();

            // Load DOM
            $dom = new \DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
            $xpath = new \DOMXPath($dom);

            // --- Meta data ---
            $meta = [];
            $meta['title'] = optional($dom->getElementsByTagName('title')->item(0))->textContent ?? '';

            foreach ($dom->getElementsByTagName('meta') as $tag) {
                $name    = strtolower($tag->getAttribute('name') ?: $tag->getAttribute('property'));
                $content = $tag->getAttribute('content');
                if (in_array($name, ['description', 'keywords', 'og:title', 'og:description', 'og:image'])) {
                    $meta[$name] = $content;
                }
            }

            // --- All text content ---
            // Remove script/style nodes
            foreach ($xpath->query('//script | //style | //noscript') as $node) {
                $node->parentNode->removeChild($node);
            }
            $bodyNode  = $dom->getElementsByTagName('body')->item(0);
            $bodyText  = $bodyNode ? trim(preg_replace('/\s+/', ' ', $bodyNode->textContent)) : '';
            $textForChunks = $bodyText; // limit to 5000 chars

            // --- Contact info ---
            $emails = [];
            preg_match_all('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', $html, $emailMatches);
            $emails = array_unique($emailMatches[0]);

            $phones = [];
            preg_match_all('/(\+?\d[\d\s\-().]{7,}\d)/', $html, $phoneMatches);
            $phones = array_unique(array_slice($phoneMatches[0], 0, 10));

            $addresses = [];
            preg_match_all('/\d{1,5}\s[\w\s]{3,50},\s[\w\s]{2,30},?\s[A-Z]{2}\s\d{5}/', $html, $addrMatches);
            $addresses = array_unique($addrMatches[0]);

            // --- Links ---
            $links = [];
            foreach ($dom->getElementsByTagName('a') as $tag) {
                $href = $tag->getAttribute('href');
                $text = trim($tag->textContent);
                if ($href && !str_starts_with($href, '#') && !str_starts_with($href, 'javascript')) {
                    if (!str_starts_with($href, 'http')) {
                        $parsed = parse_url($url);
                        $href   = $parsed['scheme'] . '://' . $parsed['host'] . '/' . ltrim($href, '/');
                    }
                    $links[] = ['href' => $href, 'text' => $text ?: $href];
                }
            }
            $links = array_slice(array_unique($links, SORT_REGULAR), 0, 30);

            // --- Images ---
            $images = [];
            foreach ($dom->getElementsByTagName('img') as $tag) {
                $src = $tag->getAttribute('src');
                $alt = $tag->getAttribute('alt');
                if ($src) {
                    if (!str_starts_with($src, 'http')) {
                        $parsed = parse_url($url);
                        $src    = $parsed['scheme'] . '://' . $parsed['host'] . '/' . ltrim($src, '/');
                    }
                    $images[] = ['src' => $src, 'alt' => $alt];
                }
            }
            $images = array_slice($images, 0, 20);

            // --- Products (basic heuristic) ---
            $products = [];
            $priceNodes = $xpath->query('//*[contains(@class,"price") or contains(@class,"product") or contains(@id,"price")]');
            foreach ($priceNodes as $node) {
                $text = trim($node->textContent);
                if (preg_match('/[\$€£¥]?\d+([.,]\d{1,2})?/', $text)) {
                    $products[] = $text;
                }
            }
            $products = array_unique(array_slice($products, 0, 20));
            $website = Webscaner::create([
                'user_id'         => auth()->id(),
                'url'         => $url,
                'title'           => $meta['title'] ?? null,
                'description'     => $meta['description'] ?? null,
                'language'        => 'en',
                'last_scraped_at' => now(),
            ]);
            $chunks = str_split($textForChunks, 1000);
            foreach ($chunks as $index => $chunk) {

                if (trim($chunk) === '') continue;
                $embedding = $this->embeddingService->embed($chunk);

                // 4. Save chunk
                WebscanerChunk::create([
                    'web_id'      => $website->id,
                    'text'        => $chunk,
                    'chunk_index' => $index,
                    'embedding'   => $embedding,
                ]);
            }
            WebscanerMetadata::create([
                'web_id' => $website->id,

                'meta' => $meta,

                'contacts' => [
                    'emails'    => array_values($emails),
                    'phones'    => array_values($phones),
                    'addresses' => array_values($addresses),
                ],

                'links' => array_values($links),

                'images' => array_values($images),

                'products' => array_values($products),
            ]);
            return response()->json([
                'url'      => $url,
                'meta'     => $meta,
                'text'     => substr($textForChunks, 0, 5000),
                'contact'  => [
                    'emails'    => array_values($emails),
                    'phones'    => array_values($phones),
                    'addresses' => array_values($addresses),
                ],
                'links'    => array_values($links),
                'images'   => array_values($images),
                'products' => array_values($products),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}