import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const CartContext = createContext([]);

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // adiciona um item ao carrinho
    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    // remove um item do carrinho
    const removeFromCart = (productId) => {
        console.log('funcao aqui',cart)
        setCart((prevCart) => prevCart.filter((item) => item.api_id !== productId.api_id));
    };


    // limpa o carrinho
    const clearCart = () => {
        setCart([]);
    };

    // adiciona varios items de uma vez
    const setCartItems = (items) => {
        // ele preenche o id, com o valor de api_id
        const updatedItems = items.map(item => {
            return {
                ...item,
                id: item.api_id,
                quantity: item.quantity,
                price: item.price
            }

        });
        setCart(updatedItems);
        console.log(updatedItems)
    };


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/cart/");
                const cartItems = response.data[0].products;
                setCartItems(cartItems);
            } catch (error) {
                console.log("error in request", error);
            }
        };
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
