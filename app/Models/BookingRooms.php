<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingRooms
 *
 * @method static \Database\Factories\BookingRoomsFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRooms newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRooms newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRooms onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRooms query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRooms withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingRooms withoutTrashed()
 * @mixin \Eloquent
 */
class BookingRooms extends Model
{
	protected $fillable = ['booking_id', 'room_id', 'number_of_adults', 'number_of_children'];
	use HasFactory, SoftDeletes;
}
