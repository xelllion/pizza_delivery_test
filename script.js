const pizzas = {
    pepperoni: {
        id: "pepperoni",
        name: "Pepperoni",
        price: 3490,
        image: "images/pepperoni.svg"
    },
    margherita: {
        id: "margherita",
        name: "Margherita",
        price: 2990,
        image: "images/margherita.svg"
    },
    bbq: {
        id: "bbq",
        name: "BBQ Chicken",
        price: 3790,
        image: "images/bbq.svg"
    },
    veggie: {
        id: "veggie",
        name: "Garden Veggie",
        price: 3290,
        image: "images/veggie.svg"
    },
    cheese: {
        id: "cheese",
        name: "Four Cheese",
        price: 3590,
        image: "images/cheese.svg"
    },
    spicy: {
        id: "spicy",
        name: "Spicy Salami",
        price: 3690,
        image: "images/spicy.svg"
    }
};

function getCart() {
    return JSON.parse(localStorage.getItem("pizzagoCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("pizzagoCart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(id) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else if (pizzas[id]) {
        cart.push({ ...pizzas[id], quantity: 1 });
    }

    saveCart(cart);
    showToast(`${pizzas[id].name} added to cart`);
}

function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? "inline-flex" : "none";
    });
}

function formatPrice(value) {
    return `${value.toLocaleString("ru-RU")} ₸`;
}

function showToast(message) {
    const toastBody = document.querySelector("#cartToast .toast-body");
    const toastElement = document.getElementById("cartToast");

    if (toastBody && toastElement && typeof bootstrap !== "undefined") {
        toastBody.textContent = message;
        bootstrap.Toast.getOrCreateInstance(toastElement).show();
    }
}

function setupAddButtons() {
    document.querySelectorAll("[data-add-pizza]").forEach(button => {
        button.addEventListener("click", () => addToCart(button.dataset.addPizza));
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll("[data-filter]");
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;
            document.querySelectorAll(".menu-card").forEach(card => {
                const categories = card.dataset.category.split(" ");
                card.parentElement.classList.toggle(
                    "hidden-card",
                    filter !== "all" && !categories.includes(filter)
                );
            });
        });
    });
}

function renderCart() {
    const tbody = document.getElementById("cartBody");
    const empty = document.getElementById("emptyCart");
    const table = document.getElementById("cartTable");
    if (!tbody || !empty || !table) return;

    const cart = getCart();
    tbody.innerHTML = "";

    if (!cart.length) {
        table.classList.add("d-none");
        empty.classList.remove("d-none");
    } else {
        table.classList.remove("d-none");
        empty.classList.add("d-none");

        cart.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <strong>${item.name}</strong><br>
                            <small class="text-muted">30 cm</small>
                        </div>
                    </div>
                </td>
                <td>${formatPrice(item.price)}</td>
                <td>
                    <div class="qty-control">
                        <button class="qty-btn" type="button" data-qty="minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                        <strong>${item.quantity}</strong>
                        <button class="qty-btn" type="button" data-qty="plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    </div>
                </td>
                <td><strong>${formatPrice(item.price * item.quantity)}</strong></td>
                <td><button type="button" class="btn btn-sm btn-outline-secondary" data-remove="${item.id}">Remove</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    tbody.querySelectorAll("[data-qty]").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button.dataset.id, button.dataset.qty));
    });

    tbody.querySelectorAll("[data-remove]").forEach(button => {
        button.addEventListener("click", () => removeFromCart(button.dataset.remove));
    });

    updateSummary();
}

function changeQuantity(id, action) {
    const cart = getCart();
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += action === "plus" ? 1 : -1;
    const updated = cart.filter(product => product.quantity > 0);
    saveCart(updated);
    renderCart();
}

function removeFromCart(id) {
    saveCart(getCart().filter(item => item.id !== id));
    renderCart();
}

function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal > 0 ? 690 : 0;
    const total = subtotal + delivery;

    const subtotalEl = document.getElementById("subtotal");
    const deliveryEl = document.getElementById("deliveryFee");
    const totalEl = document.getElementById("orderTotal");

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (deliveryEl) deliveryEl.textContent = formatPrice(delivery);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

function setupCheckout() {
    const form = document.getElementById("checkoutForm");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const cart = getCart();
        if (!cart.length) {
            showToast("Your cart is empty. Add a pizza first.");
            return;
        }

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = {
            id: `PG${Math.floor(1000 + Math.random() * 9000)}`,
            createdAt: Date.now(),
            total: subtotal + 690,
            name: document.getElementById("customerName").value.trim(),
            address: document.getElementById("address").value.trim(),
            items: cart
        };

        localStorage.setItem("pizzagoLastOrder", JSON.stringify(order));
        localStorage.removeItem("pizzagoCart");
        window.location.href = `tracking.html?order=${order.id}`;
    });
}

function getOrderStatus(createdAt) {
    const elapsedMinutes = (Date.now() - createdAt) / 60000;
    if (elapsedMinutes < 1) return 0;
    if (elapsedMinutes < 8) return 1;
    if (elapsedMinutes < 22) return 2;
    return 3;
}

function renderOrder(order) {
    const result = document.getElementById("trackingResult");
    const notFound = document.getElementById("orderNotFound");
    if (!result || !notFound) return;

    notFound.classList.add("d-none");
    result.classList.remove("d-none");

    document.getElementById("trackOrderId").textContent = order.id;
    document.getElementById("trackAddress").textContent = order.address || "Astana";
    document.getElementById("trackTotal").textContent = formatPrice(order.total || 0);

    const status = getOrderStatus(order.createdAt || Date.now());
    const statusNames = ["Order placed", "Preparing", "On the way", "Delivered"];
    document.getElementById("trackStatus").textContent = statusNames[status];
    document.getElementById("etaText").textContent = status === 3 ? "Delivered" : `${Math.max(5, 25 - status * 7)}–${Math.max(10, 35 - status * 7)} min`;

    document.querySelectorAll(".timeline-step").forEach((step, index) => {
        step.classList.remove("done", "current");
        if (index < status) step.classList.add("done");
        if (index === status) step.classList.add("current");
    });
}

function setupTracking() {
    const form = document.getElementById("trackingForm");
    if (!form) return;

    const savedOrder = JSON.parse(localStorage.getItem("pizzagoLastOrder")) || null;
    const params = new URLSearchParams(window.location.search);
    const queryOrder = params.get("order");

    if (savedOrder && (!queryOrder || queryOrder.toUpperCase() === savedOrder.id.toUpperCase())) {
        document.getElementById("orderIdInput").value = savedOrder.id;
        renderOrder(savedOrder);
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        const enteredId = document.getElementById("orderIdInput").value.trim().toUpperCase();
        const current = JSON.parse(localStorage.getItem("pizzagoLastOrder")) || null;

        if (current && enteredId === current.id.toUpperCase()) {
            renderOrder(current);
            return;
        }

        if (enteredId === "PG1024") {
            renderOrder({
                id: "PG1024",
                createdAt: Date.now() - 10 * 60000,
                total: 7170,
                address: "Astana, Example Street 10"
            });
            return;
        }

        document.getElementById("trackingResult").classList.add("d-none");
        document.getElementById("orderNotFound").classList.remove("d-none");
    });
}

function setupContact() {
    const form = document.getElementById("contactForm");
    const alertBox = document.getElementById("contactSuccess");
    if (!form || !alertBox) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        alertBox.classList.remove("d-none");
        form.reset();
        form.classList.remove("was-validated");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    setupAddButtons();
    setupFilters();
    renderCart();
    setupCheckout();
    setupTracking();
    setupContact();
});
