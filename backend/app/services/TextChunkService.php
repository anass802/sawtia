<?php
namespace App\Services;


class TextChunkService{

    public function chunkText(string $text, int $maxword=800,int $overlap=100){
        $paragraphs=preg_split('/\n\s*\n/',$text);
        $chunks=[];
        $currentChunk='';
        foreach($paragraphs as $paragraph){
            $currentWords=str_word_count($currentChunk);
            $paragraphWords=str_word_count($paragraph);
            if($currentWords + $paragraphWords <= $maxword){
                $currentChunk .= "\n\n" .trim($paragraph);
            }else{
                $chunks[]=trim($currentChunk);
                $words = str_word_count($currentChunk, 1);
                $overlapWords = array_slice($words, -$overlap);

                $currentChunk = implode(' ', $overlapWords);
                $currentChunk .= "\n\n" . trim($paragraph);
            }
        }
        if (!empty(trim($currentChunk))) {
            $chunks[] = trim($currentChunk);
        }

        return $chunks;
    }
}
