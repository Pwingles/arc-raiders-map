# ARC Raiders Interactive Map

Customizable interactive checklist built with plain HTML, CSS, and vanilla JavaScript (Leaflet under the hood). Designed for GitHub Pages so you can publish a zero-backend intel tracker for ARC Raiders or any other open-world game.

> Inspired by community-made interactive maps such as Nintendo's Tears of the Kingdom tracker, the Destiny 2 Braytech map, and Philip Mathieu's [Interactive Web Map](https://philipmathieu.github.io/interactive-web-map/) demo (Leaflet/MapLibre). Implementation guidance pulled from the official [Leaflet docs](https://leafletjs.com/) and tutorials like CSI PCE's “Hosting Interactive Map on GitHub Pages”.

## Highlights

- Works completely offline (all data local, no build process required).
- Two projection modes:
  - **`simple`** — uses `L.CRS.Simple` for custom stitched map art (example: `Caligo Basin` placeholder SVG).
  - **`geo`** — standard geographic tiles (example: OpenStreetMap powered `Orbital Link Testbed`).
- Per-map intel card with live thumbnails, biome/threat labels, and recommended power/featured loot callouts.
- Advanced filters for category, rarity, difficulty, and completion state plus a searchable checklist.
- Per-item completion state stored in `localStorage`, plus manual export/import for moving progress between devices.
- Filters, search, and progress stats update instantly.
- Mark objectives from the sidebar list or directly from map popups.

## Quick start

1. **Install dependencies** — none! Everything runs in the browser.
2. **Serve locally (optional)** to test with live reload:

   ```powershell
   cd C:\Users\pring\OneDrive\Documents\ArcMap
   python -m http.server 8000
   # visit http://localhost:8000
   ```

3. **Customize your data** by editing `data/maps.js` (details below).
4. **Enable GitHub Pages** (Settings → Pages → Source = `main` → root). You'll get `https://<user>.github.io/arc-raiders-map/`.

## Data model

`data/maps.js` exposes a global `window.arcMapsConfig` object.

```js
{
  storageKey: "arc-raiders-progress-v1",
  defaultMapId: "caligo-basin",
  categories: {
    quest: { label: "Quest", color: "#facc15", description: "..." },
    // ...
  },
  maps: [
    {
      id: "caligo-basin",
      name: "Caligo Basin",
      projection: "simple", // or "geo"
      image: {
        url: "assets/maps/caligo-basin.svg",
        bounds: [[0, 0], [1200, 1600]]
      },
      zoom: { min: -1, max: 3, initial: 0 },
      items: [
        {
          id: "cal-quest-001",
          title: "Signal Heist",
          type: "quest",
          coords: [520, 440], // pixel X/Y for simple projection or [lat, lng] for geo
          description: "…",
          objectives: ["Disable jammer", "Hack relay"],
          rewards: ["Stormglass Core"],
          tags: ["solo", "stealth"],
          schedule: "Spawns hourly",
          cooldownHours: 20,
          link: "https://arcraiders.com/"
        }
      ]
    }
  ]
}
```

### Adding new maps

1. Drop your stitched map art into `assets/maps/<my-map>.jpg` (SVG/PNG/JPG work).
2. Measure your image dimensions and set `image.bounds = [[0,0],[height,width]]`.
3. Use pixel coordinates for each item (`[x, y]`) relative to the same dimensions.
4. Update `maps.js` with the new entry and set it as `defaultMapId` if desired.

### Switching to Mapbox / custom tiles

For geographic tiles, change the `tileLayer` fields:

```js
tileLayer: {
  url: "https://api.mapbox.com/styles/v1/<user>/<style>/tiles/256/{z}/{x}/{y}?access_token=<token>",
  attribution: '&copy; Mapbox & OpenStreetMap'
},
view: { center: [lat, lng], zoom: 6 }
```

## Deployment checklist

- [ ] Run `python -m http.server` (or `npx serve`) locally to test interactions.
- [ ] Commit all files (`index.html`, `css/`, `js/`, `data/`, `assets/`).
- [ ] Push to `main`.
- [ ] GitHub → Settings → Pages → Build from `main` branch, root.
- [ ] (Optional) set a custom domain with a `CNAME` file.

## Roadmap ideas

- Import/export via QR code for easier console usage.
- Sync progress using Supabase or Firebase if you ever need cloud profiles.
- Team overlays so multiple squadmates can share objectives live.

Pull requests welcome! If you build a better looking base map or wire it up to real ARC Raiders intel, please share screenshots in the repo discussions.

