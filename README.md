# Le Tran Lam Vinh: portfolio

A four-page portfolio styled after Persona 3 Reload, with a three.js water background, a live date and time widget, original tarot cards, a Dawn mode, and a music player in the header shaped like the game's MP3 player.

```
index.html      Home
about.html      About
projects.html   Projects
contact.html    Contact
css/style.css   All styles
js/water.js     three.js water shader (palette follows the time of day, or Dawn)
js/tarot.js     Tarot cards: original stained-glass style art, one arcana per page
js/main.js      Header, sun and moon switch, calendar, menu, page changes
js/player.js    Music player
assets/audio/   color-your-night.mp3 (the header player track)
```

No build step. Open `index.html` in a browser, or serve the folder with any static server.

## Push to GitHub

```bash
cd ltl-portfolio
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/DecadeVinhLe/DecadeVinhLe.github.io.git
git push -u origin main
```

Then open the repository on GitHub: Settings, Pages, Build and deployment, Deploy from a branch, `main` and `/ (root)`. Naming the repository `DecadeVinhLe.github.io` puts the site at `https://decadevinhle.github.io/`.

## Controls

- `Esc` opens the menu, and `Esc` again closes it. `M` also opens it.
- The sun and moon switch (top right) turns Dawn on and off. The menu has a Dawn row that does the same. The choice is remembered.
- Arrow keys move through the menu, `Enter` confirms.

## Edit your content

- Project cards: `projects.html` and the Featured work cards in `index.html` (Pathfinder and Bunny Hop link to their GitHub repositories).
- Project cards: Bytecrawl and Lắng are marked "Case study coming soon"; replace that line with a description and add tags.
- Menu pages and descriptions: the `PAGES` list at the top of `js/main.js`.
- Colours of the water: `PALETTES` at the top of `js/water.js`. Dawn colours for panels and text: the `:root[data-hour="dark"]` block at the top of `css/style.css`.
- Your own card pictures: put fool.png, magician.png, chariot.png, death.png, star.png, moon.png, sun.png and judgement.png in `assets/tarot/` and set `USE_IMAGES` to `true` at the top of `js/tarot.js`. Only use pictures you have the right to publish.
- Tarot cards: change `data-arcana` on a `.tcard` element (fool, magician, chariot, death, star, moon, sun, judgement).
- Music: `MAIN` at the top of `js/player.js`.

## Notes

- The page libraries and fonts load from cdnjs and Google Fonts, so the site needs an internet connection.
- Music position carries to the next page, but browsers may block autoplay on a new page. Press play again if it stays paused.
- The style is fan-made and not affiliated with Atlus or SEGA.
