<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomTypeRequest extends FormRequest
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
			'name' => ['required', 'string', 'max:255', Rule::unique('room_types', 'name')
				->ignore($this->route('room_type'))
				->whereNull('deleted_at')],
			'description' => ['nullable', 'string', 'max:255'],
			'size' => ['required', 'integer', 'min:1'],
			'adult_capacity' => ['required', 'integer', 'min:1'],
			'child_capacity' => ['required', 'integer', 'min:0'],
			'room_count' => ['required', 'integer', 'min:1'],
//			'room_type_views' => ['required', 'array'],
//			'room_type_views.*' => ['required', 'integer', 'exists:room_views,id'],
            'room_type_features' => ['nullable', 'array'],
            'room_type_features.*.feature_id' => ['integer','exists:room_type_features,id'],
            'room_type_features.*.order_no' => ['integer', 'min:1'],
//			'bed_types' => ['required', 'array'],
//			'bed_types.*.bed_type_id' => ['required', 'integer', 'exists:bed_types,id'],
//			'bed_types.*.count' => ['required', 'integer', 'min:1'],
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
			'name.required' => 'Oda türü adı gereklidir.',
			'name.string' => 'Oda türü adı metin olmalıdır.',
			'name.max' => 'Oda türü adı en fazla 255 karakter olmalıdır.',
			'name.unique' => 'Oda türü adı benzersiz olmalıdır.',
			'description.string' => 'Açıklama metin olmalıdır.',
			'description.max' => 'Açıklama en fazla 255 karakter olmalıdır.',
			'size.required' => 'Oda boyutu gereklidir.',
			'size.integer' => 'Oda boyutu tam sayı olmalıdır.',
			'size.min' => 'Oda boyutu en az 10m2 olmalıdır.',
			'adult_capacity.required' => 'Oda kapasitesi gereklidir.',
			'adult_capacity.integer' => 'Oda kapasitesi tam sayı olmalıdır.',
			'adult_capacity.min' => 'Oda kapasitesi en az 1 olmalıdır.',
			'child_capacity.required' => 'Çocuk kapasitesi gereklidir.',
			'child_capacity.integer' => 'Çocuk kapasitesi tam sayı olmalıdır.',
			'child_capacity.min' => 'Çocuk kapasitesi en az 0 olmalıdır.',
			'room_count.required' => 'Oda sayısı gereklidir.',
			'room_count.integer' => 'Oda sayısı tam sayı olmalıdır.',
			'room_count.min' => 'Oda sayısı en az 1 olmalıdır.',
//			'room_type_views.required' => 'Oda manzaraları gereklidir.',
//			'room_type_views.array' => 'Oda manzaraları dizi olmalıdır.',
//			'room_type_views.*.required' => 'Oda manzarası gereklidir.',
//			'room_type_views.*.integer' => 'Oda manzarası tam sayı olmalıdır.',
//			'room_type_views.*.exists' => 'Oda manzarası geçersiz.',
            'room_type_features.array' => 'Oda özellikleri dizi olmalıdır.',
            'room_type_features.*.feature_id.exists' => 'Oda özelliği geçersiz.',
            'room_type_features.*.order_no.integer' => 'Oda özelliği sıra numarası sayı olmalıdır.',
//			'bed_types.required' => 'Yatak türleri gereklidir.',
//			'bed_types.array' => 'Yatak türleri dizi olmalıdır.',
//			'bed_types.*.bed_type_id.required' => 'Yatak türü gereklidir.',
//			'bed_types.*.bed_type_id.integer' => 'Yatak türü tam sayı olmalıdır.',
//			'bed_types.*.bed_type_id.exists' => 'Yatak türü geçersiz.',
//			'bed_types.*.count.required' => 'Yatak sayısı gereklidir.',
//			'bed_types.*.count.integer' => 'Yatak sayısı tam sayı olmalıdır.',
//			'bed_types.*.count.min' => 'Yatak sayısı en az 1 olmalıdır.',
		];
	}
}
