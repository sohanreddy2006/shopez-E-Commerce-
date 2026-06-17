import { Heart, ShoppingBag, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import Breadcrumbs from '../components/Breadcrumbs';
import { ProductDetailsSkeleton } from '../components/Skeleton';
import { formatPrice } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [productNote, setProductNote] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setSelectedSize(data.sizes?.[0] || '');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const addItem = async (goCheckout = false) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity, selectedSize, productNote });
      setSuccess('Added to cart');
      if (goCheckout) navigate('/checkout');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/products/${id}/reviews`, review);
      setReview({ rating: 5, comment: '' });
      setSuccess('Review added');
      await loadProduct();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <ProductDetailsSkeleton />;
  if (!product) return <div className="container py-5"><Alert message={error || 'Product unavailable'} /></div>;

  const finalPrice = product.price - (product.price * product.discount) / 100;
  const inWishlist = user ? isInWishlist(product._id) : false;

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    const result = await toggleWishlist(product);
    if (result) showToast('Added to wishlist', 'info');
    else showToast('Removed from wishlist');
  };

  return (
    <section className="container page-block">
      <Breadcrumbs
        paths={[
          { label: product.category, to: '/?category=' + encodeURIComponent(product.category) },
          { label: product.title }
        ]}
      />
      <Alert message={error} />
      <Alert type="success" message={success} />
      <div className="details-layout">
        <div className="details-media">
          <img src={product.image} alt={`${product.title} by ${product.brand}`} />
        </div>
        <div className="details-copy">
          <span className="product-category">{product.category}</span>
          <h1>{product.title}</h1>
          <div className="details-rating">
            <Star size={18} fill="currentColor" />
            <strong>{product.rating?.toFixed(1)}</strong>
            <span>{product.numReviews} reviews</span>
          </div>
          <p>{product.description}</p>
          <div className="details-price">
            <strong>{formatPrice(finalPrice)}</strong>
            {product.discount > 0 && <span>{formatPrice(product.price)}</span>}
            {product.discount > 0 && <em>{product.discount}% off</em>}
          </div>
          <div className="stock-line">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>

          {product.sizes?.length > 0 && (
            <label className="field-label">
              Size
              <select className="form-select" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="field-label">
            Quantity
            <input
              className="form-control"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>
          <label className="field-label">
            Product request
            <textarea className="form-control" rows="3" value={productNote} onChange={(event) => setProductNote(event.target.value)} />
          </label>
          <div className="details-actions">
            <button className="btn btn-outline-primary" type="button" onClick={() => addItem(false)} disabled={product.stock === 0}>
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="btn btn-primary" type="button" onClick={() => addItem(true)} disabled={product.stock === 0}>
              <ShoppingBag size={18} />
              Shop Now
            </button>
            {user && (
              <button className={`wishlist-btn ${inWishlist ? 'active' : ''}`} type="button" onClick={handleWishlist} title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-layout">
        <section>
          <h2>Customer Reviews</h2>
          {product.reviews?.length ? (
            <div className="review-list">
              {product.reviews.map((item) => (
                <article className="review-item" key={item._id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.rating}/5</span>
                  </div>
                  <p>{item.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">No reviews yet.</div>
          )}
        </section>
        <form className="review-form" onSubmit={submitReview}>
          <h2>Add Review</h2>
          <label>
            Rating
            <select className="form-select" value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </label>
          <label>
            Comment
            <textarea className="form-control" rows="4" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} required />
          </label>
          <button className="btn btn-primary" type="submit">
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProductDetails;
