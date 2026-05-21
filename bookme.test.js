import { jest } from "@jest/globals";

import {
  credentialsMatch,
  createToastController,
  filterProperties,
  formatMoney,
  getBookingTotal,
  getDiscountedBookingTotal,
  getNights,
  getStatusClass,
  isProfileReadyForBooking,
  normalizePromocodeInputValue,
  showPage
} from "./bookme-test-helpers.js";

describe("Авторизація та профіль користувача", () => {
  test("Test 1: Авторизація повертає true для валідних credentials", () => {
    expect(credentialsMatch("owner@example.com", "SecurePass!123", "owner@example.com", "SecurePass!123")).toBe(true);
  });

  test("Test 2: Авторизація повертає false для невалідного пароля", () => {
    expect(credentialsMatch("owner@example.com", "wrongpass", "owner@example.com", "SecurePass!123")).toBe(false);
  });

  test("Test 3: Неповний профіль не допускається до бронювання", () => {
    expect(
      isProfileReadyForBooking({
        name: "Ігор",
        surname: "",
        phone: "+380971234567"
      })
    ).toBe(false);
  });
});

describe("SPA-навігація та фільтрація каталогу", () => {
  test("Test 4: showPage активує лише вибрану сторінку", () => {
    document.body.innerHTML = `
      <section id="home-page" class="page active"></section>
      <section id="catalog-page" class="page"></section>
      <section id="details-page" class="page"></section>
    `;

    showPage(document, "catalog");

    expect(document.getElementById("home-page").classList.contains("active")).toBe(false);
    expect(document.getElementById("catalog-page").classList.contains("active")).toBe(true);
    expect(document.getElementById("details-page").classList.contains("active")).toBe(false);
  });

  test("Test 5: Фільтрація повертає лише відповідні об'єкти житла", () => {
    const properties = [
      { city: "Львів", type: "Апартаменти", guests: 2, price: 2500 },
      { city: "Київ", type: "Будинок", guests: 6, price: 5200 },
      { city: "Львів", type: "Квартира", guests: 4, price: 3200 }
    ];

    const result = filterProperties(properties, {
      city: "Львів",
      type: "all",
      guests: 2,
      maxPrice: 3000
    });

    expect(result).toHaveLength(1);
    expect(result[0].city).toBe("Львів");
    expect(result[0].price).toBe(2500);
  });
});

describe("Розрахунок вартості бронювання", () => {
  test("Test 6: Кількість ночей між двома датами рахується коректно", () => {
    expect(getNights("2026-04-10", "2026-04-13")).toBe(3);
  });

  test("Test 7: Загальна вартість бронювання обчислюється правильно", () => {
    expect(getBookingTotal(1900, 4)).toBe(7600);
  });

  test("Test 8: Промокод знижує вартість бронювання на заданий відсоток", () => {
    expect(getDiscountedBookingTotal(10000, 10)).toBe(9000);
    expect(getDiscountedBookingTotal(3800, 15)).toBe(3230);
  });
});

describe("Допоміжні функції інтерфейсу", () => {
  test("Test 9: UI helper-функції повертають коректні значення", () => {
    expect(getStatusClass("Доступне")).toBe("status-pill--available");
    expect(getStatusClass("Заброньовано")).toBe("status-pill--booked");
    expect(formatMoney(4250)).toBe("4250 грн");
    expect(normalizePromocodeInputValue(" lviv2026 ")).toBe("LVIV2026");
  });

  test("Test 10: Toast-повідомлення автоматично зникає через 3.5 секунди", () => {
    jest.useFakeTimers();

    const toast = createToastController();
    toast.showToast();

    expect(toast.state.isVisible).toBe(true);

    jest.advanceTimersByTime(3500);
    expect(toast.state.isVisible).toBe(false);

    jest.useRealTimers();
  });
});