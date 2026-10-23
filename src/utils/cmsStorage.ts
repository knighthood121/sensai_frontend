import { useState, useEffect, useCallback } from 'react';

export interface CmsSection {
  id: string;
  heading: string;
  content: string;
}

export interface CmsHighlight {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface CmsPage {
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  lastUpdated: string;
  isActive: boolean;
  sections: CmsSection[];
  highlights?: CmsHighlight[];
  contactEmail?: string;
  contactPhone?: string;
}

export const DEFAULT_CMS_PAGES: Record<string, CmsPage> = {
  about: {
    slug: 'about',
    title: 'About Sensai',
    subtitle: 'Precision Industrial Tooling & High-Performance Cutting Solutions Engineered for India’s Modern Manufacturing.',
    badge: 'ENGINEERED FOR PRECISION',
    lastUpdated: 'October 2026',
    isActive: true,
    contactEmail: 'support@sensai.com',
    contactPhone: '+91 98765 43210',
    highlights: [
      { id: 'h1', value: '50,000+', label: 'Tools Shipped', description: 'Precision drill bits, end mills, and taps delivered nationwide' },
      { id: 'h2', value: '26,000+', label: 'Pin Codes Served', description: 'Direct doorstep delivery to workshops, MIDCs and SEZs' },
      { id: 'h3', value: '99.4%', label: 'On-Time Dispatch', description: 'Orders packed and handed to tier-1 couriers within 24 hours' },
      { id: 'h4', value: '100% HRC', label: 'Hardness Tested', description: 'Batch verified for metallurgical integrity & zero run-out' },
    ],
    sections: [
      {
        id: 'story',
        heading: 'Our Story & Engineering Mission',
        content: `Founded with a clear engineering objective, Sensai delivers industrial-grade precision drill bits, hand taps, hole saws, and carbide cutting tools tailored for fabrication shops, CNC machine centers, and industrial workshops across India.

We bridge the gap between expensive imported tooling and substandard domestic alternatives by adhering strictly to ISO metallurgical standards, precision concentricity grinds, and calibrated hardness treatments (HRC 64–68). Every tool is designed to maximize tool life, minimize spindle chatter, and deliver mirror-clean holes on challenging alloys.`,
      },
      {
        id: 'quality',
        heading: 'Uncompromising Quality Standards',
        content: `Every Sensai cutting tool undergoes stringent multi-stage inspection:

• Premium Metallurgical Raw Materials: Micro-grain tungsten carbide and M35/M42 Cobalt High-Speed Steel.
• 5-Axis CNC Flute Grinding: Ultra-smooth chip evacuation channels to prevent material clogging and thermal softening.
• Advanced Surface Coatings: Industrial TiAlN and TiN coatings that dramatically reduce friction and double tool lifespan.
• Concentricity & Run-Out Tolerances: 100% optical verification to ensure zero spindle vibration and prevent bit breakage.`,
      },
      {
        id: 'support',
        heading: 'Bulk Industrial Supply & Engineering Sales Desk',
        content: `Whether your workshop requires a standard pack of masonry bits or a tailored batch of multi-flute end mills for specialized aerospace or automotive alloys, our engineering sales desk works directly with your procurement team.

We offer commercial B2B invoicing, GST input credit compliance, customized dimensional manufacturing, and rapid dispatch from our centralized distribution hub.`,
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'We respect your privacy and are committed to protecting your personal, corporate, and commercial data.',
    badge: 'DATA PROTECTION & SECURITY',
    lastUpdated: 'October 2026',
    isActive: true,
    contactEmail: 'privacy@sensai.com',
    sections: [
      {
        id: 'intro',
        heading: '1. Introduction & Scope',
        content: `Sensai Commerce ("we", "our", or "us") operates the website and online ordering platform. This Privacy Policy outlines our procedures regarding the collection, handling, and disclosure of personal and commercial information when you browse our catalog, register an account, or place retail and bulk orders.

By accessing our services, you consent to the data practices described in this policy in accordance with applicable Indian data protection and information technology regulations.`,
      },
      {
        id: 'collection',
        heading: '2. Information We Collect',
        content: `We collect information necessary to deliver precision tools and comply with commercial tax regulations:

• Account & Profile Information: Name, email address, mobile phone number, workshop name, and login credentials.
• Shipping & Delivery Details: Physical shipping address, workshop or shed unit number, landmark, delivery pin code, and dispatch instructions.
• Business & Tax Details (B2B): Registered legal entity name and 15-digit GSTIN number for tax invoicing and input credit claims.
• Payment Data: Transactions are handled securely through PCI-DSS Level 1 certified payment gateways. Sensai never stores your full card numbers, CVVs, or banking PINs on its servers.`,
      },
      {
        id: 'usage',
        heading: '3. How We Use Your Information',
        content: `We utilize collected information strictly for legitimate commercial purposes:

• Processing, packing, and dispatching your tool orders.
• Providing live 5-stage shipment tracking notifications via SMS, WhatsApp, and email.
• Issuing legitimate GST-compliant tax invoices and generating credit notes.
• Assisting you with customer support inquiries, warranty inspections, and technical tooling questions.
• Preventing fraud, unauthorized account access, and security breaches.`,
      },
      {
        id: 'sharing',
        heading: '4. Third-Party Disclosures & Partners',
        content: `We do not sell, rent, or trade your personal or business information. Data is only shared with verified partners under confidentiality agreements:

• Logistics Partners: Verified couriers (e.g., Blue Dart, Delhivery, DTDC, India Post) to deliver packages.
• Payment Gateways: Encrypted tokens passed to RBI-authorized gateway providers for transaction authorization.
• Statutory Authorities: When mandatory under applicable Indian tax laws, GSTR-1 filings, or court orders.`,
      },
      {
        id: 'security',
        heading: '5. Data Security & Retention',
        content: `Sensai implements 256-bit SSL encryption, automated tokenization, and strict database firewalls. All data is retained only for as long as necessary to fulfill commercial purchases and statutory tax filing periods.`,
      },
      {
        id: 'rights',
        heading: '6. Your Rights & Grievance Contact',
        content: `You have the right to review, update, or request deletion of your account details at any time from your Profile Dashboard.

For privacy inquiries, data requests, or grievance redressal, please reach our Data Protection Officer at privacy@sensai.com.`,
      },
    ],
  },

  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    subtitle: 'Terms of sale, commercial ordering policies, warranties, and platform terms of service.',
    badge: 'TERMS OF SERVICE',
    lastUpdated: 'October 2026',
    isActive: true,
    contactEmail: 'legal@sensai.com',
    sections: [
      {
        id: 'agreement',
        heading: '1. Agreement to Terms',
        content: `By accessing, browsing, or purchasing precision cutting tools, drill bits, and machinery accessories from Sensai, you agree to be bound by these Terms and Conditions and all applicable Indian industrial regulations. If you do not agree, please do not use the platform.`,
      },
      {
        id: 'orders',
        heading: '2. Orders, Pricing, and Invoicing',
        content: `All prices on the platform are quoted in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to correct typographical pricing errors. Tax invoices with proper HSN codes (e.g., 8207) are issued for every purchase and are available for download in your Orders dashboard.`,
      },
      {
        id: 'delivery',
        heading: '3. Shipping & Delivery Terms',
        content: `Estimated transit timelines are 2–4 business days for major industrial centers and 4–6 business days for regional clusters. Risk of transit damage passes to our logistics partners until physical handover. Customers are advised to inspect packages upon arrival before accepting visibly damaged shipments.`,
      },
      {
        id: 'returns',
        heading: '4. 7-Day Return & Replacement Policy',
        content: `We offer a transparent 7-Day return or exchange window from the delivery date for items that arrive defective, damaged, or out-of-specification. Returned items must remain in original unused condition without spindle chuck damage, thermal burns, or tool modification.`,
      },
      {
        id: 'warranty',
        heading: '5. Manufacturer Guarantee & Limitations',
        content: `All Sensai tools are warranted against metallurgical flaws, premature carbide detachment, and out-of-tolerance straightness.

Warranty does not cover normal cutting edge wear, tool overheating due to absence of coolant, improper machine RPM, or using standard bits on reinforced rebar concrete.`,
      },
      {
        id: 'safety',
        heading: '6. Industrial Safety & Operating Precautions',
        content: `Precision cutting tools operate at high rotational velocities and generate flying chips and intense friction heat. Operators must wear approved eye and face protection, ensure proper workpiece clamping, and adhere to recommended machine feed rates and cutting lubricants.`,
      },
      {
        id: 'jurisdiction',
        heading: '7. Governing Law & Dispute Resolution',
        content: `These Terms are governed by and construed in accordance with the laws of India. Any legal dispute or claim arising out of orders placed on this platform shall be subject to the exclusive jurisdiction of the competent courts in India.`,
      },
    ],
  },
};

const STORAGE_KEY = 'sensai_cms_pages_data';
const EVENT_NAME = 'sensai_cms_updated';

function notifyUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function getStoredCmsPages(): Record<string, CmsPage> {
  if (typeof window === 'undefined') return DEFAULT_CMS_PAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CMS_PAGES));
      return DEFAULT_CMS_PAGES;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CMS_PAGES));
      return DEFAULT_CMS_PAGES;
    }
    // Ensure all 3 default pages exist even if storage had partial data
    return {
      ...DEFAULT_CMS_PAGES,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load CMS pages from storage:', err);
    return DEFAULT_CMS_PAGES;
  }
}

