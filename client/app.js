import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AllCars from './AllCars';
import { Link } from 'react-router-dom';
import {
  gotCartItems,
  buildPostCartThunk,
  increaseQuantityCart,
} from '../store/cartItems';
import axios from 'axios';
/**
 * COMPONENT
 */

import './user-home.css';
class UserHome extends Component {
  async componentDidMount() {
    const { id } = this.props;
    console.log('logged in and about to fetch cartItems');
    const { cartItems } = this.props;

    const userCartItems = await axios.get(`/api/users/${id}/mycart`);
    if (cartItems.orders.length > 0) {
      console.log(
        'going to map to add now',
        'this is the logged in users cartItems: ',
        userCartItems.data
      );
      cartItems.orders.map(async (ord) => {
        if (userCartItems.data.find((logItem) => logItem.carId === ord.carId)) {
          // this.props.getincreaseQuantityCart(ord,true, id, 0, ord.quantity)
          const cartObj = {
            carId: ord.carId,
            userId: id,
            handle: true,
            quantity: ord.quantity,
            price: ord.price,
          };

          await axios.put(`/api/users/${id}/mycart`, cartObj);
        } else {
          this.props.postAddToCart(
            ord.carId,
            ord.car,
            id,
            ord.quantity,
            ord.price
          );
        }
      });
    }
    this.props.getCartItems(id);
  }

  render() {
    const { email } = this.props;
    return (
      <div className="home">
        <div className="home_text">
          {email ? <h3>Welcome, {email}</h3> : <h3>Welcome!</h3>}
          <div className="home_image">
            <Link to="/cars">
              <img src="https:i.imgur.com/hjt8eZ2.png" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
    id: state.user.id,
    cartItems: state.cartItems,
  };
};
const mapDispatch = (dispatch) => {
  return {
    getCartItems: (id) => {
      dispatch(gotCartItems(id));
    },
    postAddToCart: (carId, carItem, userId, quantity, price) => {
      dispatch(buildPostCartThunk(carId, carItem, userId, quantity, price));
    },
    getincreaseQuantityCart: (item, value, userId, idx) => {
      dispatch(increaseQuantityCart(item, value, userId, idx));
    },
  };
};

export default connect(mapState, mapDispatch)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
};
