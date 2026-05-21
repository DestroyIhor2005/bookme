import { jest } from "@jest/globals";

import {
  createToastController,
  filterProperties,
  showPage
} from "./bookme-test-helpers.js";

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

describe("User Interactions", () => {
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
