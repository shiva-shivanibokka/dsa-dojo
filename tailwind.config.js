/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neo-brutalist LIGHT palette — cream paper, ink-black lines.
        paper: '#FBF6EA', // page canvas (warm cream)
        card: '#FFFDF7', // slightly brighter card surface
        ink: '#141210', // near-black text / borders
        muted: '#5A554C', // secondary text
        faint: '#8A8477', // tertiary text
        band: '#141210', // black stat band
        // Loud accents (each pairs with a black border + hard shadow)
        coral: '#FF5C5C',
        grape: '#C7B4FF',
        grapeInk: '#5B3FD1',
        lime: '#8CE35B',
        limeInk: '#2E7D14',
        sky: '#7FD1FF',
        gold: '#FFD24D',
        // NB: difficulty colours (easy/medium/hard) live in src/lib/patterns.ts and
        // are applied via inline styles — deliberately NOT Tailwind colours, since a
        // `colors.hard` would generate a `shadow-hard` colour utility that collides
        // with (and overrides) our `boxShadow.hard`, tinting every hard shadow red.
      },
      fontFamily: {
        black: ['"Archivo Black"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Hard offset shadows — the signature neo-brutalist look (no blur).
        hard: '4px 4px 0 0 #141210',
        hardlg: '6px 6px 0 0 #141210',
        hardxl: '8px 8px 0 0 #141210',
        hardsm: '2px 2px 0 0 #141210',
      },
    },
  },
  plugins: [],
}
