import { COLORS, FONTS } from '../../constant/style';

export default function AnnouncementBar({ text }: { text: string }) {
  return (
    <div 
      className="w-full text-center py-2 text-sm font-medium tracking-wide shadow-sm"
      style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primaryDark, fontFamily: FONTS.main }}
    >
      {text}
    </div>
  );
}
