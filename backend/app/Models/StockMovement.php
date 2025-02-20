<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMovement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['product_id', 'type', 'quantity', 'reason'];

    protected $dates = ['deleted_at']; // ✅ Ensure deleted_at is treated as a date

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
