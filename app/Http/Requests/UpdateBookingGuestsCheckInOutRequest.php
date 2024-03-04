<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingGuestsCheckInOutRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'booking_guests' => ['required', 'array', 'exists:booking_guests,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
