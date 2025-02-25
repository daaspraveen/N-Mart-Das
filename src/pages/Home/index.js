import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {useEffect, useState, useContext, useCallback} from 'react'
// import {withRouter} from 'react-router-dom'
// import {v4 as uuid} from 'uuid'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductBox from '../../components/ProductBox'
import ContextDetails from '../../context'

import './style.css'

const apiStatusList = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Home = props => {
  const {updateApiData, apiData, updateCatsListData, catsListData} = useContext(
    ContextDetails,
  )
  // console.log('apiData', apiData)
  const {history} = props
  const preSetLoading =
    apiData.length > 0 ? apiStatusList.success : apiStatusList.loading
  const [apiStatus, setApiStatus] = useState(preSetLoading)
  const [categorysList, setCategorysList] = useState(catsListData || [])
  // console.log('categorysList', categorysList)
  // console.log('catsListData', catsListData)
  const [apiList, setApiList] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  const startApi = useCallback(async () => {
    // console.log('in start')

    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken) {
      console.error('JWTTOKEN IS MISSING')
      setApiStatus(apiStatusList.failure)
      history.push('/login')
      return
    }
    if (!apiData.length > 0) {
      const url = 'https://apis2.ccbp.in/nxt-mart/category-list-details'
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      }

      try {
        const response = await fetch(url, options)
        if (response.ok) {
          const data = await response.json()
          const filteredProds = data.categories.map(each => {
            const prods = each.products.map(eachProd => ({
              ...eachProd,
              addCount: 0,
              totalAmount: 0,
            }))
            return {...each, products: prods}
          })
          // console.log('filteredProds', filteredProds)
          // FINALLED ALL SETTED MAIN DATA
          setApiList(filteredProds)
          updateApiData(filteredProds)
          const catsList = filteredProds.map(each => ({
            tabName: each.name,
            activeTab: false,
          }))
          catsList.unshift({tabName: 'All', activeTab: true})
          setCategorysList(catsList)
          updateCatsListData(catsList)
          setApiStatus(apiStatusList.success)
        } else {
          setApiList([])
          setApiStatus(apiStatusList.failure)
          setCategorysList([])
        }
      } catch (e) {
        setApiStatus(apiStatusList.failure)
        setApiList([])
        console.log(e)
      }
    }
  }, [
    setApiList,
    setApiStatus,
    updateApiData,
    apiData,
    updateCatsListData,
    history,
  ])

  useEffect(() => {
    if (!apiData.length > 0) startApi()
    // console.log(apiData, 'a')
  }, [startApi, apiData])

  useEffect(() => {
    setApiList(apiData)
  }, [apiData])

  const doUpdateTab = tab => {
    // console.log('tab:', tab)
    setCategorysList(prevState => {
      const updatedCatList = prevState.map(each => ({
        ...each,
        activeTab: tab === each.tabName ? !each.activeTab : false,
      }))
      // console.log('updatedCatList', updatedCatList)
      return [...updatedCatList]
    })
    setActiveTab(tab)
  }

  const renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  const renderFailure = () => (
    <div className="failure-container">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510218/Das-NxtMart/error_kubyhe.png"
        alt="failure view"
      />
      <h3 className="failure-head">Oops! Something Went Wrong</h3>
      <p className="failure-para">we are having some trouble.</p>
      <button type="button" className="retry-btn" onClick={() => startApi()}>
        Retry
      </button>
    </div>
  )

  const renderProdUls = () => {
    // console.log('activeTab', activeTab)
    if (!apiList) return null
    const prodsUls = apiList
    const selectedTabProdUl = prodsUls.filter(each => each.name === activeTab)
    // console.log('selectedTabProdUl', selectedTabProdUl)
    const remainingProdUls = prodsUls.filter(each => each.name !== activeTab)
    // console.log('remainingProdUls', remainingProdUls)

    const filteredProdsUlList = [...selectedTabProdUl, ...remainingProdUls]
    // console.log('filteredProdsUlList', filteredProdsUlList)
    return filteredProdsUlList.map(each => (
      <ProductBox productDetails={each} key={each.name} />
    ))
  }

  const mobileNavBtns = () => {
    const mnblist = categorysList.length ? categorysList : catsListData || []
    return mnblist.map((each, index) => (
      <li className="mobile-tab-li" key={each.tabName || index}>
        <button
          type="button"
          className={`tab-btn ${each.activeTab ? 'active-tab' : ''}`}
          onClick={() => doUpdateTab(each.tabName)}
          value={each.tabName}
        >
          {each.tabName}
        </button>
      </li>
    ))
  }

  const renderSuccess = () => (
    <main className="home-main">
      <aside className="aside">
        <nav className="categories-tabs-nav">
          <ul className="category-tabs-mobile-ul">{mobileNavBtns()}</ul>
        </nav>
        <h3 className="aside-head">Categories</h3>
        <ul className="category-tabs-ul">
          {(() => {
            const dnblist = categorysList.length
              ? categorysList
              : catsListData || []
            return dnblist.map((each, index) => (
              <li className="tab-li" key={each.tabName || index}>
                <button
                  type="button"
                  className={`tab-btn ${each.activeTab ? 'active-tab' : ''}`}
                  onClick={() => doUpdateTab(each.tabName)}
                >
                  {each.tabName}
                </button>
              </li>
            ))
          })()}
        </ul>
      </aside>
      <section className="products-content-container">
        {renderProdUls()}
      </section>
    </main>
  )

  const rendersFunc = () => {
    switch (apiStatus) {
      case apiStatusList.loading:
        return renderLoading()
      case apiStatusList.success:
        return renderSuccess()
      case apiStatusList.failure:
        return renderFailure()
      default:
        return null
    }
  }

  return (
    <div className="home-container">
      <Header />
      {rendersFunc()}
      <Footer />
    </div>
  )
}

export default Home
