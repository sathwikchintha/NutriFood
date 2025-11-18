// script.js
// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
    });
});

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Update cart summary when showing payment page
    if (pageId === 'payment') {
        updateOrderSummary();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Items Page Data
const meals = [
    {
        id: 1,
        name: "Mediterranean Bowl",
        description: "Quinoa, grilled vegetables, feta cheese, and lemon herb dressing",
        price: 12.99,
        category: "lunch",
        image: "images/mediterranean-bowl.png"
    },
    {
        id: 2,
        name: "Protein Power Breakfast",
        description: "Scrambled eggs, avocado, whole grain toast, and fresh berries",
        price: 10.99,
        category: "breakfast",
        image: "images/protein-breakfast.png"
    },
    {
        id: 3,
        name: "Asian Glazed Salmon",
        description: "Wild-caught salmon with ginger glaze, brown rice, and steamed broccoli",
        price: 16.99,
        category: "dinner",
        image: "images/asian-salmon.png"
    },
    {
        id: 4,
        name: "Vegan Buddha Bowl",
        description: "Mixed grains, roasted sweet potatoes, chickpeas, and tahini dressing",
        price: 11.99,
        category: "vegan",
        image: "images/vegan-bowl.png"
    },
    {
        id: 5,
        name: "Turkey Avocado Wrap",
        description: "Sliced turkey, fresh avocado, spinach, and whole wheat tortilla",
        price: 9.99,
        category: "lunch",
        image: "images/turkey-wrap.png"
    },
    {
        id: 6,
        name: "Acai Superfood Bowl",
        description: "Acai blend topped with granola, banana, and honey",
        price: 8.99,
        category: "breakfast",
        image: "images/acai-bowl.png"
    },
    {
        id: 7,
        name: "Grilled Chicken Salad",
        description: "Mixed greens, grilled chicken, cherry tomatoes, and balsamic vinaigrette",
        price: 13.99,
        category: "lunch",
        image: "images/chicken-salad.png"
    },
    {
        id: 8,
        name: "Vegetable Stir Fry",
        description: "Seasonal vegetables with tofu in a light soy-ginger sauce",
        price: 11.99,
        category: "vegan",
        image: "images/vegetable-stirfry.png"
    }
];

const reviews = [
    {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        text: "The Mediterranean Bowl was absolutely delicious! I love that I can see exactly how it was prepared through the QR code.",
        avatar: "images/avatar1.png"
    },
    {
        id: 2,
        name: "Michael Chen",
        rating: 4,
        text: "Convenient, healthy, and tasty. The delivery was prompt and the food arrived fresh. Will definitely order again!",
        avatar: "images/avatar2.png"
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        rating: 5,
        text: "As a vegan, it's hard to find good options when I'm busy. NutriFood has been a game-changer for my lunch breaks!",
        avatar: "images/avatar3.png"
    },
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('nutrifoodCart')) || [];

// Initialize pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize items page
    displayMeals();
    displayReviews();
    
    // Initialize payment page
    updateOrderSummary();
    updateCartCount();
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter meals
            const filter = this.getAttribute('data-filter');
            displayMeals(filter);
        });
    });
    
    // Form submission
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Your cart is empty. Please add some items before placing an order.');
            return;
        }
        
        // In a real application, you would process the payment here
        alert('Thank you for your order! Your healthy meals are on their way.');
        
        // Clear cart and reset form
        cart = [];
        saveCartToStorage();
        updateOrderSummary();
        updateCartCount();
        this.reset();
        
        // Redirect to home page
        showPage('home');
    });
});

// Display meals on items page
function displayMeals(filter = 'all') {
    const mealsGrid = document.querySelector('.meals-grid');
    mealsGrid.innerHTML = '';
    
    const filteredMeals = filter === 'all' ? meals : meals.filter(meal => meal.category === filter);
    
    if (filteredMeals.length === 0) {
        mealsGrid.innerHTML = '<p class="no-meals">No meals found in this category. Please try another filter.</p>';
        return;
    }
    
    filteredMeals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        mealCard.innerHTML = `
            <div class="meal-image">
                <img src="${meal.image}" alt="${meal.name}">
            </div>
            <div class="meal-info">
                <h3>${meal.name}</h3>
                <p>${meal.description}</p>
                <div class="meal-price">
                    <span class="price">$${meal.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${meal.id})">Add to Cart</button>
                </div>
            </div>
        `;
        mealsGrid.appendChild(mealCard);
    });
}

// Display reviews on items page
function displayReviews() {
    const reviewsContainer = document.querySelector('.reviews-container');
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">
                    <img src="${review.avatar}" alt="${review.name}">
                </div>
                <div class="review-info">
                    <h4>${review.name}</h4>
                    <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                </div>
            </div>
            <p>${review.text}</p>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}

// Cart functionality
function addToCart(mealId) {
    const meal = meals.find(m => m.id === mealId);
    const existingItem = cart.find(item => item.id === mealId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: meal.id,
            name: meal.name,
            price: meal.price,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    
    // Show notification
    showNotification(`${meal.name} added to cart!`);
}

function removeFromCart(mealId) {
    cart = cart.filter(item => item.id !== mealId);
    saveCartToStorage();
    updateOrderSummary();
    updateCartCount();
}

function updateQuantity(mealId, change) {
    const item = cart.find(item => item.id === mealId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(mealId);
        } else {
            saveCartToStorage();
            updateOrderSummary();
            updateCartCount();
        }
    }
}

function updateOrderSummary() {
    const orderItems = document.querySelector('.order-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');
    
    orderItems.innerHTML = '';
    
    let subtotal = 0;
    
    if (cart.length === 0) {
        orderItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add some delicious meals!</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <div class="item-price">$${itemTotal.toFixed(2)}</div>
            `;
            orderItems.appendChild(orderItem);
        });
    }
    
    const deliveryFee = cart.length > 0 ? 2.99 : 0;
    const total = subtotal + deliveryFee;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    deliveryElement.textContent = `$${deliveryFee.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCartToStorage() {
    localStorage.setItem('nutrifoodCart', JSON.stringify(cart));
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add some CSS for the notification
const style = document.createElement('style');
style.textContent = `
    .empty-cart, .no-meals {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-style: italic;
    }
`;
document.head.appendChild(style);