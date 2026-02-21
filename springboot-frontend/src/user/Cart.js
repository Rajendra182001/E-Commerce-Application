import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch product images and update cart items
  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product");
        const backendProducts = response.data;

        const updatedCartItems = cart.map((item) => {
          const product = backendProducts.find((p) => p.id === item.id);
          return product ? { ...item, ...product } : item;
        });

        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const imageResponse = await axios.get(
                `http://localhost:8080/product/${item.id}/image`,
                { responseType: "arraybuffer" }
              );
              const imageBlob = new Blob([imageResponse.data], { type: 'image/jpeg' });
              const imageUrl = URL.createObjectURL(imageBlob);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image for product:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  // Recalculate total price
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Handle increasing the quantity
  const handleIncreaseQuantity = (itemId) => {
    setCartItems(cartItems.map((item) => 
      item.id === itemId && item.quantity < item.stockQuantity
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Handle decreasing the quantity
  const handleDecreaseQuantity = (itemId) => {
    setCartItems(cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
    ));
  };

  // Handle removing item from cart
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = { ...item, stockQuantity: updatedStockQuantity };

        const cartProduct = new FormData();
        cartProduct.append("imageFile", item.imageUrl); // Add image file to formData
        cartProduct.append(
          "productDto",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios.put(`http://localhost:8080/product/${item.id}`, cartProduct, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error during checkout", error);
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty" style={{ textAlign: "center", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item" style={itemStyle}>
                  <div style={itemContentStyle}>
                    <img
                      src={item.imageUrl || "placeholder-image-url"}
                      alt={item.name}
                      style={imageStyle}
                      className="cart-item-image"
                    />
                    <div style={descriptionStyle}>
                      <span>{item.brand}</span>
                      <span>{item.name}</span>
                    </div>

                    <div className="quantity" style={quantityStyle}>
                      <button onClick={() => handleIncreaseQuantity(item.id)} style={buttonStyle}>
                        <i className="bi bi-plus-square-fill"></i>
                      </button>
                      <input type="text" value={item.quantity} readOnly style={inputStyle} />
                      <button onClick={() => handleDecreaseQuantity(item.id)} style={buttonStyle}>
                        <i className="bi bi-dash-square-fill"></i>
                      </button>
                    </div>

                    <div className="total-price" style={totalPriceStyle}>
                      ${item.price * item.quantity}
                    </div>

                    <button onClick={() => handleRemoveFromCart(item.id)} style={removeButtonStyle}>
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total" style={totalStyle}>Total: ${totalPrice}</div>
            <Button onClick={() => setShowModal(true)} style={checkoutButtonStyle}>Checkout</Button>
          </>
        )}
      </div>
      
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

// Styles
const itemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "1rem",
  borderBottom: "1px solid #ccc"
};

const itemContentStyle = {
  display: "flex",
  alignItems: "center",
};

const imageStyle = {
  height: "80px",
  width: "80px",
  objectFit: "cover",
  marginRight: "1rem",
};

const descriptionStyle = {
  flex: 1,
  fontSize: "1.1rem",
  fontWeight: "bold",
};

const quantityStyle = {
  display: "flex",
  alignItems: "center",
  margin: "0 1rem",
};

const buttonStyle = {
  background: "none",
  border: "1px solid #ccc",
  padding: "5px 10px",
  fontSize: "1.2rem",
  cursor: "pointer",
  borderRadius: "5px",
};

const inputStyle = {
  width: "40px",
  textAlign: "center",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "1.1rem",
  margin: "0 10px",
};

const totalPriceStyle = {
  fontWeight: "bold",
  margin: "0 1rem",
};

const removeButtonStyle = {
  background: "none",
  border: "none",
  color: "red",
  fontSize: "1.5rem",
  cursor: "pointer",
};

const totalStyle = {
  fontWeight: "bold",
  textAlign: "right",
  margin: "1rem 0",
};

const checkoutButtonStyle = {
  width: "100%",
  marginTop: "1rem",
};

export default Cart;
