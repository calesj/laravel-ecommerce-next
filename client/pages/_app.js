import '@/styles/globals.css'
import { CartProvider } from "@/contexts/CartContext";
import { ChakraProvider } from '@chakra-ui/react'
export default function App({ Component, pageProps }) {

  return(
      <CartProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </CartProvider>
  )
}
