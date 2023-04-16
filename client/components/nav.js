import { Button, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { FiShoppingCart, FiLogOut, FiUser, FiHome } from "react-icons/fi";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CartDrawer from "@/components/cartDrawer";
import { getUserData } from "@/utils/api";
import Cookies from 'js-cookie'
import OrderCard from "@/components/OrderCard";

function NavComponent() {
    const router = useRouter();
    const handleLogout = () => {
        Cookies.remove('app_token')
        router.push("/login")
    };

    const buttonColor = useColorModeValue("green.500", "green.200");

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleCartOpen = () => {
        setIsCartOpen(true);
    };

    const handleOrderOpen = () => {
        setIsOrderOpen(true)
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData();
            setUserData(data);
        };
        fetchUserData();
    }, []);

    return (
        <>
            <Flex bg="#131921" p={6} alignItems="center" justifyContent="space-between">
                <Text fontSize="lg" fontWeight="bold" color="white">
                    Bem-vindo, {userData ? userData.name : "visitante"}!
                </Text>
                <Flex>
                    <Button onClick={handleOrderOpen}>Pedidos</Button>
                    <Button
                        colorScheme="transparent"
                        onClick={() => router.push("/")}
                        mr={4}
                        _hover={{ background: "#1A202C" }}
                    >
                        <FiHome size={24} color={buttonColor} />
                    </Button>
                    <Button
                        colorScheme="transparent"
                        onClick={handleCartOpen}
                        mr={4}
                        _hover={{ background: "#1A202C" }}
                    >
                        <FiShoppingCart size={24} color={buttonColor} />
                    </Button>
                    <Button
                        colorScheme="transparent"
                        onClick={handleLogout}
                        rightIcon={<FiLogOut size={20} />}
                        _hover={{ background: "#1A202C" }}
                    >
                        <Text display={{ base: "none", md: "block" }}>Sair</Text>
                    </Button>
                </Flex>
            </Flex>
            <OrderCard isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)}/>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}

export default NavComponent;
