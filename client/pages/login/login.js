import {
    Alert, AlertIcon,
    Box,
    Button,
    Card,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input
} from "@chakra-ui/react"
import axios from 'axios'
import {useState} from "react"
import {useRouter} from "next/router";
const Login = () => {

    // definindo o estado pra armazenar erros de validacao
    const [errorValidate, setErrorValidate] = useState('')

    // definindo o estado para armazenar erro de autenticacao
    const [errorAuthenticate, setErrorAuthenticate] = useState('')

    const router = useRouter()

    // metodo submit, faz a requisicao post para API enviando os dados do formulario
    const handleSubmit = (event) => {
        // evitando que a pagina recarregue quando der submit
        event.preventDefault()

        //criando um FormData (dados de formulario) para enviar ele via post pra api
        const formData = new FormData(event.target)

        // fazendo a requisicao via post
        axios.post('http://127.0.0.1:8000/api/login', formData)
            .then(response => {
                const { data } = response
                if (data) {
                    if (data) {
                        localStorage.setItem('app-token', data.access_token)
                        router.push('/')
                    }
                }
            })
            .catch(error => {
                setErrorValidate(error.response.data.errors)
                setErrorAuthenticate(error.response.data.error)
                console.log(error.response.data.errors || error.response.data.error)
            })

    }

    return (
        <center>
            <Card mt={10} width={'400px'} padding={5} variant={'outline'}>
                <Box>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={(errorValidate && errorValidate.email) || (errorAuthenticate)}>
                            <FormLabel>Email address</FormLabel>
                            <Input name="email" type='email'/>
                            <FormHelperText>Nunca compartilhe sua conta.</FormHelperText>
                            <FormErrorMessage>{errorValidate && errorValidate.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={(errorValidate && errorValidate.password) || (errorAuthenticate)}>
                            <FormLabel>Senha</FormLabel>
                            <Input name="password" type='password'/>
                            <FormHelperText>Nunca compartilhe sua senha</FormHelperText>
                            <FormErrorMessage>{errorValidate && errorValidate.password}</FormErrorMessage>
                        </FormControl>
                            <Button type='submit'>Enviar</Button>
                    </form>
                </Box>
            </Card>
            {errorAuthenticate && (<Alert status='error'>
                <AlertIcon />
                Dados invalidos
            </Alert>
                )}
        </center>
    )
}
export default Login