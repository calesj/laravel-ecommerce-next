<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [\App\Http\Controllers\AuthApiController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthApiController::class, 'login']);

// Ao usar o middleware "auth:sanctum", o Laravel verificará se o token de autenticação fornecido na solicitação
// é válido
Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
    Route::post('', [\App\Http\Controllers\CartController::class, 'addToCart']);
    Route::get('', [\App\Http\Controllers\CartController::class, 'getProductsCart']);
    Route::delete('/{id}', [\App\Http\Controllers\CartController::class, 'removeFromCart']);
    Route::delete('', [\App\Http\Controllers\CartController::class, 'deleteAllProductsFromCart']);
});

Route::middleware('auth:sanctum')->prefix('order')->group(function () {
    Route::post('', [\App\Http\Controllers\OrderController::class, 'store']);
    Route::get('', [\App\Http\Controllers\OrderController::class, 'myOrders']);
});
