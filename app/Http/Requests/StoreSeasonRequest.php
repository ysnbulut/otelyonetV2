<?php

namespace App\Http\Requests;

use App\Rules\AtLeastOneTrueRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSeasonRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $atLeastOneTrueRule = new AtLeastOneTrueRule(['channels', 'web', 'agency', 'reception'], $this->all());

        return [
            'uid' => 'required|string|max:20',
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'channels' => ['required', 'boolean', $atLeastOneTrueRule],
            'web' => ['required', 'boolean', $atLeastOneTrueRule],
            'agency' => ['required', 'boolean', $atLeastOneTrueRule],
            'reception' => ['required', 'boolean', $atLeastOneTrueRule],
        ];
    }

    public function messages(): array
    {
        return [
            'uid.required' => 'UID alanı zorunludur.',
            'uid.string' => 'UID alanı metin tipinde olmalıdır.',
            'uid.max' => 'UID alanı en fazla 20 karakter olmalıdır.',
            'name.required' => 'Sezon Adı zorunludur.',
            'name.string' => 'Sezon Adı metin tipinde olmalıdır.',
            'name.max' => 'Sezon Adı en fazla 255 karakter olmalıdır.',
            'description.string' => 'Sezon Açıklaması metin tipinde olmalıdır.',
            'description.max' => 'Sezon Açıklaması en fazla 255 karakter olmalıdır.',
            'start_date.required' => 'Sezon Başlangıç tarihi zorunludur.',
            'start_date.date' => 'Sezon Başlangıç tarihi tarih tipinde olmalıdır.',
            'end_date.required' => 'Sezon Bitiş tarihi zorunludur.',
            'end_date.date' => 'Sezon Bitiş tarihi tarih tipinde olmalıdır.',
            'end_date.after_or_equal' => 'Sezon Bitiş tarihi Sezon Başlangıç tarihinden sonra veya aynı olmalıdır.',
            'channels' => 'En az bir seçenek seçilmelidir.',
            'web' => 'En az bir seçenek seçilmelidir.',
            'agency' => 'En az bir seçenek seçilmelidir.',
            'reception' => 'En az bir seçenek seçilmelidir.',
        ];
    }
}
