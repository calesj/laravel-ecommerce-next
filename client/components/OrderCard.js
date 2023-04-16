import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import LoadingComponent from "@/components/loading";
import CartDrawer from "@/components/cartDrawer";
import { useEffect, useState } from "react";
import { makeRequest } from "@/utils/api";
import { useRouter } from "next/router";

const OrderCard = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [isOrders, setIsOrders] = useState([]);

    useEffect(() => {

        setIsLoading(true)
        const orderConsult = () => {
            const endpoint = "http://127.0.0.1:8000/api/order/";
            const method = "GET";

            makeRequest(endpoint, method).then((res) => {
                if (res) {
                    setIsOrders(res);
                    setIsLoading(false)
                } else {
                    router.push("/login");
                }
            });
        };
        orderConsult();
    }, [setIsOrders]);

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
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">Meus Pedidos</Text>
                            <IconButton
                                size="lg"
                                icon={<FaTimes />}
                                onClick={onClose}
                                aria-label="Fechar"
                            />
                        </Flex>
                        {isLoading ? (
                            <LoadingComponent />
                        ) : isOrders.length > 0 ? (
                            isOrders.map((order) => (
                                <Box key={order.id} my={4}>
                                    <Text fontWeight="bold">Pedido #{order.id}</Text>
                                    <Text>Preço total: R${order.total_price}</Text>
                                    <Text>Status: {order.status}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text>Você ainda não fez nenhum pedido.</Text>
                        )}
                    </Box>
                </>
            )}
        </>
    );
};

export default OrderCard;
