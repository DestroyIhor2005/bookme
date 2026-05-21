const properties = [];

const catalogCities = [
  "Київ",
  "Львів",
  "Одеса",
  "Харків",
  "Дніпро",
  "Запоріжжя",
  "Івано-Франківськ",
  "Тернопіль",
  "Чернівці",
  "Ужгород",
  "Луцьк",
  "Рівне",
  "Житомир",
  "Вінниця",
  "Полтава",
  "Черкаси",
  "Чернігів",
  "Суми",
  "Хмельницький",
  "Миколаїв",
  "Херсон",
  "Кропивницький",
  "Славське",
  "Яремче"
];

let ownerTasks = [];
let notifications = [];

let bookings = loadState("bookme-bookings", []);
let payments = loadState("bookme-payments", []);
let bookingHistory = loadState("bookme-history", []);
let ownerPropertiesState = [];
let ownerBookingsState = [];
let activeBookingStatusFilter = "new";

let selectedPropertyId = properties[0]?.id ?? null;
let currentUser = null;
let isUserAuthenticated = false;
let isOwnerLoggedIn = false;
let toastTimer;
let pickerMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let shouldOpenProfileEditorAfterAccountNavigation = false;
let appNotifications = [];
let unreadNotificationsCount = 0;
let activeChatPropertyId = null;
let selectedChatUserId = "";
let activeChatView = "modal";
let hasTouchedPriceFilter = false;
let activeDashboardSection = "overview";
let detailsBackContext = { page: "home", dashboard: "overview" };
let appliedBookingPromocode = null;

const COUNTRY_PHONE_CONFIG = {
  "+380": { placeholder: "(XX) XXX-XX-XX", maxDigits: 9 },
  "+48": { placeholder: "XXX-XXX-XXX", maxDigits: 9 },
  "+49": { placeholder: "XXXX XXXXXXX", maxDigits: 11 },
  "+1": { placeholder: "(XXX) XXX-XXXX", maxDigits: 10 },
  "+44": { placeholder: "XXXX XXX XXX", maxDigits: 10 }
};

const SUPPORTED_PHONE_CODES = Object.keys(COUNTRY_PHONE_CONFIG).sort((leftCode, rightCode) => rightCode.length - leftCode.length);

const featuredGrid = document.getElementById("featured-grid");
const catalogGrid = document.getElementById("catalog-grid");
const filterCity = document.getElementById("filter-city");
const filterType = document.getElementById("filter-type");
const filterGuests = document.getElementById("filter-guests");
const filterPrice = document.getElementById("filter-price");
const filterPriceValue = document.getElementById("filter-price-value");
const catalogCount = document.getElementById("catalog-count");
const filtersClearButton = document.getElementById("filters-clear-btn");
const bookingCheckin = document.getElementById("booking-checkin");
const bookingCheckout = document.getElementById("booking-checkout");
const bookingNightsInput = document.getElementById("booking-nights-input");
const bookingEstimateInput = document.getElementById("booking-estimate");
const bookingPromocodeField = document.getElementById("booking-promocode-field");
const bookingPromocodeInput = document.getElementById("booking-promocode");
const bookingPromocodeApplyButton = document.getElementById("booking-promocode-apply");
const bookingPromocodeMessage = document.getElementById("booking-promocode-message");
const bookingForm = document.getElementById("booking-form");
const bookingFormMessage = document.getElementById("booking-form-message");
const detailsMap = document.getElementById("details-map");
const detailsMapCaption = document.getElementById("details-map-caption");
const dateRangeTrigger = document.getElementById("date-range-trigger");
const dateRangeText = document.getElementById("date-range-text");
const datePicker = document.getElementById("date-picker");
const datePickerMonth = document.getElementById("date-picker-month");
const datePickerGrid = document.getElementById("date-picker-grid");
const datePickerHint = document.getElementById("date-picker-hint");
const datePickerPrev = document.getElementById("date-picker-prev");
const datePickerNext = document.getElementById("date-picker-next");
const datePickerClear = document.getElementById("date-picker-clear");
const authGate = document.getElementById("auth-gate");
const siteShell = document.getElementById("site-shell");
const authTabLogin = document.getElementById("auth-tab-login");
const authTabRegister = document.getElementById("auth-tab-register");
const authLoginForm = document.getElementById("auth-login-form");
const authRegisterForm = document.getElementById("auth-register-form");
const authLoginMessage = document.getElementById("auth-login-message");
const authRegisterMessage = document.getElementById("auth-register-message");
const cabinetNavButton = document.getElementById("cabinet-nav-btn");
const heroCabinetButton = document.getElementById("hero-cabinet-btn");
const profilePromptModal = document.getElementById("profile-prompt-modal");
const profileEditModal = document.getElementById("profile-edit-modal");
const profileEditForm = document.getElementById("profile-edit-form");
const profileEditMessage = document.getElementById("profile-edit-message");
const notificationButton = document.getElementById("notification-btn");
const notificationDot = document.getElementById("notification-dot");
const notificationPopover = document.getElementById("notification-popover");
const notificationsList = document.getElementById("notifications-list");
const notificationsMarkReadButton = document.getElementById("notifications-mark-read-btn");
const foreignPhoneNote = document.getElementById("foreign-phone-note");
const profilePhoneCode = document.getElementById("profile-edit-country-code");
const profilePhoneInput = document.getElementById("profile-edit-phone");
const profileCountryTrigger = document.getElementById("profile-country-trigger");
const profileCountryMenu = document.getElementById("profile-country-menu");
const profileCountryLabel = document.getElementById("profile-country-label");
const profileCountryFlag = document.getElementById("profile-country-flag");
const detailsCheckTimes = document.getElementById("details-check-times");
const openChatButton = document.getElementById("open-chat-btn");
const chatModal = document.getElementById("chat-modal");
const chatModalTitle = document.getElementById("chat-modal-title");
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const contactMessage = document.getElementById("contact-message");
const chatOwnerStatus = document.getElementById("chat-owner-status");
const chatThreadWrap = document.getElementById("chat-thread-wrap");
const chatThreadSelect = document.getElementById("chat-thread-select");
const openChatsBtn = document.getElementById("open-chats-btn");
const dashboardOpenChatsBtn = document.getElementById("dashboard-open-chats-btn");
const chatsListCard = document.getElementById("chats-list-card");
const chatsListContainer = document.getElementById("chats-list-container");
const dashboardChatsCard = document.getElementById("dash-chats");
const dashboardChatsContainer = document.getElementById("dashboard-chats-container");
const dashboardChatsListCard = document.getElementById("dashboard-chats-list-card");
const dashboardChatRoomCard = document.getElementById("dashboard-chat-room-card");
const dashboardChatRoomTitle = document.getElementById("dashboard-chat-room-title");
const dashboardChatPropertyHint = document.getElementById("dashboard-chat-property-hint");
const dashboardChatOwnerStatus = document.getElementById("dashboard-chat-owner-status");
const dashboardChatThreadWrap = document.getElementById("dashboard-chat-thread-wrap");
const dashboardChatThreadSelect = document.getElementById("dashboard-chat-thread-select");
const dashboardChatBox = document.getElementById("dashboard-chat-box");
const dashboardChatForm = document.getElementById("dashboard-chat-form");
const dashboardChatInput = document.getElementById("dashboard-chat-input");
const dashboardChatBackBtn = document.getElementById("dashboard-chat-back-btn");
const chatEditModal = document.getElementById("chat-edit-modal");
const chatEditModalText = document.getElementById("chat-edit-modal-text");
const chatEditModalInput = document.getElementById("chat-edit-modal-input");
const chatEditSaveBtn = document.getElementById("chat-edit-save");
const chatEditCancelBtn = document.getElementById("chat-edit-cancel");

function autoExpandTextarea(textarea) {
  if (!textarea) {
    return;
  }

  if (!textarea.dataset.baseHeight) {
    textarea.dataset.baseHeight = String(textarea.offsetHeight || textarea.scrollHeight || 0);
  }

  const baseHeight = Number(textarea.dataset.baseHeight) || textarea.offsetHeight || 0;
  textarea.style.height = "auto";
  // Grow the textarea with content up to a sensible maximum to avoid shifting the whole page
  textarea.style.height = Math.max(baseHeight, Math.min(textarea.scrollHeight, 360)) + "px";
}

// Auto-expand textarea
[chatInput, dashboardChatInput, chatEditModalInput, contactMessage, document.getElementById("owner-property-description")].forEach((textarea) => {
  if (!textarea) {
    return;
  }

  textarea.addEventListener("input", function() {
    autoExpandTextarea(this);
  });
  autoExpandTextarea(textarea);
});

function syncModalScrollLock() {
  const hasVisibleModal = Array.from(document.querySelectorAll(".modal-backdrop")).some(
    (modal) => !modal.classList.contains("hidden")
  );
  document.body.classList.toggle("modal-open", hasVisibleModal);
}

// Custom confirm modal (returns Promise<boolean>)
function showConfirm(text) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirm-modal');
    const txt = document.getElementById('confirm-modal-text');
    const ok = document.getElementById('confirm-ok');
    const cancel = document.getElementById('confirm-cancel');

    if (!modal || !ok || !cancel || !txt) {
      // fallback to window.confirm if modal not present
      resolve(window.confirm(text));
      return;
    }

    function cleanup(result) {
      modal.classList.add('hidden');
      syncModalScrollLock();
      ok.removeEventListener('click', onOk);
      cancel.removeEventListener('click', onCancel);
      modal.removeEventListener('click', onBackdrop);
      resolve(result);
    }

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onBackdrop(e) { if (e.target === modal) cleanup(false); }

    txt.textContent = text || '';
    modal.classList.remove('hidden');
    syncModalScrollLock();
    ok.focus();
    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
    modal.addEventListener('click', onBackdrop);
  });
}

function showChatEditModal(initialText = "") {
  return new Promise((resolve) => {
    if (!chatEditModal || !chatEditModalInput || !chatEditSaveBtn || !chatEditCancelBtn || !chatEditModalText) {
      resolve(window.prompt("Редагувати повідомлення", initialText));
      return;
    }

    function cleanup(result) {
      chatEditModal.classList.add("hidden");
      syncModalScrollLock();
      chatEditSaveBtn.removeEventListener("click", onSave);
      chatEditCancelBtn.removeEventListener("click", onCancel);
      chatEditModal.removeEventListener("click", onBackdrop);
      resolve(result);
    }

    function onSave() {
      cleanup(chatEditModalInput.value);
    }

    function onCancel() {
      cleanup(null);
    }

    function onBackdrop(event) {
      if (event.target === chatEditModal) {
        cleanup(null);
      }
    }

    chatEditModalText.textContent = "Редагування повідомлення";
    chatEditModalInput.value = initialText;
    chatEditModal.classList.remove("hidden");
    syncModalScrollLock();
    autoExpandTextarea(chatEditModalInput);
    chatEditModalInput.focus();
    chatEditModalInput.setSelectionRange(chatEditModalInput.value.length, chatEditModalInput.value.length);
    chatEditSaveBtn.addEventListener("click", onSave);
    chatEditCancelBtn.addEventListener("click", onCancel);
    chatEditModal.addEventListener("click", onBackdrop);
  });
}
const bookingStatusSummary = document.getElementById("booking-status-summary");
const ownerPropertyForm = document.getElementById("owner-property-form");
const ownerPropertyMessage = document.getElementById("owner-property-message");
const ownerPropertyTypeSelect = document.getElementById("owner-property-type");
const ownerPropertyImageInput = document.getElementById("owner-property-image");
const ownerPropertyPhotoPreview = document.getElementById("owner-property-photo-preview");
const ownerPropertyPhotoGallery = document.getElementById("owner-property-photo-gallery");
const ownerPropertyPhotoPlaceholder = document.getElementById("owner-property-photo-placeholder");
const ownerPropertyPhotoName = document.getElementById("owner-property-photo-name");
const ownerPropertyPhotoClearButton = document.getElementById("owner-property-photo-clear");
const ownerPropertyCancelButton = document.getElementById("owner-property-cancel-btn");
const dashboardEditProfileButton = document.getElementById("dashboard-edit-profile-btn");
const detailsBackButton = document.getElementById("details-back-btn");
const detailsGallery = document.getElementById("details-gallery");

const OWNER_PROPERTY_IMAGE_LIMIT = 3 * 1024 * 1024;
const OWNER_PROPERTY_ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const OWNER_PROPERTY_IMAGE_HINT = "PNG, JPG або WEBP до 3 МБ.";
const OWNER_PROPERTY_MAX_IMAGES = 7;

// Fixed guest buckets used by the filters (mutually exclusive ranges)
const FIXED_GUEST_BUCKETS = [2, 4, 6];

let ownerPropertyImages = [];
let detailsGalleryImages = [];
let detailsGalleryIndex = 0;
let editingOwnerPropertyId = null;

function isProfileComplete(user = currentUser) {
  const phoneMeta = getUserPhoneMeta(user);
  return Boolean(getUserSurname(user) && phoneMeta.nationalNumber);
}

function getDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function parseStoredPhone(phone) {
  const rawPhone = String(phone || "").trim();
  if (!rawPhone) {
    return {
      countryCode: "+380",
      nationalNumber: "",
      fullPhone: "",
      isForeignPhone: false
    };
  }

  const normalizedPhone = rawPhone.startsWith("+")
    ? `+${rawPhone.slice(1).replace(/\D/g, "")}`
    : `+${rawPhone.replace(/\D/g, "")}`;

  if (normalizedPhone === "+") {
    return {
      countryCode: "+380",
      nationalNumber: "",
      fullPhone: "",
      isForeignPhone: false
    };
  }

  const countryCode = SUPPORTED_PHONE_CODES.find((code) => normalizedPhone.startsWith(code)) || "+380";
  const nationalNumber = normalizedPhone
    .slice(countryCode.length)
    .replace(/\D/g, "")
    .slice(0, COUNTRY_PHONE_CONFIG[countryCode]?.maxDigits || 12);
  const fullPhone = nationalNumber ? `${countryCode}${nationalNumber}` : "";

  return {
    countryCode,
    nationalNumber,
    fullPhone,
    isForeignPhone: Boolean(nationalNumber) && countryCode !== "+380"
  };
}

function getUserSurname(user = currentUser) {
  return String(user?.surname || user?.lastName || "").trim();
}

function getUserPhoneMeta(user = currentUser) {
  const legacyPhone = user?.phone || `${user?.phoneCountryCode || ""}${user?.phoneNational || ""}`;
  return parseStoredPhone(legacyPhone);
}

function formatPhoneByCountry(code, rawValue) {
  const digits = getDigits(rawValue).slice(0, COUNTRY_PHONE_CONFIG[code]?.maxDigits || 12);

  if (code === "+380") {
    const p1 = digits.slice(0, 2);
    const p2 = digits.slice(2, 5);
    const p3 = digits.slice(5, 7);
    const p4 = digits.slice(7, 9);
    return [p1 && `(${p1}`, p1.length === 2 ? ")" : "", p2, p3 && `-${p3}`, p4 && `-${p4}`].join("").replace(" )", ") ").trim();
  }

  if (code === "+1") {
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 10);
    return [p1 && `(${p1}`, p1.length === 3 ? ")" : "", p2, p3 && `-${p3}`].join("").replace(" )", ") ").trim();
  }

  if (code === "+48") {
    return digits.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_m, a, b, c) => [a, b, c].filter(Boolean).join("-"));
  }

  if (code === "+44") {
    return digits.replace(/(\d{4})(\d{0,3})(\d{0,3})/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  }

  return digits.replace(/(\d{4})(\d{0,7})/, (_m, a, b) => [a, b].filter(Boolean).join(" "));
}

