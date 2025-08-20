import logo from './logo.svg';
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import NavBar from './layout/NavBar';
import Home from './Page/Home';
import { BrowserRouter as Router,Routes,Route, BrowserRouter } from 'react-router-dom';
import AddUser from './user/AddUser';
import LoginUser from './user/LoginUser';
import AfterLogin from './user/AfterLogin';
import ForgotPassword from './user/ForgotPassword';
import AddProduct from './user/AddProduct';
import Product from './user/Product';
import Cart from './user/Cart';
import UpdateProduct from './user/UpdateProduct';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toggle } from './user/Toggle';
import { useState } from 'react';
import useLocalStorage from 'use-local-storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppProvider } from './Context/Context';

function App() {
  const [cart, setCart] = useState([]);
    const[isDark,isSetDark]=useLocalStorage("isDark",false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
      console.log("Selected category:", category);
    };

    const addToCart = (product) => {
      const existingProduct = cart.find((item) => item.id === product.id);
      if (existingProduct) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    };
  
  return (
    <AppProvider>   
      <BrowserRouter>
       <NavBar onSelectCategory={handleCategorySelect}
       />
        <Routes>
          <Route 
          path="/"
          element={<Home addToCart={addToCart} selectedCategory={selectedCategory}/>}
          />
          <Route exact path="/register" element={<AddUser/>}/>
          <Route exact path="/login" element={<LoginUser/>}/>
          <Route exact path="/afterLogin" element={<AfterLogin/>}/>
          <Route exact path="/forgotPassword" element={<ForgotPassword/>}/>
          <Route exact path="/addProducts" element={<AddProduct/>}/>
          <Route exact path="/productById/:id" element={<Product/>}/>
          <Route exact path="/addToCart" element={<Cart/>}/>
          <Route path="/product/updateProduct/:id" element={<UpdateProduct />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
