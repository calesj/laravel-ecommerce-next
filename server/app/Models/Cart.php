<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // relacionamento muitos pra muitos onde um carrinho pode ter varios produtos
    public function products()
    {
        return $this->belongsToMany(Product::class, 'cart_product');
    }
}