function localForeignMessage(code) {
  const map = {
    "+48": "Aby zarezerwować mieszkanie, możesz skontaktować się z właścicielem przez czat / To book accommodation, you can contact the owner via chat.",
    "+49": "Um eine Unterkunft zu buchen, konnen Sie den Eigentumer per Chat kontaktieren / To book accommodation, you can contact the owner via chat.",
    "+1": "To book accommodation, you can contact the owner via chat / To book accommodation, you can contact the owner via chat.",
    "+44": "To book accommodation, you can contact the owner via chat / To book accommodation, you can contact the owner via chat."
  };

  return map[code] || "To book accommodation, you can contact the owner via chat.";
}

function updateCountryPickerVisual(code, label, flag) {
  profilePhoneCode.value = code;
  profileCountryLabel.textContent = label;
  profileCountryFlag.className = `flag-badge flag-badge--${flag}`;
  profilePhoneInput.placeholder = COUNTRY_PHONE_CONFIG[code]?.placeholder || "Номер телефону";
}

function closeCountryPickerMenu() {
  profileCountryMenu.classList.add("hidden");
  profileCountryTrigger.setAttribute("aria-expanded", "false");
}

function createCustomSelect(select) {
  let wrapper = select.parentElement.querySelector(`.custom-select[data-select-id="${select.id}"]`);

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    wrapper.dataset.selectId = select.id;
    wrapper.innerHTML = `
      <button type="button" class="custom-select__trigger">
        <span class="custom-select__text"></span>
        <span class="custom-select__icon">▾</span>
      </button>
      <div class="custom-select__menu hidden"></div>
    `;
    select.insertAdjacentElement("afterend", wrapper);
  }

  const trigger = wrapper.querySelector(".custom-select__trigger");
  const text = wrapper.querySelector(".custom-select__text");
  const menu = wrapper.querySelector(".custom-select__menu");
  const hideDefaultLabel = select.dataset.blankDefault === "true";
  const isDefaultValue = select.selectedIndex <= 0;

  text.textContent = hideDefaultLabel && isDefaultValue ? "" : select.options[select.selectedIndex]?.textContent ?? "";
  trigger.classList.toggle("is-placeholder", hideDefaultLabel && isDefaultValue);

  menu.innerHTML = "";

  if (!isDefaultValue) {
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "custom-select__clear";
    clearButton.textContent = "Очистити вибір";
    menu.appendChild(clearButton);
  }

  Array.from(select.options).forEach((option, index) => {
    if (hideDefaultLabel && index === 0) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "custom-select__option";
    button.textContent = option.textContent;
    button.dataset.value = option.value;

    if (index === select.selectedIndex) {
      button.classList.add("is-selected");
    }

    menu.appendChild(button);
  });
}

function initCustomSelects() {
  [filterCity, filterType, filterGuests, ownerPropertyTypeSelect].forEach((select) => {
    if (!select) return;
    // Remove any existing custom-select wrapper to ensure it's rebuilt with current options
    const existing = select.parentElement.querySelector(`.custom-select[data-select-id="${select.id}"]`);
    if (existing) existing.remove();
    createCustomSelect(select);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Не вдалося прочитати файл."));
    reader.readAsDataURL(file);
  });
}

function renderOwnerPropertyPhotoPreview() {
  const hasImages = ownerPropertyImages.length > 0;
  ownerPropertyPhotoPreview.classList.toggle("has-image", hasImages);
  ownerPropertyPhotoPlaceholder.classList.toggle("hidden", hasImages);
  ownerPropertyPhotoClearButton.classList.toggle("hidden", !hasImages);

  if (!ownerPropertyPhotoGallery) {
    return;
  }

  if (!hasImages) {
    ownerPropertyPhotoGallery.innerHTML = "";
    ownerPropertyPhotoName.textContent = OWNER_PROPERTY_IMAGE_HINT;
    return;
  }

  ownerPropertyPhotoName.textContent = `${ownerPropertyImages.length} фото додано`;
  ownerPropertyPhotoGallery.innerHTML = ownerPropertyImages.map((item, index) => `
    <div class="owner-property-photo__tile${index === 0 ? " is-cover" : ""}" data-photo-index="${index}">
      <div class="owner-property-photo__tile-image" style="background-image: url('${item.dataUrl.replace(/'/g, "%27")}');"></div>
      <button type="button" class="owner-property-photo__remove" data-photo-remove="${index}" aria-label="Видалити фото ${index + 1}">×</button>
      <span class="owner-property-photo__badge">${index === 0 ? "Обкладинка" : `Фото ${index + 1}`}</span>
    </div>
  `).join("");
}

function resetOwnerPropertyPhoto() {
  ownerPropertyImageInput.value = "";
  ownerPropertyImages = [];
  renderOwnerPropertyPhotoPreview();
}

async function handleOwnerPropertyPhotoChange() {
  const files = Array.from(ownerPropertyImageInput.files || []);

  if (!files.length) {
    resetOwnerPropertyPhoto();
    return;
  }

  if (ownerPropertyImages.length + files.length > OWNER_PROPERTY_MAX_IMAGES) {
    showOwnerPropertyMessage(`Можна додати не більше ${OWNER_PROPERTY_MAX_IMAGES} фото.`);
    ownerPropertyImageInput.value = "";
    return;
  }

  const invalidFile = files.find((file) => !OWNER_PROPERTY_ALLOWED_IMAGE_TYPES.has(file.type));
  if (invalidFile) {
    ownerPropertyImageInput.value = "";
    showOwnerPropertyMessage("Фото має бути у форматі PNG, JPG або WEBP.");
    return;
  }

  const oversizeFile = files.find((file) => file.size > OWNER_PROPERTY_IMAGE_LIMIT);
  if (oversizeFile) {
    ownerPropertyImageInput.value = "";
    showOwnerPropertyMessage("Фото завелике. Оберіть файл до 3 МБ.");
    return;
  }

  clearOwnerPropertyMessage();

  try {
    const newImages = await Promise.all(files.map(async (file) => ({
      name: file.name,
      dataUrl: await readFileAsDataUrl(file)
    })));
    ownerPropertyImages = [...ownerPropertyImages, ...newImages];
    renderOwnerPropertyPhotoPreview();
  } catch (error) {
    showOwnerPropertyMessage(error.message || "Не вдалося завантажити фото.");
  }

  ownerPropertyImageInput.value = "";
}

function removeOwnerPropertyImage(imageIndex) {
  ownerPropertyImages = ownerPropertyImages.filter((_, index) => index !== imageIndex);
  renderOwnerPropertyPhotoPreview();
}

