# laravel-ecommerce-nextjs

## Tecnologias utilizadas
- Laravel
- Next.js
- PHP
- JavaScript
- React
- Chakra UI (biblioteca)
- Composer
- Yarn ou NPM
## Instalação
1 - Crie um banco de dados (de preferência `MYSQL`). Utilizei o `MySQL Workbench` para a criação do banco.

2 - Acesse o diretório `server` e configure o arquivo `.env` com os respectivos dados do banco (caso não exista, renomeie o `.env.example` para `.env`).

3 - No diretório `server`, execute o comando `composer install`.

4 - Após a finalização da instalação dos pacotes, execute o comando `php artisan migrate`. Este comando irá criar as tabelas no banco de dados.

5 - Execute o comando `php artisan serve` para iniciar o servidor local na sua máquina.

6 - No diretório `client`, execute o comando `yarn install` para a instalação dos pacotes de front-end ou `npm install` caso utilize `npm`.

7 - Após o download dos pacotes, execute o comando `yarn dev` no terminal para iniciar o servidor local do cliente.

8 - Com o servidor local ativo, em ambos os diretórios, acesse `http://localhost:3000/` para utilizar a aplicação.

## Observações

Tive dificuldades no início por não ter experiência com o desenvolvimento de front-end usando Next.js. No entanto, essa experiência me permitiu perceber o quão poderoso é o React e a sua utilidade para criar diversas aplicações. Comecei desenvolvendo todo o layout utilizando o React e, durante esses três dias, refiz o front-end várias vezes devido a bugs na aplicação. Depois de pesquisar muito, consegui desenvolver de uma maneira mais eficiente, separei os componentes em um diretório diferente e criei um ContextCart para manipular melhor os itens do carrinho entre as páginas.

O carrinho de compras é relacionado com o usuario parte do banco e quando um produto é adicionado a ele, ele é salvo no carrinho até que o usuário o remova.

Lembrando que fazer um pedido e adicionar um produto ao carrinho são coisas diferentes. Ambos estão disponíveis na aplicação e ambos são salvos no banco.

## Autenticação

Utilizei o middleware de autenticação fornecido pelo Laravel para fazer a autenticação na aplicação. O processo é simples: o usuário faz a requisição passando o e-mail e a senha, se estiverem corretos, o servidor retorna um token de autenticação. Com esse token, podemos realizar as requisições que precisam de autenticação na API. No front-end, armazenamos o token e antes de realizar qualquer requisição, verificamos se o token é válido. Se não for, redirecionamos o usuário para a tela de login.


## diretórios importantes client

- No diretório `utils`, estarão os arquivos que criei para fazer a autenticação.
- No diretório `components`, estarão os componentes necessários para que a aplicação funcione corretamente.

## A lógica utilizada para consumir duas APIs diferentes de fornecedores.

O maior problema que enfrentei foi a possibilidade de existirem dois produtos com o mesmo ID provenientes de APIs diferentes. Para contornar isso, implementei o campo origins no banco de dados, que armazena 'BRA' caso o produto seja proveniente da API brasileira e 'EU' caso seja proveniente da API europeia. Além disso, renomeei o ID original para api_id, permitindo que o Laravel crie um ID universal para todos os produtos independentemente da API de origem. 

Eu decidi não salvar todos os produtos de uma só vez no banco de dados para evitar sobrecarregar o servidor. Então, sempre que um usuário adiciona um produto ao carrinho, as informações desse produto são salvas no banco, caso ainda não existam.

