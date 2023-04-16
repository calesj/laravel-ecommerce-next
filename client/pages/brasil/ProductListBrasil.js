import NavComponent from "@/components/nav";
import axios from "axios";
import {useRouter} from "next/router";
import ProductCard from "@/components/ProductCard";
import {
    Grid,
    GridItem,
    Box,
    Image,
    Text,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    Input, Button
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/loading";

const transformProduct = (product) => {
    return {
        api_id: product.id,
        origins: "BRA",
        name: product.nome,
        description: product.descricao,
        category: product.categoria,
        image: product.imagem,
        price: product.preco,
        department: product.departamento,
    };
};

const ProductListBrasil = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedProduct, setSelectedProduct] = useState(null);


    const router = useRouter()

    useEffect(() => {
        setIsLoading(true)
        axios
            .get("http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider")
            .then((response) => {
                const products = response.data.map(transformProduct);
                setProducts(products);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    if (error) {
        return <p>Ocorreu um erro: {error}</p>;
    }

    return (
        isLoading ? (
                <LoadingComponent />
            ) :
            <Box>
                <NavComponent />
                <Box p="6">
                    <Box mb="6" borderBottomWidth="1px" pb="3">
                        <Text fontSize="2xl" fontWeight="bold">Produtos em Destaque</Text>
                    </Box>
                    <Box mb="6">
                        <FormControl>
                            <FormLabel>Buscar Produtos</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" />
                                <Input type="text" placeholder="Digite aqui o nome do produto" />
                            </InputGroup>
                        </FormControl>
                    </Box>
                    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                        {products.map((product) => (
                            <GridItem key={product.api_id}>
                                <Box borderWidth="1px" rounded="lg" overflow="hidden" shadow="md">
                                    <Image src={product.image} />
                                    <Box p="6">
                                        <Box d="flex" alignItems="baseline" justifyContent="space-between">
                                            <Box>
                                                <Text fontWeight="semibold" fontSize="lg" color="teal.600" mr="2">
                                                    {product.name}
                                                </Text>
                                                <Text mt="2" color="gray.500">
                                                    {product.description}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="semibold" fontSize="md" color="gray.500">
                                                    R${product.price}
                                                </Text>
                                                <Box d="flex" alignItems="center" mt="2">
                                                    <Text fontSize="sm" color="gray.500" mr="2">
                                                        Em estoque
                                                    </Text>
                                                    <Button
                                                        colorScheme="teal"
                                                        size="sm"
                                                        onClick={() => setSelectedProduct(product)}
                                                    >
                                                        Comprar
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </GridItem>
                        ))}
                        {selectedProduct && (
                            <ProductCard product={selectedProduct} onClose={() => setSelectedProduct(null)} />
                        )}
                    </Grid>
                </Box>
            </Box>
    );
};

export default ProductListBrasil;
