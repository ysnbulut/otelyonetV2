<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WebHookRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'data' => 'required|json',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'data.required' => 'Data is required',
            'data.json' => 'Data must be a valid JSON string',
        ];
    }
}
