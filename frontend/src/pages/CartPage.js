import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [error, setError] = useState(null);

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

 const updateQuantity = async (userId, productId, quantity) => {
    try {
        const response = await fetch('http://localhost:5000/api/carts/update-quantity', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                productId,
                quantity,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setCart(data.cart); 
        } else {
            // Nếu có lỗi, hiển thị thông báo
            setError(data.error || 'An error occurred while updating the cart.');
        }
    } catch (error) {
        setError('An error occurred while communicating with the server.');
        console.error(error);
    }
};
  const handleIncreaseQuantity = (productId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(userId, productId, newQuantity);
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(userId,productId, newQuantity);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/carts/remove/${userId}/${productId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };
  async function handleCheckout() {
    try {
      // Tính tổng tiền của các sản phẩm đã chọn
      const total = totalMoney(selectedProducts);
    
      // Tạo một đối tượng mới đại diện cho thông tin thanh toán
      const newPayment = {
        products: selectedProducts, // Danh sách sản phẩm
        amount: total, // Tổng tiền
        bankCode: null, // Mã ngân hàng (hiện chưa được sử dụng)
        language: "vn", // Ngôn ngữ (tiếng Việt)
      };
    
      // Gửi yêu cầu POST đến API để tạo URL thanh toán
      const response = await axios.post(
        "http://localhost:8080/api/v1/vnpay/create_payment_url",
        newPayment
      );
    
      // Kiểm tra xem yêu cầu có thành công không
      if (response.status === 200 && response.data) {
        // Nếu thành công, chuyển hướng đến URL thanh toán
        window.location.href = response.data;
      }
    } catch (error) {
      // Nếu có lỗi xảy ra, hiển thị thông báo lỗi
      alert("Lỗi: " + error?.message);
    }
  };
  if (!cart) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="cart-container">
      <h1>Giỏ hàng của Bạn</h1>
      <table className="cart-table">
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
              <td className="quantity-cell">
                <button className="quantity-btn" onClick={() => handleDecreaseQuantity(product.ProductID, product.Quantity)}
                > - </button>
                <span className="quantity">{product.Quantity}</span>
                <button className="quantity-btn" onClick={() => handleIncreaseQuantity(product.ProductID, product.Quantity)}
                >
                  +</button>
              </td>
              <td>{product.Price.toLocaleString()} VND</td>
              <td>{(product.Price * product.Quantity).toLocaleString()} VND</td>
              <td>
                <button className="delete-btn" onClick={() => handleRemoveProduct(product.ProductID)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="total-amount">
        Tổng Cộng: {cart.Products.reduce((total, product) => total + product.Price * product.Quantity, 0).toLocaleString()} VND
      </h2>
      <button className="checkout-btn" onClick={handleCheckout}>Thanh Toán</button>
    </div>
  );
};

export default CartPage;
