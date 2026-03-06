import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    const customer = this.context.customer;
    const hasLogin = this.context.token !== '' && customer !== null;

    return (
      <div className="border-bottom">
        <div className="float-left">
          {hasLogin ? (
            <div>
              Hello <b>{customer.name}</b> |{' '}
              <Link to="/home" onClick={() => this.lnkLogoutClick()}>
                Logout
              </Link>{' '}
              | <Link to="/myprofile">My profile</Link> |{' '}
              <Link to="">My orders</Link>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link> | <Link to="/signup">Sign-up</Link>{' '}
              | <Link to="/active">Active</Link>
            </div>
          )}
        </div>

        <div className="float-right">
          <Link to="">My cart</Link> have <b>0</b> items
        </div>

        <div className="float-clear" />
      </div>
    );
  }

  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
  }
}

export default Inform;
