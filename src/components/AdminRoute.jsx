import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/store" />;
  }

  return children;
}