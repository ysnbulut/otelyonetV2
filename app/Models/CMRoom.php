<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\CMRoom
 *
 * @method static where(string $string, mixed $type_has_view_id)
 * @method static \Illuminate\Database\Eloquent\Builder|CMRoom newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CMRoom newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CMRoom onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CMRoom query()
 * @method static \Illuminate\Database\Eloquent\Builder|CMRoom withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CMRoom withoutTrashed()
 * @mixin \Eloquent
 */
class CMRoom extends Model
{
    use softDeletes;

    protected $fillable = [
        'type_has_view_id',
        'room_code',
        'stock',
    ];
}
