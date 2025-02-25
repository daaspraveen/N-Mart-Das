import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {useState} from 'react'
// import ContextDetails from '../../context'

import './style.css'

const Login = props => {
  const {history} = props
  const [inputUsername, setInputUsername] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [isShowPassword, setShowPassword] = useState(false)
  const [errorMsgPara, setErrorMsgPara] = useState('')
  // const {updateUserName} = useContext(ContextDetails)

  const isLoggedIn = Cookies.get('jwt_token')
  if (isLoggedIn) {
    return <Redirect to="/" />
  }

  const doCallLoginApi = async () => {
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {
      username: inputUsername,
      password: inputPassword,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    // console.log(response)
    const data = await response.json()
    if (response.ok) {
      const gotToken = data.jwt_token
      setInputUsername('')
      setInputPassword('')
      setErrorMsgPara('')
      Cookies.set('jwt_token', gotToken, {expires: 7})
      history.replace('/')
    } else {
      setErrorMsgPara(data.error_msg)
      // console.log('Error : ', data.error_msg)
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    doCallLoginApi()
    // console.log(inputPassword, inputUsername)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          className="login-logo"
          src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510223/Das-NxtMart/Logo_2_rtxtbu.png"
          alt="login website logo"
        />
        <form onSubmit={onSubmit}>
          <div className="input-box">
            <label htmlFor="username" className="login-label">
              Username
            </label>
            <div className="input">
              <img
                src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738514052/Das-NxtMart/username-icon_cck8xw.png"
                alt="user icon"
                className="login-icons"
              />
              <input
                id="username"
                type="text"
                onChange={e => setInputUsername(e.target.value)}
                value={inputUsername}
              />
            </div>
          </div>
          <div className="input-box">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <div className="input">
              <img
                src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738514052/Das-NxtMart/password-icon_raavr0.png"
                alt="password icon"
                className="login-icons"
              />
              <input
                id="password"
                type={!isShowPassword ? 'password' : 'text'}
                onChange={e => setInputPassword(e.target.value)}
                value={inputPassword}
              />
            </div>
          </div>
          <div className="input-box">
            <input
              type="checkbox"
              checked={isShowPassword}
              id="showPassword"
              onChange={() => setShowPassword(prevState => !prevState)}
            />
            <label htmlFor="showPassword" id="showPassword">
              Show Password
            </label>
          </div>
          <button
            type="submit"
            className="login-btn"
            style={{
              backgroundColor:
                inputUsername && inputPassword ? 'green' : 'gray',
              cursor:
                inputUsername && inputPassword ? 'pointer' : 'not-allowed',
            }}
          >
            Login
          </button>
          <p className="errormsg-para">{errorMsgPara}</p>
        </form>
      </div>
    </div>
  )
}

export default Login
