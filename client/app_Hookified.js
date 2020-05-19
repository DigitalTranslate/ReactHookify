import React, { useState, useEffect } from 'react';

function GuestCart(props) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const userID = props.match.params.userID;
  }, []);

  function handleRemove(item) {
    props.tossCartItem(item, null);
  }
  function handleQuantity(item, value, idx) {
    const userId = props.match.params.userID;
    if (item.quantity <= 1 && value === false) {
      props.tossCartItem(item);
    } else if (value === true && item.quantity > 2) {
      alert('Inventory limit has been reached!');
    } else {
      props.getincreaseQuantityCart(item, value, userId, idx);
    }
  }

  const { cartItems } = props;
  const orders = cartItems.orders;
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
                onClick={() => handleQuantity(item, false, idx)}
              >
                -
              </button>
              <div id="quantity_num">
                <strong>{item.quantity}</strong>
              </div>
              <button
                className="mini ui basic button"
                type="button"
                onClick={() => handleQuantity(item, true, idx)}
              >
                +
              </button>
            </div>
            <div>
              <button
                key={idx}
                className="mini ui basic button"
                type="button"
                onClick={() => handleRemove(item)}
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
