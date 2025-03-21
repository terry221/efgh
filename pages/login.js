// pages/login.js
import { useState } from 'react';
import Router from 'next/router';

const users = {
  user1: { username: 'user1', password: 'password1' },
  user2: { username: 'user2', password: 'password2' },
  user3: { username: 'user3', password: 'password3' },
  user4: { username: 'user4', password: 'password4' },
  user5: { username: 'user5', password: 'password5' },
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    const user = users[username];
    if (user && user.password === password) {
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('username', username);
      Router.push('/upload');
    } else {
      setMessage('Invalid username or password');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
}