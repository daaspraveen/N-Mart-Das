import HomeProductItem from '../HomeProductItem'

import './style.css'

const ProductBox = props => {
  const {productDetails, reRenderHome} = props
  const {name, products} = productDetails
  // console.log('productDetails : ', productDetails, name, products)
  return (
    <div className="products-box">
      <div className="products-ul-head-box">
        <h3 className="products-ul-head">{name}</h3>
        <button type="button" className="view-all-btn">
          View all
        </button>
      </div>
      <ul className="product-box-ul">
        {products.map(each => (
          <HomeProductItem
            eachProductInfo={each}
            catName={name}
            key={each.id}
            doReRenderHome={reRenderHome}
          />
        ))}
      </ul>
    </div>
  )
}

export default ProductBox
