import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  X,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Package,
  CreditCard,
  Truck,
  FileText,
  ShieldCheck,
  Eye,
  EyeOff,
  FolderPlus,
} from 'lucide-react';
import { COLORS, FONTS } from '../../../../constant/style';
import {
  useFaqs,
  DEFAULT_FAQ_CATEGORIES,
} from '../../../../utils/faqStorage';
import type { FaqItem } from '../../../../utils/faqStorage';

export default function FaqManagementScreen() {
  const navigate = useNavigate();
  const { faqs, addFaq, updateFaq, deleteFaq, resetFaqs, toggleActive } = useFaqs();

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // Form Fields
  const [formCategory, setFormCategory] = useState<string>('order-process');
  const [customCategoryLabel, setCustomCategoryLabel] = useState<string>('');
  const [formQuestion, setFormQuestion] = useState<string>('');
  const [formAnswer, setFormAnswer] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string>('');

  // Delete Confirmation Modal
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

  // Reset Confirmation Modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Success Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Expandable cards state for previewing full answers in table/card
  const [expandedFaqIds, setExpandedFaqIds] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Extract all unique categories present in faqs + default categories
  const allCategories = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_FAQ_CATEGORIES.forEach((c) => map.set(c.id, c.label));
    faqs.forEach((f) => {
      if (!map.has(f.category)) {
        map.set(f.category, f.categoryLabel || f.category);
      }
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [faqs]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: faqs.length };
    faqs.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [faqs]);

  // Filtered FAQs list
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      // Category filter
      if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active' && faq.isActive === false) return false;
      if (statusFilter === 'inactive' && faq.isActive !== false) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQ = faq.question.toLowerCase().includes(q);
        const matchesA = faq.answer.toLowerCase().includes(q);
        const matchesC = faq.categoryLabel.toLowerCase().includes(q);
        if (!matchesQ && !matchesA && !matchesC) return false;
      }

      return true;
    });
  }, [faqs, selectedCategory, statusFilter, searchQuery]);

  // Open modal for Adding new FAQ
  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setFormCategory('order-process');
    setCustomCategoryLabel('');
    setFormQuestion('');
    setFormAnswer('');
    setFormIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing existing FAQ
  const handleOpenEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFormCategory(faq.category);
    setCustomCategoryLabel(
      DEFAULT_FAQ_CATEGORIES.some((c) => c.id === faq.category) ? '' : faq.categoryLabel
    );
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormIsActive(faq.isActive !== false);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formQuestion.trim()) {
      setFormError('Please enter a question title.');
      return;
    }
    if (!formAnswer.trim()) {
      setFormError('Please provide an answer for this question.');
      return;
    }

    let finalCategory = formCategory;
    let finalCategoryLabel = '';

    if (formCategory === 'custom') {
      if (!customCategoryLabel.trim()) {
        setFormError('Please enter a label for your custom category.');
        return;
      }
      finalCategory = customCategoryLabel.trim().toLowerCase().replace(/\s+/g, '-');
      finalCategoryLabel = customCategoryLabel.trim();
    } else {
      const found = allCategories.find((c) => c.id === formCategory);
      finalCategoryLabel = found ? found.label : formCategory;
    }

    if (editingFaq) {
      // Update existing
      updateFaq(editingFaq.id, {
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        category: finalCategory,
        categoryLabel: finalCategoryLabel,
        isActive: formIsActive,
      });
      showToast(`FAQ "${formQuestion.trim().slice(0, 32)}..." updated successfully!`);
    } else {
      // Add new
      addFaq({
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        category: finalCategory,
        categoryLabel: finalCategoryLabel,
        isActive: formIsActive,
      });
      showToast('New FAQ question created and published successfully!');
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!faqToDelete) return;
    deleteFaq(faqToDelete.id);
    showToast(`Deleted question: "${faqToDelete.question.slice(0, 30)}..."`);
    setFaqToDelete(null);
  };

  // Handle Reset to Defaults
  const handleConfirmReset = () => {
    resetFaqs();
    setIsResetConfirmOpen(false);
    showToast('All 24 original store FAQs have been restored to defaults.');
  };

  const toggleExpand = (id: string) => {
    setExpandedFaqIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order-process':
        return <Package size={14} className="text-red-500" />;
      case 'payment-methods':
        return <CreditCard size={14} className="text-blue-500" />;
      case 'shipping-delivery':
        return <Truck size={14} className="text-amber-500" />;
      case 'returns-refunds':
        return <RotateCcw size={14} className="text-purple-500" />;
      case 'gst-invoice':
        return <FileText size={14} className="text-emerald-500" />;
      case 'warranty-info':
        return <ShieldCheck size={14} className="text-indigo-500" />;
      default:
        return <Sparkles size={14} className="text-rose-500" />;
    }
  };

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

      {/* Top Bar Navigation */}
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
            Business Settings &gt; FAQ Management
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Restore default 24 FAQs"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => window.open('/faqs', '_blank')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Preview Customer Storefront FAQ page"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Preview Storefront</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, #b91c1c)`,
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add New Question</span>
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
              style={{ backgroundColor: COLORS.primary, color: '#fff' }}
            >
              <HelpCircle size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1
                  className="text-2xl md:text-3xl font-black tracking-tight"
                  style={{ fontFamily: FONTS.heading, color: COLORS.text }}
                >
                  Frequently Asked Questions
                </h1>
                <span className="bg-red-50 text-red-600 text-xs font-black px-2.5 py-0.5 rounded-full border border-red-100">
                  {faqs.length} Total
                </span>
              </div>
              <p className="text-sm md:text-base leading-relaxed text-gray-500 max-w-2xl">
                Edit existing FAQs, create new customer-facing questions, and categorize them. All changes reflect live on the storefront FAQ center.
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-3 text-center min-w-[100px]">
              <span className="text-xl font-black text-gray-900 block leading-tight">
                {faqs.filter((f) => f.isActive !== false).length}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Active FAQs
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-3 text-center min-w-[100px]">
              <span className="text-xl font-black text-gray-900 block leading-tight">
                {allCategories.length}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Categories
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question titles, answers, or category tags..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-gray-50/50 hover:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Status
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Active Only
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'inactive'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hidden
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
            }`}
          >
            <Sparkles size={13} />
            <span>All Categories</span>
            <span
              className={`ml-1 text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-white/25 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {categoryCounts.all || 0}
            </span>
          </button>

          {allCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`ml-1 text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Listing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>
            Showing {filteredFaqs.length} of {faqs.length} Questions
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="text-red-600 hover:underline cursor-pointer lowercase font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <HelpCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              No matching questions found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
              Try adjusting your search criteria or create a new question for this category.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Add New Question</span>
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isExpanded = expandedFaqIds.includes(faq.id);
            const isActive = faq.isActive !== false;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                  isActive ? 'border-gray-100' : 'border-amber-200/80 bg-amber-50/10'
                }`}
              >
                <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Category pill & Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-gray-700 bg-gray-100 border border-gray-200/70 px-2.5 py-0.5 rounded-full">
                        {getCategoryIcon(faq.category)}
                        <span>{faq.categoryLabel}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleActive(faq.id)}
                        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100'
                        }`}
                        title={isActive ? 'Click to hide from customers' : 'Click to activate on storefront'}
                      >
                        {isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                        <span>{isActive ? 'Active' : 'Hidden'}</span>
                      </button>

                      {faq.updatedAt && (
                        <span className="text-[10px] text-gray-400">
                          Updated {new Date(faq.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Question Title */}
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {faq.question}
                    </h3>

                    {/* Answer Preview / Full */}
                    <div className="text-xs text-gray-600 leading-relaxed pt-1">
                      {isExpanded ? (
                        <div className="whitespace-pre-line bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 font-normal">
                          {faq.answer}
                        </div>
                      ) : (
                        <p className="line-clamp-2 text-gray-500">
                          {faq.answer}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(faq.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer pt-0.5"
                    >
                      <span>{isExpanded ? 'Show less' : 'View full answer'}</span>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(faq)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                      title="Edit this FAQ question & answer"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFaqToDelete(faq)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                      title="Delete this FAQ"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ─── ADD / EDIT MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    {editingFaq ? <Edit2 size={18} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                      {editingFaq ? 'Edit FAQ Question' : 'Add New FAQ Question'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {editingFaq
                        ? 'Update question details, category, or answer content.'
                        : 'Create a new question to assist customers on the storefront.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white"
                  >
                    {allCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                    <option value="custom">+ Create New Custom Category...</option>
                  </select>
                </div>

                {/* Custom Category Input if selected */}
                {formCategory === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1"
                  >
                    <label className="block text-xs font-bold text-red-800">
                      New Category Label *
                    </label>
                    <div className="flex items-center gap-2">
                      <FolderPlus size={16} className="text-red-500 shrink-0" />
                      <input
                        type="text"
                        value={customCategoryLabel}
                        onChange={(e) => setCustomCategoryLabel(e.target.value)}
                        placeholder="e.g. Technical Specifications, Tool Maintenance..."
                        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs font-medium bg-white outline-none focus:ring-2 focus:ring-red-200"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Question Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    Question Title *
                  </label>
                  <input
                    type="text"
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    placeholder="e.g. What is the maximum recommended feed rate for 12mm carbide end mills?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Answer Content */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600">
                      Answer Content *
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Multi-line paragraphs and bullet points supported
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={formAnswer}
                    onChange={(e) => setFormAnswer(e.target.value)}
                    placeholder="Type the complete detailed explanation or steps here. You can use bullets like:&#10;• Step 1: Check flute alignment&#10;• Step 2: Use adequate coolant..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-normal leading-relaxed outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 font-sans"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      Published Status
                    </span>
                    <span className="text-[11px] text-gray-500">
                      When active, customers can immediately see this question on the /faqs storefront.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md cursor-pointer"
                  >
                    {editingFaq ? 'Save Changes' : 'Create Question'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRMATION MODAL ──────────────────────────────────── */}
      <AnimatePresence>
        {faqToDelete && (
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
                  Delete this FAQ Question?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Are you sure you want to permanently delete:
                </p>
                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-800 text-left line-clamp-2">
                  &ldquo;{faqToDelete.question}&rdquo;
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFaqToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── RESET CONFIRMATION MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {isResetConfirmOpen && (
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
                  Restore Default FAQs?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This will restore the 24 standard store questions across the 6 core categories (Order Process, Payment Methods, Shipping & Delivery, Returns & Refunds, GST Invoice Queries, and Warranty Information). Any custom edits or newly created questions will be overwritten.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Yes, Restore Defaults
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
