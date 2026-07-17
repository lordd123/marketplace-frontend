import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <XCircle size={48} className="mx-auto mb-6 text-alert" strokeWidth={1.5} />
        <p className="font-tag text-xs text-alert uppercase tracking-widest mb-2">
          Pagamento não concluído
        </p>
        <h1 className="font-display text-3xl mb-4">SEM PROBLEMA.</h1>
        <p className="font-body text-sm text-ink-soft mb-8">
          Seus itens continuam salvos no carrinho.
        </p>
        <button
          onClick={() => navigate('/cart')}
          className="bg-ink text-paper font-tag text-sm uppercase tracking-wide py-3 px-6 hover:bg-action transition"
        >
          Voltar ao carrinho
        </button>
      </div>
    </div>
  );
}