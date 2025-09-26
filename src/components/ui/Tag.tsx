export type Variant = 'care' | 'habit' | 'study' | 'exercise' | 'etc';

interface TagProps {
  children: React.ReactNode;
  variant: Variant;
  className?: string;
  size?: 'sm' | 'md';
}

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1'
};

const bgStyles: Record<Variant, string> = {
  care: 'bg-tag-care',
  habit: 'bg-tag-habit',
  study: 'bg-tag-study',
  exercise: 'bg-tag-activity',
  etc: 'bg-tag-etc'
};

export default function Tag({
  children,
  variant = 'etc',
  className,
  size = 'md'
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium text-white ${sizeStyles[size]} ${className} ${bgStyles[variant]}`}
      role="status"
      aria-label={`${variant} 태그`}
    >
      {children}
    </span>
  );
}
