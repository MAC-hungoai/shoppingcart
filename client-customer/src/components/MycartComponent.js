import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    const hasItems = this.context.mycart.length > 0;
    const mycart = this.context.mycart.map((item, index) => {
      const imageSrc = item.product.imageUrl || item.product.image;

      return (
        <tr key={item.product._id} className="datatable">
          <td>{index + 1}</td>
          <td>{item.product._id}</td>
          <td>{item.product.name}</td>
          <td>{item.product.category ? item.product.category.name : ''}</td>
          <td>
            <img src={imageSrc} width="70px" height="70px" alt="" />
          </td>
          <td>{item.product.price}</td>
          <td>{item.quantity}</td>
          <td>{item.product.price * item.quantity}</td>
          <td>
            <span
              className="link"
              onClick={() => this.lnkRemoveClick(item.product._id)}
            >
              Remove
            </span>
          </td>
        </tr>
      );
    });

    return (
      <div className="align-center">
        <h2 className="text-center">ITEM LIST</h2>
        <table className="datatable" border="1">
          <tbody>
            <tr className="datatable">
              <th>No.</th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
            {hasItems ? (
              mycart
            ) : (
              <tr>
                <td colSpan="9">
                  Your cart is empty. Add iPhone, MacBook, or Windows laptop first.
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="6"></td>
              <td>Total</td>
              <td>{CartUtil.getTotal(this.context.mycart)}</td>
              <td>
                <span className="link" onClick={() => this.lnkCheckoutClick()}>
                  CHECKOUT
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // event-handlers
  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((item) => item.product._id === id);

    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (this.context.mycart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (window.confirm('ARE YOU SURE ?')) {
      const total = CartUtil.getTotal(this.context.mycart);
      const items = this.context.mycart;
      const customer = this.context.customer;

      if (customer && this.context.token !== '') {
        this.apiCheckout(total, items, customer);
      } else {
        alert('Please login first');
        this.props.navigate('/login');
      }
    }
  }

  // apis
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .post('/api/customer/checkout', body, config)
      .then((res) => {
        const result = res.data;

        if (result && result.success === false) {
          alert(result.message);
        } else if (result) {
          alert('OK BABY!');
          this.context.setMycart([]);
          this.props.navigate('/home');
        } else {
          alert('SORRY BABY!');
        }
      })
      .catch(() => {
        alert('SORRY BABY!');
      });
  }
}

export default withRouter(Mycart);
