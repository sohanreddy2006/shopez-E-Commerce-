import { CheckCircle2, PackageCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { formatPrice } from '../components/ProductCard';

const OrderDetails = () => {
  const { id } = useParams();
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

  if (loading) return <Loading label="Loading order" />;

  return (
    <section className="container page-block">
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
                <img src={item.image} alt={item.title} />
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
          <Link className="btn btn-outline-primary" to="/profile">
            <PackageCheck size={18} />
            View My Orders
          </Link>
        </>
      )}
    </section>
  );
};

export default OrderDetails;
