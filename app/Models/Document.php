<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use ShiftOneLabs\LaravelCascadeDeletes\CascadesDeletes;

/**
 * App\Models\Document
 *
 * @property-read Customer|null $customer
 * @property-read Collection<int, DocumentItem> $items
 * @property-read int|null $items_count
 * @property-read Collection<int, DocumentPayment> $payments
 * @property-read int|null $payments_count
 * @property-read Collection<int, DocumentTotal> $total
 * @property-read int|null $total_count
 * @method static \Illuminate\Database\Eloquent\Builder|Document newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Document newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Document onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Document query()
 * @method static \Illuminate\Database\Eloquent\Builder|Document withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Document withoutTrashed()
 * @mixin \Eloquent
 */
class Document extends Model
{
    use softDeletes, CascadesDeletes;

    protected $fillable = [
        'type',
        'customer_id',
        'number',
        'status',
        'currency',
        'currency_rate',
        'issue_date',
        'due_date',
    ];

    protected $cascadeDeletes = ['items', 'total', 'payments'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($document) {
            $datePart = date('Ym');
            $count = static::whereYear('created_at', date('Y'))
                    ->whereMonth('created_at', date('m'))
                    ->count() + 1;
            $count = str_pad($count, 4, '0', STR_PAD_LEFT);

            $documentNumber = $datePart . $count;

            $document->number = 'OYF'.$documentNumber;
        });
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(DocumentItem::class);
    }

    public function total(): HasMany
    {
        return $this->hasMany(DocumentTotal::class)->orderBy('sort_order');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(DocumentPayment::class);
    }

    public function unit(): morphTo
    {
        return $this->morphTo();
    }
}
