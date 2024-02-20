<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
