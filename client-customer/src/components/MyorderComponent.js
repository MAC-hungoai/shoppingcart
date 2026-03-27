import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorder extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;

    const orders = this.state.orders.map((order, index) => {
      const items = order.items.map((item) => {
        return (
          <div key={order._id + '-' + item.product._id}>
            {item.product.name} x {item.quantity}
          </div>
        );
      });

      return (
        <tr key={order._id} className="datatable">
          <td>{index + 1}</td>
          <td>{order._id}</td>
          <td>{new Date(order.cdate).toLocaleString()}</td>
          <td>{order.total}</td>
          <td>{order.status}</td>
          <td>{items}</td>
        </tr>
      );
    });

    return (
      <div className="align-center">
        <h2 className="text-center">MY ORDERS</h2>
        <table className="datatable" border="1">
          <tbody>
            <tr className="datatable">
              <th>No.</th>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
            {orders}
          </tbody>
        </table>
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      this.apiGetOrdersByCustID(this.context.customer._id);
    }
  }

  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const result = res.data;

      if (result && result.success === false) {
        alert(result.message);
      } else {
        this.setState({ orders: result });
      }
    });
  }
}

export default Myorder;
