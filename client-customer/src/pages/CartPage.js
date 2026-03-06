import React from "react";
import { Link } from "react-router-dom";
// reduce tổng tiền
function CartPage({ cart, increaseQty, decreaseQty, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={styles.container}>
      <h2>Giỏ hàng</h2>
       // mảng sản phầm trong giỏ hàng, nếu rỗng sẽ hiển thị thông báo, ngược lại sẽ hiển thị danh sách sản phẩm
      {cart.length === 0 ? (
        <p>Giỏ hàng đang trống</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} style={styles.item}>
            <h4>{item.name}</h4>
            <p>Giá: {item.price.toLocaleString()} VNĐ</p>
            <p>Số lượng: {item.quantity}</p>
            <p>Thành tiền: {(item.price * item.quantity).toLocaleString()} VNĐ</p>

            <button onClick={() => increaseQty(item.id)}>+</button>
            <button onClick={() => decreaseQty(item.id)}>-</button>
            <button onClick={() => removeFromCart(item.id)}>Xóa</button>
          </div>
        ))
      )}

      <h3>Tổng tiền: {total.toLocaleString()} VNĐ</h3>
      <Link to="/">Quay lại danh sách sản phẩm</Link>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px"
  },
  item: {
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px"
  }
};

export default CartPage;