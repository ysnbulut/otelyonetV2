<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingPayment;
use App\Models\Guest;
use App\Models\Room;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $now = Carbon::now()->format('Y-m-d');
        $tomorrow = Carbon::now()->addDay()->format('Y-m-d');
        $this_year_start = Carbon::now()->startOfYear()->format('Y-m-d');
        $this_year_end = Carbon::now()->endOfYear()->format('Y-m-d');
        $this_week_start = Carbon::now()->startOfWeek()->format('Y-m-d');
        $this_week_end = Carbon::now()->endOfWeek()->format('Y-m-d');
        $rooms = Room::all();
        $booked_rooms = Room::whereHas('bookings', function ($query) use ($now) {
            $query->where('check_out', '>=', $now)->orWhere('check_out', '=', null);
        })->where('status', '=', true);
        $available_rooms = Room::whereDoesntHave('bookings')->orWhereHas('bookings', function ($query) use ($now) {
            $query->where('check_out', '<', $now);
        })->whereNotIn('id', $booked_rooms->pluck('id')->toArray())
            ->where('is_clean', '=', true)
            ->where('status', '=', true);
        $dirty_rooms = Room::where('is_clean', '=', false)->where('status', '=', true);
        $booking_data_yearly_get = Booking::with('rooms')->where('check_out', '>=', $this_year_start)->where('check_in', '<=', $this_year_end)
            ->orWhereNull('check_out')
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->check_in)->format('m');
            })->map(function ($item) {
                return $item->pluck('rooms')->map->count()->sum();
            });
        $months = range(1, 12);
        $booked_rooms_yearly = $booking_data_yearly_get->count() > 0 ? array_map(function ($month) use ($booking_data_yearly_get) {
            return $booking_data_yearly_get->get(str_pad($month, 2, '0', STR_PAD_LEFT), 0);
        }, $months) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $booking_data_weekly_get = Booking::with('rooms')->where('check_out', '>=', $this_week_start)->where('check_in', '<=', $this_week_end)
            ->orWhereNull('check_out')
            ->get()
            ->map(function ($booking) use ($this_week_start, $this_week_end) {
                $thisWeek = collect(Carbon::parse($this_week_start)->toPeriod($this_week_end))->map(function ($date) {
                    return $date->format('Y-m-d');
                });
                $reData = range(0, 6);
                foreach ($thisWeek as $key => $day) {
                    if (Carbon::parse($booking->check_out)->format('Y-m-d') >= $day || $booking->check_out === null) {
                        $reData[$key] = $booking->rooms->count();
                    } else {
                        $reData[$key] = 0;
                    }
                }
                return $reData;
            });
        $booking_data_weekly_map = $booking_data_weekly_get->count() > 0 ? call_user_func_array('array_map', array_merge([null], $booking_data_weekly_get->toArray())) : [0, 0, 0, 0, 0, 0, 0];
        $booked_rooms_weekly = $booking_data_weekly_get->count() > 1 ? array_map('array_sum', $booking_data_weekly_map) : $booking_data_weekly_map;
        $transactions = Booking::select(['id', 'customer_id', 'check_in as date', 'type' => DB::raw("'booking'")])
            ->union(
                BookingPayment::select(['id', 'customer_id', 'payment_date as date', 'type' => DB::raw("'payment'")])
            )->orderBy('date', 'desc')
            ->take(10)->get()->map(function ($transaction) {
                $info = '';
                if ($transaction->booking === 'booking') {
                    $booking = Booking::where('id', $transaction->id)->first();
                    $amount = $booking->total_price->grand_total;
                    $currency = $this->settings->currency['value'];
                    $info .= $booking->rooms->pluck('name')->implode(', ') . ' - ' . $booking->stayDurationNight() . ' (' . $booking->number_of_rooms . 'Oda' . $booking->number_of_adults . 'Yetişkin ' . $booking->number_of_children . ' Çocuk)';
                } else {
                    $payment = BookingPayment::where('id', $transaction->id)->first();
                    if ($payment->payment_method == 'cash') {
                        $payment_method = 'Nakit';
                    } elseif ($payment->payment_method == 'credit_card') {
                        $payment_method = 'Kredi Kartı';
                    } elseif ($payment->payment_method == 'bank_transfer') {
                        $payment_method = 'Banka Havale/EFT';
                    } else {
                        $payment_method = 'Bilinmiyor.';
                    }
                    if ($payment->currency !== $this->settings->currency['value']) {
                        $amount = $payment->currency_amount;
                        $info .= '(' . number_format($payment->amount_paid, 2, ',', '.') . ' ' .
                            $this->settings->currency['value']
                            . ') ';
                    } else {
                        $amount = $payment->amount_paid;
                    }
                    $currency = $payment->currency;
                    $info .= $payment->case->name . ' ' . $payment_method . ' Ödendi. ';
                    $info .= $payment->description !== NULL ? '(' . $payment->description . ')' : '';
                }
                $amount_formatted = number_format($amount, 2, ',', '.') . ' ' . $currency;
                return [
                    'id' => $transaction->id,
                    'customer_id' => $transaction->customer_id,
                    'type' => $transaction->booking === 'booking' ? 'Rezervasyon' : 'Ödeme',
                    'date' => Carbon::createFromFormat('Y-m-d', $transaction->date)->format('d.m.Y'),
                    'amount' => $amount_formatted,
                    'info' => $info,
                ];
            });
        $doviz = new Doviz();
        $kur = $doviz->kurAlis('EUR', Doviz::TYPE_EFEKTIFALIS);
        return Inertia::render('Hotel/Dashboard/Index', [
            'eur_exchange_rate' => $kur,
            'room_count' => $rooms->count(),
            'booked_rooms' => $booked_rooms->count(),
            'booked_rooms_percent' => '%' . round($rooms->count() > 0 ? ($booked_rooms->count() / $rooms->count() *
                    100) : 0),
            'available_rooms' => $available_rooms->count(),
            'available_rooms_percent' => '%' . round($rooms->count() > 0 ? ($available_rooms->count() / $rooms->count() * 100) : 0),
            'dirty_rooms' => $dirty_rooms->count(),
            'dirty_rooms_percent' => '%' . round($rooms->count() > 0 ? ($dirty_rooms->count() / $rooms->count() * 100) : 0),
            'out_of_order_rooms' => $rooms->where('status', '=', false)->count(),
            'out_of_order_rooms_percent' => '%' . round($rooms->count() > 0 ? ($rooms->where('status', '=', false)->count() / $rooms->count() * 100) : 0),
            'guest_count' => Guest::whereHas('booking_room', function ($query) use ($now) {
                $query->whereHas('booking', function ($query) use ($now) {
                    $query->where('check_out', '>=', $now)
                        ->where('check_in', '<=', $now)
                        ->orWhereNull('check_out');
                });
            })->get('id')->unique('id')->count(),
            'today_check_in_guest_count' => Guest::whereHas('booking_room', function ($query) use ($now) {
                $query->whereHas('booking', function ($query) use ($now) {
                    $query->where('check_in', '=', $now);
                });
            })->count(),
            'today_check_out_guest_count' => Guest::whereHas('booking_room', function ($query) use ($now) {
                $query->whereHas('booking', function ($query) use ($now) {
                    $query->where('check_out', '=', $now);
                });
            })->count(),
            'tomorrow_check_in_guest_count' => Guest::whereHas('booking_room', function ($query) use ($tomorrow) {
                $query->whereHas('booking', function ($query) use ($tomorrow) {
                    $query->where('check_in', '=', $tomorrow);
                });
            })->count(),
            'tomorrow_check_out_guest_count' => Guest::whereHas('booking_room', function ($query) use ($tomorrow) {
                $query->whereHas('booking', function ($query) use ($tomorrow) {
                    $query->where('check_out', '=', $tomorrow);
                });
            })->count(),
            'booked_rooms_yearly' => $booked_rooms_yearly,
            'booked_rooms_weekly' => $booked_rooms_weekly,
            'transactions' => $transactions,
        ]);
    }
}
