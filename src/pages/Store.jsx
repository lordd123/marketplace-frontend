import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import FeaturedCarousel from '../components/FeaturedCarousel';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  async function loadProducts() {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const response = await api.get('/products', { params });
      setProducts(response.data.products);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <Header />

      {/* Hero — a "tese" da página */}
      <section className="border-b border-line bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-tag text-xs uppercase tracking-widest text-action mb-4">
            Nova coleção · Estoque limitado
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mb-4">
            PEÇAS QUE<br />NÃO REPETEM.
          </h1>
          <p className="font-body text-paper/70 max-w-md">
            Cada drop sai em quantidade limitada. Quando esgota, esgota — sem reposição garantida.
          </p>
        </div>
      </section>

      {products.length > 0 && (
  <div className="max-w-6xl mx-auto px-6 pt-8">
    <FeaturedCarousel products={products.slice(0, 5)} onSelect={(id) => navigate(`/product/${id}`)} />
  </div>
)}

      {/* Filtros */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Buscar peça..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-body text-sm border border-line px-3 py-2 bg-surface focus:outline-none focus:border-ink transition flex-1 min-w-[200px]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="font-tag text-xs uppercase tracking-wide border border-line px-3 py-2 bg-surface focus:outline-none focus:border-ink transition"
        >
          <option value="">Todas categorias</option>
          <option value="camisetas">Camisetas</option>
          <option value="moletons">Moletons</option>
          <option value="acessorios">Acessórios</option>
        </select>
      </div>

      {/* Grid de produtos */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <p className="font-tag text-xs text-ink-soft">CARREGANDO...</p>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-line py-20 text-center">
            <p className="font-display text-xl mb-2">SEM PEÇAS AGORA</p>
            <p className="font-body text-sm text-ink-soft">Novo drop em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}