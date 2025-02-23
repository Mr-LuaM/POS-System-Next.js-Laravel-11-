<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMovement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['store_product_id', 'type', 'quantity', 'reason'];

    protected $dates = ['deleted_at']; // ✅ Ensure deleted_at is treated as a date

    /**
     * ✅ Relationship with StoreProduct
     */
    public function storeProduct()
    {
        return $this->belongsTo(StoreProduct::class);
    }

    /**
     * ✅ Relationship to Product (through StoreProduct)
     */
    public function product()
    {
        return $this->hasOneThrough(Product::class, StoreProduct::class, 'id', 'id', 'store_product_id', 'product_id');
    }

    /**
     * ✅ Relationship to Store (through StoreProduct)
     */
    public function store()
    {
        return $this->hasOneThrough(Store::class, StoreProduct::class, 'id', 'id', 'store_product_id', 'store_id');
    }
}
