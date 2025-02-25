import {useContext} from 'react'
import ContextDetails from '../../context'
import './style.css'

const ProductItem = props => {
  const {apiData, updateApiData, updateCartList} = useContext(ContextDetails)
  const {
    eachProductInfo,
    catName = 'none',
    isCartItem = '',
    doSetCartItemsList,
  } = props
  const cItemStyle = isCartItem === 'cartItem'
  const {id, name, weight, price, image, addCount} = eachProductInfo
  const formattedPrice = Number(price.slice(1)).toFixed(
    price.includes('.') ? 2 : 0,
  )
  // console.log('price', price, formattedPrice)
  // console.log(eachProductInfo)
  const doAddInCart = isAdd => {
    // console.log('incart')
    // console.log('eachProductInfo', eachProductInfo)
    // Updated ApiData and Given in Context
    const newUpdatedApiData = apiData.map(eachCat => {
      if (eachCat.name === catName) {
        const filterProducts = eachCat.products.map(eachProd => {
          const newAddCount =
            !isAdd && eachProd.addCount >= 0
              ? eachProd.addCount - 1
              : eachProd.addCount + 1
          if (id === eachProd.id) {
            const updatedProduct = {
              ...eachProd,
              addCount: newAddCount,
              totalAmount: Number(eachProd.price.slice(1)) * newAddCount,
              prodCategory: catName,
            }
            if (updatedProduct.addCount >= 0) updateCartList(updatedProduct)
            // console.log('updatedProduct', updatedProduct)
            return updatedProduct
          }
          return eachProd
        })
        // console.log('filterProducts', filterProducts)
        return {...eachCat, products: filterProducts}
      }
      return eachCat
    })
    // console.log(apiData, newUpdatedApiData)
    updateApiData(newUpdatedApiData)
  }

  const formattedWeight = []
  let count = 0
  while (count < weight.split('').length) {
    if (!['g', 'm', 'k', 'L', 'p'].includes(weight[count])) {
      formattedWeight.push(weight[count])
    } else {
      break
    }
    count += 1
  }
  const qName = weight.slice(formattedWeight.length, weight.length)
  formattedWeight.push(' ', qName)
  const convertedWeight = formattedWeight.join('')

  const returnHomeBtnBoxs = () =>
    addCount > 0 ? (
      <div className="added-btns-box">
        <button
          type="button"
          className="added-btn"
          onClick={() => doAddInCart(false)}
          data-testid="decrement-count"
        >
          -
        </button>
        <span className="added-span" data-testid="active-count">
          {addCount}
        </span>
        <button
          type="button"
          className="added-btn"
          onClick={() => doAddInCart(true)}
          data-testid="increment-count"
        >
          +
        </button>
      </div>
    ) : (
      <button
        type="button"
        className="add-prod-btn"
        onClick={() => doAddInCart(true)}
      >
        Add
      </button>
    )

  const updateCartItemsList = isCartAdd => {
    const getCartLocalS = JSON.parse(localStorage.getItem('cartDataList')) || []

    const updatedLocalCartList = getCartLocalS
      ?.map(each => {
        const newAddCount =
          !isCartAdd && each.addCount > 0
            ? each.addCount - 1
            : each.addCount + 1

        if (each.id === id) {
          if (!isCartAdd && each.addCount === 1) {
            return null
          }
          return {
            ...each,
            addCount: newAddCount,
            totalAmount: Number(each.price.slice(1)) * newAddCount,
            prodCategory: catName,
          }
        }
        return {
          ...each,
        }
      })
      .filter(each => each !== null)
    // console.log('updatedLocalCartList', updatedLocalCartList)
    localStorage.setItem('cartDataList', JSON.stringify(updatedLocalCartList))
    doSetCartItemsList(updatedLocalCartList)

    const updatingApiData = apiData.map(eachCat => {
      if (eachCat.name === catName) {
        return {
          ...eachCat,
          products: eachCat.products.map(eachProd =>
            eachProd.id === id
              ? {
                  ...eachProd,
                  addCount:
                    updatedLocalCartList.find(p => p.id === id)?.addCount || 0,
                }
              : eachProd,
          ),
        }
      }
      return eachCat
    })

    // console.log('updatingApiData', updatingApiData)
    updateApiData(updatingApiData)
  }

  const modifyCartAndHome = value => {
    updateCartItemsList(value)
    doAddInCart(value)
  }

  const returnCartBtnsBox = () => (
    <div className="added-btns-box">
      <button
        type="button"
        className="added-btn"
        onClick={() => modifyCartAndHome(false)}
        data-testid="decrement-quantity"
      >
        -
      </button>
      <span className="added-span" data-testid="item-quantity">
        {addCount}
      </span>
      <button
        type="button"
        className="added-btn"
        onClick={() => modifyCartAndHome(true)}
        data-testid="increment-quantity"
      >
        +
      </button>
    </div>
  )

  return (
    <li
      className={`product-card ${cItemStyle ? 'cartItem-card' : ''}`}
      data-testid={cItemStyle ? 'cartItem' : 'productItem'}
    >
      <img
        className={`product-card-img ${cItemStyle ? 'cartItem-card-img' : ''}`}
        loading="lazy"
        src={image}
        alt={name}
      />
      <div
        className={`product-card-info ${
          cItemStyle ? 'cartItem-card-info' : ''
        }`}
      >
        <div className="product-card-content">
          <h6 className="prod-name">{name}</h6>
          <p className="prod-weight">{convertedWeight}</p>
          <p className="prod-price">
            {price[0]}
            {formattedPrice}
          </p>
        </div>
        {cItemStyle ? returnCartBtnsBox() : returnHomeBtnBoxs()}
      </div>
    </li>
  )
}

export default ProductItem
