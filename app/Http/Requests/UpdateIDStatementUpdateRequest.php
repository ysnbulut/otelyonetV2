<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIDStatementUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'booking_room_id' => ['required', 'exists:booking_rooms,id'],
            'booking_guests' => ['required', 'array', 'exists:booking_guests,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'booking_room_id.required' => 'Booking room is required',
            'booking_room_id.exists' => 'Booking room does not exist',
            'booking_guests.required' => 'Booking guests are required',
            'booking_guests.array' => 'Booking guests must be an array',
            'booking_guests.exists' => 'Booking guests do not exist',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
