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
  onSubmit: (name: string, email: string, pass: string, phone?: string) => void;
  error?: string;
  isLoading?: boolean;
}

export default function SignupScreen({ onBackClick, onSubmit, error, isLoading = false }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password Validation states
  const [valLength, setValLength] = useState(false);
  const [valUpper, setValUpper] = useState(false);
  const [valLower, setValLower] = useState(false);
  const [valDigit, setValDigit] = useState(false);
  const [valSpecial, setValSpecial] = useState(false);

  useEffect(() => {
    setValLength(password.length >= 12);
    setValUpper(/[A-Z]/.test(password));
    setValLower(/[a-z]/.test(password));
    setValDigit(/[0-9]/.test(password));
    setValSpecial(/[^A-Za-z0-9]/.test(password));
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password, phone || undefined);
  };

  const isFormValid = valLength && valUpper && valLower && valDigit && valSpecial && name.trim() && email.trim();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: COLORS.background, fontFamily: FONTS.main, color: COLORS.text }}
    >
      {/* Decorative blobs */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 top-10 left-10 pointer-events-none bg-pink-300/20"
      />
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 bottom-10 right-10 pointer-events-none bg-pink-400/20"
      />

      <div 
        className="w-full max-w-2xl p-6 sm:p-10 rounded-[28px] sm:rounded-[36px] shadow-[0_24px_60px_rgba(0,0,0,0.06)] border border-gray-100/80 relative z-10 bg-white my-10"
      >
        <div className="mb-8 text-center">
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
            Create Account
          </h2>
          <p className="font-medium opacity-50">Join sensai and start shopping</p>
        </div>

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
          
          {/* Row 1: Full Name and Email Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Full Name"
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />

            <Input 
              label="Email Address"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Row 2: Phone Number and Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Phone Number (Optional)"
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
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
                  className="hover:text-pink-500 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />
          </div>

          {/* Password Validation Guidance Grid */}
          <div className="bg-gray-50/40 p-5 rounded-2xl border border-gray-100/80 text-xs space-y-2 text-left">
            <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5">Password must include:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${valLength ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={valLength ? 'text-emerald-700 font-bold text-[11px]' : 'text-gray-400 text-[11px] font-semibold'}>At least 12 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${valUpper ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={valUpper ? 'text-emerald-700 font-bold text-[11px]' : 'text-gray-400 text-[11px] font-semibold'}>One uppercase letter (A-Z)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${valLower ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={valLower ? 'text-emerald-700 font-bold text-[11px]' : 'text-gray-400 text-[11px] font-semibold'}>One lowercase letter (a-z)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${valDigit ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={valDigit ? 'text-emerald-700 font-bold text-[11px]' : 'text-gray-400 text-[11px] font-semibold'}>One numeric digit (0-9)</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${valSpecial ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={valSpecial ? 'text-emerald-700 font-bold text-[11px]' : 'text-gray-400 text-[11px] font-semibold'}>One special character (!@#$%^&*)</span>
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            fullWidth
            size="lg"
            disabled={!isFormValid || isLoading}
            className="rounded-2xl font-black uppercase tracking-wider text-xs bg-pink-500 hover:bg-pink-400 border border-pink-400/50 py-4 shadow-[0_4px_12px_rgba(236,72,153,0.2)] hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all duration-300 active:scale-[0.98] cursor-pointer !bg-pink-500 text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm font-medium" style={{ color: COLORS.textLight }}>
          Already have an account?{' '}
          <button 
            onClick={onBackClick}
            className="font-bold hover:text-pink-500 transition-colors focus:outline-none cursor-pointer" 
            style={{ color: COLORS.primary }}
          >
            Sign In
          </button>
        </p>
      </div>

      {/* Back to login floating button */}
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
        Login
      </button>
    </div>
  );
}