function extractImageSource(value) {
  if (!value) return "";
  let v = String(value).trim();
  // if wrapped in url('...') or url("...") extract
  const urlMatch = v.match(/url\(['"]?(.*?)['"]?\)/i);
  if (urlMatch && urlMatch[1]) {
    v = urlMatch[1];
  }
  // if contains data: inside a gradient, try to extract it
  const dataMatch = v.match(/(data:image\/[a-z]+;base64,[^'"\)\s]+)/i);
  if (dataMatch) {
    return dataMatch[1];
  }
  // otherwise return plain url or data-uri
  return v;
}

function populateOwnerPropertyForm(property) {
  if (!property) return;
  editingOwnerPropertyId = String(property.id || property._id || "");
  document.getElementById("owner-property-title").value = property.title || "";
  document.getElementById("owner-property-city").value = property.city || "";
  ownerPropertyTypeSelect.value = property.type || "";
  document.getElementById("owner-property-guests").value = property.guests || "";
  document.getElementById("owner-property-price").value = property.price_per_night || property.price || "";
  document.getElementById("owner-property-address").value = property.address || "";
  document.getElementById("owner-property-amenities").value = (Array.isArray(property.amenities) ? property.amenities.join(", ") : String(property.amenities || ""));
  document.getElementById("owner-property-description").value = property.description || "";

  const sourceImages = Array.isArray(property.images) && property.images.length ? property.images : (property.image ? [property.image] : []);
  ownerPropertyImages = sourceImages.map((url, idx) => ({ name: `Фото ${idx + 1}`, dataUrl: extractImageSource(url) }));
  renderOwnerPropertyPhotoPreview();
  createCustomSelect(ownerPropertyTypeSelect);
  ownerPropertyCancelButton?.classList.remove("hidden");
  const submitButton = ownerPropertyForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = 'Зберегти зміни';
}

function resetOwnerPropertyFormState() {
  editingOwnerPropertyId = null;
  ownerPropertyForm.reset();
  resetOwnerPropertyPhoto();
  createCustomSelect(ownerPropertyTypeSelect);
  ownerPropertyCancelButton?.classList.add("hidden");
  const submitButton = ownerPropertyForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = 'Опублікувати житло';
  clearOwnerPropertyMessage();
}

function getPropertyGalleryImages(property) {
  const images = Array.isArray(property?.images) && property.images.length
    ? property.images
    : (property?.image ? [property.image] : []);

  return images.filter(Boolean);
}

function renderDetailsGallery(images, activeIndex = 0) {
  if (!detailsGallery) {
    return;
  }

  detailsGalleryImages = images.filter(Boolean);
  detailsGallery.classList.toggle("details-gallery--single", detailsGalleryImages.length <= 1);
  detailsGallery.classList.toggle("details-gallery--multiple", detailsGalleryImages.length > 1);

  if (!detailsGalleryImages.length) {
    detailsGallery.innerHTML = '<div class="details-gallery__empty">Фото поки не додані.</div>';
    return;
  }

  if (detailsGalleryImages.length === 1) {
    detailsGalleryIndex = 0;
    detailsGallery.innerHTML = `
      <div class="details-gallery__single" style="background-image: ${detailsGalleryImages[0]};"></div>
    `;
    return;
  }

  detailsGalleryIndex = Math.min(Math.max(activeIndex, 0), detailsGalleryImages.length - 1);
  const activeImage = detailsGalleryImages[detailsGalleryIndex];

  detailsGallery.innerHTML = `
    <div class="details-gallery__stage">
      <div class="details-gallery__frame" style="background-image: ${activeImage};"></div>
      <button type="button" class="details-gallery__nav details-gallery__nav--prev" data-gallery-step="-1" aria-label="Попереднє фото">‹</button>
      <button type="button" class="details-gallery__nav details-gallery__nav--next" data-gallery-step="1" aria-label="Наступне фото">›</button>
    </div>
    <div class="details-gallery__thumbs">
      ${detailsGalleryImages.map((image, index) => `
        <button type="button" class="details-gallery__thumb${index === detailsGalleryIndex ? " is-active" : ""}" data-gallery-index="${index}" style="background-image: ${image};" aria-label="Фото ${index + 1}"></button>
      `).join("")}
    </div>
  `;
}

function closeCustomSelects(exceptId) {
  document.querySelectorAll(".custom-select").forEach((select) => {
    if (exceptId && select.dataset.selectId === exceptId) {
      return;
    }

    select.classList.remove("is-open");
    select.querySelector(".custom-select__trigger")?.setAttribute("aria-expanded", "false");
    select.querySelector(".custom-select__menu")?.classList.add("hidden");
  });
}

function formatLongDate(isoDate) {
  return new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long" }).format(parseLocalDate(isoDate));
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getUtcDayStamp(isoDate) {
  if (!isoDate) {
    return null;
  }

  const [year, month, day] = String(isoDate).split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return Date.UTC(year, month - 1, day);
}

function getTodayKey() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return getLocalDateKey(today);
}

function getSelectedProperty() {
  return properties.find((item) => sameEntityId(item.id, selectedPropertyId));
}

function isDateBlocked(isoDate, property = getSelectedProperty()) {
  if (!property) {
    return false;
  }

  return isoDate < getTodayKey() || property.unavailableDates.includes(isoDate);
}

function rangeIncludesBlockedDates(checkIn, checkOut, property = getSelectedProperty()) {
  if (!checkIn || !checkOut || !property) {
    return false;
  }

  const current = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);

  while (current < end) {
    const isoDate = getLocalDateKey(current);
    if (isDateBlocked(isoDate, property)) {
      return true;
    }

    current.setDate(current.getDate() + 1);
  }

  return false;
}

function syncPickerMonth(referenceDate) {
  const baseDate = referenceDate ? parseLocalDate(referenceDate) : new Date();
  pickerMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
}

function setFormMessage(message) {
  if (!message) {
    bookingFormMessage.textContent = "";
    bookingFormMessage.classList.add("hidden");
    return;
  }

  bookingFormMessage.textContent = message;
  bookingFormMessage.classList.remove("hidden");
}

function updateDateRangeDisplay() {
  if (!bookingCheckin.value && !bookingCheckout.value) {
    dateRangeText.textContent = "Оберіть дати проживання";
    datePickerHint.textContent = "Оберіть дату заїзду, а потім дату виїзду";
    return;
  }

  if (bookingCheckin.value && !bookingCheckout.value) {
    dateRangeText.textContent = `Заїзд: ${formatLongDate(bookingCheckin.value)}`;
    datePickerHint.textContent = "Тепер оберіть дату виїзду";
    return;
  }

  dateRangeText.textContent = `${formatLongDate(bookingCheckin.value)} — ${formatLongDate(bookingCheckout.value)}`;
  datePickerHint.textContent = "Діапазон дат обрано";
}

function openDatePicker() {
  syncPickerMonth(bookingCheckin.value || getTodayKey());
  renderDatePicker();
  if (!datePicker) return;
  datePicker.classList.remove("hidden");
  if (dateRangeTrigger) dateRangeTrigger.setAttribute("aria-expanded", "true");
}

function closeDatePicker() {
  if (!datePicker) return;
  datePicker.classList.add("hidden");
  if (dateRangeTrigger) dateRangeTrigger.setAttribute("aria-expanded", "false");
}

function toggleDatePicker() {
  if (!datePicker) return;
  if (datePicker.classList.contains("hidden")) {
    openDatePicker();
    return;
  }

  closeDatePicker();
}

function renderDatePicker() {
  const firstDay = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth(), 1);
  const lastDay = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 0);
  const offset = (firstDay.getDay() + 6) % 7;
  const property = getSelectedProperty();
  datePickerMonth.textContent = new Intl.DateTimeFormat("uk-UA", { month: "long", year: "numeric" }).format(firstDay);
  datePickerGrid.innerHTML = "";

  for (let index = 0; index < offset; index += 1) {
    const pad = document.createElement("div");
    pad.className = "date-picker__pad";
    datePickerGrid.appendChild(pad);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const current = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth(), day);
    const iso = getLocalDateKey(current);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "date-picker__day";
    button.textContent = String(day);
    button.dataset.dateValue = iso;
    const isBlocked = isDateBlocked(iso, property);

    if (isBlocked) {
      button.classList.add("is-disabled");
      button.disabled = true;
    }

    if (bookingCheckin.value === iso && bookingCheckout.value === iso) {
      button.classList.add("is-single");
    } else if (bookingCheckin.value === iso) {
      button.classList.add("is-start");
    } else if (bookingCheckout.value === iso) {
      button.classList.add("is-end");
    } else if (bookingCheckin.value && bookingCheckout.value && iso > bookingCheckin.value && iso < bookingCheckout.value) {
      button.classList.add("is-in-range");
    }

    datePickerGrid.appendChild(button);
  }
}

function handleDateSelection(isoDate) {
  const property = getSelectedProperty();

  if (isDateBlocked(isoDate, property)) {
    return;
  }

  if (!bookingCheckin.value || (bookingCheckin.value && bookingCheckout.value)) {
    bookingCheckin.value = isoDate;
    bookingCheckout.value = "";
    setFormMessage("");
    updateDateRangeDisplay();
    updateBookingPreview();
    renderDatePicker();
    return;
  }

  if (isoDate <= bookingCheckin.value) {
    bookingCheckin.value = isoDate;
    bookingCheckout.value = "";
    setFormMessage("");
    updateDateRangeDisplay();
    updateBookingPreview();
    renderDatePicker();
    return;
  }

  const nights = getNights(bookingCheckin.value, isoDate);
  if (nights > 10) {
    setFormMessage("Максимальна тривалість одного бронювання становить 10 ночей.");
    return;
  }

  if (rangeIncludesBlockedDates(bookingCheckin.value, isoDate, property)) {
    setFormMessage("У вибраному діапазоні є недоступні дати. Оберіть інший період.");
    return;
  }

  bookingCheckout.value = isoDate;

  setFormMessage("");
  updateDateRangeDisplay();
  updateBookingPreview();
  renderDatePicker();
  closeDatePicker();
}

function validateBookingForm() {
  const name = document.getElementById("booking-name");
  const email = document.getElementById("booking-email");
  const phone = document.getElementById("booking-phone");
  const nights = getNights(bookingCheckin.value, bookingCheckout.value);

  if (!name.value.trim()) {
    setFormMessage("Вкажіть, будь ласка, ваше ім'я.");
    name.focus();
    return false;
  }

  if (!email.value.trim() || !email.checkValidity()) {
    setFormMessage("Вкажіть коректну електронну адресу.");
    email.focus();
    return false;
  }

  if (!phone.value.trim()) {
    setFormMessage("Вкажіть номер телефону для підтвердження бронювання.");
    phone.focus();
    return false;
  }

  if (!bookingCheckin.value || !bookingCheckout.value) {
    setFormMessage("Оберіть дату заїзду та дату виїзду.");
    openDatePicker();
    return false;
  }

  if (!nights || nights < 1 || nights > 10) {
    setFormMessage("Кількість ночей має бути від 1 до 10.");
    bookingNightsInput.focus();
    return false;
  }

  setFormMessage("");
  return true;
}

function validateContactForm() {
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email");
  const reason = document.getElementById("contact-reason").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  if (!name) {
    showToast("Потрібні дані", "Вкажіть ваше ім'я у формі контакту.");
    return false;
  }

  if (!email.value.trim() || !email.checkValidity()) {
    showToast("Потрібні дані", "Вкажіть коректний email у формі контакту.");
    return false;
  }

  if (!reason) {
    showToast("Потрібні дані", "Вкажіть причину звернення у формі контакту.");
    return false;
  }

  if (!message) {
    showToast("Потрібні дані", "Напишіть коротке повідомлення перед відправкою.");
    return false;
  }

  return true;
}

function getStatusClass(status) {
  return status === "Доступне" ? "status-pill--available" : "status-pill--booked";
}

function getBookingStatusMeta(status) {
  const rawStatus = String(status || "").toLowerCase();

  if (rawStatus === "rejected") {
    return {
      code: "completed",
      filterLabel: "Відхилено",
      cardLabel: "Відхилено",
      className: "status-pill--booked"
    };
  }

  if (rawStatus === "new") {
    return {
      code: "new",
      filterLabel: "Нове",
      cardLabel: "Очікує підтвердження",
      className: "status-pill--pending"
    };
  }

  if (rawStatus === "completed") {
    return {
      code: "completed",
      filterLabel: "Завершено",
      cardLabel: "Завершено",
      className: "status-pill--completed"
    };
  }

  if (rawStatus === "cancelled") {
    return {
      code: "completed",
      filterLabel: "Завершено",
      cardLabel: "Скасовано",
      className: "status-pill--booked"
    };
  }

  return {
    code: "confirmed",
    filterLabel: "Підтверджено",
    cardLabel: "Підтверджено",
    className: "status-pill--available"
  };
}

function getBookingStatusCounts() {
  return bookingHistory.reduce((accumulator, booking) => {
    const statusCode = getBookingStatusMeta(booking.status).code;
    accumulator[statusCode] = (accumulator[statusCode] || 0) + 1;
    return accumulator;
  }, { new: 0, confirmed: 0, completed: 0 });
}

function syncActiveBookingStatusFilter() {
  const counts = getBookingStatusCounts();
  if (counts[activeBookingStatusFilter] > 0) {
    return;
  }

  activeBookingStatusFilter = ["new", "confirmed", "completed"].find((statusCode) => counts[statusCode] > 0) || "new";
}

function renderBookingStatusPanel() {
  const counts = getBookingStatusCounts();
  syncActiveBookingStatusFilter();

  document.querySelectorAll("[data-booking-status-filter]").forEach((button) => {
    const statusCode = button.dataset.bookingStatusFilter;
    const label = getBookingStatusMeta(statusCode).filterLabel;
    button.textContent = counts[statusCode] ? `${label} (${counts[statusCode]})` : label;
    button.classList.toggle("is-active", statusCode === activeBookingStatusFilter);
  });

  const visibleBookings = bookingHistory
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => getBookingStatusMeta(item.status).code === activeBookingStatusFilter);

  if (!visibleBookings.length) {
    bookingStatusSummary.innerHTML = `
      <article class="booking-history-empty booking-history-empty--compact">
        <h3>Для цього статусу бронювань немає</h3>
        <p>Спробуйте іншу плашку або створіть нове бронювання.</p>
      </article>
    `;
    return;
  }

  bookingStatusSummary.innerHTML = visibleBookings.map(({ item, idx }) => {
    const statusMeta = getBookingStatusMeta(item.status);

    return `
      <article class="booking-history-card booking-history-card--modern booking-history-card--compact">
        <div class="booking-history-card__header">
          <span class="eyebrow">${item.city}</span>
          <span class="booking-history-card__sum">${item.amount}</span>
        </div>
        <h3 class="booking-history-card__title">${item.property}</h3>
        <div class="booking-history-card__meta">
          <span>Дати: ${item.dates}</span>
        </div>
        <div class="booking-history-card__footer">
          <span class="status-pill ${statusMeta.className}">${statusMeta.cardLabel}</span>
          <button class="secondary-btn booking-details-btn" data-booking-index="${idx}" type="button">Деталі бронювання</button>
        </div>
      </article>
    `;
  }).join("");
}

function canCancelBooking(booking) {
  const statusCode = getBookingStatusMeta(booking?.status).code;
  return statusCode === "new" || statusCode === "confirmed";
}

function isArchivedBooking(booking) {
  const rawStatus = String(booking?.status || "").toLowerCase();
  return rawStatus === "cancelled" || rawStatus === "rejected" || getBookingStatusMeta(booking?.status).code === "completed";
}

function getPaymentStatusMeta(status) {
  const rawStatus = String(status || "").toLowerCase();

  if (["completed", "paid", "success", "оплачено"].includes(rawStatus)) {
    return {
      label: "Оплачено",
      className: "status-pill--available"
    };
  }

  if (["cancelled", "canceled", "скасовано"].includes(rawStatus)) {
    return {
      label: "Скасовано",
      className: "status-pill--booked"
    };
  }

  return {
    label: "Очікується оплата",
    className: "status-pill--pending"
  };
}

function renderDashboardBookingSections(sections, emptyMessage) {
  const visibleSections = sections.filter((section) => section.items.length);
  if (!visibleSections.length) {
    return `<p class="section-note">${emptyMessage}</p>`;
  }

  return `
    <div class="dashboard-booking-sections">
      ${visibleSections.map((section) => `
        <section class="dashboard-booking-group">
          <div class="dashboard-booking-group__header">
            <div>
              <h4>${section.title}</h4>
              ${section.note ? `<p class="section-note">${section.note}</p>` : ""}
            </div>
            <span class="dashboard-booking-group__count">${section.items.length}</span>
          </div>
          <div class="dashboard-booking-list ${section.hostMode ? "dashboard-booking-list--host" : section.archived ? "dashboard-booking-list--archive" : "dashboard-booking-list--guest"}">
            ${section.items.map((booking) => renderDashboardBookingCard(booking, {
              hostMode: section.hostMode,
              archived: section.archived
            })).join("")}
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderDashboardBookingCard(booking, { hostMode = false, archived = false } = {}) {
  const statusMeta = getBookingStatusMeta(booking.status);
  const hasPromoDiscount = Boolean(booking.promoCode && Number(booking.discountPercent || 0) > 0);
  const eyebrow = archived
    ? "Архів бронювань"
    : hostMode
      ? "Заявка гостя"
      : "Моє бронювання";
  const title = hostMode ? booking.guest : booking.property;
  const subtitle = hostMode ? booking.property : booking.city;
  const rejectionHtml = archived && booking.rejectionReason ? `<p class="booking-rejection">Причина відхилення: ${escapeHtml(booking.rejectionReason)}</p>` : "";
  const dateLabel = hostMode ? "Дати" : "Дати проживання";
  const amountLabel = hostMode ? "Сума" : "Вартість";
  const note = archived
    ? "Архівне бронювання доступне лише для перегляду."
    : hostMode
      ? "Керуйте запитом гостя прямо з панелі."
      : "Статус і керування бронюванням доступні тут.";

  let actionButton = '<button class="secondary-btn booking-action-btn booking-details-btn" data-booking-id="' + booking.id + '" type="button">Деталі</button>';
      if (!archived && hostMode) {
        if (statusMeta.code === "new") {
          actionButton += `<button class="primary-btn owner-action-btn" data-owner-booking-action="confirmed" data-owner-booking-id="${booking.id}" type="button">Підтвердити</button>`;
        } else if (statusMeta.code === "confirmed") {
          actionButton += `<button class="secondary-btn owner-action-btn" data-owner-booking-action="completed" data-owner-booking-id="${booking.id}" type="button">Завершити</button>`;
        }
      } else if (!archived && canCancelBooking(booking)) {
        actionButton += `<button class="secondary-btn owner-action-btn" data-cancel-booking-id="${booking.id}" type="button">Скасувати</button>`;
  }

  return `
    <article class="dashboard-booking-card ${archived ? "dashboard-booking-card--archive" : hostMode ? "dashboard-booking-card--host" : "dashboard-booking-card--guest"}">
      <div class="dashboard-booking-card__top">
        <div>
          <span class="dashboard-booking-card__eyebrow">${eyebrow}</span>
          <h4>${title}</h4>
          <p>${subtitle}</p>
          ${rejectionHtml}
          ${hostMode && booking.guestPhone ? `<p class="dashboard-booking-card__guest-phone">${booking.guestPhone}</p>` : ""}
        </div>
        <span class="status-pill ${statusMeta.className}">${statusMeta.cardLabel}</span>
      </div>
      <div class="dashboard-booking-card__meta-grid">
        <div class="dashboard-booking-card__meta-item">
          <span>${dateLabel}</span>
          <strong>${booking.dates}</strong>
        </div>
        <div class="dashboard-booking-card__meta-item">
          <span>${amountLabel}</span>
          <strong>${booking.amount}</strong>
          ${hasPromoDiscount ? `<small>Було: ${booking.originalAmount}</small>` : ""}
        </div>
      </div>
      ${hasPromoDiscount ? `
        <div class="dashboard-booking-card__promo-note">
          <span class="dashboard-booking-card__promo-badge">Промокод ${booking.promoCode}</span>
          <span class="dashboard-booking-card__promo-text">Застосовано знижку ${booking.discountPercent}%.</span>
        </div>
      ` : ""}
      <div class="dashboard-booking-card__footer">
        <span class="dashboard-booking-card__note">${note}</span>
        <div class="table-row__actions">
          ${actionButton}
        </div>
      </div>
    </article>
  `;
}

function getDashboardNotifications(hasManagedProperties) {
  const personalNotifications = appNotifications.map((item) => ({
    title: item.title || "Сповіщення",
    message: item.message || "Нове оновлення у вашому кабінеті.",
    meta: item.relativeTime || "щойно",
    tone: "personal"
  }));

  const dashboardNotifications = notifications.map((item) => ({
    title: hasManagedProperties ? "Оновлення по житлу" : "Системне сповіщення",
    message: item,
    meta: hasManagedProperties ? "Керування об'єктами" : "Кабінет користувача",
    tone: "system"
  }));

  return hasManagedProperties ? [...personalNotifications, ...dashboardNotifications] : personalNotifications;
}

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [...fallback];
  } catch {
    return [...fallback];
  }
}

function saveState() {
  localStorage.setItem("bookme-bookings", JSON.stringify(bookings));
  localStorage.setItem("bookme-payments", JSON.stringify(payments));
  localStorage.setItem("bookme-history", JSON.stringify(bookingHistory));
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Помилка запиту до сервера.");
  }

  return payload;
}

function sameEntityId(left, right) {
  return String(left) === String(right);
}

function canUseDetailChat(user = currentUser) {
  return Boolean(user?.isForeignPhone);
}

function canUseDashboardChatList(user = currentUser) {
  return Boolean(user && (user.role === "owner" || (user.role === "client" && user.isForeignPhone)));
}

function updateChatAccessControls() {
  const allowDetailChat = canUseDetailChat();
  const allowDashboardChatList = canUseDashboardChatList();

  if (openChatButton) {
    openChatButton.classList.toggle("hidden", !allowDetailChat);
  }

  [openChatsBtn, dashboardOpenChatsBtn].forEach((button) => {
    if (button) {
      button.classList.toggle("hidden", !allowDashboardChatList);
    }
  });

  [chatsListCard, dashboardChatsCard].forEach((card) => {
    if (card) {
      card.classList.toggle("hidden", !allowDashboardChatList);
    }
  });

  if (!allowDashboardChatList) {
    if (chatsListContainer) {
      chatsListContainer.innerHTML = "";
    }
    if (dashboardChatsContainer) {
      dashboardChatsContainer.innerHTML = "";
    }
    if (dashboardChatsListCard) {
      dashboardChatsListCard.classList.add("hidden");
    }
    if (dashboardChatRoomCard) {
      dashboardChatRoomCard.classList.add("hidden");
    }
  }
}

function getCurrentPageId() {
  return document.querySelector(".page.active")?.id?.replace(/-page$/, "") || "home";
}

function captureCurrentViewContext() {
  const page = getCurrentPageId();
  return {
    page,
    dashboard: page === "dashboard" ? activeDashboardSection : null
  };
}

function updateDetailsBackButton() {
  if (!detailsBackButton) {
    return;
  }

  detailsBackButton.textContent = detailsBackContext.page === "dashboard"
    ? "Повернутись до кабінету"
    : detailsBackContext.page === "catalog"
      ? "Повернутись до каталогу"
      : "Повернутись назад";
}

function restoreViewContext(context, options = {}) {
  const safeContext = context?.page ? context : { page: "home", dashboard: "overview" };
  showPage(safeContext.page, { ...options, dashboardSection: safeContext.dashboard || activeDashboardSection });
  if (safeContext.page === "dashboard") {
    switchDashboardPage(safeContext.dashboard || "overview", { updateHistory: false });
  }
}

function replaceArrayContents(target, nextItems) {
  target.splice(0, target.length, ...(nextItems || []));
}

function applyRemoteState() {
  renderPropertyCards(featuredGrid, properties.slice(0, 3));
  populateFiltersFromProperties();
  initCustomSelects();
  applyFilters();

  if (properties.length) {
    const hasSelectedProperty = properties.some((property) => sameEntityId(property.id, selectedPropertyId));
    selectedPropertyId = hasSelectedProperty ? selectedPropertyId : properties[0].id;
    renderDetails(selectedPropertyId, false);
  }

  renderOwnerPanel();
  renderBookingStatusPanel();
  renderBookingHistory();
  renderUserAccountProfile();
  updateCabinetButtons();
  renderNotificationsUI();
}

async function refreshAppFromApi() {
  return refreshAppFromApiWithOptions();
}

