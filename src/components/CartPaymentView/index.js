import {withRouter} from 'react-router-dom'
import './style.css'

const CartPaymentView = props => {
  const {history} = props
  console.log('history : ', history)
  const redirectToHome = () => history.push('/')

  return (
    <div className="payment-container">
      <img
        className="payment-logo"
        src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510219/Das-NxtMart/pay-success_jnylih.png"
        alt="payment success"
      />
      <h1 className="payment-head">Payment Successful</h1>
      <p className="payment-para">Thank you for ordering</p>
      <p className="payment-para">Your payment is successfully completed</p>
      <button
        type="button"
        className="payment-btn"
        onClick={() => redirectToHome()}
      >
        Return to Homepage
      </button>
    </div>
  )
}

export default withRouter(CartPaymentView)
