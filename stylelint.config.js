export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss',
  ],
  plugins: ['stylelint-order'],
  rules: {
    // ── Tailwind v4 at-rules ──────────────────────────────────────────────────
    // Include all v3 + v4 at-rules (@source, @theme, @custom-variant, etc.)
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          // Tailwind v3
          'tailwind', 'apply', 'layer', 'screen', 'responsive', 'variants',
          // Tailwind v4
          'source', 'theme', 'utility', 'variant', 'custom-variant',
          'reference',
        ],
      },
    ],

    // ── CSS Modules: allow camelCase class names ──────────────────────────────
    // CSS Modules use camelCase (.iconWrapper, .retryButton, .trendBadge)
    // to map cleanly to JS object properties (styles.iconWrapper)
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$|^[a-z][a-z0-9-]*$',
      { message: 'Class names must be camelCase or kebab-case' },
    ],

    // ── Duplicate selectors ───────────────────────────────────────────────────
    // Some module CSS files intentionally repeat selectors in @media blocks
    'no-duplicate-selectors': null,

    // ── Unknown properties ────────────────────────────────────────────────────
    // Tailwind @apply can reference utility classes as properties (space-y, etc.)
    'property-no-unknown': [
      true,
      { ignoreProperties: ['space-y', 'composes'] },
    ],

    'declaration-block-no-duplicate-properties': true,
    'no-descending-specificity': null,

    // ── Tailwind functions ────────────────────────────────────────────────────
    'function-no-unknown': [
      true,
      { ignoreFunctions: ['theme', 'oklch', 'color-mix'] },
    ],

    // ── Property order (optional, non-blocking) ───────────────────────────────
    'order/properties-order': [
      'position', 'z-index', 'top', 'right', 'bottom', 'left',
      'display', 'overflow', 'margin', 'padding',
      'width', 'height', 'font-size', 'font-weight',
      'color', 'background-color', 'border',
    ],
  },
  ignoreFiles: ['node_modules/**', 'dist/**', 'build/**'],
};
