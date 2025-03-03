import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'

import './App.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/cart" component={Cart} />
        <Route path="*" component={NotFound} />
      </Switch>
    )
  }
}

export default App
