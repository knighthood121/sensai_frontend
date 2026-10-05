import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { COLORS, FONTS } from '../../constant/style';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, rightElement, className = '', style, ...props }, ref) => {
  return (
    <div className={`w-full ${className}`} style={{ fontFamily: FONTS.main }}>
      {label && (
        <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          ref={ref}
          className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none ${rightElement ? 'pr-12' : ''}`}
          style={{
            borderColor: error ? '#FF4D4D' : COLORS.border,
            backgroundColor: '#FFFFFF',
            ...style
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = COLORS.primary;
            e.target.style.boxShadow = `0 10px 20px -10px ${COLORS.primaryLight}44`;
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = COLORS.border;
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        {rightElement ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
            {rightElement}
          </div>
        ) : error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
            ⚠️
          </div>
        )}
      </div>
      {error && <p className="text-[#FF4D4D] text-xs font-bold mt-2 px-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
