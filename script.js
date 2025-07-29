// Enhanced Cart functionality
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

// Chat bot responses
const chatResponses = {
    'hello': 'Hello! How can we help you today? 🍰',
    'hi': 'Hi there! Welcome to Flavish Bakery!',
    'menu': 'You can browse our menu in the "Menu" section. We have cakes, pastries, bread, and gluten-free options!',
    'prices': 'Our prices range from $3.99 for muffins to $39.99 for large custom cakes. Check out our menu for details!',
    'delivery': 'We offer delivery within 10 miles. Delivery fee is $5.99 and takes 30-60 minutes.',
    'custom cake': 'You can build your own custom cake in the "Custom Cake" section. Choose flavor, size, frosting, and toppings!',
    'hours': 'We\'re open Mon-Sat: 7AM - 8PM, Sunday: 8AM - 6PM',
    'location': 'We\'re located at 123 Baker Street, Sweet City, SC 12345. Check our contact section for the map!',
    'default': 'Thanks for your message! Our team will get back to you soon. In the meantime, feel free to browse our menu!'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeCart();
    initializeTheme();
    initializeCountdown();
    initializeAnimations();
    initializeChat();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize cake price
    updateCakePrice();
    
    // Track page view with Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Flavish Bakery Homepage',
            page_location: window.location.href
        });
    }
});

// Initialize cart functionality
function initializeCart() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('bakeryCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
    
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
}

// Initialize theme functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('bakeryTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Initialize countdown timer
function initializeCountdown() {
    // Set countdown to end of day
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    function updateTimer() {
        const timeLeft = endOfDay - new Date();
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('timer').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections for fade-in animation
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Initialize chat functionality
function initializeChat() {
    // Chat is initialized in the HTML
}

// Add event listeners
function addEventListeners() {
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

    // Checkout modal functionality
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutCloseBtn = checkoutModal.querySelector('.close');

    checkoutCloseBtn.addEventListener('click', function() {
        closeCheckout();
    });

    window.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            closeCheckout();
        }
    });

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
}

// Add item to cart
function addToCart(name, price) {
    cart.push({ name, price });
    cartTotal += price;
    updateCartDisplay();
    saveCartToStorage();
    
    // Show success message
    showNotification(`${name} added to cart!`);
    
    // Track add to cart event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: price,
            items: [{
                item_name: name,
                price: price,
                quantity: 1
            }]
        });
    }
}

// Add custom cake to cart
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
    saveCartToStorage();
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

// Update cake price based on selections
function updateCakePrice() {
    const size = document.getElementById('cake-size').value;
    const frosting = document.getElementById('cake-frosting').value;
    const toppings = document.getElementById('cake-toppings').value;
    const flavor = document.getElementById('cake-flavor').value;
    
    const basePrice = cakePrices.size[size];
    const frostingPrice = cakePrices.frosting[frosting];
    const toppingsPrice = cakePrices.toppings[toppings];
    const totalPrice = basePrice + frostingPrice + toppingsPrice;
    
    document.getElementById('cake-price').textContent = `$${totalPrice.toFixed(2)}`;
    
    // Update cake description
    const description = `${flavor.charAt(0).toUpperCase() + flavor.slice(1)} cake, ${size}, ${frosting.replace('-', ' ')} frosting`;
    document.getElementById('cake-description').textContent = description;
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

// Show checkout form
function showCheckoutForm() {
    closeCart();
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Populate checkout items
    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.marginBottom = '0.5rem';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemDiv);
    });
    
    checkoutTotal.textContent = `$${cartTotal.toFixed(2)}`;
    checkoutModal.style.display = 'block';
}

// Close checkout modal
function closeCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.style.display = 'none';
}

// Process checkout
function processCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerData = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        address: document.getElementById('customer-address').value,
        paymentMethod: document.getElementById('payment-method').value,
        items: cart,
        total: cartTotal
    };
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Track purchase event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: 'ORDER_' + Date.now(),
                value: cartTotal,
                currency: 'USD',
                items: cart.map(item => ({
                    item_name: item.name,
                    price: item.price,
                    quantity: 1
                }))
            });
        }
        
        // Show success message
        showNotification('Order placed successfully! Thank you for your purchase! 🎉');
        
        // Clear cart
        cart = [];
        cartTotal = 0;
        updateCartDisplay();
        saveCartToStorage();
        
        // Close checkout modal
        closeCheckout();
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
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
        background-color: var(--accent-orange);
        color: var(--white);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 3000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
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

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bakeryTheme', newTheme);
    updateThemeIcon(newTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Product filtering functionality
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Product sorting functionality
function sortProducts() {
    const sortBy = document.getElementById('sort-by').value;
    const productsGrid = document.getElementById('products-grid');
    const products = Array.from(productsGrid.children);
    
    products.sort((a, b) => {
        switch(sortBy) {
            case 'price-low':
                return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
            case 'price-high':
                return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
            case 'popularity':
                return parseInt(b.getAttribute('data-popularity')) - parseInt(a.getAttribute('data-popularity'));
            case 'name':
            default:
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
        }
    });
    
    // Reorder products in the grid
    products.forEach(product => productsGrid.appendChild(product));
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate subscription process
    setTimeout(() => {
        showNotification('Thank you for subscribing to our newsletter! 📧');
        event.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Track newsletter subscription
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                method: 'newsletter'
            });
        }
    }, 1000);
}

// Chat functionality
function toggleChat() {
    const chatBox = document.getElementById('chat-box');
    const isVisible = chatBox.style.display === 'flex';
    chatBox.style.display = isVisible ? 'none' : 'flex';
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addChatMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message.toLowerCase());
            addChatMessage(response, 'bot');
        }, 1000);
    }
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(message) {
    for (const [key, response] of Object.entries(chatResponses)) {
        if (message.includes(key)) {
            return response;
        }
    }
    return chatResponses.default;
}

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

// Track user interactions for analytics
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// Track page views for different sections
function trackSectionView(sectionName) {
    trackEvent('section_view', {
        section_name: sectionName
    });
}

// Initialize section tracking
document.addEventListener('DOMContentLoaded', function() {
    const sections = ['menu', 'custom-cake', 'testimonials', 'contact'];
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.id;
                if (sections.includes(sectionName)) {
                    trackSectionView(sectionName);
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            sectionObserver.observe(section);
        }
    });
}); 