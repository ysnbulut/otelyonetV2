<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomViewRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function rules(): array
	{
		return [
			'name' => ['required', 'string', 'max:255', 'unique:room_views,name,' . $this->room_view->id],
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
			'name.required' => 'Oda görünümü adı gereklidir.',
			'name.string' => 'Oda görünümü adı metin olmalıdır.',
			'name.max' => 'Oda görünümü adı en fazla 255 karakter olmalıdır.',
			'name.unique' => 'Oda görünümü adı benzersiz olmalıdır.',
			'description.string' => 'Açıklama metin olmalıdır.',
			'description.max' => 'Açıklama en fazla 255 karakter olmalıdır.',
		];
	}
}
