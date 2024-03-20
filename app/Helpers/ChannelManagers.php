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
}