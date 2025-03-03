import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductBox from '../../components/ProductBox'

import './style.css'

const apiStatusList = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

// localStorage.removeItem('ecomData')
// localStorage.removeItem('cartData')
// localStorage.removeItem('localCategoryTabsList')

class Home extends Component {
  state = {
    loadStatus: apiStatusList.loading,
    ecomData: [],
    categoryTabsList: [],
  }

  componentDidMount() {
    // console.log('in mounted')
    const getLocalData = JSON.parse(localStorage.getItem('ecomData')) || []
    // console.log('getLocalData ', getLocalData)
    if (getLocalData.length === 0 || !Array.isArray(getLocalData)) {
      this.doStartApi()
    } else {
      this.setState({loadStatus: apiStatusList.success, ecomData: getLocalData})
    }

    const gotLocalCatTabsData =
      JSON.parse(localStorage.getItem('localCategoryTabsList')) || []
    if (gotLocalCatTabsData) {
      this.setState({categoryTabsList: gotLocalCatTabsData})
    }
  }

  updateEcomList = () => {
    const updateEcom = JSON.parse(localStorage.getItem('ecomData')) || []
    this.setState({ecomData: updateEcom})
  }

  modifyEcomDataList = ecomData => {
    const modifiedEcomData = ecomData.map(eachCatInfo => {
      const productsModified = eachCatInfo.products.map(eachProd => ({
        ...eachProd,
        count: 0,
      }))

      return {
        ...eachCatInfo,
        products: [...productsModified],
        activeTab: false,
      }
    })

    const tabsList = modifiedEcomData.map(each => ({
      categoryName: each.name,
      activeTab: each.activeTab,
    }))
    tabsList.unshift({
      categoryName: 'All',
      activeTab: true,
    })
    // console.log('tabsList : ', tabsList)
    // console.log('modifiedEcomData : ', modifiedEcomData)
    this.setState({
      ecomData: modifiedEcomData,
      loadStatus: apiStatusList.success,
      categoryTabsList: tabsList,
    })
    localStorage.setItem('ecomData', JSON.stringify(modifiedEcomData))
    localStorage.setItem('localCategoryTabsList', JSON.stringify(tabsList))
  }

  doStartApi = async () => {
    this.setState({loadStatus: apiStatusList.loading})
    const url = 'https://apis2.ccbp.in/nxt-mart/category-list-details'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const fetching = await fetch(url, options)
      const response = await fetching.json()
      const data = response.categories
      // console.log('Ecom Data : ' , data.categories)
      if (fetching.ok && Array.isArray(data) && data) {
        this.modifyEcomDataList(data)
      } else {
        this.setState({
          ecomData: [],
          loadStatus: apiStatusList.failure,
        })
        throw new Error('Invalid API Response')
      }
    } catch (e) {
      this.setState({
        ecomData: [],
        loadStatus: apiStatusList.failure,
      })
      console.log('ERROR: ', e)
      console.error('Error: ', e)
    }
  }

  renderProdUls = () => {
    const {ecomData} = this.state

    if (!Array.isArray(ecomData) || ecomData.length === 0) return null
    return ecomData.map(each => (
      <ProductBox
        productDetails={each}
        key={each.name}
        reRenderHome={this.updateEcomList}
      />
    ))
  }

  doUpdateTab = clickedTabName => {
    // console.log('clickedTabName : ', clickedTabName)
    const {ecomData, categoryTabsList} = this.state
    const updatedCatTabsList = categoryTabsList.map(each => ({
      ...each,
      activeTab: each.categoryName === clickedTabName,
    }))
    // console.log('updatedCatTabsList', updatedCatTabsList)

    const filteredEcomData = ecomData.filter(
      eachData => eachData.name !== clickedTabName,
    )
    const clickedCatInfo = ecomData.filter(
      eachData => eachData.name === clickedTabName,
    )
    filteredEcomData.unshift(...clickedCatInfo)
    // console.log('filteredEcomData : ', filteredEcomData)
    this.setState({
      ecomData: filteredEcomData,
      categoryTabsList: updatedCatTabsList,
    })
    localStorage.setItem('ecomData', JSON.stringify(filteredEcomData))
    localStorage.setItem(
      'localCategoryTabsList',
      JSON.stringify(updatedCatTabsList),
    )
  }

  mobileNavBtns = mobileTabslist =>
    mobileTabslist.map((each, index) => (
      <li className="mobile-tab-li" key={each.categoryName || index}>
        <button
          type="button"
          className={`tab-btn ${each.activeTab ? 'active-tab' : ''}`}
          onClick={() => this.doUpdateTab(each.categoryName)}
          value={each.categoryName}
        >
          {each.categoryName}
        </button>
      </li>
    ))

  renderAsideBox = () => {
    const {categoryTabsList} = this.state

    // console.log('categoryTabsList', categoryTabsList)
    return (
      <aside className="aside">
        <h3 className="aside-head">Categories</h3>
        <ul className="category-tabs-ul">
          {categoryTabsList.map((eachCat, index) => (
            <li className="tab-li" key={eachCat.categoryName || index}>
              <button
                type="button"
                className={`tab-btn ${eachCat.activeTab ? 'active-tab' : ''}`}
                onClick={() => this.doUpdateTab(eachCat.categoryName)}
              >
                {eachCat.categoryName}
              </button>
            </li>
          ))}
        </ul>
        <nav className="categories-tabs-nav">
          <ul className="category-tabs-mobile-ul">
            {this.mobileNavBtns(categoryTabsList)}
          </ul>
        </nav>
      </aside>
    )
  }

  renderSuccess = () => (
    <main className="home-main">
      {this.renderAsideBox()}
      <section className="products-content-container">
        {this.renderProdUls()}
      </section>
    </main>
  )

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#088C03" height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510218/Das-NxtMart/error_kubyhe.png"
        alt="failure view"
        data-testid="failure-view"
        className="failure-img"
      />
      <h1 className="failure-head" data-testid="failure-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="failure-para" data-testid="failure-view-para">
        We are having some trouble, please try again.
      </p>
      <button
        type="button"
        className="retry-btn"
        data-testid="retry-button"
        onClick={this.doStartApi}
      >
        Retry
      </button>
    </div>
  )

  rendersFunc = () => {
    const {loadStatus} = this.state
    switch (loadStatus) {
      case apiStatusList.loading:
        return this.renderLoading()
      case apiStatusList.failure:
        return this.renderFailure()
      case apiStatusList.success:
        return this.renderSuccess()
      default:
        return this.renderLoading()
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        {this.rendersFunc()}
        <Footer />
      </div>
    )
  }
}

export default Home
