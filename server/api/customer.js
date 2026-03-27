const express = require('express');
const router = express.Router();

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const CategoryDAO = require('../models/CategoryDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const ProductDAO = require('../models/ProductDAO');

// customer
router.post('/signup', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  if (!(username && password && name && phone && email)) {
    res.json({
      success: false,
      message: 'Please input username and password and name and phone and email',
    });
    return;
  }

  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

  if (dbCust) {
    res.json({
      success: false,
      message: 'Exists username or email',
    });
    return;
  }

  const now = new Date().getTime();
  const token = CryptoUtil.md5(now.toString());
  const newCust = {
    username: username,
    password: password,
    name: name,
    phone: phone,
    email: email,
    active: 0,
    token: token,
  };

  const result = await CustomerDAO.insert(newCust);

  if (!result) {
    res.json({
      success: false,
      message: 'Insert failure',
    });
    return;
  }

  try {
    await EmailUtil.send(email, result._id, token);
    res.json({
      success: true,
      message: 'Please check email',
    });
  } catch (err) {
    const response = {
      success: false,
      message:
        err.message === 'Email is not configured'
          ? 'Email failure: configure EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS'
          : 'Email failure',
    };

    if (process.env.NODE_ENV !== 'production') {
      response.activation = {
        id: result._id,
        token: token,
      };
    }

    res.json(response);
  }
});

router.post('/active', async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;

  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});

router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(
      username,
      password,
    );

    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken(username, password);

        res.json({
          success: true,
          message: 'Authentication successful',
          token: token,
          customer: customer,
        });
      } else {
        res.json({
          success: false,
          message: 'Account is deactive',
        });
      }
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

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token,
  });
});

// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  const customer = {
    _id: _id,
    username: username,
    password: password,
    name: name,
    phone: phone,
    email: email,
  };

  const result = await CustomerDAO.update(customer);
  res.json(result);
});

// mycart
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  const authCustomer = await CustomerDAO.selectByUsernameAndPassword(
    req.decoded.username,
    req.decoded.password,
  );
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!authCustomer) {
    res.json({
      success: false,
      message: 'Customer not found',
    });
    return;
  }

  if (items.length === 0) {
    res.json({
      success: false,
      message: 'Your cart is empty',
    });
    return;
  }

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0);
  const now = new Date().getTime(); // milliseconds
  const order = {
    cdate: now,
    total: total,
    status: 'PENDING',
    customer: authCustomer,
    items: items,
  };

  const result = await OrderDAO.insert(order);
  res.json(result);
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const authCustomer = await CustomerDAO.selectByUsernameAndPassword(
    req.decoded.username,
    req.decoded.password,
  );

  if (!authCustomer || authCustomer._id.toString() !== _cid) {
    res.json({
      success: false,
      message: 'Access denied',
    });
    return;
  }

  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// category
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// product
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

// product by category
router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});

// product search
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

// product by ID
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});

module.exports = router;
