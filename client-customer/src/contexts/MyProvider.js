import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);

    const token = this.readStoredToken();
    const customer = this.readStoredCustomer();
    const mycart = this.readStoredMycart();

    this.state = {
      token: token,
      customer: customer,
      mycart: mycart,

      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
    };
  }

  readStoredToken() {
    try {
      return localStorage.getItem('token') || '';
    } catch (err) {
      return '';
    }
  }

  readStoredCustomer() {
    try {
      const value = localStorage.getItem('customer');
      return value ? JSON.parse(value) : null;
    } catch (err) {
      localStorage.removeItem('customer');
      return null;
    }
  }

  readStoredMycart() {
    try {
      const value = localStorage.getItem('mycart');
      return value ? JSON.parse(value) : [];
    } catch (err) {
      localStorage.removeItem('mycart');
      return [];
    }
  }

  setToken = (value) => {
    if (value) {
      localStorage.setItem('token', value);
    } else {
      localStorage.removeItem('token');
    }

    this.setState({ token: value });
  };

  setCustomer = (value) => {
    if (value) {
      localStorage.setItem('customer', JSON.stringify(value));
    } else {
      localStorage.removeItem('customer');
    }

    this.setState({ customer: value });
  };

  setMycart = (value) => {
    const mycart = Array.isArray(value) ? value : [];

    if (mycart.length > 0) {
      localStorage.setItem('mycart', JSON.stringify(mycart));
    } else {
      localStorage.removeItem('mycart');
    }

    this.setState({ mycart: mycart });
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
