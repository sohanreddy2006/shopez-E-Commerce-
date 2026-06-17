const SkeletonBox = ({ className = '', style = {} }) => (
  <div className={`skeleton-box ${className}`} style={style} />
);

const SkeletonText = ({ width = '100%' }) => (
  <SkeletonBox style={{ width, height: 14, borderRadius: 4 }} />
);

const ProductCardSkeleton = () => (
  <div className="product-card">
    <SkeletonBox style={{ width: '100%', aspectRatio: '4 / 3', borderRadius: 0 }} />
    <div className="product-card-body" style={{ gap: '0.65rem' }}>
      <div className="d-flex justify-content-between">
        <SkeletonText width="40%" />
        <SkeletonText width="20%" />
      </div>
      <SkeletonText width="85%" />
      <SkeletonText width="65%" />
      <div className="price-row">
        <SkeletonBox style={{ width: 80, height: 22, borderRadius: 4 }} />
      </div>
      <SkeletonBox style={{ width: '100%', height: 42, borderRadius: 8 }} />
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="product-grid">
    {Array.from({ length: 8 }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="container page-block">
    <div className="details-layout">
      <SkeletonBox style={{ width: '100%', aspectRatio: '1 / 0.82', borderRadius: 8 }} />
      <div className="details-copy" style={{ gap: '0.85rem' }}>
        <SkeletonText width="30%" />
        <SkeletonBox style={{ width: '70%', height: 32, borderRadius: 6 }} />
        <SkeletonBox style={{ width: '100%', height: 60, borderRadius: 4 }} />
        <SkeletonText width="25%" />
        <SkeletonBox style={{ width: 140, height: 42, borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="container page-block">
    <div className="profile-layout">
      <div className="info-panel" style={{ gap: '0.85rem' }}>
        <SkeletonText width="30%" />
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} style={{ width: '100%', height: 44, borderRadius: 8 }} />
        ))}
        <SkeletonBox style={{ width: 120, height: 42, borderRadius: 8 }} />
      </div>
      <div className="info-panel" style={{ gap: '0.85rem' }}>
        <SkeletonText width="25%" />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} style={{ width: '100%', height: 52, borderRadius: 8 }} />
        ))}
      </div>
    </div>
  </div>
);

export const OrderDetailsSkeleton = () => (
  <div className="container page-block">
    <SkeletonBox style={{ width: '100%', height: 80, borderRadius: 8, marginBottom: '1rem' }} />
    <div className="order-details-grid">
      {Array.from({ length: 2 }).map((_, i) => (
        <SkeletonBox key={i} style={{ width: '100%', height: 120, borderRadius: 8 }} />
      ))}
    </div>
    <SkeletonBox style={{ width: '100%', height: 200, borderRadius: 8 }} />
  </div>
);

export const AdminSkeleton = () => (
  <div className="container page-block">
    <div className="metric-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBox key={i} style={{ width: '100%', height: 80, borderRadius: 8 }} />
      ))}
    </div>
    <div style={{ marginTop: '1rem' }}>
      <SkeletonBox style={{ width: '100%', height: 300, borderRadius: 8 }} />
    </div>
  </div>
);
