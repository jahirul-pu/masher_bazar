# Engineering Rules & Guidelines

## 1. Bilingual Typography & Script Isolation
- **Never Replace English/Latin Typography with Indic/Bengali Fonts**: Indic and Bengali fonts (such as Sutonny OMJ, Kalpurush, SolaimanLipi, etc.) typically include archaic, unrefined Latin glyphs that distort modern UI text, English navigation, and product codes.
- **Strict `unicode-range` Scoping**: Whenever configuring a localized script font, always restrict its `@font-face` declaration to the appropriate Unicode range:
  ```css
  @font-face {
    font-family: 'Sutonny OMJ';
    src: local('Sutonny OMJ'), local('SutonnyOMJ'), url('/fonts/SutonnyOMJ.ttf') format('truetype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0980-09FF, U+200C-200D, U+25CC; /* Bengali script only */
    size-adjust: 120%; /* Optically matches English font x-height and cap-height */
  }
  ```
- **Font Stack Hierarchy**: Always pair script-specific fonts with clean, modern Latin system fonts (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Inter`, `sans-serif`) so English text automatically falls through to native high-quality typography.
- **Preserve Monospace Integrity**: Monospace font stacks (`font-mono`) used for SKU identifiers, batch numbers, timestamps, and hashes must NEVER be overridden with script or decorative fonts.
- **Avoid Global Font-Size Inflation**: Do not globally inflate root `html` font sizes or relative Tailwind scales to compensate for localized script glyph sizes. Use line-height adjustments and targeted styling instead.

## 2. Development Speed & Tool Execution
- **Leverage Active Dev Servers**: When a development server (`pnpm run dev`) is running, do not run redundant full production builds (`next build`) for simple styling/UI updates. Allow hot-reloading to handle verification.
- **Prevent Unconstrained File Crawls**: Always exclude `node_modules`, `.next`, `.turbo`, and dist directories from recursive shell commands to prevent long-running background tasks.
