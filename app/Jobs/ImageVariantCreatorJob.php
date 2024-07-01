<?php

namespace App\Jobs;

use App\Models\BookingRoom;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Plank\Mediable\Facades\ImageManipulator;
use Plank\Mediable\Media;

class ImageVariantCreatorJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $maxException = 3;

    public int $timeout = 600;

    public int $backoff = 300;

    public Media $media;

    public int $uniqueFor = 900;


    public function uniqueId(): string
    {
        return $this->media->id;
    }
    public function __construct(Media $media)
    {
        $this->media = $media;
    }

    public function handle(): void
    {
        ImageManipulator::createImageVariant($this->media, 'small');
        ImageManipulator::createImageVariant($this->media, 'medium');
        ImageManipulator::createImageVariant($this->media, 'large');
    }
}
