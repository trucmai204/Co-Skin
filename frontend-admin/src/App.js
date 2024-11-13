import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => setIsLoggedIn(true);

    return (
        <Router>
            {isLoggedIn && <Navbar />}
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route
                    path="/admin/management"
                    element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/products"
                    element={isLoggedIn ? <ProductManagement /> : <Navigate to="/login" />}
                />
                <Route
                    path="/categories"
                    element={isLoggedIn ? <CategoryManagement /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
