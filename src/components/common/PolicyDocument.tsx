import { Mail, Phone } from 'lucide-react';
import type { CmsPage } from '../../utils/cmsStorage';
import './PolicyDocument.css';

function textLine(line: string) {
  const label = line.match(/^([^:]{1,65}:)(.*)$/);
  return label ? <><strong>{label[1]}</strong>{label[2]}</> : line;
}

export function PolicyContent({ content }: { content: string }) {
  return content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => {
    const lines = paragraph.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.every(line => /^[-*•]\s/.test(line))) {
      return <ul key={index}>{lines.map((line, i) => <li key={i}>{textLine(line.replace(/^[-*•]\s+/, ''))}</li>)}</ul>;
    }
    if (lines.every(line => /^\d+\.\s/.test(line))) {
      return <ol key={index}>{lines.map((line, i) => <li key={i}>{textLine(line.replace(/^\d+\.\s+/, ''))}</li>)}</ol>;
    }
    return <div className="policy-document__paragraph" key={index}>{lines.map((line, i) => <p key={i}>{textLine(line)}</p>)}</div>;
  });
}

export default function PolicyDocument({ page }: { page: CmsPage }) {
  const isDeletion = page.slug === 'account-deletion-request';
  const isPayment = page.slug === 'payment';
  return <article className={`policy-document${isPayment ? ' payment-document' : ''}`}>
    <header className="policy-document__header">
      {page.badge && <p className="policy-document__badge">{page.badge}</p>}
      <h1>{page.title}</h1>
      {isPayment && page.subtitle && <p className="payment-document__subtitle">{page.subtitle}</p>}
    </header>
    <div className="policy-document__body">
      {!isPayment && page.lastUpdated && <p className="policy-document__updated"><strong>Last Updated:</strong> {page.lastUpdated}</p>}
      {!isPayment && page.subtitle && <p className="policy-document__intro">{page.subtitle}</p>}
      {page.sections.map(section => <section key={section.id} className="policy-document__section">
        {section.heading && <h2>{section.heading}</h2>}
        <PolicyContent content={section.content} />
      </section>)}
      {(page.contactEmail || page.contactPhone) && <footer className="policy-document__contact">
        <h2>{isDeletion ? 'Send Your Deletion Request' : 'Contact Our Support Team'}</h2>
        {page.contactEmail && <a className={isDeletion ? 'policy-document__request' : ''}
          href={`mailto:${page.contactEmail}${isDeletion ? '?subject=Account%20Deletion%20Request' : ''}`}>
          <Mail size={18} aria-hidden="true" />{isDeletion ? 'Request Account Deletion' : page.contactEmail}
        </a>}
        {isDeletion && page.contactEmail && <p>{page.contactEmail}</p>}
        {page.contactPhone && <a href={`tel:${page.contactPhone.replace(/[^+\d]/g, '')}`}><Phone size={17} aria-hidden="true" />{page.contactPhone}</a>}
      </footer>}
    </div>
  </article>;
}
