import ProductItem from '../ProductItem'

import './style.css'

const ProductBox = props => {
  const {productDetails} = props
  const {name, products} = productDetails
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
          <ProductItem eachProductInfo={each} catName={name} key={each.id} />
        ))}
      </ul>
    </div>
  )
}

export default ProductBox
