import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import ContextDetails from './context'

import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'

import './App.css'

class App extends Component {
  state = {userName: '', cartList: [], apiData: [], catsListData: []}

  updateUserName = inputUserName => {
    this.setState({userName: inputUserName})
  }

  updateCartList = itemDetails => {
    this.setState(
      prevState => ({
        cartList:
          itemDetails.addCount > 0
            ? [
                ...prevState.cartList.filter(
                  each => each.id !== itemDetails.id,
                ),
                itemDetails,
              ]
            : prevState.cartList.filter(each => each.id !== itemDetails.id),
      }),
      () => {
        const {cartList} = this.state
        localStorage.setItem('cartDataList', JSON.stringify(cartList))
      },
    )
  }

  updateApiData = newApiData => {
    this.setState({apiData: newApiData})
  }

  updateCatsList = newCatList => {
    this.setState({catsListData: newCatList})
  }

  render() {
    const {userName, cartList, apiData, catsListData} = this.state
    // console.log('cartList', cartList)
    return (
      <Switch>
        <ContextDetails.Provider
          value={{
            apiData,
            updateApiData: this.updateApiData,
            userName,
            updateUserName: this.updateUserName,
            cartList,
            updateCartList: this.updateCartList,
            catsListData,
            updateCatsListData: this.updateCatsList,
          }}
        >
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
        </ContextDetails.Provider>
      </Switch>
    )
  }
}

export default App
