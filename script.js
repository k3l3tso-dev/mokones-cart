// Sample product data
const products = [
  {
    id: 1,
    name: "Classic White Tee",
    price: 29.99,
    category: "Apparel",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Black Denim Jacket",
    price: 89.99,
    category: "Apparel",
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Minimalist Watch",
    price: 149.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Geometric Art Print",
    price: 49.99,
    category: "Art Prints",
    image:
      "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Ceramic Vase",
    price: 39.99,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    name: "Monochrome Scarf",
    price: 24.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
];

// Cart functionality
let cart = [];
let isLoggedIn = false;
let currentUser = null;
let currentCategory = "all";

// WhatsApp configuration
const whatsappNumber = "27637173666"; // South African format with country code
const whatsappMessage =
  "Hello! I'm interested in your products. Can you help me?";

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCount = document.querySelector(".cart-count");
const userModal = document.getElementById("user-modal");
const userIcon = document.getElementById("user-icon");
const loginLink = document.getElementById("login-link");
const closeUserModal = document.querySelector(".close-user-modal");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const userStatus = document.getElementById("user-status");
const userActions = document.getElementById("user-actions");
const userName = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");
const openMapBtn = document.getElementById("open-map");
const whatsappLink = document.getElementById("whatsapp-link");
const whatsappFloatLink = document.getElementById("whatsapp-float-link");
const categoryFilter = document.getElementById("category-filter");
const applyFiltersBtn = document.getElementById("apply-filters");
const resetFiltersBtn = document.getElementById("reset-filters");
const priceFilter = document.getElementById("price-filter");

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupEventListeners();
  setupWhatsAppLinks();
  setupCategoryCards();
});

// Load products into the grid with optional filtering
function loadProducts(category = "all", priceRange = "all") {
  productsGrid.innerHTML = "";

  let filteredProducts = products;

  // Filter by category
  if (category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  // Filter by price range
  if (priceRange !== "all") {
    filteredProducts = filteredProducts.filter((product) => {
      switch (priceRange) {
        case "0-25":
          return product.price <= 25;
        case "25-50":
          return product.price > 25 && product.price <= 50;
        case "50-100":
          return product.price > 50 && product.price <= 100;
        case "100+":
          return product.price > 100;
        default:
          return true;
      }
    });
  }

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML =
      '<p class="empty-products">No products found in this category</p>';
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });

  // Reattach event listeners to the new Add to Cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.getAttribute("data-id"));
      addToCart(productId);
    });
  });
}

// Set up WhatsApp links
function setupWhatsAppLinks() {
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Set href for both WhatsApp links
  if (whatsappLink) {
    whatsappLink.href = whatsappURL;
    whatsappLink.target = "_blank";
  }

  if (whatsappFloatLink) {
    whatsappFloatLink.href = whatsappURL;
    whatsappFloatLink.target = "_blank";
  }
}

// Set up category cards to filter products
function setupCategoryCards() {
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.getAttribute("data-category");
      currentCategory = category;
      categoryFilter.value = category;
      loadProducts(category);

      // Scroll to products section
      document
        .getElementById("products")
        .scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Set up event listeners
function setupEventListeners() {
  // Cart functionality
  document.querySelector(".cart-icon").addEventListener("click", () => {
    cartModal.style.display = "block";
    updateCartDisplay();
  });

  document.querySelector(".close-cart").addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  // User modal functionality
  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    userModal.style.display = "flex";
  });

  closeUserModal.addEventListener("click", () => {
    userModal.style.display = "none";
  });

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  });

  document
    .getElementById("login-form-element")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      handleLogin();
    });

  document
    .getElementById("register-form-element")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      handleRegister();
    });

  // Logout functionality
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleLogout();
  });

  // Open Google Maps functionality
  openMapBtn.addEventListener("click", () => {
    window.open(
      "https://maps.google.com/?q=138+Berg+Ave,+Heatherdale+AH,+Akasia,+0182",
      "_blank"
    );
  });

  // Filter functionality
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      const category = categoryFilter.value;
      const priceRange = priceFilter.value;
      currentCategory = category;
      loadProducts(category, priceRange);
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      categoryFilter.value = "all";
      priceFilter.value = "all";
      currentCategory = "all";
      loadProducts();
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === userModal) {
      userModal.style.display = "none";
    }
    if (e.target === cartModal) {
      cartModal.style.display = "none";
    }
  });
}

// Add to cart function
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  showNotification(`${product.name} added to cart`);
}

// Update cart count display
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Update cart display in modal
function updateCartDisplay() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    cartTotalPrice.textContent = "$0.00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  cartTotalPrice.textContent = `$${total.toFixed(2)}`;

  // Add event listeners to quantity buttons
  document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      increaseQuantity(id);
    });
  });

  document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      decreaseQuantity(id);
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      removeFromCart(id);
    });
  });
}

// Increase item quantity
function increaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += 1;
    updateCartDisplay();
    updateCartCount();
  }
}

// Decrease item quantity
function decreaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    updateCartDisplay();
    updateCartCount();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartDisplay();
  updateCartCount();
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #f5f5f5;
    color: #0a0a0a;
    padding: 10px 20px;
    border-radius: 2px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Handle login
function handleLogin() {
  const email = document.querySelector(
    '#login-form-element input[type="email"]'
  ).value;
  const password = document.querySelector(
    '#login-form-element input[type="password"]'
  ).value;

  // Simple validation (in a real app, you'd verify against a database)
  if (email && password) {
    isLoggedIn = true;
    currentUser = { email, name: email.split("@")[0] };
    userStatus.style.display = "none";
    userActions.style.display = "block";
    userName.textContent = currentUser.name;
    userModal.style.display = "none";
    showNotification("Login successful!");
  }
}

// Handle register
function handleRegister() {
  const name = document.querySelector(
    '#register-form-element input[type="text"]'
  ).value;
  const email = document.querySelector(
    '#register-form-element input[type="email"]'
  ).value;
  const password = document.querySelector(
    '#register-form-element input[type="password"]'
  ).value;
  const confirmPassword = document.querySelectorAll(
    '#register-form-element input[type="password"]'
  )[1].value;

  // Simple validation
  if (password !== confirmPassword) {
    showNotification("Passwords do not match!");
    return;
  }

  if (name && email && password) {
    isLoggedIn = true;
    currentUser = { email, name };
    userStatus.style.display = "none";
    userActions.style.display = "block";
    userName.textContent = currentUser.name;
    userModal.style.display = "none";
    showNotification("Registration successful!");
  }
}

// Handle logout
function handleLogout() {
  isLoggedIn = false;
  currentUser = null;
  userStatus.style.display = "block";
  userActions.style.display = "none";
  showNotification("Logged out successfully!");
}
