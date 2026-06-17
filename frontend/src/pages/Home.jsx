import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        const [productResponse, settingsResponse] = await Promise.all([
          api.get('/products', { params: { search, category, sort } }),
          api.get('/admin/settings')
        ]);
        setProducts(productResponse.data);
        setSettings(settingsResponse.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(loadPage, 250);
    return () => clearTimeout(timeout);
  }, [search, category, sort]);

  const categories = useMemo(() => ['All', ...(settings?.categories || [])], [settings]);

  return (
    <div className="page-shell">
      <section
        className="catalog-hero"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(9, 21, 35, 0.82), rgba(9, 21, 35, 0.34)), url(${settings?.bannerImage})` }}
      >
        <div className="container hero-content">
          <div>
            <span className="eyebrow">Retail marketplace</span>
            <h1>{settings?.bannerTitle || 'ShopEZ'}</h1>
            <p>{settings?.bannerSubtitle || 'Browse products, compare prices, and order securely.'}</p>
          </div>
        </div>
      </section>

      <section className="container catalog-section">
        <div className="catalog-toolbar">
          <div className="search-control">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </div>
          <div className="filter-group">
            <SlidersHorizontal size={18} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter category">
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="rating">Top rated</option>
              <option value="priceAsc">Price low to high</option>
              <option value="priceDesc">Price high to low</option>
            </select>
          </div>
        </div>
        <Alert message={error || actionError} />
        {loading ? (
          <Loading label="Loading catalog" />
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onError={setActionError} />
            ))}
          </div>
        )}
        {!loading && products.length === 0 && <div className="empty-state">No products matched your filters.</div>}
      </section>
    </div>
  );
};

export default Home;
