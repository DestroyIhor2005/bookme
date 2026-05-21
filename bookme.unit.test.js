import { jest } from "@jest/globals";

import {
  credentialsMatch,
  formatMoney,
  getBookingTotal,
  getDiscountedBookingTotal,
  getNights,
  getStatusClass,
  isProfileReadyForBooking,
  normalizePromocodeInputValue
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
});
