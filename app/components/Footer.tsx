import Link from "next/link";
import {
  Home,
  Swords,
  Sparkles,
  Layers,
  Zap,
  Crown,
  Heart,
  Twitter,
  Mail,
  ExternalLink,
} from "lucide-react";

const FOOTER_LINKS = {
  main: [
    { href: "/", label: "Home", icon: Home, description: "Browse all Pokemon" },
    { href: "/compare", label: "Compare", icon: Swords, description: "Head-to-head battles" },
    { href: "/popular", label: "Popular", icon: Heart, description: "Most searched Pokemon" },
  ],
  browse: [
    { href: "/types", label: "Types", icon: Sparkles, description: "18 elemental types" },
    { href: "/generations", label: "Generations", icon: Layers, description: "Gen I - IX" },
    { href: "/roles", label: "Roles", icon: Zap, description: "Battle roles & strategies" },
    { href: "/rarity", label: "Rarity", icon: Crown, description: "Common to Mythical" },
  ],
  resources: [
    {
      href: "/sitemap-index.xml",
      label: "Sitemap",
      icon: ExternalLink,
      description: "Site structure",
    },
    {
      href: "/robots.txt",
      label: "Robots.txt",
      icon: ExternalLink,
      description: "Crawler directives",
    },
  ],
};

const SOCIAL_LINKS = [
  {
    href: "https://x.com/MichaSchwa",
    label: "Twitter",
    icon: Twitter,
    description: "Follow for updates",
  },
  {
    href: "mailto:mike@gushon.com?subject=Pokemon%20Arena%20Contact",
    label: "Email",
    icon: Mail,
    description: "Get in touch",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/95 backdrop-blur-xl border-t border-border/50">
      {/* Main Footer Content */}
      <div className="max-w-95rem mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Brand Section */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--fire))] flex items-center justify-center shadow-lg shadow-[hsl(var(--electric)/0.3)]">
                <Swords className="w-5 h-5 text-background" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-wider text-muted-foreground">POKE</span>
                <span className="text-xl font-black tracking-tight gradient-text">ARENA</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Compare Pokemon stats, abilities, and battle potential. Find the strongest Pokemon
              with detailed analysis and head-to-head comparisons.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors group"
                    aria-label={social.description}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Section */}
          <div className="min-w-[48rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Links */}
            <div className="max-w-sm">
              <h2 className="font-semibold text-foreground mb-4">Navigation</h2>
              <ul className="space-y-3">
                {FOOTER_LINKS.main.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--electric))] transition-colors" />
                        <div>
                          <span className="font-medium">{link.label}</span>
                          <span className="block text-xs text-muted-foreground/70">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Browse Categories */}
            <div className="max-w-sm">
              <h2 className="font-semibold text-foreground mb-4">Browse</h2>
              <ul className="space-y-3">
                {FOOTER_LINKS.browse.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--grass))] transition-colors" />
                        <div>
                          <span className="font-medium">{link.label}</span>
                          <span className="block text-xs text-muted-foreground/70">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resources & SEO */}
            <div className="max-w-sm">
              <h2 className="font-semibold text-foreground mb-4">Resources</h2>
              <ul className="space-y-3">
                {FOOTER_LINKS.resources.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--water))] transition-colors" />
                        <div>
                          <span className="font-medium">{link.label}</span>
                          <span className="block text-xs text-muted-foreground/70">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* SEO Stats */}
              <div className="mt-6 pt-4 border-t max-w-40 border-border/30">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Pokemon:</span>
                    <span className="font-mono">1000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comparisons:</span>
                    <span className="font-mono">520K+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Types:</span>
                    <span className="font-mono">18</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="max-w-95rem mx-auto px-4 py-6 md:px-6">
          <div className="flex justify-center items-center">
            <div className="text-sm text-muted-foreground text-center max-w-4xl">
              Made with love ❤️{" "}
              <a
                href="https://gushon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-[hsl(var(--electric))] transition-colors"
              >
                studio gushon
              </a>{" "}
              — putting the Pokemon ⚡ in pSEO. 500K+ pages. Gotta index 'em all 💪.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
