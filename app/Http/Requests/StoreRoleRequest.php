<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
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
   'name' => 'required|string|min:3|max:30|unique:roles,name',
   'permissions' => 'required|array|exists:permissions,name',
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
   'name.required' => 'Rol adı gereklidir',
   'name.string' => 'Rol adı bir metin olmalıdır',
   'name.min' => 'Rol adı en az 3 karakter olmalıdır',
   'name.max' => 'Rol adı en fazla 30 karakter olmalıdır',
   'name.unique' => 'Rol adı daha önce kullanılmış',
   'permissions.required' => 'En az bir yetki seçilmelidir',
   'permissions.array' => 'Yetkiler bir dizi olmalıdır',
   'permissions.exists' => 'Seçilen yetkilerden bazıları geçersiz',
  ];
 }
}
