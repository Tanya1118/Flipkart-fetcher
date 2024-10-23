import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [url, setUrl] = useState('');
    const [productDetails, setProductDetails] = useState(null);
    const [error, setError] = useState(null);
    const [priceHistory, setPriceHistory] = useState([]); // For storing price history
    const [searchTerm, setSearchTerm] = useState(''); // For storing the search term
    const [products, setProducts] = useState([]); // Initialize products as an empty array

    useEffect(() => {
        // Fetch all products when the component loads
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                const data = await response.json();
                setProducts(data); // Set fetched products
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const fetchProductDetails = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/fetch-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }

            const data = await response.json();
            setProductDetails(data);
            setError(null); // Reset error on success
            setPriceHistory(data.priceHistory); // Initialize price history from the response
        } catch (err) {
            setError(err.message);
            setProductDetails(null); // Reset product details on error
        }
    };

    const recheckPrice = async () => {
        try {
            const response = await fetch('http://localhost:5000/fetch-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await response.json();

            if (response.ok) {
                // Update product details and append new price to history
                setProductDetails(data);
                setPriceHistory(prev => [...prev, { date: new Date().toLocaleString(), price: data.price }]);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Error fetching product details');
        }
    };

    // Filter products by search term
    const filteredProducts = Array.isArray(products) ? products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="App">
            <h1>Flipkart Product Fetcher</h1>

            {/* Form to fetch product details */}
            <form onSubmit={fetchProductDetails}>
                <input
                    type="text"
                    placeholder="Enter Flipkart product link"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="input-box"
                />
                <button type="submit" className="btn-fetch">Fetch Details</button>
            </form>

            {error && <p className="error">{error}</p>}

            {/* Display fetched product details */}
            {productDetails && (
                <div className="product-details">
                    <h2>{productDetails.title}</h2>
                    <img src={productDetails.imageUrl} alt={productDetails.title} style={{ maxWidth: '200px' }} />
                    <p><strong>Description:</strong> {productDetails.description}</p>
                    <p><strong>Current Price:</strong> {productDetails.price}</p> {/* Current Price Display */}
                    <p><strong>Original Price:</strong> {productDetails.originalPrice || 'N/A'}</p> {/* Original Price Display (if available) */}
                    <p><strong>Rating:</strong> {productDetails.rating}</p>
                    <p><strong>Reviews:</strong> {productDetails.reviews}</p>
                    <p><strong>Total Purchases:</strong> {productDetails.totalPurchases}</p>
                    <button onClick={recheckPrice} className="btn-recheck">Recheck Price</button>
                </div>
            )}

            {/* Display price history */}
            {priceHistory.length > 0 && (
                <div className="price-history">
                    <h3>Price History</h3>
                    <ul>
                        {priceHistory.map((entry, index) => (
                            <li key={index}>{entry.date}: {entry.price}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Search functionality */}
            <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-box"
            />

            {/* Display filtered products */}
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product._id} className="product-item">
                            <h2>{product.title}</h2>
                            <p>Current Price: {product.priceHistory.length > 0 ? product.priceHistory[product.priceHistory.length - 1].price : 'No price available'}</p>
                            <p>Rating: {product.rating}</p>
                            <p>Total Purchases: {product.totalPurchases}</p>
                            <p>{product.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
}

export default App;
