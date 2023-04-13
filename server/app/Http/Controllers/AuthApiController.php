<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthApiController extends Controller
{
    private $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8'
    ];

    public function register(Request $request)
    {

        // Valide os dados do formulário de registro
        $validate = FormValidation::validar($request->all(), $this->rules);

        if ($validate !== true) {
            return $validate;
        }

        // Crie uma nova instância do modelo Userph
        $user = new User;

        // Atribua os valores dos campos do formulário ao modelo User
        $user->name = $request['name'];
        $user->email = $request['email'];
        $user->password = bcrypt($request['password']);

        // Salve o usuário no banco de dados
        $user->save();

        // Faça o login do usuário recém-registrado
        Auth::login($user);

        // Crie um token de acesso para o usuário
        $accessToken = $user->createToken('authToken')->plainTextToken;

        // Retorne a resposta JSON com o token de acesso
        return response()->json([
            'user' => $user,
            'access_token' => $accessToken
        ]);
    }

    public function login(Request $request)
    {

        $rules = [
            'email' => 'required|email',
            'password' => 'required|string'
        ];

        $validate = FormValidation::validar($request->all(), $rules);

        // validando as informacoes
        if ($validate !== true) {
            return $validate;
        }

        //obter apenas as informações relevantes do objeto de solicitação, que neste caso são o e-mail e a senha do usuário.
        $credentials = $request->only('email', 'password');

        /*
         * usando o método attempt() da classe Auth para tentar autenticar o usuário com as credenciais fornecidas.
         *  Se a autenticação for bem-sucedida, o método retorna true e o fluxo de execução continua.
         * verifica se existe um usuario com os dados fornecidos e autenticc
         */
        if (Auth::attempt($credentials)) {
            //Esta linha obtém o usuário autenticado a partir do objeto de solicitação.
            $user = $request->user();

            /*
             * Aqui, estamos criando um token de acesso para o usuário autenticado usando o método createToken()
             * do modelo User e armazenando-o na variável $token. O método createToken() cria um novo token de
             * acesso associado ao usuário atual e o retorna como um objeto PersonalAccessToken. Estamos usando o
             * método plainTextToken para obter o token de acesso como uma string de texto simples para ser retornada
             * na resposta JSON.
             */
            $token = $user->createToken('access_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

        return response()->json([
            'error' => 'Unauthorized',
        ], 401);
    }
}
