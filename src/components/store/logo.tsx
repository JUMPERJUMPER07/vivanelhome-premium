import Link from "next/link";
import clsx from "clsx";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={clsx(
        "group relative flex items-center gap-2 transition-all active:scale-95",
        compact ? "text-xl" : "text-2xl md:text-3xl",
      )}
      aria-label="VivanelHOME"
    >
      <div className="flex items-center justify-center py-1">
        <img 
          src="/logo.png" 
          alt="VivanelHOME" 
          className={clsx(
            "object-contain w-auto transition-all duration-300",
            compact ? "max-h-12 md:max-h-16 shadow-xl" : "max-h-28 md:max-h-48 lg:max-h-60 xl:max-h-72 drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]"
          )}
        />
      </div>
      
      {/* Luz sutil de fundo ao passar o mouse */}
      <div className="absolute -inset-2 bg-[var(--brand-primary)]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
