import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Info,
  Shield,
  FileCheck2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Mail,
  Phone,
} from 'lucide-react';
import { COLORS, FONTS } from '../../../../constant/style';
import {
  useCmsPages,
} from '../../../../utils/cmsStorage';
import type { CmsPage, CmsSection, CmsHighlight } from '../../../../utils/cmsStorage';

type TabKey = 'about' | 'privacy' | 'terms';

export default function CMSPagesScreen() {
  const navigate = useNavigate();
  const { pages, updatePage, resetPage } = useCmsPages();

  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [activeMode, setActiveMode] = useState<'edit' | 'preview'>('edit');

  // Local draft state for editing before saving
  const [draft, setDraft] = useState<CmsPage>(pages[activeTab]);
  const [isDirty, setIsDirty] = useState(false);

  // Modals & Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  // Sync draft when switching tabs
  useEffect(() => {
    if (pages[activeTab]) {
      setDraft(JSON.parse(JSON.stringify(pages[activeTab])));
      setIsDirty(false);
    }
  }, [activeTab, pages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    updatePage(activeTab, draft);
    setIsDirty(false);
    showToast(`"${draft.title}" content saved and published to storefront!`);
  };

  const handleConfirmReset = () => {
    const res = resetPage(activeTab);
    setDraft(JSON.parse(JSON.stringify(res)));
    setIsDirty(false);
    setIsResetModalOpen(false);
    showToast(`"${res.title}" has been restored to factory default content.`);
  };

  // Section Handlers
  const handleSectionChange = (id: string, field: 'heading' | 'content', value: string) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
    setIsDirty(true);
  };

  const handleAddSection = () => {
    const newSection: CmsSection = {
      id: `sec-${Date.now()}`,
      heading: 'New Content Section',
      content: 'Enter section content here. Multi-line paragraphs and bullet points are supported...',
    };
    setDraft((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setIsDirty(true);
  };

  const handleDeleteSection = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
    setSectionToDelete(null);
    setIsDirty(true);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draft.sections.length) return;

    const updated = [...draft.sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setDraft((prev) => ({ ...prev, sections: updated }));
    setIsDirty(true);
  };

  // Highlights handlers (for About Us)
  const handleHighlightChange = (id: string, field: keyof CmsHighlight, value: string) => {
    if (!draft.highlights) return;
    setDraft((prev) => ({
      ...prev,
      highlights: prev.highlights?.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    }));
    setIsDirty(true);
  };

  const handleAddHighlight = () => {
    const newHighlight: CmsHighlight = {
      id: `hl-${Date.now()}`,
      value: '100+',
      label: 'New Metric',
      description: 'Metric description...',
    };
    setDraft((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlight],
    }));
    setIsDirty(true);
  };

  const handleDeleteHighlight = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      highlights: prev.highlights?.filter((h) => h.id !== id),
    }));
    setIsDirty(true);
  };

  const getPublicUrl = () => {
    if (activeTab === 'about') return '/about';
    if (activeTab === 'privacy') return '/privacy';
    return '/terms';
  };

  const tabsConfig = [
    { key: 'about' as TabKey, label: 'About Us', icon: Info, path: '/about' },
    { key: 'privacy' as TabKey, label: 'Privacy Policy', icon: Shield, path: '/privacy' },
    { key: 'terms' as TabKey, label: 'Terms & Conditions', icon: FileCheck2, path: '/terms' },
  ];

  return (
    <div
      style={{ fontFamily: FONTS.main, color: COLORS.text }}
      className="p-2 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400 font-medium text-sm"
          >
            <CheckCircle2 size={18} className="shrink-0 text-emerald-100" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/settings')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Back to Business Settings"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            Business Settings &gt; CMS Pages
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-red-600 hover:border-red-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Restore default content for this page"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={() => window.open(getPublicUrl(), '_blank')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-red-600 hover:border-red-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Open customer storefront page"
          >
            <ExternalLink size={14} />
            <span>View Storefront</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md cursor-pointer ${
              isDirty
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <Save size={15} />
            <span>{isDirty ? 'Save Changes' : 'Saved'}</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
              style={{ backgroundColor: COLORS.primary, color: '#fff' }}
            >
              <FileText size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1
                  className="text-2xl md:text-3xl font-black tracking-tight"
                  style={{ fontFamily: FONTS.heading, color: COLORS.text }}
                >
                  CMS Content Management
                </h1>
                {isDirty && (
                  <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                    Unsaved Changes
                  </span>
                )}
              </div>
              <p className="text-sm md:text-base leading-relaxed text-gray-500 max-w-2xl">
                Edit text, policies, and sections across About Us, Privacy Policy, and Terms & Conditions. Any change saved here updates the customer storefront immediately.
              </p>
            </div>
          </div>

          {/* Mode Switcher: Edit Mode vs Live Preview */}
          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveMode('edit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'edit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Editor Mode
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('preview')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'preview'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Eye size={13} />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-600 shadow-md scale-[1.01]'
                  : 'bg-white border-gray-200/80 text-gray-700 hover:border-red-200 hover:bg-red-50/20'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.path}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── MAIN CONTENT: EDIT MODE VS PREVIEW MODE ────────────────────── */}
      {activeMode === 'edit' ? (
        <div className="space-y-6">
          {/* 1. Page Header & Metadata Configuration Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Page Header & Metadata
                </h3>
                <p className="text-xs text-gray-400">
                  Configure titles, hero subtitle, and contact points for this page.
                </p>
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                Last updated: {draft.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => {
                    setDraft((prev) => ({ ...prev, title: e.target.value }));
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                  Header Badge / Pill
                </label>
                <div className="relative">
                  <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                  <input
                    type="text"
                    value={draft.badge || ''}
                    onChange={(e) => {
                      setDraft((prev) => ({ ...prev, badge: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="e.g. ENGINEERED FOR PRECISION"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                  Hero Subtitle / Tagline *
                </label>
                <textarea
                  rows={2}
                  value={draft.subtitle}
                  onChange={(e) => {
                    setDraft((prev) => ({ ...prev, subtitle: e.target.value }));
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={draft.contactEmail || ''}
                    onChange={(e) => {
                      setDraft((prev) => ({ ...prev, contactEmail: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="e.g. support@sansai.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {activeTab === 'about' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={draft.contactPhone || ''}
                      onChange={(e) => {
                        setDraft((prev) => ({ ...prev, contactPhone: e.target.value }));
                        setIsDirty(true);
                      }}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Key Highlights / Stats Editor (Specifically for About Us) */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Key Performance Highlights & Metric Cards
                  </h3>
                  <p className="text-xs text-gray-400">
                    Display key metrics on the About Us page such as tools shipped and delivery coverage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {draft.highlights?.map((hl) => (
                  <div
                    key={hl.id}
                    className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(hl.id)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Delete this metric card"
                    >
                      <Trash2 size={13} />
                    </button>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">
                        Metric Value
                      </label>
                      <input
                        type="text"
                        value={hl.value}
                        onChange={(e) => handleHighlightChange(hl.id, 'value', e.target.value)}
                        placeholder="e.g. 50,000+"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm font-black bg-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">
                        Title Label
                      </label>
                      <input
                        type="text"
                        value={hl.label}
                        onChange={(e) => handleHighlightChange(hl.id, 'label', e.target.value)}
                        placeholder="e.g. Tools Shipped"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">
                        Description
                      </label>
                      <input
                        type="text"
                        value={hl.description || ''}
                        onChange={(e) => handleHighlightChange(hl.id, 'description', e.target.value)}
                        placeholder="Brief description"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] bg-white outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Content Sections Editor */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Page Content Sections ({draft.sections.length})
                </h3>
                <p className="text-xs text-gray-400">
                  Organize and edit the core clauses, paragraphs, and bullet points.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus size={15} />
                <span>Add New Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {draft.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="bg-gray-50/60 rounded-2xl border border-gray-200/80 p-5 space-y-3 transition-all hover:border-gray-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-[11px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => handleSectionChange(section.id, 'heading', e.target.value)}
                        placeholder="Section Heading (e.g. 1. Introduction)"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-900 outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Section Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                        className={`p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-black transition-colors ${
                          idx === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === draft.sections.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        className={`p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-black transition-colors ${
                          idx === draft.sections.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSectionToDelete(section.id)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Section Content Area */}
                  <div>
                    <textarea
                      rows={5}
                      value={section.content}
                      onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                      placeholder="Type the detailed text here. Bullet points like '• Point 1' and paragraphs separated by blank lines will render beautifully..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm leading-relaxed font-normal text-gray-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 font-sans"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add Section Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-red-400 text-gray-600 hover:text-red-600 text-xs font-bold transition-all cursor-pointer bg-white"
              >
                <Plus size={15} />
                <span>Add Another Section to {draft.title}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─── LIVE PREVIEW MODE ─────────────────────────────────────────── */
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-12 overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Live Preview Header */}
            <div className="text-center max-w-3xl mx-auto border-b border-gray-100 pb-8">
              {draft.badge && (
                <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3.5 py-1 mb-3">
                  <Sparkles size={13} className="text-red-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-600">
                    {draft.badge}
                  </span>
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-3">
                {draft.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
                {draft.subtitle}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Effective: {draft.lastUpdated}
              </p>
            </div>

            {/* Highlights if About Us */}
            {activeTab === 'about' && draft.highlights && draft.highlights.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                {draft.highlights.map((h) => (
                  <div key={h.id} className="bg-gray-50 border border-gray-200/70 rounded-2xl p-4 text-center">
                    <span className="text-2xl font-black text-red-600 block">{h.value}</span>
                    <span className="text-xs font-bold text-gray-900 block mt-0.5">{h.label}</span>
                    {h.description && (
                      <span className="text-[11px] text-gray-500 block mt-1 leading-snug">{h.description}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Content Sections */}
            <div className="space-y-8 pt-4">
              {draft.sections.map((sec) => (
                <div key={sec.id} className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 pb-1 border-b border-gray-100">
                    {sec.heading}
                  </h2>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line space-y-2">
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Footer */}
            {draft.contactEmail && (
              <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-200/70 text-center text-xs text-gray-600">
                <p className="font-bold text-gray-900 mb-1">Questions regarding our {draft.title}?</p>
                <p>
                  Contact our desk directly at{' '}
                  <a href={`mailto:${draft.contactEmail}`} className="text-red-600 font-bold hover:underline">
                    {draft.contactEmail}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── RESET CONFIRMATION MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Restore Default Content?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This will restore the original factory text for &ldquo;{draft.title}&rdquo;. Any unsaved edits and custom modifications on this page will be replaced.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Yes, Restore Default
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DELETE SECTION CONFIRMATION MODAL ──────────────────────────── */}
      <AnimatePresence>
        {sectionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Delete this Section?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Are you sure you want to remove this content section from {draft.title}?
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSectionToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSection(sectionToDelete)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
