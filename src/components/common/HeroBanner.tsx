import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BannerItem } from '../../utils/bannerStorage';

interface HeroBannerProps {
  banners: BannerItem[];
  autoplayInterval?: number;
}

export default function HeroBanner({
  banners,
  autoplayInterval = 6500,
}: HeroBannerProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const safeBanners = banners.length > 0 ? banners : [];
  const currentBanner = safeBanners[currentIndex % (safeBanners.length || 1)];

  // Autoplay
  useEffect(() => {
    if (safeBanners.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
    }, autoplayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeBanners.length, isPaused, autoplayInterval]);

  const handleCtaClick = (link: string) => {
    if (!link) return;
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  if (!currentBanner) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-100 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        minHeight: '260px',
        height: 'clamp(320px, 42vw, 540px)',
      }}
    >
      {/* ─── Background Banner Image ─── */}
      <div className="absolute inset-0 w-full h-full">
        {safeBanners.map((banner, idx) => {
          const isActive = idx === currentIndex % safeBanners.length;
          const bannerImg = banner.imageUrl || banner.image;
          return (
            <div
              key={`${banner.id}-${bannerImg}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                key={bannerImg}
                src={bannerImg}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ─── Diagonal Frosted Glass / Light Polygon Overlay (Matching Image) ─── */}
      {/* Covers text on the left with a sharp diagonal cut separating it from the tooling on right */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-all duration-700"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 42%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0) 100%)',
          clipPath: 'polygon(0 0, 64% 0, 46% 100%, 0 100%)',
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
        }}
      />

      {/* ─── Text Content Area (Left-Aligned, Clean Precision Typography) ─── */}
      <div className="relative z-20 h-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center">
        <div className="max-w-[320px] sm:max-w-[440px] md:max-w-[560px] lg:max-w-[640px]">
          {/* Main Title - Multi-line with clean precision font */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[50px] font-normal tracking-tight text-[#17171a] leading-[1.14] whitespace-pre-line"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {currentBanner.title}
          </h1>

          {/* Subtitle / Call to Action Link with '>' Chevron */}
          {(currentBanner.subtitle || (currentBanner as any).description || currentBanner.ctaText) && (
            <div className="mt-3 sm:mt-5 md:mt-6">
              <button
                onClick={() => handleCtaClick(currentBanner.ctaLink || (currentBanner as any).linkUrl || '')}
                className="group/link inline-flex items-center gap-1.5 text-sm sm:text-base md:text-[17px] font-medium transition-all duration-200 cursor-pointer"
                style={{
                  color: currentBanner.accentColor || '#1e73be',
                }}
                title={currentBanner.ctaText || currentBanner.subtitle || (currentBanner as any).description}
              >
                <span className="group-hover/link:underline underline-offset-4">
                  {currentBanner.subtitle || (currentBanner as any).description || currentBanner.ctaText}
                </span>
                <span className="transition-transform duration-200 group-hover/link:translate-x-1 font-bold text-sm">
                  &gt;
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom-Right Iconic Diagonal Motif: Dynamic Navigation Slashes (////) ─── */}
      {/* Dynamic count based strictly on safeBanners. Clicking moves the banner to that slide! */}
      <div className="absolute bottom-0 right-0 z-30 pointer-events-none">
        {/* Dark subtle diagonal triangle backdrop */}
        <div
          className="min-w-[140px] sm:min-w-[180px] md:min-w-[220px] h-20 sm:h-28 md:h-36 relative px-4 sm:px-6"
          style={{
            background: 'linear-gradient(135deg, transparent 35%, rgba(30, 41, 59, 0.45) 80%, rgba(15, 23, 42, 0.7) 100%)',
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
          }}
        >
          {/* Interactive Slashes container */}
          <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
            {safeBanners.map((banner, idx) => {
              const isActive = idx === currentIndex % safeBanners.length;
              return (
                <button
                  key={banner.id || idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className="group/slash p-1 -m-1 cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-125"
                  title={`Slide ${idx + 1}: ${banner.title.split('\n')[0]}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    className={`block w-1.5 sm:w-2 h-6 sm:h-8 rounded-xs transition-all duration-300 shadow-sm ${
                      isActive
                        ? 'bg-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.95)] scale-y-110'
                        : 'bg-white/70 group-hover/slash:bg-white group-hover/slash:opacity-100'
                    }`}
                    style={{ transform: 'skewX(-28deg)' }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
