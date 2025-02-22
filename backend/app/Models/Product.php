<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'sku', 'barcode', 'qr_code', 'price', 'stock_quantity', 'low_stock_threshold', 'category_id', 'supplier_id', 'store_id'];
    protected $dates = ['deleted_at']; // ✅ Ensure deleted_at is treated as a date

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }


    /**
     * ✅ Define Many-to-Many Relationship with Stores (store_products pivot table)
     */
    public function stores(): BelongsToMany
    {
        return $this->belongsToMany(Store::class, 'store_products')
            ->withPivot(['price', 'stock_quantity', 'low_stock_threshold'])
            ->withTimestamps();
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
    public function storeProducts()
    {
        return $this->hasMany(StoreProduct::class, 'product_id', 'id');
    }
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class, 'product_id', 'id');
    }
}
