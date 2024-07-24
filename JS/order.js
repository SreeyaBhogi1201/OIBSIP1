const menuItems = {
    "wallet-cards": [
        { name: "Wallet Card 1", price: 15, image: "/Img/package3.jpg" },
        { name: "Wallet Card 2", price: 18, image: "/Img/package2.jpg" },
        { name: "Wallet Card 3", price: 22, image: "/Img/package1.jpg" },
        { name: "Wallet Card 4", price: 25, image: "/Img/package4.jpg" }
    ],
    "polaroid-arts": [
        { name: "Polaroid Art 1", price: 50, image: "/Img/wallet card.jpg" },
        { name: "Polaroid Art 2", price: 60, image: "/Img/pencilsketch.jpg" },
        { name: "Polaroid Art 3", price: 70, image: "/Img/firstorder.jpg" },
        { name: "Polaroid Art 4", price: 80, image: "/Img/smallpainting.jpg" }
    ],
    "art-illustrations": [
        { name: "Art Illustration 1", price: 35, image: "/Img/firstorder.jpg" },
        { name: "Art Illustration 2", price: 40, image: "/Img/smallpainting.jpg" },
        { name: "Art Illustration 3", price: 55, image: "/Img/package2.jpg" },
        { name: "Art Illustration 4", price: 65, image: "/Img/package1.jpg" }
    ],
    "greeting-cards": [
        { name: "Greeting Card 1", price: 10, image: "/Img/package1.jpg" },
        { name: "Greeting Card 2", price: 12, image: "/Img/package3.jpg" },
        { name: "Greeting Card 3", price: 15, image: "/Img/package4.jpg" },
        { name: "Greeting Card 4", price: 18, image: "/Img/package2.jpg" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    loadMenuItems();
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
    updateButtonState();
});

function loadMenuItems() {
    for (const [category, items] of Object.entries(menuItems)) {
        const container = document.getElementById(`${category}-menu-items`);
        items.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="menu-item-price">₹${item.price.toFixed(2)}</p>
                <button data-item-key="${itemKey}" onclick="addToCart('${category}', '${item.name}', this)">Add to Cart</button>`;
            container.appendChild(menuItem);
        });
    }
}

function setupEventListeners() {
    const bagIcon = document.querySelector(".bag-icon");
    const cartModal = document.getElementById("cart-modal");
    const closeModal = document.querySelector(".close");

    bagIcon.addEventListener("click", () => {
        cartModal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = "none";
        }
    });
}

let cart = {};

function addToCart(category, itemName, buttonElement) {
    const item = menuItems[category].find(item => item.name === itemName);
    if (!item) return;

    const itemKey = `${category}-${itemName}`;
    if (cart[itemKey]) {
        cart[itemKey].quantity += 1;
    } else {
        cart[itemKey] = { ...item, quantity: 1 };
    }

    updateCartDisplay();
    saveCartToStorage();
    updateButtonState();

    if (buttonElement) {
        buttonElement.textContent = "Added";
        buttonElement.classList.add("added");
    }
    openCartModal();
}

function updateButtonState() {
    for (const [category, items] of Object.entries(menuItems)) {
        items.forEach(item => {
            const itemKey = `${category}-${item.name}`;
            const button = document.querySelector(`[data-item-key="${itemKey}"]`);
            if (cart[itemKey] && button) {
                button.textContent = "Added";
                button.classList.add("added");
            }
        });
    }
}


function removeFromCart(itemKey) {
    if (cart[itemKey]) {
        cart[itemKey].quantity -= 1;
        if (cart[itemKey].quantity <= 0) {
            delete cart[itemKey];
        }
    }

    updateCartDisplay();
    saveCartToStorage();
    updateButtonState();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const bagCount = document.querySelector(".bag-count");

    cartItemsContainer.innerHTML = "";

    let totalPrice = 0;
    let totalCount = 0;

    for (const [itemKey, item] of Object.entries(cart)) {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <p>${item.name}</p>
                <p>₹${item.price.toFixed(2)}</p>
                <div>
                    <button onclick="removeFromCart('${itemKey}')">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="addToCart('${itemKey.split('-')[0]}', '${item.name}')">+</button>
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    }

    totalPriceElement.textContent = `Total: ₹${totalPrice.toFixed(2)}`;
    bagCount.textContent = totalCount;
}

function saveCartToStorage() {
    sessionStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const allMenuItems = document.querySelectorAll(".menu-item");

    allMenuItems.forEach(item => {
        const itemName = item.querySelector("h3").textContent.toLowerCase();
        if (itemName.includes(query)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}
function loadMenuItems() {
    for (const [category, items] of Object.entries(menuItems)) {
        const container = document.getElementById(`${category}-menu-items`);
        items.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");
            const itemKey = `${category}-${item.name}`;
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="menu-item-price">₹${item.price.toFixed(2)}</p>
                <button data-item-key="${itemKey}" onclick="addToCart('${category}', '${item.name}', this)">Add to Cart</button>
            `;
            container.appendChild(menuItem);
        });
    }
}

function openCartModal() {
    const cartModal = document.getElementById("cart-modal");
    cartModal.style.display = "block";
}