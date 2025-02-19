<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // ✅ Import SoftDeletes

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'contact', 'email', 'address'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
    protected $dates = ['deleted_at']; // ✅ Track when it's archived

}
