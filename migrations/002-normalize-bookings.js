import { normalizeBookingStatus } from './utils.js';

export const name = '002-normalize-bookings';

export async function up({ db }) {
  const bookings = db.collection('Bookings');
  const allBookings = await bookings.find({}).toArray();
  let updatedCount = 0;

  for (const booking of allBookings) {
    const nextStatus = normalizeBookingStatus(booking.status);
    const nextStatusHistory = Array.isArray(booking.status_history) && booking.status_history.length
      ? booking.status_history
      : [{
          status: nextStatus,
          date: booking.updated_at || booking.date || new Date(),
          note: 'legacy backfill'
        }];
    const updates = {};
    if (String(booking.status || '') !== nextStatus) {
      updates.status = nextStatus;
    }

    const hasHistory = Array.isArray(booking.status_history) && booking.status_history.length;
    if (!hasHistory) {
      updates.status_history = nextStatusHistory;
    }

    if (!Object.keys(updates).length) {
      continue;
    }

    await bookings.updateOne({ _id: booking._id }, { $set: updates });
    updatedCount += 1;
  }

  console.log(`Normalized ${updatedCount} booking document(s).`);
}

export async function down() {
}