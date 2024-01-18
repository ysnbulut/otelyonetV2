<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\RoomTypeFeature
 *
 * @property-read Collection<int, RoomType> $roomTypes
 * @property-read int|null $room_types_count
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature query()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature withoutTrashed()
 * @mixin Eloquent
 */
class RoomTypeFeature extends Model
{
    use SoftDeletes;

    protected $fillable = ['order_no', 'name', 'is_paid'];

    protected static function booted()
    {
        static::creating(function ($roomTypeFeature) {
            $roomTypeFeature->order_no = self::max('order_no') + 1;
        });

        static::updated(function ($roomTypeFeature) {
            if ($roomTypeFeature->isDirty('order_no')) {
                if (request()->has('old_order_no') && request()->has('new_order_no')) {
                    if ($roomTypeFeature->trashed()) {
                        if (request()->old_order_no > request()->new_order_no) {
                            self::onlyTrashed()->where('order_no', '>=', request()->new_order_no)
                                ->where('order_no', '<', request()->old_order_no)->whereKeyNot($roomTypeFeature->id)
                                ->increment('order_no');
                        } else {
                            self::onlyTrashed()->where('order_no', '>', request()->old_order_no)
                                ->where('order_no', '<=', request()->new_order_no)->whereKeyNot($roomTypeFeature->id)
                                ->decrement('order_no');
                        }
                    } else {
                        if (request()->old_order_no > request()->new_order_no) {
                            self::where('order_no', '>=', request()->new_order_no)
                                ->where('order_no', '<', request()->old_order_no)->whereKeyNot($roomTypeFeature->id)
                                ->increment('order_no');
                        } else {
                            self::where('order_no', '>', request()->old_order_no)
                                ->where('order_no', '<=', request()->new_order_no)->whereKeyNot($roomTypeFeature->id)
                                ->decrement('order_no');
                        }
                    }
                }
            }
        });

        static::restored(function ($roomTypeFeature) {
            self::onlyTrashed()->where('order_no', '>', $roomTypeFeature->order_no)
                ->increment('order_no');
            $roomTypeFeature->update(['order_no' => request()->order_no]);
            self::where('order_no', '>=', request()->order_no)->whereKeyNot($roomTypeFeature->id)
                ->increment('order_no');
        });

        static::softDeleted(function ($roomTypeFeature) {
            self::where('order_no', '>', $roomTypeFeature->order_no)
                ->decrement('order_no');
            $roomTypeFeature->update(['order_no' => request()->order_no]);
            self::onlyTrashed()->where('order_no', '>=', request()->order_no)->whereKeyNot($roomTypeFeature->id)
                ->increment('order_no');
        });

        static::forceDeleted(function ($roomTypeFeature) {
            self::onlyTrashed()->where('order_no', '>', $roomTypeFeature->order_no)
                ->decrement('order_no');
        });
    }

    public function roomTypes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(RoomType::class, 'type_has_features', 'feature_id', 'type_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_no');
    }
}
