import React from 'react'

const ContextDetails = React.createContext({
  apiData: {},
  updateApiData: {},
  userName: '',
  updateUserName: {},
  cartList: [],
  updateCartList: {},
  catsListData: [],
  updateCatsListData: {},
})

export default ContextDetails
