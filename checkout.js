let cart = readCart();

function getSubtotal() {
  return cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
}

// Tampilkan ringkasan belanja
function renderCheckout() {
  if (!checkoutItems || !checkoutTotal) return;


  checkoutItems.replaceChildren();

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "checkout-item-detail";
    emptyMessage.textContent = "Keranjang kamu masih kosong.";

    checkoutItems.appendChild(emptyMessage);
   checkoutTotal.textContent = formatRupiah(getTotal());
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

 checkoutTotal.textContent = formatRupiah(getTotal());

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
    "Ongkir: " + (
  selectedShipping
    ? formatRupiah(selectedShipping.cost)
    : "Belum dihitung"
),
"Kurir: " + (
  selectedShipping
    ? selectedShipping.courier.toUpperCase() +
      " " + selectedShipping.service
    : "Belum dipilih"
),
"TOTAL: " + formatRupiah(getTotal()),
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


// ==========================================
// RAJAONGKIR - PENCARIAN ALAMAT
// ==========================================

const RAJAONGKIR_WORKER =
  "https://luxe-damour-rajaongkir.ahmad-waris111.workers.dev";

const destinationInput =
  document.getElementById("shipping-destination");

const destinationResults =
  document.getElementById("destination-results");

const destinationId =
  document.getElementById("destination-id");

let destinationTimer;

if (destinationInput && destinationResults && destinationId) {

  destinationInput.addEventListener("input", function () {
    clearTimeout(destinationTimer);

    destinationId.value = "";
    destinationResults.replaceChildren();

    const keyword = destinationInput.value.trim();

    if (keyword.length < 2) return;

    const loading = document.createElement("p");
    loading.textContent = "Mencari alamat...";
    destinationResults.appendChild(loading);

    destinationTimer = setTimeout(async function () {
      try {
        const response = await fetch(
          RAJAONGKIR_WORKER +
          "/destination?search=" +
          encodeURIComponent(keyword)
        );

        const result = await response.json();

        destinationResults.replaceChildren();

        if (!response.ok || !Array.isArray(result.data)) {
          throw new Error(
            result.message || "Data alamat tidak ditemukan."
          );
        }

        if (result.data.length === 0) {
          destinationResults.textContent =
            "Alamat tidak ditemukan.";
          return;
        }

        result.data.forEach(function (location) {
          const button = document.createElement("button");

          button.type = "button";
          button.textContent =
            location.label || location.subdistrict_name ||
            "Lokasi tujuan";

          button.addEventListener("click", function () {
            destinationInput.value = button.textContent;
            destinationId.value = location.id;

            destinationResults.replaceChildren();

            const selected = document.createElement("p");
            selected.textContent = "Lokasi berhasil dipilih.";
            destinationResults.appendChild(selected);
          });

          destinationResults.appendChild(button);
        });

      } catch (error) {
        destinationResults.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
          "Gagal mencari alamat. Silakan coba lagi.";

        destinationResults.appendChild(message);

        console.error("RajaOngkir:", error);
      }
    }, 500);
  });
}


// Jalankan saat halaman dibuka

// ==========================================
// RAJAONGKIR - HITUNG ONGKIR OTOMATIS
// ==========================================

const ORIGIN_ID = "6524";

const courierSelect =
  document.getElementById("shipping-courier");

const checkShippingButton =
  document.getElementById("check-shipping");

const shippingResults =
  document.getElementById("shipping-results");

let selectedShipping = null;

function getTotalWeight() {
  return cart.reduce(function (total, item) {
    return total + (item.weight * item.quantity);
  }, 0);
}

function getTotal() {
  return getSubtotal() +
    (selectedShipping ? selectedShipping.cost : 0);
}

function renderShippingTotal() {
  const summary = document.createElement("div");
  summary.className = "shipping-summary";

  const subtotal = document.createElement("p");
  subtotal.textContent =
    "Subtotal: " + formatRupiah(getSubtotal());

  const shipping = document.createElement("p");
  shipping.textContent =
    "Ongkir: " +
    (selectedShipping
      ? formatRupiah(selectedShipping.cost)
      : "Belum dipilih");

  const total = document.createElement("strong");
  total.textContent =
    "TOTAL: " + formatRupiah(getTotal());

  summary.append(subtotal, shipping, total);
  shippingResults.appendChild(summary);

  if (checkoutTotal) {
    checkoutTotal.textContent = formatRupiah(getTotal());
  }
}

if (checkShippingButton && shippingResults && courierSelect) {

  checkShippingButton.addEventListener("click", async function () {

    cart = readCart();

    if (cart.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }

    if (!destinationId.value) {
      alert("Silakan pilih alamat tujuan terlebih dahulu.");
      return;
    }

    if (!courierSelect.value) {
      alert("Silakan pilih kurir terlebih dahulu.");
      return;
    }

    selectedShipping = null;

    const weight = getTotalWeight();

    shippingResults.textContent = "Sedang menghitung ongkir...";

    checkShippingButton.disabled = true;

    try {

      const params = new URLSearchParams({
        origin: ORIGIN_ID,
        destination: destinationId.value,
        weight: String(weight),
        courier: courierSelect.value
      });

      const response = await fetch(
        RAJAONGKIR_WORKER + "/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params.toString()
        }
      );

      const result = await response.json();

      if (!response.ok || !Array.isArray(result.data)) {
        throw new Error(
          result.message ||
          result.meta?.message ||
          "Gagal menghitung ongkir."
        );
      }

      shippingResults.replaceChildren();

      if (result.data.length === 0) {
        shippingResults.textContent =
          "Tidak ada layanan pengiriman tersedia.";
        return;
      }

      const heading = document.createElement("p");
      heading.textContent =
        "Pilih layanan pengiriman:";
      shippingResults.appendChild(heading);

      result.data.forEach(function (option) {

        const cost = Number(option.cost);

        if (!Number.isFinite(cost) || cost < 0) return;

        const button = document.createElement("button");

        button.type = "button";

        button.textContent =
          (option.name || option.code) +
          " - " + (option.service || "") +
          " - " + formatRupiah(cost) +
          (option.etd ? " (" + option.etd + ")" : "");

        button.addEventListener("click", function () {

          selectedShipping = {
            courier: option.code || courierSelect.value,
            service: option.service || "",
            description: option.description || "",
            cost: cost,
            etd: option.etd || ""
          };

          renderCheckout();

          shippingResults.replaceChildren();

          const selected = document.createElement("p");
          selected.textContent =
            "Layanan dipilih: " +
            selectedShipping.courier.toUpperCase() +
            " " + selectedShipping.service;

          shippingResults.appendChild(selected);

          renderShippingTotal();
        });

        shippingResults.appendChild(button);
      });

      if (!shippingResults.querySelector("button")) {
        shippingResults.textContent =
          "Tidak ada layanan pengiriman yang valid.";
      }

    } catch (error) {

      shippingResults.textContent =
        "Gagal menghitung ongkir. Silakan coba lagi.";

      console.error("RajaOngkir:", error);

    } finally {

      checkShippingButton.disabled = false;

    }

  });

  destinationInput.addEventListener("input", function () {
    selectedShipping = null;
  });

  courierSelect.addEventListener("change", function () {
    selectedShipping = null;
  });
}


// Jalankan saat halaman dibuka
renderCheckout();
