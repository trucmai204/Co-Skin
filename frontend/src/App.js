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
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
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
        {/* Bọc các Routes trong div content */}
        <Routes>
          {/* Không cần đăng nhập */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Cần đăng nhập */}
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <HomePage setCartCount={setCartCount} cartCount={cartCount} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ProductList setCartCount={setCartCount} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CategoryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CategoryPage setCartCount={setCartCount} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category-products/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CategoryProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-products"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <SearchPage setCartCount={setCartCount} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
