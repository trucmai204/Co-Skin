// src/components/Login.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Đăng nhập thành công:', data);
        // Chuyển hướng hoặc lưu thông tin người dùng
        navigate('/dashboard'); // Thay đổi đến trang dashboard hoặc trang khác
      } else {
        alert(data.message); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" className="login-title">Đăng Nhập</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          type="submit" 
          fullWidth 
          variant="contained" 
          className="login-button"
          onClick={handleSubmit}
        >
          Đăng Nhập
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="login-link">
            Đăng ký ngay
          </Link>
        </Typography>
      </form>
    </div>
  );
};

export default Login;
