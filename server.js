import "dotenv/config";
import bcrypt from "bcryptjs";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/House_Booking";
const SESSION_SECRET = process.env.SESSION_SECRET || "bookme-dev-session-secret";

const app = express();

app.use(express.json({ limit: "6mb" }));
// Use MongoDB-backed session store so sessions persist across serverless invocations
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7 // 7 days
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    surname: String,
    email: { type: String, index: true },
    phone: String,
    role: { type: String, default: "client" },
    passwordHash: String,
    is_online: { type: Boolean, default: false },
    last_seen_at: Date,
    joined_at: Date,
    rating: Number,
    verified: Boolean,
    status: String
  },
  { collection: "Users", versionKey: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price_per_night: Number,
    address: String,
    amenities: [String],
    owner_id: mongoose.Schema.Types.Mixed,
    reviews: [
      {
        guest: String,
        rating: Number,
        comment: String,
        date: Date
      }
    ],
    location: {
      type: {
        type: String,
        default: "Point"
      },
      coordinates: [Number]
    },
    city: String,
    type: String,
    guests: Number,
    status: String,
    images: [String],
    image: String,
    check_in_time: { type: String, default: "14:00" },
    check_out_time: { type: String, default: "11:00" },
    unavailable_dates: [String]
  },
  { collection: "Properties", versionKey: false }
);

const bookingSchema = new mongoose.Schema(
  {
    property_title: String,
    guest_name: String,
    user_id: mongoose.Schema.Types.Mixed,
    property_id: mongoose.Schema.Types.Mixed,
    check_in: mongoose.Schema.Types.Mixed,
    check_out: mongoose.Schema.Types.Mixed,
    original_total_price: Number,
    total_price: Number,
    promo_code: String,
    discount_percent: Number,
    status: String,
    status_history: [
      {
        status: String,
        date: Date,
        note: String
      }
    ],
    date: Date,
    updated_at: Date
  },
  { collection: "Bookings", versionKey: false }
);

const paymentSchema = new mongoose.Schema(
  {
    booking_id: mongoose.Schema.Types.Mixed,
    user_name: String,
    amount: Number,
    payment_method: String,
    payment_status: String,
    payment_date: Date,
    status: String,
    paid_at: Date
  },
  { collection: "Payments", versionKey: false }
);

const promoSchema = new mongoose.Schema(
  {
    code: String,
    discount_percent: Number,
    valid_until: Date,
    is_active: Boolean
  },
  { collection: "Promocodes", versionKey: false }
);

const adminActionSchema = new mongoose.Schema({}, { collection: "AdminActions", strict: false, versionKey: false });
const notificationSchema = new mongoose.Schema(
  {
    recipient_id: mongoose.Schema.Types.Mixed,
    recipient_role: String,
    title: String,
    message: String,
    type: String,
    reference_key: String,
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
  },
  { collection: "Notifications", versionKey: false }
);

const chatMessageSchema = new mongoose.Schema(
  {
    property_id: mongoose.Schema.Types.Mixed,
    user_id: mongoose.Schema.Types.Mixed,
    owner_id: mongoose.Schema.Types.Mixed,
    sender_role: String,
    sender_name: String,
    message: String,
    created_at: { type: Date, default: Date.now },
    edited_at: Date,
    edited_by: mongoose.Schema.Types.Mixed,
    is_read: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    deleted_at: Date,
    deleted_by: mongoose.Schema.Types.Mixed
  },
  { collection: "ChatMessages", versionKey: false }
);

const User = mongoose.model("User", userSchema);
const Property = mongoose.model("Property", propertySchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Promocode = mongoose.model("Promocode", promoSchema);
const AdminAction = mongoose.model("AdminAction", adminActionSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

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

const imagePool = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80"
];

function buildPropertyImage(imageValue, index = 0) {
  const normalizedValue = String(imageValue || "").trim();
  const fallback = `linear-gradient(135deg, rgba(96,120,132,0.24), rgba(196,146,102,0.2)), url('${imagePool[index % imagePool.length]}')`;

  if (!normalizedValue) {
    return fallback;
  }

  if (normalizedValue.startsWith("linear-gradient(") || normalizedValue.startsWith("url(")) {
    return normalizedValue;
  }

  return `linear-gradient(135deg, rgba(96,120,132,0.24), rgba(196,146,102,0.2)), url('${normalizedValue.replace(/'/g, "%27")}')`;
}

function buildPropertyImages(property, index = 0) {
  const sourceImages = Array.isArray(property.images) && property.images.length
    ? property.images
    : (property.image ? [property.image] : []);

  if (!sourceImages.length) {
    return [buildPropertyImage("", index)];
  }

  return sourceImages.map((imageValue, imageIndex) => buildPropertyImage(imageValue, index + imageIndex));
}

const ownerTasks = [
  { title: "Підтвердити нові бронювання", meta: "Перевірити заявки за поточний тиждень" },
  { title: "Актуалізувати ціни", meta: "Переглянути об'єкти з ціною понад 4000 грн" },
  { title: "Оновити статуси житла", meta: "Переконатися, що доступність синхронізована" }
];

const supportedPhoneCodes = ["+380", "+49", "+48", "+44", "+1"];

function normalizeBookingStatus(status) {
  const rawStatus = String(status || "").trim().toLowerCase();

  if (["new", "pending", "очікує підтвердження", "нове"].includes(rawStatus)) {
    return "new";
  }

  if (["confirmed", "заброньовано", "підтверджено", "paid", "оплачено"].includes(rawStatus)) {
    return "confirmed";
  }

  if (["completed", "завершено", "done"].includes(rawStatus)) {
    return "completed";
  }

  if (["cancelled", "canceled", "скасовано"].includes(rawStatus)) {
    return "cancelled";
  }

  return "new";
}

function extractPropertyTitleFromNotificationMessage(message) {
  const text = String(message || "");
  const match = text.match(/житла\s*["“](.+?)["”]/i);
  const title = String(match?.[1] || "").trim();
  if (!title || /невідоме\s+житло/i.test(title)) {
    return "";
  }
  return title;
}

function parseMongoId(value) {
  return mongoose.Types.ObjectId.isValid(value) ? new mongoose.Types.ObjectId(value) : null;
}

function buildPropertyIdMatch(propertyId) {
  const stringId = String(propertyId);
  const objectId = parseMongoId(stringId);
  return objectId ? { $in: [stringId, objectId] } : stringId;
}

function buildUserIdMatch(userId) {
  const stringId = String(userId);
  const objectId = parseMongoId(stringId);
  return objectId ? { $in: [stringId, objectId] } : stringId;
}

function serializeDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day));
}

