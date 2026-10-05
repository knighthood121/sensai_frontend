import { useState, useEffect } from 'react';
import { COLORS, FONTS } from '../../../constant/style';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

import logo from '../../../assets/logo.png';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

interface Props {
  onBackClick: () => void;
  onSignupClick: () => void;
  onSubmit: (email: string, pass: string) => void;
  onGoogleSubmit: (credential: string) => void;
  error?: string;
  message?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginScreen({ onBackClick, onSignupClick, onSubmit, onGoogleSubmit, error, message }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Dynamic injection of Google Sign-in Client SDK Script
    const id = 'google-gsi-client';
    let script = document.getElementById(id) as HTMLScriptElement;

    const initializeGoogleBtn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '548168675094-420loaq086ai63elo364plrq1cf0e4js.apps.googleusercontent.com',
          callback: (response: any) => {
            if (response.credential) {
              onGoogleSubmit(response.credential);
            }
          },
        });

        const btnContainer = document.getElementById('google-signin-btn');
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: btnContainer.offsetWidth || 350,
          });
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleBtn;
      document.body.appendChild(script);
    } else {
      initializeGoogleBtn();
    }
  }, [onGoogleSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: COLORS.background, fontFamily: FONTS.main, color: COLORS.text }}
    >
      {/* Decorative blobs */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 top-10 left-10 pointer-events-none"
        style={{ backgroundColor: COLORS.primaryLight }}
      />
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 bottom-10 right-10 pointer-events-none"
        style={{ backgroundColor: COLORS.primary }}
      />

      <div 
        className="w-full max-w-md p-6 sm:p-10 rounded-[24px] sm:rounded-[40px] shadow-2xl relative z-10 bg-white border"
        style={{ borderColor: COLORS.border }}
      >
        <div className="mb-10 text-center">
          <img 
            src={logo} 
            alt="sensai" 
            className="h-20 w-auto mx-auto mb-5 cursor-pointer hover:opacity-85 transition-opacity object-contain"
            onClick={onBackClick}
          />
          <h2 
            className="text-4xl font-black mb-3 tracking-tighter"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            Welcome Back
          </h2>
          <p className="font-medium opacity-50">Log in to your sensai account</p>
        </div>

        {message && (
          <div
            className="mb-6 px-4 py-3 rounded-2xl text-sm font-semibold text-center"
            style={{
              backgroundColor: COLORS.primary + '10',
              color: COLORS.primary,
              border: `1px solid ${COLORS.primary}30`,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-2xl text-sm font-semibold text-center"
            style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address"
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Input 
            label="Password"
            type={showPassword ? "text" : "password"} 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            rightElement={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-pink-500 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-2" style={{ accentColor: COLORS.primary }} />
              <span className="text-gray-400 group-hover:text-pink-500 transition-colors">Remember me</span>
            </label>
            <a href="#" className="hover:text-pink-500 transition-colors" style={{ color: COLORS.primary }}>
              Forgot?
            </a>
          </div>

          <Button 
            type="submit"
            fullWidth
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <span className="w-1/5 border-b" style={{ borderColor: COLORS.border }} />
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider text-center flex-1">Or continue with</span>
          <span className="w-1/5 border-b" style={{ borderColor: COLORS.border }} />
        </div>

        <div className="flex justify-center w-full min-h-[46px] rounded-full overflow-hidden">
          <div id="google-signin-btn" className="w-full flex justify-center" />
        </div>

        <p className="mt-10 text-center text-sm font-medium" style={{ color: COLORS.textLight }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSignupClick}
            className="font-bold hover:text-pink-500 transition-colors focus:outline-none cursor-pointer"
            style={{ color: COLORS.primary }}
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Back to home floating button */}
      <button
        onClick={onBackClick}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 inline-flex items-center gap-1.5 px-4 py-2 border border-gray-150 bg-white/90 backdrop-blur-md hover:border-pink-200 hover:text-pink-500 hover:shadow-md rounded-full shadow-sm text-gray-500 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest group cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Home
      </button>
    </div>
  );
}
