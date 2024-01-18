<?php

namespace App\Http\Controllers\Hotel;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomTypeRequest;
use App\Http\Requests\TypeHasBedsRequest;
use App\Http\Requests\TypeHasViewRequest;
use App\Http\Requests\UpdateRoomTypeRequest;
use App\Models\BedType;
use App\Models\RoomType;
use App\Models\RoomTypeFeature;
use App\Models\RoomView;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Nette\Utils\Strings;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class RoomTypeController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/RoomType/Index', [
            'roomTypes' => RoomType::with(['rooms', 'unitPrices', 'variationsOfGuests', 'variationMultipliers'])->orderBy('id')
                ->get(['id', 'name', 'description', 'size', 'adult_capacity', 'child_capacity', 'room_count'])->map(function ($roomType) {
                    $warningMessage = null;
                    if ($roomType->rooms->count() > 0) {
                        $warningMessage .= $roomType->name . ' oda türü silindiğinde <b>' .
                            $roomType->rooms->pluck('name')
                                ->join(', ') . '</b> odaları';
                    }
                    if($roomType->unitPrices->count() > 0) {
                        $warningMessage .= $warningMessage !== null ? ' ve <b>'.Str::replace(', , ', ', ',
                                $roomType->unitPrices->map(fn
                            ($unitPrice) => $unitPrice->season !== null ? $unitPrice->season->name : '')->join(', '))
                            .'</b> sezonları için fiyatlar ile ' . $roomType->name .' oda tipine bağlı tüm varyasyonlar <b>('.$roomType->variationMultipliers->count().' adet varyasyon) ve çarpanları</b> silinecektir.' : '<b>'.Str::replace(', , ', ', ', $roomType->unitPrices->map(fn
                            ($unitPrice) => $unitPrice->season !== null ? $unitPrice->season->name : '')->join(', ')).'</b>'.' sezonları için fiyatlar silinecektir!';
                    } else {
                        $warningMessage .= $warningMessage !== null ? ' da silinecektir!' : '';
                    }
                    return [
                        'id' => $roomType->id,
                        'name' => $roomType->name,
                        'description' => $roomType->description,
                        'size' => $roomType->size,
                        'adult_capacity' => $roomType->adult_capacity,
                        'child_capacity' => $roomType->child_capacity,
                        'room_count' => $roomType->room_count,
                        'warning_message' => $warningMessage,
                    ];
                })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomTypeRequest $request)
    {
        $data = $request->validated();
        $inset_data = [
            'name' => $data['name'],
            'description' => $data['description'], // 'description' => $data['description'] ?? '
            'size' => $data['size'],
            'adult_capacity' => $data['adult_capacity'],
            'child_capacity' => $data['child_capacity'],
            'room_count' => $data['room_count'],
        ];
        $roomtype = RoomType::create($inset_data);
        if(count($data['room_type_features']) > 0) {
            $features = [];
            foreach ($data['room_type_features'] as $key => $value) {
                $features[$value['feature_id']] = ['order_no' => $value['order_no']];
            }
            $roomtype->features()->attach($features);
        }
        $helper = new Helper();
        $roomtype->variationsOfGuests()->createMany($helper->guestVariations($data['adult_capacity'], $data['child_capacity']));
        return redirect()
            ->route('hotel.room_types.edit', $roomtype->id)
            ->with('success', 'Oda türü başarıyla eklendi.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hotel/RoomType/Create', [
            'views' => RoomView::orderBy('id')->get(['id', 'name']),
            'features' => RoomTypeFeature::orderBy('order_no')->get(['id', 'name']),
            'beds' => BedType::orderBy('id')->get(['id', 'name']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RoomType $roomType)
    {
        return Inertia::render('Hotel/RoomType/Edit', [
            'roomType' => [
                'id' => $roomType->id,
                'name' => $roomType->name,
                'description' => $roomType->description,
                'size' => $roomType->size,
                'adult_capacity' => $roomType->adult_capacity,
                'child_capacity' => $roomType->child_capacity,
                'room_count' => $roomType->room_count,
                'beds' => $roomType->beds->map(fn($bed) => [
                    'id' => $bed->id,
                    'name' => $bed->name,
                    'count' => $bed->pivot->count,
                ]),
                'views' => $roomType->views->map(function ($view) use ($roomType) {
                    $warningMessage = null;
                    if( $view->rooms->count() > 0) {
                        $warningMessage .= $view->name . ' oda manzarası '.$roomType->name.'\'den silindiğinde <b>' .
                            $view->rooms->pluck('name')
                                ->join(', ') . '</b> odaları da silinecektir!';
                    }
                    if($view->unitPrices->count() > 0) {
                        $warningMessage .= $warningMessage !== null ? ' ve <b>'.$view->unitPrices->map(fn
                            ($unitPrice) => $unitPrice->season !== null ? $unitPrice->season->name : '')->join(', ').'</b> sezonları için fiyatlar da silinecektir.' : '<b>'.$view->unitPrices->map(fn
                            ($unitPrice) => $unitPrice->season !== null ? $unitPrice->season->name : '')->join(', ').'</b>'.' sezonları için fiyatlar silinecektir!';
                    }
                    return [
                        'id' => $view->id,
                        'name' => $view->name,
                        'warning_message' => $warningMessage,
                    ];
                }),
                'features' => $roomType->features->map(fn($feature) => [
                    'id' => $feature->id,
                    'name' => $feature->name,
                    'order_no' => $feature->pivot->order_no,
                ]),
                'photos' => $roomType->getMedia('room_type_photos')->map(fn($media) => [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                ]),
            ],
            'views' => RoomView::orderBy('id')->get(['id', 'name']),
            'features' => RoomTypeFeature::orderBy('order_no')->get(['id', 'name', 'order_no']),
            'beds' => BedType::orderBy('id')->get(['id', 'name']),
        ]);
    }

    public function photoAdd(RoomType $roomType)
    {
        try {
            $photo = Request::file('file');
            $roomType
                ->addMedia($photo)
                ->usingFileName(Strings::webalize(str_replace($photo->getClientOriginalExtension(), '', $photo->getClientOriginalName())))
                ->toMediaCollection('room_type_photos');
            $uploadedPhoto = $roomType->getMedia('room_type_photos')->last();
            return response()->json([
                'message' => 'Fotoğraf başarıyla eklendi.',
                'photo' => [
                    'id' => $uploadedPhoto->id,
                    'url' => $uploadedPhoto->original_url,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function photosOrdersUpdate(RoomType $roomType, Request $request)
    {
        $roomType->getMedia('room_type_photos')->each(function (Media $media) {
            if ($media->id != Request::get('media_id')) {
                if (Request::get('new_order_no') > Request::get('old_order_no')) {
                    if ($media->order_column > Request::get('old_order_no') && $media->order_column <= Request::get('new_order_no')) {
                        $media->order_column--;
                        $media->save();
                    }
                } else {
                    if ($media->order_column >= Request::get('new_order_no') && $media->order_column < Request::get('old_order_no')) {
                        $media->order_column++;
                        $media->save();
                    }
                }
            } else {
                $media->order_column = Request::get('new_order_no');
                $media->save();
            }
        });
    }

    public function photoDelete(RoomType $roomType, $photo_id)
    {
        $deletedPhoto = $roomType->getMedia('room_type_photos')->find($photo_id);
        $roomType->getMedia('room_type_photos')->each(function (Media $media) use ($deletedPhoto) {
            if ($media->id != $deletedPhoto->id) {
                if ($media->order_column > $deletedPhoto->order_column) {
                    $media->order_column--;
                    $media->save();
                }
            }
        });
        $deletedPhoto->delete();
    }

    public function roomTypeBedAdd(RoomType $roomType, TypeHasBedsRequest $request)
    {
        $data = $request->validated();
        $roomType->beds()->attach([$data['bed_type_id'] => ['count' => $data['count']]]);
    }


    public function roomTypeBedEdit(RoomType $roomType, $bed_id, TypeHasBedsRequest $request)
    {
        $typeHasBed = $roomType->beds->find($bed_id);
        $typeHasBed->pivot->count = $request->count;
        $typeHasBed->pivot->save();
    }

    public function roomTypeBedDelete(RoomType $roomType, $bed_id)
    {
        $roomType->beds()->detach($bed_id);
    }

    public function roomTypeViewAdd(RoomType $roomType, TypeHasViewRequest $request)
    {
        $roomType->views()->attach($request->view_id);
    }

    public function roomTypeViewDelete(RoomType $roomType, $view_id)
    {
        $roomType->typeHasViews->where('view_id', $view_id)->map(function ($typeHasView) {
            $typeHasView->unitPrices->each(function ($unitPrice) {
                $unitPrice->delete();
            });
            $typeHasView->rooms->each(function ($room) {
                $room->delete();
            });
            $typeHasView->delete();
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public
    function update(UpdateRoomTypeRequest $request, RoomType $roomType)
    {
        $data = $request->validated();
        $roomType->fill([
            'name' => $data['name'],
            'description' => $data['description'],
            'size' => $data['size'],
            'adult_capacity' => $data['adult_capacity'],
            'child_capacity' => $data['child_capacity'],
            'room_count' => $data['room_count'],
        ]);
        if (in_array('adult_capacity', array_keys($roomType->getDirty())) || in_array('child_capacity', array_keys($roomType->getDirty()))) {
            $helper = new Helper();
            $roomType->possibilitiesOfGuests()->delete();
            $roomType->possibilitiesOfGuests()->createMany($helper->guestVariations($data['adult_capacity'], $data['child_capacity']));
        }
        $roomType->update($roomType->getDirty());
        $roomType->features()->sync($data['room_type_features']);
        return redirect()->back()
            ->with('success', 'Oda türü başarıyla güncellendi.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public
    function destroy(RoomType $roomType)
    {
        $roomType->rooms()->delete();
        $roomType->typeHasViews()->delete();
        $roomType->features()->detach();
        $roomType->beds()->detach();
        $roomType->variationsOfGuests()->delete();
        $roomType->unitPrices()->delete();
        $roomType->delete();
    }
}
