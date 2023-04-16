<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Http\Request;

use function Webmozart\Assert\Tests\StaticAnalysis\length;

class OrderController extends Controller
{
    private $request;
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function myOrders()
    {
        $user = $this->request->user();

        $orders = $user->orders;
        if(count($orders) > 0) {
            return response()->json($orders);
        } else {
            return response()->json(['message' => 'nao existe pedidos'], 204);
        }
    }
    public function store() // metodo responsavel por gerar o pedido no banco
    {
        $user = $this->request->user(); // verifica qual usuario apartir do token que vem no header

        $cart = $user->cart()->with('products')->first(); // acessando o carrinho desse usuario

        if (!$cart) { // caso o carrinho esteja vazio
            return response()->json(['error' => 'O carrinho está vazio'], 400);
        }

        $totalPrice = 0;
        $items = [];

        $order = new Order(); // iniciando o pedido

        // criando um item com o id do produto, e o id do usuario, item refere-se aos  produtos do pedido
        // cada produto sera um item do pedido
        foreach ($cart->products as $product) {
            $item = new Item();
            $item->product_id = $product->id;
            $item->quantity = $product->pivot->quantity; // aqui estamos acessando a quantidade do produto que ficou salvo na tabela pivot
            $item->price = $product->price; // preco
            $item->order_id = $order->id;
            $totalPrice += $item->quantity * $item->price;

            $items[] = $item;
        }
        $order->total_price = $totalPrice;
        $order->status = 'iniciado';
        $order->user_id = $user->id;

        $order->save();
        $order->items()->saveMany($items);
        $cart->products()->detach();

        return response()->json(['message' => 'Pedido criado com sucesso']);
    }

}
