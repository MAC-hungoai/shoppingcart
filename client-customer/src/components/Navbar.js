import React from "react";
// dùng Link để chuyển trang mà không cần tải lại trang
import { Link } from "react-router-dom";
// component Navbar nhận props cartCount để hiển thị số lượng sản phẩm trong giỏ hàng
function Navbar({cartCount}){
    return(
        <div style={styles.navbar}>
             // bấm vào link sẽ chuyển đến trang tương ứng mà không cần tải lại trang
            <Link to="/" style={styles.link}> Danh sách sản phẩm</Link>
            <Link to="/cart" style={styles.link}> Giỏ hàng ({cartCount})</Link>
        </div>
    );
}
const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 30px",
        backgroundColor: "#1976d2",
    },
    link: {
        color: "white",
        textDecoration: "none",
        fontWeight: "bold",
    }
};
export default Navbar;