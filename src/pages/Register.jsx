import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import BrandPanel from '../components/BrandPanel';

export default function Register() {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/store');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar acesso.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <BrandPanel eyebrow="Novo por aqui" title={<>GARANTA SEU<br />PRÓXIMO DROP.</>} />

      <div className="flex-1 flex items-center justify-center bg-paper px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="font-tag text-xs text-action uppercase tracking-widest mb-2">
            Criar conta
          </p>
          <h2 className="font-display text-4xl mb-1">CADASTRO</h2>
          <p className="font-body text-sm text-ink-soft mb-8">
            Leva menos de um minuto.
          </p>

          {error && (
            <div className="border border-alert text-alert font-tag text-xs px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-2">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b-2 border-line px-1 py-2.5 text-sm font-body bg-transparent focus:outline-none focus:border-ink transition"
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="w-full border-b-2 border-line px-1 py-2.5 text-sm font-body bg-transparent focus:outline-none focus:border-ink transition"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper font-tag text-sm uppercase tracking-wide py-3.5 mt-4 hover:bg-action transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Criando...' : 'Criar acesso'}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>

          <p className="font-tag text-xs text-ink-soft mt-8">
            Já tem conta?{' '}
            <Link to="/login" className="text-action hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}