import { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'camisetas',
    image_url: '',
  });
  const [variants, setVariants] = useState([{ size: '', color: '', stock: '' }]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleVariantChange(index, field, value) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function addVariantRow() {
    setVariants((prev) => [...prev, { size: '', color: '', stock: '' }]);
  }

  function removeVariantRow(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.price) {
      setError('Preencha ao menos nome e preço.');
      return;
    }

    try {
      setSaving(true);
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        variants: variants
          .filter((v) => v.size && v.color)
          .map((v) => ({ ...v, stock: Number(v.stock) || 0 })),
      });

      setSuccess('Produto criado com sucesso.');
      setForm({ name: '', description: '', price: '', category: 'camisetas', image_url: '' });
      setVariants([{ size: '', color: '', stock: '' }]);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar produto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="font-tag text-xs text-action uppercase tracking-widest mb-2">
          Painel administrativo
        </p>
        <h1 className="font-display text-3xl mb-8">GERENCIAR PRODUTOS</h1>

        {error && (
          <div className="border border-alert text-alert font-tag text-xs px-4 py-3 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="border border-action text-action font-tag text-xs px-4 py-3 mb-6">
            {success}
          </div>
        )}

        {/* Formulário de criação */}
        <form onSubmit={handleSubmit} className="border border-line p-6 mb-12 bg-surface">
          <h2 className="font-display text-xl mb-5">NOVO PRODUTO</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-1.5">
                Nome
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full border border-line px-3 py-2 text-sm font-body focus:outline-none focus:border-ink transition"
              />
            </div>
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-1.5">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                className="w-full border border-line px-3 py-2 text-sm font-tag focus:outline-none focus:border-ink transition"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-1.5">
              Descrição
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              rows={2}
              className="w-full border border-line px-3 py-2 text-sm font-body focus:outline-none focus:border-ink transition"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-1.5">
                Categoria
              </label>
              <select
                value={form.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className="w-full border border-line px-3 py-2 text-sm font-tag uppercase focus:outline-none focus:border-ink transition"
              >
                <option value="camisetas">Camisetas</option>
                <option value="moletons">Moletons</option>
                <option value="acessorios">Acessórios</option>
              </select>
            </div>
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-1.5">
                URL da imagem
              </label>
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => handleFormChange('image_url', e.target.value)}
                placeholder="https://..."
                className="w-full border border-line px-3 py-2 text-sm font-body focus:outline-none focus:border-ink transition"
              />
            </div>
          </div>

          {/* Variações */}
          <p className="font-tag text-[10px] uppercase tracking-wide text-ink-soft mb-2">
            Variações (tamanho / cor / estoque)
          </p>
          <div className="space-y-2 mb-3">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tamanho"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                  className="flex-1 border border-line px-3 py-2 text-sm font-tag focus:outline-none focus:border-ink transition"
                />
                <input
                  type="text"
                  placeholder="Cor"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                  className="flex-1 border border-line px-3 py-2 text-sm font-tag focus:outline-none focus:border-ink transition"
                />
                <input
                  type="number"
                  placeholder="Estoque"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  className="w-28 border border-line px-3 py-2 text-sm font-tag focus:outline-none focus:border-ink transition"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariantRow(index)}
                    className="font-tag text-xs text-ink-soft hover:text-alert transition px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addVariantRow}
            className="font-tag text-xs text-action hover:underline mb-6"
          >
            + Adicionar variação
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-ink text-paper font-tag text-sm uppercase tracking-wide py-3 hover:bg-action transition disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Criar produto'}
          </button>
        </form>

        {/* Lista de produtos existentes */}
        <h2 className="font-display text-xl mb-4">PRODUTOS CADASTRADOS</h2>
        {loading ? (
          <p className="font-tag text-xs text-ink-soft">CARREGANDO...</p>
        ) : (
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex justify-between items-center border border-line px-4 py-3 bg-surface">
                <div>
                  <p className="font-body font-semibold text-sm">{p.name}</p>
                  <p className="font-tag text-xs text-ink-soft">{p.category}</p>
                </div>
                <p className="font-tag text-sm text-action">R$ {Number(p.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}