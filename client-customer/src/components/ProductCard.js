import React from 'react';
import { Link } from 'react-router-dom';
// nhận 1 sản phẩm và hàm thêm giỏ hàng
function ProductCard({ product, addToCart }) {
    return(
        <div style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} /> // hiển thị ảnh
            <h3>{product.name}</h3> // hiển thị tên sản phẩm
            <p>Giá: {product.price.toLocaleString()} VND</p> // hiển thị giá sản phẩm

              <div style={styles.buttonGroup}> // tạo link tới trang chi tiết
        <Link to={`/product/${product.id}`}>
          <button>Xem chi tiết</button>
        </Link>
        <button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button> // thêm sản phẩm vào giỏ hàng
      </div>
        </div>
    );
}
const styles = {
    card: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "15px",
        width: "250px",
        textAlign: "center",
    },
    image:{
        width: "100%",
        height: "150px",
        objectFit: "cover",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
    }
};
export default ProductCard;