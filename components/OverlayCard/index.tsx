interface OverlayCardProps {
  title: string;
  subtitle: string;
}

export default function OverlayCard({ title, subtitle }: OverlayCardProps) {
  return (
    <div className="material-glass fixed bottom-24 left-6 top-auto z-10 md:bottom-auto md:left-8 md:top-32 rounded-xl overflow-hidden p-6 w-80 select-none pointer-events-none">
      <h1 className="text-2xl font-bold dark:text-white">{title}</h1>
      <p className="text-sm dark:text-silver">{subtitle}</p>
    </div>
  );
}
