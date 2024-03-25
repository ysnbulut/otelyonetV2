<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingTask
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BookingTask newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingTask newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingTask query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingTask onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingTask withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingTask withoutTrashed()
 * @mixin \Eloquent
 */
class BookingTask extends Model
{
    use softDeletes;
}
