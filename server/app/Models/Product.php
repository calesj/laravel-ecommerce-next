<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_id',
        'origins',
        'name',
        'description',
        'category',
        'price',
        'material',
        'department'
    ];

    // relacionamento muito pra muitos, onde um produto pode estar presente em varios carrinhos
    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_product');
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
