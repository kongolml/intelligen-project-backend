import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

async function migrate() {
  await mongoose.connect(DATABASE_URL!);
  console.log('Connected to MongoDB');

  const collection = mongoose.connection.collection('portfolio_items');
  const items = await collection.find({}).toArray();

  let updated = 0;
  for (const item of items) {
    const updates: Record<string, any> = {};

    // Convert name from string to locale map
    if (typeof item.name === 'string') {
      updates.name = { en: item.name };
    }

    // Add subtitle placeholder if missing
    if (!item.subtitle) {
      const displayName = typeof item.name === 'string' ? item.name : item.name?.en || 'Untitled';
      updates.subtitle = { en: `[PLACEHOLDER] Subtitle for ${displayName}` };
    }

    // Add client placeholder if missing
    if (!item.client) {
      updates.client = { en: '[PLACEHOLDER] Client name' };
    }

    if (Object.keys(updates).length > 0) {
      await collection.updateOne({ _id: item._id }, { $set: updates });
      updated++;
      console.log(`Updated: ${typeof item.name === 'string' ? item.name : item.name?.en} (${item._id})`);
    }
  }

  console.log(`\nMigration complete. Updated ${updated}/${items.length} documents.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
