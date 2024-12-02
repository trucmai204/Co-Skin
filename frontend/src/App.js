import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import ProductList from "./components/ProductList";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./components/CategoryList";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Router>
      {isLoggedIn && <Navbar cartCount={cartCount} />}
      <ToastContainer />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
                <HomePage setCartCount={setCartCount} />
            }
          />
          <Route
            path="/products"
            element={
                <ProductList setCartCount={setCartCount} />
            }
          />
          <Route
            path="/product/:id"
            element={
                <ProductPage setCartCount={setCartCount}/>
            }
          />
          <Route
            path="/cart"
            element={
                <CartPage />
            }
          />
          <Route
            path="/categories"
            element={
                <CategoryList />
            }
          />
          <Route
            path="/category/:id"
            element={
                <CategoryPage setCartCount={setCartCount} />
            }
          />
          <Route
            path="/category-products/:id"
            element={
                <CategoryProductsPage />
            }
          />
          <Route
            path="/search-products"
            element={
                <SearchPage setCartCount={setCartCount} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
