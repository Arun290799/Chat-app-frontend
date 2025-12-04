'use client';

interface OnlineStatusProps {
  isOnline: boolean;
  className?: string;
}

export default function OnlineStatus({ isOnline, className = '' }: OnlineStatusProps) {
  if (!isOnline) return null;

  return (
    <span
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500 ${className}`}
      aria-label="Online"
    />
  );
}