async function refreshAppFromApiWithOptions(options = {}) {
  const { restoreSession = false } = options;
  const [{ properties: remoteProperties }, bootstrap] = await Promise.all([
    apiRequest("/api/properties"),
    currentUser || restoreSession
      ? apiRequest("/api/bootstrap").catch((error) => {
        if (restoreSession && /Потрібно увійти/i.test(error.message)) {
          return null;
        }

        throw error;
      })
      : Promise.resolve(null)
  ]);

  replaceArrayContents(properties, remoteProperties);

  if (bootstrap) {
    currentUser = bootstrap.user || currentUser;
    isUserAuthenticated = Boolean(currentUser);
    bookings = bootstrap.bookings || [];
    bookingHistory = bootstrap.bookings || [];
    appNotifications = bootstrap.notifications?.items || [];
    unreadNotificationsCount = Number(bootstrap.notifications?.unreadCount || 0);

    if (bootstrap.owner) {
      ownerPropertiesState = bootstrap.owner.properties || [];
      ownerBookingsState = bootstrap.owner.bookings || [];
      payments = bootstrap.owner.payments || [];
      replaceArrayContents(notifications, bootstrap.owner.notifications || []);
      replaceArrayContents(ownerTasks, bootstrap.owner.tasks || []);
      isOwnerLoggedIn = currentUser?.role === "owner";
    } else {
      ownerPropertiesState = [];
      ownerBookingsState = [];
      payments = [];
      replaceArrayContents(notifications, []);
      isOwnerLoggedIn = false;
    }
  } else if (restoreSession) {
    currentUser = null;
    isUserAuthenticated = false;
    isOwnerLoggedIn = false;
  }

  applyRemoteState();

  return bootstrap;
}

function formatDate(isoDate) {
  if (!isoDate) {
    return "";
  }

  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const startStamp = getUtcDayStamp(checkIn);
  const endStamp = getUtcDayStamp(checkOut);
  if (startStamp === null || endStamp === null) {
    return 0;
  }

  const difference = endStamp - startStamp;
  const nights = Math.round(difference / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

function formatMoney(value) {
  return `${Math.round(Number(value || 0))} грн`;
}

function normalizePromocodeInputValue(value) {
  return String(value || "").trim().toUpperCase();
}

function getBookingBaseTotal() {
  const property = properties.find((item) => item.id === selectedPropertyId);
  const nights = getNights(bookingCheckin.value, bookingCheckout.value);
  return property ? Number(property.price || 0) * nights : 0;
}

function getDiscountedBookingTotal(total, discountPercent) {
  const safeTotal = Math.max(Number(total || 0), 0);
  const safeDiscount = Math.min(Math.max(Number(discountPercent || 0), 0), 100);
  return Math.max(0, Math.round(safeTotal * ((100 - safeDiscount) / 100)));
}

function setBookingPromocodeMessage(message, tone = "info") {
  if (!bookingPromocodeMessage) {
    return;
  }

  if (!message) {
    bookingPromocodeMessage.textContent = "";
    bookingPromocodeMessage.className = "promo-code-message hidden";
    return;
  }

  bookingPromocodeMessage.textContent = message;
  bookingPromocodeMessage.className = `promo-code-message promo-code-message--${tone}`;
}

function resetBookingPromocodeState({ clearInput = false, clearMessage = true } = {}) {
  appliedBookingPromocode = null;
  if (clearInput && bookingPromocodeInput) {
    bookingPromocodeInput.value = "";
  }
  if (clearMessage) {
    setBookingPromocodeMessage("");
  }
}

function updateBookingPromocodeVisibility() {
  if (!bookingPromocodeField) {
    return;
  }

  const hasSelectedStay = getNights(bookingCheckin.value, bookingCheckout.value) > 0;
  bookingPromocodeField.classList.toggle("hidden", !hasSelectedStay);

  if (!hasSelectedStay) {
    resetBookingPromocodeState({ clearInput: true, clearMessage: true });
  }
}

function updateBookingPreview() {
  const nightsFromDates = getNights(bookingCheckin.value, bookingCheckout.value);
  const nights = nightsFromDates || 0;
  const baseTotal = getBookingBaseTotal();

  if (nightsFromDates) {
    bookingNightsInput.value = String(nightsFromDates);
  } else {
    bookingNightsInput.value = "";
  }

  updateBookingPromocodeVisibility();

  if (baseTotal && appliedBookingPromocode) {
    const discountedTotal = getDiscountedBookingTotal(baseTotal, appliedBookingPromocode.discountPercent);
    const savingsAmount = Math.max(baseTotal - discountedTotal, 0);
    bookingEstimateInput.value = formatMoney(discountedTotal);
    setBookingPromocodeMessage(
      `Промокод ${appliedBookingPromocode.code} застосовано: -${appliedBookingPromocode.discountPercent}% (${formatMoney(savingsAmount)}). Було ${formatMoney(baseTotal)}.`,
      "success"
    );
    return;
  }

  bookingEstimateInput.value = baseTotal ? formatMoney(baseTotal) : "";

  if (!baseTotal && bookingPromocodeField?.classList.contains("hidden")) {
    setBookingPromocodeMessage("");
  }
}

function renderAvailability(property) {
  const grid = document.getElementById("availability-grid");
  const monthLabel = document.getElementById("availability-month");
  grid.innerHTML = "";
  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthIndex = baseDate.getMonth();
  const year = baseDate.getFullYear();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  monthLabel.textContent = new Intl.DateTimeFormat("uk-UA", { month: "long", year: "numeric" }).format(baseDate);

  for (let dayNumber = baseDate.getDate(); dayNumber <= lastDay; dayNumber += 1) {
    const day = new Date(year, monthIndex, dayNumber);
    const iso = getLocalDateKey(day);
    const chip = document.createElement("div");
    const isBusy = property.unavailableDates.includes(iso);
    chip.className = `availability-day ${isBusy ? "is-busy" : "is-free"}`;
    chip.title = isBusy ? "Заброньовано" : "Доступне";
    chip.innerHTML = `<strong>${String(day.getDate()).padStart(2, "0")}</strong>`;
    grid.appendChild(chip);
  }
}

function renderPropertyCards(target, list, allowDetails = true) {
  target.innerHTML = "";

  list.forEach((property) => {
    const statusClass = getStatusClass(property.status);
    const mainImage = Array.isArray(property.images) && property.images.length ? property.images[0] : property.image;
    const card = document.createElement("article");
    card.className = "property-card";
    card.innerHTML = `
      <div class="property-card__visual" style="background-image: ${mainImage};"></div>
      <div class="property-card__content">
        <div class="property-card__top">
          <h3>${property.title}</h3>
          <p class="property-card__price">${property.price} грн/доба</p>
        </div>
        <div class="property-card__meta">
          <span>${property.city}</span>
          <span>${property.type}</span>
          <span>До ${property.guests} гостей</span>
          <span class="property-card__rating"><span class="property-card__star">★</span> ${property.rating}</span>
        </div>
        <p class="property-card__description">${property.description}</p>
        <div class="property-card__actions">
          <div class="status-inline-list status-inline-list--card">
            <span class="status-pill ${statusClass}">${property.status}</span>
          </div>
          ${allowDetails ? `<button class="primary-btn" data-property-id="${property.id}">Детальніше</button>` : ""}
        </div>
      </div>
    `;
    target.appendChild(card);
  });
}

function renderCatalogEmptyState(message) {
  catalogGrid.innerHTML = `
    <article class="catalog-empty card-block">
      <h3>${message}</h3>
      <p>Оберіть місто, тип житла, кількість гостей або змініть діапазон ціни.</p>
    </article>
  `;
}

function populateFiltersFromProperties() {
  const fallbackCities = catalogCities;
  const propertyCities = [...new Set(properties
    .map((property) => String(property.city || "").trim())
    .filter(Boolean))];
  const orderedKnownCities = fallbackCities.filter((city) => propertyCities.includes(city));
  const additionalCities = propertyCities
    .filter((city) => !fallbackCities.includes(city))
    .sort((left, right) => left.localeCompare(right, "uk"));
  const cities = propertyCities.length ? [...orderedKnownCities, ...additionalCities] : [...fallbackCities];
  // Use fixed guest buckets to match previous UX: До 2, До 4, До 6
  const fixedGuestBuckets = [2, 4, 6];
  const prices = properties
    .map((property) => Number(property.price))
    .filter((value) => Number.isFinite(value) && value > 0);
  const minPrice = prices.length ? Math.min(...prices) : 1900;
  const maxPrice = prices.length ? Math.max(...prices) : 6000;
  const effectiveMaxPrice = Math.max(maxPrice, minPrice + 100);
  const currentCity = filterCity.value;
  const currentGuests = filterGuests.value;
  const currentPrice = Number(filterPrice.value || effectiveMaxPrice);

  filterCity.querySelectorAll('option:not([value="all"])').forEach((option) => option.remove());
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    filterCity.appendChild(option);
  });

  filterGuests.querySelectorAll('option:not([value="0"])').forEach((option) => option.remove());
  // Build guest options as upper-bound buckets ("До X") and an extra "Від 6" bucket
  const guestBuckets = fixedGuestBuckets;
  guestBuckets.forEach((guestCount) => {
    const option = document.createElement("option");
    option.value = `lte_${guestCount}`;
    option.textContent = `До ${guestCount}`;
    filterGuests.appendChild(option);
  });
  // Add a 'from 6' option to show properties for larger groups (>= 6)
  if (![...filterGuests.options].some((o) => o.value === "gte_6")) {
    const option = document.createElement("option");
    option.value = "gte_6";
    option.textContent = "Від 6";
    filterGuests.appendChild(option);
  }

  filterPrice.min = String(minPrice);
  filterPrice.max = String(effectiveMaxPrice);
  filterPrice.step = "100";

  const clampedPrice = Math.min(Math.max(Number.isFinite(currentPrice) ? currentPrice : effectiveMaxPrice, minPrice), effectiveMaxPrice);
  const nextPriceValue = hasTouchedPriceFilter ? clampedPrice : effectiveMaxPrice;
  filterPrice.value = String(nextPriceValue);
  filterPriceValue.textContent = `${nextPriceValue} грн`;

  if (!cities.includes(currentCity)) {
    filterCity.value = "all";
  } else {
    filterCity.value = currentCity;
  }

  const validGuestValues = ["0", ...((guestBuckets).map((c) => `lte_${c}`)), "gte_6"];
  if (!validGuestValues.includes(currentGuests)) {
    filterGuests.value = "0";
  } else {
    filterGuests.value = currentGuests;
  }

  createCustomSelect(filterCity);
  createCustomSelect(filterGuests);
}

function applyFilters() {
  const city = filterCity.value;
  const type = filterType.value;
  const guestsRaw = String(filterGuests.value || "0");
  const guests = (() => {
    if (guestsRaw === "0") return 0;
    if (guestsRaw.startsWith("lte_")) return guestsRaw; // marker for <=
    if (guestsRaw.startsWith("gte_")) return guestsRaw; // marker for >=
    const n = Number(guestsRaw);
    return Number.isFinite(n) ? n : 0;
  })();
  const roundedPrice = Math.round(Number(filterPrice.value) / 100) * 100;
  filterPrice.value = String(roundedPrice);
  const maxPrice = roundedPrice;
  const minPrice = Number(filterPrice.min);
  const maxPriceLimit = Number(filterPrice.max);
  const ratio = (maxPrice - minPrice) / (maxPriceLimit - minPrice || 1);
  const thumbSize = Number.parseFloat(getComputedStyle(filterPrice).getPropertyValue("--thumb-size")) || 24;
  const trackWidth = filterPrice.clientWidth;
  const usableTrack = Math.max(trackWidth - thumbSize, 1);
  const thumbCenter = thumbSize / 2 + ratio * usableTrack;
  const progress = (thumbCenter / Math.max(trackWidth, 1)) * 100;

  filterPrice.style.setProperty("--range-progress", `${progress}%`);

  filterPriceValue.textContent = `${maxPrice} грн`;
  const hasPriceFilter = hasTouchedPriceFilter;

  const hasGuestsFilter = guestsRaw !== "0";
  const hasActiveFilters = city !== "all" || type !== "all" || hasGuestsFilter || hasPriceFilter;

  const filtered = properties.filter((property) => {
    const cityMatch = city === "all" || property.city === city;
    const typeMatch = type === "all" || property.type === type;
    let guestMatch = true;
    if (guests === 0) {
      guestMatch = true;
    } else if (typeof guests === "string" && guests.startsWith("lte_")) {
      const n = Number(guests.split("_")[1] || 0);
      // 'До N' now matches strictly equal to N (===) per user's request
      guestMatch = Number(property.guests) === n;
    } else if (typeof guests === "string" && guests.startsWith("gte_")) {
      const n = Number(guests.split("_")[1] || 0);
      // 'Від N' should show properties that can host more than N people (strictly greater)
      guestMatch = Number(property.guests) > n;
    } else {
      guestMatch = Number(property.guests) >= Number(guests);
    }
    const priceMatch = hasPriceFilter ? property.price === maxPrice : true;
    return cityMatch && typeMatch && guestMatch && priceMatch;
  });

  if (!hasActiveFilters) {
    renderPropertyCards(catalogGrid, filtered);
  } else if (filtered.length === 0) {
    renderCatalogEmptyState("За цими фільтрами житла не знайдено");
  } else {
    renderPropertyCards(catalogGrid, filtered);
  }

  catalogCount.textContent = `${filtered.length} об'єктів`;
}

function resetFilters() {
  if (filterCity) filterCity.value = "all";
  if (filterType) filterType.value = "all";
  if (filterGuests) filterGuests.value = "0";
  if (filterPrice) {
    filterPrice.value = filterPrice.max || filterPrice.value;
    hasTouchedPriceFilter = false;
    filterPriceValue.textContent = `${filterPrice.value} грн`;
  }

  // Rebuild custom selects so the visual state reflects cleared values
  try {
    [filterCity, filterType, filterGuests].forEach((s) => {
      if (s) createCustomSelect(s);
    });
  } catch (e) {
    // ignore
  }

  closeCustomSelects();
  applyFilters();
}

