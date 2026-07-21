# Stretch

A simple, no-account stretching app. Pick a routine (or build your own), follow along with a play/pause timer and pose illustrations, and every session gets logged automatically on your device — no sign-up, no server, no data leaving your phone.

## What it does

- **22 stretches** across neck, shoulders, arms, chest, spine, core, hips, hamstrings, quads, calves and full-body, each tagged for when you'd use them (morning / desk break / post-workout / bedtime), a difficulty level, and a muscle group
- **Filter by time, difficulty, or muscle group** via simple dropdowns — narrows both the routine list and the custom builder
- **5 pre-built routines** (Morning Wake-Up, Desk Break Reset, Post-Workout Cooldown, Bedtime Wind-Down, Full Body Deep Stretch), each with a **preview screen** showing the full stretch order and total time before you commit to starting
- A **custom builder** to pick your own stretches
- Original, instructional illustrations for every stretch: the specific muscle being stretched is drawn in the accent color directly on the figure (rather than a floating marker), plus a small arrow showing the direction of movement — all hand-drawn SVG, so no copyright concerns
- A **session player** with a circular countdown timer, play/pause, skip forward/back, and cue text for every stretch
- A **log** of every completed session, stored in your browser's local storage
- **Metrics**: total sessions, total minutes, day streak, average session length, and which muscle groups you stretch most

## Running it locally

No build step — it's plain HTML/CSS/JS. Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Publishing to GitHub Pages

1. Create a new repository on GitHub (e.g. `stretch-app`).
2. Push these four files (`index.html`, `styles.css`, `data.js`, `app.js`) to the repo root:
   ```bash
   git init
   git add .
   git commit -m "Initial stretch app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/stretch-app.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
5. After a minute or two, your app will be live at `https://<your-username>.github.io/stretch-app/`.
6. On your phone, open that URL and use "Add to Home Screen" (Safari/Chrome share menu) so it launches like a normal app.

## Notes on data

Sessions are saved with `localStorage`, scoped to the browser/device you use. That means:
- Nothing is sent anywhere — it's entirely private to your device
- Clearing your browser's site data will erase your log
- It won't sync between your phone and laptop unless you use the same browser profile — if you want that later, the natural next step is swapping local storage for a small synced backend, but that's a bigger project than this one

## Customizing

- **Add a stretch**: add an object to the `STRETCHES` array in `data.js` (name, body part, contexts, difficulty, duration in seconds, a cue, and an inline SVG illustration).
- **Add a routine**: add an object to `ROUTINES` in `data.js` referencing existing stretch IDs.
- **Change the look**: all colors and type live at the top of `styles.css` as CSS variables.
