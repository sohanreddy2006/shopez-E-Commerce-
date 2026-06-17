import { PackagePlus, RefreshCcw, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { formatPrice } from '../components/ProductCard';

const emptyProduct = {
  title: '',
  description: '',
  brand: '',
  category: 'Electronics',
  price: '',
  discount: '',
  image: '',
  stock: '',
  sizes: '',
  colors: '',
  isFeatured: false
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({ bannerTitle: '', bannerSubtitle: '', bannerImage: '', categories: [] });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const [summaryResponse, productResponse, orderResponse, userResponse, settingsResponse] = await Promise.all([
        api.get('/admin/summary'),
        api.get('/products'),
        api.get('/orders/admin/all'),
        api.get('/admin/users'),
        api.get('/admin/settings')
      ]);
      setSummary(summaryResponse.data);
      setProducts(productResponse.data);
      setOrders(orderResponse.data);
      setUsers(userResponse.data);
      setSettings(settingsResponse.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const handleProductChange = (event) => {
    const { name, type, checked, value } = event.target;
    setProductForm({ ...productForm, [name]: type === 'checkbox' ? checked : value });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      discount: Number(productForm.discount || 0),
      stock: Number(productForm.stock),
      sizes: productForm.sizes.split(',').map((item) => item.trim()).filter(Boolean),
      colors: productForm.colors.split(',').map((item) => item.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('Product updated');
      } else {
        await api.post('/products', payload);
        setMessage('Product created');
      }

      setProductForm(emptyProduct);
      setEditingId('');
      await loadAdmin();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setProductForm({
      title: product.title,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discount: product.discount,
      image: product.image,
      stock: product.stock,
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      isFeatured: product.isFeatured
    });
    setActiveTab('products');
  };

  const deleteProduct = async (productId) => {
    await api.delete(`/products/${productId}`);
    setProducts((current) => current.filter((product) => product._id !== productId));
  };

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders((current) => current.map((order) => (order._id === orderId ? { ...order, status } : order)));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    const payload = {
      ...settings,
      categories: Array.isArray(settings.categories)
        ? settings.categories
        : settings.categories.split(',').map((item) => item.trim()).filter(Boolean)
    };
    const { data } = await api.put('/admin/settings', payload);
    setSettings(data);
    setMessage('Settings saved');
  };

  if (loading) return <Loading label="Loading admin" />;

  return (
    <section className="container page-block admin-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>ShopEZ Dashboard</h1>
        </div>
        <button className="btn btn-outline-primary" type="button" onClick={loadAdmin}>
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>
      <Alert message={error} />
      <Alert type="success" message={message} />
      <div className="admin-tabs">
        {['overview', 'products', 'orders', 'users', 'settings'].map((tab) => (
          <button className={activeTab === tab ? 'active' : ''} type="button" key={tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && summary && (
        <div className="metric-grid">
          <Metric label="Users" value={summary.users} />
          <Metric label="Products" value={summary.products} />
          <Metric label="Orders" value={summary.orders} />
          <Metric label="Revenue" value={formatPrice(summary.revenue)} />
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-split">
          <form className="info-panel" onSubmit={submitProduct}>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <label>
              Title
              <input className="form-control" name="title" value={productForm.title} onChange={handleProductChange} required />
            </label>
            <label>
              Description
              <textarea className="form-control" name="description" rows="3" value={productForm.description} onChange={handleProductChange} required />
            </label>
            <div className="form-grid compact">
              <label>
                Brand
                <input className="form-control" name="brand" value={productForm.brand} onChange={handleProductChange} required />
              </label>
              <label>
                Category
                <input className="form-control" name="category" value={productForm.category} onChange={handleProductChange} required />
              </label>
              <label>
                Price
                <input className="form-control" name="price" type="number" value={productForm.price} onChange={handleProductChange} required />
              </label>
              <label>
                Discount
                <input className="form-control" name="discount" type="number" value={productForm.discount} onChange={handleProductChange} />
              </label>
              <label>
                Stock
                <input className="form-control" name="stock" type="number" value={productForm.stock} onChange={handleProductChange} required />
              </label>
              <label>
                Image URL
                <input className="form-control" name="image" value={productForm.image} onChange={handleProductChange} required />
              </label>
            </div>
            <label>
              Sizes
              <input className="form-control" name="sizes" value={productForm.sizes} onChange={handleProductChange} placeholder="S, M, L" />
            </label>
            <label>
              Colors
              <input className="form-control" name="colors" value={productForm.colors} onChange={handleProductChange} placeholder="Black, White" />
            </label>
            <label className="check-line">
              <input type="checkbox" name="isFeatured" checked={productForm.isFeatured} onChange={handleProductChange} />
              Featured product
            </label>
            <button className="btn btn-primary" type="submit">
              <PackagePlus size={18} />
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
          <div className="info-panel table-panel">
            <h2>Catalog</h2>
            <div className="responsive-table">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td>{product.category}</td>
                      <td>{product.stock}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td className="table-actions">
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => editProduct(product)}>
                          Edit
                        </button>
                        <button className="icon-button danger" title="Delete product" type="button" onClick={() => deleteProduct(product._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="info-panel table-panel">
          <h2>Orders</h2>
          <div className="responsive-table">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.user?.name || 'User'}</td>
                    <td>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <select className="form-select form-select-sm" value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                        {['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="info-panel table-panel">
          <h2>Users</h2>
          <div className="responsive-table">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{item.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <form className="info-panel settings-panel" onSubmit={saveSettings}>
          <h2>Store Settings</h2>
          <label>
            Banner title
            <input className="form-control" value={settings.bannerTitle || ''} onChange={(event) => setSettings({ ...settings, bannerTitle: event.target.value })} />
          </label>
          <label>
            Banner subtitle
            <textarea className="form-control" rows="3" value={settings.bannerSubtitle || ''} onChange={(event) => setSettings({ ...settings, bannerSubtitle: event.target.value })} />
          </label>
          <label>
            Banner image
            <input className="form-control" value={settings.bannerImage || ''} onChange={(event) => setSettings({ ...settings, bannerImage: event.target.value })} />
          </label>
          <label>
            Categories
            <input
              className="form-control"
              value={Array.isArray(settings.categories) ? settings.categories.join(', ') : settings.categories}
              onChange={(event) => setSettings({ ...settings, categories: event.target.value })}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            <Save size={18} />
            Save Settings
          </button>
        </form>
      )}
    </section>
  );
};

const Metric = ({ label, value }) => (
  <div className="metric-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default AdminDashboard;
