export function credentialsMatch(inputEmail, inputPassword, expectedEmail, expectedPassword) {
  return inputEmail === expectedEmail && inputPassword === expectedPassword;
}

export function isProfileReadyForBooking(user = {}) {
  return Boolean(String(user.surname || "").trim() && String(user.phone || "").replace(/\D/g, ""));
}

export function showPage(documentRef, pageId) {
  documentRef.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  const target = documentRef.getElementById(`${pageId}-page`);
  if (target) {
    target.classList.add("active");
  }
}

export function filterProperties(properties, filters) {
  const {
    city = "all",
    type = "all",
    guests = 0,
    maxPrice = Number.POSITIVE_INFINITY
  } = filters || {};

  return properties.filter((property) => {
    const cityMatch = city === "all" || property.city === city;
    const typeMatch = type === "all" || property.type === type;
    const guestMatch = guests === 0 || property.guests >= guests;
    const priceMatch = Number(property.price || 0) <= maxPrice;
    return cityMatch && typeMatch && guestMatch && priceMatch;
  });
}

export function getNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const startStamp = start.getTime();
  const endStamp = end.getTime();

  if (Number.isNaN(startStamp) || Number.isNaN(endStamp)) {
    return 0;
  }

  const difference = endStamp - startStamp;
  const nights = Math.round(difference / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

export function getBookingTotal(pricePerNight, nights) {
  return Math.max(Number(pricePerNight || 0), 0) * Math.max(Number(nights || 0), 0);
}

export function getDiscountedBookingTotal(total, discountPercent) {
  const safeTotal = Math.max(Number(total || 0), 0);
  const safeDiscount = Math.min(Math.max(Number(discountPercent || 0), 0), 100);
  return Math.max(0, Math.round(safeTotal * ((100 - safeDiscount) / 100)));
}

export function getStatusClass(status) {
  return status === "Доступне" ? "status-pill--available" : "status-pill--booked";
}

export function formatMoney(value) {
  return `${Math.round(Number(value || 0))} грн`;
}

export function normalizePromocodeInputValue(value) {
  return String(value || "").trim().toUpperCase();
}

export function createToastController(timeoutMs = 3500) {
  const state = { isVisible: false };

  return {
    state,
    showToast() {
      state.isVisible = true;
      setTimeout(() => {
        state.isVisible = false;
      }, timeoutMs);
    }
  };
}