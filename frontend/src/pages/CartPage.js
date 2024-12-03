import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import "./CartPage.css";
import { toast } from "react-toastify";

const CartPage = ({ setCartCount }) => {
  const [cart, setCart] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/carts/${userId}`
        );
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userId]);

  const updateQuantity = async (userId, productId, quantity) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/carts/update-quantity",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
      } else {
        // Nếu có lỗi, hiển thị thông báo
        setError(data.error || "An error occurred while updating the cart.");
      }
    } catch (error) {
      setError("An error occurred while communicating with the server.");
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
      updateQuantity(userId, productId, newQuantity);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/carts/remove/${userId}/${productId}`
      );
      toast.success("Xóa sản phẩm thành công!");
      setCart(response.data);
      setCartCount((prevCount) => response.data.Products.lenght);
      localStorage.setItem("userCartCount", response.data.Products.lenght);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };
  async function handleCheckout() {
    /*try {
      const total = totalMoney(selectedProducts);
      const newPayment = {
        products: selectedProducts,
        amount: total,
        bankCode: null,
        language: "vn",
      };
      const response = await axios.post(
        "http://localhost:8888/api/v1/vnpay/create_payment_url",
        newPayment
      );
      if (response.status === 200 && response.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      alert(`Lỗi: ${error?.message}`);
    }*/
  }

  if (!cart) {
    return <div>Đang cập nhật giỏ hàng...</div>;
  }

  return (
    <div className="cart-container">
      <h1>Giỏ hàng</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.Products.map((product) => (
            <tr key={product.ProductID}>
              <td>{product.ProductName}</td>
              <td className="quantity-cell">
                <IconButton
                  onClick={() =>
                    handleDecreaseQuantity(
                      product.ProductID,
                      product.Quantity
                    )
                  }
                >
                  <RemoveIcon className="quantity-icon" />
                </IconButton>
                <span className="quantity">{product.Quantity}</span>
                <IconButton
                  onClick={() =>
                    handleIncreaseQuantity(product.ProductID, product.Quantity)
                  }
                >
                  <AddIcon className="quantity-icon" />
                </IconButton>
              </td>
              <td>{product.Price.toLocaleString()} VND</td>
              <td>{(product.Price * product.Quantity).toLocaleString()} VND</td>
              <td>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveProduct(product.ProductID)}
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="total-amount">
        Tổng cộng:{" "}
        {cart.Products.reduce(
          (total, product) => total + product.Price * product.Quantity,
          0
        ).toLocaleString()}{" "}
        đ
      </h2>
      <button className="checkout-btn" onClick={handleCheckout}>
        Thanh Toán
      </button>
    </div>
  );
};

export default CartPage;
