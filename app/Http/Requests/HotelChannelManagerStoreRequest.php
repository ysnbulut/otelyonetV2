<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class HotelChannelManagerStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'channel_manager' => 'required',
            'api_hr_id' => 'required',
            'api_token' => 'required',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
