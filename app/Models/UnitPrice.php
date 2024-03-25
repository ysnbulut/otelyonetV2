<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\UnitPrice
 *
 * @property mixed $id
 * @property mixed $season
 * @property mixed $type_has_view_id
 * @property mixed $unit_price
 * @property-read string $type_and_wiew_name
 * @property-read \App\Models\RoomType|null $roomType
 * @property-read \App\Models\RoomView|null $roomView
 * @property-read \App\Models\TypeHasView|null $typeHasView
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPrice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPrice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPrice onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPrice query()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPrice withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitPrice withoutTrashed()
 * @mixin \Eloquent
 */
class UnitPrice extends Model
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
