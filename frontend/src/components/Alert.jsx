const Alert = ({ type = 'danger', message }) => {
  if (!message) return null;

  return <div className={`alert alert-${type} py-2 mb-3`}>{message}</div>;
};

export default Alert;
