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
