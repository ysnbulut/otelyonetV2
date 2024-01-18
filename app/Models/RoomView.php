<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\RoomView
 *
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView query()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView withoutTrashed()
 * @mixin \Eloquent
 */
class RoomView extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description'];

    public function rooms(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(Room::class,   TypeHasView::class,
            'view_id',
            'type_has_view_id',
            'id',
            'id');
    }

    public function roomTypes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(RoomType::class, 'type_has_views', 'view_id', 'type_id');
    }

    public function unitPrices(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            UnitPriceRoomTypeAndView::class,
            TypeHasView::class,
            'view_id',
            'type_has_view_id',
            'id',
            'id'
        );
    }
}
