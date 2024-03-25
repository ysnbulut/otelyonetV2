<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingRoomTask
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomTask newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomTask newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomTask query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomTask onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomTask withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomTask withoutTrashed()
 * @mixin \Eloquent
 */
class BookingRoomTask extends Model
{
    use softDeletes;
}