function getNightCount(checkIn, checkOut) {
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);
  if (!start || !end) {
    return 0;
  }

  const difference = end.getTime() - start.getTime();
  const nights = Math.round(difference / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

function normalizePromocodeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function calculateDiscountedTotal(total, discountPercent) {
  const safeTotal = Math.max(Number(total || 0), 0);
  const safeDiscount = Math.min(Math.max(Number(discountPercent || 0), 0), 100);
  return Math.max(0, Math.round(safeTotal * ((100 - safeDiscount) / 100)));
}

async function findValidPromocode(code) {
  const normalizedCode = normalizePromocodeCode(code);
  if (!normalizedCode) {
    return null;
  }

  const promo = await Promocode.findOne({
    code: normalizedCode,
    is_active: true
  }).lean();

  if (!promo) {
    return null;
  }

  const validUntil = parseDateOnly(promo.valid_until);
  const today = parseDateOnly(new Date());
  if (validUntil && today && validUntil < today) {
    return null;
  }

  return promo;
}

function formatDateRange(checkIn, checkOut) {
  const start = serializeDate(checkIn)?.slice(0, 10);
  const end = serializeDate(checkOut)?.slice(0, 10);

  if (!start && !end) {
    return "";
  }

  const [startYear, startMonth, startDay] = (start || "").split("-");
  const [endYear, endMonth, endDay] = (end || "").split("-");
  const startText = start ? `${startDay}.${startMonth}.${startYear}` : "";
  const endText = end ? `${endDay}.${endMonth}.${endYear}` : "";
  return `${startText} - ${endText}`.trim();
}

function buildUnavailableDates(checkIn, checkOut) {
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return [];
  }

  const dates = [];
  const cursor = new Date(start);
  while (cursor < end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function buildMixedIdMatcher(fieldName, value) {
  const stringValue = String(value || "").trim();
  if (!stringValue) {
    return null;
  }

  const mongoId = parseMongoId(stringValue);
  if (mongoId) {
    return { $or: [{ [fieldName]: stringValue }, { [fieldName]: mongoId }] };
  }

  return { [fieldName]: stringValue };
}

const blockedRegistrationNames = new Set(["api test", "cancel test", "session check", "test user"]);
const blockedRegistrationEmailPrefixes = ["apitest_", "canceltest_", "sessioncheck_", "bookme_test_"];

function isBlockedRegistration({ name, email }) {
  const normalizedName = String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const emailLocalPart = normalizedEmail.split("@")[0] || "";

  if (!normalizedEmail || !normalizedName) {
    return false;
  }

  if (normalizedEmail.endsWith("@bookme.local")) {
    return true;
  }

  if (blockedRegistrationNames.has(normalizedName)) {
    return true;
  }

  return blockedRegistrationEmailPrefixes.some((prefix) => emailLocalPart.startsWith(prefix));
}

async function resolvePropertyForBooking(booking) {
  const propertyIdMatcher = buildMixedIdMatcher("_id", booking?.property_id);
  if (propertyIdMatcher) {
    const byId = await Property.findOne(propertyIdMatcher);
    if (byId) {
      return byId;
    }
  }

  const propertyTitle = String(booking?.property_title || "").trim();
  if (propertyTitle) {
    const byTitle = await Property.findOne({ title: propertyTitle });
    if (byTitle) {
      return byTitle;
    }
  }

  return null;
}

function extractCity(address = "") {
  const foundCity = catalogCities.find((city) => address.toLowerCase().includes(city.toLowerCase()));
  if (foundCity) {
    return foundCity;
  }

  if (address.includes("Львів")) return "Львів";
  if (address.includes("Поляниця")) return "Яремче";
  return "Київ";
}

function deriveType(property) {
  const text = `${property.title || ""} ${property.description || ""}`.toLowerCase();
  if (text.includes("chalet") || text.includes("будинок") || text.includes("шале")) {
    return "Будинок";
  }
  if (text.includes("апартамент")) {
    return "Апартаменти";
  }
  return "Квартира";
}

function deriveGuests(property) {
  if (property.guests) {
    return property.guests;
  }
  const type = property.type || deriveType(property);
  if (type === "Будинок") {
    return 6;
  }
  if (type === "Апартаменти") {
    return 3;
  }
  return 2;
}

function deriveRating(property) {
  if (typeof property.rating === "number") {
    return Number(property.rating.toFixed(1));
  }

  if (Array.isArray(property.reviews) && property.reviews.length) {
    const total = property.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return Number((total / property.reviews.length).toFixed(1));
  }

  return 4.6;
}

function deriveStatus(property) {
  const unavailableDates = Array.isArray(property.unavailable_dates) ? property.unavailable_dates : [];
  if (!unavailableDates.length) {
    return property.status || "Доступне";
  }

  const datesByMonth = new Map();
  unavailableDates.forEach((date) => {
    const monthKey = String(date).slice(0, 7);
    datesByMonth.set(monthKey, (datesByMonth.get(monthKey) || 0) + 1);
  });

  const hasFullyBookedMonth = Array.from(datesByMonth.entries()).some(([monthKey, count]) => {
    const [yearStr, monthStr] = monthKey.split("-");
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return count >= daysInMonth;
  });

  return hasFullyBookedMonth ? "Заброньовано" : "Доступне";
}

function normalizeProperty(property, index = 0) {
  const city = property.city || extractCity(property.address);
  const type = property.type || deriveType(property);
  const unavailableDates = Array.isArray(property.unavailable_dates) ? property.unavailable_dates : [];
  const images = buildPropertyImages(property, index);

  return {
    id: String(property._id),
    title: property.title,
    city,
    type,
    guests: deriveGuests({ ...property, type }),
    price: Number(property.price_per_night || 0),
    rating: deriveRating(property),
    status: deriveStatus(property),
    address: property.address,
    unavailableDates,
    images,
    image: images[0],
    checkInTime: property.check_in_time || "14:00",
    checkOutTime: property.check_out_time || "11:00",
    amenities: property.amenities || [],
    description: property.description || "Опис житла буде додано пізніше.",
    ownerId: property.owner_id ? String(property.owner_id) : null
  };
}

function normalizeBooking(booking, propertyMap = new Map(), userMap = new Map()) {
  const propertyKey = String(booking.property_id || "");
  const userKey = String(booking.user_id || "");
  const property = propertyMap.get(propertyKey);
  const user = userMap.get(userKey);
  const normalizedStatus = normalizeBookingStatus(booking.status);
  const propertyTitle = booking.property_title || property?.title || String(booking.property_id || "Житло");
  const city = property?.city || extractCity(property?.address || "");
  const guest = booking.guest_name || user?.name || String(booking.user_id || "Гість");
  const checkIn = booking.check_in || booking.date;
  const checkOut = booking.check_out || booking.date;

  return {
    id: String(booking._id),
    guest,
    property: propertyTitle,
    city,
    dates: formatDateRange(checkIn, checkOut) || serializeDate(booking.date)?.slice(0, 10) || "",
    status: normalizedStatus,
    amount: `${Number(booking.total_price || 0)} грн`,
    originalAmount: booking.original_total_price ? `${Number(booking.original_total_price || 0)} грн` : "",
    promoCode: booking.promo_code || "",
    discountPercent: Number(booking.discount_percent || 0),
    checkIn: serializeDate(checkIn),
    checkOut: serializeDate(checkOut),
    propertyId: String(property?.id || property?._id || booking.property_id || ""),
    userId: String(user?.id || user?._id || booking.user_id || "")
    ,
    // include guest phone when available (sanitized via sanitizeUser)
    guestPhone: user?.phone || "",
    guestPhoneIsForeign: Boolean(user?.isForeignPhone)
  };
}

function normalizePayment(payment, bookingMap = new Map()) {
  const booking = bookingMap.get(String(payment.booking_id || ""));
  return {
    id: String(payment._id),
    property: booking?.property || payment.user_name || "Платіж",
    amount: `${Number(payment.amount || 0)} грн`,
    method: payment.payment_method || "Невідомо",
    status: payment.payment_status || payment.status || "pending"
  };
}

function normalizeNotification(action) {
  const timestamp = serializeDate(action.timestamp)?.slice(0, 10);
  return `${action.action}${timestamp ? ` · ${timestamp}` : ""}`;
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

  const countryCode = supportedPhoneCodes.find((code) => normalizedPhone.startsWith(code)) || "+380";
  const nationalNumber = normalizedPhone.slice(countryCode.length).replace(/\D/g, "");
  const fullPhone = nationalNumber ? `${countryCode}${nationalNumber}` : "";

  return {
    countryCode,
    nationalNumber,
    fullPhone,
    isForeignPhone: Boolean(nationalNumber) && countryCode !== "+380"
  };
}

function sanitizeUser(user) {
  const legacyPhone = user.phone || `${user.phoneCountryCode || ""}${user.phoneNational || ""}`;
  const phoneMeta = parseStoredPhone(legacyPhone);

  return {
    id: String(user._id),
    name: user.name,
    surname: user.surname || user.lastName || "",
    email: user.email,
    role: user.role || "client",
    phone: phoneMeta.fullPhone,
    isForeignPhone: phoneMeta.isForeignPhone
  };
}

function relativeTimeUk(dateValue) {
  if (!dateValue) {
    return "щойно";
  }

  const value = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const diffMs = Date.now() - value.getTime();
  const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0);

  if (diffMinutes < 1) {
    return "щойно";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} хв тому`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} год тому`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} дн тому`;
}

async function createNotification({ recipientId, recipientRole, title, message, type = "general", referenceKey = "" }) {
  if (!recipientId) {
    return;
  }

  if (referenceKey) {
    const exists = await Notification.findOne({ recipient_id: String(recipientId), reference_key: referenceKey }).lean();
    if (exists) {
      return;
    }
  }

  await Notification.create({
    recipient_id: String(recipientId),
    recipient_role: recipientRole || "client",
    title,
    message,
    type,
    reference_key: referenceKey,
    is_read: false,
    created_at: new Date()
  });
}

async function getUserNotifications(userId) {
  const docs = await Notification.find({ recipient_id: String(userId) }).sort({ created_at: -1 }).limit(50).lean();
  const unreadCount = docs.reduce((count, item) => count + (item.is_read ? 0 : 1), 0);

  return {
    unreadCount,
    items: docs.map((item) => ({
      id: String(item._id),
      title: item.title || "Сповіщення",
      message: item.message || "",
      type: item.type || "general",
      isRead: Boolean(item.is_read),
      createdAt: serializeDate(item.created_at),
      relativeTime: relativeTimeUk(item.created_at)
    }))
  };
}

function ownerPresenceText(owner) {
  if (!owner) {
    return "Не в мережі";
  }

  if (owner.is_online) {
    return "Власник в мережі";
  }

  if (!owner.last_seen_at) {
    return "Власник не в мережі";
  }

  const minutes = Math.max(Math.floor((Date.now() - new Date(owner.last_seen_at).getTime()) / 60000), 0);
  if (minutes < 5) {
    return "Власник щойно був у мережі";
  }

  if (minutes < 10) {
    return "Власник був у мережі нещодавно";
  }

  return `Власник був у мережі ${minutes} хв тому`;
}

async function setOwnerPresence(userId, isOnline) {
  await User.findOneAndUpdate({ _id: userId, role: "owner" }, {
    $set: {
      is_online: isOnline,
      last_seen_at: new Date()
    }
  }).catch(() => {});
}

function chatMessageDto(message, currentUserRole) {
  const isFromCurrentUser = message.sender_role === currentUserRole;
  return {
    id: String(message._id),
    senderRole: message.sender_role,
    senderName: message.sender_name,
    message: message.message,
    createdAt: serializeDate(message.created_at),
    relativeTime: relativeTimeUk(message.created_at),
    isRead: Boolean(message.is_read) || !isFromCurrentUser,
    editedAt: message.edited_at ? serializeDate(message.edited_at) : null,
    isEdited: Boolean(message.edited_at)
  };
}

async function ensureBookingRemindersForUser(user) {
  const bookings = await Booking.find({ user_id: user.id }).lean();
  const properties = await Property.find({}).lean();
  const propertyMap = new Map(properties.map((item, index) => [String(item._id), normalizeProperty(item, index)]));
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  for (const booking of bookings) {
    const property = propertyMap.get(String(booking.property_id));
    if (!property) {
      continue;
    }

    const checkInDay = serializeDate(booking.check_in)?.slice(0, 10);
    const checkOutDay = serializeDate(booking.check_out)?.slice(0, 10);

    if (checkInDay === today) {
      await createNotification({
        recipientId: user.id,
        recipientRole: user.role,
        title: "Нагадування про заселення",
        message: `Сьогодні заселення в \"${property.title}\" о ${property.checkInTime}.`,
        type: "checkin-reminder",
        referenceKey: `checkin:${booking._id}:${today}`
      });
    }

    if (checkOutDay === today) {
      await createNotification({
        recipientId: user.id,
        recipientRole: user.role,
        title: "Нагадування про виселення",
        message: `Сьогодні виселення з \"${property.title}\" до ${property.checkOutTime}.`,
        type: "checkout-reminder",
        referenceKey: `checkout:${booking._id}:${today}`
      });
    }
  }
}

