const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri =
  'mongodb+srv://' +
  MyConstants.DB_USER +
  ':' +
  MyConstants.DB_PASS +
  '@' +
  MyConstants.DB_SERVER +
  '/' +
  MyConstants.DB_DATABASE;

// Connection được setup trong index.js, không cần kết nối lại ở đây
module.exports = uri;
