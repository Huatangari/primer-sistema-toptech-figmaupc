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
    'no-empty-source': null,
    'at-rule-empty-line-before': null,
    'no-invalid-position-at-import-rule': null,
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'color-hex-length': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    'lightness-notation': null,
    'hue-degree-notation': null,
    'value-keyword-case': null,
    'media-feature-range-notation': null,
    'property-no-vendor-prefix': null,

    // ── Tailwind functions ────────────────────────────────────────────────────
    'function-no-unknown': [
      true,
      { ignoreFunctions: ['theme', 'oklch', 'color-mix'] },
    ],

    // ── Property order (optional, non-blocking) ───────────────────────────────
    // Keep property order as recommendation outside CI.
    'order/properties-order': null,
  },
  ignoreFiles: ['node_modules/**', 'dist/**', 'build/**'],
};
