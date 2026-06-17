import { Save, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import { ProfileSkeleton } from '../components/Skeleton';
import { formatPrice } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: user?.address?.line1 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: {
          line1: form.line1,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country
        }
      });
      setMessage('Profile saved');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="container page-block">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>{user?.name}</h1>
        </div>
        <Link className="btn btn-outline-primary" to="/">
          <ShoppingBag size={18} />
          Shop
        </Link>
      </div>
      <Alert message={error} />
      <Alert type="success" message={message} />
      <div className="profile-layout">
        <form className="info-panel" onSubmit={saveProfile}>
          <h2>Account</h2>
          <label>
            Name
            <input className="form-control" name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Mobile
            <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Address
            <input className="form-control" name="line1" value={form.line1} onChange={handleChange} />
          </label>
          <div className="form-grid compact">
            <label>
              City
              <input className="form-control" name="city" value={form.city} onChange={handleChange} />
            </label>
            <label>
              State
              <input className="form-control" name="state" value={form.state} onChange={handleChange} />
            </label>
            <label>
              Postal code
              <input className="form-control" name="postalCode" value={form.postalCode} onChange={handleChange} />
            </label>
            <label>
              Country
              <input className="form-control" name="country" value={form.country} onChange={handleChange} />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            <Save size={18} />
            Save Profile
          </button>
        </form>
        <section className="info-panel">
          <h2>Orders</h2>
          {loading ? (
            <ProfileSkeleton />
          ) : orders.length ? (
            <div className="order-list">
              {orders.map((order) => (
                <Link className="order-row" to={`/orders/${order._id}`} key={order._id}>
                  <span>#{order._id.slice(-8).toUpperCase()}</span>
                  <span>{order.status}</span>
                  <strong>{formatPrice(order.totalPrice)}</strong>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">No orders yet.</div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Profile;
