import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { formatPrice } from '../components/ProductCard';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleRemove = async (product) => {
    await toggleWishlist(product);
    showToast('Removed from wishlist');
  };

  return (
    <section className="container page-block">
      <Breadcrumbs paths={[{ label: 'Wishlist' }]} />
      <div className="section-heading">
        <div>
          <span className="eyebrow">Saved items</span>
          <h1>My Wishlist ({wishlist.length})</h1>
        </div>
        <Link className="btn btn-outline-primary" to="/">
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
      </div>
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <Heart size={36} />
          <p>Your wishlist is empty.</p>
          <Link to="/">Browse products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((item) => {
            const finalPrice = item.price - (item.price * item.discount) / 100;
            return (
              <article className="product-card" key={item._id}>
                <Link to={`/products/${item.product}`} className="product-image-link">
                  <img src={item.image} alt={item.title} className="product-image" />
                </Link>
                {item.discount > 0 && <span className="discount-badge">{item.discount}% off</span>}
                <div className="product-card-body">
                  <h3 className="product-title">{item.title}</h3>
                  <div className="price-row">
                    <strong>{formatPrice(finalPrice)}</strong>
                    {item.discount > 0 && <span>{formatPrice(item.price)}</span>}
                  </div>
                  <div className="product-actions">
                    <Link className="btn btn-primary flex-grow-1" to={`/products/${item.product}`}>
                      <ShoppingBag size={17} /> View Details
                    </Link>
                    <button className="btn btn-outline-secondary icon-button danger" type="button" onClick={() => handleRemove(item)} title="Remove from wishlist">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Wishlist;
