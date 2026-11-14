/* Tarot art for the portfolio: eight original cards drawn in the style of classic tarot stained glass
   (harlequin diamonds, black silhouettes, an arched numeral tab). All art here is original, no game files.
   Each page uses one arcana, the same one the menu shows. Markup: <div class="tcard" data-arcana="fool"></div>.
   Needs no other file. Runs before main.js so the menu can build cards.

   The cards are the pictures in assets/tarot/ (USE_IMAGES). If one is missing, the drawn card below is used instead. File names: fool.png, magician.png, chariot.png, death.png, star.png, moon.png,
   sun.png and judgement.png in assets/tarot/ and set USE_IMAGES to true. Only use pictures you have the right to publish. */
(function () {
  "use strict";
  var USE_IMAGES = true;
  var NS = "http://www.w3.org/2000/svg";
  var GROUP = 'fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"';
  function L(d, w) { return '<path d="' + d + '" fill="none" stroke-width="' + (w || 4.5) + '"/>'; }
  function circ(cx, cy, r) { return "M" + (cx - r) + " " + cy + "a" + r + " " + r + " 0 1 0 " + 2 * r + " 0a" + r + " " + r + " 0 1 0 " + -2 * r + " 0Z"; }
  function F(d, extra) { return '<path d="' + d + '"' + (extra || "") + "/>"; }

  var GLYPHS = {
    fool:
      F("M0 54H22V64H0Z") + '<circle cx="28" cy="13" r="5.5"/>' + L("M28 20L27 36", 6.5) +
      L("M27 36L20 52", 5) + L("M27 36L38 44L40 57", 5) + L("M28 25L38 21L42 15", 4) +
      L("M45 8L37 60", 2.6) + '<circle cx="46.5" cy="9" r="5.5"/>' +
      F("M46 58q0-5 5-5h5q3 0 3 3v5h-3v-3h-2v3h-3v-3h-3v3h-3Z"),
    magician:
      L("M32 13C28 5 14 5 14 13S28 21 32 13C36 5 50 5 50 13S36 21 32 13", 4.5) +
      L("M32 23V47", 4.5) + '<circle cx="32" cy="21" r="3.2"/>' +
      F("M5 49H59V54H5Z") + F("M10 54h4v8h-4ZM50 54h4v8h-4Z") +
      '<circle cx="14" cy="43.5" r="4.5"/>' + F("M23 48l5-9 5 9Z") + F("M36 39h9v9h-9Z") + F("M52 38l4.5 5.5-4.5 5.5-4.5-5.5Z"),
    chariot:
      L("M9 25Q32 3 55 25", 4.5) + L("M32 7V13", 4) + F("M7 28H57L53 45H11Z") +
      '<circle cx="18" cy="51" r="9" fill="none" stroke-width="4.5"/><circle cx="46" cy="51" r="9" fill="none" stroke-width="4.5"/>' +
      '<circle cx="18" cy="51" r="2.6"/><circle cx="46" cy="51" r="2.6"/>' +
      L("M18 42V60M9 51H27M46 42V60M37 51H55", 2.4),
    death:
      F("M32 3C17 3 11 14 13 27C14 32 17 34 20 36V47H26V43H29V47H35V43H38V47H44V36C47 34 50 32 51 27C53 14 47 3 32 3Z" + circ(23, 25, 5.5) + circ(41, 25, 5.5) + "M32 31L28.5 38H35.5Z", ' fill-rule="evenodd"') +
      F("M10 54H54V58H10Z"),
    star:
      F("__BIG__") + F("__SPARKS__") + L("M5 57q6.5-5 13 0t13 0 13 0 13 0", 3.6),
    moon:
      F("M37 5A28.5 28.5 0 1 0 37 59A40 40 0 0 1 37 5Z") + F("__MS__"),
    sun:
      F("__SPIKES__", ' fill-rule="evenodd"') + '<circle cx="32" cy="32" r="8.5"/>',
    judgement:
      F("M5 26H12V38H5Z") + F("M12 29H31V35H12Z") + F("M31 22L55 8V56L31 42Z") + L("M59 22Q64 32 59 42", 3) +
      F("M19 40L16 56H30L27 40Z")
  };
  GLYPHS.star = GLYPHS.star.replace("__BIG__", "M32.0 7.0L35.6 21.2L48.3 13.7L40.8 26.4L55.0 30.0L40.8 33.6L48.3 46.3L35.6 38.8L32.0 53.0L28.4 38.8L15.7 46.3L23.2 33.6L9.0 30.0L23.2 26.4L15.7 13.7L28.4 21.2Z").replace("__SPARKS__", "M8 5L9.5 8.5L13 10L9.5 11.5L8 15L6.5 11.5L3 10L6.5 8.5ZM56 4.5L57.4 7.7L60.5 9L57.4 10.3L56 13.5L54.6 10.3L51.5 9L54.6 7.7ZM7 30.5L8.1 33.0L10.5 34L8.1 35.0L7 37.5L6.0 35.0L3.5 34L6.0 33.0ZM57 29.5L58.0 31.9L60.5 33L58.0 34.0L57 36.5L56.0 34.0L53.5 33L56.0 31.9Z");
  GLYPHS.moon = GLYPHS.moon.replace("__MS__", "M53 9L54.5 12.5L58 14L54.5 15.5L53 19L51.5 15.5L48 14L51.5 12.5ZM50 40L51.2 42.8L54 44L51.2 45.2L50 48L48.8 45.2L46 44L48.8 42.8ZM10 46.8L11.0 49.0L13.2 50L11.0 51.0L10 53.2L9.0 51.0L6.8 50L9.0 49.0Z");
  GLYPHS.sun = GLYPHS.sun.replace("__SPIKES__", "M32.0 2.0L34.7 13.2L40.5 3.2L39.9 14.7L48.2 6.8L44.4 17.6L54.7 12.4L48.0 21.7L59.3 19.5L50.2 26.6L61.7 27.7L51.0 32.0L61.7 36.3L50.2 37.4L59.3 44.5L48.0 42.3L54.7 51.6L44.4 46.4L48.2 57.2L39.9 49.3L40.5 60.8L34.7 50.8L32.0 62.0L29.3 50.8L23.5 60.8L24.1 49.3L15.8 57.2L19.6 46.4L9.3 51.6L16.0 42.3L4.7 44.5L13.8 37.4L2.3 36.3L13.0 32.0L2.3 27.7L13.8 26.6L4.7 19.5L16.0 21.7L9.3 12.4L19.6 17.6L15.8 6.8L24.1 14.7L23.5 3.2L29.3 13.2ZM19 32a13 13 0 1 0 26 0a13 13 0 1 0 -26 0Z");

  var CARDS = {
    fool: { num: "0", name: "The Fool" },
    magician: { num: "I", name: "The Magician" },
    chariot: { num: "VII", name: "The Chariot" },
    death: { num: "XIII", name: "Death" },
    star: { num: "XVII", name: "The Star" },
    moon: { num: "XVIII", name: "The Moon" },
    sun: { num: "XIX", name: "The Sun" },
    judgement: { num: "XX", name: "Judgement" }
  };

  var defs = "";
  Object.keys(GLYPHS).forEach(function (k) {
    defs += '<symbol id="g-' + k + '" viewBox="0 0 64 64"><g ' + GROUP + ">" + GLYPHS[k] + "</g></symbol>";
  });
  document.body.insertAdjacentHTML("afterbegin",
    '<svg xmlns="' + NS + '" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + defs + "</defs></svg>");

  /* Card art is the real sheet crop. It is applied straight away (no drawn card flashing first) and the drawn glyph card
     only shows if the picture cannot load. Pictures are cached once so switching cards never waits. */
  var SRC = "assets/tarot/";
  var cache = {};
  function load(name, ok, bad) {
    var c = cache[name];
    if (c && c.done) { c.ok ? ok && ok() : bad && bad(); return; }
    if (!c) {
      c = cache[name] = { done: false, ok: false, cbs: [] };
      var im = new Image();
      im.onload = function () { c.done = true; c.ok = true; c.cbs.forEach(function (f) { f[0] && f[0](); }); };
      im.onerror = function () { c.done = true; c.ok = false; c.cbs.forEach(function (f) { f[1] && f[1](); }); };
      im.src = SRC + name + ".png";
    }
    c.cbs.push([ok, bad]);
  }
  function fill(el, id) {
    var c = CARDS[id];
    if (!c) return;
    el.setAttribute("data-arcana", id);
    el.innerHTML = '<span class="tc-pic"><svg class="tc-g" viewBox="0 0 64 64" aria-hidden="true"><use href="#g-' + id + '"/></svg></span><span class="tc-n">' + c.num + "</span>";
    if (USE_IMAGES) {
      el.style.backgroundImage = "url(" + SRC + id + ".png)";
      el.classList.add("is-img");
      load(id, null, function () { el.style.backgroundImage = ""; el.classList.remove("is-img"); });
    }
  }
  function preload(ids) { ids.forEach(function (id) { load(id); }); }
  Array.prototype.forEach.call(document.querySelectorAll(".tcard[data-arcana]"), function (el) { fill(el, el.getAttribute("data-arcana")); });
  window.LTLTarot = { fill: fill, cards: CARDS, preload: preload, src: SRC };
})();
