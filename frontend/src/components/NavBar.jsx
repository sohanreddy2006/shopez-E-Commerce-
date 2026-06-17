import { Heart, LayoutDashboard, LogOut, Moon, PackageSearch, ShoppingCart, Sun, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const NavBar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span>ShopEZ</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link" to="/">
              <PackageSearch size={18} />
              Products
            </NavLink>
            <NavLink className="nav-link cart-link" to="/cart">
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </NavLink>
            {user ? (
              <>
                <NavLink className="nav-link" to="/wishlist">
                  <Heart size={18} />
                  Wishlist
                </NavLink>
                <NavLink className="nav-link" to="/profile">
                  <UserRound size={18} />
                  Profile
                </NavLink>
                {isAdmin && (
                  <NavLink className="nav-link" to="/admin">
                    <LayoutDashboard size={18} />
                    Admin
                  </NavLink>
                )}
                <button className="nav-link nav-button" type="button" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
                <button className="nav-link nav-button" type="button" onClick={toggleTheme} title="Toggle theme">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-primary btn-sm" to="/register">
                  Create Account
                </NavLink>
                <button className="nav-link nav-button" type="button" onClick={toggleTheme} title="Toggle theme">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
