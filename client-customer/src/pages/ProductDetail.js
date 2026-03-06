import React from "react";
import { useParams, Link } from "react-router-dom";
import products from "../utils/data";

function ProductDetail({ addToCart }) {
    // lấy tham số trên url
    // lấy đường dẫn product/:id, id sẽ được lấy từ url và tìm sản phẩm tương ứng trong mảng products
  const { id } = useParams();
  // tìm sản phẩm đúng id, presentInt : đổi id sang int
  const product = products.find((item) => item.id === parseInt(id));
 
  if (!product) {
    return <h2>Không tìm thấy sản phẩm</h2>;
  }

  return (
    <div style={styles.container}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <h2>{product.name}</h2>
      <p>Giá: {product.price.toLocaleString()} VNĐ</p>
      <p>Mô tả: {product.description}</p>

      <button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
      <br /><br />
      <Link to="/">Quay lại danh sách</Link>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px"
  },
  image: {
    width: "300px",
    height: "300px",
    objectFit: "cover"
  }
};

export default ProductDetail;