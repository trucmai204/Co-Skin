import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/carts/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, [userId]);

  const handleIncreaseQuantity = async (productId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/carts/${userId}/products/${productId}`, {
        quantity: cart.Products.find((product) => product.ProductID === productId).Quantity + 1,
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/carts/${userId}/products/${productId}`, {
        quantity: cart.Products.find((product) => product.ProductID === productId).Quantity - 1,
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/carts/${userId}/products/${productId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

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
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cart.Products.map((product) => (
            <tr key={product.ProductID}>
              <td>{product.ProductID}</td>
              <td>
                <button onClick={() => handleDecreaseQuantity(product.ProductID)}>-</button>
                {product.Quantity}
                <button onClick={() => handleIncreaseQuantity(product.ProductID)}>+</button>
              </td>
              <td>{product.Price.toLocaleString()} VND</td>
              <td>{(product.Price * product.Quantity).toLocaleString()} VND</td>
              <td>
                <button onClick={() => handleRemoveProduct(product.ProductID)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>
        Tổng Cộng:{" "}
        {cart.Products.reduce((total, product) => total + product.Price * product.Quantity, 0).toLocaleString()} VND
      </h2>
    </div>
  );
};

export default CartPage;