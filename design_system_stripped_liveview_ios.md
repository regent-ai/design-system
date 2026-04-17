# Shared Design System for LiveView and iOS

This is one shared system with three explicit brand themes:

- Regent
- Autolaunch
- Techtree

The structure stays shared across products. The brand theme changes the color voice.

## Theme selection

There is no default brand theme in the shared CSS.

Consumers must set both selectors on the root element:

```html
<html data-brand="regent" data-theme="light">
```

Valid brands:

- `regent`
- `autolaunch`
- `techtree`

Valid themes:

- `light`
- `dark`

## Brand feel

### Regent

Calm, grounded, and institutional without feeling cold.

- Blue leads the interface.
- Ivory keeps the light surfaces warm.
- Clay is a highlight color, not the main action color.

### Autolaunch

Focused, trustworthy, and market-ready with more energy than Regent.

- Green is the main action color.
- Linen keeps the surface warm instead of sterile.
- Brass is supporting emphasis, not the default button color.

### Techtree

Practical, guided, and research-led.

- The interface should feel neutral first.
- Light mode should stay close to paper and stone.
- Dark mode should stay close to charcoal and ink.
- Moss is the working accent.
- Gold is reserved for record or standout proof states.

## Typography

### Font roles

- Headers and titles use **Geist Pixel Circle**.
- Normal interface text uses **Geist Pixel Square**.
- Long-form paragraphs use the paragraph font token.
- Code and technical text use **Geist Mono**.

### Suggested mapping

- `display` -> title font
- `title-lg` -> title font
- `title` -> title font
- `headline` -> title font
- `body` -> UI font
- `label` -> UI font
- `caption` -> UI font
- `legal` -> UI font
- `prose` -> paragraph font
- `code` -> mono font

## What stays shared

Keep these shared across all three brands:

- spacing scale
- radius scale
- typography roles
- component structure
- action hierarchy
- list and row patterns
- app shell patterns

## What changes by brand

The brand theme controls:

- the five-color palette
- semantic color tokens for light mode
- semantic color tokens for dark mode
- how strong or restrained the accent colors feel

## LiveView implementation

Use the JSON token file as the source of truth and compile it to CSS custom properties.

Recommended LiveView component set:

- `ui.text`
- `ui.stack`
- `ui.button`
- `ui.input`
- `ui.select`
- `ui.checkbox`
- `ui.switch`
- `ui.card`
- `ui.list_cell`
- `ui.tabs`
- `ui.sidebar`
- `ui.topbar`
- `ui.modal`
- `ui.badge`
- `ui.toast`

### Text usage

- Use semantic HTML tags for structure.
- Use the text style tokens for visual hierarchy.
- Put long-form content inside `.prose` or `[data-prose="true"]`.

## iOS implementation

Mirror the same logical token names on iOS:

- `title`
- `ui`
- `paragraph`
- `mono`

Recommended SwiftUI surface:

- `AppTheme`
- `AppColor`
- `AppSpacing`
- `AppRadius`
- `AppTypography`
- `AppButtonStyle`
- `ListCell`
- `Card`
- `TopBar`
- `BottomTabs`
- `ModalSheet`

Keep the token names stable even if the concrete font registration names vary by bundle.

## Shared token source of truth

Use one JSON token file and compile it to:

- CSS custom properties for LiveView
- Swift enums or structs for iOS

The shared token source now carries:

- brand palettes
- light and dark semantic themes for each brand
- font roles
- font assets
- spacing
- radius
- typography

## Short version

Use one shared system structure across products, but require an explicit brand theme.

- Regent is blue-led and calm.
- Autolaunch is green-led and more energetic.
- Techtree is neutral-led with restrained moss and gold accents.

Keep the system small, readable, and brand-specific without adding compatibility layers.
