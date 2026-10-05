import { FONTS } from '../../constant/style';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div 
      className="p-4 rounded-xl flex items-start gap-3 border"
      style={{ 
        backgroundColor: '#FEF2F2', 
        borderColor: '#FECACA',
        color: '#B91C1C',
        fontFamily: FONTS.main 
      }}
    >
      <span className="text-xl leading-none mt-0.5">⚠️</span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
