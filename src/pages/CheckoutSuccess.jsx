import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshCount } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <CheckCircle2 size={48} className="mx-auto mb-6 text-action" strokeWidth={1.5} />
        <p className="font-tag text-xs text-action uppercase tracking-widest mb-2">
          Pagamento confirmado
        </p>
        <h1 className="font-display text-3xl mb-4">DROP GARANTIDO.</h1>
        <p className="font-body text-sm text-ink-soft mb-8">
          Seu pedido foi confirmado e já está sendo preparado.
        </p>
        {sessionId && (
          <p className="font-tag text-[10px] text-ink-soft/60 mb-8 break-all">
            Ref: {sessionId}
          </p>
        )}
        <button
          onClick={() => navigate('/store')}
          className="bg-ink text-paper font-tag text-sm uppercase tracking-wide py-3 px-6 hover:bg-action transition"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
}