async function syncExpiredBookingsForUserContext(user) {
  if (!user?.id) {
    return;
  }

  const ownerObjectId = parseMongoId(user.id);
  const ownerMatcher = ownerObjectId
    ? { $or: [{ owner_id: user.id }, { owner_id: ownerObjectId }] }
    : { owner_id: user.id };
  const ownedProperties = await Property.find(ownerMatcher).select({ _id: 1, title: 1, owner_id: 1 }).lean();
  const ownedPropertyIds = new Set(ownedProperties.map((property) => String(property._id)));
  const allBookings = await Booking.find({}).sort({ _id: -1 });
  const today = new Date().toISOString().slice(0, 10);

  for (const booking of allBookings) {
    const normalizedStatus = normalizeBookingStatus(booking.status);
    if (!["new", "confirmed"].includes(normalizedStatus)) {
      continue;
    }

    const isUserBooking = String(booking.user_id || "") === String(user.id);
    const isOwnedPropertyBooking = ownedPropertyIds.has(String(booking.property_id || ""));
    if (!isUserBooking && !isOwnedPropertyBooking) {
      continue;
    }

    const checkOutDay = serializeDate(booking.check_out)?.slice(0, 10);
    if (!checkOutDay || checkOutDay >= today) {
      continue;
    }

    booking.status = "completed";
    booking.updated_at = new Date();
    booking.status_history = [
      ...(Array.isArray(booking.status_history) ? booking.status_history : []),
      {
        status: "completed",
        date: new Date(),
        note: "Термін проживання завершено автоматично"
      }
    ];
    await booking.save();

    await Payment.updateMany(
      buildMixedIdMatcher("booking_id", booking._id) || { booking_id: booking._id },
      {
        $set: {
          payment_status: "completed",
          status: "completed",
          paid_at: new Date()
        }
      }
    ).catch(() => {});
  }
}

function ensureSession(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Потрібно увійти в акаунт." });
  }

  next();
}

function ensureOwner(req, res, next) {
  if (!req.session.user || req.session.user.role !== "owner") {
    return res.status(403).json({ message: "Доступ лише для власника." });
  }

  next();
}

async function syncUserRoleWithProperties(userId) {
  const ownerCandidates = [String(userId)];
  const mongoUserId = parseMongoId(userId);
  if (mongoUserId) {
    ownerCandidates.push(mongoUserId);
  }

  const hasProperties = await Property.exists({
    owner_id: { $in: ownerCandidates }
  }).catch(() => null);

  const nextRole = hasProperties ? "owner" : "client";
  const user = await User.findByIdAndUpdate(userId, { $set: { role: nextRole } }, { new: true });
  return user ? sanitizeUser(user) : null;
}

