import './style.css'

const HomeProductItem = props => {
  const localEcomData = JSON.parse(localStorage.getItem('ecomData'))
  const {eachProductInfo, doReRenderHome} = props
  const {id, name, weight, price, image, count} = eachProductInfo
  const formattedPrice = Number(price.slice(1)).toFixed(
    price.includes('.') ? 2 : 0,
  )

  const reRenderHome = () => {
    doReRenderHome()
  }

  const addProdInCart = newProduct => {
    // console.log('adding Product in Cart : ', newProduct)
    const getLocalCartList = JSON.parse(localStorage.getItem('cartData')) || []

    let newCartList
    const cartProdExists = getLocalCartList.some(
      each => each.id === newProduct.id,
    )
    if (newProduct.count > 0) {
      newCartList = cartProdExists
        ? getLocalCartList.map(eachCartProd =>
            eachCartProd.id === newProduct.id ? {...newProduct} : eachCartProd,
          )
        : [...getLocalCartList, newProduct]
    } else {
      newCartList = getLocalCartList.filter(each => each.id !== newProduct.id)
    }
    localStorage.setItem('cartData', JSON.stringify(newCartList))
  }

  const doAddInCart = isAdd => {
    // console.log(id, localEcomData)
    const filteredEcomData = localEcomData.map(eachCat => {
      const filteredProducts = eachCat.products.map(eachProd => {
        if (eachProd.id === id) {
          const newCount = isAdd
            ? eachProd.count + 1
            : Math.max(eachProd.count - 1, 0)
          const newProduct = {
            ...eachProd,
            count: newCount,
          }
          addProdInCart(newProduct)
          return newProduct
        }
        return eachProd
      })
      return {
        ...eachCat,
        products: filteredProducts,
      }
    })
    // console.log('filteredEcomData : ', filteredEcomData)
    localStorage.setItem('ecomData', JSON.stringify(filteredEcomData))
    reRenderHome()
  }

  return (
    <li className="product-card" data-testid="product">
      <img className="product-card-img" loading="lazy" src={image} alt={name} />
      <div className="product-card-info">
        <div className="product-card-content">
          <h6 className="prod-name" data-testid="product-name">
            {name}
          </h6>
          <p className="prod-weight" data-testid="product-weight">
            {weight}
          </p>
          <p className="prod-price" data-testid="product-price">
            {price[0] + formattedPrice}
          </p>
        </div>
        <div className="added-btns-box">
          {count > 0 ? (
            <>
              <button
                type="button"
                className="added-btn"
                data-testid="decrement-count"
                aria-label="Decrease Quantity"
                onClick={() => doAddInCart(false)}
              >
                -
              </button>
              <span className="added-span" data-testid="active-count">
                {count}
              </span>
              <button
                type="button"
                className="added-btn"
                data-testid="increment-count"
                aria-label="Increase Quantity"
                onClick={() => doAddInCart(true)}
              >
                +
              </button>
            </>
          ) : (
            <button
              type="button"
              className="add-prod-btn"
              data-testid="add-button"
              aria-label="Add Product Button"
              onClick={() => doAddInCart(true)}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

export default HomeProductItem
