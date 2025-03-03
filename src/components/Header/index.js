import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'

import {BiHomeAlt} from 'react-icons/bi'
import {PiShoppingCartSimpleLight} from 'react-icons/pi'
import {HiOutlineLogout} from 'react-icons/hi'

import './style.css'

const Header = props => {
  const {history} = props
  const path = history.location.pathname
  const pathId = path.split('/').pop()

  const doLogout = () => {
    Cookies.remove('jwt_token')
    localStorage.removeItem('ecomData')
    localStorage.removeItem('cartData')
    localStorage.removeItem('localCategoryTabsList')
    history.replace('/')
  }

  const screenWidth = window.innerWidth
  // console.log('screenWidth : ', screenWidth)

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img
          src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510223/Das-NxtMart/Logo_2_rtxtbu.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <nav className="header-nav desktop-menus-ulbox">
        <Link
          to="/"
          className={`desktop-menu-link mobile-nav-link ${
            pathId === '' ? 'active-menuTab' : ''
          }`}
        >
          {screenWidth > 767 ? (
            'Home'
          ) : (
            <BiHomeAlt
              size={25}
              className="header-nav-icon"
              color={pathId === '' ? '#088C03' : 'gray'}
            />
          )}
        </Link>
        <Link
          to="/cart"
          className={`desktop-menu-link mobile-nav-link ${
            pathId === 'cart' ? 'active-menuTab' : ''
          }`}
        >
          {screenWidth > 767 ? (
            'Cart'
          ) : (
            <PiShoppingCartSimpleLight
              size={25}
              className="header-nav-icon"
              color={pathId === 'cart' ? '#088C03' : 'gray'}
              style={{strokeWidth: '5px'}}
            />
          )}
        </Link>
        <button
          type="button"
          className="logout-btn mobile-nav-btn"
          onClick={doLogout}
          data-testid="logout"
        >
          <HiOutlineLogout
            size={25}
            color="gray"
            style={screenWidth > 767 && {transform: 'scaleX(-1)'}}
          />
          {screenWidth > 767 && 'Logout'}
        </button>
      </nav>
    </header>
  )
}

export default withRouter(Header)
