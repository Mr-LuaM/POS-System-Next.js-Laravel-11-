<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashDrawer extends Model
{
    use HasFactory;

    protected $fillable = ['store_id', 'opening_balance', 'closing_balance'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
