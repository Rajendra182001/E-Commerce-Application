// src/Components/Product.js
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppContext from "../Context/Context";
import API from "../API";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("/placeholder.jpg");

  // ✅ Fetch product + image
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 1️⃣ Get all products
        const res = await API.get("/product");
        const found = res.data.find((p) => p.id === parseInt(id));

        if (!found) {
          alert("Product not found");
          navigate("/");
          return;
        }

        setProduct(found);

        // 2️⃣ Get product image
        try {
          const imgRes = await API.get(`/product/${id}/image`, {
            responseType: "blob",
          });
          setImageUrl(URL.createObjectURL(imgRes.data));
        } catch {
          setImageUrl("/placeholder.jpg");
        }
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (!product) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  // Add to cart
  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  // Delete product
  const deleteProduct = async () => {
    try {
      await API.delete(`/product/${id}`);
      removeFromCart(id);
      refreshData();
      alert("Product deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error deleting product", err);
      alert("Failed to delete product");
    }
  };

  // Navigate to update page
  const handleEditClick = () => {
    navigate(`/product/updateProduct/${id}`);
  };

  return (
    <div
      className="outer-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        className="containers"
        style={{
          display: "flex",
          width: "80%",
          maxWidth: "900px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Image */}
        <div style={{ flex: 1, padding: "10px" }}>
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => (e.target.src = "/placeholder.jpg")}
            style={{
              width: "100%",
              height: "560px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Details */}
        <div style={{ flex: 1, padding: "20px" }}>
          <span>{product.category}</span>
          <h1>{product.name}</h1>
          <hr />
          <h5>{product.brand}</h5>
          <p>{product.description}</p>

          <h4 className="mb-3">₹ {product.price}</h4>

          <button
            className={`btn btn-dark btn-sm rounded-pill ${
              !product.available ? "disabled" : ""
            }`}
            disabled={!product.available}
            onClick={handleAddToCart}
          >
            {product.available ? "Add to Cart" : "Out of Stock"}
          </button>

          <div className="mt-3">
            <h6>
              Stock Available:{" "}
              <b style={{ color: "green" }}>{product.quantity}</b>
            </h6>
          </div>

          <div className="mt-2">
            <h6>Product listed on:</h6>
            <i>{product.releaseDate}</i>
          </div>

          <hr />

          {/* Actions */}
          <button
            className="btn btn-success btn-sm me-3"
            onClick={handleEditClick}
          >
            Update
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={deleteProduct}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;