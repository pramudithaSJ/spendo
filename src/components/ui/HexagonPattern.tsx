'use client';

interface HexagonPatternProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}

export default function HexagonPattern({
  children,
  className = '',
  intensity = 'light'
}: HexagonPatternProps) {
  const intensityMap = {
    light: 'hexagon-bg',
    medium: 'hexagon-bg-medium',
    strong: 'hexagon-bg-strong'
  };

  return (
    <div className={`${intensityMap[intensity]} ${className}`}>
      {children}
    </div>
  );
}
