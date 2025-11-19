# IPG-ContentHero

## Summary

IPG Content Hero is a SharePoint Framework web part that renders a dual-row feature story section, mirroring the UX specification shared for the intranet experience. Each story alternates the placement of text and imagery, includes asymmetric rounded imagery for the second row, and exposes fine-grained control of typography, bullets, and layout adjustments. Authors manage content through a Fluent UI-powered configuration panel that mirrors the provided UX sketch.

![version](https://img.shields.io/badge/version-1.21.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Solution

| Solution        | Author(s)    |
| --------------- | ------------ |
| IPG-ContentHero | Codex (GPT-5) |

## Features

- **Dual Story layout:** Alternating text/image rows match the UX mock with responsive behavior and the single-corner highlight on elevated stories.
- **Full-featured text editing:** Every text input (title, body, bullets) now uses a Fluent UI toolbar with block styles, Bold/Italic/Underline, alignment, list buttons, link insert/remove, and a hex-enabled color picker so content authors get the same experience as the native SharePoint text panel.
- **Dynamic hover designer:** Editors decide if text or imagery animates on hover, then fine-tune duration, shadow blur, opacity, and shadow color from the property pane. Both text and photos also support independent hover speeds.
- **Web part setup controls:** The property pane houses all layout sliders (image/text X/Y offsets, widths, heights), font pickers, asymmetric corner direction, and hover effects, making it simple to adjust layout parameters alongside other page settings.
- **Background color picker:** Choose the section background color directly inside the property pane.
- **Automated versioning & packaging:** `npm run build` / `npm run package` bump the semantic version automatically and produce `solution/ipg-contenthero.sppkg`.

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Local workbench / debugging

   ```bash
   gulp serve
   ```

3. Bundle or package (version is bumped automatically before each run)

   ```bash
   npm run build          # gulp bundle (debug)
   npm run package        # gulp package-solution
   npm run package:ship   # bundle --ship + package-solution --ship (production)
   ```

   The pipeline increments `package.json` and `config/package-solution.json` via `scripts/bump-version.js` on every invocation, ensuring a unique version is generated for deployments. Use `npm run package:ship` whenever you deploy to SharePoint or any environment that cannot reach `https://localhost:4321`. The debug package uses localhost paths in the manifest, so SharePoint throws the *"Failed to load script sp-loader.js"* error shown in the screenshot if the dev server is not reachable.

## Configuration experience

1. Edit a SharePoint page and add the **IPG Content Hero** web part.
2. Use the in-surface toolbar buttons:
   - **Manage stories** opens the Fluent UI panel for content entry. The left rail lists every card (with reorder/delete/add), while the right side provides the upgraded text editors (style dropdown, B/I/U, alignment, list buttons, link tools, and per-field hex color pickers), the “Display bullet points” toggle, and the image picker (URL field, upload button, SharePoint stock image picker, and alt-text entry).
   - **Web part settings (gear icon)** hosts the Layout & Typography custom field and the background color picker. Select a story in the left rail, then tweak the asymmetric-corner direction, image/text X/Y offsets, frame sizes, Sans/Montserrat font options, and the new hover design controls (enable/disable, duration slider, shadow blur/opacity sliders, and color picker with hex input). Changes apply immediately while the page preview stays in sync.
3. Save inside the Manage panel to persist textual content. Layout/typography/background/hover changes are saved automatically via the property pane.

## Packaging output

- `config/package-solution.json` is configured to generate `solution/ipg-contenthero.sppkg`.
- The package metadata, feature name, and descriptions have been aligned with the Content Hero experience.

## Additional Notes

- Montserrat is injected via `SPComponentLoader.loadCss` so no custom host adjustments are required.
- The component is responsive and compatible with full-width sections; slider controls allow fine-grained adjustments if imagery needs extra breathing room on specific breakpoints.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft Teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp)
