<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\BookingRoom;
use App\Models\Guest;
use App\Models\Room;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Inertia\Inertia;
use Teknomavi\Tcmb\Doviz;

class DashboardController extends Controller
{
    protected PricingPolicySettings $settings;

    public function __construct()
    {
        $this->settings = new PricingPolicySettings();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $now = Carbon::now('Europe/Istanbul')->format('Y-m-d');
        $tomorrow = Carbon::now('Europe/Istanbul')->addDay()->format('Y-m-d');
        $rooms = Room::all();
        $booked_rooms = BookingRoom::whereDate('check_out', '>=', $now)->whereDate('check_in', '<=', $now)->get()
            ->map(function ($booking_room) {
                $isSameDay = Carbon::now('Europe/Istanbul')->isSameDay($booking_room->check_out);
                $remaining_time = Carbon::now('Europe/Istanbul')->isBefore($booking_room->check_out) ? Carbon::now('Europe/Istanbul')->startOfDay()->diffInDays(Carbon::parse($booking_room->check_out)->startOfDay()) : 0;
                $stay_duration = Carbon::parse($booking_room->check_in)->startOfDay()->diffInDays(Carbon::parse
                ($booking_room->check_out)->startOfDay());
                return [
                    'id' => $booking_room->room_id,
                    'name' => $booking_room->room->name,
                    'booking_id' => $booking_room->booking_id,
                    'guests' => $booking_room->guests->map(fn($guest) => [
                        'id' => $guest->id,
                        'name' => $guest->name,
                        'surname' => $guest->surname,
                        'check_in' => $guest->pivot->check_in,
                        'check_out' => $guest->pivot->check_out,
                        'status' => $guest->pivot->status,
                        'check_in_date' => $guest->pivot->check_in_date,
                        'check_out_date' => $guest->pivot->check_out_date,
                    ]),
                    'check_in' => Carbon::parse($booking_room->check_in)->format('d.m.Y'),
                    'check_out' => Carbon::parse($booking_room->check_out)->format('d.m.Y'),
                    'alert_for_check_out' => $isSameDay && Carbon::now('Europe/Istanbul')->isAfter
                        ($booking_room->check_out),
                    'now' => Carbon::now('Europe/Istanbul')->format('Y-m-d H:i:s'),
                    'stay_duration' => $stay_duration,
                    'remaining_time' => $remaining_time,
                    'remaining_time_text' => $remaining_time > 0 ? ($remaining_time === 1 ? 'Yarın çıkış' :
                        ($stay_duration - $remaining_time === 0 ? 'Bugün giriş' : $remaining_time . ' gün sonra çıkış')) : 'Bugün çıkış',
                    'remaining_time_bgcolor' => $remaining_time > 0 ? $stay_duration - $remaining_time === 0 ?
                        'bg-warning' : 'bg-success' : 'bg-danger',
                ];
            });
        $available_rooms = Room::whereDoesntHave('bookingRooms')->orWhereHas('bookingRooms', function ($query) use
        ($now, $booked_rooms) {
            $query->whereDate('check_out', '<=', $now)->orWhereDate('check_in', '>', $now)->whereNotIn('room_id',
                $booked_rooms->pluck('id'));
        })->where('is_clean', '=', true)->where('status', '=', true)->get(['id', 'name'])->map(function ($room) use ($now) {
            $firstBooked = BookingRoom::where('room_id', $room->id)->whereDate
            ('check_in', '>', $now)->orderBy('check_in', 'asc')->first()->check_in ?? null;
            if($firstBooked !== null) {
                $diff = Carbon::now()->startOfDay()->diffInDays(Carbon::parse($firstBooked)->startOfDay());
                if($diff === 0) {
                    $bgColor = 'bg-danger';
                    $text = 'Bugün rezervasyon';
                } elseif($diff === 1) {
                    $bgColor = 'bg-pending';
                    $text = 'Yarın rezervasyon';
                } else {
                    $bgColor = 'bg-warning';
                    $text = $diff . ' gün sonra rezervasyon';
                }
            } else {
                $bgColor = 'bg-success';
                $text = 'Görünürde rezervasyon yok';
            }

            return [
                'id' => $room->id,
                'name' => $room->name,
                'available_text_bgcolor' => $bgColor,
                'available_text' => $text,
            ];
        });
        $dirty_rooms = Room::where('is_clean', '=', false)->where('status', '=', true)->get(['id', 'name']);
        $out_of_order_rooms = Room::where('status', '=', false)->get(['id', 'name']);
//        $transactions = Booking::select(['id', 'customer_id', 'check_in as date', 'type' => DB::raw("'booking'")])
//            ->union(
//                BookingPayment::select(['id', 'customer_id', 'payment_date as date', 'type' => DB::raw("'payment'")])
//            )->orderBy('date', 'desc')
//            ->take(10)->get()->map(function ($transaction) {
//                $info = '';
//                if ($transaction->booking === 'booking') {
//                    $booking = Booking::where('id', $transaction->id)->first();
//                    $amount = $booking->total_price->grand_total;
//                    $currency = $this->settings->currency['value'];
//                    $info .= $booking->rooms->pluck('name')->implode(', ') . ' - ' . $booking->stayDurationNight() . ' (' . $booking->number_of_rooms . 'Oda' . $booking->number_of_adults . 'Yetişkin ' . $booking->number_of_children . ' Çocuk)';
//                } else {
//                    $payment = BookingPayment::where('id', $transaction->id)->first();
//                    if ($payment->payment_method == 'cash') {
//                        $payment_method = 'Nakit';
//                    } elseif ($payment->payment_method == 'credit_card') {
//                        $payment_method = 'Kredi Kartı';
//                    } elseif ($payment->payment_method == 'bank_transfer') {
//                        $payment_method = 'Banka Havale/EFT';
//                    } else {
//                        $payment_method = 'Bilinmiyor.';
//                    }
//                    if ($payment->currency !== $this->settings->currency['value']) {
//                        $amount = $payment->currency_amount;
//                        $info .= '(' . number_format($payment->amount_paid, 2, ',', '.') . ' ' .
//                            $this->settings->currency['value']
//                            . ') ';
//                    } else {
//                        $amount = $payment->amount_paid;
//                    }
//                    $currency = $payment->currency;
//                    $info .= $payment->case->name . ' ' . $payment_method . ' Ödendi. ';
//                    $info .= $payment->description !== NULL ? '(' . $payment->description . ')' : '';
//                }
//                $amount_formatted = number_format($amount, 2, ',', '.') . ' ' . $currency;
//                return [
//                    'id' => $transaction->id,
//                    'customer_id' => $transaction->customer_id,
//                    'type' => $transaction->booking === 'booking' ? 'Rezervasyon' : 'Ödeme',
//                    'date' => Carbon::createFromFormat('Y-m-d', $transaction->date)->format('d.m.Y'),
//                    'amount' => $amount_formatted,
//                    'info' => $info,
//                ];
//            });
        $doviz = new Doviz();
        $kur = $doviz->kurAlis('EUR', Doviz::TYPE_EFEKTIFALIS);
//        Inertia::render('Hotel/Dashboard/Index',
        return Inertia::render('Hotel/Dashboard/Index',[
            'eur_exchange_rate' => $kur,
            'room_count' => $rooms->count(),
            'booked_rooms' => $booked_rooms,
            'booked_rooms_percent' => '%' . round($rooms->count() > 0 ? ($booked_rooms->count() / $rooms->count() *
                    100) : 0),
            'available_rooms' => $available_rooms,
            'available_rooms_percent' => '%' . round($rooms->count() > 0 ? ($available_rooms->count() / $rooms->count() * 100) : 0),
            'dirty_rooms' => $dirty_rooms,
            'dirty_rooms_percent' => '%' . round($rooms->count() > 0 ? ($dirty_rooms->count() / $rooms->count() * 100) : 0),
            'out_of_order_rooms' => $out_of_order_rooms,
            'out_of_order_rooms_percent' => '%' . round($rooms->count() > 0 ? ($out_of_order_rooms->count() / $rooms->count() * 100) : 0),
            'guest_count' => Guest::whereHas('booking_room', function ($query) use ($now) {
                $query->where('booking_rooms.check_out', '>=', $now)
                    ->where('booking_rooms.check_in', '<=', $now);
            })->get('id')->unique('id')->count(),
            'today_check_in_guest_count' => Guest::whereHas('booking_room', function ($query) use ($now) {
                $query->where('booking_rooms.check_in', '=', $now);
            })->count(),
            'today_check_out_guest_count' => Guest::whereHas('booking_room', function ($query) use ($now) {
                $query->where('booking_rooms.check_out', '=', $now);
            })->count(),
            'tomorrow_check_in_guest_count' => Guest::whereHas('booking_room', function ($query) use ($tomorrow) {
                $query->where('booking_rooms.check_in', '=', $tomorrow);
            })->count(),
            'tomorrow_check_out_guest_count' => Guest::whereHas('booking_room', function ($query) use ($tomorrow) {
                $query->where('booking_rooms.check_out', '=', $tomorrow);
            })->count(),
            'transactions' => []// $transactions,
        ]);
    }
}
