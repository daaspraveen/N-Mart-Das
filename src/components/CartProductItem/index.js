import './style.css'

const CartProductItem = props => {
  const {eachProductInfo, doSetCartItemsList} = props
  const {id, name, weight, price, image, count} = eachProductInfo
  // console.log('eachProductInfo', eachProductInfo)
  const formattedPrice = Number(price.slice(1)).toFixed(
    price.includes('.') ? 2 : 0,
  )
  const formattedWeight = []
  const qName = weight.slice(formattedWeight.length, weight.length)
  formattedWeight.push(' ', qName)
  const convertedWeight = formattedWeight.join('')

  // console.log('in Cart Prod Item...')

  const updateCartItemsList = isCartAdd => {
    const getLocalCartList = JSON.parse(localStorage.getItem('cartData')) || []
    const updatedLocalCartList = getLocalCartList
      ?.map(each => {
        const newCount =
          !isCartAdd && each.count > 0 ? each.count - 1 : each.count + 1

        if (each.id === id) {
          if (!isCartAdd && each.count === 1) {
            return null
          }
          return {
            ...each,
            count: newCount,
          }
        }
        return {
          ...each,
        }
      })
      .filter(each => each !== null)
    // console.log('updatedLocalCartList ', updatedLocalCartList)
    localStorage.setItem('cartData', JSON.stringify(updatedLocalCartList))
    doSetCartItemsList(updatedLocalCartList)

    const gotEcomData = JSON.parse(localStorage.getItem('ecomData')) || []
    const updatingEcomData = gotEcomData.map(eachCat => ({
      ...eachCat,
      products: eachCat.products.map(eachProd => {
        if (eachProd.id === id) {
          const existsInCartList = updatedLocalCartList.find(
            eachItem => eachProd.id === eachItem.id,
          )
          return existsInCartList
            ? {...existsInCartList}
            : {...eachProd, count: 0}
        }
        return {...eachProd}
      }),
    }))

    // console.log('updating EcomData ', updatingEcomData)
    localStorage.setItem('ecomData', JSON.stringify(updatingEcomData))
  }

  const modifyCartItemsQuantity = value => {
    updateCartItemsList(value)
    // console.log('in modifyCartAndHome ...', value)
  }

  return (
    <li className="product-card cartItem-card" data-testid="cartItem">
      <img
        className="product-card-img cartItem-card-img"
        loading="lazy"
        src={image}
        alt={name}
        data-testid="cartItem-image"
      />
      <div className="product-card-info cartItem-card-info">
        <div className="product-card-content">
          <h6 className="prod-name" data-testid="cartItem-name">
            {name}
          </h6>
          <p className="prod-weight" data-testid="cartItem-weight">
            {convertedWeight}
          </p>
          <p className="prod-price" data-testid="cartItem-price">
            {price[0] + formattedPrice}
          </p>
        </div>
        <div className="added-btns-box">
          <button
            type="button"
            className="added-btn"
            data-testid="decrement-quantity"
            aria-label="Decrease Quantity"
            onClick={() => modifyCartItemsQuantity(false)}
          >
            -
          </button>
          <p className="added-span" data-testid="item-quantity">
            {count}
          </p>
          <button
            type="button"
            className="added-btn"
            data-testid="increment-quantity"
            aria-label="Increase Quantity"
            onClick={() => modifyCartItemsQuantity(true)}
          >
            +
          </button>
        </div>
      </div>
    </li>
  )
}

export default CartProductItem
