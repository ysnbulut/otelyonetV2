<?php

namespace App\Providers;

use App\Models\BookingRoom;
use App\Models\Season;
use App\Models\Tenant;
use App\Models\UnitPrice;
use App\Observers\BookingRoomObserver;
use App\Observers\SeasonObserver;
use App\Observers\TenantObserver;
use App\Observers\UnitPriceObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    protected $observers = [
        Tenant::class => [TenantObserver::class],
        UnitPrice::class => [UnitPriceObserver::class],
        BookingRoom::class => [BookingRoomObserver::class],
//        Booking::class => [BookingObserver::class],
        Season::class => [SeasonObserver::class],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
