// // src/Context/Context.js
// import React, { useState, useEffect, createContext } from "react";
// import API from "../API"; // use your axios instance

// const AppContext = createContext({
//   data: [],
//   isError: "",
//   cart: [],
//   addToCart: (product) => {},
//   removeFromCart: (id) => {},
//   refreshData: () => {},
//   updateStockQuantity: (id, newQuantity) => {}
// });

// export const AppProvider = ({ children }) => {
//   const [data, setData] = useState([]);
//   const [isError, setIsError] = useState("");
//   const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

//   const addToCart = (product) => {
//     const existingProductIndex = cart.findIndex((item) => item.id === product.id);
//     if (existingProductIndex !== -1) {
//       const updatedCart = cart.map((item, index) =>
//         index === existingProductIndex
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//       setCart(updatedCart);
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//     } else {
//       const updatedCart = [...cart, { ...product, quantity: 1 }];
//       setCart(updatedCart);
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//     }
//   };

//   const removeFromCart = (id) => {
//     const updatedCart = cart.filter((item) => item.id !== id);
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const refreshData = async () => {
//     try {
//       // ✅ Use API instance with full backend URL
//       const response = await API.get("/product");
//       setData(response.data);
//     } catch (error) {
//       setIsError(error.message);
//       console.error("Error fetching products:", error);
//     }
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem('cart');
//   };

//   useEffect(() => {
//     refreshData();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   return (
//     <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart, refreshData, clearCart }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContext;


// src/Context/Context.js
import React, { useState, useEffect, createContext } from "react";
import API from "../API";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (id) => {},
  updateQuantity: (id, qty) => {},
  refreshData: () => {},
  clearCart: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      const updated = exists
        ? prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) => {
      const updated =
        qty < 1
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const refreshData = async () => {
    try {
      const response = await API.get("/product");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshData,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;