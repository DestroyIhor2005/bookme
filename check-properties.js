import 'dotenv/config';
import mongoose from 'mongoose';

async function check() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookme';
  await mongoose.connect(uri);

  const propertiesCollection = mongoose.connection.db.collection('Properties');
  const count = await propertiesCollection.countDocuments();
  console.log('Total properties:', count);

  const byCity = await propertiesCollection.aggregate([
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  console.log('\nProperties by city:');
  byCity.forEach(item => console.log(`  ${item._id}: ${item.count}`));
  
  await mongoose.disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
