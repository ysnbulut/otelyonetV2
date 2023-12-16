<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\CaseAndBanks
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CustomerPayments> $transactions
 * @property-read int|null $transactions_count
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks balance()
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks filter(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks query()
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CaseAndBanks withoutTrashed()
 * @mixin \Eloquent
 */
class CaseAndBanks extends Model
{
  use SoftDeletes;


  protected $fillable = ['name', 'currency', 'type'];

  public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
  {
    return $this->hasMany(CustomerPayments::class);
  }

  public function scopeBalance($query)
  {
    return $query->whereHas('transactions', function ($query) {
      $query->selectRaw('case_and_bank_id, sum(amount) as balance')->groupBy('case_and_bank_id');
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
