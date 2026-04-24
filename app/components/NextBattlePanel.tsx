"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/util/CachePokemons";
import { getPokemonImageUrl, getFallbackImageUrl } from "@/util/pokemonImage";
import { Swords, Search, RotateCcw, X } from "lucide-react";
import { track } from "@/lib/analytics";

type PokemonBasic = {
  id: string;
  name: string;
};

interface NextBattlePanelProps {
  winner: Pokemon;
  allPokemon: PokemonBasic[];
  onRematch: () => void;
}

function capitalize(str: string): string {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function PokemonThumb({ name, id, size = 28 }: { name: string; id: string | number; size?: number }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? getFallbackImageUrl() : getPokemonImageUrl(Number(id))}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErr(true)}
      className="object-contain"
    />
  );
}

export default function NextBattlePanel({
  winner,
  allPokemon,
  onRematch,
}: NextBattlePanelProps) {
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus search when picker opens, without scrolling the page (fixes tablet jump)
  useEffect(() => {
    if (pickerOpen && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [pickerOpen]);

  // Only base Pokemon (ids 1–1025) have R2 images — alt-form rows don't.
  const basePokemon = useMemo(
    () => allPokemon.filter((p) => Number(p.id) <= 1025 && p.name !== winner.name),
    [allPokemon, winner.name]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return basePokemon.slice(0, 60);
    return basePokemon.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 60);
  }, [basePokemon, query]);

  const goTo = (opponentName: string, method: "random" | "chosen" = "chosen") => {
    if (!opponentName || opponentName === winner.name) return;
    track(method === "random" ? "next_battle_clicked" : "opponent_chosen", {
      winner: winner.name,
      opponent: opponentName,
      source: "next_battle_panel",
    });
    router.push(`/pokemon/${winner.name}/${opponentName}`, { scroll: false });
  };

  const handleNextBattle = () => {
    if (basePokemon.length === 0) return;
    const pick = basePokemon[Math.floor(Math.random() * basePokemon.length)];
    goTo(pick.name, "random");
  };

  const handleRematch = () => {
    track("rematch_clicked", { winner: winner.name });
    onRematch();
  };

  return (
    <div className="w-full max-w-[340px] mx-auto">
      {!pickerOpen ? (
        <div className="space-y-2">
          <button
            onClick={handleNextBattle}
            className="group w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--fire))] to-[hsl(var(--electric))] text-white font-bold shadow-lg shadow-[hsl(var(--fire)/0.3)] hover:shadow-[hsl(var(--fire)/0.5)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Swords className="w-4 h-4" />
            <span className="text-sm">Next Battle</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRematch}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-card border border-border hover:border-[hsl(var(--electric)/0.5)] text-foreground font-semibold text-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rematch</span>
            </button>

            <button
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-card border border-border hover:border-[hsl(var(--electric)/0.5)] text-foreground font-semibold text-sm transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Choose</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 p-2 border-b border-border/60">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Opponent for ${capitalize(winner.name)}`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
            <button
              onClick={() => {
                setPickerOpen(false);
                setQuery("");
              }}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 px-3">
                No Pokemon matching "{query}"
              </p>
            ) : (
              <ul>
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => goTo(p.name)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-secondary/60 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-secondary/40 rounded-md">
                        <PokemonThumb name={p.name} id={p.id} size={28} />
                      </div>
                      <span className="text-xs font-medium capitalize text-foreground truncate flex-1">
                        {capitalize(p.name)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
