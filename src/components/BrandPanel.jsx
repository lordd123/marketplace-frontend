import { useState, useEffect } from 'react';

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

export default function BrandPanel({ eyebrow, title }) {
  const countdown = useCountdown();
  const tags = ['CAMISETAS', 'MOLETONS', 'ACESSÓRIOS', 'EDIÇÃO LIMITADA'];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-ink text-paper flex-col justify-between p-12 relative overflow-hidden">
      {/* Textura de fundo sutil */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10">
        <span className="font-display text-2xl">DROP.</span>
      </div>

      <div className="relative z-10">
        <p className="font-tag text-xs text-action uppercase tracking-widest mb-4">
          {eyebrow}
        </p>
        <h1 className="font-display text-5xl leading-[0.95] mb-8">
          {title}
        </h1>

        <div className="inline-block border border-paper/20 px-4 py-3">
          <p className="font-tag text-[10px] text-paper/50 uppercase tracking-widest mb-1">
            Próximo drop em
          </p>
          <p className="font-tag text-2xl text-action tabular-nums">{countdown}</p>
        </div>
      </div>

      {/* Ticker animado de categorias */}
      <div className="relative z-10 overflow-hidden border-t border-paper/10 pt-6">
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {[...tags, ...tags, ...tags].map((tag, i) => (
            <span key={i} className="font-tag text-xs text-paper/40 tracking-widest">
              {tag} ✦
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}