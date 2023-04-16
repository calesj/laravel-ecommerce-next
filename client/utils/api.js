import axios from "axios";
import Cookies from "js-cookie";


// esse metodo verifica se existe um token, e se esse token, e um token valido, retornando os dados do usuario
// geralmente utilizaremos ele pra caso o usuario ja estiver logado, e tentar acessar uma rota de login, ou registro
// ele ser redirecionado pra pagina home
export const getUserData = async () => {
    // acessando o cookie 'app_token'
    const token = Cookies.get("app_token");
    if (!token) {
        // Se não houver token no cookie, retorna null
        return null;
    }
    // configurando
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", config);
        const userData = response.data;
        return userData;
    } catch (error) {
        Cookies.remove('app_token')
        console.log("Error getting user data:", error);
        return null;
    }
};

// esse metodo, recebe a url da API, o tipo HTTP de requisicao, e os dados, caso necessario, utilizamos esse metodo
// pra nao precisar setar o token na requisicao toda hora
export const makeRequest = async (url, method = "get", data = null) => {
    const token = Cookies.get("app_token");
    // se nao existir token retorna nullo
    if (!token) {
        return false
    }

    // definindo o token no header
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios({
            method,
            url,
            data,
            ...config,
        });

        return response.data;
    } catch (error) {
        console.log("Error making request:", error);
        throw error;
    }
};

