<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\UnitPrice
 *
 * @property mixed $id
 * @property mixed $season
 * @property mixed $type_has_view_id
 * @property mixed $unit_price
 * @property-read string $type_and_wiew_name
 * @property-read RoomType|null $roomType
 * @property-read RoomView|null $roomView
 * @property-read TypeHasView|null $typeHasView
 * @method static Builder|UnitPrice newModelQuery()
 * @method static Builder|UnitPrice newQuery()
 * @method static Builder|UnitPrice onlyTrashed()
 * @method static Builder|UnitPrice query()
 * @method static Builder|UnitPrice withTrashed()
 * @method static Builder|UnitPrice withoutTrashed()
 * @mixin \Eloquent
 */
class UnitPrice extends Model
{
    use SoftDeletes;

    protected $fillable = ['type_has_view_id', 'season_id', 'booking_channel_id', 'unit_price'];

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(BookingChannel::class);
    }

    public function typeHasView(): BelongsTo
    {
        return $this->belongsTo(TypeHasView::class);
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class, 'type_has_view_id', 'id', 'type_has_views');
    }

    public function roomView(): BelongsTo
    {
        return $this->belongsTo(RoomView::class, 'type_has_view_id', 'id', 'type_has_views');
    }

    public function getTypeAndWiewNameAttribute(): string
    {
        return $this->roomType->name . ' ' . $this->roomView->name;
    }

    public function cmTransaction(): morphTo
    {
        return $this->morphTo(CMTransaction::class, 'transactionable');
    }
}
