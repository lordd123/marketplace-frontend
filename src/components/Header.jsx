import { ShoppingBag, Search, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const navigate = useNavigate();
  const { count } = useCart();

  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <header className="border-b border-line bg-paper sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/store')} className="font-display text-lg tracking-tight">
          DROP.
        </button>
        <nav className="flex items-center gap-5">
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="text-ink-soft hover:text-ink transition" title="Painel admin">
              <LayoutDashboard size={19} />
            </button>
          )}
          <button onClick={() => navigate('/store')} className="text-ink-soft hover:text-ink transition">
            <Search size={19} />
          </button>
          <button onClick={() => navigate('/cart')} className="relative text-ink-soft hover:text-ink transition">
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-action text-white font-tag text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}