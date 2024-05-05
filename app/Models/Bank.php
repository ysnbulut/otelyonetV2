<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Bank
 *
 * @property-read int|null $transactions_count
 * @method static Builder|Bank balance()
 * @method static Builder|Bank filter(array $filters)
 * @method static Builder|Bank newModelQuery()
 * @method static Builder|Bank newQuery()
 * @method static Builder|Bank onlyTrashed()
 * @method static Builder|Bank query()
 * @method static Builder|Bank withTrashed()
 * @method static Builder|Bank withoutTrashed()
 * @mixin Eloquent
 */
class Bank extends Model
{
    use SoftDeletes;

    protected $table = 'banks';

    protected $fillable = ['name', 'currency', 'type'];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeBalance($query)
    {
        return $query->whereHas('transactions', function ($query) {
            $query->selectRaw('bank_id, sum(amount) as balance')->groupBy('bank_id');
        });
    }

    public function scopeFilter($query, array $filters)
    {
        $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('title', 'like', '%' . $search . '%')
                        ->orWhere('tax_number', 'like', '%' . $search . '%')
                        ->orWhere('phone', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            });
//            ->when($filters['trashed'] ?? null, function ($query, $trashed) {
//                if ($trashed === 'with') {
//                    $query->withTrashed();
//                } elseif ($trashed === 'only') {
//                    $query->onlyTrashed();
//                }
//            });
    }
}
