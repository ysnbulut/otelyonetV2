<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
   'name' => 'required|string|regex:/^[\pL\s\-]+$/u|min:3|max:50',
   'email' => ['required', 'string', 'email', 'max:150', 'unique:users,email,' . $this->user->id],
   'password' => 'nullable|string|min:6|confirmed',
   'role' => 'required|integer|exists:roles,id',
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
   'name.required' => 'Ad Soyad zorunludur.',
   'name.string' => 'Ad Soyad metin tipinde olmalıdır.',
   'name.regex' => 'Ad Soyad sadece harflerden oluşmalıdır.',
   'name.min' => 'Ad Soyad en az 3 karakter olmalıdır.',
   'name.max' => 'Ad Soyad en fazla 255 karakter olmalıdır.',
   'email.required' => 'E-posta alanı zorunludur.',
   'email.string' => 'E-posta alanı metin tipinde olmalıdır.',
   'email.email' => 'E-posta alanı e-posta formatında olmalıdır.',
   'email.max' => 'E-posta alanı en fazla 255 karakter olmalıdır.',
   'email.unique' => 'Bu e-posta adresi zaten kayıtlıdır.',
   'password.required' => 'Şifre alanı zorunludur.',
   'password.string' => 'Şifre alanı metin tipinde olmalıdır.',
   'password.min' => 'Şifre alanı en az 6 karakter olmalıdır.',
   'password.confirmed' => 'Şifre alanı ile şifre tekrar alanı eşleşmiyor.',
   'role.required' => 'Rol alanı zorunludur.',
   'role.integer' => 'Rol alanı tamsayı tipinde olmalıdır.',
   'role.exists' => 'Seçilen rol sistemde bulunmuyor.',
  ];
 }
}
