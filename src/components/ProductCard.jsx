export default function ProductCard({ product, onClick }) {
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
  const isLow = totalStock > 0 && totalStock <= 5;
  const isOut = totalStock === 0;

  return (
    <button
      onClick={onClick}
      className="group text-left bg-surface border border-line hover:border-ink transition-colors"
    >
      <div className="relative aspect-square bg-line overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-tag text-xs text-ink-soft">
            SEM IMAGEM
          </div>
        )}

        {/* Tag de estoque estilo etiqueta */}
        {isOut ? (
          <span className="absolute top-2 left-2 bg-ink text-paper font-tag text-[10px] px-2 py-1 tracking-wide">
            ESGOTADO
          </span>
        ) : isLow ? (
          <span className="absolute top-2 left-2 bg-alert text-white font-tag text-[10px] px-2 py-1 tracking-wide">
            {totalStock} UNID. RESTANTES
          </span>
        ) : null}
      </div>

      <div className="p-3">
        <p className="font-tag text-[10px] text-ink-soft uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-body font-semibold text-sm text-ink leading-snug mb-1">
          {product.name}
        </h3>
        <p className="font-tag text-sm text-ink">
          R$ {Number(product.price).toFixed(2)}
        </p>
      </div>
    </button>
  );
}