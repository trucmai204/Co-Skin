import { Link } from "react-router-dom";
import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function Navbar({ cartCount }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#FFB6C1",
        zIndex: 1000, // Đảm bảo navbar nằm trên các thành phần khác
        top: 0, // Đảm bảo navbar luôn ở trên cùng của trang
        left: 0, // Đảm bảo navbar nằm sát trái màn hình
        width: "100%", // Chiều rộng của navbar là 100%
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-around",
          color: "#C71585",
        }}
      >
        <Button color="inherit" component={Link} to="/">
          Trang chủ
        </Button>
        <Button color="inherit" component={Link} to="/categories">
          Danh Mục
        </Button>
        <Button color="inherit" component={Link} to="/products">
          Sản Phẩm
        </Button>
        <IconButton color="inherit" component={Link} to="/cart">
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Button color="inherit" component={Link} to="/users">
          Người dùng
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
