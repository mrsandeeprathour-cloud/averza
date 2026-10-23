import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const productId =
        product._id || product.id;

      const existingItem =
        currentItems.find(
          (item) =>
            (item._id || item.id) === productId
        );

      if (existingItem) {
        return currentItems.map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          (item._id || item.id) !== productId
      )
    );
  };

  const updateQuantity = (
    productId,
    quantity
  ) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}

export default CartContext;