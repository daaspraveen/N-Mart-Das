import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

const ProtectedRoute = props => {
  const isHadToken = Cookies.get('jwt_token')

  if (isHadToken) {
    return <Route {...props} />
  }
  return <Redirect to="/login" />
}

export default ProtectedRoute
