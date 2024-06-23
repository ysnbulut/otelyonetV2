<?php

namespace App\Helpers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use JsonException;

class HotelRunnerApi
{
    protected Client $client;
    protected string $token;
    protected string $hr_id;

    public function __construct(string $token, string|int $hr_id)
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
     * @throws GuzzleException|JsonException
     */
    public function getRooms(): array
    {
        $response = $this->client->get('rooms', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
            ]
        ]);
        return json_decode($response->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws GuzzleException|JsonException
     */
    public function updateDailyRoomStock(string|int $inv_code, array $dates): array
    {
        $query = [
            'rooms' => [
                [
                    'inv_code' => 'HR:' . $inv_code,
                    //TODO : Bu kısım düzenlenecek
                    'channel_codes' => array_merge(collect($this->getChannelList()['channels'])->pluck('code')->toArray(), ['online']),
                    'dates' => $dates
                ]
            ]
        ];
        $response = $this->client->put('rooms/daily', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
            ],
            'body' => json_encode($query, JSON_THROW_ON_ERROR)
        ]);
        return json_decode($response->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws GuzzleException|JsonException
     */
    public function getChannelList(): mixed
    {
        $response = $this->client->get('infos/connected_channels', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
            ]
        ]);
        return json_decode($response->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws GuzzleException
     * @throws JsonException
     */
    public function updateRoomDateRange(string|int $room_id, string $start_date, string $end_date, string|int|float|bool $price, string $channel_codes): array
    {
        $query = [
            'token' => $this->token,
            'hr_id' => $this->hr_id,
            'room_code' => 'HR:' . $room_id,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'price' => $price,
            'channel_codes[]' => $channel_codes
        ];
        $response = $this->client->put('rooms/~', [
            'query' => $query
        ]);
        return json_decode($response->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws GuzzleException|JsonException
     */
    public function getReservations(): mixed
    {
        $response = $this->client->get('reservations', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
                // TODO: Bu kısım yazılmalı sonra
//                'from_date' => 'YYYY-MM-DD',
//                'from_last_update_date' => 'YYYY-MM-DD',
//                'per_page' => 100,
//                'page' => 1,
//                'reservation_number' => '',
                'undelivered' => true,
//                'modified' => false,
//                'booked' => false,
            ]
        ]);
        return json_decode($response->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws GuzzleException|JsonException
     */
    public function getTransactionDetails(string $transaction_id): array
    {
        $response = $this->client->get('transaction_details', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
                'transaction_id' => $transaction_id
            ]
        ]);
        return json_decode($response->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws GuzzleException
     * @throws JsonException
     */
    public function confirmReservation(string $message_uid, string $booking_code): array
    {
        $response = $this->client->put('reservations/~', [
            'query' => [
                'token' => $this->token,
                'hr_id' => $this->hr_id,
                'message_uid' => $message_uid,
                'pms_number' => $booking_code
            ]
        ]);
        return json_decode($response->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
    }
}