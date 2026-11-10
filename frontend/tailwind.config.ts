import type { Config } from 'tailwindcss'

/**
 * Tema do Tailwind com os tokens do design Wordeck (wordeck-design/DESIGN.md).
 *
 * Tailwind é o único sistema de estilo do projeto (o MUI foi removido),
 * então o preflight fica LIGADO e faz o reset base.
 *
 * Nomes semânticos:
 *  - cores:     text-ink, text-muted, text-soft, text-link, bg-tint, border-line,
 *               brand-purple / brand-pink / brand-orange
 *  - degradês:  bg-brand (botões, chip ativo), bg-brand-full (verso, booster),
 *               bg-booster, bg-type-<tipo>
 *  - sombras:   shadow-glow-<tipo> (carta cheia), shadow-glow-sm-<tipo> (mini),
 *               shadow-glow-brand, shadow-lilac
 *
 * As classes por tipo são escolhidas em tempo de execução através do mapa
 * completo em `src/features/cards/constants/cardTypes.ts` — nunca monte
 * nomes de classe por concatenação, senão o Tailwind não as gera.
 */

const TYPES = {
  animal: { from: '#25B886', to: '#0B7285', glow: 'rgba(11, 114, 133, 0.35)' },
  family: { from: '#FF8F52', to: '#D63A5E', glow: 'rgba(214, 58, 94, 0.35)' },
  food: { from: '#FF6FA3', to: '#B02A84', glow: 'rgba(176, 42, 132, 0.35)' },
  nature: { from: '#45BDE6', to: '#1F74C4', glow: 'rgba(31, 116, 196, 0.35)' },
  place: { from: '#5B8DEF', to: '#4B45C6', glow: 'rgba(75, 69, 198, 0.35)' },
  action: { from: '#9A5CF0', to: '#4A1D8F', glow: 'rgba(74, 29, 143, 0.35)' },
} as const

const entries = Object.entries(TYPES)

const typeGradients = Object.fromEntries(
  entries.map(([name, t]) => [`type-${name}`, `linear-gradient(160deg, ${t.from}, ${t.to})`]),
)
const typeGlows = Object.fromEntries(
  entries.map(([name, t]) => [`glow-${name}`, `0 18px 36px ${t.glow}`]),
)
const typeGlowsSm = Object.fromEntries(
  entries.map(([name, t]) => [`glow-sm-${name}`, `0 14px 28px ${t.glow}`]),
)

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F1B3A',
        muted: '#5A5672',
        soft: '#3C3856',
        link: '#6A2FD0',
        tint: '#F3EEFD',
        line: '#E2D8FA',
        brand: {
          purple: '#7B3FE4',
          pink: '#D6336C',
          orange: '#F2603F',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        brand: 'linear-gradient(135deg, #7B3FE4, #D6336C)',
        'brand-full': 'linear-gradient(160deg, #7B3FE4 0%, #D6336C 60%, #F2603F 100%)',
        booster: 'linear-gradient(170deg, #7B3FE4 0%, #D6336C 62%, #F2603F 100%)',
        /** Serrilhado das tiras do booster; combine com uma cor de fundo (bg-brand-purple). */
        crimp:
          'repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.28) 0 6px, rgba(255, 255, 255, 0) 6px 12px)',
        ...typeGradients,
      },
      boxShadow: {
        ...typeGlows,
        ...typeGlowsSm,
        'glow-brand': '0 10px 24px rgba(123, 63, 228, 0.35)',
        lilac: '0 8px 20px rgba(123, 63, 228, 0.18)',
      },
      dropShadow: {
        booster: '0 18px 28px rgba(123, 63, 228, 0.35)',
      },
      transitionTimingFunction: {
        pop: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config
