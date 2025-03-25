<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discount extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'discount_value',
        'discount_type',
        'applies_to',
        'valid_until',
        'category_id',
        'product_id',
        'customer_id',
        'min_purchase_amount',
    ];

    protected $dates = ['valid_until', 'deleted_at'];

    /**
     * ✅ Relationship: Discount belongs to a Category (if applicable)
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * ✅ Relationship: Discount belongs to a Product (if applicable)
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * ✅ Relationship: Discount belongs to a Customer (if applicable)
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * ✅ Check if the discount is a percentage
     */
    public function isPercentage()
    {
        return $this->discount_type === 'percentage';
    }

    /**
     * ✅ Check if the discount is a fixed amount
     */
    public function isFixed()
    {
        return $this->discount_type === 'fixed';
    }

    /**
     * ✅ Check if the discount is valid (not expired)
     */
    public function isValid()
    {
        return $this->valid_until ? now()->lt($this->valid_until) : true;
    }
}
