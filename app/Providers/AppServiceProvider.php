<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Intervention\Image\ImageManager;
use Plank\Mediable\Facades\ImageManipulator;
use Plank\Mediable\ImageManipulation;
use Intervention\Image\Image;
use Intervention\Image\Drivers\Gd\Driver;
use Plank\Mediable\Media;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            ImageManager::class,
            function() {
                 return new ImageManager(Driver::class);
            }
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ImageManipulator::defineVariant(
            'small',
            ImageManipulation::make(function (Image $image, Media $originalMedia) {
                $image->scaleDown(250);
            })->outputPngFormat()->makePublic(),
        );

        ImageManipulator::defineVariant(
            'medium',
            ImageManipulation::make(function (Image $image, Media $originalMedia) {
                $image->scaleDown(500);
            })->outputPngFormat()->makePublic()
        );

        ImageManipulator::defineVariant(
            'large',
            ImageManipulation::make(function (Image $image, Media $originalMedia) {
                $image->scaleDown(1000);
            })->outputPngFormat()->makePublic()
        );
    }
}
