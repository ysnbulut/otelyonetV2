<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomTypeFeatureRequest extends FormRequest
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
			'name' => ['required', 'string', 'max:255', 'unique:room_type_features'],
            'is_paid' => ['required', 'boolean'],
		];
	}

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Olanak adı gerekli.',
            'name.string' => 'Olanak adı metin olmalı.',
            'name.max' => 'Olanak adı en fazla 255 karakter olmalı.',
            'name.unique' => 'Olanak adı daha önce kullanılmış.',
            'is_paid.required' => 'Ücretli olup olmadığı gerekli.',
            'is_paid.boolean' => 'Ücretli olup olmadığı doğru formatta değil.',
        ];
    }
}
