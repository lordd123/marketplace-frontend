 import { useState, useEffect } from 'react';

export default function FeaturedCarousel({ products, onSelect }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) return null;
  const product = products[index];

  return (
    <button
      onClick={() => onSelect(product.id)}
      className="w-full text-left border border-line bg-surface flex items-center gap-6 p-4 hover:border-ink transition"
    >
      <div className="w-24 h-24 bg-line flex-shrink-0 overflow-hidden">
        {product.image_url && (
          <img
            key={product.id}
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="font-tag text-[10px] text-action uppercase tracking-widest mb-1">
          Em destaque
        </p>
        <h3 className="font-display text-xl mb-1">{product.name}</h3>
        <p className="font-tag text-sm text-ink">R$ {Number(product.price).toFixed(2)}</p>
      </div>
      <div className="flex gap-1.5">
        {products.map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-ink' : 'bg-line'}`} />
        ))}
      </div>
    </button>
  );
}w