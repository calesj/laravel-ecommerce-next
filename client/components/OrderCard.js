import {Box, Flex, IconButton, Spinner, Text} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { makeRequest } from "@/utils/api";
import { useRouter } from "next/router";

const OrderCard = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [isOrders, setIsOrders] = useState([]);

    useEffect(() => {

        setIsLoading(true)
        const orderConsult = async () => {
            const endpoint = "http://127.0.0.1:8000/api/order/";
            const method = "GET";

            try {
                const res = await makeRequest(endpoint, method);
                if (res) {
                    setIsOrders(res);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        orderConsult();
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <>
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
                        width="80%"
                        maxWidth="500px"
                        bg="white"
                        zIndex="1000"
                        p={6}
                        borderRadius={8}
                        boxShadow="md"
                        display={isOpen ? "block" : "none"}
                    >
                        <Flex justifyContent="space-between" alignItems="center" mb={4}>
                            <Text fontWeight="bold">Meus Pedidos</Text>
                            <IconButton
                                size="sm"
                                icon={<FaTimes/>}
                                onClick={onClose}
                                aria-label="Fechar"
                            />
                        </Flex>
                        {isOrders.length === 0 && <Text>Você ainda não fez nenhum pedido.</Text>}
                        {isOrders.length > 0 && (
                            <>
                                {isLoading && <Spinner/>}
                                {!isLoading &&
                                    isOrders.map((order) => (
                                        <Box key={order.id}>
                                            <Text fontWeight="bold">Pedido #{order.id}</Text>
                                            <Text>Preço total: R$ {order.total_price}</Text>
                                            <Text>Status: {order.status}</Text>
                                        </Box>
                                    ))}
                            </>
                        )}
                    </Box>
                </> // Parêntese fechando o segundo bloco
            )}
        </> // Parêntese fechando o primeiro bloco
    )
}

export default OrderCard


