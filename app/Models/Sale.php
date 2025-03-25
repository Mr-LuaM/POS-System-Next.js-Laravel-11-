<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'store_id', 'total_amount', 'payment_method', 'status', 'customer_id', 'cash_drawer_id'];

    // ✅ Relationship with Store
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    // ✅ Relationship with User (Cashier)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ✅ Relationship with Customer (Optional)
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // ✅ Relationship with Sale Items
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    // ✅ FIX: Add Relationship with Payments
    public function payments()
    {
        return $this->hasMany(Payment::class, 'sale_id');
    }
}
