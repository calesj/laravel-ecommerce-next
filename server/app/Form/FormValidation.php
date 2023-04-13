<?php

namespace App\Form;
use Illuminate\Support\Facades\Validator;

Class FormValidation
{
    static function validar(array $data, array $rules)
    {
        $message = [
            'required' => 'O campo :attribute é obrigatório',
            'email' => 'O formato do email esta invalido',
            'min' => 'sao necessarios pelomenos 8 caracteres'
        ];
        //fazendo as validações
        $validator = Validator::make($data, $rules, $message);

        //caso de algum erro, armazenará as mensagens de erros dentro da chave "errors"
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return true;
    }
}
