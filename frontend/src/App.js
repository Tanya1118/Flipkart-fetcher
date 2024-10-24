import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [url, setUrl] = useState('');
    const [productDetails, setProductDetails] = useState(null);
    const [error, setError] = useState(null);
    const [priceHistory, setPriceHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // For storing the search term
    const [products, setProducts] = useState([]); // Initialize products as an empty array

    useEffect(() => {
        // Fetch all products initially when the component loads
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/products');
            const data = await response.json();
            setProducts(data); // Set fetched products
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

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
            setError(null);
            setPriceHistory(data.priceHistory || []);
        } catch (err) {
            setError(err.message);
            setProductDetails(null);
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
                // Check if priceHistory exists and has at least one entry
                if (data.priceHistory && data.priceHistory.length > 0) {
                    // Update product details and append the new price to the price history
                    setProductDetails(data); 
                    setPriceHistory(prev => [...prev, { price: data.priceHistory[data.priceHistory.length - 1].price }]); // Update with the latest price
                } else {
                    setError('Price history not found.');
                }
            } else {
                setError(data.error || 'Failed to recheck price');
            }
        } catch (err) {
            setError('Error fetching product details');
        }
    };
    
    // New function to search products from the backend
    const searchProducts = async (searchTerm) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/search?title=${searchTerm}`);
            const data = await response.json();
            setProducts(data); // Update the products based on search results
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    // Trigger search when searchTerm changes
    useEffect(() => {
        if (searchTerm.trim()) {
            searchProducts(searchTerm);
        } else {
            fetchAllProducts(); // Fetch all products if search term is empty
        }
    }, [searchTerm]);

    return (
        <div className="App">
            <h1>Flipkart Product Fetcher</h1>

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

            {productDetails && (
                <div className="product-details">
                    <h2>{productDetails.title}</h2>
                    <img src={productDetails.imageUrl} alt={productDetails.title} style={{ maxWidth: '200px' }} />
                    <p><strong>Description:</strong> {productDetails.description || 'Description not found'}</p>
                    <p><strong>Highlights:</strong> {productDetails.highlights || 'Highlights not found'}</p> {/* Add Highlights */}
                    <p><strong>Current Price:</strong> {priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : 'Price not found'}</p>
                    <p><strong>Rating:</strong> {productDetails.rating || 'No rating available'}</p>
                    <p><strong>Reviews:</strong> {productDetails.reviews || 'No reviews available'}</p>
                    <p><strong>Total Purchases:</strong> {productDetails.totalPurchases || 'Total purchases not found'}</p>
                    <button onClick={recheckPrice} className="btn-recheck">Recheck Price</button>
                </div>
            )}

            {/* Search input */}
            <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-box"
            />

            {/* Display filtered products */}
            <div className="product-list">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product._id} className="product-item">
                            <h2>{product.title}</h2>
                            <p>Current Price: {product.priceHistory.length > 0 ? product.priceHistory[product.priceHistory.length - 1].price : 'No price available'}</p>
                            <p>Rating: {product.rating || 'No rating available'}</p>
                            <p>Total Purchases: {product.totalPurchases || 'Total purchases not found'}</p>
                            <p><strong>Highlights:</strong> {product.highlights || 'Highlights not found'}</p> {/* Display highlights */}
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
