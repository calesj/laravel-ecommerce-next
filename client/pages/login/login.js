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
import {getUserData} from "@/utils/api";
import LoadingComponent from "@/components/loading";

const Login = () => {
    const [errorValidate, setErrorValidate] = useState("");
    const [errorAuthenticate, setErrorAuthenticate] = useState("");
    const [isLoading, setIsLoading] = useState(false); // adicionado estado isLoading
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const data = await getUserData();
            if (data) {
                router.push('/');
            }
            setIsLoading(false);
        }
        fetchData();
    }, [router]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        setIsLoading(true); // define o estado isLoading como true para exibir o overlay
        axios
            .post("http://127.0.0.1:8000/api/login", formData)
            .then((response) => {
                const { data } = response;
                if (data) {
                    const expires = new Date(Date.now() + 60 * 60 * 1000) // expira em 1 hora
                    Cookies.set('app_token', data.access_token, { expires })
                    router.push("/brasil");
                }
            })
            .catch((error) => {
                setErrorValidate(error.response.data.errors);
                setErrorAuthenticate(error.response.data.error);
                console.log(error.response.data.errors || error.response.data.error);
            })
            .finally(() => {
                setIsLoading(false); // define o estado isLoading como false para ocultar o overlay
            });
    };

    return (
        <div>
            <Navbar />

            {isLoading && <LoadingComponent isLoading={isLoading} />}

            {!isLoading && errorAuthenticate && (
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
                    Dados inválidos
                </Alert>
            )}

            {!isLoading && (
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
                                isInvalid={(errorValidate && errorValidate.email) || errorAuthenticate}
                            >
                                <FormLabel>Email address</FormLabel>
                                <Input name="email" type="email" />
                                <FormHelperText>Nunca compartilhe sua conta.</FormHelperText>
                                <FormErrorMessage>
                                    {errorValidate && errorValidate.email}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={(errorValidate && errorValidate.password) || errorAuthenticate}
                            >
                                <FormLabel>Senha</FormLabel>
                                <Input name="password" type="password" />
                                <FormHelperText>Nunca compartilhe sua senha</FormHelperText>
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
            )}
        </div>
    );
};

export default Login;
