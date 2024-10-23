document.getElementById('product-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const url = document.getElementById('product-url').value;

    // Send request to backend to fetch product details
    const response = await fetch('/fetch-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });

    const data = await response.json();
    displayProductDetails(data); // Function to display the product details
});

function displayProductDetails(data) {
    const detailsDiv = document.getElementById('product-details');
    if (data.error) {
        detailsDiv.innerHTML = `<p>${data.error}</p>`;
        return;
    }

    // Display product details
    detailsDiv.innerHTML = `
        <h2>${data.title}</h2>
        <img src="${data.imageUrl}" alt="${data.title}" style="max-width: 200px;" />
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Current Price:</strong> ${data.price}</p>
        <p><strong>Rating:</strong> ${data.rating}</p>
        <p><strong>Reviews:</strong> ${data.reviews}</p>
        <p><strong>Total Purchases:</strong> ${data.totalPurchases}</p>
        <button onclick="recheckPrice('${data.title}')">Recheck Price</button>
        <div id="price-history-${data.title.replace(/\s+/g, '-').toLowerCase()}"></div>
    `;
}
