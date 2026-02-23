// import React from 'react';
// import { Modal, Button } from 'react-bootstrap';

// const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Checkout</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="checkout-items">
//           {cartItems.map((item) => (
//             <div key={item.id} className="checkout-item" style={{ display: 'flex', marginBottom: '10px' }}>
//               <img src={item.imageUrl} alt={item.name} style={{ width: '200px', marginRight: '10px' }} />
//               <div>
//                 <b><p>{item.name}</p></b>
//                 <p>Quantity: {item.quantity}</p>
//                 <p>Price: ${item.price * item.quantity}</p>
//               </div>
//             </div>
//           ))}
//           <div className="total">
//             <h5>Total: ${totalPrice}</h5>
//           </div>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>Close</Button>
//         <Button variant="primary" onClick={handleCheckout}>Confirm Purchase</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default CheckoutPopup;

// src/Components/CheckoutPopup.js
import React from "react";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  if (!show) return null;

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

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          zIndex: 1100,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(560px, 95vw)",
        background: "#fff",
        borderRadius: "24px",
        zIndex: 1101,
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f0c29, #302b63)",
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Order Summary
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your bag
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              cursor: "pointer", fontSize: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}
          >×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                padding: "14px",
                background: "#f9fafb",
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
              }}>
                {/* Image / Thumbnail */}
                <div style={{
                  width: 64, height: 64,
                  borderRadius: "12px",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: getCategoryGradient(item.category),
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: "28px" }}>{getCategoryEmoji(item.category)}</span>
                  }
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "700", color: "#111827",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </p>
                  <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#9ca3af" }}>{item.brand}</p>
                  <span style={{
                    display: "inline-block",
                    background: "#f0f0ff", color: "#6366f1",
                    fontSize: "11px", fontWeight: "600",
                    padding: "2px 8px", borderRadius: "20px",
                  }}>
                    Qty: {item.quantity}
                  </span>
                </div>

                {/* Price */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ margin: 0, fontWeight: "800", fontSize: "16px", color: "#111827",
                    fontFamily: "'Playfair Display', Georgia, serif" }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#9ca3af" }}>
                    ₹{Number(item.price).toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider + Total */}
          <div style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "2px dashed #f3f4f6",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Subtotal</span>
              <span style={{ fontSize: "14px", color: "#374151", fontWeight: "600" }}>
                ₹{Number(totalPrice).toLocaleString()}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Delivery</span>
              <span style={{ fontSize: "14px", color: "#10b981", fontWeight: "600" }}>
                {totalPrice >= 999 ? "FREE" : "₹49"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#111827" }}>Total</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#111827",
                fontFamily: "'Playfair Display', Georgia, serif" }}>
                ₹{(Number(totalPrice) + (totalPrice >= 999 ? 0 : 49)).toLocaleString()}
              </span>
            </div>

            {totalPrice < 999 && (
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
                💡 Add ₹{999 - totalPrice} more for free delivery
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "20px 24px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          gap: "12px",
        }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: "14px",
              background: "#f9fafb",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Edit Bag
          </button>

          <button
            onClick={handleCheckout}
            style={{
              flex: 2,
              padding: "14px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: "800",
              cursor: "pointer",
              letterSpacing: "0.3px",
              fontFamily: "inherit",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
            }}
          >
            Confirm Purchase ✓
          </button>
        </div>

        {/* Trust badges */}
        <div style={{
          padding: "0 24px 16px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}>
          {["🔒 Secure", "🔄 Easy Returns", "🚚 Fast Delivery"].map((badge) => (
            <span key={badge} style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500" }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default CheckoutPopup;
