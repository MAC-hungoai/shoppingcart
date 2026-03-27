const express = require('express');
const router = express.Router();

// utils
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const ProductDAO = require('../models/ProductDAO');
// login
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(
      username,
      password
    );

    if (admin) {
      const token = JwtUtil.genToken(username, password);

      res.json({
        success: true,
        message: 'Authentication successful',
        token: token,
      });
    } else {
      res.json({
        success: false,
        message: 'Incorrect username or password',
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Please input username and password',
    });
  }
});

// check token
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token,
  });
});

// category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// product
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  // pagination
  const noProducts = await ProductDAO.selectByCount();
  const sizePage = 4;
  const noPages = Math.ceil(noProducts / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
  const skip = (curPage - 1) * sizePage;
  const products = await ProductDAO.selectBySkipLimit(skip, sizePage);
  // return
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { name: name, price: price, image: image, cdate: now, category: category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);
  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// order
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
router.get(
  '/orders/customer/:cid',
  JwtUtil.checkToken,
  async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  }
);
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const allowStatuses = ['PENDING', 'APPROVED', 'CANCELED'];

  if (!allowStatuses.includes(newStatus)) {
    res.json(null);
    return;
  }

  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
router.put(
  '/customers/deactive/:id',
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
  }
);
router.get(
  '/customers/sendmail/:id',
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectByID(_id);

    if (!cust) {
      res.json({ success: false, message: 'Not exists customer' });
      return;
    }

    try {
      const sent = await EmailUtil.send(cust.email, cust._id, cust.token);

      if (sent) {
        res.json({ success: true, message: 'Please check email' });
      } else {
        res.json({ success: false, message: 'Email failure' });
      }
    } catch (err) {
      if (
        err.message === 'Email is not configured' &&
        process.env.NODE_ENV !== 'production'
      ) {
        res.json({
          success: true,
          message: 'Please check email',
          preview: {
            email: cust.email,
            id: cust._id,
            token: cust.token,
            note: 'Email not configured, simulated success in development',
          },
        });
        return;
      }

      res.json({
        success: false,
        message:
          err.message === 'Email is not configured'
            ? 'Email failure: configure EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS'
            : 'Email failure',
      });
    }
  }
);

module.exports = router;
