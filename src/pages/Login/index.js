import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './style.css'

class Login extends Component {
  state = {
    inputUsername: 'deepak',
    inputPassword: 'lightstar@1',
    isShowPassword: false,
    errorMsgPara: '',
    isLoading: false,
  }

  doCallLoginApi = async () => {
    console.log('clicked login')
    const {inputUsername, inputPassword} = this.state
    const {history} = this.props
    this.setState({isLoading: true})

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
      Cookies.set('jwt_token', gotToken, {expires: 7})
      this.setState({
        inputUsername: '',
        inputPassword: '',
        errorMsgPara: '',
        isLoading: false,
      })
      history.replace('/')
      console.log('Successfully Logged In...')
    } else {
      this.setState({errorMsgPara: data.error_msg})
      console.log('Error : ', data.error_msg)
    }
  }

  onSubmitForm = e => {
    e.preventDefault()
    this.doCallLoginApi()
    // console.log('in submit form func')
  }

  handleInputUsername = e => {
    this.setState({inputUsername: e.target.value})
  }

  userInputBox = () => {
    const {inputUsername} = this.state
    return (
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
            onChange={this.handleInputUsername}
            value={inputUsername}
          />
        </div>
      </div>
    )
  }

  handleInputPassword = e => {
    this.setState({inputPassword: e.target.value})
  }

  passwordInputBox = () => {
    const {inputPassword, isShowPassword} = this.state
    return (
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
            onChange={this.handleInputPassword}
            value={inputPassword}
          />
        </div>
      </div>
    )
  }

  handlePasswordCheck = () => {
    this.setState(prevState => ({isShowPassword: !prevState.isShowPassword}))
  }

  checkPassBox = () => {
    const {isShowPassword} = this.state
    return (
      <div className="input-box">
        <input
          type="checkbox"
          checked={isShowPassword}
          id="showPassword"
          onChange={this.handlePasswordCheck}
        />
        <label htmlFor="showPassword" id="showPassword">
          Show Password
        </label>
      </div>
    )
  }

  render() {
    const isLoggedIn = Cookies.get('jwt_token')
    if (isLoggedIn) {
      return <Redirect to="/" />
    }

    const {inputUsername, inputPassword, errorMsgPara, isLoading} = this.state
    return (
      <div className="login-container">
        <div className="login-card">
          <img
            className="login-logo"
            src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510223/Das-NxtMart/Logo_2_rtxtbu.png"
            alt="login website logo"
          />
          <form onSubmit={e => this.onSubmitForm(e)}>
            {this.userInputBox()}
            {this.passwordInputBox()}
            {this.checkPassBox()}
            <button
              type="submit"
              className="login-btn"
              disabled={!inputUsername && !inputPassword}
              style={{
                backgroundColor:
                  inputUsername && inputPassword ? 'green' : 'gray',
                cursor:
                  inputUsername && inputPassword ? 'pointer' : 'not-allowed',
              }}
            >
              {isLoading && !errorMsgPara ? 'Logging in...' : 'Login'}
            </button>
            <p className="errormsg-para">{errorMsgPara}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
