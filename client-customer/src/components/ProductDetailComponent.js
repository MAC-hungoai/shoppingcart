import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
    };
  }

  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="align-center">
          <h2 className="text-center">PRODUCT DETAILS</h2>

          <figure className="caption-right">
            <img
              src={prod.imageUrl}
              width="400px"
              height="400px"
              alt=" "
            />

            <figcaption>
              <form>
                <table>
                  <tbody>
                    <tr>
                      <td align="right">ID:</td>
                      <td>{prod._id}</td>
                    </tr>
                    <tr>
                      <td align="right">Name:</td>
                      <td>{prod.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Price:</td>
                      <td>{prod.price}</td>
                    </tr>
                    <tr>
                      <td align="right">Category:</td>
                      <td>{prod.category.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Quantity:</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={this.state.txtQuantity}
                          onChange={(e) =>
                            this.setState({ txtQuantity: e.target.value })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <input
                          type="submit"
                          value="ADD TO CART"
                          onClick={(e) => this.btnAdd2CartClick(e)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </figcaption>
          </figure>
        </div>
      );
    }
    return <div />;
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.apiGetProduct(this.props.params.id);
    }
  }

  // event-handlers
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity, 10);

    if (product && quantity > 0) {
      const mycart = [...this.context.mycart];
      const index = mycart.findIndex((item) => item.product._id === product._id);

      if (index === -1) {
        mycart.push({ product: product, quantity: quantity });
      } else {
        mycart[index] = {
          ...mycart[index],
          quantity: mycart[index].quantity + quantity,
        };
      }

      this.context.setMycart(mycart);
      alert('OK BABY!');
    } else {
      alert('Please input quantity');
    }
  }

  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result, txtQuantity: 1 });
    });
  }
}

export default withRouter(ProductDetail);
