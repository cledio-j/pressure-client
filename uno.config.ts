import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'cursor-pointer rounded-md bg-back-light p-1.75 px-3 font-500 text-tx shadow-back-highlight shadow-sm transition-all hover:bg-back hover:text-primary-dark hover:shadow-primary'],
    ['round-btn', 'flex flex-col items-center rounded-full bg-back-light p-2'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        ms: () => import('@iconify-json/material-symbols/icons.json').then(i => i.default as any),
        spinners: () => import('@iconify/svg-spinners/icons.json').then(i => i.default as any),
      },
    }),
    presetWebFonts({
      fonts: {
        sans: {
          name: 'Noto Sans',
          weights: [300, 400, 500, 600],
        },
        serif: 'Merriweather',
        mono: 'DM Mono',
      },
    }),
  ],
  rules: [
    [/^color-([a-z-]+)$/, ([,c]) => ({ height: `var(--c-${c})` })],
    // css variable height
    [/^vh-([a-z-]+)$/, ([,d]) => ({ height: `var(--s-${d})` })],
    // css variable width
    [/^vw-([a-z-]+)$/, ([,d]) => ({ width: `var(--s-${d})` })],
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--c-primary)',
        active: 'var(--c-primary-active)',
        light: 'var(--c-primary-light)',
        dark: 'var(--c-primary-dark)',
      },
      error: {
        DEFAULT: 'var(--c-error)',
        active: 'var(--c-error-active)',
      },
      back: {
        DEFAULT: 'var(--c-bg)',
        dark: 'var(--c-bg-dark)',
        active: 'var(--c-bg-active)',
        light: 'var(--c-bg-light)',
        highlight: 'var(--c-bg-highlight)',
        offwhite: 'var(--c-bg-offwhite)',
      },
      tx: {
        DEFAULT: 'var(--c-text-base)',
        secondary: 'var(--c-text-secondary)',
        title: 'var(--c-text-title)',
        faint: 'var(--c-text-faint)',
      },
      warning: 'var(--c-warning)',
      info: 'var(--c-info)',
      success: 'var(--c-success)',
      primShadow: 'var(--c-shadow)',
    },
  },

})
