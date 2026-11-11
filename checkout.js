
"use strict";

// ==========================================
// LUXE D'AMOUR - CHECKOUT & ORDER MESSAGING
// ==========================================

const CART_KEY = "luxeDamourCart";
const ORDER_MESSAGE_KEY = "luxeDamourOrderMessage";

// GANTI dengan nomor WhatsApp toko kamu.
// Gunakan kode negara tanpa tanda +, spasi, atau strip.
// Contoh format Indonesia: 6281234567890
const WHATSAPP_NUMBER = "6281234567890";

// Instagram toko
const INSTAGRAM_USERNAME = "warysss__";

const checkoutForm = document.getElementById("checkout-form");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const instagramButton = document.getElementById("instagram-order");

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// Baca keranjang yang tersimpan
function readCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    if (!Array.isArray(saved)) {
      return [];
    }

    const productCatalog = {
  tee: { name: "Luxe Star Tee", price: 199000 },
  layer: { name: "Signature Hoodie", price: 329000 },
  jacket: { name: "Statement Jacket", price: 699000 },
  cap: { name: "Classic Cap", price: 129000 },
  oversized: { name: "Essential Oversized Tee", price: 229000 },
  graphic: { name: "Midnight Graphic Tee", price: 249000 },
  cargo: { name: "Utility Cargo Pants", price: 379000 },
  denim: { name: "Urban Baggy Denim", price: 429000 },
  varsity: { name: "Classic Varsity Jacket", price: 599000 },
  ziphoodie: { name: "Essential Zip Hoodie", price: 399000 },
  crossbody: { name: "Utility Crossbody Bag", price: 279000 },
  beanie: { name: "Essential Knit Beanie", price: 149000 }
};
    return saved
      .filter(function (item) {
        return (
          item &&
          typeof item.id === "string" &&
          productCatalog[item.id] &&
          Number.isInteger(item.quantity) &&
          item.quantity >= 1 &&
          item.quantity <= 99
        );
      })
      .map(function (item) {
        return {
  id: item.id,
  name: productCatalog[item.id].name,
  price: productCatalog[item.id].price,
  quantity: item.quantity,
  size: typeof item.size === "string" ? item.size : ""
};
      });
  } catch (error) {
    console.error("Gagal membaca keranjang:", error);
    return [];
  }
}

let cart = readCart();

function getSubtotal() {
  return cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
}

// Tampilkan ringkasan belanja
function renderCheckout() {
  checkoutItems.replaceChildren();

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "checkout-item-detail";
    emptyMessage.textContent = "Keranjang kamu masih kosong.";

    checkoutItems.appendChild(emptyMessage);
    checkoutTotal.textContent = formatRupiah(0);
    return;
  }

  cart.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "checkout-item";

    const details = document.createElement("div");

    const name = document.createElement("p");
    name.className = "checkout-item-name";
    name.textContent = item.name;

    const size = document.createElement("p");
   size.className = "checkout-item-detail";
   size.textContent = "Ukuran: " + (item.size || "Belum dipilih");
   
   const quantity = document.createElement("p");
   quantity.className = "checkout-item-detail";
   quantity.textContent = "Jumlah: " + item.quantity;

details.append(name, size, quantity);

    const price = document.createElement("p");
    price.className = "checkout-item-price";
    price.textContent = formatRupiah(
      item.price * item.quantity
    );

    row.append(details, price);
    checkoutItems.appendChild(row);
  });

  checkoutTotal.textContent = formatRupiah(getSubtotal());
}

// Buat pesan pesanan dari data formulir
function buildOrderMessage() {
  const buyerName =
    document.getElementById("buyer-name").value.trim();

  const buyerPhone =
    document.getElementById("buyer-phone").value.trim();

  const buyerAddress =
    document.getElementById("buyer-address").value.trim();

  const buyerNote =
    document.getElementById("buyer-note").value.trim();

  const paymentMethod =
    document.getElementById("payment-method").value;

  const productLines = cart.map(function (item) {
  return (
    "- " + item.name +
    "\n  Ukuran: " + (item.size || "Belum dipilih") +
    "\n  Jumlah: " + item.quantity +
    "\n  Harga: " + formatRupiah(item.price * item.quantity)
  );
});

  return [
    "HALO LUXE D'AMOUR!",
    "",
    "Saya ingin memesan produk berikut:",
    "",
    ...productLines,
    "",
    "Subtotal: " + formatRupiah(getSubtotal()),
    "Ongkir: Menunggu konfirmasi admin",
    "",
    "DATA PEMBELI",
    "Nama: " + buyerName,
    "WhatsApp: " + buyerPhone,
    "Alamat: " + buyerAddress,
    "Metode pembayaran: " + paymentMethod,
    "Catatan: " + (buyerNote || "-"),
    "",
    "Mohon konfirmasi ketersediaan produk, ongkir, dan pembayaran.",
    "Terima kasih."
  ].join("\n");
}

// Validasi formulir dan keranjang
function validateOrder() {
  cart = readCart();
  renderCheckout();

  if (cart.length === 0) {
    alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
    return false;
  }

  if (!checkoutForm.reportValidity()) {
    return false;
  }

  const message = buildOrderMessage();

  try {
    localStorage.setItem(ORDER_MESSAGE_KEY, message);
  } catch (error) {
    console.error("Gagal menyimpan ringkasan pesanan:", error);
  }

  return message;
}

// Kirim pesanan melalui WhatsApp
checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const message = validateOrder();

  if (!message) return;

  if (!/^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER)) {
    alert("Nomor WhatsApp toko belum diatur.");
    return;
  }

  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.location.href = whatsappURL;
});
// Salin pesan, kemudian buka Instagram
// Salin pesan, kemudian buka Instagram
instagramButton.addEventListener("click", async function () {
  const message = validateOrder();

  if (!message) return;

  try {
    await navigator.clipboard.writeText(message);

    alert(
      "Pesanan berhasil disalin! " +
      "Silakan tempel pesan tersebut ke DM Instagram toko."
    );
  } catch (error) {
    alert(
      "Pesanan sudah tersimpan di browser, " +
      "tetapi gagal disalin otomatis. Silakan gunakan WhatsApp."
    );
  }

  window.open(
    "https://www.instagram.com/" + INSTAGRAM_USERNAME + "/",
    "_blank"
  );
});

// Jalankan saat halaman dibuka
renderCheckout();
