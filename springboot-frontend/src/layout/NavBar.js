import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom'
import { Toggle } from '../user/Toggle';
import useLocalStorage from 'use-local-storage';
import "../Page/Home"

export default function NavBar({ onSelectCategory, onSearch }) {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);


  const categories = [
    "Laptop",
    "Headphone",
    "Mobile", 
    "Electronics",
    "Toys",
    "Fashion",
  ];

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
    <div className="container-fluid d-flex justify-content-end my-2">
    <a href="/addToCart" className="nav-link  d-flex align-items-center text-white">
          <i className="bi bi-cart me-2"></i> Cart
        </a>
       <Link className="btn btn-sm btn-secondary btn rounded-pill mx-2" to="/register">Register</Link>
       <Link className="btn btn-sm btn-danger btn rounded-pill mx-2" to="/login">Login</Link>
       <Link className="btn btn-sm btn-success btn rounded-pill mx-2" to="/addProducts">AddProduct</Link>
       <div className="dropdown">
  <button className="btn btn-primary dropdown-toggle btn-sm mx-2" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
    category
  </button>
  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={(e) => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
</div>

          <div className='col-md-2 mx-2'>
          <input   
          className="form-control form-control-sm" 
          type="search"
          placeholder="Search"
          aria-label="Search"/>
          
          </div>
      </div>

  </nav>
  )
}
