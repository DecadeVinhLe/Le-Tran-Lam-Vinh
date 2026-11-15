/* One website, two looks: Persona 3 Reload ("p3") and Jianghu, the martial-arts one ("jianghu").
   This file runs first, in <head>. It picks the theme, writes that theme's stylesheet and fonts, and after the page has
   parsed it loads only that theme's scripts, in order. The two looks never load together, so their styles cannot clash.

   Choosing: ?theme=p3 or ?theme=jianghu in the address, else the choice saved in this browser, else DEFAULT below.
   Switching: any button with data-theme-toggle, or the T key. The page reloads in the other look, behind a short curtain,
   and keeps its scroll position. The dark or light mode choice ("ltl-hour") is shared by both looks.
   To add a third look, add an entry to THEMES, a css/theme-*.css file and a js/<name>/ folder. */
(function () {
  "use strict";
  var KEY = "ltl-theme", WIPE = "ltl-wipe", DEFAULT = "p3";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var THREE = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  var THEMES = {
    p3: {
      id: "p3", label: "Persona", glyph: "P3", color: "#050f6e",
      fonts: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400;700&display=swap",
      scripts: [THREE, "js/p3/water.js", "js/p3/tarot.js", "js/p3/main.js", "js/p3/player.js"]
    },
    jianghu: {
      id: "jianghu", label: "Jianghu", glyph: "\u6B66", color: "#07090f",
      fonts: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Noto+Serif+SC:wght@600;900&family=Spectral:ital,wght@0,400;0,500;0,700;1,400&display=swap",
      /* main.js before seal.js: seal.js draws the seals that exist when it runs, and main.js adds the header that holds one */
      scripts: ["js/jianghu/scene.js", "js/jianghu/main.js", "js/jianghu/seal.js", "js/jianghu/player.js"]
    }
  };
  var root = document.documentElement;
  function read(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } }
  function write(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }

  var asked = /[?&]theme=(p3|jianghu)(?:&|$)/.exec(location.search);
  var curId = asked ? asked[1] : (THEMES[read(KEY)] ? read(KEY) : DEFAULT);
  if (asked) write(KEY, curId);
  var cur = THEMES[curId];
  var other = THEMES[curId === "p3" ? "jianghu" : "p3"];

  root.setAttribute("data-theme", curId);
  /* Jianghu is dark unless light was chosen; its first paint needs this before main.js runs. */
  if (curId === "jianghu") root.setAttribute("data-hour", read("ltl-hour") === "day" ? "day" : "night");
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", cur.color);

  /* Parser-inserted links block rendering, so the page never flashes unstyled. */
  document.write('<link rel="preconnect" href="https://fonts.googleapis.com">');
  document.write('<link rel="stylesheet" href="' + cur.fonts + '">');
  document.write('<link rel="stylesheet" href="css/theme-' + curId + '.css">');

  /* Arriving from a switch: the curtain lifts. */
  if (!reduce && read(WIPE, true)) {
    try { sessionStorage.removeItem(WIPE); } catch (e) {}
    root.setAttribute("data-wipe", curId);
    root.classList.add("theme-arrive");
    setTimeout(function () { root.classList.remove("theme-arrive"); }, 900);
  }

  document.addEventListener("DOMContentLoaded", function () {
    cur.scripts.forEach(function (src) {
      var s = document.createElement("script");
      s.src = src;
      s.async = false; /* keep the order */
      document.body.appendChild(s);
    });
  });

  var switching = false;
  function toggle(viaKey) {
    if (switching) return;
    switching = true;
    write(KEY, other.id);
    if (viaKey || reduce) { location.reload(); return; } /* keyboard: no curtain */
    write(WIPE, "1", true);
    root.setAttribute("data-wipe", other.id);
    root.classList.add("theme-leave");
    setTimeout(function () { location.reload(); }, 320);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-theme-toggle]");
    if (b) { e.preventDefault(); toggle(false); }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key !== "t" && e.key !== "T") || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || root.classList.contains("menu-open")) return;
    e.preventDefault();
    toggle(true);
  });

  window.LTLTheme = { current: cur, other: other, toggle: toggle };
})();
