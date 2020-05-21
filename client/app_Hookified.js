

import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { checkoutThunk } from "../store/cart"
import history from "../history"
import { withStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { getHistoryThunk } from "../store/user"
import CardSection from "./checkoutCard"
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const styles = (theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
})

const stripePromise = loadStripe("pk_test_f8MjNwxrboi3yGU26WJ9MwoF004ndbJxV7")
const stripe = useStripe()
const elements = useElements()

function DisconnectedCheckoutForm(props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    setFirstName(props.user.firstName || "")
    setLastName(props.user.lastName || "")
    setAddress(props.user.address || "")
    setEmail(props.user.email || "")
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    await props.checkout({
      user: props.user,
      cart: props.cart,
    })
    if (props.user.id) {
      await props.addToHistory(props.user.id)
    }
    setFirstName("")
    setLastName("")
    setAddress("")
    setEmail("")

    if (!stripe || !elements) {
      return
    }

    const result = await stripe.confirmCardPayment("{CLIENT_SECRET}", {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Jenny Rosen",
        },
      },
    })

    if (result.error) {
      console.log(result.error.message)
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("MAKE A SUCCESS MESSAGE")
      }
    }

    history.push("/submitPage")
  }

  const { classes } = props
  return (
    <Elements stripe={stripePromise}>
      <form
        className={`${classes.root} form-container`}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h2>Checkout</h2>

        <CardSection />

        <TextField
          id="filled-basic"
          label="First Name"
          variant="filled"
          type="text"
          name="firstName"
          required
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Last Name"
          variant="filled"
          type="text"
          name="lastName"
          required
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Address"
          variant="filled"
          type="text"
          name="address"
          required
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Email"
          variant="filled"
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          disable={!stripe}
          variant="contained"
          color="secondary"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Elements>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    cart: state.cart,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    checkout: (obj) => dispatch(checkoutThunk(obj)),
    addToHistory: (userId) => dispatch(getHistoryThunk(userId)),
  }
}
const CheckoutForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisconnectedCheckoutForm)
export default withStyles(styles)(CheckoutForm)

import React from "react"
function DeviceList(props) {
  function _getPaginationText() {
    const curPage = props.currentPage
    const totalPages = Math.max(1, Math.ceil(props.devices.length / PAGELENGTH))
    return `${curPage} of ${totalPages}`
  }
  function _paginateDevices() {
    return props.devices.slice(
      (props.currentPage - 1) * PAGELENGTH,
      props.currentPage * PAGELENGTH
    )
  }
  function _renderRow({ key, index, style }) {
    return (
      <DeviceRow
        key={key}
        style={style}
        pickDevice={props.pickDevice}
        deviceName={_paginateDevices()[index]}
      />
    )
  }

  const rowCount = _paginateDevices().length
  const rowHeight = 55
  return (
    <div>
      <List
        width={700}
        height={Math.max(rowCount * rowHeight, 110)}
        rowCount={rowCount}
        rowRenderer={_renderRow}
        rowHeight={rowHeight}
        id="device-list"
        devices={_paginateDevices()}
      />
      <div id="pagination">
        <Button
          size="sm"
          type="button"
          className="arrow-button"
          onClick={() => props.changeCurrentPage(-1, false)}
          disabled={props.currentPage <= 1}
        >
          <img src={BACK_ARROW_IMG} alt="Previous Page" />
        </Button>
        <p className="pagination-text">{_getPaginationText()}</p>
        <Button
          size="sm"
          type="button"
          className="arrow-button"
          onClick={() => props.changeCurrentPage(1, false)}
          disabled={
            Math.ceil(props.devices.length / PAGELENGTH) <= props.currentPage
          }
        >
          <img src={FRONT_ARROW_IMG} alt="Next Page" />
        </Button>
      </div>
    </div>
  )
}

