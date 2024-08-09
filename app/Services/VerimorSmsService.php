<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class VerimorSmsService
{
    protected $username;
    protected $password;
    protected $sourceAddr;

    public function __construct()
    {
        $this->username = config('services.verimor.username');
        $this->password = config('services.verimor.password');
        $this->sourceAddr = config('services.verimor.source_addr');
    }

    public function sendSms($to, $message, $params = [])
    {
        $data = [
            'username' => $this->username,
            'password' => $this->password,
            'custom_id' => $params['custom_id'] ?? null,
            'datacoding' => $params['datacoding'] ?? '0',
            'valid_for' => $params['valid_for'] ?? '48:00',
            'messages' => [
                [
                    'msg' => $message,
                    'dest' => $to
                ]
            ]
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post('https://sms.verimor.com.tr/v2/send.json', $data);

        return [
            'status' => $response->status(),
            'body' => $response->body()
        ];
    }
}
