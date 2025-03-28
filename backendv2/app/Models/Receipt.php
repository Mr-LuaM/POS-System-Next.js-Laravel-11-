<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = ['sale_id', 'receipt_template'];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
