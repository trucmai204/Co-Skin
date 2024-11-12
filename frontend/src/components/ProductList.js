import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardMedia, Typography, CardActionArea, IconButton, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleAddToCart = async (productId, quantity, price) => {
    try {
      const userId = localStorage.getItem("userId");
        const response = await axios.post(`http://localhost:5000/api/cart/${userId}/add`, {
            ProductID: productId,
            Quantity: quantity,
            Price: price
        });
        console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
    }
};

  const handleBuyNow = (product) => {
    console.log('Buy now:', product);
    // Xử lý mua ngay (ví dụ: chuyển đến trang thanh toán)
  };

  return (
    <Grid 
      container 
      spacing={3} 
      justifyContent="center" // Căn giữa các sản phẩm
      style={{ padding: '40px' }} // Tăng padding cho container
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
                  Price: {product.Price.toLocaleString('vi-VN')} VND
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.Description}
                </Typography>
              </CardContent>
            </CardActionArea>

            {/* Thêm icon giỏ hàng và nút mua hàng ngay */}
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton 
                color="#FFB6C1" 
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCartIcon />
              </IconButton>
              <Button 
                variant="contained" 
                color="#FFB6C1" 
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
