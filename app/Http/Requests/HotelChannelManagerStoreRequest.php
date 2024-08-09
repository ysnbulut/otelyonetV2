<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HotelChannelManagerStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'channel_manager' => 'required',
            'api_hr_id' => ['nullable', 'required_unless:channel_manager,closed'],
            'api_token' => ['nullable', 'required_unless:channel_manager,closed'],
            'kbs' => 'required',
            'TssKod' => ['nullable', 'required_unless:kbs,closed'],
            'KullaniciTC' => ['nullable', 'required_unless:kbs,closed'],
            'Sifre' => ['nullable', 'required_unless:kbs,closed'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}