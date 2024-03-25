<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\CaseAndBank;
use App\Models\Customer;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class CustomerController extends Controller
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
        return Inertia::render('Hotel/Customer/Index', [
            'filters' => Request::all('search', 'trashed'),
            'customers' => Customer::orderBy('id', 'desc')
                ->filter(Request::only('search', 'trashed'))
                ->paginate(Request::get('per_page') ?? 10)
                ->withQueryString()
                ->through(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'title' => $customer->title,
                        'type' => $customer->type,
                        'tax_office' => $customer->tax_office,
                        'tax_number' => $customer->tax_number,
                        'remaining_balance' =>
                            $customer
                                ->remainingBalance(),
                        'remaining_balance_formatted' =>
                            number_format(abs($customer->remainingBalance()), 2, '.', ',') . ' ' . $this->settings->currency['value'],
                    ];
                }),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function get(Customer $customer)
    {
        return [
            'id' => $customer->id,
            'type' => $customer->type,
            'tax_office' => $customer->tax_office,
            'tax_number' => $customer->tax_number,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'country' => $customer->country,
            'city' => $customer->city,
            'address' => $customer->address,
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function search($query)
    {
        $response = [
            'query' => $query,
            'customers' => Customer::search($query)
                ->get()
                ->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'title' => $customer->title,
                        'tax_office' => $customer->tax_office,
                        'tax_number' => $customer->tax_number,
                        'address' => $customer->address,
                        'city' => $customer->city,
                        'country' => $customer->country,
                        'phone' => $customer->phone,
                        'email' => $customer->email,
                    ];
                }),
        ];
        return $response;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        Customer::create($request->validated());
        return redirect()
            ->route('hotel.customers.index')
            ->with('success', 'Müşteri oluşturuldu.');
    }

    public function storeApi(StoreCustomerRequest $request)
    {
        $created_customer = Customer::create($request->validated());
        return [
            'customer' => $created_customer,
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hotel/Customer/Create', [
            'case_and_banks' => CaseAndBank::select(['id', 'name', 'type', 'currency'])->get(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        return Inertia::render('Hotel/Customer/Show', [
            'currency' => $this->settings->currency['value'],
            'customer' => [
                'id' => $customer->id,
                'title' => $customer->title,
                'type' => $customer->type,
                'tax_office' => $customer->tax_office,
                'tax_number' => $customer->tax_number,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'country' => $customer->country,
                'city' => $customer->city,
                'address' => $customer->address,
                'remaining_balance' => round($customer->remainingBalance(), 2),
                'remaining_balance_formatted' => number_format(round(abs($customer->remainingBalance()), 2), 2) . ' ' .
                    $this->settings->currency['value'],
            ],
            'case_and_banks' => CaseAndBank::select(['id', 'name', 'type', 'currency'])->get(),
        ]);
    }

    public function transactions(Customer $customer)
    {
        return $customer->bookings()
            ->select(['id', 'customer_id', 'check_in as date', 'type' => DB::raw("'booking'")])
            ->union(
                $customer->payments()
                    ->select(['id', 'customer_id', 'payment_date as date', 'type' => DB::raw("'payment'")])
            )->orderBy('date', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($transaction) use ($customer) {
                $info = '';
                if ($transaction->booking === 'booking') {
                    $booking = $customer->bookings()->where('id', $transaction->id)->first();
                    $amount = $booking->total_price->grand_total;
                    $currency = $this->settings->currency['value'];
                    $info .= $booking->rooms->pluck('name')->implode(', ') . ' - ' . $booking->stayDurationNight() . ' (' . $booking->rooms->sum('pivot.number_of_adults') . ' Yetişkin ' . $booking->rooms->sum('pivot.number_of_children') . ' Çocuk)';
                } else {
                    $payment = $customer->payments()->where('id', $transaction->id)->first();
                    //TODO burası dashboardda da var sonra ayrıştırılmalı fonksiyon haline gelmeli
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
                        $info .= '(' . number_format($payment->amount_paid, 2, ',', '.') . ' ' . $this->settings->currency['value'] . ') ';
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
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return Inertia::render('Hotel/Customer/Edit', [
            'customer' => collect($customer)->forget(['created_at', 'updated_at', 'deleted_at']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->fill($request->validated());
        $customer->update($customer->getDirty());
        return redirect()
            ->route('hotel.customers.index')
            ->with('success', 'Müşteri güncellendi.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        // Bu kısım düşünülecek ödemeler vs vs nasıl bir yol haritası çizileceği
    }
}
