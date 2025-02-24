<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyPoint extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'points'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
