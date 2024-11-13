import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardMedia, Typography, CardActionArea, IconButton, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`http://localhost:5000/api/carts/add/${userId}`, {
        ProductID: product.ProductID,
        Quantity: 1,
        Price: product.Price,
      });
  
      if (response.status === 200) {
        console.log('Sản phẩm đã được thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi thêm sản phẩm vào giỏ hàng:', error);
    }
  };
  
  

  const handleBuyNow = (product) => {
    console.log('Mua ngay:', product);
    // Xử lý chuyển đến trang thanh toán hoặc các bước tiếp theo
  };

  return (
    <Grid 
      container 
      spacing={3} 
      justifyContent="center"
      style={{ padding: '40px' }}
    >
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.ProductID}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea component={Link} to={`/product/${product.ProductID}`}>
              <CardMedia
                component="img"
                height="200"
                image={product.ImageURL}
                alt={product.ProductName}
              />
              <CardContent style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {product.ProductName}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  Giá: {product.Price.toLocaleString('vi-VN')} VND
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.Description}
                </Typography>
              </CardContent>
            </CardActionArea>

            {/* Thêm icon giỏ hàng và nút mua hàng ngay */}
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton
                sx={{ color: '#FFB6C1' }} 
                onClick={() => handleAddToCart(product)} // Sử dụng giá trị sản phẩm và số lượng
              >
                <ShoppingCartIcon />
              </IconButton>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#FFB6C1' }} 
                onClick={() => handleBuyNow(product)}
              >
                Mua hàng ngay
              </Button>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;
