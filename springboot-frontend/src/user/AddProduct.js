import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";

export default function AddProduct() {
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

  const [image, setImage] = useState(null);

  const {
    name,
    description,
    brand,
    price,
    category,
    quantity,
    releaseDate,
    available,
  } = product;

  // Handle input change
  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit product
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Backend expects these exact keys
    formData.append(
      "productDto",
      new Blob([JSON.stringify(product)], {
        type: "application/json",
      })
    );

    if (image) {
      formData.append("multipartFile", image);
    }

    try {
      await API.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product");
    }
  };

  // Cancel & reset
  const handleCancel = () => {
    setProduct({
      name: "",
      description: "",
      brand: "",
      price: "",
      category: "",
      quantity: "",
      releaseDate: "",
      available: false,
    });
    setImage(null);
  };

  return (
    <div className="container">
      <div className="center-container">
        <div className="row g-3 pt-5">
          <div className="col-md-6 offset-md-3 border bg-light rounded p-4 mt-2">
            <form onSubmit={onSubmit}>
              {/* Product Name */}
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={onInputChange}
                  required
                />
              </div>

              {/* Description & Brand */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={description}
                    onChange={onInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={brand}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={price}
                    onChange={onInputChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={category}
                    onChange={onInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Toys">Toys</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>
              </div>

              {/* Quantity & Release Date */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={quantity}
                    onChange={onInputChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Release Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="releaseDate"
                    value={releaseDate}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              {/* Availability & Image */}
              <div className="mb-3 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  name="available"
                  checked={available}
                  onChange={onInputChange}
                />
                <label className="form-check-label me-3">
                  Product Available
                </label>

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Buttons */}
              <div className="mt-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-pill"
                >
                  Submit
                </button>

                <Link
                  to="/"
                  className="btn btn-secondary btn-sm rounded-pill ms-2"
                  onClick={handleCancel}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}