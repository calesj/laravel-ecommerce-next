import { useCartContext } from "@/contexts/CartContext";
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Image,
    Text,
    Spacer, Spinner,
} from "@chakra-ui/react";
import {useEffect, useMemo, useState} from "react";
import {makeRequest} from "@/utils/api";

function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, clearCart, setCartItems } = useCartContext();
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const cartItems = useMemo(() => {
        return cart ?? [];
    }, [cart]);

    async function fetchCart() {
        try {
            setIsLoading(true);
            const endpoint = 'http://127.0.0.1:8000/api/cart/';
            const method = 'GET';

            const response = await makeRequest(endpoint, method);
            const fetchedCartItems = response[0].products;
            setCartItems(fetchedCartItems);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("error in request", error);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        const newTotal = cart.reduce((acc, product) => acc + Number(product.price) * product.quantity, 0);
        setTotal(newTotal);
    }, [cart]);

    const handleRemoveFromCart = async (product) => {
        setIsLoading(true);
        try {
            const endpoint = `http://127.0.0.1:8000/api/cart/${product.api_id}/`;
            const method = 'DELETE';
            await makeRequest(endpoint, method);
            removeFromCart(product);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log('error in request', error);
        }
    };

    const handleClearCart = async () => {
        setIsLoading(true)
        try {
            const endpoint = `http://127.0.0.1:8000/api/cart`
            const method = 'DELETE'
            await makeRequest(endpoint, method)
            clearCart();
            setIsLoading(false)
        } catch (e) {
            console.log(e)
        }

    };

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const endpoint = "http://127.0.0.1:8000/api/order/";
            const method = "POST";
            const body = { products: cart };
            const response = await makeRequest(endpoint, method, body);
            console.log("Pedido enviado ao banco de dados!", response);
            clearCart();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("error in request", error);
        }
    };

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Carrinho</DrawerHeader>
                <DrawerBody>
                    { isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            {cart && cart.length > 0 ? (
                                cart.map((product) => (
                                    <Box key={product.api_id} mb={4} display="flex" alignItems="center">
                                        <Image src={product.image} w={16} h={16} mr={4} borderRadius="md" />
                                        <Text fontWeight="semibold">{product.name}</Text>
                                        <Text>Qtd: {product.quantity}</Text>
                                        <Spacer />
                                        <Button size="sm" colorScheme="red" ml={4} onClick={() => handleRemoveFromCart(product)}>
                                            Remover
                                        </Button>
                                    </Box>
                                ))
                            ) : (
                                <Text>Nenhum produto adicionado ao carrinho.</Text>
                            )}
                            {cart && cart.length > 0 && (
                                <Box mt={4}>
                                    <Text fontWeight="semibold">Total do pedido: R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                                    <Button colorScheme="red" size="sm" onClick={handleClearCart} mr={2}>
                                        Esvaziar carrinho
                                    </Button>
                                    <Button colorScheme="green" size="sm" onClick={handleCheckout}>
                                        Fechar pedido
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

export default CartDrawer;
