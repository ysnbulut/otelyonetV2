<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBedTypeRequest extends FormRequest
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
			'name' => ['required', 'string', 'max:255', 'unique:bed_types,name'],
			'person_num' => ['required', 'integer', 'min:1'],
			'description' => ['nullable', 'string', 'max:255'],
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
            'name.required' => 'Yatak tipi adı gereklidir',
            'name.string' => 'Yatak tipi adı metin olmalıdır',
            'name.max' => 'Yatak tipi adı en fazla 255 karakter olmalıdır',
            'name.unique' => 'Yatak tipi adı daha önce kullanılmış',
            'person_num.required' => 'Kişi sayısı gereklidir',
            'person_num.integer' => 'Kişi sayısı tam sayı olmalıdır',
            'person_num.min' => 'Kişi sayısı en az 1 olmalıdır',
            'description.string' => 'Açıklama metin olmalıdır',
            'description.max' => 'Açıklama en fazla 255 karakter olmalıdır',
        ];
    }
}
