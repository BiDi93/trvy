<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public function upload(UploadedFile $file, string $folder): string
    {
        if (config('filesystems.default') === 'cloudinary') {
            return $this->uploadToCloudinary($file, $folder);
        }

        return Storage::disk('public')->put($folder, $file);
    }

    public function delete(?string $path): void
    {
        if (!$path) return;

        if (str_starts_with($path, 'http')) {
            // Cloudinary URL — extract public_id and delete
            $publicId = $this->extractCloudinaryPublicId($path);
            if ($publicId) {
                $this->cloudinary()->uploadApi()->destroy($publicId);
            }
            return;
        }

        Storage::disk('public')->delete($path);
    }

    private function uploadToCloudinary(UploadedFile $file, string $folder): string
    {
        $result = $this->cloudinary()->uploadApi()->upload($file->getRealPath(), [
            'folder'         => 'trvy/' . $folder,
            'resource_type'  => 'auto',
        ]);

        return $result['secure_url'];
    }

    private function cloudinary(): Cloudinary
    {
        return new Cloudinary([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key'    => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
            ],
            'url' => ['secure' => true],
        ]);
    }

    private function extractCloudinaryPublicId(string $url): ?string
    {
        // e.g. https://res.cloudinary.com/demo/image/upload/v123/trvy/avatars/file.jpg
        // → trvy/avatars/file
        if (!str_contains($url, 'cloudinary.com')) return null;

        preg_match('/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/', $url, $matches);
        return $matches[1] ?? null;
    }
}
