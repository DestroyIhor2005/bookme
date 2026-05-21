import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const propertySchema = new Schema({}, { strict: false });
const Property = mongoose.model('Property', propertySchema);

async function check() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookme';
  await mongoose.connect(uri);
  
  const count = await Property.countDocuments();
  console.log('Total properties:', count);
  
  const byCity = await Property.aggregate([
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  console.log('\nProperties by city:');
  byCity.forEach(item => console.log(`  ${item._id}: ${item.count}`));
  
  await mongoose.disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
