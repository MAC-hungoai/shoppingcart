import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
    };
  }

  render() {
    const orders = this.state.orders.map((item) => {
      const customer = item.customer || {};
      const customerName = customer.name || customer.username || 'Unknown';
      const customerPhone = customer.phone || 'N/A';

      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trItemClick(item)}
        >
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{customerName}</td>
          <td>{customerPhone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
          <td>
            {item.status === 'PENDING' ? (
              <div>
                <span
                  className="link"
                  onClick={(e) => this.lnkApproveClick(e, item._id)}
                >
                  APPROVE
                </span>
                {' | '}
                <span
                  className="link"
                  onClick={(e) => this.lnkCancelClick(e, item._id)}
                >
                  CANCEL
                </span>
              </div>
            ) : (
              <div />
            )}
          </td>
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
            key={(product._id || 'product') + '-' + index}
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
                <th>Action</th>
              </tr>

              {orders}
            </tbody>
          </table>
        </div>

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
    this.apiGetOrders();
  }

  getImageSrc(product) {
    if (!product) {
      return '';
    }

    if (product.imageUrl) {
      return product.imageUrl;
    }

    if (product.image) {
      return 'data:image/jpg;base64,' + product.image;
    }

    return '';
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(e, id) {
    e.stopPropagation();
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(e, id) {
    e.stopPropagation();
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  apiGetOrders(selectedOrderID = null) {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;

      if (result && result.success === false) {
        alert(result.message);
        return;
      }

      const orders = Array.isArray(result) ? result : [];
      const selectedID =
        selectedOrderID || (this.state.order ? this.state.order._id : null);
      const order = selectedID
        ? orders.find((item) => item._id === selectedID) || null
        : null;

      this.setState({ orders: orders, order: order });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;

      if (result && result.success === false) {
        alert(result.message);
      } else if (result) {
        this.apiGetOrders(id);
      } else {
        alert('SORRY BABY !');
      }
    });
  }
}

export default Order;
