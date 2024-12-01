import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Container, Box, Divider } from '@mui/material';
import ProductActions from "./ProductAction";

function ProductDetail({ setCartCount }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error('Error fetching product detail:', error));
  }, [id]);

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" style={{ marginTop: '5rem' }}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }} // Cột trên thiết bị nhỏ và hàng ngang trên thiết bị lớn
        boxShadow={3}
        borderRadius="8px"
        bgcolor="#fff"
      >
        {/* Hình ảnh sản phẩm */}
        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
          <img
            src={product.ImageURL}
            alt={product.ProductName}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'cover',
              maxHeight: '300px'
            }}
          />
        </Box>

        {/* Thông tin sản phẩm */}
        <Box flex={2} padding={{ xs: '10px', md: '20px' }}>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
            {product.ProductName}
          </Typography>

          <Divider style={{ margin: '10px 0' }} />

          <Typography variant="h6" color="primary" gutterBottom>
            Giá tiền: {product.Price.toLocaleString('vi-VN')} VND
          </Typography>
          <ProductActions product={product} setCartCount={setCartCount} />

          <Divider style={{ margin: '10px 0' }} />

          <Typography variant="body1" color="text.secondary" paragraph>
            {product.Description}
          </Typography>
        </Box>
        
      </Box>
    </Container>
  );
}

export default ProductDetail;
