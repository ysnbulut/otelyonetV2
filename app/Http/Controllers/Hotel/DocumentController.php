<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentItemAddRequest;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function itemAdd(StoreDocumentItemAddRequest $request, Document $document)
    {
        $document->items()->create([
            'item_id' => $request->item_id !== '' ? $request->item_id : null,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'tax_name' => $request->tax_name,
            'tax_rate' => $request->tax_rate,
            'tax' => $request->tax,
            'total' => $request->total,
            'discount' => $request->discount,
            'grand_total' => $request->grand_total,
        ]);

        $documentTotalSubTotal = $document->total->filter(function ($total) {
            return $total->type === 'subtotal';
        });
        if (count($documentTotalSubTotal) > 0) {
            $documentTotalSubTotal->first()->update([
                'amount' => $document->items->sum('price'),
            ]);
        } else {
            $document->total()->create([
                'type' => 'subtotal',
                'amount' => $document->items->sum('price'),
            ]);
        }

        $documentTotalTax = $document->total->filter(function ($total) {
            return $total->type === 'tax';
        });

        if(count($documentTotalTax) > 0) {
            $documentTotalTax->first()->update([
                'amount' => $document->items->sum('tax'),
            ]);
        } else {
            $document->total()->create([
                'type' => 'tax',
                'amount' => $document->items->sum('tax'),
            ]);
        }

        $documentTotalDiscount = $document->total->filter(function ($total) {
            return $total->type === 'discount';
        });

        if(count($documentTotalDiscount) > 0) {
            $documentTotalDiscount->first()->update([
                'amount' => $document->items->sum('discount'),
            ]);
        } else {
            $document->total()->create([
                'type' => 'discount',
                'amount' => $document->items->sum('discount'),
            ]);
        }

        $documentTotalTotal = $document->total->filter(function ($total) {
            return $total->type === 'total';
        });

        if(count($documentTotalTotal) > 0) {
            $documentTotalTotal->first()->update([
                'amount' => $document->items->sum('grand_total'),
            ]);
        } else {
            $document->total()->create([
                'type' => 'total',
                'amount' => $document->items->sum('grand_total'),
            ]);
        }

        if (strtolower(class_basename($document->unit)) === 'bookingroom') {
            return redirect()->route('hotel.bookings.show', $document->unit->booking_id)->with('success', 'Item added successfully.');
        } else {
            return redirect()->route('hotel.dashboard.index')->with('success', 'Item added successfully.');
        }

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        //
    }
}
