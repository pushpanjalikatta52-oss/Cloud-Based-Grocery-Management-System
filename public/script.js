const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const search = document.getElementById("search");

let products = [];

async function loadProducts() {
    const response = await fetch("/api/products");
    products = await response.json();

    displayProducts(products);
    updateDashboard();
}

function displayProducts(data) {

    productList.innerHTML = "";

    data.forEach(product => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.quantity}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>
            </td>
        `;

        productList.appendChild(row);
    });
}

productForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const product = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value
    };

    await fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    productForm.reset();

    loadProducts();
});

async function deleteProduct(id) {

    await fetch(`/api/products/${id}`, {
        method: "DELETE"
    });

    loadProducts();
}

search.addEventListener("input", function() {

    const searchText = search.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
});

function updateDashboard() {

    document.getElementById("totalProducts").textContent =
        products.length;

    const totalStock = products.reduce(
        (total, product) => total + product.quantity,
        0
    );

    const inventoryValue = products.reduce(
        (total, product) =>
            total + (product.price * product.quantity),
        0
    );

    document.getElementById("totalStock").textContent =
        totalStock;

    document.getElementById("inventoryValue").textContent =
        "₹" + inventoryValue;
}

loadProducts();