"use client";

import Link from "next/link";
import useStore from "../stores/pokemonStore";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Swords, Flame, Home, Menu, X, Sparkles, Crown, Zap, Layers } from "lucide-react";

type NavigationProps = {
  randomR1: string;
  randomR2: string;
};

// Category links for the browse dropdown
const CATEGORY_LINKS = [
  { href: "/types", label: "Types", icon: Sparkles, description: "18 elemental types" },
  { href: "/generations", label: "Generations", icon: Layers, description: "Gen I - IX" },
  { href: "/roles", label: "Roles", icon: Zap, description: "Battle roles" },
  { href: "/rarity", label: "Rarity", icon: Crown, description: "Common to Mythical" },
];

export default function Navigation({ randomR1, randomR2 }: NavigationProps) {
  const { clearSelectedPokemons } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--electric)/0.5)] to-transparent" />

      {/* Main nav bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 max-w-95rem mx-auto">
        {/* Logo */}
        <Link href="/" onClick={() => clearSelectedPokemons()} className="flex-shrink-0 group">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--fire))] flex items-center justify-center shadow-lg shadow-[hsl(var(--electric)/0.3)] group-hover:shadow-[hsl(var(--electric)/0.5)] transition-shadow">
                <Swords className="w-5 h-5 text-background" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-bold tracking-wider text-muted-foreground">POKE</span>
              <span className="text-lg font-black tracking-tight gradient-text">FIGHT</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            onClick={() => clearSelectedPokemons()}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isActive("/")
                ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          {CATEGORY_LINKS.map((link) => {
            const Icon = link.icon;
            const isLinkActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isLinkActive
                    ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          <Link
            href={`/compare/${randomR1}/${randomR2}`}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              pathname.startsWith("/compare")
                ? "bg-[hsl(var(--fire)/0.15)] text-[hsl(var(--fire))]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Swords className="w-4 h-4" />
            Battle
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors text-foreground"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen ? "max-h-[500px] border-t border-border/50" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 space-y-4 bg-background/95 backdrop-blur-xl">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => {
                clearSelectedPokemons();
                setMobileMenuOpen(false);
              }}
              className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
                isActive("/")
                  ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>

            {CATEGORY_LINKS.map((link) => {
              const Icon = link.icon;
              const isLinkActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
                    isLinkActive
                      ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-border/30" />

            <Link
              href={`/compare/${randomR1}/${randomR2}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
                pathname.startsWith("/compare")
                  ? "bg-[hsl(var(--fire)/0.15)] text-[hsl(var(--fire))]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Swords className="w-5 h-5" />
              Battle
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
