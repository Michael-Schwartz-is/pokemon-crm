import Link from "next/link";
import { Dices, Zap } from "lucide-react";

type randomProps = {
  r1: string;
  r2: string;
};

export default function RandomBTN({ r1, r2 }: randomProps) {
  return (
    <div className="w-fit mx-auto">
      <Link
        href={`/compare/${r1}/${r2}`}
        className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl btn-ghost text-sm sm:text-base font-medium"
      >
        <Dices className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span>Random Battle</span>
        <Zap className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-[hsl(var(--electric))]" />
      </Link>
    </div>
  );
}
