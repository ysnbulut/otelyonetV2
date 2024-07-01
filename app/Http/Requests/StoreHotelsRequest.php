<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHotelsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['nullable', 'in:active,suspend,closed'], // 'active', 'suspend', 'closed
            'name' => ['required', 'string', 'max:255'],
            'subdomain' => ['required', 'string', 'max:255', 'unique:domains,domain'],
            'register_date' => ['required', 'date', 'date_format:d.m.Y', 'before:renew_date'],
            'renew_date' => ['required', 'date', 'date_format:d.m.Y', 'after:register_date'],
            'price' => ['required', 'numeric', 'min:0'],
            'renew_price' => ['required', 'numeric', 'min:0'],
            'title' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'province_id' => ['nullable', 'exists:provinces,id'],
            'district_id' => ['nullable', 'exists:districts,id'],
            'location' => ['nullable', 'string', 'max:150'],
            'tax_office_id' => ['nullable', 'exists:tax_offices,id'],
            'tax_number' => ['nullable', 'string', 'max:12'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Durum geçerli bir durum olmalıdır',
            'name.required' => 'Otel adı zorunludur',
            'name.string' => 'Otel adı metin olmalıdır',
            'name.max' => 'Otel adı en fazla 255 karakter olmalıdır',
            'subdomain.required' => 'Alt alan adı zorunludur',
            'subdomain.string' => 'Alt alan adı metin olmalıdır',
            'subdomain.max' => 'Alt alan adı en fazla 255 karakter olmalıdır',
            'subdomain.unique' => 'Alt alan adı benzersiz olmalıdır',
            'register_date.required' => 'Kayıt tarihi zorunludur',
            'register_date.date' => 'Kayıt tarihi tarih olmalıdır',
            'register_date.date_format' => 'Kayıt tarihi d.m.Y formatında olmalıdır',
            'register_date.before' => 'Kayıt tarihi yenileme tarihinden önce olmalıdır',
            'renew_date.required' => 'Yenileme tarihi zorunludur',
            'renew_date.date' => 'Yenileme tarihi tarih olmalıdır',
            'renew_date.date_format' => 'Yenileme tarihi d.m.Y formatında olmalıdır',
            'renew_date.after' => 'Yenileme tarihi kayıt tarihinden sonra olmalıdır',
            'price.required' => 'Fiyat zorunludur',
            'price.numeric' => 'Fiyat sayı olmalıdır',
            'price.min' => 'Fiyat en az 0 olmalıdır',
            'renew_price.required' => 'Yenileme fiyatı zorunludur',
            'renew_price.numeric' => 'Yenileme fiyatı sayı olmalıdır',
            'renew_price.min' => 'Yenileme fiyatı en az 0 olmalıdır',
            'title.string' => 'Başlık metin olmalıdır',
            'title.max' => 'Başlık en fazla 255 karakter olmalıdır',
            'address.string' => 'Adres metin olmalıdır',
            'address.max' => 'Adres en fazla 255 karakter olmalıdır',
            'province_id.exists' => 'İl geçerli bir il olmalıdır',
            'district_id.exists' => 'İlçe geçerli bir ilçe olmalıdır',
            'location.string' => 'Konum metin olmalıdır',
            'location.max' => 'Konum en fazla 150 karakter olmalıdır',
            'tax_office_id.exists' => 'Vergi dairesi geçerli bir vergi dairesi olmalıdır',
            'tax_number.string' => 'Vergi numarası metin olmalıdır',
            'tax_number.max' => 'Vergi numarası en fazla 12 karakter olmalıdır',
            'phone.string' => 'Telefon metin olmalıdır',
            'phone.max' => 'Telefon en fazla 255 karakter olmalıdır',
            'email.string' => 'E-posta metin olmalıdır',
            'email.email' => 'E-posta geçerli bir e-posta adresi olmalıdır',
            'email.max' => 'E-posta en fazla 255 karakter olmalıdır',
        ];
    }
}
