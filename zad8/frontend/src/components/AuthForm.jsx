import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const url = `http://localhost:3000/auth/${mode}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Something went wrong');
      return;
    }

    if (mode === 'register') {
      alert('Registered successfully! Please log in.');
      setMode('login');
      return;
    }

    // login success
    localStorage.setItem('token', data.token);
    navigate('/user');
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
};



  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
