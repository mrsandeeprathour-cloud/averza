import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Averza</h2>
          <p>
            Quality products, simple shopping and a better
            online experience.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h3>Shop</h3>
            <Link to="/products">All Products</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div>
            <h3>Account</h3>
            <Link to="/login">Login</Link>
            <Link to="/register">Create Account</Link>
          </div>

          <div>
            <h3>Company</h3>
            <Link to="/">About Averza</Link>
            <Link to="/">Contact</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Averza. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;