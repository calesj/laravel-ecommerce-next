import { useCartContext } from "@/contexts/CartContext";
import { Box, Button, Flex, IconButton, Image, Select, Text } from "@chakra-ui/react";
import { FaCartPlus, FaTimes } from "react-icons/fa";
import CartDrawer from "@/components/CartDrawer";
import {useState} from "react";
import {makeRequest} from "@/utils/api";
import LoadingComponent from "@/components/loading";
import {useRouter} from "next/router";

function ProductCard({ product, onClose }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectValue, setSelectValue] = useState(1);
    const [isLoading, setIsLoading] = useState( false)
    const { addToCart } = useCartContext();
    const router = useRouter()

    const handleAddToCart = () => {
        setIsLoading(true)
        const productWithNewField = { ...product, quantity: selectValue };

        console.log('produto adicionado', productWithNewField)

        const endpoint = 'http://127.0.0.1:8000/api/cart/';
        const method = 'POST';

        // metodo responsavel por fazer a requisicao na API, foi criado no diretorio utils, dentro do arquivo api.js
        makeRequest(endpoint, method, productWithNewField)
            .then(res => {
                // se a resposta for false, ele redireciona pra tela de login
                if (!res) {
                    router.push('/login')
                }
                addToCart(productWithNewField);
                setIsCartOpen(true);
                setIsLoading(false); // move it here

            })
            .catch(err => {
                router.push('/login')
                console.log('error in request', err);
                setIsLoading(false); // and here
            });
    };


    return (
            <Box>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                    pointerEvents: "none",
                }}
            />
            <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                zIndex="1000"
                p={6}
                borderRadius={8}
                boxShadow="md"
            >
                <Flex ml="90%">
                    <IconButton
                        size="lg"
                        icon={<FaTimes />}
                        onClick={onClose}
                        aria-label="Fechar"
                    />
                </Flex>
                { isLoading ? (
                <LoadingComponent />
                ) :
                <center>
                    <Image src={product.image} mb={6} />
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="teal.600"
                        mb={2}
                    >
                        {product.name}
                    </Text>
                    <Text fontSize="md" color="gray.500" mb={4}>
                        {product.description}
                    </Text>
                    <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        color="gray.500"
                        mb={4}
                    >
                        R${product.price}
                    </Text>
                    <Flex alignItems="center" justifyContent={"center"} mt={6}>
                        <IconButton
                            mr="1"
                            width="40"
                            aria-label="Adicionar ao carrinho"
                            icon={<FaCartPlus />}
                            colorScheme="teal"
                            onClick={handleAddToCart}
                        />
                        <Select value={selectValue} width="50" margin-left="4px" onChange={(e) => setSelectValue(parseInt(e.target.value))}>
                            <option value={1}>1 item</option>
                            <option value={2}>2 item</option>
                            <option value={3}>3 item</option>
                            <option value={4}>4 item</option>
                            <option value={5}>5 item</option>
                        </Select>

                    </Flex>
                </center>
                }
            </Box>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </Box>
    );
}

export default ProductCard;
