<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'sku', 'barcode', 'qr_code', 'price', 'stock_quantity', 'low_stock_threshold', 'category_id', 'supplier_id', 'store_id'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
