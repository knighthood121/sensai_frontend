import { useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCreateContactInquiryMutation } from '../../../service/bulkInquiryApi';
import { apiErrorMessage } from '../../../utils/apiMessage';
import './PrecisionFooter.css';

const locations = [
  // {
  //   city: 'Mumbai',
  //   type: 'Head Office',
  //   lines: ['3rd Floor, Ali Tower,', '88 Gujjar Street,', 'Mumbai - 400003, India'],
  // },
  {
    city: 'Gurugram',
     type: 'Head Office',
    lines: ['Eros Corporate Park,', 'office no. 419, Sector-2,', 'IMT Manesar, Gurugram,', 'Haryana - 122052, India'],
  },
  // { Eros Corporate Park

  //   city: 'Kolhapur',
  //   type: 'Branch Office',
  //   lines: ['Plot No. 578/1,', 'Near Saroj Foundry,', 'Opp. Shiroli MIDC,', 'Kolhapur - 416122, India'],
  // },
] as const;

const sitemap = [
  // ['Sell on IDT', '/join-us'],
  ['About Us', '/about'],
  ['Contact Us', '/bulk-inquiry#inquiry-form'],
  ['Payment', '/payment'],
  ['Privacy Policy', '/privacy'],
  ['Terms and Conditions', '/terms'],
  ['Payment Terms and Conditions', '/payment-terms-and-conditions'],
  ['Cancellation Policy', '/cancellation-policy'],
  ['Returns and Refunds Policy', '/returns-and-refunds-policy'],
  ['Shipping and Delivery Policy', '/shipping-and-delivery-policy'],
  ['Cookie Policy', '/cookie-policy'],
  ['Warranty and Liability Disclaimer', '/warranty-and-liability-disclaimer'],
  ['Account Deletion Request', '/account-deletion-request'],
] as const;

const footerLinkGroups = [
  { heading: 'Company', links: sitemap.slice(0, 6) },
  { heading: 'Policies', links: sitemap.slice(6, 12) },
  { heading: 'Operations', links: [
    ['All products', '/catalog'],
    ['Flat End Mill', '/category/hss-drill-bits'],
    ['Flat Wood Drill Bits', '/category/flat-wood-drill-bits'],
    ['Masonry Drill Bits', '/category/masonry-drill-bits'],
    ['Glass & Tile Drill Bits', '/category/glass-and-tile-drill-bits'],
    ['Hand Taps', '/category/hand-taps'],
  ] },
] as const;

// Demo destinations: replace these URLs with SANSEI's official social profiles.
const socialLinks = [
  { name: 'Instagram', platform: 'instagram', href: 'https://www.instagram.com/sansei_solutions?utm_source=qr&obrf=bzRzc2xremJvZzMx' },
  { name: 'Facebook', platform: 'facebook', href: 'https://www.facebook.com/share/1GvtrJYf6n/' },
  { name: 'LinkedIn', platform: 'linkedin', href: 'http://www.linkedin.com/in/sansei-solutions-783938444' },
  { name: 'YouTube', platform: 'youtube', href: 'https://www.youtube.com/@sansei.solutions' },
  { name: 'X', platform: 'x', href: 'https://x.com/SenseiSolu6ew' },
  // { name: 'WhatsApp', platform: 'whatsapp', href: 'https://www.whatsapp.com/' },
] as const;

