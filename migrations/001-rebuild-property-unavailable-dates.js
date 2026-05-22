import { buildUnavailableDates, normalizeBookingStatus } from './utils.js';

export const name = '001-rebuild-property-unavailable-dates';

export async function up({ db }) {
  const properties = db.collection('Properties');
  const bookings = db.collection('Bookings');

  const allBookings = await bookings.find({}).toArray();
  const activeBookingsByProperty = new Map();

  for (const booking of allBookings) {
    const normalizedStatus = normalizeBookingStatus(booking.status);
    if (!['new', 'confirmed'].includes(normalizedStatus)) {
      continue;
    }

    const propertyId = String(booking.property_id || '');
    if (!propertyId) {
      continue;
    }

    const dates = buildUnavailableDates(booking.check_in, booking.check_out);
    if (!dates.length) {
      continue;
    }

    const existing = activeBookingsByProperty.get(propertyId) || new Set();
    dates.forEach((date) => existing.add(date));
    activeBookingsByProperty.set(propertyId, existing);
  }

  const propertyDocs = await properties.find({}).toArray();
  let updatedCount = 0;

  for (const property of propertyDocs) {
    const propertyId = String(property._id);
    const nextUnavailableDates = Array.from(activeBookingsByProperty.get(propertyId) || new Set()).sort();
    const currentUnavailableDates = Array.isArray(property.unavailable_dates) ? property.unavailable_dates : [];

    const sameLength = currentUnavailableDates.length === nextUnavailableDates.length;
    const sameValues = sameLength && currentUnavailableDates.every((date, index) => String(date) === String(nextUnavailableDates[index]));
    if (sameValues) {
      continue;
    }

    await properties.updateOne(
      { _id: property._id },
      { $set: { unavailable_dates: nextUnavailableDates } }
    );

    updatedCount += 1;
  }

  console.log(`Rebuilt unavailable dates for ${updatedCount} property document(s).`);
}

export async function down({ db }) {
  const properties = db.collection('Properties');
  const propertyDocs = await properties.find({}).toArray();

  for (const property of propertyDocs) {
    if (Array.isArray(property.unavailable_dates) && property.unavailable_dates.length) {
      await properties.updateOne(
        { _id: property._id },
        { $set: { unavailable_dates: [] } }
      );
    }
  }
}