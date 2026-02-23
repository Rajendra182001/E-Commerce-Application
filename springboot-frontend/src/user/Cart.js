// // src/Components/Cart.js
// import React, { useContext, useState, useEffect } from "react";
// import AppContext from "../Context/Context";
// import API from "../API";
// import CheckoutPopup from "./CheckoutPopup";
// import { Button } from "react-bootstrap";

// const Cart = () => {
//   const { cart, removeFromCart, clearCart } = useContext(AppContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   // Fetch products + images
//   useEffect(() => {
//     const fetchCartData = async () => {
//       try {
//         const res = await API.get("/product");
//         const backendProducts = res.data;

//         const merged = cart.map((item) => {
//           const backendItem = backendProducts.find((p) => p.id === item.id);
//           return backendItem
//             ? { ...backendItem, quantity: item.quantity }
//             : item;
//         });

//         const withImages = await Promise.all(
//           merged.map(async (item) => {
//             try {
//               const imgRes = await API.get(`/product/${item.id}/image`, {
//                 responseType: "blob",
//               });
//               return {
//                 ...item,
//                 imageUrl: URL.createObjectURL(imgRes.data),
//               };
//             } catch {
//               return { ...item, imageUrl: "/placeholder.jpg" };
//             }
//           })
//         );

//         setCartItems(withImages);
//       } catch (err) {
//         console.error("Error loading cart", err);
//       }
//     };

//     if (cart.length) fetchCartData();
//     else setCartItems([]);
//   }, [cart]);

//   // Total price
//   useEffect(() => {
//     const total = cartItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, [cartItems]);

//   // Quantity handlers
//   const handleIncreaseQuantity = (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id && item.quantity < item.quantity + item.stockQuantity
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   };

//   const handleDecreaseQuantity = (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//           : item
//       )
//     );
//   };

//   const handleRemoveFromCart = (id) => {
//     removeFromCart(id);
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // ✅ FIXED CHECKOUT (multipart PUT)
//   const handleCheckout = async () => {
//     try {
//       for (const item of cartItems) {
//         const updatedProduct = {
//           ...item,
//           quantity: item.quantity,
//           stockQuantity: item.stockQuantity - item.quantity,
//         };

//         const formData = new FormData();
//         formData.append(
//           "productDto",
//           new Blob([JSON.stringify(updatedProduct)], {
//             type: "application/json",
//           })
//         );

//         // backend requires imageFile key
//         formData.append("imageFile", new Blob());

//         await API.put(`/product/${item.id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       clearCart();
//       setCartItems([]);
//       setShowModal(false);
//     } catch (error) {
//       console.error("Checkout failed", error);
//       alert("Checkout failed. Please try again.");
//     }
//   };

//   return (
//     <div className="cart-container">
//       <div className="shopping-cart">
//         <div className="title">Shopping Bag</div>

//         {cartItems.length === 0 ? (
//           <div className="empty text-center p-4">
//             <h4>Your cart is empty</h4>
//           </div>
//         ) : (
//           <>
//             <ul style={{ listStyle: "none", padding: 0 }}>
//               {cartItems.map((item) => (
//                 <li key={item.id} style={itemStyle}>
//                   <img
//                     src={item.imageUrl}
//                     alt={item.name}
//                     style={imageStyle}
//                   />

//                   <div style={descriptionStyle}>
//                     <div>{item.brand}</div>
//                     <div>{item.name}</div>
//                   </div>

//                   <div style={quantityStyle}>
//                     <button onClick={() => handleIncreaseQuantity(item.id)}>
//                       +
//                     </button>
//                     <input readOnly value={item.quantity} style={inputStyle} />
//                     <button onClick={() => handleDecreaseQuantity(item.id)}>
//                       -
//                     </button>
//                   </div>

//                   <div style={totalPriceStyle}>
//                     ₹{item.price * item.quantity}
//                   </div>

//                   <button
//                     onClick={() => handleRemoveFromCart(item.id)}
//                     style={removeButtonStyle}
//                   >
//                     🗑
//                   </button>
//                 </li>
//               ))}
//             </ul>

//             <div style={totalStyle}>Total: ₹{totalPrice}</div>
//             <Button onClick={() => setShowModal(true)}>Checkout</Button>
//           </>
//         )}
//       </div>

//       <CheckoutPopup
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         handleCheckout={handleCheckout}
//       />
//     </div>
//   );
// };

