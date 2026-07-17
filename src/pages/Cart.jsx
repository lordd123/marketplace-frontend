import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';



export default function Cart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setItems(response.data.items);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Erro ao carregar carrinho:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(cartItemId, quantity) {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      loadCart();
    } catch (err) {
      setError('Erro ao atualizar quantidade.');
    }
    refreshCount();
  }

  async function removeItem(cartItemId) {
    try {
      await api.delete(`/cart/${cartItemId}`);
      loadCart();
    } catch (err) {
      setError('Erro ao remover item.');
    }
    refreshCount();
  }

  async function handleCheckout() {
    try {
      setCheckingOut(true);
      setError('');
      const response = await api.post('/checkout');
      window.location.href = response.data.checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao iniciar checkout.');
      setCheckingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl mb-8">CARRINHO</h1>

        {error && (
          <div className="border border-alert text-alert font-tag text-xs px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="font-tag text-xs text-ink-soft">CARREGANDO...</p>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-line py-16 text-center">
            <p className="font-display text-lg mb-2">CARRINHO VAZIO</p>
            <button
              onClick={() => navigate('/store')}
              className="font-tag text-xs uppercase tracking-wide text-action hover:underline"
            >
              Ver peças disponíveis
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.cart_item_id} className="flex gap-4 border border-line p-4">
                  <div className="w-20 h-20 bg-line flex-shrink-0 overflow-hidden">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-sm mb-1">{item.name}</h3>
                    <p className="font-tag text-xs text-ink-soft mb-2">
                      {item.size} · {item.color}
                    </p>
                    <p className="font-tag text-sm text-action">
                      R$ {Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.cart_item_id)}
                      
                      className="font-tag text-xs text-ink-soft hover:text-alert transition"
                    >
                      Remover
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                        className="w-7 h-7 border border-line font-tag text-sm hover:border-ink transition"
                      >
                        −
                      </button>
                      <span className="font-tag text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                        className="w-7 h-7 border border-line font-tag text-sm hover:border-ink transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink pt-6 flex justify-between items-center mb-6">
              <span className="font-tag text-sm uppercase tracking-wide">Total</span>
              <span className="font-display text-2xl">R$ {Number(total).toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-ink text-paper font-tag text-sm uppercase tracking-wide py-4 hover:bg-action transition disabled:opacity-50"
            >
              {checkingOut ? 'Redirecionando...' : 'Finalizar compra'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}