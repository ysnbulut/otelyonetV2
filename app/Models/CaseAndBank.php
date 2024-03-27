<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\CaseAndBank
 *
 * @property-read Collection<int, BookingPayment> $transactions
 * @property-read int|null $transactions_count
 * @method static Builder|CaseAndBank balance()
 * @method static Builder|CaseAndBank filter(array $filters)
 * @method static Builder|CaseAndBank newModelQuery()
 * @method static Builder|CaseAndBank newQuery()
 * @method static Builder|CaseAndBank onlyTrashed()
 * @method static Builder|CaseAndBank query()
 * @method static Builder|CaseAndBank withTrashed()
 * @method static Builder|CaseAndBank withoutTrashed()
 * @mixin Eloquent
 */
class CaseAndBank extends Model
{
  use SoftDeletes;

  protected $table = 'case_and_banks';

  protected $fillable = ['name', 'currency', 'type'];

  public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
  {
    return $this->hasMany(BookingPayment::class);
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
