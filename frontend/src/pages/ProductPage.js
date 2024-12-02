// src/pages/ProductPage.js
import React from 'react';
import ProductDetail from '../components/ProductDetail';
import ProductActions from '../components/ProductAction';

function ProductPage({setCartCount}) {
  return (
    <div>
      <ProductDetail setCartCount={setCartCount}/>
    </div>
  );
}

export default ProductPage;
