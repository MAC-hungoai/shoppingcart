const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');

const app = express();

mongoose.connect('mongodb+srv://admin:huutinh1905@cluster0.eiru7et.mongodb.net/express?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Database connection error:', err);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Swagger Documentation
const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDoc = yaml.parse(swaggerFile);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDoc));

app.use('/', productRoutes);

// apis
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
});