async function cleanupUsersCollection() {
  const users = await User.find({}).lean();

  for (const user of users) {
    const legacyPhone = user.phone || `${user.phoneCountryCode || ""}${user.phoneNational || ""}`;
    const phoneMeta = parseStoredPhone(legacyPhone);
    const updates = {};
    const removals = {};

    if (!String(user.surname || "").trim() && String(user.lastName || "").trim()) {
      updates.surname = String(user.lastName).trim();
    } else if (user.surname === undefined) {
      updates.surname = "";
    }

    if (phoneMeta.fullPhone && phoneMeta.fullPhone !== user.phone) {
      updates.phone = phoneMeta.fullPhone;
    }

    removals.lastName = "";
    removals.phoneCountryCode = "";
    removals.phoneNational = "";
    removals.updated_at = "";

    if (user.role !== "owner") {
      removals.is_online = "";
      removals.last_seen_at = "";
    }

    await User.updateOne(
      { _id: user._id },
      {
        ...(Object.keys(updates).length ? { $set: updates } : {}),
        $unset: removals
      }
    );
  }
}

async function getNormalizedProperties() {
  const docs = await Property.find({}).lean();
  return docs.map((property, index) => normalizeProperty(property, index));
}

async function getOwnerDashboard(ownerId) {
  const ownerObjectId = parseMongoId(ownerId);
  const ownerMatcher = ownerObjectId
    ? { $or: [{ owner_id: ownerId }, { owner_id: ownerObjectId }] }
    : { owner_id: ownerId };

  const [properties, bookings, payments, adminActions, ownerNotifications] = await Promise.all([
    Property.find(ownerMatcher).lean(),
    Booking.find({}).sort({ _id: -1 }).lean(),
    Payment.find({}).sort({ _id: -1 }).lean(),
    AdminAction.find({}).sort({ timestamp: -1 }).limit(5).lean(),
    Notification.find({ recipient_id: String(ownerId) }).sort({ created_at: -1 }).limit(10).lean()
  ]);

  const normalizedProperties = properties.map((property, index) => normalizeProperty(property, index));
  const ownerPropertyIds = new Set(normalizedProperties.map((property) => String(property.id || "")));
  const ownerPropertyTitles = new Set(
    normalizedProperties
      .map((property) => String(property.title || "").trim())
      .filter(Boolean)
  );
  const propertyMap = new Map(normalizedProperties.map((property) => [property.id, property]));
  const users = await User.find({}).lean();
  const userMap = new Map(users.map((user) => [String(user._id), sanitizeUser(user)]));
  const normalizedBookings = bookings
    .map((booking) => normalizeBooking(booking, propertyMap, userMap))
    .filter((booking) => {
      const propertyId = String(booking.propertyId || "");
      const propertyTitle = String(booking.property || "").trim();
      return ownerPropertyIds.has(propertyId) || ownerPropertyTitles.has(propertyTitle);
    });
  const bookingMap = new Map(normalizedBookings.map((booking) => [booking.id, booking]));
  const normalizedPayments = payments
    .filter((payment) => bookingMap.has(String(payment.booking_id || "")))
    .map((payment) => normalizePayment(payment, bookingMap));

  return {
    properties: normalizedProperties,
    bookings: normalizedBookings,
    payments: normalizedPayments,
    notifications: [
      ...ownerNotifications.map((item) => `${item.title}: ${item.message}`),
      ...adminActions.map(normalizeNotification)
    ].slice(0, 12),
    tasks: ownerTasks
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Потрібно вказати ім'я, email і пароль." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedName = String(name).trim();

  if (isBlockedRegistration({ name: normalizedName, email: normalizedEmail })) {
    return res.status(400).json({ message: "Тестові або технічні облікові записи не можна реєструвати." });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "Користувач з таким email вже існує." });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    name: normalizedName,
    surname: "",
    email: normalizedEmail,
    phone: phone ? String(phone).trim() : "",
    role: "client",
    passwordHash,
    joined_at: new Date(),
    verified: true,
    status: "active"
  });

  req.session.user = sanitizeUser(user);
  res.status(201).json({ user: sanitizeUser(user) });
});

app.put("/api/profile", ensureSession, async (req, res) => {
  const { name, surname, lastName, phone, phoneCountryCode, phoneNational } = req.body || {};
  const normalizedName = String(name || "").trim();
  const normalizedSurname = String(surname || lastName || "").trim();
  const legacyPhone = phone ? String(phone).trim() : `${String(phoneCountryCode || "+380").trim()}${String(phoneNational || "").replace(/\D/g, "")}`;
  const normalizedPhone = parseStoredPhone(legacyPhone);

  if (!normalizedName || !normalizedSurname || !normalizedPhone.nationalNumber) {
    return res.status(400).json({ message: "Вкажіть ім'я, прізвище та номер телефону." });
  }

  const user = await User.findByIdAndUpdate(
    req.session.user.id,
    {
      $set: {
        name: normalizedName,
        surname: normalizedSurname,
        phone: normalizedPhone.fullPhone
      },
      $unset: {
        lastName: "",
        phoneCountryCode: "",
        phoneNational: "",
        updated_at: ""
      }
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "Користувача не знайдено." });
  }

  const userIdString = String(user._id);
  const userObjectId = parseMongoId(userIdString);
  const chatAuthorMatcher = user.role === "owner"
    ? {
      sender_role: "owner",
      ...(userObjectId
        ? { $or: [{ owner_id: userIdString }, { owner_id: userObjectId }] }
        : { owner_id: userIdString })
    }
    : {
      sender_role: "client",
      ...(userObjectId
        ? { $or: [{ user_id: userIdString }, { user_id: userObjectId }] }
        : { user_id: userIdString })
    };

  await ChatMessage.updateMany(chatAuthorMatcher, {
    $set: {
      sender_name: normalizedName
    }
  }).catch(() => {});

  req.session.user = sanitizeUser(user);
  res.json({ user: req.session.user });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user?.passwordHash) {
    return res.status(401).json({ message: "Невірний email або пароль." });
  }

  const isValidPassword = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Невірний email або пароль." });
  }

  await setOwnerPresence(user._id, user.role === "owner");
  req.session.user = sanitizeUser(user);
  res.json({ user: sanitizeUser(user) });
});

app.post("/api/auth/logout", (req, res) => {
  const user = req.session.user;

  req.session.destroy(async () => {
    if (user?.role === "owner") {
      await setOwnerPresence(user.id, false);
    }

    res.json({ ok: true });
  });
});

app.get("/api/properties", async (_req, res) => {
  const properties = await getNormalizedProperties();
  res.json({ properties });
});

app.get("/api/properties/:id", async (req, res) => {
  const property = await Property.findById(req.params.id).lean();
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  res.json({ property: normalizeProperty(property) });
});

app.get("/api/bookings/me", ensureSession, async (req, res) => {
  const properties = await getNormalizedProperties();
  const propertyMap = new Map(properties.map((property) => [property.id, property]));
  const user = req.session.user;
  const bookings = await Booking.find({ user_id: user.id }).sort({ _id: -1 }).lean();
  const normalizedBookings = bookings.map((booking) => normalizeBooking(booking, propertyMap));
  res.json({ bookings: normalizedBookings });
});

