const mongoose = require('mongoose');
const dbUri = require('./utils/MongooseUtil');
const Models = require('./models/Models');

function toEmbeddedCustomer(customer) {
  return {
    _id: customer._id,
    username: customer.username || '',
    password: customer.password || '',
    name: customer.name || '',
    phone: customer.phone || '',
    email: customer.email || '',
    active: typeof customer.active === 'number' ? customer.active : 0,
    token: customer.token || '',
  };
}

function buildDemoCustomers(customers) {
  const defaults = [
    {
      _id: new mongoose.Types.ObjectId(),
      username: 'demo.order.01',
      password: '123',
      name: 'Nguyen Minh Anh',
      phone: '0909001001',
      email: 'demo.order.01@example.com',
      active: 1,
      token: '',
    },
    {
      _id: new mongoose.Types.ObjectId(),
      username: 'demo.order.02',
      password: '123',
      name: 'Tran Quoc Bao',
      phone: '0909001002',
      email: 'demo.order.02@example.com',
      active: 1,
      token: '',
    },
    {
      _id: new mongoose.Types.ObjectId(),
      username: 'demo.order.03',
      password: '123',
      name: 'Le Hoang Nam',
      phone: '0909001003',
      email: 'demo.order.03@example.com',
      active: 1,
      token: '',
    },
  ];

  return defaults.map((item, index) => {
    const customer = customers[index] || {};

    return {
      _id: customer._id || item._id,
      username: customer.username || item.username,
      password: customer.password || item.password,
      name: customer.name || item.name,
      phone: customer.phone || item.phone,
      email: customer.email || item.email,
      active: typeof customer.active === 'number' ? customer.active : item.active,
      token: customer.token || item.token,
    };
  });
}

function toEmbeddedProduct(product) {
  return {
    _id: product._id,
    name: product.name || '',
    description: product.description || '',
    price: Number(product.price || 0),
    image: product.image || '',
    imageUrl: product.imageUrl || '',
    cdate: product.cdate || Date.now(),
    category: product.category || null,
  };
}

function pickProduct(products, preferredId, fallbackIndex) {
  if (preferredId) {
    const matchedProduct = products.find(
      (item) => item._id.toString() === preferredId.toString(),
    );

    if (matchedProduct) {
      return matchedProduct;
    }
  }

  return products[fallbackIndex % products.length];
}

async function backfillExistingOrders(orders, customers, products) {
  let updatedCount = 0;

  for (let index = 0; index < orders.length; index += 1) {
    const order = orders[index];
    let dirty = false;
    let total = 0;

    if (!order.customer || !order.customer.name || !order.customer.phone) {
      const demoCustomer = toEmbeddedCustomer(
        customers[index % customers.length],
      );

      if (!order.customer) {
        order.customer = demoCustomer;
      } else {
        order.customer._id = order.customer._id || demoCustomer._id;
        order.customer.username =
          order.customer.username || demoCustomer.username;
        order.customer.password =
          order.customer.password || demoCustomer.password;
        order.customer.name = order.customer.name || demoCustomer.name;
        order.customer.phone = order.customer.phone || demoCustomer.phone;
        order.customer.email = order.customer.email || demoCustomer.email;
        order.customer.active =
          typeof order.customer.active === 'number'
            ? order.customer.active
            : demoCustomer.active;
        order.customer.token = order.customer.token || demoCustomer.token;
      }

      order.markModified('customer');
      dirty = true;
    }

    if (!order.status) {
      order.status = 'PENDING';
      dirty = true;
    }

    order.items = Array.isArray(order.items) ? order.items : [];

    for (let itemIndex = 0; itemIndex < order.items.length; itemIndex += 1) {
      const item = order.items[itemIndex];

      if (!item.quantity) {
        item.quantity = 1;
        dirty = true;
      }

      if (!item.product) {
        const product = pickProduct(
          products,
          item.product_id || item.productId,
          itemIndex,
        );
        item.product = toEmbeddedProduct(product);
        dirty = true;
      }

      total += Number(item.product.price || 0) * Number(item.quantity || 0);
    }

    if (order.total !== total) {
      order.total = total;
      dirty = true;
    }

    if (dirty) {
      await order.save();
      updatedCount += 1;
    }
  }

  return updatedCount;
}

async function insertSampleOrders(existingCount, customers, products) {
  const now = Date.now();
  const sampleStatuses = ['PENDING', 'APPROVED', 'CANCELED'];
  const desiredCount = 3;
  const ordersToInsert = Math.max(0, desiredCount - existingCount);

  for (let index = 0; index < ordersToInsert; index += 1) {
    const product = products[index % products.length];
    const customer = customers[(existingCount + index) % customers.length];
    const quantity = index + 1;

    await Models.Order.create({
      _id: new mongoose.Types.ObjectId(),
      cdate: now - index * 3600000,
      total: Number(product.price || 0) * quantity,
      status: sampleStatuses[(existingCount + index) % sampleStatuses.length],
      customer: toEmbeddedCustomer(customer),
      items: [
        {
          product: toEmbeddedProduct(product),
          quantity: quantity,
        },
      ],
    });
  }

  return ordersToInsert;
}

async function main() {
  await mongoose.connect(dbUri);
  console.log('Connected to MongoDB Atlas');

  try {
    const customers = await Models.Customer.find({})
      .sort({ active: -1, cdate: -1 })
      .lean();
    const products = await Models.Product.find({}).sort({ cdate: -1 }).lean();
    const demoCustomers = buildDemoCustomers(customers);

    if (products.length === 0) {
      throw new Error('No products found to embed into sample orders');
    }

    const orders = await Models.Order.find({}).sort({ cdate: -1 }).exec();
    const updatedCount = await backfillExistingOrders(
      orders,
      demoCustomers,
      products,
    );
    const insertedCount = await insertSampleOrders(
      orders.length,
      demoCustomers,
      products,
    );

    console.log('Orders updated:', updatedCount);
    console.log('Orders inserted:', insertedCount);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('Seed demo orders failed:', err);
  process.exit(1);
});
