
"use strict";

// ==========================================
// LUXE D'AMOUR - WEBSITE JAVASCRIPT
// ==========================================

const STORAGE_KEY = "luxeDamourCart";

function getCartItemKey(id, size) {
  return id + "::" + (size || "");
}

const products = {
  tee: { id: "tee", name: "Luxe Star Tee", price: 199000 },
  layer: { id: "layer", name: "Signature Hoodie", price: 329000 },
  jacket: { id: "jacket", name: "Statement Jacket", price: 699000 },
  cap: { id: "cap", name: "Classic Cap", price: 129000 },
  oversized: { id: "oversized", name: "Essential Oversized Tee", price: 229000 },
  graphic: { id: "graphic", name: "Midnight Graphic Tee", price: 249000 },
  cargo: { id: "cargo", name: "Utility Cargo Pants", price: 379000 },
  denim: { id: "denim", name: "Urban Baggy Denim", price: 429000 },
  varsity: { id: "varsity", name: "Classic Varsity Jacket", price: 599000 },
  ziphoodie: { id: "ziphoodie", name: "Essential Zip Hoodie", price: 399000 },
  crossbody: { id: "crossbody", name: "Utility Crossbody Bag", price: 279000 },
  beanie: { id: "beanie", name: "Essential Knit Beanie", price: 149000 }
};

// Ambil elemen HTML
const openCartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const productFilter = document.getElementById("product-filter");
const toast = document.getElementById("toast");

let cart = [];
let toastTimer = null;

// Format harga Rupiah
function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// Memuat keranjang dari localStorage
function loadCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(savedCart)) return [];

    const restoredCart = [];

    savedCart.forEach(function (item) {
      if (
        !item ||
        typeof item.id !== "string" ||
        !products[item.id] ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return;
      }

      const product = products[item.id];
      const size = typeof item.size === "string" ? item.size : "";

      const existing = restoredCart.find(function (entry) {
        return getCartItemKey(entry.id, entry.size) ===
          getCartItemKey(product.id, size);
      });

      if (existing) {
        existing.quantity = Math.min(
          99,
          existing.quantity + item.quantity
        );
      } else {
        restoredCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          size: size
        });
      }
    });

    return restoredCart;
  } catch (error) {
    console.error("Gagal memuat keranjang:", error);
    return [];
  }
}
// Menyimpan keranjang
function saveCart() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        cart.map(function (item) {
          return {
            id: item.id,
            quantity: item.quantity,
            size: item.size || ""
          };
        })
      )
    );
  } catch (error) {
    console.error("Gagal menyimpan keranjang:", error);
    showToast("Keranjang gagal disimpan.");
  }
}

// Menampilkan notifikasi
function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer !== null) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

// Membuka keranjang
function openCart() {
  cartPanel.classList.add("is-open");
  overlay.classList.add("is-visible");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

// Menutup keranjang
function closeCart() {
  cartPanel.classList.remove("is-open");
  overlay.classList.remove("is-visible");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

// Menambahkan produk
function addToCart(productId) {
  const product = products[productId];

  if (!product) {
    showToast("Produk tidak ditemukan.");
    return;
  }

  const size = "";
  const itemKey = getCartItemKey(productId, size);

  let item = cart.find(function (entry) {
    return getCartItemKey(entry.id, entry.size) === itemKey;
  });

  if (item) {
    if (item.quantity >= 99) {
      showToast("Jumlah maksimum adalah 99.");
      return;
    }

    item.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: size
    });
  }

  saveCart();
  renderCart();
  showToast(product.name + " ditambahkan ke keranjang.");
}
// Mengubah jumlah produk
function changeQuantity(productId, amount, size) {
  const item = cart.find(function (entry) {
    return getCartItemKey(entry.id, entry.size) ===
      getCartItemKey(productId, size);
  });

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(function (entry) {
      return getCartItemKey(entry.id, entry.size) !==
        getCartItemKey(productId, size);
    });
  }

  if (item.quantity > 99) {
    item.quantity = 99;
  }

  saveCart();
  renderCart();
}

