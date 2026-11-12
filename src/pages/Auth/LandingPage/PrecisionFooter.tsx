import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetHomeQuery } from '../../../service/homeApi';
import './PrecisionFooter.css';

const locations = [
  {
    city: 'Mumbai',
    type: 'Head Office',
    lines: ['3rd Floor, Ali Tower,', '88 Gujjar Street,', 'Mumbai - 400003, India'],
  },
  {
    city: 'Gurugram',
    type: 'Branch Office',
    lines: ['Eros Corporate Park,', '11th Floor, 1131-B, Sector-2,', 'Manesar, Gurugram,', 'Haryana - 122052, India'],
  },
  {
    city: 'Kolhapur',
    type: 'Branch Office',
    lines: ['Plot No. 578/1,', 'Near Saroj Foundry,', 'Opp. Shiroli MIDC,', 'Kolhapur - 416122, India'],
  },
] as const;

const sitemap = [
  ['Home', '/'],
  ['Products', '/catalog'],
  ['About Us', '/about'],
  ['Contact', '/bulk-inquiry'],
  ['FAQs', '/faqs'],
  ['Login', '/login'],
  ['Cart', '/cart'],
  ['Orders', '/orders'],
  ['Privacy Policy', '/privacy'],
  ['Terms & Conditions', '/terms'],
] as const;

export default function PrecisionFooter() {
  const { data } = useGetHomeQuery();
  const categories = data?.data?.categories ?? [];
  return (
    <footer className="precision-footer" id="contact">
      <div className="precision-footer__inner">
        <div className="precision-footer__grid">
          <nav className="precision-footer__operations" aria-labelledby="precision-footer-operations">
            <h2 className="precision-footer__heading" id="precision-footer-operations">Operations</h2>
            <div className="precision-footer__operation-list">
              <Link to="/catalog" className="precision-footer__all-products">All products</Link>
              {categories.map((category) => category.subcategories.length ? (
                <details className="precision-footer__disclosure" key={category.id}>
                  <summary><span>{category.name}</span><ChevronDown size={13} aria-hidden="true" /></summary>
                  <ul className="precision-footer__sub-links">
                    <li><Link to={`/category/${category.slug}`}>View all {category.name.toLowerCase()}</Link></li>
                    {category.subcategories.map((subcategory) => <li key={subcategory.id}><Link to={`/category/${category.slug}/${subcategory.slug}`}>{subcategory.name}</Link></li>)}
                  </ul>
                </details>
              ) : <Link className="precision-footer__category-link" key={category.id} to={`/category/${category.slug}`}>{category.name}</Link>)}
            </div>
          </nav>

          <nav className="precision-footer__company" aria-labelledby="precision-footer-company">
            <h2 className="precision-footer__heading" id="precision-footer-company">Company</h2>
            <ul className="precision-footer__company-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/bulk-inquiry#inquiry-form">Contact</Link></li>
              <li>
                <details className="precision-footer__disclosure precision-footer__sitemap">
                  <summary><span>Sitemap</span><ChevronDown size={13} aria-hidden="true" /></summary>
                  <ul className="precision-footer__sub-links">
                    {sitemap.map(([label, path]) => <li key={label}><Link to={path}>{label}</Link></li>)}
                  </ul>
                </details>
              </li>
            </ul>
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
                <a href="tel:+917021583452"><Phone size={14} aria-hidden="true" /><span>+91 70215 83452</span></a>
                <a href="mailto:getsolution@carbiforce.com"><Mail size={15} aria-hidden="true" /><span>getsolution@carbiforce.com</span></a>
              </div>
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
