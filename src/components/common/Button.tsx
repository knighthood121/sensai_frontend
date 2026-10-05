import type { ButtonHTMLAttributes } from 'react';
import { COLORS, FONTS } from '../../constant/style';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  style,
  ...props 
}: ButtonProps) {
  const hasCustomPaddingX = className.includes('px-') || className.includes('p-') || className.includes('px-[');
  const hasCustomPaddingY = className.includes('py-') || className.includes('p-') || className.includes('py-[');
  const hasCustomFontSize = className.includes('text-') || className.includes('text-[');
  const hasCustomBorderRadius = className.includes('rounded-') || className.includes('rounded[');

  let baseStyle: React.CSSProperties = {
    fontFamily: FONTS.main,
    fontWeight: 500,
    ...(hasCustomBorderRadius ? {} : { borderRadius: '10px' }),
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    ...style
  };

  if (variant === 'primary') {
    baseStyle = { ...baseStyle, backgroundColor: COLORS.primary, color: '#FFFFFF', border: 'none' };
  } else if (variant === 'secondary') {
    baseStyle = { ...baseStyle, backgroundColor: COLORS.primaryLight + '33', color: COLORS.primaryDark, border: 'none' };
  } else if (variant === 'outline') {
    baseStyle = { ...baseStyle, backgroundColor: 'transparent', border: `1.5px solid ${COLORS.primary}`, color: COLORS.primary };
  } else if (variant === 'ghost') {
    baseStyle = { ...baseStyle, backgroundColor: 'transparent', color: COLORS.textLight, border: 'none' };
  }

  const pxClass = hasCustomPaddingX ? '' : (size === 'sm' ? 'px-5' : size === 'lg' ? 'px-10' : 'px-7');
  const pyClass = hasCustomPaddingY ? '' : (size === 'sm' ? 'py-2' : size === 'lg' ? 'py-4' : 'py-3');
  const textClass = hasCustomFontSize ? '' : (size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base');
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`hover:opacity-90 active:scale-95 ${pxClass} ${pyClass} ${textClass} ${widthClass} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
}
