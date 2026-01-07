"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import useStore from "../stores/pokemonStore";
import { useState } from "react";

type NavigationProps = {
  randomR1: string;
  randomR2: string;
};

export default function Navigation({ randomR1, randomR2 }: NavigationProps) {
  const { searchQuery, setSearchQuery, clearSelectedPokemons } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed z-50 w-full bg-slate-100 border-b border-slate-200">
      {/* Main nav bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link href="/" onClick={() => clearSelectedPokemons()} className="flex-shrink-0">
          <div className="flex flex-col font-black gap-0 leading-4 text-slate-800">
            <span>POKE</span>
            <span>FIGHT</span>
          </div>
        </Link>

        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <Input
            type="text"
            id="search"
            placeholder="Find any pokemon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link 
            href="/" 
            onClick={() => clearSelectedPokemons()}
            className="text-slate-700 hover:text-red-500 font-medium transition-colors"
          >
            Home
          </Link>
          <Link 
            href={`/compare/${randomR1}/${randomR2}`}
            className="text-slate-700 hover:text-red-500 font-medium transition-colors"
          >
            Compare
          </Link>
          <Link 
            href="/popular"
            className="text-slate-700 hover:text-red-500 font-medium transition-colors"
          >
            Popular
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-200 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-64 border-t border-slate-200" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 space-y-3 bg-slate-50">
          {/* Mobile Search */}
          <Input
            type="text"
            placeholder="Find any pokemon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-2 pt-2">
            <Link 
              href="/" 
              onClick={() => {
                clearSelectedPokemons();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-200 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href={`/compare/${randomR1}/${randomR2}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-200 font-medium transition-colors"
            >
              Compare
            </Link>
            <Link 
              href="/popular"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-200 font-medium transition-colors"
            >
              Popular
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
