<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompressResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Don't compress if content is already encoded
        if ($response->headers->has('Content-Encoding')) {
            return $response;
        }

        $content = $response->getContent();
        
        // Only compress if content is over 1KB (to avoid overhead for tiny responses)
        if (!is_string($content) || strlen($content) <= 1024) {
            return $response;
        }
        
        // Check if the response is a type we want to compress
        $contentType = $response->headers->get('Content-Type');
        if (!$this->shouldCompress($contentType)) {
            return $response;
        }
        
        // Check accepted encoding methods
        $acceptEncoding = $request->header('Accept-Encoding', '');
        
        // Use gzip compression - built into PHP
        if (strpos($acceptEncoding, 'gzip') !== false) {
            $compressed = gzencode($content, 9); // Maximum compression
            
            if ($compressed && strlen($compressed) < strlen($content)) {
                $response->setContent($compressed);
                $response->headers->add([
                    'Content-Encoding' => 'gzip',
                    'X-Compression-Applied' => 'gzip',
                    'Vary' => 'Accept-Encoding'
                ]);
                
                return $response;
            }
        }
        
        // Try deflate as fallback - also built into PHP
        if (strpos($acceptEncoding, 'deflate') !== false) {
            $compressed = gzdeflate($content, 9); // Maximum compression
            
            if ($compressed && strlen($compressed) < strlen($content)) {
                $response->setContent($compressed);
                $response->headers->add([
                    'Content-Encoding' => 'deflate',
                    'X-Compression-Applied' => 'deflate',
                    'Vary' => 'Accept-Encoding'
                ]);
            }
        }

        return $response;
    }

    /**
     * Determine if the content type should be compressed.
     */
    protected function shouldCompress(?string $contentType): bool
    {
        if (!$contentType) {
            return false;
        }

        // List of content types to compress
        $compressibleTypes = [
            'text/html',
            'text/plain',
            'text/css',
            'text/javascript',
            'application/javascript',
            'application/json',
            'application/xml',
            'application/xhtml+xml',
            'image/svg+xml',
            'application/rss+xml',
            'application/atom+xml',
            'application/ld+json',
            'application/manifest+json',
            'font/ttf',
            'font/otf',
            'font/eot',
            'font/woff',
            'font/woff2',
        ];

        foreach ($compressibleTypes as $type) {
            if (str_contains($contentType, $type)) {
                return true;
            }
        }

        return false;
    }
}