import { Link } from 'react-router-dom';
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar() { 

  return (
    <AppBar position="static" sx={{ backgroundColor: '#FFB6C1' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Co-Skin
        </Typography>
        <Button color="inherit" component={Link} to="/">Trang chủ</Button>
        <Button color="inherit" component={Link} to="/products">Sản Phẩm</Button>
        <Button color="inherit" component={Link} to="/cart">
          Giỏ hàng
        </Button>
        <Button color="inherit" component={Link} to="/users">Người dùng</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
