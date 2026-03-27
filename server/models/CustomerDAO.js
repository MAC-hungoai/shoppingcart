require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  async selectAll() {
    const query = {};
    const mysort = { _id: -1 };

    const customers = await Models.Customer.find(query).sort(mysort).exec();
    return customers;
  },

  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },

  async selectByUsernameOrEmail(username, email) {
    const query = {
      $or: [{ username: username }, { email: email }],
    };

    const customer = await Models.Customer.findOne(query).exec();
    return customer;
  },

  async insert(customer) {
    const mongoose = require('mongoose');
    customer._id = new mongoose.Types.ObjectId();

    const result = await Models.Customer.create(customer);
    return result;
  },

  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };

    const result = await Models.Customer.findOneAndUpdate(query, newvalues, {
      new: true,
    }).exec();

    return result;
  },

  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };

    const customer = await Models.Customer.findOne(query).exec();
    return customer;
  },

  async update(customer) {
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    };

    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      newvalues,
      {
        new: true,
      },
    ).exec();

    return result;
  },
};

module.exports = CustomerDAO;
