<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\CaseAndBanks;
use App\Models\Customer;
use App\Settings\GeneralSettings;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$settings = new GeneralSettings();
		return Inertia::render('Customer/Index/Index', [
            'filters' => Request::all('search', 'trashed'),
			'customers' => Customer::orderBy('id', 'desc')
                ->filter(Request::only('search', 'trashed'))
				->paginate(Request::get('per_page') ?? 10)
				->withQueryString()
				->through(function ($customer) use ($settings) {
					return [
						'id' => $customer->id,
						'title' => $customer->title,
						'type' => $customer->type,
						'tax_number' => $customer->tax_number,
						'remaining_balance' =>
							$customer
								->remainingBalance(),
						'remaining_balance_formatted' =>
							number_format(abs($customer->remainingBalance()), 2, '.', ',') . ' ' . $settings->currency,
					];
				}),
		]);
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
						'tax_number' => $customer->tax_number,
						//'tax_office' => $customer->tax_office,
						'address' => $customer->address,
						'city' => $customer->city,
						'state' => $customer->state,
						'country' => $customer->country,
						'phone' => $customer->phone,
						'email' => $customer->email,
					];
				}),
		];
		return $response;
	}

	/**
	 * Display the specified resource.
	 */
	public function get(Customer $customer)
	{
		return [
			'id' => $customer->id,
			'type' => $customer->type,
			'tax_number' => $customer->tax_number,
			'email' => $customer->email,
			'phone' => $customer->phone,
			'country' => $customer->country,
			'city' => $customer->city,
			'address' => $customer->address,
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
			->with('success', 'Müşteri başarıyla oluşturuldu.');
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return view('hotel.pages.customers.create');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Customer $customer)
	{
		$settings = new GeneralSettings();
		return Inertia::render('Customer/Show/Index', [
			'currency' => $settings->currency,
			'customer' => [
				'id' => $customer->id,
				'title' => $customer->title,
				'type' => $customer->type,
				'tax_number' => $customer->tax_number,
				'email' => $customer->email,
				'phone' => $customer->phone,
				'country' => $customer->country,
				'city' => $customer->city,
				'address' => $customer->address,
				'remaining_balance' => round($customer->remainingBalance(), 2),
				'remaining_balance_formatted' => number_format(round(abs($customer->remainingBalance()), 2), 2) . ' ' . $settings->currency,
				'transactions' => $customer->transactions()->toArray(),
			],
			'case_and_banks' => CaseAndBanks::select(['id', 'name', 'type', 'currency'])->get(),
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Customer $customer)
	{
		return view('hotel.pages.customers.edit', [
			'customer' => $customer,
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
