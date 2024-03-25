<?php

namespace App\Helpers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class HotelRunnerApi
{
    protected Client $client;
    protected string $token;
    protected string $hr_id;

    public function __construct($token, $hr_id)
    {
        $this->token = $token;
        $this->hr_id = $hr_id;
        $this->client = new Client([
                'base_uri' => 'https://app.hotelrunner.com/api/v2/apps/',
                'headers' => [
                    'content-type' => 'application/json',
                    'cache-control' => 'no-cache',
                ],
            ]
        );
    }

    /**
     * @throws GuzzleException
     */
    public function getRooms()
    {
        $response = $this->client->get('rooms', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
            ]
        ]);
        return json_decode($response->getBody()->getContents());
    }

    public function updateDailyRoomStock($inv_code, array $dates) {
        $query = [
            'rooms' => [
                [
                    'inv_code' => 'HR:'.$inv_code,
                    'dates' => $dates
                ]
            ]
        ];
        $response = $this->client->put('rooms/daily', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
            ],
            'body' => json_encode($query)
        ]);
        return json_decode($response->getBody()->getContents());
    }

    public function updateRoomDateRange($room_id, $start_date, $end_date, $price)
    {
        $query = [
            'token' => $this->token,
            'hr_id' => $this->hr_id,
            'room_code' => 'HR:' . $room_id,
            'start_date' => $start_date,
            'end_date' => $end_date,
            $query['price'] = $price
        ];
        $response = $this->client->put('rooms/~', [
            'query' => $query
        ]);
        return json_decode($response->getBody()->getContents());
    }

    public function getReservations(): mixed
    {
        $response = $this->client->get('reservations', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
//                'from_date' => 'YYYY-MM-DD',
//                'from_last_update_date' => 'YYYY-MM-DD',
//                'per_page' => 100,
//                'page' => 1,
//                'reservation_number' => '',
//                'undelivered' => true,
//                'modified' => false,
//                'booked' => false,
            ]
        ]);
        return json_decode($response->getBody()->getContents());
    }
}