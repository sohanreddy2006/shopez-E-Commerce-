import { Eye, ShoppingBag, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

const ProductCard = ({ product, onError }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const finalPrice = product.price - (product.price * product.discount) / 100;

  const shopNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity: 1 });
      navigate('/checkout');
    } catch (error) {
      onError?.(getErrorMessage(error));
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img src={product.image} alt={product.title} className="product-image" />
      </Link>
      {product.discount > 0 && <span className="discount-badge">{product.discount}% off</span>}
      <div className="product-card-body">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <span className="product-category">{product.category}</span>
          <span className="rating-pill">
            <Star size={14} fill="currentColor" />
            {product.rating?.toFixed(1)}
          </span>
        </div>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="price-row">
          <strong>{formatPrice(finalPrice)}</strong>
          {product.discount > 0 && <span>{formatPrice(product.price)}</span>}
        </div>
        <div className="product-actions">
          <button className="btn btn-primary flex-grow-1" type="button" onClick={shopNow}>
            <ShoppingBag size={17} />
            Shop Now
          </button>
          <Link className="btn btn-outline-secondary icon-button" to={`/products/${product._id}`} title="View details">
            <Eye size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export { formatPrice };
export default ProductCard;
