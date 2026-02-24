import React, { useEffect, useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";


export default function NavBar({ onSelectCategory, onSearch }) {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [searchText, setSearchText] = useState("");
  const [theme] = useState(getInitialTheme());

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // ✅ Category select
  const handleCategorySelect = (category) => {
    onSelectCategory(category);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value); //  send to parent
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-end my-2">

        <a href="/addToCart" className="nav-link d-flex align-items-center text-white">
          <i className="bi bi-cart me-2"></i> Cart
        </a>


        <Link className="btn btn-sm btn-success rounded-pill mx-2" to="/addProducts">
          AddProduct
        </Link>

        {/* ✅ Category Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle btn-sm mx-2"
            type="button"
            data-bs-toggle="dropdown"
          >
            Category
          </button>

          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleCategorySelect("")}>
                All
              </button>
            </li>

            {categories.map((category) => (
              <li key={category}>
                <button
                  className="dropdown-item"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Search Box */}
        <div className="col-md-2 mx-2">
          <input
            className="form-control form-control-sm"
            type="search"
            placeholder="Search product..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </nav>
  );
}
