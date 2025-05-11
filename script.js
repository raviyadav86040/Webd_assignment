// Sample products with categories and more details
const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        price: 19.99,
        image: "shopping.webp",
        category: "clothing",
        description: "Comfortable cotton t-shirt for everyday wear",
        rating: 4.5,
        reviews: 128,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Navy"]
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        price: 49.99,
        image: "shopping-1.webp",
        category: "clothing",
        description: "Modern slim fit jeans with stretch",
        rating: 4.3,
        reviews: 95,
        sizes: ["30", "32", "34", "36"],
        colors: ["Blue", "Black", "Gray"]
    },
    {
        id: 3,
        name: "Wireless Earbuds",
        price: 79.99,
        image: "shopping-2.webp",
        category: "electronics",
        description: "High-quality wireless earbuds with noise cancellation",
        rating: 4.7,
        reviews: 256,
        colors: ["Black", "White"]
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 199.99,
        image: "download-2.jpg",
        category: "electronics",
        description: "Feature-rich smartwatch with health tracking",
        rating: 4.6,
        reviews: 189,
        colors: ["Black", "Silver", "Rose Gold"]
    },
    {
        id: 5,
        name: "Leather Wallet",
        price: 29.99,
        image: "images.jpg",
        category: "accessories",
        description: "Genuine leather wallet with multiple card slots",
        rating: 4.4,
        reviews: 76,
        colors: ["Brown", "Black"]
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 39.99,
        image: "download-3.jpg",
        category: "accessories",
        description: "Stylish UV protection sunglasses",
        rating: 4.2,
        reviews: 112,
        colors: ["Black", "Tortoise", "Gold"]
    },
    {
        id: 7,
        name: "Coffee Table",
        price: 149.99,
        image: "shopping-3.webp",
        category: "home",
        description: "Modern wooden coffee table with storage",
        rating: 4.8,
        reviews: 45,
        colors: ["Walnut", "Oak", "Black"]
    },
    {
        id: 8,
        name: "Throw Pillows",
        price: 24.99,
        image: "download-4.jpg",
        category: "home",
        description: "Decorative throw pillows for your sofa",
        rating: 4.1,
        reviews: 89,
        colors: ["Gray", "Blue", "Beige"]
    }
];

let cart = [];
let wishlist = [];
let currentCategory = 'all';
let searchQuery = '';
let maxPrice = 1000;
let sortBy = 'default';
let discount = 0;

// DOM Elements
const productsDiv = document.getElementById('products');
const cartSidebar = document.getElementById('cart-sidebar');
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const overlay = document.getElementById('overlay');
const cartIcon = document.getElementById('cart-icon');
const wishlistIcon = document.getElementById('wishlist-icon');
const closeCart = document.querySelector('.close-cart');
const closeWishlist = document.querySelector('.close-wishlist');
const searchInput = document.getElementById('search');
const categoryButtons = document.querySelectorAll('.category-btn');
const themeToggle = document.querySelector('.theme-toggle');
const notification = document.getElementById('notification');
const priceFilter = document.getElementById('price-filter');
const priceValue = document.getElementById('price-value');
const sortSelect = document.getElementById('sort');
const quickView = document.getElementById('quick-view');
const closeQuickView = document.querySelector('.close-quick-view');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.dataset.theme);
});

//Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.dataset.theme = savedTheme;
    themeToggle.innerHTML = savedTheme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Cart Sidebar Toggle
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Wishlist Sidebar Toggle
wishlistIcon.addEventListener('click', () => {
    wishlistSidebar.classList.add('active');
    overlay.classList.add('active');
});

closeWishlist.addEventListener('click', () => {
    wishlistSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    wishlistSidebar.classList.remove('active');
    overlay.classList.remove('active');
    quickView.classList.remove('active');
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    showProducts();
});

// Category Filter
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.dataset.category;
        showProducts();
    });
});

// Price Filter
priceFilter.addEventListener('input', (e) => {
    maxPrice = parseInt(e.target.value);
    priceValue.textContent = `$${maxPrice}`;
    showProducts();
});

// Sort Products
sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    showProducts();
});

// Display Products
function showProducts() {
    let filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery) || 
                            product.description.toLowerCase().includes(searchQuery);
        const matchesPrice = product.price <= maxPrice;
        return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sort products
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    productsDiv.innerHTML = filteredProducts.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}" onclick="showQuickView(${product.id})">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <div class="rating">
                ${generateStars(product.rating)}
                <span>(${product.reviews})</span>
            </div>
            <p class="price">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Generate Star Rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Quick View
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    const quickViewDetails = document.querySelector('.quick-view-details');
    
    quickViewDetails.innerHTML = `
        <div class="quick-view-content">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="description">${product.description}</p>
                <div class="rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <p class="price">$${product.price.toFixed(2)}</p>
                ${product.sizes ? `
                    <div class="sizes">
                        <label>Size:</label>
                        <select>
                            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </div>
                ` : ''}
                ${product.colors ? `
                    <div class="colors">
                        <label>Color:</label>
                        <div class="color-options">
                            ${product.colors.map(color => `
                                <button class="color-btn" style="background-color: ${color.toLowerCase()}"></button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    quickView.classList.add('active');
    overlay.classList.add('active');
}

closeQuickView.addEventListener('click', () => {
    quickView.classList.remove('active');
    overlay.classList.remove('active');
});

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Toggle Wishlist
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = wishlist.find(item => item.id === productId);

    if (existingItem) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification(`${product.name} removed from wishlist!`);
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        showNotification(`${product.name} added to wishlist!`);
    }

    updateWishlist();
}

// Update Wishlist
function updateWishlist() {
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistCount = document.getElementById('wishlist-count');
    
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-actions">
                <button onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i>
                </button>
                <button onclick="toggleWishlist(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    wishlistCount.textContent = wishlist.length;
}

// Update Cart
function updateCart() {
    const cartList = document.getElementById('cart-list');
    const cartCount = document.getElementById('cart-count');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const discount = document.getElementById('discount');
    const total = document.getElementById('total');
    
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
            </div>
            <div class="item-price">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotalAmount > 0 ? 5.99 : 0;
    const discountAmount = (subtotalAmount * discount) / 100;
    const totalAmount = subtotalAmount + shippingCost - discountAmount;

    cartCount.textContent = totalItems;
    subtotal.textContent = subtotalAmount.toFixed(2);
    shipping.textContent = shippingCost.toFixed(2);
    discount.textContent = discountAmount.toFixed(2);
    total.textContent = totalAmount.toFixed(2);
}

// Remove from Cart
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification(`${item.name} removed from cart!`);
}

// Apply Promo Code
document.getElementById('apply-promo').addEventListener('click', () => {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.toUpperCase();

    if (promoCode === 'SAVE10') {
        discount = 10;
        showNotification('Promo code applied! 10% discount added.', 'success');
    } else if (promoCode === 'SAVE20') {
        discount = 20;
        showNotification('Promo code applied! 20% discount added.', 'success');
    } else {
        discount = 0;
        showNotification('Invalid promo code!', 'error');
    }

    updateCart();
    promoInput.value = '';
});

// Checkout
document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showNotification('Thank you for your purchase!', 'success');
    cart = [];
    updateCart();
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Notification System
function showNotification(message, type = 'success') {
    const notificationText = document.getElementById('notification-text');
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize
showProducts(); 