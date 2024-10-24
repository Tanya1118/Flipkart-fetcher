# Flipkart-fetcher
The Flipkart Product Fetcher is a web application that allows users to fetch and display details of Flipkart products by entering the product URL. It also maintains a price history of the products and provides the ability to search for products by title. Users can recheck the price of previously fetched products and view historical price trends.

# Features
Fetch Product Details: Retrieve details such as title, description, highlights, current price, rating, reviews, and total purchases for any Flipkart product using its URL.
Price History: Track the historical price of a product and display it for reference.
Search Products: Search through previously fetched products by title.
Recheck Price: Recheck and update the price for any product already fetched.
Responsive UI: A clean, responsive interface that works across devices.
Technologies Used
Frontend: React.js
Backend: Node.js, Express.js
Web Scraping: Puppeteer (to fetch product details from Flipkart)
Database: MongoDB (to store product details and price history)
Styling: CSS
# Setup Instructions
Prerequisites
Ensure you have the following installed:

Node.js
MongoDB
A running instance of MongoDB (local or cloud, such as MongoDB Atlas)
Clone the Repository

git clone https://github.com/Tanya1118/Flipkart-fetcher.git
cd flipkart-product-fetcher
# Backend Setup
Navigate to the backend folder:


cd backend
Install backend dependencies:

npm install
Set up environment variables in a .env file:


MONGO_URI=<Your MongoDB connection string>
PORT=5000
Start the backend server:


npm start
# Frontend Setup
Navigate to the frontend folder:


cd frontend
Install frontend dependencies:


npm install
Start the React development server:


npm start
# Application Usage
Open your browser and go to http://localhost:3000 to access the frontend.
Enter a Flipkart product URL in the input box and click Fetch Details.
View product information including price, rating, and reviews.
Recheck the price by clicking the Recheck Price button.
Use the search box to search for products by title.

# API Endpoints
Fetch Product Details
POST /fetch-details

Request Body:


{
  "url": "<Flipkart product URL>"
}
Response:


{
  "title": "Product Title",
  "description": "Product Description",
  "priceHistory": [
    { "date": "2024-10-24", "price": 1299 }
  ],
  "rating": 4.5,
  "reviews": "100 reviews",
  "totalPurchases": "500 purchases",
  "highlights": "Product highlights"
}
Search Products
GET /api/products/search?title=<product title>

Response:

[
  {
    "_id": "123456",
    "title": "Product Title",
    "priceHistory": [{ "date": "2024-10-24", "price": 1299 }],
    "rating": 4.5,
    "totalPurchases": "500 purchases"
  }
]
# Future Enhancements
User Authentication: Allow users to create accounts and manage their tracked products.
Notifications: Notify users when the price of a tracked product drops below a certain threshold.
Price Charts: Visualize the price history using charts.
Additional Filters: Filter products by categories, rating, and price range.