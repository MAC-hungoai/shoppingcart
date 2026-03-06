import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);

    const token = this.readStoredToken();
    const customer = this.readStoredCustomer();

    this.state = {
      token: token,
      customer: customer,

      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
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

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