app.post("/api/promocodes/validate", ensureSession, async (req, res) => {
  const { code, propertyId, checkIn, checkOut } = req.body || {};
  const normalizedCode = normalizePromocodeCode(code);

  if (!normalizedCode) {
    return res.status(400).json({ message: "Введіть промокод для перевірки." });
  }

  if (!propertyId || !checkIn || !checkOut) {
    return res.status(400).json({ message: "Спочатку оберіть житло та дати проживання." });
  }

  const property = await Property.findById(propertyId).lean();
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  const nights = getNightCount(checkIn, checkOut);
  if (!nights) {
    return res.status(400).json({ message: "Оберіть коректні дати проживання." });
  }

  const promo = await findValidPromocode(normalizedCode);
  if (!promo) {
    return res.status(404).json({ message: "Промокод не знайдено або його строк дії завершився." });
  }

  const originalTotal = Number(property.price_per_night || 0) * nights;
  const discountedTotal = calculateDiscountedTotal(originalTotal, promo.discount_percent);

  return res.json({
    promo: {
      code: promo.code,
      discountPercent: Number(promo.discount_percent || 0),
      originalTotal,
      discountedTotal,
      savingsAmount: Math.max(originalTotal - discountedTotal, 0)
    }
  });
});

app.post("/api/bookings", ensureSession, async (req, res) => {
  const { propertyId, checkIn, checkOut, guestName, promocodeCode } = req.body || {};
  if (!propertyId || !checkIn || !checkOut) {
    return res.status(400).json({ message: "Потрібно вказати житло та дати проживання." });
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
    return res.status(400).json({ message: "Некоректні дати бронювання." });
  }

  const unavailableDates = buildUnavailableDates(startDate, endDate);
  const existingUnavailableDates = Array.isArray(property.unavailable_dates) ? property.unavailable_dates : [];
  const hasOverlap = unavailableDates.some((date) => existingUnavailableDates.includes(date));
  if (hasOverlap) {
    return res.status(409).json({ message: "Обрані дати вже недоступні для цього житла." });
  }

  const nights = getNightCount(checkIn, checkOut);
  const originalTotalPrice = Number(property.price_per_night || 0) * nights;
  let totalPrice = originalTotalPrice;
  let promoCode = "";
  let discountPercent = 0;

  if (promocodeCode) {
    const promo = await findValidPromocode(promocodeCode);
    if (!promo) {
      return res.status(400).json({ message: "Промокод не знайдено або його строк дії завершився." });
    }

    promoCode = promo.code;
    discountPercent = Number(promo.discount_percent || 0);
    totalPrice = calculateDiscountedTotal(originalTotalPrice, discountPercent);
  }

  const booking = await Booking.create({
    user_id: req.session.user.id,
    property_id: property._id,
    guest_name: guestName || req.session.user.name,
    property_title: property.title,
    check_in: startDate,
    check_out: endDate,
    original_total_price: originalTotalPrice,
    total_price: totalPrice,
    promo_code: promoCode,
    discount_percent: discountPercent,
    status: "new",
    status_history: [
      {
        status: "new",
        date: new Date(),
        note: "Бронювання створено через сайт BookMe"
      }
    ],
    updated_at: new Date()
  });

  property.unavailable_dates = [...existingUnavailableDates, ...unavailableDates];
  property.status = deriveStatus(property);
  await property.save();

  await Payment.create({
    booking_id: booking._id,
    amount: totalPrice,
    payment_method: "Онлайн оплата",
    payment_status: "pending",
    payment_date: new Date(),
    status: "pending"
  });

  await createNotification({
    recipientId: req.session.user.id,
    recipientRole: req.session.user.role,
    title: "Бронювання створено",
    message: `Ваше бронювання для \"${property.title}\" успішно надіслано власнику.`,
    type: "booking"
  });

  const ownerId = property.owner_id ? String(property.owner_id) : null;
  if (ownerId) {
    await createNotification({
      recipientId: ownerId,
      recipientRole: "owner",
      title: "Новий запит на бронювання",
      message: `Користувач ${guestName || req.session.user.name} хоче забронювати \"${property.title}\" на період ${formatDateRange(startDate, endDate)}.`,
      type: "booking-request"
    });
  }

  res.status(201).json({
    booking: normalizeBooking(booking.toObject(), new Map([[String(property._id), normalizeProperty(property.toObject())]]), new Map([[req.session.user.id, req.session.user]]))
  });
});

app.patch("/api/owner/bookings/:id/status", ensureSession, async (req, res) => {
  const nextStatus = normalizeBookingStatus(req.body?.status);
  const rejectionReason = String(req.body?.rejectionReason || "").trim();
  if (!["confirmed", "completed", "rejected"].includes(nextStatus)) {
    return res.status(400).json({ message: "Некоректний статус бронювання." });
  }
  if (nextStatus === "rejected" && !rejectionReason) {
    return res.status(400).json({ message: "Вкажіть причину відхилення." });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Бронювання не знайдено." });
  }

  const propertyDoc = await resolvePropertyForBooking(booking);
  const property = propertyDoc ? propertyDoc.toObject() : null;
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  if (String(property.owner_id || "") !== String(req.session.user.id)) {
    return res.status(403).json({ message: "Ви не можете змінювати це бронювання." });
  }

  booking.status = nextStatus;
  booking.updated_at = new Date();
  booking.status_history = [
    ...(Array.isArray(booking.status_history) ? booking.status_history : []),
    {
      status: nextStatus,
      date: new Date(),
      note: nextStatus === "confirmed" ? "Власник підтвердив бронювання" : nextStatus === "completed" ? "Бронювання завершено" : `Бронювання відхилено. Причина: ${rejectionReason}`
    }
  ];
  await booking.save();

  if (["confirmed", "completed"].includes(nextStatus)) {
    await Payment.updateMany(
      buildMixedIdMatcher("booking_id", booking._id) || { booking_id: booking._id },
      {
        $set: {
          payment_status: "completed",
          status: "completed"
        }
      }
    );
  }
  if (nextStatus === "rejected") {
    await Payment.updateMany(
      buildMixedIdMatcher("booking_id", booking._id) || { booking_id: booking._id },
      {
        $set: {
          payment_status: "cancelled",
          status: "cancelled"
        }
      }
    ).catch(() => {});
  }

  let notificationTitle, notificationMessage;
  if (nextStatus === "confirmed") {
    notificationTitle = "Бронювання підтверджено";
    notificationMessage = `Власник підтвердив бронювання для \"${property.title}\".`;
  } else if (nextStatus === "completed") {
    notificationTitle = "Бронювання завершено";
    notificationMessage = `Ваше бронювання для \"${property.title}\" позначено як завершене.`;
  } else if (nextStatus === "rejected") {
    notificationTitle = "Бронювання відхилено";
    notificationMessage = `Власник відхилив ваше бронювання для \"${property.title}\". Причина: ${rejectionReason}`;
  }

  await createNotification({
    recipientId: booking.user_id,
    recipientRole: "client",
    title: notificationTitle,
    message: notificationMessage,
    type: "booking-status"
  });

  res.json({
    booking: normalizeBooking(booking.toObject(), new Map([[String(property._id), normalizeProperty(property)]]), new Map())
  });
});

