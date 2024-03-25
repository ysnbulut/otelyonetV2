<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class HotelChannelManagerStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'channel_manager' => 'required',
            'api_hr_id' => ['nullable', 'required_if:channel_manager,!=,closed'],
            'api_token' => ['nullable', 'required_if:channel_manager,!=,closed'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
