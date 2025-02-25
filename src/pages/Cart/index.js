import {useState, useEffect, useContext} from 'react'
import Loader from 'react-loader-spinner'
import {FaArrowLeft} from 'react-icons/fa6'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductItem from '../../components/ProductItem'
import ContextDetails from '../../context'

import './style.css'

const cartContentStatus = {
  loading: 'LOADING',
  emptyCart: 'EMPTYCART',
  nonEmptyCart: 'NONEMPTYCART',
  paymentSuccess: 'PAYMENTSUCCESS',
}

const Cart = props => {
  const {updateCartList} = useContext(ContextDetails)
  const {history} = props
  // console.log(cartList)
  const [renderStatus, setRenderStatus] = useState(cartContentStatus.loading)
  // console.log('renderStatus', renderStatus)
  const [cartItems, setCartItems] = useState([])
  // console.log('in cart page')

  useEffect(() => {
    const cartDataLS = JSON.parse(localStorage.getItem('cartDataList')) || []
    // console.log('cartDataLS', cartDataLS)
    if (cartDataLS.length > 0) {
      setCartItems(cartDataLS)
      updateCartList(cartDataLS)
      setRenderStatus(cartContentStatus.nonEmptyCart)
    } else {
      setCartItems([])
      setRenderStatus(cartContentStatus.emptyCart)
    }
  }, [setCartItems, updateCartList])

  const renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  const renderEmptyCart = () => (
    <div className="empty-container">
      <img
        className="empty-cart-img"
        src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510218/Das-NxtMart/Logo_cp9rxn.png"
        alt="empty cart"
      />
      <h3 className="empty-para">Your cart is empty</h3>
    </div>
  )

  const doNavigateToHome = () => {
    history.replace('/')
  }

  const doPaymentSuccess = () => {
    setRenderStatus(cartContentStatus.paymentSuccess)
    localStorage.removeItem('cartDataList')
    updateCartList([])
    setCartItems([])
  }

  const renderSuccess = () => {
    if (cartItems.length === 0) {
      setRenderStatus(cartContentStatus.emptyCart)
    }
    // console.log('cartList in cart', cartItems)
    // const totalAmount = 100
    const totalAmount =
      cartItems.reduce((prev, each) => prev + each.totalAmount, 0) || 0
    // console.log(totalAmount)

    const updateSetCartList = newCartDetails => {
      // console.log('hiii', newCartDetails)
      // console.log()
      setCartItems(newCartDetails)
    }

    return (
      <div className="cart-content-box">
        <div className="cart-checkout-box">
          <button
            className="cart-back-btn"
            type="button"
            title="Back"
            onClick={doNavigateToHome}
          >
            <FaArrowLeft size={25} /> back
          </button>
          <p className="cart-checkout-para">Checkout</p>
        </div>
        <p className="cart-items-box-head">
          <span className="cart-items-head-span">Items</span>
          <span className="cart-items-head-span">
            Items &#40;{cartItems.length}&#41;
          </span>
        </p>
        <div className="cart-items-box">
          <ul className="cart-ul-box">
            {cartItems.map(each => (
              <ProductItem
                key={each.id}
                eachProductInfo={each}
                catName={each.prodCategory}
                isCartItem="cartItem"
                doSetCartItemsList={updateSetCartList}
              />
            ))}
          </ul>
          <div className="cart-summary-box">
            <h4 className="cart-summary-para" data-testid="total-price">
              Total &#40;{cartItems.length}{' '}
              {cartItems.length > 1 ? 'items' : 'item'} &#41; : &#8377;{' '}
              {totalAmount}
            </h4>
            <button
              type="button"
              className="checkout-btn"
              onClick={doPaymentSuccess}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }

  const doReturnToHome = () => {
    console.log('return home func')
    history.replace('/')
    // setRenderStatus(cartContentStatus.emptyCart)
  }

  const doClearCarList = () => {
    updateCartList([])
    doReturnToHome()
  }

  const renderPaymentSuccess = () => (
    <div className="payment-container">
      <img
        className="payment-logo"
        src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510219/Das-NxtMart/pay-success_jnylih.png"
        alt="payment success"
      />
      <h3 className="payment-head">Payment Successful</h3>
      <p className="payment-para">Thank you for Ordering.</p>
      <p className="payment-para">Your payment is successfully completed.</p>
      <button
        type="button"
        onClick={() => doClearCarList()}
        className="payment-btn"
      >
        Return to Homepage
      </button>
    </div>
  )

  const renderFunc = () => {
    switch (renderStatus) {
      case cartContentStatus.loading:
        return renderLoading()
      case cartContentStatus.emptyCart:
        return renderEmptyCart()
      case cartContentStatus.nonEmptyCart:
        return renderSuccess()
      case cartContentStatus.paymentSuccess:
        return renderPaymentSuccess()
      default:
        return renderLoading()
    }
  }

  return (
    <div className="cart-container home-container">
      <Header />
      {renderFunc()}
      <Footer />
    </div>
  )
}

export default Cart
