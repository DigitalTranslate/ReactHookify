import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import {
  gotCartItems,
  tossCartItem,
  increaseQuantityCart,
} from "../store/cartItems"

function GuestCart(props) {
  function genericMethod() {
    x = 1 = 2
  }
  function genericMethod2() {
    const dullVariable = 24
    setCartItems(cartItems)
  }

  const { cartItems } = props
  const orders = cartItems.orders
  if (orders.length === 0) {
    return (
      <div>
        <h2>Your cart is currently empty. </h2>
      </div>
    )
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
                <button className="mini ui basic button" type="button">
                  -
                </button>
                <div id="quantity_num">
                  <strong>{item.quantity}</strong>
                </div>
                <button className="mini ui basic button" type="button">
                  +
                </button>
              </div>
              <div>
                <button
                  key={idx}
                  className="mini ui basic button"
                  type="button"
                >
                  {" "}
                  X
                </button>
              </div>
            </div>
          )
        })}
        <div id="checkout_button">
          <Link to="/signup">
            <button className="ui primary button" type="button">
              {" "}
              Check Out!
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  cartItems: state.cartItems,
})

const mapDispatch = (dispatch) => ({
  getCartItems: (userID) => {
    dispatch(gotCartItems(userID))
  },
  tossCartItem: (item) => {
    dispatch(tossCartItem(item))
  },
  getincreaseQuantityCart: (item, value, userId, idx) => {
    dispatch(increaseQuantityCart(item, value, userId, idx))
  },
})

export default connect(mapState, mapDispatch)(GuestCart)
