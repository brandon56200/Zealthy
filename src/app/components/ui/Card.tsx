interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
} 