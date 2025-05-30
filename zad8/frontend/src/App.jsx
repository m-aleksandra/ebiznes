import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import UserPage from './components/UserPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/user" element={<UserPage />} />
    </Routes>
  );
}
