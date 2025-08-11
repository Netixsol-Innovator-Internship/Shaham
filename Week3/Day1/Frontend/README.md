It includes standard links along with two dropdown-ready items: Features and Our Services. The navigation is styled for both light and dark modes and adapts automatically to different screen sizes.

## Key Features

- Fully responsive design that hides the menu on small screens and displays it starting from medium breakpoints.
- Dark mode support with smooth color transitions for text and hover states.
- Hover animations, including subtle color changes and rotating dropdown arrows.
- Dropdown-ready layout for “Features” and “Our Services,” making it easy to add menu panels.
- Consistent spacing and alignment of links using Tailwind utility classes.

## Usage
- Designed to be placed inside a <nav> element as part of a larger page layout. Works seamlessly when TailwindCSS is properly configured.

## Notes
- If dropdown items appear misaligned (e.g., slightly higher than other links), the cause is typically the inline SVG icons. Adding flex items-center consistently to all link elements ensures perfect alignment.