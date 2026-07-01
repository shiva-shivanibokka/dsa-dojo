/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep-space "starfield" palette — cosmic night, neon accents.
        canvas: '#05030f',
        card: '#0e0c22',
        ink: '#EDECFF',
        subtle: '#C9C7EE',
        muted: '#9B98C8',
        faint: '#6A6796',
        line: '#221f3d',
        accent: {
          indigo: '#818cf8',
          blue: '#60a5fa',
          cyan: '#22d3ee',
          purple: '#a78bfa',
          green: '#34d399',
          amber: '#fbbf24',
          pink: '#f472b6',
          rose: '#fb7185',
        },
      },
      fontFamily: {
        display: ['Tourney', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 28px -6px rgba(99,102,241,0.6)',
        glowcyan: '0 0 24px -6px rgba(34,211,238,0.6)',
        card: '0 14px 36px -18px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
}
