import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronDown,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  FileText,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { COLORS, FONTS } from '../../../constant/style';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

import { useFaqs, DEFAULT_FAQ_CATEGORIES } from '../../../utils/faqStorage';

const CATEGORY_ICONS: Record<string, any> = {
  'all': Sparkles,
  'order-process': Package,
  'payment-methods': CreditCard,
  'shipping-delivery': Truck,
  'returns-refunds': RotateCcw,
  'gst-invoice': FileText,
  'warranty-info': ShieldCheck,
};

function formatInlineText(text: string, navigate: (p: string) => void) {
  const parts = text.split(/(Orders Dashboard|My Orders|Your Order|Bulk \/ Custom Inquiry|\*\*.*?\*\*|\'.*?\')/g);

  return parts.map((part, i) => {
    if (part === 'Orders Dashboard' || part === 'My Orders' || part === 'Your Order') {
      return (
        <button
          key={i}
          type="button"
          onClick={() => navigate('/orders')}
          className="font-bold text-red-600 hover:underline inline-flex items-center gap-0.5 align-baseline"
        >
          {part} <ExternalLink size={11} className="inline ml-0.5" />
        </button>
      );
    }
    if (part === 'Bulk / Custom Inquiry') {
      return (
        <button
          key={i}
          type="button"
          onClick={() => navigate('/bulk-inquiry')}
          className="font-bold text-red-600 hover:underline inline-flex items-center gap-0.5 align-baseline"
        >
          {part} <ExternalLink size={11} className="inline ml-0.5" />
        </button>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-900 font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("'") && part.endsWith("'") && part.length > 2) {
      return <strong key={i} className="text-gray-900 font-semibold">{part.slice(1, -1)}</strong>;
    }
    return part;
  });
}

function renderFormattedAnswer(answer: string, navigate: (p: string) => void) {
  if (!answer) return null;

  const sections = answer.split(/\n\s*\n/);

  return (
    <div className="space-y-3 leading-relaxed">
      {sections.map((sec, secIdx) => {
        const lines = sec.split('\n').map((l) => l.trim()).filter(Boolean);

        const isList = lines.length > 0 && lines.every((l) => /^([•\-\*]|\d+\.)/.test(l));

        if (isList) {
          const isNumbered = /^\d+\./.test(lines[0]);
          if (isNumbered) {
            return (
              <ol key={secIdx} className="list-decimal list-inside space-y-1.5 pl-1 text-gray-600 font-medium">
                {lines.map((l, i) => (
                  <li key={i}>{formatInlineText(l.replace(/^\d+\.\s*/, ''), navigate)}</li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={secIdx} className="list-disc list-inside space-y-1.5 pl-1 text-gray-600 font-medium">
              {lines.map((l, i) => (
                <li key={i}>{formatInlineText(l.replace(/^[•\-\*]\s*/, ''), navigate)}</li>
              ))}
            </ul>
          );
        }

        return (
          <div key={secIdx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              if (/^[•\-\*]\s*/.test(line)) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2 text-gray-600 font-medium">
                    <span className="text-red-500 font-black shrink-0">•</span>
                    <span>{formatInlineText(line.replace(/^[•\-\*]\s*/, ''), navigate)}</span>
                  </div>
                );
              }
              if (/^\d+\.\s*/.test(line)) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2 text-gray-600 font-medium">
                    <span className="text-red-600 font-bold shrink-0">{line.match(/^\d+\./)?.[0]}</span>
                    <span>{formatInlineText(line.replace(/^\d+\.\s*/, ''), navigate)}</span>
                  </div>
                );
              }
              if (line.endsWith(':') && line.length < 60) {
                return (
                  <p key={lineIdx} className="font-bold text-gray-900 pt-1">
                    {line}
                  </p>
                );
              }
              return (
                <p key={lineIdx} className="text-gray-600">
                  {formatInlineText(line, navigate)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function FaqScreen() {
  const navigate = useNavigate();
  const { faqs } = useFaqs();

  // Show only active FAQs to customers
  const activeFaqs = useMemo(() => {
    return faqs.filter((f) => f.isActive !== false);
  }, [faqs]);

  // Dynamically compute category tabs from active faqs
  const dynamicCategories = useMemo(() => {
    const list = [{ id: 'all', label: 'All Questions', icon: Sparkles }];
    const seen = new Set<string>();

    // Put standard categories first if present
    DEFAULT_FAQ_CATEGORIES.forEach((cat) => {
      list.push({
        id: cat.id,
        label: cat.label,
        icon: CATEGORY_ICONS[cat.id] || Sparkles,
      });
      seen.add(cat.id);
    });

    // Add any custom categories from faqs
    activeFaqs.forEach((faq) => {
      if (!seen.has(faq.category)) {
        list.push({
          id: faq.category,
          label: faq.categoryLabel || faq.category,
          icon: CATEGORY_ICONS[faq.category] || Sparkles,
        });
        seen.add(faq.category);
      }
    });

    return list;
  }, [activeFaqs]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['order-1', 'payment-1', 'gst-1']);

  // Filter questions based on active category and search query
  const filteredFaqs = useMemo(() => {
    return activeFaqs.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const questionText = item.question.toLowerCase();
      const categoryText = item.categoryLabel.toLowerCase();

      // Simple text check
      let answerText = '';
      if (typeof item.answer === 'string') {
        answerText = item.answer.toLowerCase();
      }

      return (
        questionText.includes(q) ||
        categoryText.includes(q) ||
        answerText.includes(q)
      );
    });
  }, [activeFaqs, activeCategory, searchQuery]);

  // Toggle single accordion
  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Expand all / collapse all
  const expandAll = () => {
    setOpenIds(filteredFaqs.map((item) => item.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activeFaqs.length };
    activeFaqs.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [activeFaqs]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FAFAFC] relative overflow-hidden"
      style={{ fontFamily: FONTS.main, color: COLORS.text }}
    >
      {/* Decorative ambient gradient blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-red-200/10 to-rose-200/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[650px] h-[650px] bg-gradient-to-br from-red-100/10 to-stone-200/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* ─── Hero Header Section ────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-red-50 border border-red-100/80 rounded-full px-4 py-1.5 mb-5 shadow-sm"
          >
            <HelpCircle size={15} className="text-red-600" />
            <span className="text-xs font-black uppercase tracking-widest text-red-600">
              Help & Support Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-4"
            style={{ fontFamily: FONTS.heading }}
          >
            Frequently Asked <span style={{ color: COLORS.primary }}>Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 font-medium text-base sm:text-lg leading-relaxed"
          >
            Quick answers to everything you need to know about ordering, payments, shipping, GST invoices, returns, and tool warranties.
          </motion.p>

          {/* ─── Interactive Search Bar ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 relative max-w-2xl mx-auto"
          >
            <div className="relative flex items-center">
              <Search
                size={20}
                className="absolute left-5 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. GST invoice, refund timeline, warranty, COD)..."
                className="w-full pl-13 pr-12 py-4 rounded-2xl bg-white border border-gray-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-sm sm:text-base font-medium outline-none transition-all duration-300 focus:border-red-500 focus:ring-4 focus:ring-red-100/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-left text-xs font-bold text-gray-400 mt-2.5 pl-2">
                Showing {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </motion.div>
        </div>

        {/* ─── Category Navigation Chips ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none sm:justify-center flex-wrap">
            {dynamicCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_4px_16px_rgba(220,38,38,0.25)] scale-[1.02]'
                      : 'bg-white border border-gray-200/80 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-gray-50/50 shadow-sm'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-gray-500'} />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Quick Controls: Results count & Expand/Collapse ───────────── */}
        <div className="flex items-center justify-between border-b border-gray-200/70 pb-3 mb-6 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {filteredFaqs.length} Question{filteredFaqs.length !== 1 ? 's' : ''} Listed
          </span>
          <div className="flex items-center gap-3 text-xs font-bold">
            <button
              onClick={expandAll}
              className="text-gray-500 hover:text-red-600 cursor-pointer transition-colors"
            >
              Expand All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-gray-500 hover:text-red-600 cursor-pointer transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* ─── FAQ Accordion List ────────────────────────────────────────── */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
            <HelpCircle size={44} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No matching questions found</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try using another keyword or reach out directly to our team.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-6 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold cursor-pointer hover:bg-red-700 transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openIds.includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-red-200/80 shadow-[0_8px_30px_rgba(220,38,38,0.06)] ring-1 ring-red-100'
                      : 'border-gray-200/70 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left cursor-pointer transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5 pr-2">
                      <span className="inline-block text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100/60 px-2.5 py-0.5 rounded-full">
                        {item.categoryLabel}
                      </span>
                      <h3
                        className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                          isOpen ? 'text-red-600' : 'text-gray-900 hover:text-red-600'
                        }`}
                      >
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 mt-1 ${
                        isOpen
                          ? 'bg-red-50 text-red-600 rotate-180'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {/* Accordion Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-gray-600 border-t border-gray-100/80 bg-gradient-to-b from-gray-50/30 to-white leading-relaxed">
                          {renderFormattedAnswer(item.answer, navigate)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ─── Bottom Support & Help Card ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-20 bg-gradient-to-br from-gray-900 via-gray-900 to-stone-900 text-white rounded-[28px] p-8 sm:p-12 relative overflow-hidden shadow-xl"
        >
          {/* Subtle gradient highlights */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-red-400 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
              <Sparkles size={14} /> Still Need Assistance?
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight mb-3"
              style={{ fontFamily: FONTS.heading }}
            >
              Can&apos;t find the answer you&apos;re looking for?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
              Our engineering support team and billing desk are ready to help with order tracking, custom tool specifications, and invoice queries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => navigate('/orders')}
                className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare size={18} />
                </div>
                <h4 className="font-bold text-sm text-white mb-0.5">Order Support</h4>
                <p className="text-xs text-gray-400">Track order or file ticket</p>
              </div>

              <div
                onClick={() => navigate('/bulk-inquiry')}
                className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Package size={18} />
                </div>
                <h4 className="font-bold text-sm text-white mb-0.5">Bulk / Custom</h4>
                <p className="text-xs text-gray-400">Custom tool cutting quotes</p>
              </div>

              <a
                href="mailto:support@sansai.com"
                className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all duration-300 cursor-pointer group block"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <h4 className="font-bold text-sm text-white mb-0.5">Email Desk</h4>
                <p className="text-xs text-gray-400">support@sansai.com</p>
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
