import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {FaArrowLeft} from 'react-icons/fa6'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CartPaymentView from '../../components/CartPaymentView'
import CartProductItem from '../../components/CartProductItem'

import './style.css'

const cartContentStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  paymentSuccess: 'PAYMENTSUCCESS',
}

class Cart extends Component {
  state = {renderStatus: cartContentStatus.loading, cartData: []}

  componentDidMount() {
    const getLocalCartData = JSON.parse(localStorage.getItem('cartData')) || []
    // console.log('getLocalCartData in Cart : ', getLocalCartData)
    this.setState({
      cartData: getLocalCartData,
      renderStatus: cartContentStatus.success,
    })
  }

  doNavigateToHome = () => {
    const {history} = this.props
    history.replace('/')
  }

  doPaymentSuccess = () => {
    this.setState({renderStatus: cartContentStatus.paymentSuccess}, () => {
      localStorage.removeItem('cartData')
      const getLocalData = JSON.parse(localStorage.getItem('ecomData')) || []
      const modifiedData = getLocalData.map(eachCat => ({
        ...eachCat,
        products: eachCat.products.map(eachProd => ({
          ...eachProd,
          count: 0,
        })),
      }))
      // console.log('modifiedData : ', modifiedData)
      localStorage.setItem('ecomData', JSON.stringify(modifiedData))
    })
    // console.log('payment success...')
  }

  renderSuccess = () => {
    const {cartData} = this.state
    if (cartData.length === 0) {
      return (
        <div className="empty-container">
          <img
            className="empty-cart-img"
            src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510218/Das-NxtMart/Logo_cp9rxn.png"
            alt="empty cart"
          />
          <h3 className="empty-para">Your cart is empty</h3>
        </div>
      )
    }

    // console.log('cartList in cart', cartData)
    const totalAmount = cartData.reduce(
      (prev, each) => prev + Number(each.price.slice(1)) * each.count,
      0,
    )
    // console.log(totalAmount)
    const updateSetCartList = newCartDetails => {
      // console.log('hiii', newCartDetails)
      this.setState({cartData: newCartDetails})
    }
    return (
      <div className="cart-content-box">
        <div className="cart-checkout-box">
          <button
            className="cart-back-btn"
            type="button"
            title="Back"
            onClick={this.doNavigateToHome}
          >
            <FaArrowLeft size={25} /> back
          </button>
          <p className="cart-checkout-para">Checkout</p>
        </div>
        <p className="cart-items-box-head">
          <span className="cart-items-head-span">Items</span>
          <span className="cart-items-head-span">
            Items ({cartData.length})
          </span>
        </p>
        <div className="cart-items-box">
          <ul className="cart-ul-box">
            {cartData.map(each => (
              <CartProductItem
                key={each.id}
                eachProductInfo={each}
                doSetCartItemsList={updateSetCartList}
              />
            ))}
          </ul>
          <div className="cart-summary-box">
            <h4 className="cart-summary-para">
              Total ({cartData.length} Items) : &#8377;{' '}
              <span data-testid="total-price">{totalAmount}</span>
            </h4>
            <button
              type="button"
              className="checkout-btn"
              data-testid="checkout button"
              onClick={this.doPaymentSuccess}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#088c03" height={50} width={50} />
    </div>
  )

  renderPaymentSuccess = () => <CartPaymentView />

  renderFunc = () => {
    const {renderStatus} = this.state
    switch (renderStatus) {
      case cartContentStatus.loading:
        return this.renderLoading()
      case cartContentStatus.success:
        return this.renderSuccess()
      case cartContentStatus.paymentSuccess:
        return this.renderPaymentSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cart-container home-container">
        <Header />
        {this.renderFunc()}
        <Footer />
      </div>
    )
  }
}

export default Cart
