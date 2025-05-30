import { useEffect, useState } from 'react';

const UserPage = () => {
  const [message, setMessage] = useState('Loading...');
  
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token || token.split('.').length !== 3) {
    setMessage('Invalid or missing token');
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId;

    fetch(`http://localhost:3000/users/${userId}`, {
      headers: {
        'Authorization': token
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Unauthorized');
        const user = await res.json();
        setMessage(`User logged in: ${user.email}`);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to fetch user');
      });
  } catch (err) {
    console.error('Invalid token format:', err);
    setMessage('Failed to decode token');
  }
}, []);


  return <h2>{message}</h2>;
};

export default UserPage;
