import { COLORS } from '../../constant/style';

export default function Loader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  
  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeMap[size]} border-4 border-t-transparent rounded-full animate-spin`}
        style={{ borderColor: `${COLORS.primaryLight} transparent ${COLORS.primary} transparent` }}
      />
    </div>
  );
}
