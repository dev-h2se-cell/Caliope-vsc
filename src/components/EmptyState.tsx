interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-secondary/50 rounded-lg">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-primary/80 mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
