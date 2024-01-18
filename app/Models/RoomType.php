<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * App\Models\RoomType
 *
 * @property-read Collection<int, BedType> $beds
 * @property-read int|null $beds_count
 * @property-read Collection<int, BedType> $bedsWithCount
 * @property-read int|null $beds_with_count_count
 * @property-read Collection<int, RoomTypeFeature> $features
 * @property-read int|null $features_count
 * @property-read Collection<int, Room> $rooms
 * @property-read int|null $rooms_count
 * @property-read Collection<int, TypeHasView> $typeHasViews
 * @property-read int|null $type_has_views_count
 * @property-read Collection<int, UnitPriceRoomTypeAndView> $unitPrices
 * @property-read int|null $unit_prices_count
 * @property-read Collection<int, VariationMultiplier> $variationMultipliers
 * @property-read int|null $variation_multipliers_count
 * @property-read Collection<int, VariationsOfGuestsRoomType> $variationsOfGuests
 * @property-read int|null $variations_of_guests_count
 * @property-read Collection<int, RoomView> $views
 * @property-read int|null $views_count
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType query()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType withoutTrashed()
 * @mixin Eloquent
 */
class RoomType extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;


    protected $fillable = ['name', 'description', 'size', 'adult_capacity', 'child_capacity', 'room_count'];

    public function rooms(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(Room::class, TypeHasView::class, 'type_id', 'type_has_view_id', 'id', 'id');
    }

    public function beds(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(BedType::class, 'type_has_beds', 'type_id', 'bed_type_id')->withPivot(['id','count']);
    }

    public function views(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(RoomView::class, 'type_has_views', 'type_id', 'view_id')->withPivot('id')
            ->wherePivotNull('deleted_at');
    }

    public function typeHasViews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TypeHasView::class, 'type_id', 'id');
    }

    public function features(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(RoomTypeFeature::class, 'type_has_features', 'type_id', 'feature_id')->withPivot('id', 'order_no');
    }

    public function unitPrices(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            UnitPriceRoomTypeAndView::class,
            TypeHasView::class,
            'type_id',
            'type_has_view_id',
            'id',
            'id'
        );
    }

    public function variationsOfGuests(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(VariationsOfGuestsRoomType::class, 'room_type_id', 'id');
    }

    public function variationMultipliers(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(VariationMultiplier::class, 'room_type_id', 'id');
    }
}
