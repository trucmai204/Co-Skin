import React from "react";
import { IconButton, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";
import axios from "axios";

function ProductActions({ product, setCartCount }) {
  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `http://localhost:5000/api/carts/add/${userId}`,
        {
          ProductID: product.ProductID,
          Quantity: 1,
          Price: product.Price,
        }
      );

      if (response.status === 200) {
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
        setCartCount((prevCount) => prevCount + 1); // Tăng số lượng giỏ hàng
      }
    } catch (error) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleBuyNow = () => {
    console.log("Mua ngay:", product);
  };

  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <IconButton
        sx={{ color: "#fb6f92" }}
        onClick={handleAddToCart}
      >
        <ShoppingCartIcon />
      </IconButton>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#fb6f92" }}
        onClick={handleBuyNow}
      >
        Mua hàng ngay
      </Button>
    </div>
  );
}

export default ProductActions;
