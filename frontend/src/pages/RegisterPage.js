import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/add", {
        Username: username,
        Email: email,
        Password: password,
      });

      // Kiểm tra phản hồi từ API
      if (response.status === 201) {
        navigate("/login"); // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      }
    } catch (error) {
      setError("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 1 }}>
          Đăng ký
        </Typography>
      </Box>
      
      {/* Form đăng ký */}
      <form onSubmit={handleRegister}>
        <TextField
          label="Tên người dùng"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FFB6C1",
            color: "#000",
            mt: 2,
            "&:hover": {
              backgroundColor: "#FF69B4",
            },
          }}
          fullWidth
          type="submit"
        >
          Đăng ký
        </Button>
      </form>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Đã có tài khoản?{" "}
          <Button color="primary" onClick={() => navigate("/login")}>
            Đăng nhập ngay
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
