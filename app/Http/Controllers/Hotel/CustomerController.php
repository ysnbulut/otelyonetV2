<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Bank;
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
                    $grandTotal = $customer->documents->map(fn($document) => $document->total->filter(fn($total) => $total->type == 'total')->map(fn($total) => $total->amount))->flatten(1)->sum();
                    $remainingBalance = $grandTotal - $customer->documents->map(fn($document) => $document->payments->map(fn($payment) => $payment->transaction->amount))->flatten(1)->sum();
                    return [
                        'id' => $customer->id,
                        'title' => $customer->title,
                        'type' => $customer->type,
                        'tax_office' => $customer->tax_office,
                        'tax_number' => $customer->tax_number,
                        'remaining_balance' => $remainingBalance,
                        'remaining_balance_formatted' =>
                            number_format(abs($remainingBalance), 2, '.', ',') . ' ' . $this->settings->currency['value'],
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
        return [
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hotel/Customer/Create', [
            'banks' => Bank::select(['id', 'name', 'type', 'currency'])->get(),
        ]);
    }

    public function storeApi(StoreCustomerRequest $request)
    {
        $created_customer = Customer::create($request->validated());
        return [
            'customer' => $created_customer,
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $documentsTotal = $customer
            ->documents
            ->map(
                fn($document) => $document->total
                    ->filter(
                        fn($total) => $total->type == 'total'
                    )
                    ->map(
                        function ($total) use ($document) {
                            return $total->amount * $document->currency_rate;
                        })
            )->flatten(1)
            ->sum();
        $transactionsTotal = $customer
            ->documents
            ->map(
                fn($document) => $document
                    ->payments
                    ->map(
                        fn($payment) => $payment->amount
                    )
            )
            ->flatten(1)
            ->sum();
        $remainingBalance = $transactionsTotal - $documentsTotal;
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
                'remaining_balance' => $remainingBalance,
                'remaining_balance_formatted' => number_format(round(abs($remainingBalance), 2), 2) . ' ' .
                    $this->settings->currency['value'],
            ],
            'banks' => Bank::select(['id', 'name', 'type', 'currency'])->get(),
        ]);
    }

    public function transactionAdd(StoreTransactionRequest $request, Customer $customer)
    {
        $now = Carbon::now();
        $nowParseTime = Carbon::parse($now)->format('H:i:s');
        $transaction = $customer->transactions()->create([
            'type' => $request->type,
            'bank_id' => $request->bank_id,
            'paid_at' => Carbon::parse($request->payment_date . ' ' . $nowParseTime)->format('Y-m-d H:i:s'),
            'description' => $request->description,
            'amount' => $request->amount,
            'currency' => $request->currency,
            'currency_rate' => $request->currency_rate,
            'payment_method' => $request->payment_method,
        ]);
        $amount = $request->amount;
        $customer->documents->each(function ($document) use ($request, $transaction, &$amount) {
            if ($amount > 0) {
                if ($document->currency !== $request->currency) {
                    $rate = $document->currency_rate / $request->currency_rate;
                    $dcTotal = $document->total->filter(function ($total) {
                        return $total->type === 'total';
                    })->first()->amount - $document->payments->sum('amount');
                    $exchange = $dcTotal * $rate;
                    $diff = $exchange - $amount;
                    if ($diff < 0) {
                        $document->payments()->create([
                            'transaction_id' => $transaction->id,
                            'amount' => $dcTotal,
                        ]);
                        $amount = round(abs($diff), 2);
                        return true;
                    } else {
                        $document->payments()->create([
                            'transaction_id' => $transaction->id,
                            'amount' => $amount / $rate,
                        ]);
                        $amount = 0;
                        return false;
                    }
                } else {
                    $dcTotal = $document->total->filter(function ($total) {
                        return $total->type === 'total';
                    })->first()->amount;
                    $diff = $dcTotal - $amount;
                    if ($diff < 0) {
                        $document->payments()->create([
                            'transaction_id' => $transaction->id,
                            'amount' => $dcTotal,
                        ]);
                        $amount = abs($diff);
                        return true;
                    } else {
                        $document->payments()->create([
                            'transaction_id' => $transaction->id,
                            'amount' => $amount,
                        ]);
                        $amount = 0;
                        return false;
                    }
                }
            } else {
                return false;
            }
        });
        return redirect()
            ->route('hotel.customers.show', $customer)
            ->with('success', 'Ödeme eklendi.');
    }

    public function transactions(Customer $customer)
    {
        return $customer
            ->transactions()
            ->select([
                'id',
                'currency',
                'payment_method',
                'bank_id',
                'paid_at as date',
                DB::raw('"transaction" as type'),
                'amount',
            ])
            ->union($customer
                ->documents()
                ->select([
                    'id',
                    'currency',
                    'payment_method' => DB::raw('null'),
                    'bank_id' => DB::raw('null'),
                    'issue_date as date',
                    DB::raw('"document" as type'),
                    'amount' => DB::raw('(SELECT SUM(amount) FROM document_totals WHERE document_totals.document_id = documents.id AND document_totals.type = "total")')
                ]))
            ->orderBy('date')
            ->paginate(10)
            ->withQueryString()
            ->through
            (function ($payment) {
                $info = '';
                if ($payment->type === 'document') {
                    $currency = $payment->currency;
                    $amount = $payment->amount;
                    $info .= 'Folyo...';
                } else {
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
                        $amount = $payment->amount;
                        $info .= '(' . number_format($payment->amount, 2, ',', '.') . ' ' . $this->settings->currency['value'] . ') ';
                    } else {
                        $amount = $payment->amount;
                    }
                    $currency = $payment->currency;
                    $info .= $payment->bank->name . ' ' . $payment_method . ' Ödendi. ';
                    $info .= $payment->description !== NULL ? '(' . $payment->description . ')' : '';
                }
                $amount_formatted = number_format($amount, 2, ',', '.') . ' ' . $currency;
                return [
                    'id' => $payment->id,
                    'type' => $payment->type,
                    'date' => Carbon::parse($payment->date)->format('d.m.Y'),
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
