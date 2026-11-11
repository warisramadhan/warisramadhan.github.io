
"use strict";

const CONTACT_WHATSAPP_NUMBER = "6281234567890";

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document
      .getElementById("contact-name")
      .value.trim();

    const email = document
      .getElementById("contact-email")
      .value.trim();

    const subject = document
      .getElementById("contact-subject")
      .value;

    const message = document
      .getElementById("contact-message")
      .value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = "Please complete all fields.";
      return;
    }

    const orderMessage = [
      "LUXE D’AMOUR — CONTACT MESSAGE",
      "",
      "Name: " + name,
      "Email: " + email,
      "Subject: " + subject,
      "",
      "Message:",
      message
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" +
      CONTACT_WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(orderMessage);

    formStatus.textContent =
      "Opening WhatsApp. Please review your message before sending.";

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });
}
