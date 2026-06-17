import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import { formatPrice } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, cartSubtotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || '',
    line1: user?.address?.line1 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India',
    phone: user?.phone || '',
    paymentMethod: 'Cash on Delivery',
    productRequirements: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/orders', {
        shippingAddress: {
          fullName: form.fullName,
          line1: form.line1,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone
        },
        paymentMethod: form.paymentMethod,
        productRequirements: form.productRequirements
      });
      await fetchCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <section className="container page-block">
        <div className="empty-state">
          Your cart is empty.
          <Link to="/">Shop first</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container page-block">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Secure checkout</span>
          <h1>Order Details</h1>
        </div>
        <div className="secure-note">
          <ShieldCheck size={18} />
          Protected checkout
        </div>
      </div>
      <Alert message={error} />
      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-form">
          <div className="form-grid">
            <label>
              Full name
              <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
            </label>
            <label>
              Mobile
              <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Enter a 10-digit mobile number" placeholder="10-digit mobile number" />
            </label>
            <label className="wide">
              Address
              <input className="form-control" name="line1" value={form.line1} onChange={handleChange} required />
            </label>
            <label>
              City
              <input className="form-control" name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label>
              State
              <input className="form-control" name="state" value={form.state} onChange={handleChange} required />
            </label>
            <label>
              Postal code
              <input className="form-control" name="postalCode" value={form.postalCode} onChange={handleChange} required />
            </label>
            <label>
              Country
              <input className="form-control" name="country" value={form.country} onChange={handleChange} required />
            </label>
            <label className="wide">
              Payment method
              <select className="form-select" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                <option>Cash on Delivery</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
            </label>
            <label className="wide">
              Product requirements
              <textarea className="form-control" name="productRequirements" rows="4" value={form.productRequirements} onChange={handleChange} />
            </label>
          </div>
        </div>
        <aside className="summary-panel">
          <h2>Items</h2>
          {cart.items.map((item) => (
            <div className="mini-line" key={item._id}>
              <span>{item.title} x {item.quantity}</span>
              <strong>{formatPrice((item.price - (item.price * item.discount) / 100) * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(cartSubtotal + (cartSubtotal > 999 ? 0 : 49))}</strong>
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </aside>
      </form>
    </section>
  );
};

export default Checkout;