app.post("/api/owner/properties", ensureSession, async (req, res) => {
  const {
    title,
    city,
    type,
    guests,
    price,
    address,
    description,
    amenities,
    images,
    image
  } = req.body || {};

  if (!title || !city || !type || !guests || !price || !address || !description) {
    return res.status(400).json({ message: "Заповніть основні дані про житло." });
  }

  const parsedAmenities = String(amenities || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const customImages = Array.isArray(images) && images.length
    ? images
    : (String(image || "").trim() ? [image] : []);

  if (!customImages.length) {
    return res.status(400).json({ message: "Додайте хоча б одне фото житла." });
  }

  if (customImages.length > 7) {
    return res.status(400).json({ message: "Можна додати не більше 7 фото." });
  }

  const ownerImageLimit = 3 * 1024 * 1024;
  const ownerImagePattern = /^data:image\/(png|jpeg|webp);base64,/i;

  for (const customImage of customImages) {
    let value = String(customImage || "").trim();

    // If image is a CSS-wrapped string like "linear-gradient(...), url('...')", try to extract inner url(...)
    const urlMatch = value.match(/url\(['"]?(.*?)['"]?\)/i);
    if (urlMatch && urlMatch[1]) {
      value = urlMatch[1];
    }

    // If it's still a linear-gradient fallback without url, try to find data: inside
    if (!ownerImagePattern.test(value) && /data:image\//i.test(value)) {
      const dataMatch = value.match(/(data:image\/[a-z]+;base64,[^'"\)\s]+)/i);
      if (dataMatch) {
        value = dataMatch[1];
      }
    }

    // Accept either data URLs or remote http(s) URLs (we allow keeping existing remote images)
    if (!ownerImagePattern.test(value) && !/^https?:\/\//i.test(value)) {
      return res.status(400).json({ message: "Фото має бути у форматі PNG, JPG або WEBP або коректним URL." });
    }

    if (ownerImagePattern.test(value)) {
      const base64Data = value.split(",")[1] || "";
      const imageSize = Buffer.byteLength(base64Data, "base64");
      if (imageSize > ownerImageLimit) {
        return res.status(400).json({ message: "Фото завелике. Оберіть файл до 3 МБ." });
      }
    }
  }

  const propertyImages = customImages.map((item) => String(item || "").trim()).filter(Boolean);

  const property = await Property.create({
    title: String(title).trim(),
    city: String(city).trim(),
    type: String(type).trim(),
    guests: Number(guests),
    price_per_night: Number(price),
    address: String(address).trim(),
    description: String(description).trim(),
    amenities: parsedAmenities,
    owner_id: req.session.user.id,
    status: "Доступне",
    images: propertyImages,
    image: propertyImages[0] || "",
    check_in_time: "14:00",
    check_out_time: "11:00",
    unavailable_dates: []
  });

  const updatedSessionUser = await syncUserRoleWithProperties(req.session.user.id);
  if (updatedSessionUser) {
    req.session.user = updatedSessionUser;
  }

  res.status(201).json({ property: normalizeProperty(property.toObject()) });
});

app.delete("/api/owner/properties/:id", ensureSession, async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  if (String(property.owner_id || "") !== String(req.session.user.id)) {
    return res.status(403).json({ message: "Ви не можете видалити це житло." });
  }

  const relatedBookings = await Booking.exists({ property_id: property._id });
  if (relatedBookings) {
    return res.status(409).json({ message: "Не можна видалити житло, яке вже має бронювання." });
  }

  await property.deleteOne();

  const updatedSessionUser = await syncUserRoleWithProperties(req.session.user.id);
  if (updatedSessionUser) {
    req.session.user = updatedSessionUser;
  }

  res.json({ ok: true });
});

app.put("/api/owner/properties/:id", ensureSession, async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  if (String(property.owner_id || "") !== String(req.session.user.id)) {
    return res.status(403).json({ message: "Ви не можете редагувати це житло." });
  }

  const {
    title,
    city,
    type,
    guests,
    price,
    address,
    description,
    amenities,
    images,
    image
  } = req.body || {};

  if (!title || !city || !type || !guests || !price || !address || !description) {
    return res.status(400).json({ message: "Заповніть основні дані про житло." });
  }

  const parsedAmenities = String(amenities || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const customImages = Array.isArray(images) && images.length
    ? images
    : (String(image || "").trim() ? [image] : []);

  if (!customImages.length) {
    return res.status(400).json({ message: "Додайте хоча б одне фото житла." });
  }

  if (customImages.length > 7) {
    return res.status(400).json({ message: "Можна додати не більше 7 фото." });
  }

  const ownerImageLimit = 3 * 1024 * 1024;
  const ownerImagePattern = /^data:image\/(png|jpeg|webp);base64,/i;

  for (const customImage of customImages) {
    const value = String(customImage || "").trim();
    if (!ownerImagePattern.test(value)) {
      return res.status(400).json({ message: "Фото має бути у форматі PNG, JPG або WEBP." });
    }

    const base64Data = value.split(",")[1] || "";
    const imageSize = Buffer.byteLength(base64Data, "base64");
    if (imageSize > ownerImageLimit) {
      return res.status(400).json({ message: "Фото завелике. Оберіть файл до 3 МБ." });
    }
  }

  const propertyImages = customImages.map((item) => String(item || "").trim()).filter(Boolean);

  property.title = String(title).trim();
  property.city = String(city).trim();
  property.type = String(type).trim();
  property.guests = Number(guests);
  property.price_per_night = Number(price);
  property.address = String(address).trim();
  property.description = String(description).trim();
  property.amenities = parsedAmenities;
  property.images = propertyImages;
  property.image = propertyImages[0] || "";

  await property.save();

  res.json({ property: normalizeProperty(property.toObject()) });
});

app.patch("/api/bookings/:id/cancel", ensureSession, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Бронювання не знайдено." });
  }

  if (String(booking.user_id || "") !== String(req.session.user.id)) {
    return res.status(403).json({ message: "Ви не можете скасувати це бронювання." });
  }

  const normalizedStatus = normalizeBookingStatus(booking.status);
  if (!["new", "confirmed"].includes(normalizedStatus)) {
    return res.status(409).json({ message: "Це бронювання вже не можна скасувати." });
  }

  const property = await resolvePropertyForBooking(booking);
  const propertyTitle = String(property?.title || booking.property_title || "Об'єкт");

  if (property) {
    const blockedDates = buildUnavailableDates(booking.check_in, booking.check_out);
    const existingUnavailableDates = Array.isArray(property.unavailable_dates) ? property.unavailable_dates : [];
    property.unavailable_dates = existingUnavailableDates.filter((date) => !blockedDates.includes(date));
    property.status = deriveStatus(property);
    await property.save();
  }

  booking.status = "cancelled";
  booking.updated_at = new Date();
  booking.status_history = [
    ...(Array.isArray(booking.status_history) ? booking.status_history : []),
    {
      status: "cancelled",
      date: new Date(),
      note: "Користувач скасував бронювання"
    }
  ];
  await booking.save();

  await Payment.updateMany(
    buildMixedIdMatcher("booking_id", booking._id) || { booking_id: booking._id },
    {
      $set: {
        payment_status: "cancelled",
        status: "cancelled"
      }
    }
  ).catch(() => {});

  const ownerId = property?.owner_id ? String(property.owner_id) : null;
  if (ownerId) {
    await createNotification({
      recipientId: ownerId,
      recipientRole: "owner",
      title: "Бронювання скасовано",
      message: `Користувач скасував бронювання для \"${propertyTitle}\".`,
      type: "booking-cancelled"
    });
  }

  await createNotification({
    recipientId: req.session.user.id,
    recipientRole: req.session.user.role,
    title: "Бронювання скасовано",
    message: `Ви скасували бронювання для \"${propertyTitle}\".`,
    type: "booking-cancelled"
  });

  const normalizedProperty = property ? normalizeProperty(property.toObject()) : null;
  res.json({
    booking: normalizeBooking(
      booking.toObject(),
      normalizedProperty ? new Map([[String(normalizedProperty.id), normalizedProperty]]) : new Map(),
      new Map([[req.session.user.id, req.session.user]])
    )
  });
});

app.get("/api/chat/:propertyId", ensureSession, async (req, res) => {
  const propertyId = String(req.params.propertyId || "");
  const property = await Property.findById(propertyId).lean();
  const propertyIdMatch = buildPropertyIdMatch(property?._id || propertyId);
  const ownerId = String(property?.owner_id || "");
  const user = req.session.user;
  const requestedUserId = String(req.query.userId || "");

  // Fallback: if a session has a non-owner role but this account is owner_id in chat history,
  // still allow owner-style chat retrieval for legacy/inconsistent role states.
  const hasOwnerThreadAccess = Boolean(
    await ChatMessage.exists({
      property_id: propertyIdMatch,
      owner_id: buildUserIdMatch(user.id),
      is_deleted: { $ne: true }
    })
  );
  const useOwnerFlow = user.role === "owner" || hasOwnerThreadAccess;

  if (useOwnerFlow) {
    const targetUserId = requestedUserId;

    const hasOwnerAccess = property
      ? String(property.owner_id || "") === String(user.id)
      : hasOwnerThreadAccess;

    if (!hasOwnerAccess) {
      return res.status(403).json({ message: "Немає доступу до цього чату." });
    }

    if (!targetUserId) {
      // Group by user_id and normalize to string so mixed ObjectId/string values behave consistently
      const threads = await ChatMessage.aggregate([
        { $match: { property_id: propertyIdMatch, is_deleted: { $ne: true } } },
        { $sort: { created_at: -1 } },
        {
          $group: {
            _id: { $toString: "$user_id" },
            lastMessage: { $first: "$message" },
            lastAt: { $first: "$created_at" }
          }
        }
      ]);

      const userIdStrings = threads.map((thread) => String(thread._id)).filter(Boolean);
      // Find users by stringified _id to match both string and ObjectId representations
      const users = await User.find({ $expr: { $in: [{ $toString: "$_id" }, userIdStrings] } }).lean();
      const userMap = new Map(users.map((item) => [String(item._id), sanitizeUser(item)]));

      return res.json({
        ownerStatus: ownerPresenceText(await User.findById(user.id).lean()),
        threads: threads.map((thread) => ({
          userId: String(thread._id),
          userName: userMap.get(String(thread._id))?.name || "Користувач",
          lastMessage: thread.lastMessage || "",
          relativeTime: relativeTimeUk(thread.lastAt)
        })),
        messages: []
      });
    }

    const messages = await ChatMessage.find({
      property_id: propertyIdMatch,
      user_id: buildUserIdMatch(targetUserId),
      is_deleted: { $ne: true }
    }).sort({ created_at: 1 }).lean();

    // Mark unread messages from client as read
    await ChatMessage.updateMany(
      {
        property_id: propertyIdMatch,
        user_id: buildUserIdMatch(targetUserId),
        sender_role: "client",
        is_read: false
      },
      { $set: { is_read: true } }
    );

    return res.json({
      ownerStatus: ownerPresenceText(await User.findById(user.id).lean()),
      threads: [],
      messages: messages.map(msg => chatMessageDto(msg, user.role))
    });
  }

  const messages = await ChatMessage.find({
    property_id: propertyIdMatch,
    user_id: buildUserIdMatch(user.id),
    is_deleted: { $ne: true }
  }).sort({ created_at: 1 }).lean();

  // For orphaned chats (property removed but messages still exist), return empty/available history instead of 404.

  // Mark unread messages from owner as read
  await ChatMessage.updateMany(
    {
      property_id: propertyIdMatch,
      user_id: buildUserIdMatch(user.id),
      sender_role: "owner",
      is_read: false
    },
    { $set: { is_read: true } }
  );

  const fallbackOwnerId = String(messages[0]?.owner_id || "");
  const resolvedOwnerId = ownerId || fallbackOwnerId;
  const owner = resolvedOwnerId
    ? await User.findOne({ _id: buildUserIdMatch(resolvedOwnerId) }).lean()
    : null;
  return res.json({
    ownerStatus: ownerPresenceText(owner),
    threads: [],
    messages: messages.map(msg => chatMessageDto(msg, user.role))
  });
});

app.post("/api/chat/:propertyId", ensureSession, async (req, res) => {
  const propertyId = String(req.params.propertyId || "");
  const property = await Property.findById(propertyId).lean();

  const text = String(req.body?.message || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Повідомлення не може бути порожнім." });
  }

  const user = req.session.user;
  const ownerId = String(property?.owner_id || user.id || "");
  const targetUserId = user.role === "owner" ? String(req.body?.targetUserId || "") : String(user.id);
  const hasOwnerThreadAccess = Boolean(
    await ChatMessage.exists({
      property_id: buildPropertyIdMatch(propertyId),
      owner_id: buildUserIdMatch(user.id),
      is_deleted: { $ne: true }
    })
  );
  const useOwnerFlow = user.role === "owner" || hasOwnerThreadAccess;

  if (!property) {
    if (!useOwnerFlow) {
      return res.status(404).json({ message: "Житло не знайдено." });
    }

    const canReplyToExistingThread = await ChatMessage.exists({
      property_id: buildPropertyIdMatch(propertyId),
      owner_id: buildUserIdMatch(user.id),
      user_id: buildUserIdMatch(targetUserId),
      is_deleted: { $ne: true }
    });

    if (!canReplyToExistingThread) {
      return res.status(404).json({ message: "Житло не знайдено." });
    }
  }

  if (!ownerId) {
    return res.status(400).json({ message: "Для цього об'єкта не знайдено власника." });
  }

  if (!useOwnerFlow && !user.isForeignPhone) {
    return res.status(403).json({ message: "Чат доступний лише для номерів неукраїнського формату." });
  }

  if (useOwnerFlow && !targetUserId) {
    return res.status(400).json({ message: "Оберіть користувача для відповіді." });
  }

  const message = await ChatMessage.create({
    property_id: String(property?._id || propertyId),
    user_id: targetUserId,
    owner_id: ownerId,
    sender_role: useOwnerFlow ? "owner" : user.role,
    sender_name: user.name,
    message: text,
    created_at: new Date()
  });

  if (useOwnerFlow) {
    await createNotification({
      recipientId: targetUserId,
      recipientRole: "client",
      title: "Відповідь власника у чаті",
      message: `Власник відповів у чаті щодо житла "${property?.title || "Невідоме житло"}".`,
      type: "chat-reply"
    });
  } else {
    if (user.isForeignPhone) {
      await createNotification({
        recipientId: ownerId,
        recipientRole: "owner",
        title: "Нове повідомлення в чаті",
        message: `Користувач ${user.name} написав щодо житла \"${property.title}\".`,
        type: "chat-message"
      });
    }
  }

  res.status(201).json({ message: chatMessageDto(message, user.role) });
});

// Delete a chat message for everyone (soft delete)
app.delete("/api/chat/:propertyId/:messageId", ensureSession, async (req, res) => {
  const property = await Property.findById(req.params.propertyId).lean();
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  const user = req.session.user;
  const messageId = String(req.params.messageId || "");

  const msg = await ChatMessage.findOne({ _id: messageId, property_id: buildPropertyIdMatch(property._id) }).lean();
  if (!msg) {
    return res.status(404).json({ message: "Повідомлення не знайдено." });
  }

  // Authorization: both sides can delete only their own messages
  if (user.role === "owner") {
    if (String(property.owner_id) !== String(user.id)) {
      return res.status(403).json({ message: "Немає доступу." });
    }
    if (String(msg.sender_role || "") !== "owner" || String(msg.owner_id || "") !== String(user.id)) {
      return res.status(403).json({ message: "Можна видаляти лише власні повідомлення." });
    }
  } else {
    // client
    if (String(msg.user_id) !== String(user.id) || String(msg.sender_role || "") !== "client") {
      return res.status(403).json({ message: "Немає доступу." });
    }
  }

  await ChatMessage.updateOne({ _id: messageId }, { $set: { is_deleted: true, deleted_at: new Date(), deleted_by: String(user.id) } });

  return res.json({ success: true });
});

// Edit a chat message
app.patch("/api/chat/:propertyId/:messageId", ensureSession, async (req, res) => {
  const property = await Property.findById(req.params.propertyId).lean();
  if (!property) {
    return res.status(404).json({ message: "Житло не знайдено." });
  }

  const user = req.session.user;
  const messageId = String(req.params.messageId || "");
  const nextMessage = String(req.body?.message || "").trim();

  if (!nextMessage) {
    return res.status(400).json({ message: "Повідомлення не може бути порожнім." });
  }

  const msg = await ChatMessage.findOne({ _id: messageId, property_id: buildPropertyIdMatch(property._id), is_deleted: { $ne: true } }).lean();
  if (!msg) {
    return res.status(404).json({ message: "Повідомлення не знайдено." });
  }

  const isOwnClientMessage = user.role === "client" && String(msg.user_id) === String(user.id);
  const isOwnOwnerMessage = user.role === "owner" && String(msg.owner_id) === String(user.id) && msg.sender_role === "owner";

  if (!isOwnClientMessage && !isOwnOwnerMessage) {
    return res.status(403).json({ message: "Немає доступу." });
  }

  await ChatMessage.updateOne(
    { _id: messageId },
    { $set: { message: nextMessage, edited_at: new Date(), edited_by: String(user.id) } }
  );

  const updated = await ChatMessage.findById(messageId).lean();
  return res.json({ message: chatMessageDto(updated, user.role) });
});

// Get list of chats for the current user
app.get("/api/user-chats", ensureSession, async (req, res) => {
  const user = req.session.user;
  if (user.role !== "owner" && !user.isForeignPhone) {
    return res.status(403).json({ message: "Чати доступні лише користувачам із неукраїнським номером телефону." });
  }

  const ownerObjectId = parseMongoId(user.id);
  const ownedProperties = user.role === "owner"
    ? await Property.find(ownerObjectId
      ? { $or: [{ owner_id: String(user.id) }, { owner_id: ownerObjectId }] }
      : { owner_id: String(user.id) }).select({ _id: 1, title: 1 }).lean()
    : [];

  const ownerIdMatcher = buildUserIdMatch(user.id);
  const ownedPropertyIds = ownedProperties.map((property) => String(property._id));
  const ownedPropertyObjectIds = ownedPropertyIds.map(parseMongoId).filter(Boolean);
  const matchStage = user.role === "owner"
    ? {
        $or: [
          { property_id: { $in: [...ownedPropertyIds, ...ownedPropertyObjectIds] } },
          { owner_id: ownerIdMatcher }
        ]
      }
    : { user_id: buildUserIdMatch(user.id) };

  const groupStage = user.role === "owner"
    ? {
        $group: {
          _id: {
            propertyId: "$property_id",
            userId: { $toString: "$user_id" }
          },
          lastMessage: { $first: "$message" },
          lastAt: { $first: "$created_at" },
          ownerId: { $first: "$owner_id" },
          userId: { $first: { $toString: "$user_id" } }
        }
      }
    : {
        $group: {
          _id: "$property_id",
          lastMessage: { $first: "$message" },
          lastAt: { $first: "$created_at" },
          ownerId: { $first: "$owner_id" },
          ownerName: { $first: "$sender_name" },
          userId: { $first: "$user_id" }
        }
      };

  const chats = await ChatMessage.aggregate([
    { $match: { ...matchStage, is_deleted: { $ne: true } } },
    { $sort: { created_at: -1 } },
    groupStage
  ]);

  // Fetch property details for each chat — match by stringified _id to handle mixed types
  const propertyIdStrings = chats
    .map((c) => user.role === "owner" ? String(c._id?.propertyId || "") : String(c._id || ""))
    .filter(Boolean);
  const properties = await Property.find({ $expr: { $in: [{ $toString: "$_id" }, propertyIdStrings] } }).lean();
  const propertyMap = new Map(properties.map((p) => [String(p._id), p]));

  const threadUserIdStrings = user.role === "owner"
    ? chats.map((chat) => String(chat.userId || "")).filter(Boolean)
    : [];
  const threadUsers = threadUserIdStrings.length
    ? await User.find({ $expr: { $in: [{ $toString: "$_id" }, threadUserIdStrings] } }).lean()
    : [];
  const threadUserMap = new Map(threadUsers.map((item) => [String(item._id), sanitizeUser(item)]));

  const result = chats.map((chat) => {
    const propertyId = user.role === "owner"
      ? String(chat._id?.propertyId || "")
      : String(chat._id || "");
    const property = propertyMap.get(propertyId) || {};
    const propertyExists = Boolean(property?._id);
    const counterpartName = user.role === "owner"
      ? (threadUserMap.get(String(chat.userId || ""))?.name || "Користувач")
      : (chat.ownerName || "Власник");

    return {
      propertyId,
      propertyTitle: property.title || "Житло недоступне",
      propertyExists,
      lastMessage: chat.lastMessage || "",
      relativeTime: relativeTimeUk(chat.lastAt),
      ownerId: String(chat.ownerId || ""),
      ownerName: counterpartName,
      userId: user.role === "owner" ? String(chat.userId || "") : String(user.id)
    };
  });

  res.json({ chats: result });
});

app.get("/api/notifications", ensureSession, async (req, res) => {
  const notifications = await getUserNotifications(req.session.user.id);
  res.json(notifications);
});

app.post("/api/notifications/read-all", ensureSession, async (req, res) => {
  await Notification.updateMany(
    { recipient_id: String(req.session.user.id), is_read: false },
    { $set: { is_read: true } }
  );

  const notifications = await getUserNotifications(req.session.user.id);
  res.json(notifications);
});

app.get("/api/owner/dashboard", ensureSession, async (req, res) => {
  const dashboard = await getOwnerDashboard(req.session.user.id);
  res.json(dashboard);
});

app.get("/api/bootstrap", ensureSession, async (req, res) => {
  const storedUser = await User.findById(req.session.user.id).lean();
  if (!storedUser) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: "Потрібно увійти в акаунт." });
  }

  req.session.user = sanitizeUser(storedUser);
  await syncExpiredBookingsForUserContext(req.session.user);
  await ensureBookingRemindersForUser(req.session.user);

  const properties = await getNormalizedProperties();
  const propertyMap = new Map(properties.map((property) => [property.id, property]));
  const userObjectId = parseMongoId(req.session.user.id);
  const bookingsQuery = userObjectId
    ? { $or: [{ user_id: req.session.user.id }, { user_id: userObjectId }] }
    : { user_id: req.session.user.id };
  const bookings = await Booking.find(bookingsQuery).sort({ _id: -1 }).lean();
  const normalizedBookings = bookings.map((booking) => normalizeBooking(booking, propertyMap));
  const payload = {
    user: req.session.user,
    properties,
    bookings: normalizedBookings,
    notifications: await getUserNotifications(req.session.user.id)
  };

  payload.owner = await getOwnerDashboard(req.session.user.id);

  res.json(payload);
});

// Serve static files from the public folder (use __dirname which is derived above)
app.use(express.static(path.join(__dirname, 'public')));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', "index.html"));
});

async function connectDatabase() {
  await mongoose.connect(MONGODB_URI);
  console.log("BookMe database connected");
}

connectDatabase()
  .then(() => {
    console.log("Connected to database successfully");
    
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`BookMe server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

export default app;