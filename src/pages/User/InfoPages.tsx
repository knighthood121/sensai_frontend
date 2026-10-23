import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  FileCheck2,
  Mail,
  ArrowRight,
  Package,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FaqScreen from './Faq/FaqScreen';
import { useCmsPage } from '../../utils/cmsStorage';
import { COLORS, FONTS } from '../../constant/style';

export function FaqPage() {
  return <FaqScreen />;
}

// ─── Format Multi-line Text ──────────────────────────────────────────────────
function renderContent(content: string) {
  if (!content) return null;
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="space-y-4">
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
        const isBulletList = lines.length > 0 && lines.every((l) => /^([•\-\*]|\d+\.)/.test(l));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-2 pl-1">
              {lines.map((line, lIdx) => (
                <li key={lIdx} className="flex items-start gap-2.5 text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
                  <span className="text-red-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{line.replace(/^([•\-\*]|\d+\.)\s*/, '')}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={pIdx} className="space-y-2">
            {lines.map((line, lIdx) => {
              if (/^([•\-\*]|\d+\.)\s*/.test(line)) {
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 text-gray-600 leading-relaxed text-sm sm:text-base pl-2">
                    <span className="text-red-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{line.replace(/^([•\-\*]|\d+\.)\s*/, '')}</span>
                  </div>
                );
              }
              return (
                <p key={lIdx} className="text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
                  {line}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── ABOUT US PAGE ──────────────────────────────────────────────────────────
export function AboutPage() {
  const navigate = useNavigate();
  const page = useCmsPage('about');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC]" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          {page.badge && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-5 shadow-xs"
            >
              <Sparkles size={14} className="text-red-600" />
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                {page.badge}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-5"
            style={{ fontFamily: FONTS.heading }}
          >
            {page.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            {page.subtitle}
          </motion.p>
        </div>

        {/* Highlights Grid */}
        {page.highlights && page.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {page.highlights.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 text-center shadow-xs hover:shadow-md transition-shadow"
              >
                <span className="text-3xl sm:text-4xl font-black text-red-600 block mb-1">
                  {item.value}
                </span>
                <span className="text-sm font-bold text-gray-900 block mb-1">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-xs text-gray-500 leading-snug block">
                    {item.description}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Content Sections */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {page.sections.map((section, idx) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xs"
            >
              <h2
                className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 pb-3 border-b border-gray-100"
                style={{ fontFamily: FONTS.heading }}
              >
                {section.heading}
              </h2>
              {renderContent(section.content)}
            </motion.section>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-br from-gray-900 via-gray-900 to-stone-900 text-white rounded-[28px] p-8 sm:p-12 text-center max-w-4xl mx-auto relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: FONTS.heading }}>
              Empower Your Workshop with Sensai Tooling
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Explore our comprehensive catalog of drill bits, taps, and cutting solutions, or talk with our engineering sales desk for wholesale quotes.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
              <Link
                to="/#shop"
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Browse Online Catalog</span>
                <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => navigate('/bulk-inquiry')}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Package size={14} />
                <span>Bulk / Custom Inquiry</span>
              </button>
            </div>
            {page.contactEmail && (
              <p className="text-xs text-gray-400 pt-4">
                Have questions? Reach us at{' '}
                <a href={`mailto:${page.contactEmail}`} className="text-red-400 font-bold hover:underline">
                  {page.contactEmail}
                </a>
                {page.contactPhone && <span> | {page.contactPhone}</span>}
              </p>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

// ─── PRIVACY POLICY PAGE ────────────────────────────────────────────────────
export function PrivacyPolicyPage() {
  const page = useCmsPage('privacy');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC]" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {page.badge && (
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-4">
              <Shield size={14} className="text-red-600" />
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                {page.badge}
              </span>
            </div>
          )}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3"
            style={{ fontFamily: FONTS.heading }}
          >
            {page.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            {page.subtitle}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-3">
            Last Updated: {page.lastUpdated}
          </p>
        </div>

        {/* Content Document Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xs space-y-10">
          {page.sections.map((section) => (
            <section key={section.id} className="space-y-4">
              <h2
                className="text-xl sm:text-2xl font-bold text-gray-900 pb-2 border-b border-gray-100"
                style={{ fontFamily: FONTS.heading }}
              >
                {section.heading}
              </h2>
              {renderContent(section.content)}
            </section>
          ))}

          {/* Grievance Desk Box */}
          {page.contactEmail && (
            <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Mail size={16} className="text-red-600" />
                  <span>Privacy Grievance & Data Protection Officer</span>
                </h4>
                <p className="text-xs text-gray-500">
                  For data requests, access queries, or privacy concerns, contact our designated privacy desk.
                </p>
              </div>
              <a
                href={`mailto:${page.contactEmail}`}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs shrink-0 text-center"
              >
                {page.contactEmail}
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── TERMS & CONDITIONS PAGE ────────────────────────────────────────────────
export function TermsPage() {
  const page = useCmsPage('terms');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC]" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {page.badge && (
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-4">
              <FileCheck2 size={14} className="text-red-600" />
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                {page.badge}
              </span>
            </div>
          )}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3"
            style={{ fontFamily: FONTS.heading }}
          >
            {page.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            {page.subtitle}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-3">
            Last Updated: {page.lastUpdated}
          </p>
        </div>

        {/* Content Document Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xs space-y-10">
          {page.sections.map((section) => (
            <section key={section.id} className="space-y-4">
              <h2
                className="text-xl sm:text-2xl font-bold text-gray-900 pb-2 border-b border-gray-100"
                style={{ fontFamily: FONTS.heading }}
              >
                {section.heading}
              </h2>
              {renderContent(section.content)}
            </section>
          ))}

          {/* Legal Inquiries Box */}
          {page.contactEmail && (
            <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Commercial Inquiries & Legal Compliance</span>
                </h4>
                <p className="text-xs text-gray-500">
                  Questions regarding commercial terms, distribution agreements, or HSN tax classifications.
                </p>
              </div>
              <a
                href={`mailto:${page.contactEmail}`}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs shrink-0 text-center"
              >
                {page.contactEmail}
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
