// src/Components/UpdateProduct.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    quantity: "",
    releaseDate: "",
    available: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Fetch product + image
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 1️⃣ Fetch all products and find by id
        const res = await API.get("/product");
        const found = res.data.find((p) => p.id === parseInt(id));

        if (!found) {
          alert("Product not found");
          navigate("/");
          return;
        }

        setProduct(found);

        // 2️⃣ Fetch image
        try {
          const imgRes = await API.get(`/product/${id}/image`, {
            responseType: "blob",
          });
          setImagePreview(URL.createObjectURL(imgRes.data));
        } catch {
          setImagePreview("/placeholder.jpg");
        }
      } catch (err) {
        console.error("Error fetching product", err);
        alert("Failed to load product");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Update product (multipart)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "productDto",
        new Blob([JSON.stringify(product)], {
          type: "application/json",
        })
      );

      // Backend REQUIRES imageFile key
      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else {
        formData.append("imageFile", new Blob());
      }

      await API.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully");
      navigate("/");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update product");
    }
  };

  return (
    <div className="container">
      <div className="center-container">
        <h2 className="text-center mb-4">Update Product</h2>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label>Name</label>
            <input
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Brand</label>
            <input
              className="form-control"
              name="brand"
              value={product.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Description</label>
            <input
              className="form-control"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Category</label>
            <select
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-6">
            <label>Stock Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Image</label>
            <img
              src={imagePreview || "/placeholder.jpg"}
              alt="preview"
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <input
              type="file"
              className="form-control mt-2"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-12 form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="available"
              checked={product.available}
              onChange={handleChange}
            />
            <label className="form-check-label">Product Available</label>
          </div>

          <div className="col-12">
            <button className="btn btn-success w-100">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;