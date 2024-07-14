<?php

namespace App\Http\Controllers\Hotel;

use App\Helpers\Currencies;
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
     * @throws \JsonException
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
        $available_rooms = Room::whereDoesntHave('bookingRooms')->orWhereHas('bookingRooms', function ($query) use ($now, $booked_rooms) {
            $query->whereDate('check_out', '<=', $now)->orWhereDate('check_in', '>', $now)->whereNotIn('room_id',
                $booked_rooms->pluck('id'));
        })->where('is_clean', '=', true)->where('status', '=', true)->get(['id', 'name'])->map(function ($room) use ($now) {
            $firstBooked = BookingRoom::where('room_id', $room->id)->whereDate
            ('check_in', '>', $now)->orderBy('check_in', 'asc')->first()->check_in ?? null;
            if ($firstBooked !== null) {
                $diff = Carbon::now()->startOfDay()->diffInDays(Carbon::parse($firstBooked)->startOfDay());
                if ($diff === 0) {
                    $bgColor = 'bg-danger';
                    $text = 'Bugün rezervasyon';
                } elseif ($diff === 1) {
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
        $currencies = new Currencies();
        return Inertia::render('Hotel/Dashboard/Index', [
            'eur_exchange_rate' => $currencies->convert('EUR', 'TRY', 1)['exchange_rate'],
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
