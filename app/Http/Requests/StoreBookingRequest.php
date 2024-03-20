<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'number_of_adults' => ['required', 'integer', 'min:1'],
            'number_of_children' => ['required', 'integer', 'min:0'],
            'children_ages' => ['nullable', 'array', 'min:0'],
            'checkin_required' => ['required', 'boolean'],
            'booking_result' => ['required', 'array'],
            'booking_result.check_in' => ['required', 'date', 'date_format:d.m.Y', 'after_or_equal:today'],
            'booking_result.check_out' => ['required', 'date', 'date_format:d.m.Y', 'after:booking_result.check_in'],
            'booking_result.night_count' => ['required', 'integer', 'min:1'],
            'booking_result.booking_type' => ['required', 'string'], //burda hata al
            'booking_result.number_of_adults_total' => ['required', 'integer', 'min:1'],
            'booking_result.number_of_children_total' => ['required', 'integer', 'min:0'],
            'booking_result.typed_rooms' => ['required', 'array'],
            'booking_result.typed_rooms.*' => ['required', 'array'],
            'booking_result.typed_rooms.*.id' => ['required', 'integer', 'exists:type_has_views,id'],
            'booking_result.typed_rooms.*.name' => ['required', 'string'],
            'booking_result.typed_rooms.*.count' => ['required', 'numeric', 'min:0'],
            'booking_result.typed_rooms.*.price' => ['required', 'numeric', 'min:0'],
            'booking_result.typed_rooms.*.total_price' => ['required', 'numeric', 'min:0'],
            'checked_rooms' => ['required', 'array'],
            'checked_rooms.*' => ['required', 'array', 'exists:rooms,id'],
            'grand_total' => ['required', 'numeric'],
            'discount' => ['required', 'numeric'],
            'customer_id' => ['required', 'exists:customers,id'],
            'rooms_guests' => ['required', 'array'],
            'rooms_guests.*' => ['required', 'array'],
            'rooms_guests.*.*' => ['required', 'array'],
            'rooms_guests.*.*.*.name' => ['nullable', 'string'],
            'rooms_guests.*.*.*.surname' => ['nullable', 'string'],
            'rooms_guests.*.*.*.birthday' => ['nullable', 'string'],
            'rooms_guests.*.*.*.citizen_id' => ['nullable', 'integer', 'exists:citizens,id'],
            'rooms_guests.*.*.*.gender' => ['nullable', 'string'],
            'rooms_guests.*.*.*.identification_number' => ['nullable', 'string'],

        ];
    }

    public function messages()
    {
        return [
            'number_of_adults.required' => 'Yetişkin sayısı zorunludur.',
            'number_of_adults.integer' => 'Yetişkin sayısı tam sayı olmalıdır.',
            'number_of_adults.min' => 'Yetişkin sayısı en az 1 olmalıdır.',
            'number_of_children.required' => 'Çocuk sayısı zorunludur.',
            'number_of_children.integer' => 'Çocuk sayısı tam sayı olmalıdır.',
            'number_of_children.min' => 'Çocuk sayısı en az 0 olmalıdır.',
            'children_ages.required' => 'Çocuk yaşları zorunludur.',
            'children_ages.array' => 'Çocuk yaşları dizi olmalıdır.',
            'children_ages.min' => 'Çocuk yaşları en az 0 olmalıdır.',
            'booking_result.check_in.required' => 'Check-in tarihi zorunludur.',
            'booking_result.check_in.date' => 'Check-in tarihi geçerli bir tarih olmalıdır.',
            'booking_result.check_in.date_format' => 'Check-in tarihi gün.ay.yıl formatında olmalıdır.',
            'booking_result.check_in.after_or_equal' => 'Check-in tarihi bugün veya bugünden sonraki bir tarih olmalıdır.',
            'booking_result.check_out.required' => 'Check-out tarihi zorunludur.',
            'booking_result.check_out.date' => 'Check-out tarihi geçerli bir tarih olmalıdır.',
            'booking_result.check_out.date_format' => 'Check-out tarihi gün.ay.yıl formatında olmalıdır.',
            'booking_result.check_out.after' => 'Check-out tarihi check-in tarihinden sonraki bir tarih olmalıdır.',
            'booking_result.night_count.required' => 'Gece sayısı zorunludur.',
            'booking_result.night_count.integer' => 'Gece sayısı tam sayı olmalıdır.',
            'booking_result.night_count.min' => 'Gece sayısı en az 1 olmalıdır.',
            'booking_result.booking_type.required' => 'Rezervasyon tipi zorunludur.',
            'booking_result.booking_type.string' => 'Rezervasyon tipi metin olmalıdır.',
            'booking_result.number_of_adults_total.required' => 'Toplam yetişkin sayısı zorunludur.',
            'booking_result.number_of_adults_total.integer' => 'Toplam yetişkin sayısı tam sayı olmalıdır.',
            'booking_result.number_of_adults_total.min' => 'Toplam yetişkin sayısı en az 1 olmalıdır.',
            'booking_result.number_of_children_total.required' => 'Toplam çocuk sayısı zorunludur.',
            'booking_result.number_of_children_total.integer' => 'Toplam çocuk sayısı tam sayı olmalıdır.',
            'booking_result.number_of_children_total.min' => 'Toplam çocuk sayısı en az 0 olmalıdır.',
            'booking_result.typed_rooms.required' => 'Oda tipi zorunludur.',
            'booking_result.typed_rooms.array' => 'Oda tipi dizi olmalıdır.',
            'booking_result.typed_rooms.*.id.required' => 'Oda tipi id zorunludur.',
            'booking_result.typed_rooms.*.id.integer' => 'Oda tipi id tam sayı olmalıdır.',
            'booking_result.typed_rooms.*.id.exists' => 'Oda tipi id geçerli bir oda tipi olmalıdır.',
            'booking_result.typed_rooms.*.name.required' => 'Oda tipi adı zorunludur.',
            'booking_result.typed_rooms.*.name.string' => 'Oda tipi adı metin olmalıdır.',
            'booking_result.typed_rooms.*.count.required' => 'Oda tipi sayısı zorunludur.',
            'booking_result.typed_rooms.*.count.numeric' => 'Oda tipi sayısı sayısal olmalıdır.',
            'booking_result.typed_rooms.*.count.min' => 'Oda tipi sayısı en az 0 olmalıdır.',
            'booking_result.typed_rooms.*.price.required' => 'Oda tipi fiyatı zorunludur.',
            'booking_result.typed_rooms.*.price.numeric' => 'Oda tipi fiyatı sayısal olmalıdır.',
            'booking_result.typed_rooms.*.price.min' => 'Oda tipi fiyatı en az 0 olmalıdır.',
            'booking_result.typed_rooms.*.total_price.required' => 'Oda tipi toplam fiyatı zorunludur.',
            'booking_result.typed_rooms.*.total_price.numeric' => 'Oda tipi toplam fiyatı sayısal olmalıdır.',
            'booking_result.typed_rooms.*.total_price.min' => 'Oda tipi toplam fiyatı en az 0 olmalıdır.',
            'checked_rooms.required' => 'Seçilen odalar zorunludur.',
            'checked_rooms.array' => 'Seçilen odalar dizi olmalıdır.',
            'checked_rooms.*.required' => 'Seçilen oda zorunludur.',
            'checked_rooms.*.array' => 'Seçilen oda dizi olmalıdır.',
            'checked_rooms.*.exists' => 'Seçilen oda geçerli bir oda olmalıdır.',
            'grand_total.required' => 'Toplam fiyat zorunludur.',
            'grand_total.numeric' => 'Toplam fiyat sayısal olmalıdır.',
            'discount.required' => 'İndirim zorunludur.',
            'discount.numeric' => 'İndirim sayısal olmalıdır.',
            'customer_id.required' => 'Müşteri id zorunludur.',
            'customer_id.exists' => 'Müşteri id geçerli bir müşteri olmalıdır.',
            'rooms_guests.required' => 'Oda misafirleri zorunludur.',
            'rooms_guests.array' => 'Oda misafirleri dizi olmalıdır.',
            'rooms_guests.*.required' => 'Oda misafiri zorunludur.',
            'rooms_guests.*.array' => 'Oda misafiri dizi olmalıdır.',
            'rooms_guests.*.*.required' => 'Oda misafiri zorunludur.',
            'rooms_guests.*.*.array' => 'Oda misafiri dizi olmalıdır.',
            'rooms_guests.*.*.*.name.required' => 'Oda misafiri adı zorunludur.',
            'rooms_guests.*.*.*.name.string' => 'Oda misafiri adı metin olmalıdır.',
            'rooms_guests.*.*.*.surname.required' => 'Oda misafiri soyadı zorunludur.',
            'rooms_guests.*.*.*.surname.string' => 'Oda misafiri soyadı metin olmalıdır.',
        ];
    }
}
