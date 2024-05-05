<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\DocumentPayment
 *
 * @method static Builder|DocumentPayment newModelQuery()
 * @method static Builder|DocumentPayment newQuery()
 * @method static Builder|DocumentPayment query()
 * @mixin \Eloquent
 * @property mixed $transaction
 */
class DocumentPayment extends Model
{
    protected $fillable = [
        'document_id',
        'transaction_id',
        'amount',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
