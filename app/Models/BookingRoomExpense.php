<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingRoomExpense
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomExpense newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomExpense newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomExpense onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomExpense query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomExpense withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRoomExpense withoutTrashed()
 * @mixin \Eloquent
 */
class BookingRoomExpense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_room_id',
        'expense_type',
        'name',
        'quantity',
        'price',
        'tax',
        'total',
        'description',
    ];
}
