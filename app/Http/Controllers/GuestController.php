<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Http\Requests\StoreGuestRequest;
use App\Http\Requests\UpdateGuestRequest;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class GuestController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return Inertia::render('Guest/Index', [
            'filters' => Request::all('search', 'trashed'),
			'guests' => Guest::orderBy('id')
                ->filter(Request::only('search', 'trashed'))
                ->paginate(Request::get('per_page') ?? 10)
                ->withQueryString()
				->through(function ($guest) {
					return [
						'id' => $guest->id,
						'full_name' => $guest->fullName,
						'nationality' => $guest->nationality,
						'phone' => $guest->phone,
						'email' => $guest->email,
					];
				}),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return view('hotel.pages.guests.create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreGuestRequest $request)
	{
		Guest::create($request->validated());
		return redirect()
			->route('hotel.guests.index')
			->with('success', 'Guest created.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Guest $guest)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Guest $guest)
	{
		return view('hotel.pages.guests.edit', [
			'guest' => $guest,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateGuestRequest $request, Guest $guest)
	{
		$guest->fill($request->validated());
		$guest->update($guest->getDirty());
		return redirect()
			->route('hotel.guests.index')
			->with('success', 'Guest updated.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Guest $guest)
	{
		$guest->delete();
		return redirect()
			->route('hotel.guests.index')
			->with('success', 'Guest deleted.');
	}
}
