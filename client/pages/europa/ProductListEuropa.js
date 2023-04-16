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

// editando a chave de imagem, e do id do produto
const transformProduct = (product) => {
    return {
        api_id: product.id,
        origins: "EU",
        name: product.name,
        description: product.description,
        category: product.category,
        image: product.gallery[0],
        price: product.price,
        department: product.department,
    };
};

const ProductListEuropa = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        axios
            .get("http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider")
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        isLoading ? (
                <LoadingComponent />
            ) :
            <Box>
                <NavComponent />
                <Box p="6">
                    <Box mb="6">
                        <FormControl>
                            <FormLabel>Buscar Produtos</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" />
                                <Input
                                    type="text"
                                    placeholder="Digite aqui o nome do produto"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </InputGroup>
                        </FormControl>
                    </Box>
                    <Grid templateColumns={{base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'}} gap={6}>
                    {filteredProducts.map((product) => (
                            <GridItem key={product.api_id}>
                                <Box borderWidth="1px" rounded="lg" overflow="hidden" shadow="md">
                                    <Image src={product.image} />
                                    <Box p="6">
                                        <Box d="flex" alignItems="baseline" justifyContent="space-between">
                                            <Box>
                                                <Text fontWeight="semibold" fontSize="lg" color="teal.600" mr="2">
                                                    {product.name}
                                                </Text>
                                                <Box maxH={{ base: "36px", md: "none" }} overflow="hidden">
                                                    <Text mt="2" color="gray.500">
                                                        {product.description}
                                                    </Text>
                                                </Box>
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

export default ProductListEuropa;
