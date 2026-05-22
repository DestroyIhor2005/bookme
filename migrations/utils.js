export function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day));
}

export function buildUnavailableDates(checkIn, checkOut) {
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);

  if (!start || !end) {
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

export function normalizeBookingStatus(status) {
  const rawStatus = String(status || '').trim().toLowerCase();

  if (['new', 'pending', 'очікує підтвердження', 'нове'].includes(rawStatus)) {
    return 'new';
  }

  if (['confirmed', 'заброньовано', 'підтверджено', 'paid', 'оплачено'].includes(rawStatus)) {
    return 'confirmed';
  }

  if (['completed', 'завершено', 'done'].includes(rawStatus)) {
    return 'completed';
  }

  if (['cancelled', 'canceled', 'скасовано'].includes(rawStatus)) {
    return 'cancelled';
  }

  if (['rejected', 'відхилено', 'відмовлено', 'відмовлено власником', 'відмовлено господарем'].includes(rawStatus)) {
    return 'rejected';
  }

  return 'new';
}