const mongoose = require('mongoose');
const Models = require('./models/Models');

// Connection string
const uri = 'mongodb+srv://admin:huutinh1905@cluster0.eiru7et.mongodb.net/express?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri).then(async () => {
  console.log('Connected to MongoDB Atlas');

  try {
    // Clear existing data
    await Models.Product.deleteMany({});
    await Models.Category.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const categoryData = [
      { _id: new mongoose.Types.ObjectId(), name: 'Running Shoes' },
      { _id: new mongoose.Types.ObjectId(), name: 'Sports Shoes' },
      { _id: new mongoose.Types.ObjectId(), name: 'Casual Shoes' }
    ];

    const categories = await Models.Category.insertMany(categoryData);
    console.log('Categories inserted:', categories.length);

    // Create products
    const productData = [
      {
        name: 'Nike Air Max',
        description: 'High-performance running shoes with air cushioning',
        price: 2500000,
        imageUrl: 'https://supersports.com.vn/cdn/shop/files/FN0228-103-1.jpg?v=1717756856&width=1000',
        cdate: Date.now(),
        category: { _id: categories[0]._id, name: categories[0].name }
      },
      {
        name: 'Adidas Ultraboost',
        description: 'Comfortable boost technology shoes',
        price: 2200000,
        imageUrl: 'https://picsum.photos/200',
        cdate: Date.now() - 86400000,
        category: { _id: categories[0]._id, name: categories[0].name }
      },
      {
        name: 'Puma RS-X',
        description: 'Retro style casual shoes',
        price: 1800000,
        imageUrl: 'https://picsum.photos/201',
        cdate: Date.now() - 172800000,
        category: { _id: categories[1]._id, name: categories[1].name }
      },
      {
        name: 'New Balance 990',
        description: 'Classic lifestyle shoes',
        price: 2000000,
        imageUrl: 'https://picsum.photos/202',
        cdate: Date.now() - 259200000,
        category: { _id: categories[2]._id, name: categories[2].name }
      },
      {
        name: 'Converse Chuck Taylor',
        description: 'Timeless canvas shoes',
        price: 1200000,
        imageUrl: 'https://picsum.photos/203',
        cdate: Date.now() - 345600000,
        category: { _id: categories[2]._id, name: categories[2].name }
      },
      {
        name: 'Vans Old Skool',
        description: 'Iconic skate shoes',
        price: 1400000,
        imageUrl: 'https://picsum.photos/204',
        cdate: Date.now() - 432000000,
        category: { _id: categories[1]._id, name: categories[1].name }
      }
    ];

    const products = await Models.Product.insertMany(productData);
    console.log('Products inserted:', products.length);

    console.log('✅ Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error inserting data:', err);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});
