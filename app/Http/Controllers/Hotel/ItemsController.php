<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemsRequest;
use App\Http\Requests\UpdateItemsRequest;
use App\Jobs\ImageVariantCreatorJob;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\RoomType;
use App\Models\SalesChannel;
use App\Models\SalesUnit;
use App\Models\Tax;
use App\Settings\PricingPolicySettings;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Nette\Utils\Strings;
use Plank\Mediable\Facades\MediaUploader;

class ItemsController extends Controller
{

    private PricingPolicySettings $settings;

    public function __construct(PricingPolicySettings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Inertia::render('Hotel/Item/Index',
        return Inertia::render('Hotel/Item/Index', [
            'currency' => $this->settings->currency['value'] ?? 'TRY',
            'filters' => Request::all('search', 'trashed', 'categories', 'sales_units', 'sales_channels'),
            'items' => Item::with(['units' => function ($query) {
                $query->with(['channels' => function ($query) {
                    $query->with(['unitPrices' => function ($query) {
                        $query->select('unit_channel_item_prices.id', 'unit_channel_item_prices.sales_unit_channel_id', 'unit_channel_item_prices.sales_unit_item_id', 'unit_channel_item_prices.price_rate');
                    }])->select('sales_channels.id', 'sales_channels.name');
                }])->select('sales_units.id', 'sales_units.name', 'sales_unit_items.id as item_unit_id');
            }])->filter(Request::only('search', 'trashed', 'categories', 'sales_units', 'sales_channels'))->paginate(Request::get
            ('per_page') ??
                12)
                ->withQueryString()
                ->through(function ($item) {
                    return [
                        'id' => $item->id,
                        'image' => $item->media->last()?->hasVariant('small') ? $item->media->last()
                            ?->findVariant('small')->getUrl() : $item->media->last()?->getUrl(),
                        'name' => $item->name,
                        'category' => $item->category->name,
                        'sku' => $item->sku,
                        'price' => $item->price,
                        'description' => $item->description,
                        'units' => $item->units->map(function ($unit) {
                            return [
                                'id' => $unit->id,
                                'name' => $unit->name,
                                'channels' => $unit->channels->map(function ($channel) use ($unit) {
                                    return [
                                        'id' => $channel->id,
                                        'name' => $channel->name,
//                                    'prices' => $channel->unitPrices->filter(function ($price) use ($unit) {
//                                        return $price->sales_unit_item_id == $unit->item_unit_id;
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
            'categories' => ItemCategory::all(['id', 'name']),
            'sales_units' => SalesUnit::all(['id', 'name']),
            'sales_channels' => SalesChannel::all(['id', 'name']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hotel/Item/Create', [
            'currency' => $this->settings->currency['value'] ?? 'TRY',
            'categories' => ItemCategory::all(['id', 'name']),
            'taxes' => Tax::where('enabled', true)->get(['id', 'name', 'rate'])->map(fn($tax) => ['rate' => $tax->rate,
                'value'
                => $tax->id, 'label' => $tax->name]),
            'sales_units' => SalesUnit::all(['id', 'name'])->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'name' => $unit->name,
                    'channels' => $unit->channels->map(function ($channel) {
                        return [
                            'id' => $channel->id,
                            'name' => $channel->name,
                            'sales_unit_channel_id' => $channel->pivot->id,
                        ];
                    }),
                ];
            }),
        ]);
    }

    public function imageUpload(Request $request)
    {
        try {
            $requestImage = Request::file('file');
            $tenant = tenancy()->tenant->id;
            $media = MediaUploader::fromSource($requestImage)
                ->toDestination('digitalocean', $tenant . '/items/images')
                ->useHashForFilename('sha1')
                ->makePublic()
                ->upload();
            ImageVariantCreatorJob::dispatch($media)->onQueue('image_variants');
            return response()->json([
                'message' => 'Fotoğraf başarıyla eklendi.',
                'image' => [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Fotoğraf yüklenirken bir hata oluştu.',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemsRequest $request)
    {
        $data = $request->validated();
        $item = Item::create([
            'item_category_id' => $data['category_id'],
            'name' => $data['name'],
            'description' => $data['description'],
            'type' => $data['type'],
            'price' => (float)$data['price'],
            'tax_id' => $data['tax_id'],
            'tax' => $data['tax'],
            'total_price' => str_replace(',', '.', $data['total_price']),
            'preparation_time' => $data['preparation_time'],
            'enabled' => 1,
        ]);

        $item->attachMedia($data['image_id'], 'item_images');

        $item->units()->attach($data['sales_units']);

        if (count($data['unit_channel_item_prices']) >= 1) {
            foreach ($data['unit_channel_item_prices'] as $value) {
                $item->units->each(function ($unit) use ($value) {
                    $unit->channels->each(function ($channel) use ($value, $unit) {
                        if ($channel->pivot->id == $value['sales_unit_channel_id']) {
                            $channel->unitPrices()->create([
                                'sales_unit_channel_id' => $channel->pivot->id,
                                'sales_unit_item_id' => $unit->pivot->id,
                                'price_rate' => (float)$value['price_rate'],
                            ]);
                        }
                    });
                });
            }
        }
        return redirect()
            ->route('hotel.items.index')
            ->with('success', 'Ürün başarıyla eklendi.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $items)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $items)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemsRequest $request, Item $items)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $items)
    {
        //
    }
}
