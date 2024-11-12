import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };
        fetchCart();
    }, [userId]);  // Depend on userId so it only fetches when userId changes

    if (!cart) {
        return <div>Loading cart...</div>;
    }

    return (
        <div>
            <h1>Giỏ Hàng của Bạn</h1>
            <table>
                <thead>
                    <tr>
                        <th>Sản Phẩm</th>
                        <th>Số Lượng</th>
                        <th>Giá</th>
                        <th>Tổng</th>
                    </tr>
                </thead>
                <tbody>
                    {cart?.Products?.map((product, index) => (
                        <tr key={index}>
                            <td>{product.ProductID}</td>
                            <td>{product.Quantity}</td>
                            <td>{product.Price.toLocaleString()} VND</td>
                            <td>{(product.Price * product.Quantity).toLocaleString()} VND</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>
                Tổng Cộng:{" "}
                {cart.Products?.reduce((total, product) => total + product.Price * product.Quantity, 0).toLocaleString()} VND
            </h2>
        </div>
    );
};

export default CartPage;
