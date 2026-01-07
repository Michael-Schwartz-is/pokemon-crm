"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import useStore from "../stores/pokemonStore";

type NavigationProps = {
  randomR1: string;
  randomR2: string;
};

export default function Navigation({ randomR1, randomR2 }: NavigationProps) {
  const { searchQuery, setSearchQuery, clearSelectedPokemons } = useStore();

  return (
    <div
      className="flex fixed z-50 flex-row items-center justify-between w-full p-5 bg-slate-100 border-b border-slate-200"
    >
      <Link href="/" onClick={() => clearSelectedPokemons()}>
        <div className="flex flex-col font-black gap-0 leading-4">
          <span>POKE</span>
          <span>FIGHT</span>
        </div>
      </Link>

      <div className="flex gap-2">
        <div className="flex max-w-sm items-center gap-1.5">
          <Label htmlFor="search">Search</Label>
          <Input
            type="text"
            id="search"
            placeholder="Find any pokemon in the world!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Link href={"/"} onClick={() => clearSelectedPokemons()}>
          Home
        </Link>
        <Link href={`/compare/${randomR1}/${randomR2}`}>Compare</Link>
        <Link href={"/popular"}>Popular</Link>
      </div>
    </div>
  );
}
