const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const dbUri = require('./utils/MongooseUtil');

const app = express();
const adminBuildPath = path.resolve(__dirname, '../client-admin/build');
const adminIndexPath = path.join(adminBuildPath, 'index.html');
const customerBuildPath = path.resolve(__dirname, '../client-customer/build');
const customerIndexPath = path.join(customerBuildPath, 'index.html');
const hasAdminBuild = fs.existsSync(adminIndexPath);
const hasCustomerBuild = fs.existsSync(customerIndexPath);

mongoose.connect(dbUri).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Database connection error:', err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Swagger Documentation
const swaggerFile = fs.readFileSync(
  path.join(__dirname, 'swagger.yaml'),
  'utf8'
);
const swaggerDoc = yaml.parse(swaggerFile);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDoc));

// apis
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

if (hasAdminBuild) {
  app.use('/admin', express.static(adminBuildPath));
  app.get(/^\/admin(\/.*)?$/, (req, res) => {
    res.sendFile(adminIndexPath);
  });
}

if (hasCustomerBuild) {
  app.use('/', express.static(customerBuildPath));
}

app.use('/', productRoutes);

if (hasCustomerBuild) {
  app.get(/^\/(?!api(?:\/|$)|api-docs(?:\/|$)|admin(?:\/|$)).*/, (req, res) => {
    res.sendFile(customerIndexPath);
  });
}

const port = process.env.PORT || 3013;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API Documentation: http://127.0.0.1:${port}/api-docs`);

  if (hasAdminBuild) {
    console.log(`Admin App: http://127.0.0.1:${port}/admin`);
  }

  if (hasCustomerBuild) {
    console.log(`Customer App: http://127.0.0.1:${port}/`);
  }
});

