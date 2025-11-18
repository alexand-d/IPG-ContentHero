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

- **Dual Story layout:** Two stacked feature stories render with alternating text/image columns, responsive behavior down to mobile, and styling that supports a single rounded image corner on highlight rows.
- **Fluent UI configuration hub:** Editors click **Manage stories** (visible in edit mode) to open a panel with a slide-management list, individual column configurations, and Fluent UI form controls as shown in the UX mock.
- **Per-story controls:** Title/body editors, multiline bullet entry, Sans Regular or Montserrat Bold font selection, font-size sliders, text-frame width/height/position sliders, and image width/height/position sliders satisfy the requested X/Y adjustments.
- **Image picker:** Supports uploading local files (stored as data URLs) or supplying external URLs plus accessible alt text. Each story can toggle the asymmetric rounded corner highlight.
- **Full-width safe:** The layout stretches to full-width sections while constraining the content region for readability.
- **Automated versioning & packaging:** `npm run build` and `npm run package` automatically bump the semantic version, sync the `.sppkg` package (`solution/ipg-contenthero.sppkg`), and run the SPFx toolchain.

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
2. Click **Manage stories** inside the web part to open the Fluent UI panel:
   - Left rail lists all stories with up/down ordering controls, delete, and **Add story**.
   - Right side provides per-story editors for titles, body copy, and bullet lists (one item per line).
   - Image section includes URL input, local upload button, alt-text entry, asymmetric corner toggle, and X/Y/Width/Height sliders.
   - Text frame section exposes X/Y offset sliders plus width/height controls to fine tune spacing.
   - Typography controls let you pick Sans Regular or Montserrat Bold for title, body, and bullets, with dedicated size sliders.
3. Save inside the panel to persist changes back to the SharePoint property bag. Each story is stored independently so future additions can be configured without affecting existing ones.

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