export function saveStoredCmsPages(pages: Record<string, CmsPage>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    notifyUpdate();
  } catch (err) {
    console.error('Failed to save CMS pages to storage:', err);
  }
}

export function updateCmsPage(slug: string, updates: Partial<CmsPage>): CmsPage {
  const pages = getStoredCmsPages();
  const current = pages[slug] || DEFAULT_CMS_PAGES[slug];
  const updatedPage: CmsPage = {
    ...current,
    ...updates,
    slug,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  };
  pages[slug] = updatedPage;
  saveStoredCmsPages(pages);
  return updatedPage;
}

export function resetCmsPage(slug: string): CmsPage {
  const pages = getStoredCmsPages();
  const defaultPage = DEFAULT_CMS_PAGES[slug];
  if (defaultPage) {
    pages[slug] = { ...defaultPage };
    saveStoredCmsPages(pages);
    return defaultPage;
  }
  return pages[slug];
}

export function resetAllCmsPages(): Record<string, CmsPage> {
  saveStoredCmsPages(DEFAULT_CMS_PAGES);
  return DEFAULT_CMS_PAGES;
}

/**
 * React hook to read and write CMS pages reactively
 */
export function useCmsPages() {
  const [pages, setPages] = useState<Record<string, CmsPage>>(() => getStoredCmsPages());

  const reload = useCallback(() => {
    setPages(getStoredCmsPages());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => reload();
    window.addEventListener(EVENT_NAME, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(EVENT_NAME, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [reload]);

  const handleUpdatePage = useCallback((slug: string, updates: Partial<CmsPage>) => {
    const res = updateCmsPage(slug, updates);
    setPages(getStoredCmsPages());
    return res;
  }, []);

  const handleResetPage = useCallback((slug: string) => {
    const res = resetCmsPage(slug);
    setPages(getStoredCmsPages());
    return res;
  }, []);

  const handleResetAll = useCallback(() => {
    const res = resetAllCmsPages();
    setPages(res);
    return res;
  }, []);

  return {
    pages,
    updatePage: handleUpdatePage,
    resetPage: handleResetPage,
    resetAllPages: handleResetAll,
    reload,
  };
}

/**
 * React hook to subscribe to a single CMS page
 */
export function useCmsPage(slug: string): CmsPage {
  const { pages } = useCmsPages();
  return pages[slug] || DEFAULT_CMS_PAGES[slug] || {
    slug,
    title: slug.toUpperCase(),
    subtitle: '',
    lastUpdated: '',
    isActive: true,
    sections: [],
  };
}
