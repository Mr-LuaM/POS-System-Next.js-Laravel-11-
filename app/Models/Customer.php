<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'phone', 'barcode', 'qr_code', 'address', 'city', 'state', 'state', 'zip_code'];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
