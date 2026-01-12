module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/types",
        "http://localhost:3000/generations",
      ],
      numberOfRuns: 3,
    },
    assert: {
      // Focus on main category scores only
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        // Disable problematic insight audits that return NaN
        "bf-cache": "off",
        "cls-culprits-insight": "off",
        "document-latency-insight": "off",
        "duplicated-javascript-insight": "off",
        "font-display-insight": "off",
        "forced-reflow-insight": "off",
        "image-delivery-insight": "off",
        "interaction-to-next-paint-insight": "off",
        "lcp-discovery-insight": "off",
        "lcp-lazy-loaded": "off",
        "lcp-phases-insight": "off",
        "legacy-javascript-insight": "off",
        "modern-http-insight": "off",
        "network-dependency-tree-insight": "off",
        "non-composited-animations": "off",
        "prioritize-lcp-image": "off",
        "third-parties-insight": "off",
        "viewport-insight": "off",
        "dom-size-insight": "off",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
