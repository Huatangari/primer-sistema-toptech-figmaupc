/**
 * PostCSS Configuration
 *
 * Tailwind CSS v4 (via @tailwindcss/vite) automatically sets up all required
 * PostCSS plugins — you do NOT need to include `tailwindcss` or `autoprefixer` here.
 *
 * Additional plugins below handle CSS compatibility and modern features.
 */

import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    /**
     * postcss-preset-env: Adds polyfills for modern CSS features
     * - oklch() color space (with fallbacks to rgb/hex)
     * - css-has selector
     * - nesting support
     * - custom media queries
     * 
     * Features are automatically determined by .browserslistrc targets
     */
    postcssPresetEnv({
      stage: 3, // Use stage 3+ features with high browser support
    }),
  ],
}
