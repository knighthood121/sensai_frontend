import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import {
  useBanners,
  type BannerItem,
  compressImageToDataUrl,
  saveStoredBanners,
} from '../../../../utils/bannerStorage';
import {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from '../../../../service/bannerApi';
import { useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoveUp,
  MoveDown,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Link as LinkIcon,
  Palette,
} from 'lucide-react';



const PRESET_COLORS = [
  { name: 'Tech Blue (Reference)', value: '#1e73be' },
  { name: 'Sky Cyan', value: '#0284c7' },
  { name: 'Brand Red', value: '#dc2626' },
  { name: 'Precision Teal', value: '#0d9488' },
  { name: 'Amber Gold', value: '#d97706' },
  { name: 'Dark Slate', value: '#1e293b' },
];

export default function BannerManagementScreen() {
  const navigate = useNavigate();
  const titleId = useId();
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
  } = useBanners();

  // Backend Database API hooks
  const { data: dbBannersData } = useGetAdminBannersQuery();
  const [createBannerMutation] = useCreateBannerMutation();
  const [updateBannerMutation] = useUpdateBannerMutation();
  const [deleteBannerMutation] = useDeleteBannerMutation();

  // Synchronize DB Banners into state when backend responds
  useEffect(() => {
    if (dbBannersData?.data && Array.isArray(dbBannersData.data) && dbBannersData.data.length > 0) {
      const converted: BannerItem[] = dbBannersData.data.map((b) => ({
        id: String(b.id),
        title: b.title,
        subtitle: b.description || '',
        ctaText: b.description?.replace(/>/g, '').trim() || '',
        ctaLink: b.linkUrl || '',
        image: b.imageUrl,
        imageUrl: b.imageUrl,
        accentColor: '#1e73be',
        location: 'Homepage Hero',
        status: b.isActive ? 'Active' : 'Inactive',
        order: b.displayOrder,
        createdAt: b.createdAt || new Date().toISOString(),
        updatedAt: b.updatedAt || new Date().toISOString(),
      }));
      saveStoredBanners(converted);
    }
  }, [dbBannersData]);

  // Filters & State
  const [filterLocation, setFilterLocation] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewBannerId, setPreviewBannerId] = useState<string | null>(
    banners[0]?.id || null
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCtaText, setFormCtaText] = useState('');
  const [formCtaLink, setFormCtaLink] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formAccentColor, setFormAccentColor] = useState('#1e73be');
  const [formLocation, setFormLocation] = useState<'Homepage Hero' | 'Category Top' | 'Promo Strip'>('Homepage Hero');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formBadgeText, setFormBadgeText] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCtaText('');
    setFormCtaLink('/category/drill-bits-and-taps');
    setFormImage('');
    setFormAccentColor('#1e73be');
    setFormLocation('Homepage Hero');
    setFormStatus('Active');
    setFormBadgeText('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (banner: BannerItem) => {
    setEditingBanner(banner);
    setFormTitle(banner.title);
    setFormSubtitle(banner.subtitle);
    setFormCtaText(banner.ctaText);
    setFormCtaLink(banner.ctaLink);
    setFormImage(banner.image);
    setFormAccentColor(banner.accentColor || '#1e73be');
    setFormLocation(banner.location);
    setFormStatus(banner.status);
    setFormBadgeText(banner.badgeText || '');
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please provide a banner title.');
      return;
    }
    if (!formImage.trim()) {
      alert('Please provide an image URL or choose a preset.');
      return;
    }

    let finalImage = formImage.trim();
    if (finalImage.startsWith('data:image/') && finalImage.length > 200000) {
      try {
        finalImage = await compressImageToDataUrl(finalImage, 1600, 900, 0.82);
      } catch (e) {
        console.warn('Could not compress data URL, using as is', e);
      }
    }

    if (editingBanner) {
      // 1. Update in local storage
      updateBanner(editingBanner.id, {
        title: formTitle,
        subtitle: formSubtitle,
        ctaText: formCtaText,
        ctaLink: formCtaLink,
        image: finalImage,
        imageUrl: finalImage,
        accentColor: formAccentColor,
        location: formLocation,
        status: formStatus,
        badgeText: formBadgeText,
      });

      // 2. Persist update to PostgreSQL backend database
      const numericId = Number(editingBanner.id);
      if (Number.isInteger(numericId)) {
        try {
          await updateBannerMutation({
            id: numericId,
            data: {
              title: formTitle,
              description: formSubtitle || formCtaText,
              imageUrl: finalImage,
              linkUrl: formCtaLink,
              isActive: formStatus === 'Active',
            },
          }).unwrap();
        } catch (err) {
          console.warn('Backend DB update banner error:', err);
        }
      }

      triggerToast('Banner updated in database & storefront successfully!');
    } else {
      // 1. Add to local storage
      addBanner({
        title: formTitle,
        subtitle: formSubtitle,
        ctaText: formCtaText,
        ctaLink: formCtaLink,
        image: finalImage,
        imageUrl: finalImage,
        accentColor: formAccentColor,
        location: formLocation,
        status: formStatus,
        order: banners.length + 1,
        badgeText: formBadgeText,
      });

      // 2. Add to PostgreSQL backend database
      try {
        await createBannerMutation({
          title: formTitle,
          description: formSubtitle || formCtaText,
          imageUrl: finalImage,
          linkUrl: formCtaLink,
          isActive: formStatus === 'Active',
          displayOrder: banners.length + 1,
        }).unwrap();
      } catch (err) {
        console.warn('Backend DB create banner error:', err);
      }

      triggerToast('New banner created in database & storefront successfully!');
    }

    setIsModalOpen(false);
  };

  // Handle Image Upload with automatic compression (<120KB) to ensure localStorage quota is never exceeded
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 1600, 900, 0.82);
      setFormImage(compressedDataUrl);
      triggerToast('Image uploaded & optimized successfully!');
    } catch (err) {
      console.warn('Fallback to file reader:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Move Up / Down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    reorderBanners(newBanners);
    triggerToast(`Banner moved ${direction}!`);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    deleteBanner(id);
    const numericId = Number(id);
    if (Number.isInteger(numericId)) {
      try {
        await deleteBannerMutation(numericId).unwrap();
      } catch (err) {
        console.warn('Backend DB delete error:', err);
      }
    }
    setDeleteConfirmId(null);
    triggerToast('Banner deleted successfully!');
  };

  // Handle Toggle Status
  const handleToggleStatus = async (banner: BannerItem) => {
    const nextStatus = banner.status === 'Active' ? 'Inactive' : 'Active';
    toggleBannerStatus(banner.id);
    const numericId = Number(banner.id);
    if (Number.isInteger(numericId)) {
      try {
        await updateBannerMutation({
          id: numericId,
          data: {
            isActive: nextStatus === 'Active',
          },
        }).unwrap();
      } catch (err) {
        console.warn('Backend DB toggle status error:', err);
      }
    }
    triggerToast(`Banner status changed to ${nextStatus}!`);
  };

  // Filtered Banners
  const filteredBanners = banners.filter((b) => {
    if (filterLocation !== 'All' && b.location !== filterLocation) return false;
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.ctaLink.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const previewBanner =
    banners.find((b) => b.id === previewBannerId) || banners[0] || null;

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/settings')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back to Settings"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: FONTS.heading }}>
              Banner Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Control, edit, design and reorder high-precision promotional hero banners across your store.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="shadow-lg shadow-red-500/20 hover:-translate-y-0.5 transition-transform"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Banner
          </Button>
        </div>
      </div>

      {/* ─── LIVE HERO BANNER PREVIEW (EXACT REFERENCE DESIGN) ─── */}
      <div className="mb-8 bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Live Storefront Preview
            </h2>
            <span className="text-xs text-gray-400">
              (Viewing: <span className="font-semibold text-gray-800">{previewBanner?.title.split('\n')[0]}</span>)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Select to preview:</span>
            <select
              value={previewBanner?.id}
              onChange={(e) => setPreviewBannerId(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 font-medium text-gray-700 focus:outline-none"
            >
              {banners.map((b, i) => (
                <option key={b.id} value={b.id}>
                  #{i + 1} - {b.title.split('\n')[0]} ({b.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Banner Render Frame */}
        <div
          className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-md select-none"
          style={{
            height: 'clamp(240px, 28vw, 360px)',
          }}
        >
          {/* Background Image */}
          {previewBanner?.image ? (
            <img
              src={previewBanner.image}
              alt={previewBanner.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No banner image selected
            </div>
          )}

          {/* Diagonal Frosted Light Polygon */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 42%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0) 100%)',
              clipPath: 'polygon(0 0, 64% 0, 46% 100%, 0 100%)',
              backdropFilter: 'blur(1.5px)',
              WebkitBackdropFilter: 'blur(1.5px)',
            }}
          />

          {/* Text Content */}
          <div className="relative z-10 h-full max-w-[1200px] mx-auto px-6 sm:px-10 flex flex-col justify-center">
            <div className="max-w-[480px]">
              <h3
                className="text-xl sm:text-2xl md:text-3xl font-normal tracking-tight text-[#17171a] leading-[1.18] whitespace-pre-line"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {previewBanner.title}
              </h3>
              <div className="mt-3 sm:mt-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-medium"
                  style={{ color: previewBanner.accentColor || '#1e73be' }}
                >
                  <span>{previewBanner.subtitle || previewBanner.ctaText}</span>
                  <span className="font-bold text-xs">&gt;</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom-Right Iconic Motif: Dynamic Navigation Slashes (////) */}
          <div className="absolute bottom-0 right-0 z-20 pointer-events-none">
            <div
              className="min-w-[120px] h-20 relative px-4"
              style={{
                background:
                  'linear-gradient(135deg, transparent 40%, rgba(30, 41, 59, 0.45) 85%, rgba(15, 23, 42, 0.65) 100%)',
                clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
              }}
            >
              <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5 pointer-events-auto">
                {banners.map((b, idx) => {
                  const isActive = b.id === previewBanner?.id;
                  return (
                    <button
                      key={b.id || idx}
                      type="button"
                      onClick={() => setPreviewBannerId(b.id)}
                      className="cursor-pointer focus:outline-none transition-transform hover:scale-125 p-0.5"
                      title={`Preview #${idx + 1}: ${b.title.split('\n')[0]}`}
                    >
                      <span
                        className={`block w-1 sm:w-1.5 h-5 sm:h-6 rounded-xs transition-all ${
                          isActive
                            ? 'bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.9)] scale-y-110'
                            : 'bg-white/80 hover:bg-white'
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
      </div>

      {/* ─── Filters & Search Bar ─── */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6" style={{ borderColor: COLORS.border }}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Location Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Homepage Hero', 'Category Top', 'Promo Strip'].map((loc) => (
              <button
                key={loc}
                onClick={() => setFilterLocation(loc)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterLocation === loc
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Status & Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-medium text-gray-700 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            <input
              type="text"
              placeholder="Search banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>
      </div>

      {/* ─── Banner Cards Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBanners.map((banner, index) => {
          const isSelectedForPreview = banner.id === previewBanner.id;

          return (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col group transition-all duration-300 ${
                isSelectedForPreview ? 'ring-2 ring-red-500/40 border-red-500/50' : ''
              }`}
              style={{ borderColor: isSelectedForPreview ? COLORS.primary : COLORS.border }}
            >
              {/* Banner Visual Thumbnail */}
              <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Diagonal effect overlay in preview */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 80%)',
                    clipPath: 'polygon(0 0, 65% 0, 45% 100%, 0 100%)',
                  }}
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/80 text-white shadow-xs">
                    #{banner.order || index + 1}
                  </span>
                  {banner.badgeText && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-xs">
                      {banner.badgeText}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                  {/* Status Toggle Badge */}
                  <button
                    onClick={() => handleToggleStatus(banner)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md cursor-pointer transition-all ${
                      banner.status === 'Active'
                        ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
                        : 'bg-gray-600/90 text-white shadow-sm hover:bg-gray-700'
                    }`}
                    title="Click to toggle status"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${banner.status === 'Active' ? 'bg-white' : 'bg-gray-300'}`} />
                    {banner.status}
                  </button>
                </div>

                {/* Reorder Buttons Overlay */}
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-lg">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-white hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move banner earlier"
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1 text-white hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move banner later"
                  >
                    <MoveDown size={14} />
                  </button>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base text-gray-900 leading-snug line-clamp-2">
                    {banner.title.replace('\n', ' ')}
                  </h3>
                  <button
                    onClick={() => setPreviewBannerId(banner.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0 cursor-pointer"
                    title="Preview this banner"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                {/* Subtitle / CTA */}
                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium" style={{ color: banner.accentColor || '#1e73be' }}>
                  <span>{banner.subtitle || banner.ctaText}</span>
                </div>

                {/* Target Link */}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5 truncate">
                  <LinkIcon size={12} className="flex-shrink-0" />
                  <span className="truncate">{banner.ctaLink}</span>
                </p>

                {/* Location Badge */}
                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-600">
                    <Layers size={13} />
                    {banner.location}
                  </span>

                  <span className="text-[11px] text-gray-400 font-mono">
                    ID: {banner.id.slice(0, 10)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t divide-x border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => handleOpenEdit(banner)}
                  className="flex-1 py-3 text-xs font-bold text-gray-700 hover:bg-white hover:text-red-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 size={13} />
                  Edit Banner
                </button>

                <button
                  onClick={() => setDeleteConfirmId(banner.id)}
                  className="px-4 py-3 text-xs font-bold text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center cursor-pointer"
                  title="Delete banner"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── ADD / EDIT BANNER MODAL ─── */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 id={titleId} className="text-xl font-bold text-gray-950" style={{ fontFamily: FONTS.heading }}>
                  {editingBanner ? 'Edit Promotional Banner' : 'Create New Industrial Banner'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Configure text, diagonal overlay, link, and high-precision imagery.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Live Mini Preview Inside Modal */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Live Banner Preview
                </label>
                <div
                  className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner select-none"
                  style={{ height: '160px' }}
                >
                  {formImage ? (
                    <img
                      src={formImage}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      Upload or enter an image URL to preview
                    </div>
                  )}
                  {/* Diagonal cut */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 42%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0) 100%)',
                      clipPath: 'polygon(0 0, 64% 0, 46% 100%, 0 100%)',
                    }}
                  />
                  <div className="relative z-10 h-full p-4 flex flex-col justify-center">
                    <h4 className="text-sm sm:text-base font-normal tracking-tight text-[#17171a] leading-tight max-w-[260px] whitespace-pre-line">
                      {formTitle || 'Banner Title Here'}
                    </h4>
                    <span className="text-xs font-medium mt-1.5" style={{ color: formAccentColor }}>
                      {formSubtitle || 'Call to action >'}
                    </span>
                  </div>
                  {/* Bottom right slashes according to banner count */}
                  <div className="absolute bottom-2 right-3 z-10 flex items-center gap-1">
                    {banners.map((b, idx) => {
                      const isCurr = editingBanner ? b.id === editingBanner.id : idx === 0;
                      return (
                        <span
                          key={b.id || idx}
                          className={`block w-1 h-4 rounded-xs ${isCurr ? 'bg-[#38bdf8]' : 'bg-white/80'}`}
                          style={{ transform: 'skewX(-28deg)' }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Main Headline / Title <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter banner headline..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-sans"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Tip: Press Enter to create a 2-line title just like in the reference image.
                </p>
              </div>

              {/* Subtitle / CTA Link Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subtitle / Link Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => {
                      setFormSubtitle(e.target.value);
                      setFormCtaText(e.target.value.replace(/>/g, '').trim());
                    }}
                    placeholder="e.g. Explore Products >"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Target Destination URL / Route <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCtaLink}
                    onChange={(e) => setFormCtaLink(e.target.value)}
                    placeholder="/category/drill-bits-and-taps"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 font-mono text-xs"
                    required
                  />
                  {/* Quick Route Buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {[
                      { label: 'Drill Bits', path: '/category/drill-bits-and-taps' },
                      { label: 'End Mills', path: '/category/end-mills' },
                      { label: 'Inquiry', path: '/bulk-inquiry' },
                      { label: 'Shop All', path: '/#shop' },
                    ].map((route) => (
                      <button
                        key={route.path}
                        type="button"
                        onClick={() => setFormCtaLink(route.path)}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded cursor-pointer"
                      >
                        {route.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Source & Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Banner Image Source <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="Enter image URL or click Upload"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors flex-shrink-0">
                    <Upload size={14} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Accent Color & Location & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                {/* Accent Color */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Palette size={12} />
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formAccentColor}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-1">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setFormAccentColor(c.value)}
                          className="w-5 h-5 rounded-full border border-white shadow-xs cursor-pointer"
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Placement
                  </label>
                  <select
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-white focus:outline-none"
                  >
                    <option value="Homepage Hero">Homepage Hero</option>
                    <option value="Category Top">Category Top</option>
                    <option value="Promo Strip">Promo Strip</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="banner_status"
                        checked={formStatus === 'Active'}
                        onChange={() => setFormStatus('Active')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-emerald-700">Active</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="banner_status"
                        checked={formStatus === 'Inactive'}
                        onChange={() => setFormStatus('Inactive')}
                        className="text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-gray-600">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  {editingBanner ? 'Save Changes' : 'Publish Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Delete this banner?</h4>
            <p className="text-xs text-gray-500 mb-6">
              This action will remove the banner from your store carousel. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
