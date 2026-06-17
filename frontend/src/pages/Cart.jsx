import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const { cart, cartSubtotal, updateItem, removeItem } = useCart();
  const { showToast } = useToast();

  const handleRemove = (itemId, title) => {
    if (window.confirm(`Remove "${title}" from your cart?`)) {
      removeItem(itemId);
      showToast('Item removed from cart');
    }
  };

  return (
    <section className="container page-block">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Your cart</span>
          <h1>Ready to Order</h1>
        </div>
        <Link className="btn btn-outline-primary" to="/">
          Continue Shopping
        </Link>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-state">
          Your cart is empty.
          <Link to="/">Browse products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.items.map((item) => {
              const finalPrice = item.price - (item.price * item.discount) / 100;

              return (
                <article className="cart-item" key={item._id}>
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.selectedSize ? `Size: ${item.selectedSize}` : 'Standard option'}</p>
                    {item.productNote && <p>{item.productNote}</p>}
                    <strong>{formatPrice(finalPrice)}</strong>
                  </div>
                  <div className="quantity-stepper">
                    <button type="button" title="Decrease" onClick={() => updateItem(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" title="Increase" onClick={() => updateItem(item._id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <button className="icon-button danger" type="button" title="Remove item" onClick={() => handleRemove(item._id, item.title)}>
                    <Trash2 size={18} />
                  </button>
                </article>
              );
            })}
          </div>
          <aside className="summary-panel">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(cartSubtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{cartSubtotal > 999 ? 'Free' : formatPrice(49)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(cartSubtotal + (cartSubtotal > 999 ? 0 : 49))}</strong>
            </div>
            <Link className="btn btn-primary w-100" to="/checkout">
              <ShoppingBag size={18} />
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;
