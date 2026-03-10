const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/g-store'); // Assuming default local mongo
    console.log("Connected to DB");
    
    const categories = await Product.distinct('category');
    console.log("Unique categories:", categories);
    
    for (const cat of categories) {
      const count = await Product.countDocuments({ category: cat });
      console.log(`Category: "${cat}", Count: ${count}`);
    }
    
    const allCount = await Product.countDocuments({});
    console.log("Total products:", allCount);
    
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

checkDB();
