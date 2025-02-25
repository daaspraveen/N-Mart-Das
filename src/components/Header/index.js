import Cookies from 'js-cookie'
import {useContext} from 'react'
import {Link, withRouter} from 'react-router-dom'

import {BiHomeAlt} from 'react-icons/bi'
import {PiShoppingCartSimpleLight} from 'react-icons/pi'
import {HiOutlineLogout} from 'react-icons/hi'
// import { FaCartShopping } from "react-icons/fa6";
// import { GiFruitBowl } from "react-icons/gi";

import ContextDetails from '../../context'
import './style.css'

const Header = props => {
  const {updateUserName} = useContext(ContextDetails)
  const {history} = props
  const path = history.location.pathname
  const pathId = path.split('/').pop()

  const doLogout = () => {
    Cookies.remove('jwt_token')
    updateUserName('')
    history.replace('/')
  }

  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510223/Das-NxtMart/Logo_2_rtxtbu.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
        <ul className="desktop-menus-ulbox">
          <li className="desktop-menu-li">
            <Link
              to="/"
              className={`desktop-menu-link ${
                pathId === '' ? 'active-menuTab' : ''
              }`}
            >
              Home
            </Link>
          </li>
          <li className="desktop-menu-li">
            <Link
              to="/cart"
              className={`desktop-menu-link ${
                pathId === 'cart' ? 'active-menuTab' : ''
              }`}
            >
              Cart
            </Link>
          </li>
          <li className="desktop-menu-li">
            <button type="button" className="logout-btn" onClick={doLogout}>
              <HiOutlineLogout
                size={25}
                color="#000"
                style={{transform: 'scaleX(-1)'}}
              />
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <nav className="mobile-nav">
        <button type="button" className="mobile-nav-btn" aria-label="Home">
          <Link
            to="/"
            className={`mobile-nav-link ${
              pathId === 'cart' ? 'active-menuTab' : ''
            }`}
          >
            <BiHomeAlt size={25} color={pathId === '' ? 'black' : 'gray'} />
          </Link>
        </button>
        <button type="button" className="mobile-nav-btn" aria-label="Cart">
          <Link
            to="/cart"
            className={`mobile-nav-link ${
              pathId === 'cart' ? 'active-menuTab' : ''
            }`}
          >
            <PiShoppingCartSimpleLight
              size={25}
              color={pathId === 'cart' ? 'black' : 'gray'}
              style={{strokeWidth: '5px'}}
            />
          </Link>
        </button>
        <button
          type="button"
          className="mobile-nav-btn"
          onClick={doLogout}
          aria-label="Logout"
        >
          <HiOutlineLogout
            size={25}
            color="gray"
            style={{strokeWidth: '1.5px'}}
          />
        </button>
      </nav>
    </header>
  )
}

export default withRouter(Header)
