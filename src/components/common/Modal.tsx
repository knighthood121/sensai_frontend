import type { ReactNode } from 'react';
import { COLORS, FONTS } from '../../constant/style';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{ backgroundColor: COLORS.background, fontFamily: FONTS.main }}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-xl font-bold" style={{ color: COLORS.text }}>{title}</h3>}
          <button onClick={onClose} className="text-2xl leading-none opacity-50 hover:opacity-100">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
