/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neon Graph DARK palette — space canvas, glowing accents.
        canvas: '#07060f',
        card: '#12101f', // opaque fallback under the glass
        ink: '#ECEAFF', // near-white text
        subtle: '#C7C2E6',
        muted: '#A19BC6',
        faint: '#6E6A8C',
        line: '#241f3a',
        accent: {
          purple: '#a78bfa',
          cyan: '#22d3ee',
          blue: '#60a5fa',
          green: '#34d399',
          amber: '#fbbf24',
          pink: '#f472b6',
          rose: '#fb7185',
        },
      },
      fontFamily: {
        display: ['Orbitron', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 30px -8px rgba(120,90,255,0.5)',
        glowcyan: '0 0 26px -8px rgba(34,211,238,0.55)',
        card: '0 10px 34px -14px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}
