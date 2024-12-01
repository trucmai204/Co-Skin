import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "./components/ProductList";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./components/CategoryList";
import RegisterPage from './pages/RegisterPage';
import Footer from "./components/Footer";
import SearchPage from "./pages/SearchPage";
import "./App.css";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Router>
      {isLoggedIn && <Navbar cartCount={cartCount} />}{" "}
      {/* Hiển thị Navbar nếu đã đăng nhập */}
      <ToastContainer />
      <div className="content">
        {" "}
        {/* Bọc các Routes trong div content */}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductList setCartCount={setCartCount} />}
          />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route
            path="/category-products/:id"
            element={<CategoryProductsPage />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search-products" element={<SearchPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
