<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingGuestsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'booking_room_id' => 'required|integer|exists:booking_rooms,id',
            'guests.*.name' => 'required|string',
            'guests.*.surname' => 'required|string',
            'guests.*.birthday' => 'required|date|before:today|after:1900-01-01',
            'guests.*.gender' => 'required|string|in:male,female',
            'guests.*.citizen_id' => 'required|integer|exists:citizens,id',
            'guests.*.identification_number' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'booking_room_id.required' => 'Oda numarası gereklidir',
            'booking_room_id.integer' => 'Oda numarası geçerli bir sayı olmalıdır',
            'booking_room_id.exists' => 'Oda numarası geçerli bir oda numarası olmalıdır',
            'guests.*.name.required' => 'Adı gereklidir',
            'guests.*.surname.required' => 'Soyadı gereklidir',
            'guests.*.birthday.required' => 'Doğum tarihi gereklidir',
            'guests.*.birthday.before' => 'Doğum tarihi bugünden önce olmalıdır',
            'guests.*.birthday.after' => 'Doğum tarihi 1900-01-01 tarihinden sonra olmalıdır',
            'guests.*.birthday.date' => 'Doğum tarihi geçerli bir tarih olmalıdır',
            'guests.*.gender.required' => 'Cinsiyet gereklidir',
            'guests.*.citizen_id.required' => 'Uyruk gereklidir',
            'guests.*.citizen_id.integer' => 'Uyruk geçerli bir sayı olmalıdır',
            'guests.*.citizen_id.exists' => 'Uyruk geçerli bir uyruk olmalıdır',
            'guests.*.identification_number' => 'Kimlik numarası gereklidir',
        ];
    }
}
