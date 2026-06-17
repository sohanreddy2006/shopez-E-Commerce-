import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'user@shopez.com', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>
        <Alert message={error} />
        <label>
          Email
          <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="btn btn-primary w-100" disabled={loading} type="submit">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p>
          New to ShopEZ? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
