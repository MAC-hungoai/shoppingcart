import React from "react";
// lấy dữ liệu sản phẩm từ file data.js
import products from "../utils/data";
import ProductCard from "../components/ProductCard";

function ProductList({ addToCart }) {
  return (
    <div style={styles.container}>
      <h2>Danh sách sản phẩm</h2>
      <div style={styles.grid}>
        // lặp qua từng sản phẩm
        {products.map((product) => (
          <ProductCard
            key={product.id}
            // truyền dữ liệu sản phẩm và hàm thêm giỏ hàng vào component ProductCard
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px"
  },
  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  }
};

export default ProductList;