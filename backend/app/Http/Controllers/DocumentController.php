<?php

namespace App\Http\Controllers;
use App\Services\TextChunkService;
use App\Services\EmbeddingService;
use Smalot\PdfParser\Parser;
use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\Chunk;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class DocumentController extends Controller
{
    public function loadDocs(){
        $user=Auth::user();
        $docs=Document::where('user_id',$user->id)
        ->get();
        return response()->json([
            'docs'=>$docs
        ]);
    }
    public function upload(Request $request,TextChunkService $chunkService,EmbeddingService $embeddingService){
        $user=Auth::user();
        $request->validate([
            'file'=>'required|file|mimes:pdf,txt,doc'
        ]);
        $file=$request->file('file');
        $path=$file->store('documents', 'local');
        $document=Document::create([
            'name'=>$file->getClientOriginalName(),
            'user_id'=>$user->id,
            'path'=>$path,
            'type'=>$file->getClientMimeType(),
            'size'=>$file->getSize(),
            'status' => 'indexed',

        ]);
        $fullPath = Storage::disk('local')->path($path);
        $extension = $file->getClientOriginalExtension();
        $text = match ($extension) {
            'txt' => Storage::disk('local')->get($path),

            'pdf' => (new Parser())
                ->parseFile($fullPath)
                ->getText(),

            default => throw new \Exception("Unsupported file type"),
        };
        logger()->info('Extracted text:', [
    'length' => strlen($text),
    'preview' => substr($text, 0, 500),
]);
        $chunks=$chunkService->chunkText($text);
        foreach($chunks as $chunk){
            $embedding=$embeddingService->embed($chunk);
            Chunk::create([
                'document_id'=>$document->id,
                'content'=>$chunk,
                'embedding'=>'[' . implode(',', $embedding) . ']', 
            ]);
        }
       
        return response()->json([
            'message'=>'Uploaded successfully',
            'document' => $document
        ]);

    }
}
