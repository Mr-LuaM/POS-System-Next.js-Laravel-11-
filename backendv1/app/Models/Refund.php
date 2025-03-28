<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    use HasFactory;

    protected $fillable = ['sale_id', 'amount', 'reason'];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
