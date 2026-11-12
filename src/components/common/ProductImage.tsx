import { useState } from 'react';
import { Package } from 'lucide-react';

export default function ProductImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return src && src !== failedSource
    ? <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailedSource(src)} />
    : <span className={`storefront-image-placeholder ${className ?? ''}`} role="img" aria-label={`${alt}: image unavailable`}><Package size={40} strokeWidth={1} aria-hidden="true" /><small>Image unavailable</small></span>;
}
