import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const { refreshCount } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (err) {
      console.error('Erro ao carregar produto:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!selectedVariant) {
      setMessage('Escolha um tamanho/cor antes de continuar.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setAdding(true);
      await api.post('/cart', { variant_id: selectedVariant.id, quantity: 1 });
      setMessage('Adicionado ao carrinho.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erro ao adicionar ao carrinho.');
    } finally {
      setAdding(false);
    }
    refreshCount();
  }

  if (loading) {
    return <p className="font-tag text-xs text-ink-soft p-6">CARREGANDO...</p>;
  }

  if (!product) {
    return <p className="font-tag text-xs text-ink-soft p-6">PRODUTO NÃO ENCONTRADO.</p>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        {/* Imagem */}
        <div className="aspect-square bg-line overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-tag text-xs text-ink-soft">
              SEM IMAGEM
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div>
          <p className="font-tag text-xs text-ink-soft uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-3xl leading-tight mb-3">{product.name}</h1>
          <p className="font-tag text-xl text-action mb-6">
            R$ {Number(product.price).toFixed(2)}
          </p>
          <p className="font-body text-sm text-ink-soft mb-8">{product.description}</p>

          {/* Seleção de variação */}
          <p className="font-tag text-xs uppercase tracking-wide mb-3">Escolha tamanho/cor</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {product.variants?.map((variant) => {
              const isOut = variant.stock === 0;
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  disabled={isOut}
                  onClick={() => setSelectedVariant(variant)}
                  className={`font-tag text-xs px-3 py-2 border transition ${
                    isOut
                      ? 'border-line text-ink-soft/40 line-through cursor-not-allowed'
                      : isSelected
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line hover:border-ink'
                  }`}
                >
                  {variant.size} · {variant.color}
                </button>
              );
            })}
          </div>

          {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
            <p className="font-tag text-xs text-alert mb-4">
              Só {selectedVariant.stock} unidade(s) dessa variação.
            </p>
          )}

          {message && (
            <p className="font-body text-sm text-ink-soft mb-4">{message}</p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full bg-ink text-paper font-tag text-sm uppercase tracking-wide py-3 hover:bg-action transition disabled:opacity-50"
          >
            {adding ? 'Adicionando...' : 'Adicionar ao carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
}