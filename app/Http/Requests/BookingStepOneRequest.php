<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingStepOneRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'booking_type' => 'required|string|in:normal,open,group',
            'number_of_adults' => 'required_if:booking_type,normal,open|integer|min:1',
            'number_of_children' => 'required_if:booking_type,normal,open|integer|min:0',
            'children_ages' => [
                'required_if:number_of_children,>0',
                'array',
            ],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
