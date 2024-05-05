<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Plank\Mediable\Media;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableInterface;

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
 * @property-read Collection<int, UnitPrice > $unitPrices
 * @property-read int|null $unit_prices_count
 * @property-read Collection<int, VariationMultiplier> $variationMultipliers
 * @property-read int|null $variation_multipliers_count
 * @property-read Collection<int, VariationsOfGuestsRoomType> $variationsOfGuests
 * @property-read int|null $variations_of_guests_count
 * @property-read Collection<int, RoomView> $views
 * @property-read int|null $views_count
 * @method static Builder|RoomType newModelQuery()
 * @method static Builder|RoomType newQuery()
 * @method static Builder|RoomType onlyTrashed()
 * @method static Builder|RoomType query()
 * @method static Builder|RoomType withTrashed()
 * @method static Builder|RoomType withoutTrashed()
 * @property-read int|null $media_count
 * @property-read Collection<int, Media> $media
 * @method static \Plank\Mediable\MediableCollection<int, static> all($columns = ['*'])
 * @method static \Plank\Mediable\MediableCollection<int, static> get($columns = ['*'])
 * @method static Builder|RoomType whereHasMedia($tags = [], bool $matchAll = false)
 * @method static Builder|RoomType whereHasMediaMatchAll($tags)
 * @method static Builder|RoomType withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static Builder|RoomType withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static Builder|RoomType withMediaAndVariantsMatchAll($tags = [])
 * @method static Builder|RoomType withMediaMatchAll(bool $tags = [], bool $withVariants = false)
 * @mixin Eloquent
 */
class RoomType extends Model implements MediableInterface
{
    use SoftDeletes, Mediable;


    protected $fillable = ['name', 'description', 'size', 'adult_capacity', 'child_capacity', 'room_count'];

    public function rooms(): HasManyThrough
    {
        return $this->hasManyThrough(Room::class, TypeHasView::class, 'type_id', 'type_has_view_id', 'id', 'id');
    }

    public function beds(): BelongsToMany
    {
        return $this->belongsToMany(BedType::class, 'type_has_beds', 'type_id', 'bed_type_id')->withPivot(['id','count']);
    }

    public function views(): BelongsToMany
    {
        return $this->belongsToMany(RoomView::class, 'type_has_views', 'type_id', 'view_id')->withPivot('id');
    }

    public function typeHasViews(): HasMany
    {
        return $this->hasMany(TypeHasView::class, 'type_id', 'id');
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(RoomTypeFeature::class, 'type_has_features', 'type_id', 'feature_id')->withPivot('id', 'order_no');
    }

    public function unitPrices(): HasManyThrough
    {
        return $this->hasManyThrough(
            UnitPrice::class,
            TypeHasView::class,
            'type_id',
            'type_has_view_id',
            'id',
            'id'
        );
    }

    public function variationsOfGuests(): HasMany
    {
        return $this->hasMany(VariationsOfGuestsRoomType::class, 'room_type_id', 'id');
    }

    public function variationMultipliers(): HasMany
    {
        return $this->hasMany(VariationMultiplier::class, 'room_type_id', 'id');
    }
}
