import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, startNewChat } from '../api/api';


export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const strength = password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password) ? 'Weak' : password.length >= 12 && /[^A-Za-z0-9]/.test(password) ? 'Strong' : 'Medium';

  const handleRegister = async () => {
  if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) { setError('Use at least 8 characters, including letters and numbers.'); return; }
  try {
    const res = await register(username, email, password, confirmPassword);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user_id', res.data.user_id);

    // Create first conversation
    const conv = await startNewChat();
    const convId = conv.data.id;

    navigate(`/chat/${convId}`);
  } catch (err) {
    const issues = err.response?.data?.detail;
    if (Array.isArray(issues)) {
      const msg = issues.map(e => `• ${e.msg}`).join('\n');
      setError(msg);
    } else {
      setError('Registration failed. Try a different email.');
    }
  }
};


  return (
    <div className="register-container">
      <style>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          font-family: sans-serif;
        }

        .register-box {
          display: flex;
          max-width: 1000px;
          width: 90%;
          background-color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .register-form {
          width: 50%;
          padding: 40px;
          background-color: #fff;
        }

        .brand {
          color: rgb(109, 40, 217);
          font-size: 32px;
          margin-bottom: 10px;
        }

        .form-title {
          font-size: 24px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 25px;
          background-color: #f9fafb;
          transition: border-color 0.3s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: rgb(109, 40, 217);
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(to right, rgb(109, 40, 217), rgb(91, 33, 182));
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-btn:hover {
          background: linear-gradient(to right, rgb(91, 33, 182), rgb(79, 70, 229));
        }

        .error-msg {
          margin-top: 16px;
          color: #dc2626;
          font-size: 14px;
        }

        .welcome-panel {
          width: 50%;
          background: linear-gradient(to bottom right, rgb(109, 40, 217), rgb(91, 33, 182));
          color: white;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .login-link {
          margin-top: 12px;
          padding: 10px 20px;
          border: 1px solid white;
          color: white;
          border-radius: 25px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .login-link:hover {
          background-color: white;
          color: rgb(109, 40, 217);
        }
      `}</style>

      <div className="register-box">
        <div className="register-form">
          <h1 className="brand">Mindora Bot</h1>
          <h2 className="form-title">Create Account</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="input-field"
          />
          <label htmlFor="password" className="sr-only">Create password</label>
          <input
            id="password"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-field"
            autoComplete="new-password"
          />
          <p style={{fontSize:12, marginTop:-10, marginBottom:12, color: strength === 'Weak' ? '#b91c1c' : '#166534'}}>Password strength: {password ? strength : 'Not entered'} · At least 8 characters with letters and numbers.</p>
          <label htmlFor="confirm-password" className="sr-only">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="input-field"
            autoComplete="new-password"
          />

          <button onClick={handleRegister} className="submit-btn">
            Register
          </button>

          {error && <p className="error-msg">{error}</p>}
        </div>

        <div className="welcome-panel">
          <h2>Welcome to Mindora</h2>
          <p>Already have an account?</p>
          <a href="/login" className="login-link">Sign In</a>
        </div>
      </div>
    </div>
  );
}
