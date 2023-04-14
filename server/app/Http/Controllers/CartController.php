<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class CartController extends Controller
{

    public function index()
    {
        $carts = Cart::all();

        if (!$carts) {
            return response()->json(['message' => 'recurso nao encontrado'], 204);
        }

        return response()->json($carts);
    }

    public function show($id)
    {
        $cart = Cart::first($id);
        if (!$cart) {
            return response()->json(['message' => 'recurso nao encontardo'], 204);
        }

        return response()->json($cart);
    }

    public function store(Request $request)
    {
        try {
            $cart = new Cart();
            $cart->name = $request->nome;
            $cart->description = $request->description;
            $cart->price = $request->price;
            $cart->category = $request->category;
            $cart->save();
            return response()->json(['message' => 'Oba, deu certo!']);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado!'], 501);
        }
    }

    public function update($id, Request $request)
    {
        try {
            $cart = Cart::first($id);
            if (!$cart) {
                return response()->json(['message' => 'recurso nao encontado', 204]);
            }
            $cart->name = $request->nome;
            $cart->save();
        } catch (QueryException $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado'], 501);
        }
    }

    public function delete($id)
    {
        $cart = Cart::first($id);
        if (!$cart) {
            return response()->json(['message' => 'recurso nao encontado', 204]);
        }

        $cart->delete();
    }
}
