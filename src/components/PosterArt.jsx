import { Clapperboard, Star } from "lucide-react";

const Card = ({ className = "", tone }) => (
  <div
    className={`absolute aspect-[2/3] w-[34%] overflow-hidden rounded-2xl border border-white/20 shadow-2xl ${className}`}
    style={{ background: tone }}
  >
    <div className="absolute inset-x-0 bottom-0 space-y-1.5 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
      <div className="h-2 w-3/4 rounded-full bg-white/80" />
      <div className="h-1.5 w-1/2 rounded-full bg-white/50" />
    </div>
    <Clapperboard className="absolute left-3 top-3 h-5 w-5 text-white/70" />
  </div>
);

/** A fan of poster-shaped cards for the sign-in screens. Purely decorative. */
export default function PosterArt({ className = "" }) {
  return (
    <div className={`grid-panel relative aspect-[5/4] overflow-hidden rounded-[28px] border border-line ${className}`} aria-hidden="true">
      <Card className="left-[8%] top-[18%] -rotate-[9deg]" tone="linear-gradient(160deg,#c8283a,#5b0f1a)" />
      <Card className="float-b left-[33%] top-[8%] z-10" tone="linear-gradient(160deg,#f5a524,#b23b14)" />
      <Card className="left-[58%] top-[20%] rotate-[8deg]" tone="linear-gradient(160deg,#3a4a8c,#141a3f)" />
      <div className="float-a absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold text-ink shadow-lg ring-1 ring-line">
        <Star className="h-3.5 w-3.5 fill-[var(--gold)] text-gold" /> Your next favorite
      </div>
    </div>
  );
}
