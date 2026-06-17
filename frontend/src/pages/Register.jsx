import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
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
      await register(form);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <span className="eyebrow">Join ShopEZ</span>
        <h1>Create Account</h1>
        <Alert message={error} />
        <label>
          Name
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Mobile
          <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Password
          <input className="form-control" name="password" type="password" minLength="6" value={form.password} onChange={handleChange} required />
        </label>
        <button className="btn btn-primary w-100" disabled={loading} type="submit">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
