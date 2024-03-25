<?php

namespace App\Helpers;
use App\Helpers\HotelRunnerApi;

class ChannelManagers
{
    protected HotelRunnerApi $channelManagerApi;
    public function __construct($channel_manager, array $options = [])
    {
        if($channel_manager == 'hotelrunner') {
            $this->channelManagerApi = new HotelRunnerApi($options['token'], $options['hr_id']);
        }
    }

    public function getRooms()
    {
        return $this->channelManagerApi->getRooms();
    }

    public function updateDailyRoomStock($room_code, array $dates)
    {
        return $this->channelManagerApi->updateDailyRoomStock($room_code, $dates);
    }

    public function updateRoomDateRange($room_code, $start_date, $end_date, $price = false, $availability = false)
    {
        return $this->channelManagerApi->updateRoomDateRange($room_code, $start_date, $end_date, $price, $availability);
    }

    public function getReservations(): mixed
    {
        return $this->channelManagerApi->getReservations();
    }
}