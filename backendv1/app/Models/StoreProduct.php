<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StoreProduct extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['store_id', 'product_id', 'price', 'stock_quantity', 'low_stock_threshold'];
    protected $dates = ['deleted_at']; // ✅ Ensure deleted_at is treated as a date

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed(); // ✅ Ensure soft-deleted products are included
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
