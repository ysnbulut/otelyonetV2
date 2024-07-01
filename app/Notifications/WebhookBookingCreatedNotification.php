<?php

namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class WebhookBookingCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
    }

    public function via($notifiable): array
    {
        return [PusherChannel::class];
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->web()
            ->title('Test')
            ->body("Bu Bir Test!");
    }
}
