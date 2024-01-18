<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TypeHasBedsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'bed_type_id' => 'sometimes|exists:bed_types,id',
            'count' => 'required|integer|min:1',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
