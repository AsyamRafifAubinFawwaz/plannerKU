<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AttachmentService
{
    /**
     * Upload dan validasi foto tugas berdasarkan plan user.
     */
    public function uploadTaskPhotos(User $user, array|UploadedFile $files): array
    {
        // Pastikan formatnya array
        if (!is_array($files)) {
            $files = [$files];
        }

        $isPro = $user->isPro();
        $maxFiles = $isPro ? 3 : 1;
        $maxSizeKB = $isPro ? 5120 : 2048; // 5MB vs 2MB

        // 1. Validasi jumlah file
        if (count($files) > $maxFiles) {
            throw ValidationException::withMessages([
                'attachments' => "Plan kamu hanya mendukung maksimal {$maxFiles} foto per tugas."
            ]);
        }

        $paths = [];

        // 2. Validasi & Upload tiap file
        foreach ($files as $file) {
            $sizeKB = $file->getSize() / 1024;

            if ($sizeKB > $maxSizeKB) {
                throw ValidationException::withMessages([
                    'attachments' => "Ukuran foto maksimal adalah " . ($maxSizeKB / 1024) . "MB."
                ]);
            }

            // Simpan ke disk 'public' di folder 'tasks'
            $paths[] = $file->store('tasks', 'public');
        }

        return $paths;
    }

    /**
     * Hapus file foto dari storage saat tugas dihapus.
     */
    public function deletePhotos(?array $paths): void
    {
        if (empty($paths)) return;

        foreach ($paths as $path) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }
}
