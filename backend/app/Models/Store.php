<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'location'];

    protected $dates = ['deleted_at']; // ✅ Ensure deleted_at is treated as a date

    /**
     * ✅ Define Relationship: A store has many sales.
     */
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * ✅ Define Relationship: A store has many products.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * ✅ Define Relationship: A store has many employee shifts.
     */
    public function employeeShifts()
    {
        return $this->hasMany(EmployeeShift::class);
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
}
