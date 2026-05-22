import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import mongoose from 'mongoose';

const migrationsDir = path.join(process.cwd(), 'migrations');
const migrationJournalName = '_migrations';
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/House_Booking';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(maxAttempts = 30, delayMs = 2000) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(mongoUri);
      return;
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt) {
        break;
      }

      console.log(`MongoDB is not ready yet, retrying (${attempt}/${maxAttempts})...`);
      await sleep(delayMs);
    }
  }

  throw lastError;
}

async function loadMigrations() {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  const migrationFiles = entries
    .filter((entry) => entry.isFile() && /^\d{3}-.+\.js$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  const migrations = [];
  for (const fileName of migrationFiles) {
    const fileUrl = pathToFileURL(path.join(migrationsDir, fileName)).href;
    const module = await import(fileUrl);
    migrations.push({
      name: module.name || fileName,
      up: module.up,
      down: module.down
    });
  }

  return migrations;
}

async function run() {
  await connectWithRetry();

  const db = mongoose.connection.db;
  const journal = db.collection(migrationJournalName);
  await journal.createIndex({ name: 1 }, { unique: true });

  const appliedMigrations = new Set(
    (await journal.find({}, { projection: { name: 1 } }).toArray()).map((item) => String(item.name))
  );
  const migrations = await loadMigrations();

  if (!migrations.length) {
    console.log('No migrations found.');
    return;
  }

  let appliedCount = 0;
  for (const migration of migrations) {
    if (appliedMigrations.has(migration.name)) {
      continue;
    }

    if (typeof migration.up !== 'function') {
      throw new Error(`Migration ${migration.name} does not export an up() function.`);
    }

    console.log(`Applying migration: ${migration.name}`);
    await migration.up({ db, mongoose });

    await journal.insertOne({
      name: migration.name,
      appliedAt: new Date()
    });

    appliedCount += 1;
  }

  console.log(appliedCount ? `Applied ${appliedCount} migration(s).` : 'No new migrations to apply.');
}

run()
  .then(async () => {
    await mongoose.disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });