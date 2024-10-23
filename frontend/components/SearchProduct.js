import React, { useState } from 'react';
import axios from 'axios';

function SearchProduct() {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('/search', {
        params: {
          title: query,
          minPrice,
          maxPrice,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {searchResults.map((product) => (
          <div key={product._id}>
            <h2>{product.title}</h2>
            <p>Price: ₹{product.priceHistory[product.priceHistory.length - 1]?.price}</p>
            <p>{product.description}</p>
            <img src={product.imageUrl} alt={product.title} />

            <h3>Price History:</h3>
            <ul>
              {product.priceHistory.map((priceEntry, index) => (
                <li key={index}>
                  Price: ₹{priceEntry.price} - Date: {new Date(priceEntry.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchProduct;
