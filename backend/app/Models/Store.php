<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'location'];

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
}
