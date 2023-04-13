import { useEffect, useState } from "react"
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

    // setamos pra mostrar 8 itens por pagina
    const [itemsPerPage, setItemsPerPage] = useState(8)

    useEffect(() => {
        fetch("http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data)
                setIsLoading(false)
            })
            .catch((error) => console.log(error))
    }, [])

    // verifica se houve alteracoes no openDrawer
    useEffect(() => {
        if (openDrawer) {
            onOpen()
        }
    }, [openDrawer, onOpen])

    // adicionando o item ao array carrinho
    const addToCart = (productId) => {
        setCartItems((currentCartItems) => [...currentCartItems, productId])
    }

    // ele vai criar um novo array, vai filtrar o array onde estao os itens, e vai passar todos os itens
    // que sejam diferente do productId para o novo array de itens, criando uma novo array
    // sem o item que selecionamos
    const removeToCart = (productId) => {
        setCartItems((currentCartItems) => currentCartItems.filter(item => item !== productId))
        console.log(cartItems)
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
                                    <Select>
                                        <option value={1}>1 item</option>
                                        <option value={2}>2 item</option>
                                        <option value={3}>3 item</option>
                                        <option value={4}>4 item</option>
                                        <option value={5}>5 item</option>
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
                                    {
                                        // verifica se o item ja foi selecionado
                                        cartItems.includes(product) ?
                                            (<Button
                                                colorScheme="red"
                                                onClick={() => removeToCart(product)}
                                            >
                                                Remover do carrinho
                                            </Button>) :
                                            (

                                    <Button
                                        colorScheme="green"
                                        onClick={() => addToCart(product)}
                                    >
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
