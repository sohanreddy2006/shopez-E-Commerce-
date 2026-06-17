const Loading = ({ label = 'Loading' }) => {
  return (
    <div className="loading-panel">
      <div className="spinner-border text-primary" role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default Loading;
