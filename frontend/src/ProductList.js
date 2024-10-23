import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div>
      <h2>All Products</h2>
      {products.length === 0 ? <p>No products available.</p> : (
        products.map(product => (
          <div key={product._id}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Current Price: {product.priceHistory[product.priceHistory.length - 1].price}</p>
            <h4>Price History:</h4>
            <ul>
              {product.priceHistory.map((history, index) => (
                <li key={index}>{history.price} (on {new Date(history.date).toLocaleString()})</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductList;