function SocialIcon({ platform }: { platform: typeof socialLinks[number]['platform'] }) {
  return <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {platform === 'instagram' && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>}
    {platform === 'facebook' && <path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v8Z" fill="currentColor" stroke="none" />}
    {platform === 'linkedin' && <><circle cx="5.5" cy="5" r="1.7" fill="currentColor" stroke="none" /><path d="M4 9h3v12H4zM11 9h3v1.7c.8-1.2 1.8-2 3.4-2 2.6 0 3.6 1.7 3.6 4.7V21h-3v-7c0-1.8-.6-2.6-1.8-2.6-1.4 0-2.2 1-2.2 2.8V21h-3Z" fill="currentColor" stroke="none" /></>}
    {platform === 'youtube' && <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 6 3-6 3Z" fill="currentColor" stroke="none" /></>}
    {platform === 'x' && <path d="M4 3h4l12 18h-4L4 3Zm16 0L4 21" />}
    {/* {platform === 'whatsapp' && <><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Z" /><path d="M8 7.5c-.6 1-.4 2.8 1.4 4.7s3.8 2.5 4.9 1.8l1.1-1.2-2.2-1.3-.9.8c-1.2-.5-2.1-1.4-2.6-2.6l.7-.9L9 6.7Z" /></>} */}
  </svg>;
}

export default function PrecisionFooter() {
  const emailId = useId();
  const contactPending = useRef(false);
  const [sendContact, { isLoading: sendingContact }] = useCreateContactInquiryMutation();
  const [contactFeedback, setContactFeedback] = useState<{ error: boolean; message: string } | null>(null);
  const startContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get('email') || '').trim();
    if (!email || contactPending.current) return;
    contactPending.current = true;
    setContactFeedback(null);
    try {
      const response = await sendContact({ email }).unwrap();
      if (!response.success) throw new Error(response.message || 'Unable to submit your inquiry.');
      setContactFeedback({ error: false, message: response.message });
      form.reset();
    } catch (error) {
      setContactFeedback({ error: true, message: apiErrorMessage(error, 'We could not submit your inquiry. Please try again.') });
    } finally { contactPending.current = false; }
  };
  return (
    <footer className="precision-footer" id="contact">
      <div className="precision-footer__inner">
        <div className="precision-footer__grid">
          <nav className="precision-footer__sitemap" aria-label="Company, policies and operations">
            {footerLinkGroups.map(({ heading, links }) => (
              <div className="precision-footer__sitemap-column" key={heading}>
                <h2 className="precision-footer__heading">{heading}</h2>
                <ul>
                  {links.map(([label, path]) => <li key={label}><Link to={path}>{label}</Link></li>)}
                </ul>
              </div>
            ))}
          </nav>

          <section className="precision-footer__locations" aria-labelledby="precision-footer-locations">
            <h2 className="precision-footer__heading" id="precision-footer-locations">Our Locations</h2>
            <div className="precision-footer__office-grid">
              {locations.map((location) => (
                <div className="precision-footer__office" key={location.city}>
                  <h3>{location.city}</h3>
                  <p className="precision-footer__office-type">{location.type}</p>
                  <address>
                    <MapPin size={13} aria-hidden="true" />
                    <span>{location.lines.map((line) => <span key={line}>{line}</span>)}</span>
                  </address>
                </div>
              ))}
            </div>
            <div className="precision-footer__contact">
              <h3>Contact Us</h3>
              <div className="precision-footer__contact-links">
                {/* <a href="tel:+91 94676 13669"><Phone size={14} aria-hidden="true" /><span>+91 94676 13669</span></a> */}
                {/* <a href="mailto:Sales@sanseisolutions.in"><Mail size={15} aria-hidden="true" /><span>Sales@sanseisolutions.in</span></a> */}
                {/* <a href="mailto:tech@sanseisolutions.in"><Mail size={15} aria-hidden="true" /><span>tech@sanseisolutions.in</span></a> */}
                <a href="tel:+91 98705 17217"><Phone size={14} aria-hidden="true" /><span>+91 98705 17217</span></a>
              </div>
              <div className="precision-footer__contact-links">
                {/* <a href="tel:+91 94676 13669"><Phone size={14} aria-hidden="true" /><span>+91 94676 13669</span></a> */}
                <a href="mailto:Sales@sanseisolutions.in"><Mail size={15} aria-hidden="true" /><span>Sales@sanseisolutions.in</span></a>
                {/* <a href="mailto:Sales@sanseisolutions.in"><Mail size={15} aria-hidden="true" /><span>Sales@sanseisolutions.in</span></a> */}
                <a href="mailto:tech@sanseisolutions.in"><Mail size={15} aria-hidden="true" /><span>tech@sanseisolutions.in</span></a>
              </div>
            </div>
          </section>

          <section className="precision-footer__connect" aria-labelledby="precision-footer-connect">
            <Link className="precision-footer__brand" to="/" aria-label="SANSEI home">
              <img src="/images/sansei/logo-light.png" alt="SANSEI" width="1183" height="1329" loading="lazy" />
            </Link>
            <h2 id="precision-footer-connect">Let's talk tooling.</h2>
            <p>Find the right tools for your next project. Connect with our team.</p>
            <form className="precision-footer__email-form" onSubmit={startContact} aria-busy={sendingContact}>
              <label htmlFor={emailId}>Your email address</label>
              <div className="precision-footer__email-field">
                <Mail size={17} aria-hidden="true" />
                <input id={emailId} name="email" type="email" autoComplete="email" placeholder="Enter your email" required maxLength={254} disabled={sendingContact} aria-describedby={`${emailId}-hint`} onChange={() => setContactFeedback(null)} />
                <button type="submit" disabled={sendingContact}>{sendingContact ? 'Sending…' : 'Contact us'} <ArrowUpRight size={16} aria-hidden="true" /></button>
              </div>
              <span className="precision-footer__email-hint" id={`${emailId}-hint`}>Send an inquiry and our team will contact you by email.</span>
              {contactFeedback && <p className={`precision-footer__feedback${contactFeedback.error ? ' is-error' : ''}`} role={contactFeedback.error ? 'alert' : 'status'}>{contactFeedback.message}</p>}
            </form>
            <div className="precision-footer__social">
              <span>Connect with us</span>
              <nav className="precision-footer__social-links" aria-label="Social media">
                {socialLinks.map(({ name, platform, href }) => <a key={platform} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}><SocialIcon platform={platform} /></a>)}
              </nav>
            </div>
          </section>
        </div>
        <div className="precision-footer__bottom">
          <p>© {new Date().getFullYear()} SANSEI. All rights reserved.</p>
          <span>Precision. Durability. Reliability.</span>
        </div>
      </div>
    </footer>
  );
}
