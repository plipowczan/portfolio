import { test } from "node:test";
import assert from "node:assert/strict";

import { formatCalendarDate } from "../../src/utils/formatCalendarDate.js";

// Strony prawne pokazywały `new Date()` z chwili renderu. Stała data z pliku
// ma znaczyć ten sam dzień dla każdego, a odwiedzający na zachód od UTC
// dostałby dzień wcześniej, gdyby formatować ją w jego strefie. Test ustawia
// taką strefę na czas wywołania.

const inZone = (zone, fn) => {
  const previous = process.env.TZ;
  process.env.TZ = zone;
  try {
    return fn();
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
};

test("strefa na zachód od UTC nie cofa dnia", () => {
  inZone("America/Los_Angeles", () => {
    assert.equal(formatCalendarDate("2026-10-28", "pl-PL"), "28.10.2026");
    assert.equal(formatCalendarDate("2026-10-28", "en-US"), "10/28/2026");
  });
});

test("strefa na wschód od UTC nie przesuwa dnia", () => {
  inZone("Pacific/Kiritimati", () => {
    assert.equal(formatCalendarDate("2026-01-01", "pl-PL"), "1.01.2026");
  });
});