// // Styles
// const itemStyle = { display: "flex", alignItems: "center", padding: "1rem" };
// const imageStyle = { width: 80, height: 80, marginRight: "1rem" };
// const descriptionStyle = { flex: 1, fontWeight: "bold" };
// const quantityStyle = { display: "flex", gap: "10px" };
// const inputStyle = { width: 40, textAlign: "center" };
// const totalPriceStyle = { fontWeight: "bold" };
// const removeButtonStyle = { color: "red", border: "none" };
// const totalStyle = { textAlign: "right", marginTop: "1rem" };

// export default Cart;

// src/Components/Cart.js
// src/Components/Cart.js
import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import API from "../API";
import CheckoutPopup from "./CheckoutPopup";

const getCategoryGradient = (category) => {
  const map = {
    Electronics: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    Fashion:     "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    Sports:      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    Beauty:      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    Home:        "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  };
  return map[category] || "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
};

const getCategoryEmoji = (category) => {
  const map = { Electronics: "⚡", Fashion: "👗", Sports: "🏃", Beauty: "✨", Home: "🏡" };
  return map[category] || "🛍";
};

const Cart = () => {
  const context = useContext(AppContext);
  const cart = context?.cart || [];
  const removeFromCart = context?.removeFromCart || (() => {});
  const clearCart = context?.clearCart || (() => {});

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Fetch products + images ─────────────────────────────────────────────────
  useEffect(() => {
    if (!cart || cart.length === 0) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        const res = await API.get("/product");
        const backendProducts = res.data || [];

        const merged = cart.map((item) => {
          const backendItem = backendProducts.find((p) => p.id === item.id);
          return backendItem
            ? { ...backendItem, quantity: item.quantity || 1 }
            : item;
        });

        const withImages = await Promise.all(
          merged.map(async (item) => {
            try {
              const imgRes = await API.get(`/product/${item.id}/image`, {
                responseType: "blob",
              });
              return { ...item, imageUrl: URL.createObjectURL(imgRes.data) };
            } catch {
              return { ...item, imageUrl: null };
            }
          })
        );

        setCartItems(withImages);
      } catch (err) {
        console.error("Error loading cart:", err);
        // Fall back to cart data from context so page never breaks
        setCartItems(cart.map((item) => ({ ...item, imageUrl: null })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [cart]);

  // ── Total price ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // ── Quantity handlers ───────────────────────────────────────────────────────
  const handleIncreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ── Checkout ────────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedProduct = {
          ...item,
          quantity: item.quantity,
          stockQuantity: (item.stockQuantity || 0) - (item.quantity || 1),
        };

        const formData = new FormData();
        formData.append(
          "productDto",
          new Blob([JSON.stringify(updatedProduct)], { type: "application/json" })
        );
        formData.append("imageFile", new Blob());

        await API.put(`/product/${item.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
      setCheckedOut(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const deliveryFee = totalPrice > 0 && totalPrice < 999 ? 49 : 0;
  const grandTotal = totalPrice + deliveryFee;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafafa",
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        padding: "20px 24px 28px",
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "900", fontFamily: "'Georgia', 'Times New Roman', serif", color: "#fff" }}>
              <span style={{ background: "linear-gradient(90deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Rajendra Shpping 
              </span>{" "}Market
            </h1>
            <p style={{ margin: "3px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>
              Premium Shopping
            </p>
          </div>
          <a href="/" style={{
            color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: "500",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px", background: "rgba(255,255,255,0.08)",
          }}>
            ← Continue Shopping
          </a>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>

        {checkedOut ? (
          /* ── Success ── */
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "72px", marginBottom: "20px" }}>🎉</div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#10b981", fontFamily: "'Georgia', serif", margin: "0 0 8px" }}>
              Order Placed!
            </h2>
            <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "28px" }}>
              Thank you for shopping with Rajendra Shpping Market
            </p>
            <a href="/" style={{
              display: "inline-block", padding: "14px 32px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff", borderRadius: "14px",
              textDecoration: "none", fontWeight: "700", fontSize: "15px",
            }}>
              Continue Shopping →
            </a>
          </div>

        ) : (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "900", color: "#111827", fontFamily: "'Georgia', serif" }}>
                Shopping Bag
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#9ca3af" }}>
                {isLoading
                  ? "Loading your items..."
                  : cartItems.length === 0
                  ? "Your bag is empty"
                  : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your bag`}
              </p>
            </div>

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
                <p style={{ color: "#9ca3af" }}>Fetching your items...</p>
              </div>

            ) : cartItems.length === 0 ? (
              /* ── Empty ── */
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "72px", marginBottom: "20px" }}>🛍</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#374151", fontFamily: "'Georgia', serif" }}>
                  Your bag is empty
                </h3>
                <p style={{ color: "#9ca3af", marginBottom: "24px" }}>Add some items to get started</p>
                <a href="/" style={{
                  display: "inline-block", padding: "12px 28px",
                  background: "#111827", color: "#fff",
                  borderRadius: "12px", textDecoration: "none",
                  fontWeight: "700", fontSize: "14px",
                }}>
                  Browse Products →
                </a>
              </div>

            ) : (
              /* ── Items + Summary ── */
              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>

                {/* Item list */}
                <div style={{ flex: "1 1 420px" }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{
                      display: "flex", gap: "16px", alignItems: "center",
                      padding: "16px", marginBottom: "12px",
                      background: "#fff", borderRadius: "18px",
                      border: "1px solid #f3f4f6",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: 80, height: 80, borderRadius: "14px",
                        overflow: "hidden", flexShrink: 0,
                        background: getCategoryGradient(item.category),
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.name || "product"}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: "32px" }}>{getCategoryEmoji(item.category)}</span>
                        }
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#9ca3af", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
                          {item.brand || ""}
                        </p>
                        <p style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: "700", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name || "Product"}
                        </p>
                        {/* Qty */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <button onClick={() => handleDecreaseQuantity(item.id)}
                            style={{ width: 30, height: 30, border: "1px solid #e5e7eb", background: "#fff", borderRadius: "8px 0 0 8px", cursor: "pointer", fontSize: "16px", fontWeight: "700", color: "#374151" }}>−</button>
                          <div style={{ width: 40, height: 30, border: "1px solid #e5e7eb", borderLeft: "none", borderRight: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#111827", background: "#f9fafb" }}>
                            {item.quantity}
                          </div>
                          <button onClick={() => handleIncreaseQuantity(item.id)}
                            style={{ width: 30, height: 30, border: "1px solid #e5e7eb", background: "#fff", borderRadius: "0 8px 8px 0", cursor: "pointer", fontSize: "16px", fontWeight: "700", color: "#374151" }}>+</button>
                        </div>
                      </div>

                      {/* Price + Remove */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: "0 0 10px", fontWeight: "800", fontSize: "17px", color: "#111827", fontFamily: "'Georgia', serif" }}>
                          ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}
                        </p>
                        <button onClick={() => handleRemoveFromCart(item.id)}
                          style={{ background: "none", border: "1px solid #fecaca", color: "#ef4444", borderRadius: "8px", cursor: "pointer", fontSize: "13px", padding: "4px 10px", fontFamily: "inherit" }}>
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div style={{ flex: "0 0 260px", minWidth: "220px" }}>
                  <div style={{
                    background: "#fff", borderRadius: "18px",
                    border: "1px solid #f3f4f6", padding: "20px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    position: "sticky", top: "20px",
                  }}>
                    <h4 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "800", color: "#111827" }}>
                      Order Summary
                    </h4>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", color: "#6b7280" }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", color: "#6b7280" }}>
                      <span>Delivery</span>
                      <span style={{ fontWeight: "600", color: deliveryFee === 0 ? "#10b981" : "#374151" }}>
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", paddingTop: "14px", borderTop: "2px solid #f3f4f6" }}>
                      <span style={{ fontSize: "17px", fontWeight: "800", color: "#111827" }}>Total</span>
                      <span style={{ fontSize: "22px", fontWeight: "800", color: "#111827", fontFamily: "'Georgia', serif" }}>
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </div>

                    {totalPrice > 0 && totalPrice < 999 && (
                      <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
                        💡 Add ₹{999 - totalPrice} more for free delivery
                      </p>
                    )}

                    <button
                      onClick={() => setShowModal(true)}
                      style={{
                        width: "100%", padding: "14px", marginTop: "16px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff", border: "none", borderRadius: "14px",
                        fontSize: "15px", fontWeight: "800", cursor: "pointer",
                        fontFamily: "inherit", letterSpacing: "0.3px",
                        boxShadow: "0 8px 24px rgba(102,126,234,0.35)",
                      }}
                    >
                      Checkout →
                    </button>

                    <button
                      onClick={clearCart}
                      style={{
                        width: "100%", padding: "10px", background: "none",
                        color: "#9ca3af", border: "none", cursor: "pointer",
                        fontSize: "13px", marginTop: "8px", fontFamily: "inherit",
                      }}
                    >
                      Clear bag
                    </button>

                    <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {["🔒 Secure Payment", "🔄 Easy Returns", "🚚 Fast Shipping"].map((b) => (
                        <span key={b} style={{ fontSize: "12px", color: "#9ca3af" }}>{b}</span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </>
        )}
      </div>

      {/* Checkout Popup */}
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

export default Cart;