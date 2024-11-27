import React from 'react';
import { Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <footer>
      <Container maxWidth="lg">
        <Typography variant="body1">
          Trang chủ | Giới thiệu | Liên hệ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          &copy; 2022 Tên chương trình
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;