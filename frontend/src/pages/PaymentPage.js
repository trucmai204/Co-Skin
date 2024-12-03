import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentPage.css"; // Thêm CSS nếu cần

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null); // Khởi tạo cart là null
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Thông báo thanh toán
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [language, setLanguage] = useState("vn");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Nếu có giỏ hàng từ state, dùng nó. Nếu không, truy vấn lại API
    if (location.state?.cart) {
      setCart(location.state.cart);
    } else if (userId) {
      axios
        .get(`http://localhost:5000/api/carts/${userId}`)
        .then((response) => {
          setCart(response.data);
        })
        .catch((error) => {
          console.error("Error fetching cart:", error);
        });
    }
  }, [location.state, userId]);

  // Xử lý kết quả thanh toán khi quay lại từ VNPay
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vnpResponseCode = queryParams.get("vnp_ResponseCode");
    const vnpTxnRef = queryParams.get("vnp_TxnRef");

    if (vnpResponseCode && vnpTxnRef) {
      axios
        .get("http://localhost:5000/api/vnpay/vnpay_return", {
          params: {
            vnp_ResponseCode: vnpResponseCode,
            vnp_TxnRef: vnpTxnRef,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            setPaymentStatus({
              type: "success",
              message: "Thanh toán thành công!",
            });
          } else {
            setPaymentStatus({
              type: "error",
              message: "Thanh toán thất bại. Vui lòng thử lại.",
            });
          }
        })
        .catch((error) => {
          setPaymentStatus({
            type: "error",
            message: "Lỗi khi kiểm tra thanh toán.",
          });
          console.error("Error verifying payment:", error);
        });
    }
  }, []);

  if (!cart || cart.Products.length === 0) {
    return <div>Giỏ hàng không hợp lệ hoặc không có sản phẩm.</div>;
  }

  const totalMoney = () =>
    cart.Products.reduce(
      (total, product) => total + product.Price * product.Quantity,
      0
    );

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const total = totalMoney();

      if (!total || total <= 0) {
        alert("Giỏ hàng không hợp lệ.");
        return;
      }

      if (!selectedBankCode) {
        alert("Vui lòng chọn phương thức thanh toán.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/vnpay/create_payment_url",
        {
          amount: total,
          bankCode: selectedBankCode,
          language,
        }
      );

      if (response.status === 200 && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        alert("Không thể tạo URL thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      alert("Lỗi khi thực hiện thanh toán.");
      console.error("Error during checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container" style={{ mt: "800px" }}>
      <h1>Thanh toán</h1>

      {/* Hiển thị thông báo thanh toán */}
      {paymentStatus && (
        <div
          className={`payment-status ${
            paymentStatus.type === "success" ? "success" : "error"
          }`}
        >
          <p>{paymentStatus.message}</p>
        </div>
      )}

      <div className="order-summary">
        <h2>Thông tin đơn hàng</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cart.Products.map((product) => (
              <tr key={product.ProductID}>
                <td>{product.ProductName}</td>
                <td>{product.Quantity}</td>
                <td>{product.Price.toLocaleString()} VND</td>
                <td>
                  {(product.Price * product.Quantity).toLocaleString()} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="total-amount">
        <h3>Tổng cộng: {totalMoney().toLocaleString()} VND</h3>
      </div>

      <div className="payment-options">
        <h3>Chọn phương thức thanh toán:</h3>
        <div>
          <label>
            <input
              type="radio"
              name="bankCode"
              value=""
              checked={selectedBankCode === ""}
              onChange={(e) => setSelectedBankCode(e.target.value)}
            />
            Cổng thanh toán VNPAYQR
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="bankCode"
              value="VNPAYQR"
              checked={selectedBankCode === "VNPAYQR"}
              onChange={(e) => setSelectedBankCode(e.target.value)}
            />
            Thanh toán qua ứng dụng hỗ trợ VNPAYQR
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="bankCode"
              value="VNBANK"
              checked={selectedBankCode === "VNBANK"}
              onChange={(e) => setSelectedBankCode(e.target.value)}
            />
            Thanh toán qua ATM
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="bankCode"
              value="INTCARD"
              checked={selectedBankCode === "INTCARD"}
              onChange={(e) => setSelectedBankCode(e.target.value)}
            />
            Thanh toán qua thẻ quốc tế
          </label>
        </div>
      </div>

      <div className="payment-buttons">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="checkout-btn"
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