// Menghapus produk
function removeFromCart(productId, size) {
  cart = cart.filter(function (item) {
    return getCartItemKey(item.id, item.size) !==
      getCartItemKey(productId, size);
  });

  saveCart();
  renderCart();
  showToast("Produk dihapus dari keranjang.");
}

// Menampilkan isi keranjang
function renderCart() {
  const totalQuantity = cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);

  const totalPrice = cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
  

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatRupiah(totalPrice);
  checkoutButton.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div class="empty-cart">' +
        '<p>Your bag is empty.</p>' +
        '<a href="#shop" id="continue-shopping">' +
          'DISCOVER PRODUCTS ↗' +
        '</a>' +
      '</div>';

    const continueShopping =
      document.getElementById("continue-shopping");

    continueShopping.addEventListener("click", closeCart);
    return;
    
  }

  // Bangun isi keranjang tanpa template literal
  cartItems.replaceChildren();

  cart.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("div");

    const name = document.createElement("p");
    name.className = "cart-row-name";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "cart-row-price";
    price.textContent = formatRupiah(item.price);

    const sizeLabel = document.createElement("p");
sizeLabel.className = "cart-row-size";
sizeLabel.textContent = item.size
  ? "SIZE: " + item.size
  : "SIZE: Belum dipilih";

    const quantityControl = document.createElement("div");
    quantityControl.className = "quantity-control";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.textContent = "−";
    decreaseButton.dataset.action = "decrease";
    decreaseButton.dataset.id = item.id;
    decreaseButton.setAttribute("aria-label", "Kurangi " + item.name);
    decreaseButton.dataset.size = item.size || "";

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.textContent = "+";
    increaseButton.dataset.action = "increase";
    increaseButton.dataset.id = item.id;
    increaseButton.setAttribute("aria-label", "Tambah " + item.name);
    increaseButton.dataset.size = item.size || "";

    quantityControl.append(
      decreaseButton,
      quantity,
      increaseButton
    );

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-item";
    removeButton.textContent = "Remove";
    removeButton.dataset.action = "remove";
    removeButton.dataset.id = item.id;
    removeButton.dataset.size = item.size || "";

    details.append(
  name,
  price,
  sizeLabel,
  quantityControl,
  removeButton
);

    const lineTotal = document.createElement("p");
    lineTotal.className = "cart-line-total";
    lineTotal.textContent = formatRupiah(
      item.price * item.quantity
    );

    row.append(details, lineTotal);
    cartItems.appendChild(row);
  });
}

// Klik tombol produk
document.addEventListener("click", function (event) {
  const button = event.target.closest("[data-add-product]");

  if (!button) return;

  event.preventDefault();
  addToCart(button.dataset.addProduct);
});

// Klik tombol di dalam keranjang
cartItems.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const productId = button.dataset.id;
  const action = button.dataset.action;
  const size = button.dataset.size || "";

  if (action === "increase") {
  changeQuantity(productId, 1, size);
} else if (action === "decrease") {
  changeQuantity(productId, -1, size);
} else if (action === "remove") {
  removeFromCart(productId, size);
}
});



// Tombol buka dan tutup keranjang
openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Menutup keranjang dengan tombol Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCart();
  }
});

// Filter kategori
if (productFilter) {
  productFilter.addEventListener("change", function () {
    const selectedCategory = productFilter.value;

    document.querySelectorAll("[data-product-card]").forEach(
      function (card) {
        card.hidden =
          selectedCategory !== "all" &&
          card.dataset.category !== selectedCategory;
      }
    );
  });
}

// Menuju halaman checkout
checkoutButton.addEventListener("click", function () {
  if (cart.length === 0) {
    showToast("Keranjang kamu masih kosong.");
    return;
  }

  window.location.href = "./checkout.html";
});

// Inisialisasi website
cart = loadCart();
renderCart();
