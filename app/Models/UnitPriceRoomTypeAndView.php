<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\UnitPriceRoomTypeAndView
 *
 * @property-read mixed $type_and_wiew_name
 * @property-read \App\Models\RoomType|null $roomType
 * @property-read \App\Models\RoomView|null $roomView
 * @property-read \App\Models\Season|null $season
 * @property-read \App\Models\TypeHasView|null $typeHasView
 * @method static \Database\Factories\UnitPriceRoomTypeAndViewFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPriceRoomTypeAndView newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPriceRoomTypeAndView newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPriceRoomTypeAndView onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPriceRoomTypeAndView query()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPriceRoomTypeAndView withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPriceRoomTypeAndView withoutTrashed()
 * @mixin \Eloquent
 */
class UnitPriceRoomTypeAndView extends Model
{
 use HasFactory, SoftDeletes;

 protected $fillable = ['type_has_view_id', 'season_id', 'unit_price'];

 public function season()
 {
  return $this->belongsTo(Season::class);
 }

 public function typeHasView()
 {
  return $this->belongsTo(TypeHasView::class);
 }

 public function roomType()
 {
  return $this->belongsTo(RoomType::class, 'type_has_view_id', 'id', 'type_has_views');
 }

 public function roomView()
 {
  return $this->belongsTo(RoomView::class, 'type_has_view_id', 'id', 'type_has_views');
 }

 public function getTypeAndWiewNameAttribute()
 {
  return $this->roomType->name . ' ' . $this->roomView->name;
 }
}
