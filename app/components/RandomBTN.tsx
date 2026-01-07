import Link from "next/link";

type randomProps = {
  r1: string;
  r2: string;
};

export default function RandomBTN({ r1, r2 }: randomProps) {
  return (
    <div className=" w-fit mx-auto bg-slate-600 text-white p-3 rounded-md">
      <Link href={`/compare/${r1}/${r2}`}>Randomize</Link>
    </div>
  );
}
