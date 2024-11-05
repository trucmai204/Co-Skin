// src/components/Register.jsx
import React from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <form>
      <Typography variant="h5">Đăng Ký</Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Mật khẩu"
        type="password"
        autoComplete="current-password"
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Xác nhận mật khẩu"
        type="password"
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Đăng Ký
      </Button>
      <Typography variant="body2" style={{ marginTop: '10px' }}>
        Đã có tài khoản?{' '}
        <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>
          Đăng nhập ngay
        </Link>
      </Typography>
    </form>
  );
};

export default Register;
