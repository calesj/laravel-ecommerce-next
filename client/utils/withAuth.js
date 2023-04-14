import {useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { isAuthenticated } from './auth'
import axios from "axios";
import {Spinner} from "@chakra-ui/react";

const withAuth = (WrappedComponent) => {
    //aqui nos estamos encapsulando o componente que vai ser renderizado
    // pra que antes dele ser renderizado
    // a gente verifique se o usuario esta autenticado
    // ele vai verificar o retorno do metodo isAuthenticated
    // do arquivo auth.js, se for verdadeiro, ele renderiza a pagina
    // senao ele retorna para a tela de login
    const AuthenticatedComponent = (props) => {
        const [authenticated, setAuthenticated] = useState(false)
        //definindo estado do usuario
        const [userData, setUserData] = useState(null)
        const router = useRouter()

        useEffect(() => {
            const checkAuthentication = async () => {
                const isAuth = await isAuthenticated()
                setAuthenticated(isAuth)

                if (!isAuth) {
                    router.push('/login')
                } else {
                    // traz as informacoes do usario e envia como props para os componentes
                    const userDataResponse = await axios.get('http://127.0.0.1:8000/api/user', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('app-token')}` }
                    })
                    setUserData(userDataResponse.data)
                }
            }
            // assim que a pagina for renderizada, ele chama essa funcao
            checkAuthentication()
        }, [])

        // se o usuario estiver autenticado ele vai ser redirecionado pra pagina inicial, senao, aparecera uma tela
        // de carregamento que logo em siga vai redirecionar de volta pra pagina de login
        return authenticated ? <WrappedComponent {...props} userData={userData} />  : <Spinner></Spinner>
    }

    return AuthenticatedComponent
}

export default withAuth
