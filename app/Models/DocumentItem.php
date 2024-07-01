<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\DocumentItem
 *
 * @property-read \App\Models\Document|null $document
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DocumentItemTax> $taxes
 * @property-read int|null $taxes_count
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentItem onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentItem withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentItem withoutTrashed()
 * @mixin \Eloquent
 */
class DocumentItem extends Model
{
    use softDeletes;

    protected $fillable = [
        'document_id',
        'item_id',
        'name',
        'description',
        'quantity',
        'price',
        'tax_name',
        'tax_rate',
        'tax',
        'total',
        'discount',
        'grand_total',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
