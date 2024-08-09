<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGuestRequest;
use App\Http\Requests\UpdateGuestRequest;
use App\Models\BookingRoom;
use App\Models\Citizen;
use App\Models\Guest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return Inertia::render('Hotel/Guest/Index', [
            'filters' => Request::all('search', 'trashed'),
            'guests' => Guest::orderBy('id')
                ->filter(Request::only('search', 'trashed'))
                ->paginate(Request::get('per_page') ?? 10)
                ->withQueryString()
                ->through(function ($guest) {
                    return [
                        'id' => $guest->id,
                        'full_name' => $guest->fullName,
                        'is_foreign_national' => $guest->is_foreign_national,
                        'citizen' => Citizen::find($guest->citizen_id)->name,
                        'identification_number' => $guest->identification_number,
                        'birthday' => $guest->birthday,
                        'phone' => $guest->phone,
                        'email' => $guest->email,
                    ];
                }),
        ]);
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
        return Inertia::render('Hotel/Guest/Edit', [
            'citizens' => Citizen::all()->forget(['created_at', 'updated_at', 'deleted_at']),
            'guest' => collect($guest)->merge([
                'full_name' => $guest->fullName,
            ])->forget(['created_at', 'updated_at', 'deleted_at']),
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
            ->back()
            ->with('success', 'Misafir başarıyla güncellendi.');
    }

    /**
     * @param Guest $guest
     * @return RedirectResponse
     */
    public function destroy(Guest $guest)
    {
        $guest->delete();
        return redirect()
            ->route('hotel.guests.index')
            ->with('success', 'Guest deleted.');
    }
}
