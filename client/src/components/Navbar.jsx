
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartCount } = useCart();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="logo"
        >
          Averza
        </Link>

        <div className="nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link
            to="/cart"
            className="cart-link"
          >
            <ShoppingCart size={18} />

            <span>
              Cart ({cartCount})
            </span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/orders"
                className="orders-link"
              >
                <Package size={18} />

                <span>
                  My Orders
                </span>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="admin-nav-link"
                >
                  <ShieldCheck size={18} />

                  <span>
                    Admin Panel
                  </span>
                </Link>
              )}

              <span className="nav-user">
                <User size={18} />

                <span>
                  Hi, {user?.firstName || "User"}
                </span>
              </span>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={17} />

                <span>
                  Logout
                </span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="login-link"
            >
              <User size={18} />

              <span>
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;