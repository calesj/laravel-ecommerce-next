import {
    Box,
    Flex,
    Button,
} from "@chakra-ui/react";
import Link from 'next/link';

const Navbar = () => {
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="blue.500" color="white">
            <Box>
                <Link href="/">
                        <Button variant="ghost" mr={2}>Home</Button>
                </Link>
            </Box>
            <Box>
                <Link href="/login">
                        <Button variant="ghost" mr={2}>Login</Button>
                </Link>
                <Link href="/register">
                        <Button variant="solid" backgroundColor="whiteAlpha.400" color="white" _hover={{ backgroundColor: "whiteAlpha.500" }}>Registro</Button>
                </Link>
            </Box>
        </Flex>
    );
};

export default Navbar;
