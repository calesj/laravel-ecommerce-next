<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    private $rules = [
        'api_id' => 'required',
        'origins' => 'required',
        'name' => 'required',
        'price' => 'required|numeric',
        'quantity' => 'required'
    ];

    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function addToCart()
    {
        DB::beginTransaction();

        $validate = FormValidation::validar($this->request->all(), $this->rules);

        if ($validate !== true) {
            return $validate;
        }

        try {
            // quando o usuario esta autenticado, um token e gerado pra identificar esse usuario,
            // o cliente salva esse token no localStorage da pagina, de uma forma que toda requisicao que esse usuario
            // fizer, ela envie esse token como parametro automaticamente de forma escondida
            // aqui ele esta enviando o token de autenticacao
            // o proprio laravel identifica o usuario atraves desse token, e faz o trabalho aqui em cima desse usuario
            $user = $this->request->user();

            // aqui estamos verificando se o produto existe no banco, se nao existir ele cria um novo
            $product = Product::where('api_id', $this->request->api_id)->first();
            if (!$product){
                $product = new Product;
                $product->name = $this->request->name;
                $product->api_id = $this->request->api_id;
                $product->origins = $this->request->origins;
                $product->price = $this->request->price;
                $product->save();
            }


            // acessando o carrinho de compras atraves do usuario, depois acessamos o metodo
            // products do model cart, e adicionamos o produto salvo a ele
            $user->cart->products()->attach($product, ['quantity' => $this->request->quantity]);

            DB::commit();

            return response()->json(['message' => 'Produto adicionado ao carrinho']);

        } catch (QueryException $e) {
            DB::rollBack();

            return response()->json($e);
        }

    }

    public function getProductsCart()
    {
        // com o token de acesso, ele verifica qual o usuario esta fazendo a requisicao
        $user = $this->request->user();

        // atraves desse usuario, ele retorna os produtos que estao no carrinho desse usuario
        $cart = $user->cart()->with('products')->get();

        return response()->json($cart);
    }

    public function removeFromCart($id)
    {
        $user = $this->request->user();
        $products = Product::where('api_id', $id)->get();
        foreach ($products as $product) {
            try {

                $user->cart->products()->detach($product->id);

            } catch (QueryException $e) {
                return response()->json($e);
            }
        }

    }

}
