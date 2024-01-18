<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\UnitPriceRoomTypeAndView
 *
 * @property-read mixed $type_and_wiew_name
 * @property-read RoomType|null $roomType
 * @property-read RoomView|null $roomView
 * @property-read Season|null $season
 * @property-read TypeHasView|null $typeHasView
 * @method static Builder|UnitPriceRoomTypeAndView newModelQuery()
 * @method static Builder|UnitPriceRoomTypeAndView newQuery()
 * @method static Builder|UnitPriceRoomTypeAndView onlyTrashed()
 * @method static Builder|UnitPriceRoomTypeAndView query()
 * @method static Builder|UnitPriceRoomTypeAndView withTrashed()
 * @method static Builder|UnitPriceRoomTypeAndView withoutTrashed()
 * @mixin Eloquent
 */
class UnitPriceRoomTypeAndView extends Model
{
 use SoftDeletes;

 protected $fillable = ['type_has_view_id', 'season_id', 'unit_price'];

 public function season(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(Season::class);
 }

 public function typeHasView(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(TypeHasView::class);
 }

 public function roomType(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(RoomType::class, 'type_has_view_id', 'id', 'type_has_views');
 }

 public function roomView(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(RoomView::class, 'type_has_view_id', 'id', 'type_has_views');
 }

 public function getTypeAndWiewNameAttribute(): string
 {
  return $this->roomType->name . ' ' . $this->roomView->name;
 }
}
