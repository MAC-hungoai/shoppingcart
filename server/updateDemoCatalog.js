const mongoose = require('mongoose');
const Models = require('./models/Models');

const uri =
  'mongodb+srv://admin:huutinh1905@cluster0.eiru7et.mongodb.net/express?retryWrites=true&w=majority&appName=Cluster0';

const oldCategoryNames = ['Running Shoes', 'Sports Shoes', 'Casual Shoes'];
const oldProductNames = [
  'Nike Air Max',
  'Adidas Ultraboost',
  'Puma RS-X',
  'New Balance 990',
  'Converse Chuck Taylor',
  'Vans Old Skool',
];

const categorySpecs = [
  { name: 'Phone' },
  { name: 'MacBook' },
  { name: 'Windows Laptop' },
];

const productSpecs = [
  {
    name: 'iPhone 15',
    description: 'Apple smartphone with A16 chip and dual camera system',
    price: 22990000,
    imageUrl: '/images/iphone.svg',
    categoryName: 'Phone',
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Premium iPhone with titanium design and pro cameras',
    price: 28990000,
    imageUrl: '/images/iphone.svg',
    categoryName: 'Phone',
  },
  {
    name: 'MacBook Air 13',
    description: 'Thin and light Apple laptop for study and office work',
    price: 26990000,
    imageUrl: '/images/macbook.svg',
    categoryName: 'MacBook',
  },
  {
    name: 'MacBook Pro 14',
    description: 'Powerful MacBook for design, code, and video editing',
    price: 42990000,
    imageUrl: '/images/macbook.svg',
    categoryName: 'MacBook',
  },
  {
    name: 'Dell XPS 13',
    description: 'Compact Windows laptop with premium display and keyboard',
    price: 31990000,
    imageUrl: '/images/windows-laptop.svg',
    categoryName: 'Windows Laptop',
  },
  {
    name: 'ASUS Vivobook 15',
    description: 'Everyday Windows laptop with solid performance and battery',
    price: 17990000,
    imageUrl: '/images/windows-laptop.svg',
    categoryName: 'Windows Laptop',
  },
];

async function main() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  try {
    await Models.Product.deleteMany({
      name: { $in: [...oldProductNames, ...productSpecs.map((item) => item.name)] },
    });
    await Models.Category.deleteMany({
      name: { $in: [...oldCategoryNames, ...categorySpecs.map((item) => item.name)] },
    });

    const categories = [];
    for (const item of categorySpecs) {
      const category = await Models.Category.create({
        _id: new mongoose.Types.ObjectId(),
        name: item.name,
      });
      categories.push(category);
    }

    const categoryMap = new Map(categories.map((item) => [item.name, item]));
    const now = Date.now();

    for (let i = 0; i < productSpecs.length; i += 1) {
      const item = productSpecs[i];
      const category = categoryMap.get(item.categoryName);

      await Models.Product.create({
        _id: new mongoose.Types.ObjectId(),
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        cdate: now - i * 86400000,
        category: {
          _id: category._id,
          name: category.name,
        },
      });
    }

    console.log('Demo catalog updated to iPhone, MacBook, and Windows Laptop');
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('Update demo catalog failed:', err);
  process.exit(1);
});
