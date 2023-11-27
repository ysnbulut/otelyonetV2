<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoomViewRequest extends FormRequest
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
   'name' => ['required', 'string', 'max:255', Rule::unique('room_views')->where(function ($query) {
	   return $query->whereNull('deleted_at');
   }),],
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
   'name.required' => 'Oda manzarası adı gereklidir.',
   'name.string' => 'Oda manzarası adı metin olmalıdır.',
   'name.max' => 'Oda manzarası adı en fazla 255 karakter olmalıdır.',
   'name.unique' => 'Oda manzarası adı benzersiz olmalıdır.',
   'description.string' => 'Açıklama metin olmalıdır.',
   'description.max' => 'Açıklama en fazla 255 karakter olmalıdır.',
  ];
 }
}
