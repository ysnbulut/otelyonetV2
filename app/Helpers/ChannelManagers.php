<?php

namespace App\Helpers;

use GuzzleHttp\Exception\GuzzleException;
use JsonException;

class ChannelManagers
{
    protected HotelRunnerApi $channelManagerApi;

    public function __construct(string $channel_manager, array $options = [])
    {
        if ($channel_manager == 'hotelrunner') {
            $this->channelManagerApi = new HotelRunnerApi($options['token'], $options['hr_id']);
        }
    }

    /**
     * @throws GuzzleException
     */
    public function getRooms(): array
    {
        return $this->channelManagerApi->getRooms();
    }

    /**
     * @throws GuzzleException
     */
    public function updateDailyRoomStock(string|int $room_code, array $dates): array
    {
        return $this->channelManagerApi->updateDailyRoomStock($room_code, $dates);
    }

    /**
     * @throws GuzzleException
     * @throws JsonException
     */
    public function updateRoomDateRange(string|int $room_code, string $start_date, string $end_date, string|int|float|bool $price, array $channel_codes):
    array
    {
        return $this->channelManagerApi->updateRoomDateRange($room_code, $start_date, $end_date, $price, $channel_codes);
    }

    /**
     * @throws GuzzleException
     */
    public function getReservations(): array
    {
        return $this->channelManagerApi->getReservations();
    }

    /**
     * @throws GuzzleException
     */
    public function getChannelList(): array
    {
        return $this->channelManagerApi->getChannelList();
    }

    /**
     * @throws GuzzleException
     */
    public function getTransactionDetails(string|int $transaction_id): array
    {
        return $this->channelManagerApi->getTransactionDetails($transaction_id);
    }

    public function confirmReservation(string $message_uid, string $booking_code): array
    {
        return $this->channelManagerApi->confirmReservation($message_uid, $booking_code);
    }
}