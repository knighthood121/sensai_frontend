import type { ReactNode } from 'react';
import { COLORS, FONTS } from '../../constant/style';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-2xl"
      style={{ borderColor: COLORS.border, fontFamily: FONTS.main }}
    >
      <div className="mb-4 text-6xl" style={{ color: COLORS.primaryLight }}>
        {icon || '📦'}
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.text }}>{title}</h3>
      <p className="max-w-sm mb-6" style={{ color: COLORS.textLight }}>{description}</p>
      {action}
    </div>
  );
}
