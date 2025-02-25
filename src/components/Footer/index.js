import {Link} from 'react-router-dom'
import {
  FaFacebookSquare,
  FaPinterestSquare,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa'

import './style.css'

const Footer = () => (
  <footer className="footer">
    <div className="footer-box">
      <p className="footer-para">
        For any queries, contact +91-9876543210 <br />
        or mail us help@nxtmart.co.in
      </p>
      <div className="social-icons-box">
        <Link to="https://facebook.com">
          <FaFacebookSquare color="#fff" size={25} />
        </Link>
        <Link to="https://pinterest.com">
          <FaPinterestSquare color="#fff" size={25} />
        </Link>
        <Link to="https://twitter.com">
          <FaTwitter color="#fff" size={25} />
        </Link>
        <Link to="https://instagram.com">
          <FaInstagram color="#fff" size={25} />
        </Link>
      </div>
      <br />
      <br />
      <br />
      <p className="footer-copyright">
        Copyright &copy; 2023 NxtMart Grocery Supplies Pvt Ltd
      </p>
    </div>
  </footer>
)

export default Footer
