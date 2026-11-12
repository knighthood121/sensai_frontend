import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Banner } from '../../../types/Home.type';
import { activeBanners, bannerDestination } from '../../../utils/storefrontData';

type Props = { banners: Banner[]; loading: boolean; error: boolean; onRetry: () => void };

export default function PrecisionHero({ banners, loading, error, onRetry }: Props) {
  const [now, setNow] = useState(Date.now);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hovering, setHovering] = useState(false);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const slides = activeBanners(banners, now);
  const index = Math.max(0, slides.findIndex((slide) => slide.id === selectedId));
  const banner = slides[index];
  const destination = bannerDestination(banner?.linkUrl);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!playing || hovering || slides.length < 2) return;
    const timer = window.setTimeout(() => {
      if (!document.hidden) setSelectedId(slides[(index + 1) % slides.length].id);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [playing, hovering, slides, index]);

  const changeSlide = (next: number) => {
    setPlaying(false);
    setSelectedId(slides[(next + slides.length) % slides.length].id);
  };

  return <section className={`precision-hero${banner ? '' : ' precision-hero--intro'}`} aria-label="SANSEI highlights" aria-roledescription={slides.length > 1 ? 'carousel' : undefined}
    onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocusCapture={() => setPlaying(false)}>
    {banner?.imageUrl && banner.imageUrl !== failedImage && <img key={banner.imageUrl} className="precision-hero__art" src={banner.imageUrl} alt="" fetchPriority="high" onError={() => setFailedImage(banner.imageUrl)} />}
    <div className="precision-container precision-hero__copy" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
      <p className="precision-eyebrow">Precision Cutting Solutions</p>
      <h1>{banner?.title || 'Precision that performs.'}</h1>
      {banner?.description && <p className="precision-hero__description">{banner.description}</p>}
      {!banner && !loading && <p className="precision-hero__description">Dependable cutting tools for your next operation.</p>}
      <div className="precision-hero__actions">
        {destination ? destination.startsWith('/') ? <Link to={destination} className="precision-button">Explore Products</Link> : <a href={destination} className="precision-button">Explore Products</a> : <a href="#products" className="precision-button">Explore Products</a>}
        <Link to="/catalog" className="precision-button precision-button--outline">View Catalog</Link>
      </div>
      {loading && <p className="precision-hero__status" role="status">Loading highlights…</p>}
      {error && <p className="precision-hero__status" role="status">Highlights could not be loaded. <button type="button" onClick={onRetry}>Try again</button></p>}
    </div>
    {slides.length > 1 && <div className="precision-hero__controls" aria-label="Banner controls">
      <button type="button" aria-label="Previous banner" onClick={() => changeSlide(index - 1)}><ChevronLeft size={18} /></button>
      {slides.map((slide, slideIndex) => <button type="button" key={slide.id} className={`precision-hero__dot${slideIndex === index ? ' is-active' : ''}`} aria-label={`Show banner ${slideIndex + 1}: ${slide.title}`} aria-pressed={index === slideIndex} onClick={() => changeSlide(slideIndex)}><span /></button>)}
      <button type="button" aria-label="Next banner" onClick={() => changeSlide(index + 1)}><ChevronRight size={18} /></button>
      <button type="button" aria-label={playing ? 'Pause banners' : 'Play banners'} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
    </div>}
  </section>;
}
