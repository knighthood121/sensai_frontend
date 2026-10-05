import { COLORS } from '../../constant/style';

export default function MobileMenu({ onClick }: { onClick: () => void }) {
  return (
    <button 
      className="md:hidden p-2 rounded-lg flex flex-col gap-1.5 transition-transform hover:scale-105 active:scale-95"
      onClick={onClick}
      style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}` }}
    >
      <div className="w-5 h-0.5 rounded" style={{ backgroundColor: COLORS.text }}></div>
      <div className="w-5 h-0.5 rounded" style={{ backgroundColor: COLORS.text }}></div>
      <div className="w-5 h-0.5 rounded" style={{ backgroundColor: COLORS.text }}></div>
    </button>
  );
}
