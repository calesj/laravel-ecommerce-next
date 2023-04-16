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
        'quantity' => 'required|numeric'
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
            $product = Product::where('api_id', $this->request->api_id)->where('origins', $this->request->origins)->first();
            // lembrando que podem existir dois produtos com o mesmo nome, e o mesmo api_id, por isso incrementamos o origins,
            // pra verificar se o campo esta vindo da API da europa ou da API do brasil
            if (!$product){
                $product = new Product;
                $product->api_id = $this->request->api_id;
                $product->origins = $this->request->origins;
                $product->name = $this->request->name;
                $product->image = $this->request->image;
                $product->description = $this->request->description;
                $product->category = $this->request->category;
                $product->price = $this->request->price;
                $product->material = $this->request->material;
                $product->department = $this->request->department;
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
        $product = Product::where('api_id', $id)->first();
            try {

                $user->cart->products()->detach($product->id);

            } catch (QueryException $e) {
                return response()->json($e);
            }
        }

    public function deleteAllProductsFromCart()
    {
        $user = $this->request->user();

        // atraves desse usuario, ele retorna os produtos que estao no carrinho desse usuario
        $products = Product::all();

        try {
            foreach ($products as $product) {
                // apaga todos os produtos do carrinho de uma vez
                $user->cart->products()->detach($product->id);
            }

            return response()->json(['message' => 'produtos removidos do carrinho']);
        }
        catch (QueryException $e) {
                return response()->json($e);
            }
    }
}
