// Cart functionality
let cart = [];
let cartTotal = 0;

// Cake pricing configuration
const cakePrices = {
    size: {
        '6-inch': 15.99,
        '8-inch': 22.99,
        '10-inch': 29.99,
        '12-inch': 39.99
    },
    frosting: {
        'vanilla-buttercream': 0,
        'chocolate-buttercream': 0,
        'cream-cheese': 0,
        'whipped-cream': 2.00
    },
    toppings: {
        'none': 0,
        'sprinkles': 1.50,
        'fresh-fruits': 3.00,
        'chocolate-chips': 2.00,
        'nuts': 2.50
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        if (!button.hasAttribute('onclick')) {
            button.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                addToCart(name, price);
            });
        }
    });

    // Cart modal functionality
    const cartLink = document.querySelector('a[href="#cart"]');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');

    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });

    closeBtn.addEventListener('click', function() {
        closeCart();
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCart();
        }
    });

    // Initialize cake price
    updateCakePrice();
});

// Add item to cart
function addToCart(name, price) {
    cart.push({ name, price });
    cartTotal += price;
    updateCartDisplay();
    
    // Show success message
    showNotification(`${name} added to cart!`);
}

// Add custom cake to cart
function addCustomCakeToCart() {
    const flavor = document.getElementById('cake-flavor').value;
    const size = document.getElementById('cake-size').value;
    const frosting = document.getElementById('cake-frosting').value;
    const toppings = document.getElementById('cake-toppings').value;
    
    const basePrice = cakePrices.size[size];
    const frostingPrice = cakePrices.frosting[frosting];
    const toppingsPrice = cakePrices.toppings[toppings];
    const totalPrice = basePrice + frostingPrice + toppingsPrice;
    
    const cakeName = `Custom ${flavor.charAt(0).toUpperCase() + flavor.slice(1)} Cake (${size})`;
    
    addToCart(cakeName, totalPrice);
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Update cart count
    cartCount.textContent = cart.length;
    
    // Update cart items
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})" style="background: #ff4444; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;">×</button>
        `;
        cartItems.appendChild(itemDiv);
    });
    
    // Update total
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(index) {
    cartTotal -= cart[index].price;
    cart.splice(index, 1);
    updateCartDisplay();
}

// Update cake price based on selections
function updateCakePrice() {
    const size = document.getElementById('cake-size').value;
    const frosting = document.getElementById('cake-frosting').value;
    const toppings = document.getElementById('cake-toppings').value;
    
    const basePrice = cakePrices.size[size];
    const frostingPrice = cakePrices.frosting[frosting];
    const toppingsPrice = cakePrices.toppings[toppings];
    const totalPrice = basePrice + frostingPrice + toppingsPrice;
    
    document.getElementById('cake-price').textContent = `$${totalPrice.toFixed(2)}`;
}

// Open cart modal
function openCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';
}

// Close cart modal
function closeCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
}

// Scroll to menu section
function scrollToMenu() {
    const menuSection = document.getElementById('menu');
    menuSection.scrollIntoView({ behavior: 'smooth' });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #D2691E;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effects for product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Form validation for cake builder
function validateCakeForm() {
    const size = document.getElementById('cake-size').value;
    const frosting = document.getElementById('cake-frosting').value;
    const toppings = document.getElementById('cake-toppings').value;
    
    if (!size || !frosting || !toppings) {
        showNotification('Please select all cake options!');
        return false;
    }
    
    return true;
}

// Enhanced addCustomCakeToCart with validation
function addCustomCakeToCart() {
    if (!validateCakeForm()) {
        return;
    }
    
    const flavor = document.getElementById('cake-flavor').value;
    const size = document.getElementById('cake-size').value;
    const frosting = document.getElementById('cake-frosting').value;
    const toppings = document.getElementById('cake-toppings').value;
    
    const basePrice = cakePrices.size[size];
    const frostingPrice = cakePrices.frosting[frosting];
    const toppingsPrice = cakePrices.toppings[toppings];
    const totalPrice = basePrice + frostingPrice + toppingsPrice;
    
    const cakeName = `Custom ${flavor.charAt(0).toUpperCase() + flavor.slice(1)} Cake (${size})`;
    
    addToCart(cakeName, totalPrice);
} 