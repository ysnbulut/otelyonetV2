<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\CaseAndBanks
 *
 * @property-read Collection<int, BookingPayments> $transactions
 * @property-read int|null $transactions_count
 * @method static Builder|CaseAndBanks balance()
 * @method static Builder|CaseAndBanks filter(array $filters)
 * @method static Builder|CaseAndBanks newModelQuery()
 * @method static Builder|CaseAndBanks newQuery()
 * @method static Builder|CaseAndBanks onlyTrashed()
 * @method static Builder|CaseAndBanks query()
 * @method static Builder|CaseAndBanks withTrashed()
 * @method static Builder|CaseAndBanks withoutTrashed()
 * @mixin Eloquent
 */
class CaseAndBanks extends Model
{
  use SoftDeletes;


  protected $fillable = ['name', 'currency', 'type'];

  public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
  {
    return $this->hasMany(BookingPayments::class);
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
