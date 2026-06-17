import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <Link className="breadcrumb-link" to="/">
        <Home size={15} />
      </Link>
      {paths.map((path, index) => (
        <span key={index} className="breadcrumb-item">
          <ChevronRight size={14} className="breadcrumb-sep" />
          {path.to ? (
            <Link className="breadcrumb-link" to={path.to}>{path.label}</Link>
          ) : (
            <span className="breadcrumb-current">{path.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
