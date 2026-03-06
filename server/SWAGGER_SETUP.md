# Hướng dẫn sử dụng Swagger API Documentation

## 1. Cài đặt các package cần thiết

Chạy lệnh trong thư mục `server`:

```bash
npm install swagger-ui-express yaml
```

## 2. Cập nhật file server/index.js

Thêm các dòng sau vào file `server/index.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');

const app = express();

mongoose.connect('mongodb+srv://huutinh:huutinh1905%40@cluster0.43lmd.mongodb.net/express?retryWrites=true&w=majority').then(() => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
});
```

## 3. Sử dụng Swagger UI

1. **Khởi động server**:
   ```bash
   npm start
   ```
   hoặc
   ```bash
   node index.js
   ```

2. **Truy cập Swagger UI**:
   - Mở trình duyệt và vào: `http://localhost:3000/api-docs`

3. **Test API**:
   - Click vào các endpoint để xem chi tiết
   - Click nút **"Try it out"** để test
   - Nhập dữ liệu và click **"Execute"** để gửi request

## Các Endpoint API

### 1. GET /api/products
- **Mô tả**: Lấy danh sách tất cả sản phẩm
- **Method**: GET
- **URL**: `http://localhost:3000/api/products`

### 2. POST /api/products
- **Mô tả**: Thêm mới sản phẩm
- **Method**: POST
- **URL**: `http://localhost:3000/api/products`
- **Body (JSON)**:
```json
{
  "name": "Nike Running Shoes",
  "description": "High-quality running shoes designed for comfort.",
  "price": 2000000,
  "imageUrl": "https://supersports.com.vn/cdn/shop/files/FN0228-103-1.jpg?v=1717756856&width=1000"
}
```

### 3. PUT /api/products
- **Mô tả**: Cập nhật sản phẩm
- **Method**: PUT
- **URL**: `http://localhost:3000/api/products`
- **Body (JSON)**:
```json
{
  "id": 1,
  "name": "Nike Running Shoes Pro",
  "description": "Updated shoes",
  "price": 2500000,
  "imageUrl": "https://picsum.photos/200"
}
```

### 4. DELETE /api/products/:id
- **Mô tả**: Xóa sản phẩm
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/products/:id`
- **Ví dụ**: `http://localhost:3000/api/products/1`

## Lợi ích của Swagger

✅ Tài liệu API tự động cập nhật  
✅ Test API trực tiếp từ trình duyệt  
✅ Xem định dạng request/response  
✅ Chia sẻ tài liệu với team dễ dàng  
✅ Giao diện đẹp và chuyên nghiệp

## File Swagger

File `swagger.yaml` đã được tạo sẵn. Nếu cần thêm/sửa endpoint, hãy chỉnh sửa file này.
