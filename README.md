# Le Tran Lam Vinh: portfolio

A four-page portfolio styled after Persona 3 Reload, with a three.js water background, a live date and time widget, tarot cards from your sheet, a Dark Hour mode, and a music player in the header shaped like the game's MP3 player.

```
index.html      Home
about.html      About
projects.html   Projects
contact.html    Contact
css/style.css   All styles
js/water.js     three.js water shader (palette follows the time of day, or Dark Hour)
js/tarot.js     Tarot cards: the card art from assets/tarot/ (cut unaltered from your sheet, including back.png, the card back); drawn cards only show if a picture fails
js/main.js      Header, sun and moon switch, calendar, menu, page changes
js/player.js    Music player
assets/audio/   color-your-night.mp3 (the header player track)
```

No build step. Open `index.html` in a browser, or serve the folder with any static server.
## Inspired from 
<p align="center">
  <img src="assets/img/p3.gif" alt="Demo" width="600" />
</p>
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
- The sun and moon switch (top right) turns Dark Hour on and off. The menu has a Dark Hour row that does the same. The choice is remembered.
- Arrow keys move through the menu, `Enter` confirms.

## Portrait and logos

- Portrait: `assets/img/vinh.jpg` (4:5 crop). Replace the file to change it. It shows in a duotone that follows the theme (blue by day, plum and peach in Dark Hour), and in full colour when you hover it.
- Project logos: each `.logo` tile in the HTML tries to load the site's logo and falls back to its initials. Pathfinder uses its own logo file, Humber ASV, GitHub and LinkedIn use the site's favicon. For a logo of your own, save it in `assets/logos/` and set the `src` of that tile's `<img>` to it.

## Edit your content

- Project cards: `projects.html` and the Featured work cards in `index.html` (Pathfinder and Bunny Hop link to their GitHub repositories).
- Project cards: Bytecrawl and Lắng are marked "Case study coming soon"; replace that line with a description and add tags.
- Menu pages and descriptions: the `PAGES` list at the top of `js/main.js`.
- Colours of the water: `PALETTES` at the top of `js/water.js`. Dark Hour colours for panels and text: the `:root[data-hour="dark"]` block at the top of `css/style.css`.
- Your own card pictures: put fool.png, magician.png, chariot.png, death.png, star.png, moon.png, sun.png and judgement.png in `assets/tarot/` and set `USE_IMAGES` to `true` at the top of `js/tarot.js`. Only use pictures you have the right to publish.
- Tarot cards: change `data-arcana` on a `.tcard` element (fool, magician, chariot, death, star, moon, sun, judgement).
- Music: Jianghu plays a two-song playlist, `TRACKS` at the top of `js/jianghu/player.js` (Hiện Thiên Duyên, then Bá Hổ Thuyết). Persona: `MAIN` at the top of `js/p3/player.js`.
- Theme switch: the Persona/Jianghu button (or `T`) sweeps a curtain in the new look's colours, fades the music out, reloads, and lifts the curtain only after the new look has loaded, fading the music back in. Timings are in `css/base.css` (curtain) and `js/theme.js` (`LEAVE`, `HOLD`).

## Notes

- The page libraries and fonts load from cdnjs and Google Fonts, so the site needs an internet connection.
- Music position carries to the next page, but browsers may block autoplay on a new page. Press play again if it stays paused.
- The style is fan-made and not affiliated with Atlus or SEGA.
