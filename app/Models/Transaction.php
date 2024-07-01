<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Transaction
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction query()
 * @mixin \Eloquent
 */
class Transaction extends Model
{
    use softDeletes;

    protected $fillable = [
        'customer_id',
        'type',
        'bank_id',
        'paid_at',
        'description',
        'amount',
        'currency',
        'currency_rate',
        'payment_method',
    ];

    public function customer() : BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function bank() : BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    public function documents(): hasManyThrough
    {
        return $this->hasManyThrough(Document::class, DocumentPayment::class, 'transaction_id', 'id', 'id', 'document_id');
    }
}
