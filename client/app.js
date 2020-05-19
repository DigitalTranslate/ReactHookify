import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  gotCartItems,
  tossCartItem,
  increaseQuantityCart,
} from '../store/cartItems';

class GuestCart extends Component {
  constructor() {
    super();
    this.state = {
      counter: 1,
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
  }

  componentDidMount() {
    const userID = this.props.match.params.userID;
    this.props.getCartItems(userID);
  }

  componentDidUpdate(prevState) {
    let firsttest = prevState.counter;
    const test = this.state.counter;
    if (firsttest !== test) {
      console.log('hi');
    }
  }

  // JO made a change on April 29
  handleRemove(item) {
    // const userId = this.props.match.params.userID
    this.props.tossCartItem(item, null);
  }

  handleQuantity(item, value, idx) {
    const userId = this.props.match.params.userID;
    if (item.quantity <= 1 && value === false) {
      this.props.tossCartItem(item);
    } else if (value === true && item.quantity > 2) {
      alert('Inventory limit has been reached!');
    } else {
      this.props.getincreaseQuantityCart(item, value, userId, idx);
    }
  }

  render() {
    const { cartItems } = this.props;
    const orders = cartItems.orders;
    if (orders.length === 0) {
      return (
        <div>
          <h2>Your cart is currently empty. </h2>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Items in your cart: </h2>
          <h2>
            Total Price: $
            {orders.reduce(
              (accumulator, currentValue) =>
                currentValue.price * currentValue.quantity + accumulator,
              0
            ) / 100}
          </h2>
          {orders.map((item, idx = 0) => {
            return (
              <div id="cart_item" key={idx}>
                <img id="cart_image" src={item.car.image} />
                <h4>
                  {item.car.brand} {item.car.name} Price: {item.price / 100}
                </h4>
                <div id="cart_quantity">
                  <button
                    className="mini ui basic button"
                    type="button"
                    onClick={() => this.handleQuantity(item, false, idx)}
                  >
                    -
                  </button>
                  <div id="quantity_num">
                    <strong>{item.quantity}</strong>
                  </div>
                  <button
                    className="mini ui basic button"
                    type="button"
                    onClick={() => this.handleQuantity(item, true, idx)}
                  >
                    +
                  </button>
                </div>
                <div>
                  <button
                    key={idx}
                    className="mini ui basic button"
                    type="button"
                    onClick={() => this.handleRemove(item)}
                  >
                    {' '}
                    X
                  </button>
                </div>
              </div>
            );
          })}
          <div id="checkout_button">
            <Link to="/signup">
              <button className="ui primary button" type="button">
                {' '}
                Check Out!
              </button>
            </Link>
          </div>
        </div>
      );
    }
  }
}
const mapState = (state) => ({
  cartItems: state.cartItems,
});

const mapDispatch = (dispatch) => ({
  getCartItems: (userID) => {
    dispatch(gotCartItems(userID));
  },
  tossCartItem: (item) => {
    dispatch(tossCartItem(item));
  },
  getincreaseQuantityCart: (item, value, userId, idx) => {
    dispatch(increaseQuantityCart(item, value, userId, idx));
  },
});

export default connect(mapState, mapDispatch)(GuestCart);
