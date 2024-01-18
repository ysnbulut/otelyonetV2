<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
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
//			'building_id' => ['required', 'integer', 'exists:buildings,id'], // 'exists:table,column
//			'floor_id' => ['required', 'integer', 'exists:floors,id'],
			'type_has_view_id' => ['required', 'integer', 'exists:type_has_views,id'],
			'name' => ['required', 'string', 'max:255'],
//			'description' => ['required', 'string', 'max:255'],
//			'is_clean' => ['required', 'boolean', 'in:0,1'],
//			'status' => ['required', 'boolean', 'in:0,1'],
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
//			'building_id.required' => 'Bina gerekli.',
//			'building_id.integer' => 'Bina geçerli değil.',
//			'building_id.exists' => 'Bina geçerli değil.',
//			'floor_id.required' => 'Kat gerekli.',
//			'floor_id.integer' => 'Kat geçerli değil.',
//			'floor_id.exists' => 'Kat geçerli değil.',
			'type_has_view_id.required' => 'Oda tipi gerekli.',
			'type_has_view_id.integer' => 'Oda tipi geçerli değil.',
			'type_has_view_id.exists' => 'Oda tipi geçerli değil.',
			'name.required' => 'Oda adı gerekli.',
			'name.string' => 'Oda adı geçerli değil.',
			'name.max' => 'Oda adı en fazla 255 karakter olabilir.',
//			'description.string' => 'Açıklama geçerli değil.',
//			'description.max' => 'Açıklama en fazla 255 karakter olabilir.',
//			'is_clean.required' => 'Temizlik gerekli.',
//			'is_clean.boolean' => 'Temizlik geçerli değil.',
//			'is_clean.in' => 'Temizlik geçerli değil.',
//			'status.required' => 'Durum gerekli.',
//			'status.boolean' => 'Durum geçerli değil.',
//			'status.in' => 'Durum geçerli değil.',
		];
	}
}
