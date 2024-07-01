<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\DocumentTotal
 *
 * @property-read \App\Models\Document|null $document
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentTotal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentTotal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentTotal onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentTotal query()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentTotal withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentTotal withoutTrashed()
 * @mixin \Eloquent
 */
class DocumentTotal extends Model
{
    use softDeletes;

    protected $fillable = [
        'document_id',
        'type', // 'subtotal', 'tax', 'discount', 'total
        'sort_order',
        'amount',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

}
