import { CheckCircle2, PackageCheck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import Breadcrumbs from '../components/Breadcrumbs';
import { OrderDetailsSkeleton } from '../components/Skeleton';
import { formatPrice } from '../components/ProductCard';
import { useToast } from '../context/ToastContext';

const OrderDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) return <OrderDetailsSkeleton />;

  const cancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder(data);
      showToast('Order cancelled successfully');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="container page-block">
      <Breadcrumbs paths={[{ label: 'Profile', to: '/profile' }, { label: 'Order Details' }]} />
      <Alert message={error} />
      {order && (
        <>
          <div className="confirmation-banner">
            <CheckCircle2 size={36} />
            <div>
              <span className="eyebrow">Order confirmed</span>
              <h1>#{order._id.slice(-8).toUpperCase()}</h1>
            </div>
          </div>
          <div className="order-details-grid">
            <section className="info-panel">
              <h2>Shipping</h2>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}, {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.phone}</p>
            </section>
            <section className="info-panel">
              <h2>Payment</h2>
              <p>{order.paymentMethod}</p>
              <p>{order.isPaid ? 'Paid' : 'Payment pending'}</p>
              <p>Status: {order.status}</p>
            </section>
          </div>
          <section className="info-panel">
            <h2>Products</h2>
            {order.orderItems.map((item) => (
              <div className="order-item" key={`${item.product}-${item.title}`}>
                <img src={item.image} alt={item.title} loading="lazy" />
                <div>
                  <strong>{item.title}</strong>
                  <p>Quantity: {item.quantity}</p>
                  {item.productNote && <p>{item.productNote}</p>}
                </div>
                <span>{formatPrice((item.price - (item.price * item.discount) / 100) * item.quantity)}</span>
              </div>
            ))}
            {order.productRequirements && <p className="order-note">{order.productRequirements}</p>}
            <div className="summary-total">
              <span>Total paid</span>
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>
          </section>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to="/profile">
              <PackageCheck size={18} />
              View My Orders
            </Link>
            {order.status === 'Placed' && (
              <button className="btn btn-outline-danger" type="button" onClick={cancelOrder}>
                <XCircle size={18} />
                Cancel Order
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default OrderDetails;
