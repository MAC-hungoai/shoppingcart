const mongoose = require('mongoose');
const Models = require('./models/Models');

const uri =
  'mongodb+srv://admin:huutinh1905@cluster0.eiru7et.mongodb.net/express?retryWrites=true&w=majority&appName=Cluster0';

const categoryData = [
  { _id: new mongoose.Types.ObjectId(), name: 'Phone' },
  { _id: new mongoose.Types.ObjectId(), name: 'MacBook' },
  { _id: new mongoose.Types.ObjectId(), name: 'Windows Laptop' },
];

function buildProductData(categories) {
  return [
    {
      name: 'iPhone 15',
      description: 'Apple smartphone with A16 chip and dual camera system',
      price: 22990000,
      imageUrl: '/images/iphone.svg',
      cdate: Date.now(),
      category: { _id: categories[0]._id, name: categories[0].name },
    },
    {
      name: 'iPhone 15 Pro',
      description: 'Premium iPhone with titanium design and pro cameras',
      price: 28990000,
      imageUrl: '/images/iphone.svg',
      cdate: Date.now() - 86400000,
      category: { _id: categories[0]._id, name: categories[0].name },
    },
    {
      name: 'MacBook Air 13',
      description: 'Thin and light Apple laptop for study and office work',
      price: 26990000,
      imageUrl: '/images/macbook.svg',
      cdate: Date.now() - 172800000,
      category: { _id: categories[1]._id, name: categories[1].name },
    },
    {
      name: 'MacBook Pro 14',
      description: 'Powerful MacBook for design, code, and video editing',
      price: 42990000,
      imageUrl: '/images/macbook.svg',
      cdate: Date.now() - 259200000,
      category: { _id: categories[1]._id, name: categories[1].name },
    },
    {
      name: 'Dell XPS 13',
      description: 'Compact Windows laptop with premium display and keyboard',
      price: 31990000,
      imageUrl: '/images/windows-laptop.svg',
      cdate: Date.now() - 345600000,
      category: { _id: categories[2]._id, name: categories[2].name },
    },
    {
      name: 'ASUS Vivobook 15',
      description: 'Everyday Windows laptop with solid performance and battery',
      price: 17990000,
      imageUrl: '/images/windows-laptop.svg',
      cdate: Date.now() - 432000000,
      category: { _id: categories[2]._id, name: categories[2].name },
    },
  ];
}

mongoose
  .connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    try {
      await Models.Product.deleteMany({});
      await Models.Category.deleteMany({});
      await Models.Order.deleteMany({});
      console.log('Cleared existing products, categories, and orders');

      const categories = await Models.Category.insertMany(categoryData);
      console.log('Categories inserted:', categories.length);

      const products = await Models.Product.insertMany(
        buildProductData(categories),
      );
      console.log('Products inserted:', products.length);

      console.log('Seed data inserted successfully');
      process.exit(0);
    } catch (err) {
      console.error('Error inserting data:', err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Connection error:', err);
    process.exit(1);
  });
