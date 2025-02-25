import './style.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dfjb7xrjo/image/upload/v1738510218/Das-NxtMart/not-found_bkawqs.png"
      alt="not found"
      className="not-found-img"
    />
    <h3 className="not-found-heading">Page Not Found</h3>
    <p className="not-found-para">
      We are sorry, the page you requested could not be found.
    </p>
  </div>
)

export default NotFound
