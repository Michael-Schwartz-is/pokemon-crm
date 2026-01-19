"use client";

import { useState } from "react";
import { MoveLearn } from "@/util/CachePokemons";
import { Swords, Zap, Shield, BookOpen, Egg, GraduationCap, Disc } from "lucide-react";
import TypeBadge from "./TypeBadge";

interface MovesTableProps {
  moves: MoveLearn[];
}

type TabType = "level-up" | "machine" | "egg" | "tutor" | "all";

const damageClassIcons: Record<string, React.ReactNode> = {
  physical: <Swords className="w-3.5 h-3.5 text-orange-500" />,
  special: <Zap className="w-3.5 h-3.5 text-purple-500" />,
  status: <Shield className="w-3.5 h-3.5 text-slate-500" />,
};

const damageClassColors: Record<string, string> = {
  physical: "bg-orange-100 text-orange-700 border-orange-200",
  special: "bg-purple-100 text-purple-700 border-purple-200",
  status: "bg-slate-100 text-slate-700 border-slate-200",
};

const tabConfig: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "level-up", label: "Level Up", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "machine", label: "TM/HM", icon: <Disc className="w-4 h-4" /> },
  { id: "egg", label: "Egg", icon: <Egg className="w-4 h-4" /> },
  { id: "tutor", label: "Tutor", icon: <BookOpen className="w-4 h-4" /> },
];

function capitalize(str: string): string {
  return str.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function MovesTable({ moves }: MovesTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("level-up");
  const [expandedMove, setExpandedMove] = useState<string | null>(null);

  // Group moves by learn method
  const movesByMethod: Record<TabType, MoveLearn[]> = {
    "level-up": moves.filter(m => m.learnMethod === "level-up"),
    machine: moves.filter(m => m.learnMethod === "machine"),
    egg: moves.filter(m => m.learnMethod === "egg"),
    tutor: moves.filter(m => m.learnMethod === "tutor"),
    all: moves,
  };

  // Get counts for each tab (excluding 'all' which isn't in tabConfig)
  const tabCounts: Record<Exclude<TabType, "all">, number> = {
    "level-up": movesByMethod["level-up"].length,
    machine: movesByMethod.machine.length,
    egg: movesByMethod.egg.length,
    tutor: movesByMethod.tutor.length,
  };

  // Find first non-empty tab
  const firstNonEmptyTab = tabConfig.find(t => tabCounts[t.id as Exclude<TabType, "all">] > 0)?.id || "level-up";
  
  // Set initial tab if current is empty
  const currentMoves = movesByMethod[activeTab];
  const displayMoves = currentMoves.length > 0 ? currentMoves : movesByMethod[firstNonEmptyTab];
  const effectiveTab = currentMoves.length > 0 ? activeTab : firstNonEmptyTab;

  if (moves.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[hsl(var(--fire)/0.15)]">
            <Swords className="w-4 h-4 text-[hsl(var(--fire))]" />
          </div>
          Moves
        </h3>
        <p className="text-muted-foreground text-sm text-center py-8">
          Move data not available.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-card/30 rounded-2xl border border-border/50">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[hsl(var(--fire)/0.15)]">
          <Swords className="w-4 h-4 text-[hsl(var(--fire))]" />
        </div>
        Moves
        <span className="text-sm font-normal text-muted-foreground">
          ({moves.length} total)
        </span>
      </h3>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 p-1 bg-secondary/30 rounded-xl">
        {tabConfig.map(tab => {
          const count = tabCounts[tab.id as Exclude<TabType, "all">];
          const isActive = effectiveTab === tab.id;
          const isEmpty = count === 0;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isEmpty && setActiveTab(tab.id)}
              disabled={isEmpty}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium
                transition-all duration-200
                ${isActive 
                  ? "bg-card text-foreground shadow-sm" 
                  : isEmpty 
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }
              `}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`
                px-1.5 py-0.5 rounded text-[10px] font-bold
                ${isActive ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))]" : "bg-secondary text-muted-foreground"}
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Moves Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[500px] px-4 sm:px-0">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_70px_50px_50px_50px_80px] gap-2 px-3 py-2 bg-secondary/50 rounded-t-lg text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div>Move</div>
            <div className="text-center">Type</div>
            <div className="text-center">Cat</div>
            <div className="text-center">Pow</div>
            <div className="text-center">Acc</div>
            <div className="text-center">
              {effectiveTab === "level-up" ? "Level" : "PP"}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/30 border border-t-0 border-border/50 rounded-b-lg overflow-hidden">
            {displayMoves.map((move, index) => (
              <div key={`${move.name}-${index}`}>
                <div 
                  className={`
                    grid grid-cols-[1fr_70px_50px_50px_50px_80px] gap-2 px-3 py-2.5 
                    hover:bg-secondary/30 transition-colors cursor-pointer
                    ${expandedMove === move.name ? "bg-secondary/30" : ""}
                  `}
                  onClick={() => setExpandedMove(expandedMove === move.name ? null : move.name)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {capitalize(move.name)}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <TypeBadge type={move.type} size="xs" />
                  </div>
                  <div className="flex justify-center items-center">
                    <span className={`
                      inline-flex items-center justify-center w-7 h-7 rounded-md border
                      ${damageClassColors[move.damageClass]}
                    `} title={capitalize(move.damageClass)}>
                      {damageClassIcons[move.damageClass]}
                    </span>
                  </div>
                  <div className="flex items-center justify-center text-sm">
                    {move.power || "—"}
                  </div>
                  <div className="flex items-center justify-center text-sm">
                    {move.accuracy ? `${move.accuracy}%` : "—"}
                  </div>
                  <div className="flex items-center justify-center text-sm font-medium">
                    {effectiveTab === "level-up" 
                      ? (move.levelLearned || "—") 
                      : move.pp
                    }
                  </div>
                </div>
                
                {/* Expanded Effect Description */}
                {expandedMove === move.name && move.effect && (
                  <div className="px-3 py-2 bg-secondary/20 border-t border-border/20">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {move.effect}
                    </p>
                    <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                      <span>PP: {move.pp}</span>
                      <span>Category: {capitalize(move.damageClass)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {displayMoves.length > 20 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Showing {displayMoves.length} moves. Click a move to see its effect.
        </p>
      )}
    </div>
  );
}
