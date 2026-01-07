"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import useStore from "../stores/pokemonStore";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Swords,
  Flame,
  Home,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Crown,
  Zap,
  Layers,
} from "lucide-react";

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
  const { searchQuery, setSearchQuery, clearSelectedPokemons } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (browseRef.current && !browseRef.current.contains(event.target as Node)) {
        setBrowseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value && pathname !== "/") {
      router.push("/");
    }
  };

  const isActive = (path: string) => pathname === path;
  const isBrowseActive = CATEGORY_LINKS.some((link) => pathname.startsWith(link.href));

  return (
    <nav className="fixed z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--electric)/0.5)] to-transparent" />

      {/* Main nav bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 max-w-7xl mx-auto">
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

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[hsl(var(--electric))] transition-colors" />
            <Input
              type="text"
              id="search"
              placeholder="Search fighters..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 bg-secondary/50 border-border/50 focus:border-[hsl(var(--electric)/0.5)] focus:ring-1 focus:ring-[hsl(var(--electric)/0.2)] placeholder:text-muted-foreground/60 rounded-xl"
            />
          </div>
        </div>

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

          {/* Browse Dropdown */}
          <div ref={browseRef} className="relative">
            <button
              onClick={() => setBrowseOpen(!browseOpen)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isBrowseActive
                  ? "bg-[hsl(var(--grass)/0.15)] text-[hsl(var(--grass))]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              Browse
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${browseOpen ? "rotate-180" : ""}`}
              />
            </button>

            {browseOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl py-2 z-50">
                {CATEGORY_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isLinkActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setBrowseOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                        isLinkActive
                          ? "bg-[hsl(var(--electric)/0.1)] text-[hsl(var(--electric))]"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{link.label}</div>
                        <div className="text-xs text-muted-foreground">{link.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

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
          <Link
            href="/popular"
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isActive("/popular")
                ? "bg-[hsl(var(--plasma)/0.15)] text-[hsl(var(--plasma))]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Flame className="w-4 h-4" />
            Popular
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
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search fighters..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 bg-secondary/50 border-border/50 rounded-xl"
            />
          </div>

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

            {/* Browse Section */}
            <div className="py-2 px-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Browse
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 px-2">
              {CATEGORY_LINKS.map((link) => {
                const Icon = link.icon;
                const isLinkActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2.5 px-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isLinkActive
                        ? "bg-[hsl(var(--electric)/0.15)] text-[hsl(var(--electric))]"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </div>

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
            <Link
              href="/popular"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
                isActive("/popular")
                  ? "bg-[hsl(var(--plasma)/0.15)] text-[hsl(var(--plasma))]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Flame className="w-5 h-5" />
              Popular
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
