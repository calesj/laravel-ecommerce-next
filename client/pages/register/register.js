import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Card,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navIndex";
import Cookies from 'js-cookie'

const Register = () => {
    const [errorValidate, setErrorValidate] = useState("");
    const [errorRegister, setErrorRegister] = useState("");
    const [isLoading, setIsLoading] = useState(false); // adicionado estado isLoading
    const router = useRouter();

    // metodo que faz a requisicao de registro no banco
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        setIsLoading(true); // define o estado isLoading como true para exibir o overlay
        axios
            .post("http://127.0.0.1:8000/api/register", formData)
            .then((response) => {
                const { data } = response;
                if (data) {
                    const expires = new Date(Date.now() + 60 * 60 * 1000) // expira em 1 hora
                    Cookies.set('app_token', data.access_token, { expires })
                    router.push("/");
                }
            })
            .catch((error) => {
                setErrorValidate(error.response.data.errors);
                setErrorRegister(error.response.data.error);
                console.log(error.response.data.errors || error.response.data.error);
            })
            .finally(() => {
                setIsLoading(false); // define o estado isLoading como false para ocultar o overlay
            });
    };
return (
    <div>
        <Navbar/>
        {errorRegister && (
            <Alert
                status="error"
                position="absolute"
                bottom="70%"
                maxW="sm"
                rounded="md"
                bgGradient="linear(to-r, red.500, pink.500)"
                left="50%"
                transform="translateX(-50%)"
            >
                <AlertIcon />
                {errorRegister}
            </Alert>
        )}
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="gray.100"
        >
            <Card width="400px" padding={5} variant="outline" boxShadow="md">
                <form onSubmit={handleSubmit}>
                    <FormControl
                        isInvalid={
                            (errorValidate && errorValidate.name) || errorRegister
                        }
                    >
                        <FormLabel>Nome</FormLabel>
                        <Input name="name" type="text" />
                        <FormErrorMessage>
                            {errorValidate && errorValidate.name}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl
                        isInvalid={
                            (errorValidate && errorValidate.email) || errorRegister
                        }
                    >
                        <FormLabel>Email</FormLabel>
                        <Input name="email" type="email" />
                        <FormErrorMessage>
                            {errorValidate && errorValidate.email}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl
                        isInvalid={
                            (errorValidate && errorValidate.password) || errorRegister
                        }
                    >
                        <FormLabel>Senha</FormLabel>
                        <Input name="password" type="password" />
                        <FormErrorMessage>
                            {errorValidate && errorValidate.password}
                        </FormErrorMessage>
                    </FormControl>
                        <Button
                            type="submit"
                            variant="solid"
                            backgroundColor="blue.500"
                            color="white"
                            _hover={{ backgroundColor: "blue.600" }}
                            marginTop={6}
                            width="full"
                        >
                            Enviar
                        </Button>
                    </form>
                </Card>
            </Box>
        </div>
    );
};

export default Register;
