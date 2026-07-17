import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import BrandPanel from '../components/BrandPanel';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/store');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <BrandPanel eyebrow="Bem-vindo de volta" title={<>ENTRE NO<br />PRÓXIMO DROP.</>} />

      <div className="flex-1 flex items-center justify-center bg-paper px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="font-tag text-xs text-action uppercase tracking-widest mb-2">
            Acesso à conta
          </p>
          <h2 className="font-display text-4xl mb-1">ENTRAR</h2>
          <p className="font-body text-sm text-ink-soft mb-8">
            Use seu email e senha pra continuar.
          </p>

          {error && (
            <div className="border border-alert text-alert font-tag text-xs px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="w-full border-b-2 border-line px-1 py-2.5 text-sm font-body bg-transparent focus:outline-none focus:border-ink transition"
                required
              />
            </div>

            <div>
              <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-b-2 border-line px-1 py-2.5 text-sm font-body bg-transparent focus:outline-none focus:border-ink transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper font-tag text-sm uppercase tracking-wide py-3.5 mt-4 hover:bg-action transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>

          <p className="font-tag text-xs text-ink-soft mt-8">
            Sem conta ainda?{' '}
            <Link to="/register" className="text-action hover:underline">
              Criar acesso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}