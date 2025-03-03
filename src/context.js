import React from 'react'

const ContextDetails = React.createContext({
  eCommerceData: [],
  updateEcommerceData: () => {},
  contextCartList: [],
  updateContextCartList: () => {},
})

export default ContextDetails
