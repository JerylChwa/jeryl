interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent dark:bg-accent/20">
      {children}
    </span>
  );
}
