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

}