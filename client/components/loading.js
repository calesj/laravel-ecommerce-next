import { Flex, Spinner } from "@chakra-ui/react";

function LoadingComponent({ isLoading }) {
    return (
        <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
            <Spinner size="xl" color="green.500" />
        </Flex>
    );
}

export default LoadingComponent;
