import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FONTS } from '../../constant/style';
import { useToast } from '../common/Toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }
    showToast('Thank you for registering with Stay Connected!');
    setEmail('');
  };

  return (
    <footer
      className="bg-[#464646] text-white"
      style={{ fontFamily: FONTS.main }}
    >
      <div className="mx-auto max-w-[1500px] px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Tools */}
          <div>
            <h3 className="text-base font-normal tracking-wide text-white">
              Tools
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-gray-200">
              <li>
                <Link to="/#shop" className="transition-colors hover:text-white">
                  Innovations
                </Link>
              </li>
              <li>
                <Link to="/#shop" className="transition-colors hover:text-white">
                  Online catalog
                </Link>
              </li>
              <li>
                <Link to="/bulk-inquiry" className="transition-colors hover:text-white">
                  Walter GPS
                </Link>
              </li>
              <li>
                <Link to="/bulk-inquiry" className="transition-colors hover:text-white">
                  Walter Xpress
                </Link>
              </li>
              <li>
                <Link to="/bulk-inquiry" className="transition-colors hover:text-white">
                  Special solutions
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition-colors hover:text-white">
                  Manage orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-base font-normal tracking-wide text-white">
              Services
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-gray-200">
              <li>
                <Link to="/about" className="transition-colors hover:text-white">
                  Digital solutions
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-white">
                  Tool management
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-base font-normal tracking-wide text-white">
              Company
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-gray-200">
              <li>
                <Link to="/bulk-inquiry" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/bulk-inquiry" className="transition-colors hover:text-white">
                  Find a Distributor
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-white">
                  Career
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="transition-colors hover:text-white">
                  Whistleblowing (Speak Up)
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-white">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-white">
                  About Us & Legal Notice
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => showToast('Cookie settings updated.')}
                  className="text-left text-sm text-gray-200 transition-colors hover:text-white"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay connected */}
          <div>
            <h3 className="text-base font-normal tracking-wide text-white">
              Stay connected
            </h3>

            {/* Newsletter input + Register button */}
            <form onSubmit={handleRegister} className="mt-6 flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                aria-label="E-mail"
                className="h-[34px] w-full max-w-[210px] rounded-none border-0 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="h-[34px] shrink-0 rounded-none bg-[#4c7e2d] px-5 text-sm font-medium text-white transition-colors hover:bg-[#437027]"
              >
                Register
              </button>
            </form>

            {/* Social Icons row */}
            <div className="mt-7 flex items-center gap-5 text-white">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1GvtrJYf6n/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="transition-opacity hover:opacity-80"
              >
                <svg className="h-[21px] w-[21px] fill-white" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@sansei.solutions"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="transition-opacity hover:opacity-80"
              >
                <svg className="h-[20px] w-[24px] fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="transition-opacity hover:opacity-80"
              >
                <svg className="h-[20px] w-[20px] fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Xing */}
              <a
                href="https://x.com/SenseiSolu6ew"
                target="_blank"
                rel="noreferrer"
                aria-label="Xing"
                className="transition-opacity hover:opacity-80"
              >
                <svg className="h-[20px] w-[20px] fill-white" viewBox="0 0 24 24">
                  <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536l-4.879-8.916c-.004-.006-.004-.016 0-.022L22.139.756c.095-.191.097-.387.006-.535C22.056.078 21.894 0 21.686 0h-3.498zM3.648 4.74c-.211 0-.385.074-.473.216-.09.149-.078.339.02.531l2.34 4.05c.004.01.004.016 0 .021L1.86 16.013c-.099.188-.093.381-.004.525.088.147.249.223.461.223h3.458c.521 0 .753-.324.939-.661l3.707-6.52-2.327-4.2c-.174-.308-.443-.64-.963-.64H3.648z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/sansei_solutions?utm_source=qr&obrf=bzRzc2xremJvZzMx"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-80"
              >
                <svg className="h-[21px] w-[21px] fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
