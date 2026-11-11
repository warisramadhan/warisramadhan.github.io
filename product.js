
"use strict";

const STORAGE_KEY = "luxeDamourCart";

const productDetails = {
  tee: {
    name: "Luxe Star Tee",
    price: 199000,
    color: "Black",
    description: "Heavyweight cotton dengan siluet streetwear minimalis. Dirancang untuk gaya harian dengan karakter yang kuat.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85"
  },

  layer: {
    name: "Signature Hoodie",
    price: 329000,
    color: "Washed Black",
    description: "Hoodie relaxed fit dengan tampilan clean dan nuansa streetwear premium untuk penggunaan sehari-hari.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85"
  },

  jacket: {
    name: "Statement Jacket",
    price: 699000,
    color: "Black",
    description: "Jaket bergaya utility dengan siluet tegas untuk melengkapi tampilan streetwear yang berkarakter.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85"
  },

  cap: {
    name: "Classic Cap",
    price: 129000,
    color: "Black",
    description: "Aksesori minimalis yang mudah dipadukan dengan koleksi streetwear harian.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85"
  },

  
  oversized: {
    name: "Essential Oversized Tee",
    price: 229000,
    color: "Ivory",
    description: "Kaos oversized dengan gaya minimalis dan siluet streetwear modern.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=85"
  },



  graphic: {
    name: "Midnight Graphic Tee",
    price: 249000,
    color: "Black",
    description: "Graphic tee dengan karakter streetwear yang bold untuk gaya harian.",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85"
  },



  cargo: {
    name: "Utility Cargo Pants",
    price: 379000,
    color: "Olive",
    description: "Celana cargo bergaya utility dengan tampilan streetwear kasual.",
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=85"
  },



  denim: {
    name: "Urban Baggy Denim",
    price: 429000,
    color: "Blue Wash",
    description: "Denim dengan gaya baggy untuk siluet streetwear yang santai.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=85"
  },



  varsity: {
    name: "Classic Varsity Jacket",
    price: 599000,
    color: "Black / Ivory",
    description: "Jaket varsity bergaya klasik dengan sentuhan streetwear premium.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85"
  },



  ziphoodie: {
    name: "Essential Zip Hoodie",
    price: 399000,
    color: "Charcoal",
    description: "Hoodie bergaya clean dengan karakter streetwear untuk layering.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85"
  },



  crossbody: {
    name: "Utility Crossbody Bag",
    price: 279000,
    color: "Black",
    description: "Tas crossbody praktis dengan gaya urban minimalis.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85"
  },

  

  beanie: {
    name: "Essential Knit Beanie",
    price: 149000,
    color: "Black",
    description: "Beanie rajut minimalis untuk melengkapi outfit streetwear.",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=85"
  }

};

const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "tee";
const product = productDetails[productId];

const nameElement = document.getElementById("detail-name");
const priceElement = document.getElementById("detail-price");
const imageElement = document.getElementById("detail-image");
const descriptionElement = document.getElementById("detail-description");
const colorElement = document.getElementById("detail-color");
const sizeSelect = document.getElementById("detail-size");
const quantityInput = document.getElementById("detail-quantity");
const messageElement = document.getElementById("detail-message");
const addButton = document.getElementById("detail-add");
console.log("Tombol:", addButton);
console.log("Produk:", product);
console.log("Ukuran:", sizeSelect);

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

if (!product) {
  nameElement.textContent = "Product not found";
  priceElement.textContent = "";
  descriptionElement.textContent = "Produk tidak ditemukan.";
  imageElement.hidden = true;
  addButton.disabled = true;
} else {
  document.title = product.name + " | LUXE D’AMOUR";
  nameElement.textContent = product.name;
  priceElement.textContent = formatRupiah(product.price);
  imageElement.src = product.image;
  imageElement.alt = product.name;
    descriptionElement.textContent = product.description}
  if (colorElement) {
  colorElement.textContent = product.color;
}

function setQuantity(value) {
  const quantity = Number.parseInt(value, 10);

  quantityInput.value = Number.isFinite(quantity)
    ? Math.max(1, Math.min(99, quantity))
    : 1;
}

document.getElementById("quantity-minus").addEventListener("click", function () {
  setQuantity(Number(quantityInput.value) - 1);
});

document.getElementById("quantity-plus").addEventListener("click", function () {
  setQuantity(Number(quantityInput.value) + 1);
});

quantityInput.addEventListener("change", function () {
  setQuantity(quantityInput.value);
});

addButton.addEventListener("click", function () {
  if (!product) return;

  const selectedSize = sizeSelect.value;

  if (!selectedSize) {
    messageElement.textContent = "Silakan pilih ukuran terlebih dahulu.";
    sizeSelect.focus();
    return;
  }

  let cart;

  try {
    cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(cart)) {
      cart = [];
    }
  } catch (error) {
    messageElement.textContent = "Keranjang tidak bisa dibaca. Coba lagi.";
    return;
  }

  const quantityToAdd = Number(quantityInput.value);

  const existingItem = cart.find(function (item) {
    return item &&
      item.id === productId &&
      item.size === selectedSize;
  });

  if (existingItem) {
    const currentQuantity = Number(existingItem.quantity) || 0;

    if (currentQuantity + quantityToAdd > 99) {
      messageElement.textContent = "Maksimum 99 barang untuk ukuran ini.";
      return;
    }

    existingItem.quantity = currentQuantity + quantityToAdd;
  } else {
    cart.push({
      id: productId,
      quantity: quantityToAdd,
      size: selectedSize
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

    messageElement.textContent =
      "Berhasil ditambahkan. Ukuran: " + selectedSize;

    addButton.textContent = "ADDED TO BAG ✓";

    setTimeout(function () {
      addButton.textContent = "ADD TO BAG ↗";
    }, 1800);

  } catch (error) {
    messageElement.textContent = "Gagal menyimpan keranjang. Coba lagi.";
  }
});