/* eslint-disable camelcase */
/* eslint-disable no-lonely-if */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkoutThunk } from '../store/cart'
import history from '../history'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { getHistoryThunk } from '../store/user'
import CardSection from './checkoutCard'
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const styles = (theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      // width: '25ch',
    },
  },
})

const stripePromise = loadStripe('pk_test_f8MjNwxrboi3yGU26WJ9MwoF004ndbJxV7')
const stripe = useStripe()
const elements = useElements()

class DisconnectedCheckoutForm extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.setState({
      firstName: this.props.user.firstName || '',
      lastName: this.props.user.lastName || '',
      address: this.props.user.address || '',
      email: this.props.user.email || '',
    })
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }
  async handleSubmit(event) {
    event.preventDefault()
    await this.props.checkout({
      user: this.props.user,
      cart: this.props.cart,
    })
    if (this.props.user.id) {
      await this.props.addToHistory(this.props.user.id)
    }
    this.setState({
      firstName: '',
      lastName: '',
      address: '',
      email: '',
    })

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const result = await stripe.confirmCardPayment('{CLIENT_SECRET}', {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    })

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message)
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log('MAKE A SUCCESS MESSAGE')
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }

    history.push('/submitPage')
  }
  render() {
    const { classes } = this.props
    return (
      <Elements stripe={stripePromise}>
        <form
          className={`${classes.root} form-container`}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
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
            value={this.state.firstName}
            onChange={this.handleChange}
          />
          <TextField
            id="filled-basic"
            label="Last Name"
            variant="filled"
            type="text"
            name="lastName"
            required
            value={this.state.lastName}
            onChange={this.handleChange}
          />
          <TextField
            id="filled-basic"
            label="Address"
            variant="filled"
            type="text"
            name="address"
            required
            value={this.state.address}
            onChange={this.handleChange}
          />
          <TextField
            id="filled-basic"
            label="Email"
            variant="filled"
            type="email"
            name="email"
            required
            value={this.state.email}
            onChange={this.handleChange}
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
