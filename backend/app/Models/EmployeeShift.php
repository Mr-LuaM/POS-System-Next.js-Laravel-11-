<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeShift extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'store_id', 'cash_drawer_id', 'clock_in', 'clock_out', 'total_sales'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function cashDrawer()
    {
        return $this->belongsTo(CashDrawer::class);
    }
}
