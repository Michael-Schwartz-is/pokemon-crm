import Link from "next/link";

type randomProps = {
  r1: string;
  r2: string;
};

export default function RandomBTN({ r1, r2 }: randomProps) {
  return (
    <div className="w-fit mx-auto">
      <Link 
        href={`/compare/${r1}/${r2}`}
        className="inline-block bg-slate-600 hover:bg-slate-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors"
      >
        🎲 Randomize
      </Link>
    </div>
  );
}
