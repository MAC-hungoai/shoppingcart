import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
    };
  }

  render() {
    const customers = this.state.customers.map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.trCustomerClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.password}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>{item.active}</td>
        <td>
          {item.active === 1 ? (
            <span
              className="link"
              onClick={(e) => this.lnkDeactiveClick(e, item)}
            >
              DEACTIVE
            </span>
          ) : (
            <span
              className="link"
              onClick={(e) => this.lnkEmailClick(e, item)}
            >
              EMAIL
            </span>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => {
      const customer = item.customer || {};

      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trOrderClick(item)}
        >
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{customer.name}</td>
          <td>{customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
        </tr>
      );
    });

    let items = null;

    if (this.state.order && Array.isArray(this.state.order.items)) {
      items = this.state.order.items.map((item, index) => {
        const product = item.product || {};
        const imageSrc = this.getImageSrc(product);

        return (
          <tr
            key={(product._id || "product") + "-" + index}
            className="datatable"
          >
            <td>{index + 1}</td>
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td>
              {imageSrc ? (
                <img src={imageSrc} width="70px" height="70px" alt="" />
              ) : (
                <span />
              )}
            </td>
            <td>{product.price}</td>
            <td>{item.quantity}</td>
            <td>{Number(product.price || 0) * Number(item.quantity || 0)}</td>
          </tr>
        );
      });
    }

    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">CUSTOMER LIST</h2>

          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Active</th>
                <th>Action</th>
              </tr>

              {customers}
            </tbody>
          </table>
        </div>

        {this.state.orders.length > 0 ? (
          <div className="align-center">
            <h2 className="text-center">ORDER LIST</h2>

            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>ID</th>
                  <th>Creation date</th>
                  <th>Cust. name</th>
                  <th>Cust. phone</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>

                {orders}
              </tbody>
            </table>
          </div>
        ) : (
          <div />
        )}

        {this.state.order ? (
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>

            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th>
                  <th>Prod. ID</th>
                  <th>Prod. name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>

                {items}
              </tbody>
            </table>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  getImageSrc(product) {
    if (!product) {
      return "";
    }

    if (product.imageUrl) {
      return product.imageUrl;
    }

    if (product.image) {
      return "data:image/jpg;base64," + product.image;
    }

    return "";
  }

  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(e, item) {
    e.stopPropagation();
    this.apiPutCustomerDeactive(item._id, item.token);
  }

  lnkEmailClick(e, item) {
    e.stopPropagation();
    this.apiGetCustomerSendmail(item._id);
  }

  apiGetCustomers() {
    const config = { headers: { "x-access-token": this.context.token } };

    axios.get("/api/admin/customers", config).then((res) => {
      const result = Array.isArray(res.data) ? res.data : [];
      this.setState({ customers: result });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { "x-access-token": this.context.token } };

    axios.get("/api/admin/orders/customer/" + cid, config).then((res) => {
      const result = Array.isArray(res.data) ? res.data : [];
      this.setState({ orders: result, order: null });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { "x-access-token": this.context.token } };

    axios.put("/api/admin/customers/deactive/" + id, body, config).then((res) => {
      const result = res.data;

      if (result) {
        this.setState({ orders: [], order: null });
        this.apiGetCustomers();
      } else {
        alert("SORRY BABY !");
      }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { "x-access-token": this.context.token } };

    axios.get("/api/admin/customers/sendmail/" + id, config).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }
}

export default Customer;
