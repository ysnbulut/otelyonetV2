<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomTypePhotoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'image' => 'required|image|max:1024',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
