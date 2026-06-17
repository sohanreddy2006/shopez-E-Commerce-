import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const searchRef = useRef(null);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      const [productResponse, settingsResponse] = await Promise.all([
        api.get('/products', { params: { search, category, sort, page, limit: 12 } }),
        api.get('/admin/settings')
      ]);
      setProducts(productResponse.data.products);
      setPages(productResponse.data.pages);
      setSettings(settingsResponse.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    const timeout = setTimeout(loadPage, 250);
    return () => clearTimeout(timeout);
  }, [loadPage]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const categories = useMemo(() => ['All', ...(settings?.categories || [])], [settings]);

  const pageNumbers = useMemo(() => {
    const result = [];
    for (let i = 1; i <= pages; i++) {
      result.push(i);
    }
    return result;
  }, [pages]);

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
          <div className="search-control" ref={searchRef}>
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </div>
          <div className="filter-group">
            <SlidersHorizontal size={18} />
            <select value={category} onChange={(event) => handleCategory(event.target.value)} aria-label="Filter category">
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select value={sort} onChange={(event) => handleSort(event.target.value)} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
              <option value="priceAsc">Price low to high</option>
              <option value="priceDesc">Price high to low</option>
            </select>
          </div>
        </div>
        <Alert message={error || actionError} />
        {loading ? (
          <ProductGridSkeleton />
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} onError={setActionError} />
              ))}
            </div>
            {products.length === 0 && <div className="empty-state">No products matched your filters.</div>}
            {pages > 1 && (
              <div className="pagination-bar">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={18} />
                </button>
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={num === page ? 'active' : ''}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
