import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Gọi API để xác thực người dùng
      const response = await axios.post("http://localhost:5000/api/users/login", { Email: username, Password: password });

      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        const userId = response.data.userId; 
        localStorage.setItem("userId", userId); 

        onLogin();
        navigate("/"); 
      }
    } catch (error) {
      setError("Tên người dùng hoặc mật khẩu không đúng!");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom sx={{fontWeight: "bold", mb: 1}}>
          Đăng nhập
        </Typography>
      </Box>
      <TextField
        label="Tên người dùng"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Mật khẩu"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#FFB6C1',
          color: '#000',
          mt: 2,
          '&:hover': {
            backgroundColor: '#FF69B4',
          },
        }}
        fullWidth
        onClick={handleLogin}
      >
        Đăng nhập
      </Button>
    </Container>
  );
}

export default LoginPage;
