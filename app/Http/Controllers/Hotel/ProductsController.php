<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductsRequest;
use App\Http\Requests\UpdateProductsRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\SalesChannel;
use App\Models\SalesUnit;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Nette\Utils\Strings;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/Product/Index',[
            'filters' => Request::all('search', 'trashed', 'categories', 'sales_units', 'sales_channels'),
            'products' => Product::with(['units' => function ($query) {
                    $query->with(['channels' => function ($query) {
                        $query->with(['unitPrices' => function ($query) {
                            $query->select('unit_channel_product_prices.id', 'unit_channel_product_prices.sales_unit_channel_id', 'unit_channel_product_prices.sales_unit_product_id', 'unit_channel_product_prices.price');
                        }])->select('sales_channels.id', 'sales_channels.name');
                    }])->select('sales_units.id', 'sales_units.name', 'sales_unit_products.id as product_unit_id');
                }])->filter(Request::only('search', 'trashed', 'categories', 'sales_units', 'sales_channels'))->paginate(Request::get
            ('per_page') ??
                12)
                    ->withQueryString()
                    ->through(function ($product) {
                        return [
                            'id' => $product->id,
                            'photo' => $product->getFirstMediaUrl('product_images', 'thumb'),
                            'name' => $product->name,
                            'category' => $product->category->name,
                            'sku' => $product->sku,
                            'price' => $product->price,
                            'description' => $product->description,
                            'units' => $product->units->map(function ($unit) {
                                return [
                                    'id' => $unit->id,
                                    'name' => $unit->name,
                                    'channels' => $unit->channels->map(function ($channel) use ($unit) {
                                        return [
                                            'id' => $channel->id,
                                            'name' => $channel->name,
//                                    'prices' => $channel->unitPrices->filter(function ($price) use ($unit) {
//                                        return $price->sales_unit_product_id == $unit->product_unit_id;
//                                    })->map(function ($price) {
//                                        return [
//                                            'id' => $price->id,
//                                            'price' => $price->price,
//                                        ];
//                                    }),
                                        ];
                                    }),
                                ];
                            }),
                        ];
                    }),
            'categories' => ProductCategory::all(['id', 'name']),
            'sales_units' => SalesUnit::all(['id', 'name']),
            'sales_channels' => SalesChannel::all(['id', 'name']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hotel/Product/Create',[
            'categories' => ProductCategory::all(['id', 'name']),
            'sales_units' => SalesUnit::all(['id', 'name'])->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'name' => $unit->name,
                    'channels' => $unit->channels->map(function ($channel) {
                        return [
                            'id' => $channel->id,
                            'name' => $channel->name,
                            'sales_unit_channel_id' => $channel->sales_unit_channel_id,
                        ];
                    }),
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductsRequest $request)
    {
        $data = $request->validated();
        $product = Product::create([
            'product_category_id' => $data['category_id'],
            'name' => $data['name'],
            'description' =>  $data['description'],
            'sku' =>  $data['sku'],
            'price' =>  (float) $data['price'],
            'tax_rate' =>  $data['tax_rate'],
            'preparation_time' =>  $data['preparation_time'],
            'is_active' => 1,
        ]);

        $product->addMedia($data['photo_path'])->toMediaCollection('product_images');

        $product->units()->attach($data['sales_units']);

        if(count($data['unit_channel_product_prices']) > 1) {
            foreach ($data['unit_channel_product_prices'] as $key => $value) {
                $product->units->each(function ($unit) use ($value) {
                    $unit->channels->each(function ($channel) use ($value, $unit) {
                        if ($channel->pivot->id == $value['sales_unit_channel_id']) {
                            $channel->unitPrices()->create([
                                'sales_unit_channel_id' => $value['sales_unit_channel_id'],
                                'sales_unit_product_id' => $unit->pivot->id,
                                'price' => (float) $value['price'],
                            ]);
                        }
                    });
                });
            }
        }
        return redirect()
            ->route('hotel.products.index')
            ->with('success', 'Ürün başarıyla eklendi.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $products)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $products)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductsRequest $request, Product $products)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $products)
    {
        //
    }
}
