<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TypeHasViewRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'view_id' => 'required|exists:room_views,id',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
