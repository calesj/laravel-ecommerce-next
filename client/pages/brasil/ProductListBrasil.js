import { useEffect, useState } from "react"
import axios from "axios";
import {
    Select,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    DrawerCloseButton,
    Grid,
    Box,
    Button,
    Image,
    Spinner,
    Text,
    Heading,
    GridItem,
    Card, Flex,
    Drawer, DrawerOverlay,
    useDisclosure
} from "@chakra-ui/react"
import withAuth from "@/utils/withAuth"

function ProductListBrasil({ openDrawer, onCloseDrawer, userData }) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [cartItems, setCartItems] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    //imagem esta carregada?
    const [imageIsLoad, setImageIsLoad] = useState(false)

    //lista de produtos vindo da API
    const [products, setProducts] = useState([])

    const [currentPage, setCurrentPage] = useState(1)

    const [selectedValue, setSelectedValue] = useState(1)

    // setamos pra mostrar 8 itens por pagina
    const [itemsPerPage, setItemsPerPage] = useState(8)

    const getProductsCart = async () => {
        setIsLoading(true)
        const response = await axios.get('http://127.0.0.1:8000/api/cart');
        const productPromises = response.data.flatMap(item => {
            return item.products.map(async product => {
                const response = await axios.get(`http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider/${product.api_id}`);
                return response.data;
            })
        });
        const products = await Promise.all(productPromises);
        const newCartItems = products.filter(product => !cartItems.some(item => item.id === product.id));
        setCartItems([...cartItems, ...newCartItems]);
        setIsLoading(false)
    };

    useEffect(() => {
        getProductsCart()
        axios.get('http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider')
            .then((response) => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch((error) => console.log(error));
    }, []);

    // verifica se houve alteracoes no openDrawer
    useEffect(() => {
        if (openDrawer) {
            onOpen()
        }
    }, [openDrawer, onOpen])

    // altera o valor do select, quando ele e alterado
    const handleChange = (event) => {
        setSelectedValue(event.target.value)
    }

    // adicionando o item ao array carrinho
    const addToCart = async (product) => {

        setIsLoading(true)

        try {
            setCartItems((currentCartItems) => [...currentCartItems, product])

            const item = {
                name: product.nome,
                description: product.descricao,
                department: product.departamento,
                api_id: product.id,
                material: product.material,
                price: product.preco,
                quantity: selectedValue,
                origins: 'BRA'
            }

            const response = await axios.post('http://127.0.0.1:8000/api/cart/', item);
        } catch (e) {
            console.log(e)
        }

        setIsLoading(false)
    }

    // ele vai criar um novo array, vai filtrar o array onde estao os itens, e vai passar todos os itens
    // que sejam diferente do productId para o novo array de itens, criando uma novo array
    // sem o item que selecionamos
    const removeToCart = async (product) => {
        setIsLoading(true)
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/cart/${product.id}`);
            setIsLoading(false)
            await getProductsCart()
            setCartItems((currentCartItems) => currentCartItems.filter(item => item !== product))
            return true
        } catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)

    // algoritmo pra fazer a paginacao
    const pageNumbers = []
    // ele ve o
    for (let i = 1 ; i <= Math.ceil(products.length / itemsPerPage) ; i++) {
        pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map((number) => (
        <Button
            mr={4}
            key={number}
            colorScheme={currentPage === number ? "green" : undefined}
            onClick={() => setCurrentPage(number)}
        >
            {number}
        </Button>
    ))

    return (
        <div>
        <Flex bg="#131921" p={6} alignItems="center" justifyContent="space-between">
            <Text fontSize="lg" fontWeight="bold" color="white">
                {userData && (
                    <div>
                        <p>Bem-vindo, {userData.name}!</p>
                    </div>
                )}
            </Text>
            <Button colorScheme="green" onClick={onOpen}>
                Carrinho
            </Button>
        </Flex>
        <Card margin={"3%"} padding={"10"}>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}
                 blockScrollOnMount={false}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Carrinho</DrawerHeader>
                    <DrawerBody>
                        <ul>
                            { cartItems.map((product) => (
                                <Box
                                    mb={10}
                                    borderWidth="1px"
                                    bg={"white"}
                                    borderRadius="lg"
                                    overflow="hidden">
                                    <center><b><Text>{product.nome}</Text></b> </center>
                                    <Image
                                        src={product.imagem}
                                        alt={product.nome}
                                        onLoad={() => setImageIsLoad(true)}
                                    />
                                    <center><b><Text> R$ {product.preco}</Text></b></center>
                                    <Select value={selectedValue} onChange={handleChange}>
                                        <option value={1}>1 item</option>
                                        <option value={2}>2 itens</option>
                                        <option value={3}>3 itens</option>
                                        <option value={4}>4 itens</option>
                                        <option value={5}>5 itens</option>
                                    </Select>
                                </Box>
                            ))}
                            <Button colorScheme={"green"}>Fechar Pedido</Button>
                        </ul>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                {isLoading ? (
                    <Spinner size={'xl'}/>
                ) : (
                    currentItems.map((product) => (
                        <GridItem
                            width={"100%"}
                            key={product.id}
                        >
                            <Box
                                borderWidth="1px"
                                bg={"white"}
                                borderRadius="lg"
                                overflow="hidden"
                            >
                                {!imageIsLoad && <Spinner/>}
                                <Image
                                    src={product.imagem}
                                    alt={product.nome}
                                    onLoad={() => setImageIsLoad(true)}
                                />
                                <Box p="6">
                                    <Heading as="h3" size="md" mb={2}>
                                        {product.nome}
                                    </Heading>
                                    <Text mb={4}>{product.descricao}</Text>
                                    <Text fontWeight="bold" mb={2}>
                                       R$ {product.preco}
                                    </Text>
                                    {cartItems.some(item => item.id === product.id) ? (
                                        <Button colorScheme="red" onClick={() => removeToCart(product)}>
                                            Remover do carrinho
                                        </Button>
                                    ) : (
                                        <Button colorScheme="green" onClick={() => addToCart(product)}>
                                            Adicionar ao carrinho
                                        </Button>
                                    )}

                                </Box>
                            </Box>
                        </GridItem>
                    ))
                )}
            </Grid>
            <Flex p={1} alignItems="center">
                {renderPageNumbers}
            </Flex>
        </Card>
        </div>
    )
}

export default withAuth(ProductListBrasil)