function showPage(pageId, options = {}) {
  const { updateHistory = true, dashboardSection = null } = options;

  if (!isUserAuthenticated) {
    openAuthGate();
    return;
  }

  if (pageId === "cabinet") {
    showPage("dashboard", options);
    return;
  }

  const targetId = `${pageId}-page`;

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === targetId);
  });

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.pageLink === pageId);
  });

  if (pageId === "dashboard") {
    switchDashboardPage(dashboardSection || activeDashboardSection, { updateHistory: false });
  }

  if (pageId === "dashboard" && shouldOpenProfileEditorAfterAccountNavigation) {
    shouldOpenProfileEditorAfterAccountNavigation = false;
    openProfileEditModal();
  }

  if (updateHistory && window.history) {
    const nextState = {
      page: pageId,
      dashboard: pageId === "dashboard" ? (dashboardSection || activeDashboardSection) : null
    };

    if (window.history.state?.page !== nextState.page || window.history.state?.dashboard !== nextState.dashboard) {
      window.history.pushState(nextState, "", `#${pageId}`);
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderNotificationsUI() {
  if (!notificationDot || !notificationsMarkReadButton || !notificationsList) return;

  notificationDot.classList.toggle("hidden", unreadNotificationsCount === 0);
  notificationsMarkReadButton.disabled = unreadNotificationsCount === 0;

  if (!appNotifications.length) {
    notificationsList.innerHTML = '<div class="notification-empty">Наразі немає сповіщень.</div>';
    return;
  }

  notificationsList.innerHTML = appNotifications.map((item) => `
    <article class="notification-item">
      <strong class="notification-item__title">${item.title}</strong>
      <span>${item.message}</span>
      <span class="notification-item__time">${item.relativeTime || "щойно"}</span>
    </article>
  `).join("");
}

function toggleNotificationsPopover() {
  if (!notificationPopover || !notificationButton) return;
  const isHidden = notificationPopover.classList.contains("hidden");
  notificationPopover.classList.toggle("hidden", !isHidden);
  notificationButton.setAttribute("aria-expanded", String(isHidden));
}

function closeNotificationsPopover() {
  if (!notificationPopover || !notificationButton) return;
  notificationPopover.classList.add("hidden");
  notificationButton.setAttribute("aria-expanded", "false");
}

async function markNotificationsAsRead() {
  if (!unreadNotificationsCount) {
    return;
  }

  try {
    const payload = await apiRequest("/api/notifications/read-all", { method: "POST" });
    appNotifications = payload.items || [];
    unreadNotificationsCount = Number(payload.unreadCount || 0);
    renderNotificationsUI();
  } catch (error) {
    showToast("Не вдалося оновити", error.message);
  }
}

function renderDetails(propertyId, navigate = true) {
  const property = properties.find((item) => sameEntityId(item.id, propertyId));
  if (!property) {
    return;
  }

  selectedPropertyId = property.id;
  document.getElementById("details-title").textContent = property.title;
  document.getElementById("details-price").textContent = `${property.price} грн / доба`;
  // Уникати дублювання міста в характеристиках житла
  let addressMeta = property.address || "";
  // Якщо address вже містить місто, не дублювати
  if (addressMeta.trim().toLowerCase().startsWith(property.city.trim().toLowerCase())) {
    addressMeta = addressMeta;
  } else {
    addressMeta = `${property.city}, ${addressMeta}`;
  }
  document.getElementById("details-meta").textContent = `${addressMeta} · ${property.type} · до ${property.guests} гостей`;
  detailsCheckTimes.textContent = `Заїзд: ${property.checkInTime || "14:00"} · Виїзд: ${property.checkOutTime || "11:00"}`;
  document.getElementById("details-description").textContent = property.description;
  renderDetailsGallery(getPropertyGalleryImages(property), 0);
  detailsMapCaption.textContent = `${property.city}, ${property.address}`;

  const mapQuery = encodeURIComponent(`${property.city}, ${property.address}, ${property.title}`);
  detailsMap.src = `https://www.google.com/maps?q=${mapQuery}&hl=uk&z=14&output=embed`;

  const list = document.getElementById("details-amenities");
  list.innerHTML = "";
  property.amenities.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  bookingCheckin.value = "";
  bookingCheckout.value = "";
  resetBookingPromocodeState({ clearInput: true, clearMessage: true });
  syncPickerMonth(getTodayKey());
  setFormMessage("");
  renderAvailability(property);
  updateDateRangeDisplay();
  renderDatePicker();
  updateBookingPreview();
  updateChatAccessControls();

  if (navigate) {
    const currentContext = captureCurrentViewContext();
    if (currentContext.page !== "details") {
      detailsBackContext = currentContext;
      updateDetailsBackButton();
    }
    showPage("details");
  }
}

function openChatProperty(propertyId) {
  if (!propertyId) {
    return;
  }

  renderDetails(propertyId);
}

function renderBookingHistory() {
  const historyEl = document.getElementById("booking-history");
  if (!historyEl) {
    return;
  }

  const visibleBookings = bookingHistory
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => getBookingStatusMeta(item.status).code === activeBookingStatusFilter);

  if (!visibleBookings.length) {
    historyEl.innerHTML = `
      <article class="booking-history-empty card-block">
        <h3>Для цього статусу бронювань немає</h3>
        <p>Спробуйте іншу плашку зверху або створіть нове бронювання.</p>
      </article>
    `;
    return;
  }

  historyEl.innerHTML = visibleBookings.map(({ item, idx }) => {
    const statusMeta = getBookingStatusMeta(item.status);

    return `
      <article class="booking-history-card booking-history-card--modern">
        <div class="booking-history-card__header">
          <span class="eyebrow">${item.city}</span>
          <span class="booking-history-card__sum">${item.amount}</span>
        </div>
        <h3 class="booking-history-card__title">${item.property}</h3>
        <div class="booking-history-card__meta">
          <span>Дати: ${item.dates}</span>
        </div>
        <div class="booking-history-card__footer">
          <span class="status-pill ${statusMeta.className}">${statusMeta.cardLabel}</span>
          <button class="secondary-btn booking-details-btn" data-booking-index="${idx}" type="button">Деталі бронювання</button>
        </div>
      </article>
    `;
  }).join("");
}

function syncBookingFormWithCurrentUser() {
  const bookingNameInput = document.getElementById("booking-name");
  const bookingEmailInput = document.getElementById("booking-email");
  const bookingPhoneInput = document.getElementById("booking-phone");

  if (!currentUser) {
    bookingNameInput.value = "";
    bookingEmailInput.value = "";
    bookingPhoneInput.value = "";
    return;
  }

  bookingNameInput.value = currentUser.name || "";
  bookingEmailInput.value = currentUser.email || "";
  bookingPhoneInput.value = getUserPhoneMeta(currentUser).fullPhone;
}

function renderUserAccountProfile() {
  const profileName = document.getElementById("profile-name");
  const profileLastName = document.getElementById("profile-last-name");
  const profileEmail = document.getElementById("profile-email");
  const profilePhone = document.getElementById("profile-phone");
  const profileBookings = document.getElementById("profile-bookings");
  const dashboardProfileName = document.getElementById("dashboard-profile-name");
  const dashboardProfileLastName = document.getElementById("dashboard-profile-last-name");
  const dashboardProfileEmail = document.getElementById("dashboard-profile-email");
  const dashboardProfilePhone = document.getElementById("dashboard-profile-phone");
  const dashboardProfileBookings = document.getElementById("dashboard-profile-bookings");
  const accountTitle = document.getElementById("account-title");
  const accountSubtitle = document.getElementById("account-subtitle");
  const phoneMeta = getUserPhoneMeta(currentUser);

  if (!currentUser) {
    profileName.textContent = "-";
    profileLastName.textContent = "Не вказано";
    profileEmail.textContent = "-";
    profilePhone.textContent = "Не вказано";
    profileBookings.textContent = "0";
    dashboardProfileName.textContent = "-";
    dashboardProfileLastName.textContent = "Не вказано";
    dashboardProfileEmail.textContent = "-";
    dashboardProfilePhone.textContent = "Не вказано";
    dashboardProfileBookings.textContent = "0";
    accountTitle.textContent = "Мій профіль та бронювання";
    accountSubtitle.textContent = "Історія активних, майбутніх і завершених замовлень користувача.";
    foreignPhoneNote.classList.add("hidden");
    foreignPhoneNote.textContent = "";
    syncBookingFormWithCurrentUser();
    return;
  }

  profileName.textContent = currentUser.name || "-";
  profileLastName.textContent = getUserSurname(currentUser) || "Не вказано";
  profileEmail.textContent = currentUser.email || "-";
  profilePhone.textContent = currentUser.phone || "Не вказано";
  profileBookings.textContent = String(bookingHistory.filter((booking) => canCancelBooking(booking)).length);
  dashboardProfileName.textContent = currentUser.name || "-";
  dashboardProfileLastName.textContent = getUserSurname(currentUser) || "Не вказано";
  dashboardProfileEmail.textContent = currentUser.email || "-";
  dashboardProfilePhone.textContent = currentUser.phone || "Не вказано";
  dashboardProfileBookings.textContent = String(bookingHistory.filter((booking) => canCancelBooking(booking)).length);

  const isForeignPhone = Boolean(currentUser.isForeignPhone ?? phoneMeta.isForeignPhone);
  foreignPhoneNote.classList.toggle("hidden", !isForeignPhone);
  if (isForeignPhone) {
    foreignPhoneNote.textContent = localForeignMessage(phoneMeta.countryCode || "+380");
  }

  accountTitle.textContent = "Мій профіль та бронювання";
  accountSubtitle.textContent = "Історія активних, майбутніх і завершених замовлень користувача.";

  syncBookingFormWithCurrentUser();
  updateChatAccessControls();
}

function updateCabinetButtons() {
  const cabinetPage = "dashboard";
  const cabinetLabel = "Особистий кабінет";

  [cabinetNavButton, heroCabinetButton].forEach((button) => {
    if (!button) {
      return;
    }

    button.dataset.pageLink = cabinetPage;
    button.textContent = cabinetLabel;
  });
}

function clearOwnerPropertyMessage() {
  ownerPropertyMessage.textContent = "";
  ownerPropertyMessage.classList.add("hidden");
}

function showOwnerPropertyMessage(message) {
  ownerPropertyMessage.textContent = message;
  ownerPropertyMessage.classList.remove("hidden");
}

function validateOwnerPropertyForm() {
  const fields = [
    { element: document.getElementById("owner-property-title"), label: "Назва житла" },
    { element: document.getElementById("owner-property-city"), label: "Місто" },
    { element: ownerPropertyTypeSelect, label: "Тип житла" },
    { element: document.getElementById("owner-property-guests"), label: "Кількість гостей" },
    { element: document.getElementById("owner-property-price"), label: "Ціна за добу" },
    { element: document.getElementById("owner-property-address"), label: "Адреса" },
    { element: document.getElementById("owner-property-description"), label: "Опис житла" }
  ];

  for (const field of fields) {
    const value = String(field.element?.value || "").trim();
    const isNumericField = field.element?.type === "number";
    const isMissing = isNumericField ? !value || Number(value) <= 0 : !value;

    if (isMissing) {
      showOwnerPropertyMessage(`Заповніть поле: ${field.label}`);
      field.element?.focus();
      return false;
    }
  }

  if (!ownerPropertyImages.length) {
    showOwnerPropertyMessage("Додайте хоча б одне фото житла.");
    ownerPropertyImageInput?.focus();
    return false;
  }

  return true;
}

function clearProfileEditMessage() {
  profileEditMessage.textContent = "";
  profileEditMessage.classList.add("hidden");
}

function showProfileEditMessage(message) {
  profileEditMessage.textContent = message;
  profileEditMessage.classList.remove("hidden");
}

function openProfilePromptModal() {
  profilePromptModal.classList.remove("hidden");
  syncModalScrollLock();
}

function closeProfilePromptModal() {
  profilePromptModal.classList.add("hidden");
  syncModalScrollLock();
}

function openProfileEditModal() {
  if (!currentUser) {
    return;
  }

  document.getElementById("profile-edit-name").value = currentUser.name || "";
  document.getElementById("profile-edit-last-name").value = getUserSurname(currentUser);
  const phoneMeta = getUserPhoneMeta(currentUser);
  const currentCode = phoneMeta.countryCode || "+380";
  const option = profileCountryMenu.querySelector(`.country-picker__option[data-code="${currentCode}"]`);
  const label = option?.dataset.label || `UA ${currentCode}`;
  const flag = option?.dataset.flag || "ua";
  updateCountryPickerVisual(currentCode, label, flag);
  profilePhoneInput.value = formatPhoneByCountry(currentCode, phoneMeta.nationalNumber || "");
  clearProfileEditMessage();
  profileEditModal.classList.remove("hidden");
  syncModalScrollLock();
}

function closeProfileEditModal() {
  profileEditModal.classList.add("hidden");
  syncModalScrollLock();
  clearProfileEditMessage();
}

function redirectToProfileCompletion() {
  closeProfilePromptModal();
  shouldOpenProfileEditorAfterAccountNavigation = true;
  showPage("dashboard");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderChatMessages(messages, targetBox = chatBox) {
  if (!messages.length) {
    targetBox.innerHTML = '<p class="section-note chat-empty-state">Поки що немає повідомлень.</p>';
    return;
  }

  targetBox.innerHTML = messages.map((item) => {
    const isOwnMessage = item.senderRole === currentUser.role;
    const statusIcon = item.isRead ? "✓✓" : "✓";
    const timeText = item.relativeTime || "щойно";
    
    return `
      <div class="chat-message chat-message--${isOwnMessage ? "own" : "other"}">
        <strong>${escapeHtml(item.senderName || "Користувач")}</strong>
        <p>${escapeHtml(item.message || "")}</p>
        <div class="chat-message__footer">
          <span class="chat-message__time">${timeText}</span>
          ${item.isEdited ? '<span class="chat-message__edited"><em>Відредаговано</em></span>' : ""}
          ${isOwnMessage ? `<span class="chat-message__status">${statusIcon}</span>` : ""}
          ${isOwnMessage ? `<button type="button" class="chat-message__delete" data-message-id="${item.id}" aria-label="Видалити">✕</button>` : '' }
          ${isOwnMessage ? `<button type="button" class="chat-message__edit" data-message-id="${item.id}" data-message-text="${escapeHtml(item.message || "")}" aria-label="Редагувати">✎</button>` : ''}
        </div>
      </div>
    `;
  }).join("");

  targetBox.scrollTop = targetBox.scrollHeight;
}

function openChatModal() {
  if (!selectedPropertyId || !canUseDetailChat()) {
    return;
  }

  activeChatView = "modal";
  activeChatPropertyId = selectedPropertyId;
  selectedChatUserId = "";
  chatThreadWrap.classList.toggle("hidden", currentUser?.role !== "owner");
  document.body.classList.add("chat-modal-open");
  chatModal.classList.remove("hidden");
  syncModalScrollLock();
  loadChatMessages();
}

function closeChatModal() {
  document.body.classList.remove("chat-modal-open");
  chatModal.classList.add("hidden");
  syncModalScrollLock();
  activeChatPropertyId = null;
  selectedChatUserId = "";
  chatBox.innerHTML = "";
}

function openDashboardChatRoom() {
  if (!dashboardChatsListCard || !dashboardChatRoomCard) {
    return;
  }

  activeChatView = "dashboard";
  dashboardChatsListCard.classList.add("hidden");
  dashboardChatRoomCard.classList.remove("hidden");
  // Hide per-user selector and owner status in dashboard simplified view
  if (dashboardChatThreadWrap) {
    dashboardChatThreadWrap.classList.add("hidden");
  }
  if (dashboardChatOwnerStatus) {
    dashboardChatOwnerStatus.classList.add("hidden");
  }
}

function closeDashboardChatRoom() {
  if (!dashboardChatsListCard || !dashboardChatRoomCard) {
    return;
  }

  activeChatView = "dashboard";
  dashboardChatRoomCard.classList.add("hidden");
  dashboardChatsListCard.classList.remove("hidden");
  activeChatPropertyId = null;
  selectedChatUserId = "";
  if (dashboardChatPropertyHint) {
    dashboardChatPropertyHint.classList.add("hidden");
  }
  if (dashboardChatBox) {
    dashboardChatBox.innerHTML = "";
  }
}

function getActiveChatUi() {
  if (activeChatView === "dashboard") {
    return {
      ownerStatusEl: dashboardChatOwnerStatus,
      threadWrapEl: dashboardChatThreadWrap,
      threadSelectEl: dashboardChatThreadSelect,
      chatBoxEl: dashboardChatBox,
      chatFormEl: dashboardChatForm,
      chatInputEl: dashboardChatInput,
      modalTitleEl: dashboardChatRoomTitle
    };
  }

  return {
    ownerStatusEl: chatOwnerStatus,
    threadWrapEl: chatThreadWrap,
    threadSelectEl: chatThreadSelect,
    chatBoxEl: chatBox,
    chatFormEl: chatForm,
    chatInputEl: chatInput,
    modalTitleEl: chatModalTitle
  };
}

async function loadChatMessages() {
  if (!activeChatPropertyId) {
    return;
  }

  const ui = getActiveChatUi();
  const { ownerStatusEl, threadWrapEl, threadSelectEl, chatBoxEl } = ui;
  
  // On dashboard, always hide the selector. In modal, show if owner.
  if (threadWrapEl) {
    if (activeChatView === "dashboard") {
      threadWrapEl.classList.add("hidden");
    } else {
      threadWrapEl.classList.toggle("hidden", currentUser?.role !== "owner");
    }
  }

  // For owner view, fetch threads first (without userId) so we always have the thread list.
  const query = currentUser?.role === "owner" ? "" : (selectedChatUserId ? `?userId=${encodeURIComponent(selectedChatUserId)}` : "");
  const payload = await apiRequest(`/api/chat/${encodeURIComponent(activeChatPropertyId)}${query}`);
  if (ownerStatusEl) {
    ownerStatusEl.textContent = payload.ownerStatus || "";
  }

  if (currentUser?.role === "owner") {
    const threads = payload.threads || [];
    if (threads.length) {
      if (threadSelectEl) {
        threadSelectEl.innerHTML = threads.map((thread) => `<option value="${thread.userId}">${thread.userName} · ${thread.relativeTime}</option>`).join("");
      }
      const hasSelectedThread = threads.some((thread) => String(thread.userId) === String(selectedChatUserId));
      if (!selectedChatUserId || !hasSelectedThread) {
        selectedChatUserId = threads[0].userId;
      }
      if (threadSelectEl) {
        threadSelectEl.value = selectedChatUserId;
        // On dashboard always hide, in modal hide only if 1 thread
        if (threadWrapEl) {
          if (activeChatView === "dashboard") {
            threadWrapEl.classList.add("hidden");
          } else {
            threadWrapEl.classList.toggle("hidden", threads.length <= 1);
          }
        }
      }

      if (!payload.messages.length) {
        const threadPayload = await apiRequest(`/api/chat/${encodeURIComponent(activeChatPropertyId)}?userId=${encodeURIComponent(selectedChatUserId)}`);
        renderChatMessages(threadPayload.messages || [], chatBoxEl);
      } else {
        renderChatMessages(payload.messages || [], chatBoxEl);
      }
    } else {
      if (threadSelectEl) {
        threadSelectEl.innerHTML = "";
      }
      renderChatMessages([], chatBoxEl);
    }
    return;
  }

  renderChatMessages(payload.messages || [], chatBoxEl);
}

async function loadAndShowUserChats() {
  const targetCard = dashboardChatsCard || chatsListCard;
  const targetContainer = dashboardChatsContainer || chatsListContainer;
  if (!canUseDashboardChatList()) {
    if (targetCard) {
      targetCard.classList.add("hidden");
    }
    if (targetContainer) {
      targetContainer.innerHTML = "";
    }
    return;
  }

  activeChatView = "dashboard";
  if (dashboardChatRoomCard) {
    dashboardChatRoomCard.classList.add("hidden");
  }
  if (dashboardChatsListCard) {
    dashboardChatsListCard.classList.remove("hidden");
  }

  try {
    const payload = await apiRequest("/api/user-chats");
    const chats = payload.chats || [];

    if (!chats.length) {
      targetContainer.innerHTML = '<p class="section-note">Немає активних чатів</p>';
      targetCard.classList.remove("hidden");
      return;
    }

    targetContainer.innerHTML = chats.map((chat) => `
      <div class="chat-list-item" role="button" tabindex="0" data-property-id="${escapeHtml(chat.propertyId)}" data-user-id="${escapeHtml(chat.userId)}" data-property-exists="${chat.propertyExists !== false}">
        <button type="button" class="chat-list-item__title" data-property-id="${escapeHtml(chat.propertyId)}" data-property-exists="${chat.propertyExists !== false}" aria-label="Відкрити оголошення ${escapeHtml(chat.propertyTitle || "")} ">
          ${escapeHtml(chat.propertyTitle)}
        </button>
        <span>${escapeHtml(chat.ownerName)}</span>
        <p>${escapeHtml(chat.lastMessage)}</p>
        <small>${escapeHtml(chat.relativeTime)}</small>
      </div>
    `).join("");

    targetCard.classList.remove("hidden");
  } catch (err) {
    showToast("Чати", err.message || "Не вдалося завантажити список чатів");
  }
}

function showToast(title, message) {
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-message").textContent = message;
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function showAuthMessage(target, message) {
  target.textContent = message;
  target.classList.remove("hidden");
}

function clearAuthMessages() {
  authLoginMessage.textContent = "";
  authRegisterMessage.textContent = "";
  authLoginMessage.classList.add("hidden");
  authRegisterMessage.classList.add("hidden");
}

function openAuthGate() {
  authGate.classList.remove("hidden");
  siteShell.classList.add("hidden");
}

function closeAuthGate() {
  authGate.classList.add("hidden");
  siteShell.classList.remove("hidden");
}

function switchAuthTab(tab) {
  const loginTabActive = tab === "login";
  authTabLogin.classList.toggle("active", loginTabActive);
  authTabRegister.classList.toggle("active", !loginTabActive);
  authTabLogin.setAttribute("aria-selected", String(loginTabActive));
  authTabRegister.setAttribute("aria-selected", String(!loginTabActive));
  authLoginForm.classList.toggle("hidden", !loginTabActive);
  authRegisterForm.classList.toggle("hidden", loginTabActive);
  clearAuthMessages();
}

function syncPasswordToggleVisibilityFor(input) {
  const field = input.closest(".password-field");
  if (!field) {
    return;
  }

  field.classList.toggle("has-value", input.value.length > 0);
}

function initPasswordToggleVisibility() {
  document.querySelectorAll(".password-toggle").forEach((toggleButton) => {
    const input = document.getElementById(toggleButton.dataset.togglePassword);
    if (!input) {
      return;
    }

    const sync = () => syncPasswordToggleVisibilityFor(input);
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    sync();
  });
}

async function completeAuth(user, successMessage) {
  const needsProfileCompletion = !isProfileComplete(user);
  currentUser = user;
  isUserAuthenticated = true;
  isOwnerLoggedIn = user.role === "owner";
  updateCabinetButtons();
  await refreshAppFromApi();
  closeAuthGate();
  showPage("home");
  showToast("Успішно", successMessage);

  if (needsProfileCompletion) {
    openProfilePromptModal();
  }
}

function initializeAuthGate() {
  currentUser = null;
  isUserAuthenticated = false;
  isOwnerLoggedIn = false;
  hasTouchedPriceFilter = false;
  shouldOpenProfileEditorAfterAccountNavigation = false;
  appNotifications = [];
  unreadNotificationsCount = 0;
  ownerPropertiesState = [];
  ownerBookingsState = [];
  activeDashboardSection = "overview";
  detailsBackContext = { page: "home", dashboard: "overview" };
  updateCabinetButtons();
  updateDetailsBackButton();
  renderUserAccountProfile();
  syncBookingFormWithCurrentUser();
  closeProfilePromptModal();
  closeProfileEditModal();
  renderNotificationsUI();
  closeNotificationsPopover();
  closeChatModal();
  switchDashboardPage("overview");
  openAuthGate();
  switchAuthTab("login");
}

async function handleLogout() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignore server logout errors and still reset client state.
  }

  currentUser = null;
  isOwnerLoggedIn = false;
  initializeAuthGate();
  showToast("Вихід", "Ви вийшли з акаунта.");
}

function openModal() {
  document.getElementById("auth-modal").classList.remove("hidden");
  syncModalScrollLock();
}

function closeModal() {
  document.getElementById("auth-modal").classList.add("hidden");
  syncModalScrollLock();
}

function renderOwnerPanel() {
  const hasManagedProperties = ownerPropertiesState.length > 0;
  const overviewMetrics = document.getElementById("dashboard-metrics");
  const overviewGrid = document.getElementById("dashboard-overview-grid");
  const paymentsLink = document.getElementById("dashboard-payments-link");
  const overviewMetricCards = document.querySelectorAll("#dashboard-metrics .metric-card");
  const systemStateCard = document.getElementById("dashboard-system-state-card");
  const tasksCard = document.getElementById("dashboard-tasks-card");
  const propertiesFormTitle = document.getElementById("dashboard-properties-form-title");
  const propertiesFormNote = document.getElementById("dashboard-properties-form-note");
  const propertiesListTitle = document.getElementById("dashboard-properties-list-title");
  const bookingsTitle = document.getElementById("dashboard-bookings-title");
  const bookingsNote = document.getElementById("dashboard-bookings-note");
  const bookingsBadge = document.getElementById("dashboard-bookings-badge");
  const bookingsCard = document.getElementById("dashboard-bookings-card");
  const bookingsArchive = document.getElementById("dashboard-bookings-archive");
  const archiveTitle = document.getElementById("dashboard-bookings-archive-title");
  const archiveNote = document.getElementById("dashboard-bookings-archive-note");
  const archiveBadge = document.getElementById("dashboard-bookings-archive-badge");
  const hostBookings = hasManagedProperties ? ownerBookingsState : [];
  const guestBookings = bookingHistory;
  const activeHostBookings = hostBookings.filter((booking) => !isArchivedBooking(booking));
  const archivedHostBookings = hostBookings.filter((booking) => isArchivedBooking(booking));
  const activeGuestBookings = guestBookings.filter((booking) => !isArchivedBooking(booking));
  const archivedGuestBookings = guestBookings.filter((booking) => isArchivedBooking(booking));
  const activeBookingCount = hasManagedProperties
    ? activeHostBookings.length + activeGuestBookings.length
    : activeGuestBookings.length;
  const pendingPaymentsCount = payments.filter((payment) => getPaymentStatusMeta(payment.status).label === "Очікується оплата").length;
  const newHostBookingsCount = activeHostBookings.filter((booking) => getBookingStatusMeta(booking.status).code === "new").length;
  const cancelledHostBookingsCount = archivedHostBookings.filter((booking) => String(booking.status || "").toLowerCase() === "cancelled").length;

  overviewMetrics.classList.toggle("hidden", !hasManagedProperties);
  overviewGrid.classList.toggle("hidden", !hasManagedProperties);
  paymentsLink.classList.toggle("hidden", !hasManagedProperties);

  if (!hasManagedProperties && document.querySelector("#dash-payments.active")) {
    switchDashboardPage("overview");
  }

  if (hasManagedProperties) {
    overviewMetricCards[0].querySelector("span").textContent = "Активні бронювання";
    overviewMetricCards[0].querySelector("strong").textContent = String(activeBookingCount);
    overviewMetricCards[1].querySelector("span").textContent = "Об'єкти в системі";
    overviewMetricCards[1].querySelector("strong").textContent = String(ownerPropertiesState.length);

    systemStateCard.innerHTML = `
      <h3>Стан системи</h3>
      <p>Зараз у вас ${ownerPropertiesState.length} об'єктів, ${activeHostBookings.length} активних заявок гостей, ${archivedHostBookings.length} записів в архіві та ${payments.length} оплат у системі.</p>
      <p class="section-note">Тут зведено головні цифри по кабінету без зайвого третього індикатора.</p>
    `;

    tasksCard.querySelector("h3").textContent = "Що потребує уваги";
  }

  propertiesFormTitle.textContent = hasManagedProperties ? "Опублікувати житло" : "Додати житло для оренди";
  propertiesFormNote.textContent = hasManagedProperties
    ? "Додайте новий об'єкт, щоб він одразу з'явився в каталозі."
    : "Додайте власний об'єкт, якщо хочете здавати його в оренду через платформу.";
  propertiesListTitle.textContent = "Ваші об'єкти нерухомості";
  bookingsTitle.textContent = hasManagedProperties ? "Бронювання ваших об'єктів" : "Ваші бронювання";
  bookingsNote.textContent = hasManagedProperties
    ? "Тут окремо зібрані заявки гостей на ваші об'єкти та ваші особисті бронювання як користувача."
    : "Тут зібрані лише актуальні бронювання. Завершені та скасовані доступні окремо в архіві бронювань.";
  bookingsBadge.textContent = hasManagedProperties ? "Режим орендодавця" : "Режим гостя";
  bookingsBadge.className = `dashboard-context-badge ${hasManagedProperties ? "dashboard-context-badge--host" : "dashboard-context-badge--guest"}`;
  bookingsCard.className = `card-block ${hasManagedProperties ? "dashboard-bookings-card--host" : "dashboard-bookings-card--guest"}`;
  archiveTitle.textContent = hasManagedProperties ? "Архів бронювань ваших об'єктів" : "Архів бронювань";
  archiveNote.textContent = hasManagedProperties
    ? "Тут зберігаються завершені та скасовані заявки гостей по ваших об'єктах, а також ваші власні завершені бронювання."
    : "Тут відображаються завершені та скасовані бронювання, включно з проживанням, термін якого вже завершився.";
  archiveBadge.textContent = hasManagedProperties ? "Історія орендодавця" : "Історія гостя";
  archiveBadge.className = `dashboard-context-badge ${hasManagedProperties ? "dashboard-context-badge--host" : "dashboard-context-badge--guest"}`;

  document.getElementById("owner-properties").innerHTML = ownerPropertiesState.length ? ownerPropertiesState.map((property) => `
    <div class="table-row table-row--actions">
      <div>
        <strong>${property.title}</strong>
        <small>${property.city}, ${property.address}</small>
      </div>
      <span>${property.type}</span>
      <span>До ${property.guests} гостей</span>
      <div class="table-row__actions">
        <span class="status-pill ${getStatusClass(property.status)}">${property.status}</span>
        <button class="secondary-btn owner-action-btn" data-owner-edit-property="${property.id}" type="button">Редагувати</button>
        <button class="secondary-btn owner-action-btn" data-owner-delete-property="${property.id}" type="button">Видалити</button>
      </div>
    </div>
  `).join("") : '<p class="section-note">У вас ще немає доданого житла.</p>';

  document.getElementById("owner-bookings").innerHTML = hasManagedProperties
    ? renderDashboardBookingSections([
      {
        title: "Бронювання ваших об'єктів",
        note: "Тут ви підтверджуєте або завершуєте заявки.",
        items: activeHostBookings,
        hostMode: true,
        archived: false
      },
      {
        title: "Ваші особисті бронювання",
        note: "Тут показано бронювання, які ви створили як користувач.",
        items: activeGuestBookings,
        hostMode: false,
        archived: false
      }
    ], "Активних бронювань зараз немає.")
    : renderDashboardBookingSections([
      {
        title: "Активні бронювання",
        note: "",
        items: activeGuestBookings,
        hostMode: false,
        archived: false
      }
    ], "Активних бронювань зараз немає.");

  bookingsArchive.innerHTML = hasManagedProperties
    ? renderDashboardBookingSections([
      {
        title: "Архів заявок по ваших об'єктах",
        note: "Скасовані та завершені заявки гостей по вашому житлу.",
        items: archivedHostBookings,
        hostMode: true,
        archived: true
      },
      {
        title: "Архів ваших особистих бронювань",
        note: "Ваші завершені або скасовані бронювання як користувача.",
        items: archivedGuestBookings,
        hostMode: false,
        archived: true
      }
    ], "Архів бронювань поки порожній.")
    : renderDashboardBookingSections([
      {
        title: "Архів бронювань",
        note: "Завершені та скасовані бронювання.",
        items: archivedGuestBookings,
        hostMode: false,
        archived: true
      }
    ], "Архів бронювань поки порожній.");

  document.getElementById("owner-payments").innerHTML = payments.length ? `
    <div class="table-list">
      ${payments.map((payment) => {
        const paymentMeta = getPaymentStatusMeta(payment.status);
        return `
          <div class="table-row">
            <div>
              <strong>${payment.property}</strong>
              <small>${payment.method}</small>
            </div>
            <span>${payment.amount}</span>
            <span>${payment.method}</span>
            <span class="status-pill ${paymentMeta.className}">${paymentMeta.label}</span>
          </div>
        `;
      }).join("")}
    </div>
  ` : '<p class="section-note">Оплат для відображення поки немає.</p>';

  const dashboardNotifications = getDashboardNotifications(hasManagedProperties);
  document.getElementById("owner-notifications").innerHTML = dashboardNotifications.length ? dashboardNotifications.map((item) => `
    <article class="dashboard-notification-card dashboard-notification-card--${item.tone}">
      <div class="dashboard-notification-card__header">
        <strong>${item.title}</strong>
        <span>${item.meta}</span>
      </div>
      <p>${item.message}</p>
    </article>
  `).join("") : '<p class="section-note">Наразі немає нових сповіщень.</p>';

  const dynamicTasks = hasManagedProperties
    ? [
      newHostBookingsCount ? { title: `Нові заявки на бронювання: ${newHostBookingsCount}`, meta: "Гості очікують підтвердження по ваших об'єктах" } : null,
      pendingPaymentsCount ? { title: `Оплати в очікуванні: ${pendingPaymentsCount}`, meta: "Є бронювання, де статус оплати ще не завершений" } : null,
      cancelledHostBookingsCount ? { title: `Скасовані заявки: ${cancelledHostBookingsCount}`, meta: "Перегляньте архів, якщо потрібно перевірити історію скасувань" } : null,
      activeHostBookings.length ? { title: `Активні заявки гостей: ${activeHostBookings.length}`, meta: "Поточні бронювання ваших об'єктів уже в роботі" } : null
    ].filter(Boolean)
    : [];

  document.getElementById("owner-tasks").innerHTML = dynamicTasks.length ? dynamicTasks.map((task) => `
    <div class="simple-row simple-row--stack">
      <span class="simple-row__title">${task.title}</span>
      <span class="simple-row__meta">${task.meta}</span>
    </div>
  `).join("") : '<p class="section-note">Зараз немає нових дій. Усі бронювання та оплати оброблені.</p>';
}

function switchDashboardPage(pageId, options = {}) {
  const { updateHistory = true } = options;
  activeDashboardSection = pageId;

  document.querySelectorAll(".dash-page").forEach((page) => {
    page.classList.toggle("active", page.id === `dash-${pageId}`);
  });

  document.querySelectorAll(".sidebar-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.dashLink === pageId);
  });

  if (updateHistory && getCurrentPageId() === "dashboard" && window.history) {
    const nextState = { page: "dashboard", dashboard: pageId };
    if (window.history.state?.page !== nextState.page || window.history.state?.dashboard !== nextState.dashboard) {
      window.history.pushState(nextState, "", "#dashboard");
    }
  }

  if (pageId === "notifications") {
    markNotificationsAsRead();
  }

  if (pageId === "chats") {
    loadAndShowUserChats();
  }
}

