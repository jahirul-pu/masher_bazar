# Bilingual Typography & Script Isolation

## 1. Script Isolation with `unicode-range`
- **Never Replace English/Latin Typography with Indic/Bengali Fonts**: Localized fonts (e.g., Sutonny OMJ, Kalpurush, SolaimanLipi, etc.) must never be used to render English characters. Their Latin glyph sets are archaic and distort modern web interfaces.
- **Always Use `unicode-range` in `@font-face`**:
  ```css
  @font-face {
    font-family: 'Sutonny OMJ';
    src: local('Sutonny OMJ'), local('SutonnyOMJ'), url('/fonts/SutonnyOMJ.ttf') format('truetype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0980-09FF, U+200C-200D, U+25CC; /* Bengali characters only */
    size-adjust: 120%; /* Optically matches English font x-height and cap-height */
  }
  ```
- **Fallback Font Stack**: In CSS and Tailwind configs, always include clean Latin system fonts (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Inter`, `sans-serif`) in the font family stack so Latin characters automatically render in modern English typography.
- **Monospace Preservation**: Never override `font-mono` with localized or decorative script fonts; retain pure monospace for identifiers, SKUs, and codes.
- **No Global Scale Inflation**: Never inflate root `html` font size or relative scales globally to fix script-specific sizes.

## 2. Dev Server Efficiency
- When a dev server (`pnpm run dev` / `npm run dev`) is active, avoid executing full production builds for simple UI/CSS adjustments. Let hot-reloading handle inspection.
- Never run unconstrained recursive directory searches without excluding `node_modules`, `.next`, `.turbo`, and build output directories.
