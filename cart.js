let cart = [];

// Load cart data from localStorage when the page loads
window.addEventListener("load", () => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  // If on the cart page, display the cart
  if (document.getElementById("cart-items")) {
    displayCart();
  }

  // Update the cart count in the navbar when the page loads
  updateCartCount();
});

// Add product to cart and save to localStorage
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (event) => {
    const product = event.target.closest(".box, .offer-item, .card"); // Get product details
    const id = product.getAttribute("data-id");
    const name = product.getAttribute("data-name");
    const price = parseFloat(product.getAttribute("data-price"));
    const image = product.getAttribute("data-image");

    addToCart({ id, name, price, quantity: 1 });
    saveCart(); // Save to localStorage
    updateCartCount(); // Update the cart count in the navbar

    // Show alert when item is added to cart
    alert(`${name} has been added to your cart!`);
  });
});

function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
    existingProduct.total = existingProduct.quantity * existingProduct.price;
  } else {
    product.total = product.price * product.quantity;
    cart.push(product);
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to display the cart on the cart page
function displayCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = ""; // Clear previous items

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
                ${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.total}
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            `;
      cartItems.appendChild(li);
    });
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.total, 0);
  document.getElementById("total-price").textContent = `Total: ₹${totalPrice}`;

  // Add event listeners for quantity buttons
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      const action = event.target.getAttribute("data-action");
      updateQuantity(id, action);
      saveCart();
      updateCartCount(); // Update the cart count after modifying quantities
    });
  });
}

function updateQuantity(id, action) {
  const productIndex = cart.findIndex((item) => item.id === id);
  if (productIndex !== -1) {
    const product = cart[productIndex];
    if (action === "increase") {
      product.quantity += 1;
    } else if (action === "decrease") {
      product.quantity -= 1;
      if (product.quantity <= 0) {
        cart.splice(productIndex, 1); // Remove item if quantity reaches 0
      }
    }
    if (product.quantity > 0) {
      product.total = product.price * product.quantity;
    }
    displayCart();
  }
}

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = savedCart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

document.getElementById("paytm-button").addEventListener("click", function () {
  alert(
    "You selected Paytm as your payment method. This is a simulated payment process."
  );
});
document.getElementById("place-order-button").addEventListener("click", function () {
  if (cart.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
  } else {
      saveCart();
      window.location.href = "checkout.html";
  }
});
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}