document.addEventListener("click", (event) => {
  const notificationButtonClick = event.target.closest("#notification-btn");
  if (notificationButtonClick) {
    toggleNotificationsPopover();
    return;
  }

  const markReadClick = event.target.closest("#notifications-mark-read-btn");
  if (markReadClick) {
    markNotificationsAsRead();
    return;
  }

  const passwordToggle = event.target.closest(".password-toggle");
  if (passwordToggle) {
    const targetId = passwordToggle.dataset.togglePassword;
    const input = document.getElementById(targetId);
    if (input) {
      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      passwordToggle.classList.toggle("is-visible", !isVisible);
      passwordToggle.setAttribute("aria-pressed", String(!isVisible));
      passwordToggle.setAttribute("aria-label", isVisible ? "Показати пароль" : "Приховати пароль");
    }
    return;
  }

  const pageButton = event.target.closest("[data-page-link]");
  if (pageButton) {
    showPage(pageButton.dataset.pageLink);
    return;
  }

  if (event.target.closest("#details-back-btn")) {
    restoreViewContext(detailsBackContext);
    return;
  }

  const customSelectTrigger = event.target.closest(".custom-select__trigger");
  if (customSelectTrigger) {
    const customSelect = customSelectTrigger.closest(".custom-select");
    const isOpen = customSelect.classList.contains("is-open");
    closeCustomSelects(customSelect.dataset.selectId);
    customSelect.classList.toggle("is-open", !isOpen);
    customSelectTrigger.setAttribute("aria-expanded", String(!isOpen));
    customSelect.querySelector(".custom-select__menu")?.classList.toggle("hidden", isOpen);
    return;
  }

  const customSelectOption = event.target.closest(".custom-select__option");
  if (customSelectOption) {
    const customSelect = customSelectOption.closest(".custom-select");
    const nativeSelect = document.getElementById(customSelect.dataset.selectId);
    nativeSelect.value = customSelectOption.dataset.value;
    createCustomSelect(nativeSelect);
    nativeSelect.dispatchEvent(new Event("input", { bubbles: true }));
    nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    closeCustomSelects();
    return;
  }

  const customSelectClear = event.target.closest(".custom-select__clear");
  if (customSelectClear) {
    const customSelect = customSelectClear.closest(".custom-select");
    const nativeSelect = document.getElementById(customSelect.dataset.selectId);
    nativeSelect.selectedIndex = 0;
    createCustomSelect(nativeSelect);
    nativeSelect.dispatchEvent(new Event("input", { bubbles: true }));
    nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    closeCustomSelects();
    return;
  }

  if (event.target.closest("#date-range-trigger")) {
    toggleDatePicker();
    return;
  }

  const dateCell = event.target.closest("[data-date-value]");
  if (dateCell) {
    handleDateSelection(dateCell.dataset.dateValue);
    return;
  }

  if (!event.target.closest(".date-range-field")) {
    closeDatePicker();
  }

  if (!event.target.closest(".notification-wrap")) {
    closeNotificationsPopover();
  }

  if (!event.target.closest(".custom-select")) {
    closeCustomSelects();
  }

  const propertyButton = event.target.closest("[data-property-id]");
  if (propertyButton) {
    renderDetails(propertyButton.dataset.propertyId);
    return;
  }

  const bookingDetailsButton = event.target.closest(".booking-details-btn");
  if (bookingDetailsButton) {
    let booking = null;

    if (bookingDetailsButton.dataset.bookingId) {
      booking = [...bookingHistory, ...ownerBookingsState].find((item) => sameEntityId(item.id, bookingDetailsButton.dataset.bookingId));
    } else {
      const index = Number(bookingDetailsButton.dataset.bookingIndex);
      booking = bookingHistory[index];
    }

    if (!booking) {
      return;
    }

    const property = properties.find((item) => item.title === booking.property || item.title === booking.property.trim());
    if (property) {
      renderDetails(property.id, true);
    } else {
      showToast("Бронювання", "Деталі цього бронювання недоступні (власність не знайдена).");
    }
    return;
  }

  const bookingStatusButton = event.target.closest("[data-booking-status-filter]");
  if (bookingStatusButton) {
    activeBookingStatusFilter = bookingStatusButton.dataset.bookingStatusFilter;
    renderBookingStatusPanel();
    return;
  }

  const ownerDeletePropertyButton = event.target.closest("[data-owner-delete-property]");
  if (ownerDeletePropertyButton) {
    apiRequest(`/api/owner/properties/${encodeURIComponent(ownerDeletePropertyButton.dataset.ownerDeleteProperty)}`, {
      method: "DELETE"
    }).then(async () => {
      await refreshAppFromApi();
      showToast("Житло видалено", "Об'єкт було успішно видалено.");
    }).catch((error) => {
      showToast("Не вдалося видалити", error.message);
    });
    return;
  }

  const ownerEditPropertyButton = event.target.closest("[data-owner-edit-property]");
  if (ownerEditPropertyButton) {
    const propId = ownerEditPropertyButton.dataset.ownerEditProperty;
    const property = ownerPropertiesState.find((p) => String(p.id) === String(propId) || String(p._id || "") === String(propId));
    if (!property) {
      showToast("Помилка", "Об'єкт не знайдено.");
      return;
    }
    populateOwnerPropertyForm(property);
    // Scroll to form for convenience
    setTimeout(() => {
      ownerPropertyForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    return;
  }

  const cancelBookingButton = event.target.closest("[data-cancel-booking-id]");
  if (cancelBookingButton) {
    apiRequest(`/api/bookings/${encodeURIComponent(cancelBookingButton.dataset.cancelBookingId)}/cancel`, {
      method: "PATCH"
    }).then(async () => {
      await refreshAppFromApi();
      showToast("Бронювання скасовано", "Бронювання успішно скасовано.");
    }).catch((error) => {
      showToast("Не вдалося скасувати", error.message);
    });
    return;
  }

  const ownerBookingActionButton = event.target.closest("[data-owner-booking-action]");
  if (ownerBookingActionButton) {
    apiRequest(`/api/owner/bookings/${encodeURIComponent(ownerBookingActionButton.dataset.ownerBookingId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: ownerBookingActionButton.dataset.ownerBookingAction })
    }).then(async () => {
      await refreshAppFromApi();
      showToast("Статус оновлено", "Статус бронювання змінено.");
    }).catch((error) => {
      showToast("Не вдалося оновити", error.message);
    });
    return;
  }

  // Reject flow removed: UI no longer exposes reject modal or handlers.

  const dashButton = event.target.closest("[data-dash-link]");
  if (dashButton) {
    switchDashboardPage(dashButton.dataset.dashLink);
    return;
  }
});

if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateBookingForm()) {
    return;
  }

  if (!currentUser) {
    openAuthGate();
    showToast("Потрібно увійти", "Спершу увійдіть або зареєструйтеся.");
    return;
  }

  if (!isProfileComplete()) {
    openProfilePromptModal();
    showToast("Завершіть профіль", "Додайте прізвище та номер телефону перед бронюванням житла.");
    return;
  }

  const property = properties.find((item) => item.id === selectedPropertyId);
  const guest = document.getElementById("booking-name").value.trim();

  try {
    const payload = await apiRequest("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        propertyId: property.id,
        checkIn: bookingCheckin.value,
        checkOut: bookingCheckout.value,
        guestName: guest,
        promocodeCode: appliedBookingPromocode?.code || ""
      })
    });

    if (payload?.booking) {
      const createdBooking = {
        ...payload.booking,
        status: "new"
      };

      bookings = [createdBooking, ...bookings.filter((item) => item.id !== createdBooking.id)];
      bookingHistory = [createdBooking, ...bookingHistory.filter((item) => item.id !== createdBooking.id)];
      activeBookingStatusFilter = "new";
    }

    await refreshAppFromApi();
    activeBookingStatusFilter = "new";

    if (payload?.booking) {
      const createdBooking = {
        ...payload.booking,
        status: "new"
      };

      bookings = [createdBooking, ...bookings.filter((item) => item.id !== createdBooking.id)];
      bookingHistory = [createdBooking, ...bookingHistory.filter((item) => item.id !== createdBooking.id)];
      applyRemoteState();
    }

    showToast("Бронювання створено", `Запит на бронювання для "${property.title}" успішно надіслано.`);
    event.target.reset();
    syncBookingFormWithCurrentUser();
    bookingCheckin.value = "";
    bookingCheckout.value = "";
    resetBookingPromocodeState({ clearInput: true, clearMessage: true });
    updateDateRangeDisplay();
    renderDatePicker();
    updateBookingPreview();
  } catch (error) {
    showToast("Не вдалося створити бронювання", error.message);
  }
  });
}

const contactFormEl = document.getElementById("contact-form");
if (contactFormEl) {
  contactFormEl.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateContactForm()) {
      return;
    }

    showToast("Запит надіслано", "Ми зв'яжемося з вами найближчим часом.");
    event.target.reset();
  });
}

if (authTabLogin) authTabLogin.addEventListener("click", () => switchAuthTab("login"));
if (authTabRegister) authTabRegister.addEventListener("click", () => switchAuthTab("register"));

if (authLoginForm) {
  authLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearAuthMessages();

  const email = document.getElementById("auth-login-email").value.trim().toLowerCase();
  const password = document.getElementById("auth-login-password").value.trim();

  try {
    const { user } = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    await completeAuth(user, `Ласкаво просимо, ${user.name}!`);
    authLoginForm.reset();
  } catch (error) {
    showAuthMessage(authLoginMessage, error.message);
  }
  });
}

if (authRegisterForm) {
  authRegisterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearAuthMessages();

  const name = document.getElementById("auth-register-name").value.trim();
  const email = document.getElementById("auth-register-email").value.trim().toLowerCase();
  const password = document.getElementById("auth-register-password").value.trim();

  if (!name || !email || !password) {
    showAuthMessage(authRegisterMessage, "Заповніть усі поля реєстрації.");
    return;
  }

  try {
    const { user } = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });

    await completeAuth(user, "Реєстрацію завершено успішно.");
    authRegisterForm.reset();
  } catch (error) {
    showAuthMessage(authRegisterMessage, error.message);
  }
  });
}

const loginFormEl = document.getElementById("login-form");
if (loginFormEl) {
  loginFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = (document.getElementById("login-email")?.value || "").trim().toLowerCase();
    const password = (document.getElementById("login-password")?.value || "").trim();

    try {
      const { user } = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

        if (user.role !== "owner") {
          showToast("Доступ заборонено", "У панель власника може увійти лише користувач з роллю owner.");
          return;
        }

    currentUser = user;
    isUserAuthenticated = true;
    isOwnerLoggedIn = true;
    await refreshAppFromApi();
    closeModal();
    showPage("dashboard");
    showToast("Вхід виконано", "Ласкаво просимо до панелі власника.");
    event.target.reset();
  } catch (error) {
    showToast("Помилка входу", error.message);
  }
  });
}

const closeModalBtn = document.getElementById("close-modal-btn");
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
const completeProfileBtn = document.getElementById("complete-profile-btn");
if (completeProfileBtn) completeProfileBtn.addEventListener("click", redirectToProfileCompletion);
document.getElementById("edit-profile-btn").addEventListener("click", openProfileEditModal);
dashboardEditProfileButton.addEventListener("click", openProfileEditModal);
document.getElementById("close-profile-edit-btn").addEventListener("click", closeProfileEditModal);
document.getElementById("cancel-profile-edit-btn").addEventListener("click", closeProfileEditModal);

// Open chats list
if (openChatsBtn) {
  openChatsBtn.addEventListener("click", loadAndShowUserChats);
}
if (dashboardOpenChatsBtn) {
  dashboardOpenChatsBtn.addEventListener("click", () => {
    switchDashboardPage("chats");
  });
}

if (dashboardChatBackBtn) {
  dashboardChatBackBtn.addEventListener("click", () => {
    closeDashboardChatRoom();
  });
}

function focusPropertyLinkForChat(titleElement, propertyId, canOpenProperty = true) {
  if (!titleElement) {
    return;
  }

  if (!canOpenProperty) {
    delete titleElement.dataset.propertyId;
    titleElement.dataset.propertyExists = "false";
    titleElement.classList.remove("chat-room-title-link");
    titleElement.removeAttribute("role");
    titleElement.removeAttribute("tabindex");

    if (titleElement.id === "dashboard-chat-room-title" && dashboardChatPropertyHint) {
      dashboardChatPropertyHint.classList.add("hidden");
    }
    return;
  }

  titleElement.dataset.propertyId = propertyId;
  titleElement.dataset.propertyExists = "true";
  titleElement.classList.add("chat-room-title-link");
  titleElement.setAttribute("role", "link");
  titleElement.tabIndex = 0;

  if (titleElement.id === "dashboard-chat-room-title" && dashboardChatPropertyHint) {
    dashboardChatPropertyHint.classList.remove("hidden");
  }
}

// Click on chat to open it
async function handleChatListClick(event) {
  const titleLink = event.target.closest(".chat-list-item__title, #dashboard-chat-room-title");
  if (titleLink?.dataset.propertyId) {
    event.preventDefault();
    event.stopPropagation();
    if (titleLink.dataset.propertyExists === "false") {
      showToast("Чат", "Житло більше недоступне.");
      return;
    }
    openChatProperty(titleLink.dataset.propertyId);
    return;
  }

  event.stopPropagation();
  const chatCard = event.target.closest(".chat-list-item");
  if (chatCard) {
    const propertyId = chatCard.getAttribute("data-property-id");
    const userId = chatCard.getAttribute("data-user-id");
    const propertyExists = chatCard.getAttribute("data-property-exists") !== "false";
    const propertyTitle = chatCard.querySelector(".chat-list-item__title")?.textContent?.trim() || "Чат";
    const contactName = chatCard.querySelector("span")?.textContent?.trim() || "";

    activeChatPropertyId = propertyId;
    selectedChatUserId = userId;
    activeChatView = "dashboard";
    if (dashboardChatRoomTitle) {
      dashboardChatRoomTitle.textContent = propertyTitle;
      focusPropertyLinkForChat(dashboardChatRoomTitle, propertyId, propertyExists);
    }
    openDashboardChatRoom();
    await loadChatMessages();
  }
}

function handleChatListKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const titleLink = event.target.closest(".chat-list-item__title, #dashboard-chat-room-title");
  if (titleLink?.dataset.propertyId) {
    event.preventDefault();
    event.stopPropagation();
    openChatProperty(titleLink.dataset.propertyId);
    return;
  }

  const chatCard = event.target.closest(".chat-list-item");
  if (chatCard && !event.target.closest(".chat-list-item__title")) {
    event.preventDefault();
    void handleChatListClick(event);
  }
}

if (chatsListContainer) {
  chatsListContainer.addEventListener("click", handleChatListClick);
  chatsListContainer.addEventListener("keydown", handleChatListKeydown);
}
if (dashboardChatsContainer) {
  dashboardChatsContainer.addEventListener("click", handleChatListClick);
  dashboardChatsContainer.addEventListener("keydown", handleChatListKeydown);
}

if (dashboardChatRoomTitle) {
  dashboardChatRoomTitle.addEventListener("click", handleChatListClick);
  dashboardChatRoomTitle.addEventListener("keydown", handleChatListKeydown);
}

function submitChatMessage(event, ui = getActiveChatUi()) {
  event.preventDefault();

  if (!activeChatPropertyId) {
    return;
  }

  const message = ui.chatInputEl?.value.trim();
  if (!message) {
    return;
  }

  const payload = { message };
  if (currentUser?.role === "owner") {
    const threadUserId = String(selectedChatUserId || ui.threadSelectEl?.value || "").trim();
    if (!threadUserId) {
      showToast("Чат", "Оберіть користувача для відповіді.");
      return;
    }
    selectedChatUserId = threadUserId;
    payload.targetUserId = threadUserId;
  }

  return apiRequest(`/api/chat/${encodeURIComponent(activeChatPropertyId)}`, {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(async () => {
    // clear and reset heights for all chat inputs so a large message doesn't persist
    if (ui.chatInputEl) {
      ui.chatInputEl.value = "";
    }
    [chatInput, dashboardChatInput, chatEditModalInput].forEach((ta) => {
      if (!ta) return;
      try {
        ta.style.height = "auto";
      } catch (e) {}
    });
    await loadChatMessages();
  }).catch((error) => {
    showToast("Чат", error.message);
  });
}

async function editChatMessage(messageId, currentText = "") {
  if (!activeChatPropertyId || !messageId) {
    return;
  }

  const nextMessage = await showChatEditModal(currentText || "");
  if (nextMessage === null) {
    return;
  }

  const trimmed = nextMessage.trim();
  if (!trimmed) {
    showToast("Чат", "Повідомлення не може бути порожнім");
    return;
  }

  try {
    await apiRequest(`/api/chat/${encodeURIComponent(activeChatPropertyId)}/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      body: JSON.stringify({ message: trimmed })
    });
    await loadChatMessages();
    // reset heights after edit so inputs don't remain expanded
    [chatInput, dashboardChatInput, chatEditModalInput].forEach((ta) => {
      if (!ta) return;
      try {
        ta.style.height = "auto";
      } catch (e) {}
    });
  } catch (error) {
    showToast("Чат", error.message || "Не вдалося редагувати повідомлення");
  }
}

if (dashboardChatForm) {
  dashboardChatForm.addEventListener("submit", (event) => submitChatMessage(event, {
    chatInputEl: dashboardChatInput,
    chatBoxEl: dashboardChatBox,
    ownerStatusEl: dashboardChatOwnerStatus,
    threadWrapEl: dashboardChatThreadWrap,
    threadSelectEl: dashboardChatThreadSelect,
    modalTitleEl: dashboardChatRoomTitle
  }));
}

profileEditForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearProfileEditMessage();

  const name = document.getElementById("profile-edit-name").value.trim();
  const surname = document.getElementById("profile-edit-last-name").value.trim();
  const phoneCountryCode = profilePhoneCode.value;
  const phoneNational = getDigits(profilePhoneInput.value);
  const phone = `${phoneCountryCode}${phoneNational}`;

  if (!name || !surname || !phoneNational) {
    showProfileEditMessage("Заповніть ім'я, прізвище та номер телефону.");
    return;
  }

  try {
    const { user } = await apiRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ name, surname, phone })
    });

    currentUser = user;
    await refreshAppFromApi();
    closeProfileEditModal();
    closeProfilePromptModal();
    showToast("Профіль оновлено", "Особисті дані успішно збережено.");
  } catch (error) {
    showProfileEditMessage(error.message);
  }
});

