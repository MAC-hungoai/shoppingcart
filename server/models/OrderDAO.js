require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {
  async insert(order) {
    const mongoose = require('mongoose');
    order._id = new mongoose.Types.ObjectId();

    const result = await Models.Order.create(order);
    return result;
  },

  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // descending

    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },

  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, {
      new: true,
    }).exec();

    return result;
  },

  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const mysort = { cdate: -1 }; // descending

    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },
};

module.exports = OrderDAO;
