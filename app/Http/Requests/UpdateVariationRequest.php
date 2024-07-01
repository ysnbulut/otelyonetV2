<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVariationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'room_type_id' => 'required|exists:room_types,id',
            'variation_id' => 'required|exists:variations_of_guests_room_types,id',
            'multiplier' => 'required|numeric|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'type_id.required' => 'Oda Tipi Gerekli.',
            'type_id.exists' => 'Oda Tipi Bulunamadı.',
            'variation_id.required' => 'Varyasyon Gerekli.',
            'variation_id.exists' => 'Varyasyon Bulunamadı.',
            'multiplier.required' => 'Çarpan Gerekli.',
            'multiplier.numeric' => 'Çarpan Sayı Olmalı.',
            'multiplier.min' => 'Çarpan 1\'den Büyük Olmalı.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