profilePhoneInput.addEventListener("input", () => {
  const code = profilePhoneCode.value;
  profilePhoneInput.value = formatPhoneByCountry(code, profilePhoneInput.value);
});

profileCountryTrigger.addEventListener("click", () => {
  const isHidden = profileCountryMenu.classList.contains("hidden");
  profileCountryMenu.classList.toggle("hidden", !isHidden);
  profileCountryTrigger.setAttribute("aria-expanded", String(isHidden));
});

profileCountryMenu.addEventListener("click", (event) => {
  const option = event.target.closest(".country-picker__option");
  if (!option) {
    return;
  }

  const code = option.dataset.code;
  const label = option.dataset.label;
  const flag = option.dataset.flag;
  updateCountryPickerVisual(code, label, flag);
  profilePhoneInput.value = formatPhoneByCountry(code, profilePhoneInput.value);
  closeCountryPickerMenu();
});

openChatButton.addEventListener("click", openChatModal);
document.getElementById("close-chat-btn").addEventListener("click", closeChatModal);
chatModal.addEventListener("click", (event) => {
  if (event.target === chatModal) {
    closeChatModal();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#profile-country-picker")) {
    closeCountryPickerMenu();
  }
});

chatThreadSelect.addEventListener("change", async () => {
  selectedChatUserId = chatThreadSelect.value;
  await loadChatMessages();
});

