<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['store_id', 'description', 'amount', 'expense_date'];
    protected $dates = ['deleted_at']; // ✅ Ensure deleted_at is treated as a date

    // ✅ Relationship: An expense belongs to a store
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