if (dashboardChatThreadSelect) {
  dashboardChatThreadSelect.addEventListener("change", async () => {
    selectedChatUserId = dashboardChatThreadSelect.value;
    await loadChatMessages();
  });
}

chatForm.addEventListener("submit", async (event) => {
  await submitChatMessage(event, {
    chatInputEl: chatInput,
    chatBoxEl: chatBox,
    ownerStatusEl: chatOwnerStatus,
    threadWrapEl: chatThreadWrap,
    threadSelectEl: chatThreadSelect,
    modalTitleEl: chatModalTitle
  });
});

// Delegated handler for delete buttons inside chat
chatBox.addEventListener('click', async (e) => {
  const btn = e.target.closest('.chat-message__delete');
  if (!btn) return;
  const messageId = btn.dataset.messageId;
  if (!messageId) return;

  if (!(await showConfirm('Видалити своє повідомлення?'))) return;

  try {
    await apiRequest(`/api/chat/${encodeURIComponent(activeChatPropertyId)}/${encodeURIComponent(messageId)}`, {
      method: 'DELETE'
    });
    await loadChatMessages();
  } catch (err) {
    showToast('Чат', err.message || 'Не вдалося видалити повідомлення');
  }
});

chatBox.addEventListener('click', async (e) => {
  const btn = e.target.closest('.chat-message__edit');
  if (!btn) return;
  await editChatMessage(btn.dataset.messageId, btn.dataset.messageText || "");
});

if (dashboardChatBox) {
  dashboardChatBox.addEventListener('click', async (e) => {
    const btn = e.target.closest('.chat-message__delete');
    if (!btn) return;
    const messageId = btn.dataset.messageId;
    if (!messageId) return;

    if (!(await showConfirm('Видалити своє повідомлення?'))) return;

    try {
      await apiRequest(`/api/chat/${encodeURIComponent(activeChatPropertyId)}/${encodeURIComponent(messageId)}`, {
        method: 'DELETE'
      });
      await loadChatMessages();
    } catch (err) {
      showToast('Чат', err.message || 'Не вдалося видалити повідомлення');
    }
  });

  dashboardChatBox.addEventListener('click', async (e) => {
    const btn = e.target.closest('.chat-message__edit');
    if (!btn) return;
    await editChatMessage(btn.dataset.messageId, btn.dataset.messageText || "");
  });
}

datePickerPrev.addEventListener("click", () => {
  pickerMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1, 1);
  renderDatePicker();
});

datePickerNext.addEventListener("click", () => {
  pickerMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 1);
  renderDatePicker();
});

datePickerClear.addEventListener("click", () => {
  bookingCheckin.value = "";
  bookingCheckout.value = "";
  updateDateRangeDisplay();
  updateBookingPreview();
  renderDatePicker();
});

document.getElementById("logout-btn").addEventListener("click", handleLogout);

ownerPropertyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearOwnerPropertyMessage();

  if (!validateOwnerPropertyForm()) {
    return;
  }

  const payload = {
    title: document.getElementById("owner-property-title").value.trim(),
    city: document.getElementById("owner-property-city").value.trim(),
    type: ownerPropertyTypeSelect.value,
    guests: Number(document.getElementById("owner-property-guests").value),
    price: Number(document.getElementById("owner-property-price").value),
    address: document.getElementById("owner-property-address").value.trim(),
    amenities: document.getElementById("owner-property-amenities").value.trim(),
    description: document.getElementById("owner-property-description").value.trim(),
    image: extractImageSource(ownerPropertyImages[0]?.dataUrl || ""),
    images: ownerPropertyImages.map((item) => extractImageSource(item.dataUrl))
  };

  if (!payload.title || !payload.city || !payload.type || !payload.guests || !payload.price || !payload.address || !payload.description) {
    showOwnerPropertyMessage("Заповніть усі обов'язкові поля перед публікацією житла.");
    return;
  }

  try {
    const wasEditing = Boolean(editingOwnerPropertyId);
    if (wasEditing) {
      await apiRequest(`/api/owner/properties/${encodeURIComponent(editingOwnerPropertyId)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      await apiRequest("/api/owner/properties", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    resetOwnerPropertyFormState();
    await refreshAppFromApi();
    showToast(wasEditing ? "Житло оновлено" : "Житло опубліковано", wasEditing ? "Об'єкт оновлено." : "Новий об'єкт додано до каталогу.");
  } catch (error) {
    showOwnerPropertyMessage(error.message);
  }
});

ownerPropertyCancelButton?.addEventListener("click", () => {
  resetOwnerPropertyFormState();
});

ownerPropertyImageInput.addEventListener("change", handleOwnerPropertyPhotoChange);
ownerPropertyPhotoClearButton.addEventListener("click", () => {
  clearOwnerPropertyMessage();
  resetOwnerPropertyPhoto();
});

["owner-property-title", "owner-property-city", "owner-property-guests", "owner-property-price", "owner-property-address", "owner-property-description"].forEach((fieldId) => {
  const field = document.getElementById(fieldId);
  field?.addEventListener("input", clearOwnerPropertyMessage);
  field?.addEventListener("change", clearOwnerPropertyMessage);
});

ownerPropertyPhotoGallery?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-photo-remove]");
  if (!removeButton) {
    return;
  }

  const imageIndex = Number(removeButton.dataset.photoRemove);
  if (!Number.isFinite(imageIndex)) {
    return;
  }

  removeOwnerPropertyImage(imageIndex);
});

detailsGallery?.addEventListener("click", (event) => {
  if (!detailsGalleryImages.length) {
    return;
  }

  const thumbButton = event.target.closest("[data-gallery-index]");
  if (thumbButton) {
    detailsGalleryIndex = Number(thumbButton.dataset.galleryIndex) || 0;
    renderDetailsGallery(detailsGalleryImages, detailsGalleryIndex);
    return;
  }

  const navButton = event.target.closest("[data-gallery-step]");
  if (!navButton) {
    return;
  }

  const step = Number(navButton.dataset.galleryStep) || 0;
  if (!step || detailsGalleryImages.length < 2) {
    return;
  }

  detailsGalleryIndex = (detailsGalleryIndex + step + detailsGalleryImages.length) % detailsGalleryImages.length;
  renderDetailsGallery(detailsGalleryImages, detailsGalleryIndex);
});

[filterCity, filterType, filterGuests].forEach((element) => {
  element.addEventListener("input", applyFilters);
  element.addEventListener("change", applyFilters);
});

["input", "change"].forEach((eventName) => {
  filterPrice.addEventListener(eventName, () => {
    hasTouchedPriceFilter = true;
    applyFilters();
  });
});

filtersClearButton?.addEventListener("click", resetFilters);

[bookingCheckin, bookingCheckout].forEach((element) => {
  element.addEventListener("input", updateBookingPreview);
  element.addEventListener("change", updateBookingPreview);
});

bookingPromocodeApplyButton?.addEventListener("click", async () => {
  const code = normalizePromocodeInputValue(bookingPromocodeInput.value);
  const baseTotal = getBookingBaseTotal();

  if (!baseTotal) {
    setBookingPromocodeMessage("Спочатку оберіть дати проживання, щоб застосувати промокод.", "error");
    return;
  }

  if (!code) {
    setBookingPromocodeMessage("Введіть промокод для перевірки.", "error");
    bookingPromocodeInput.focus();
    return;
  }

  bookingPromocodeApplyButton.disabled = true;

  try {
    const payload = await apiRequest("/api/promocodes/validate", {
      method: "POST",
      body: JSON.stringify({
        code,
        propertyId: selectedPropertyId,
        checkIn: bookingCheckin.value,
        checkOut: bookingCheckout.value
      })
    });

    appliedBookingPromocode = payload.promo;
    bookingPromocodeInput.value = payload.promo.code;
    updateBookingPreview();
  } catch (error) {
    resetBookingPromocodeState({ clearInput: false, clearMessage: false });
    updateBookingPreview();
    setBookingPromocodeMessage(error.message, "error");
  } finally {
    bookingPromocodeApplyButton.disabled = false;
  }
});

bookingPromocodeInput?.addEventListener("input", () => {
  const normalizedValue = normalizePromocodeInputValue(bookingPromocodeInput.value);
  bookingPromocodeInput.value = normalizedValue;

  if (appliedBookingPromocode && normalizedValue !== appliedBookingPromocode.code) {
    resetBookingPromocodeState({ clearInput: false, clearMessage: true });
    updateBookingPreview();
  }

  if (!normalizedValue) {
    setBookingPromocodeMessage("");
  }
});

[document.getElementById("booking-name"), document.getElementById("booking-email"), document.getElementById("booking-phone")].forEach((element) => {
  element.addEventListener("input", () => setFormMessage(""));
});

async function bootstrapApplication() {
  syncModalScrollLock();
  updateCountryPickerVisual("+380", "UA +380", "ua");
  initPasswordToggleVisibility();
  renderPropertyCards(featuredGrid, properties.slice(0, 3));
  populateFiltersFromProperties();
  initCustomSelects();
  applyFilters();
  updateDateRangeDisplay();
  renderDatePicker();
  renderDetails(selectedPropertyId);
  renderOwnerPanel();
  renderBookingStatusPanel();
  renderBookingHistory();
  updateDetailsBackButton();

  try {
    const bootstrap = await refreshAppFromApiWithOptions({ restoreSession: true });

    if (bootstrap?.user) {
      closeAuthGate();
      showPage("home", { updateHistory: false });
      window.history?.replaceState({ page: "home", dashboard: activeDashboardSection }, "", "#home");
      return;
    }
  } catch (error) {
    console.error(error);
  }

  initializeAuthGate();
}

bootstrapApplication();

window.addEventListener("popstate", (event) => {
  const state = event.state;
  if (!state?.page || !isUserAuthenticated) {
    return;
  }

  restoreViewContext(state, { updateHistory: false });
});
