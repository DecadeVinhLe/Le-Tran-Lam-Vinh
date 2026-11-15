/* Shared chrome for every page: music player bar, sun and moon switch, live calendar, water palette and the menu.
   Each page only needs <main data-page="home|about|projects|contact"> and the script tags at the end of <body>
   (three.js, water.js, tarot.js, main.js, player.js). */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mainEl = document.querySelector("[data-page]");
  var page = mainEl ? mainEl.getAttribute("data-page") : "home";

  /* One arcana per page. The same card shows in the page header and in the menu. */
  var PAGES = [
    { id: "home", href: "index.html", card: "fool", num: "0", arc: "Fool", name: "Home", sub: "Start here", label: "Page", val: "1/4", desc: "Who I am, in one screen." },
    { id: "about", href: "about.html", card: "magician", num: "I", arc: "Magician", name: "About", sub: "Who I am", label: "Page", val: "2/4", desc: "My background, skills, studies and where I want to go." },
    { id: "projects", href: "projects.html", card: "chariot", num: "VII", arc: "Chariot", name: "Projects", sub: "Selected work", label: "Page", val: "3/4", desc: "Pathfinder, Humber ASV, Bunnyhop, Bytecrawl, Lắng and more." },
    { id: "contact", href: "contact.html", card: "judgement", num: "XX", arc: "Judgement", name: "Contact", sub: "Find me online", label: "Page", val: "4/4", desc: "GitHub, LinkedIn and the Humber ASV site." },
    { act: "hour", card: "sun", num: "XIX", arc: "Sun", name: "Dark Hour", sub: "Would you believe me if I said that a day consists of more than 24 hours?", label: "Mode", desc: "Switch the water and panels to the Dark Hour colours. The sun and moon switch in the header does the same." }
  ];

  /* ---------- Dawn and time of day ----------
     Day follows the clock (morning to night). Dawn is the sunrise palette. The choice is saved under the old key "ltl-hour". */
  var dark = false;
  var saved = null;
  try { saved = localStorage.getItem("ltl-hour"); } catch (e) {}

  function todOf(h) {
    if (h >= 5 && h < 9) return { key: "morning", label: "Early Morning" };
    if (h >= 9 && h < 15) return { key: "day", label: "Daytime" };
    if (h >= 15 && h < 17) return { key: "afternoon", label: "Afternoon" };
    if (h >= 17 && h < 21) return { key: "evening", label: "Evening" };
    return { key: "night", label: "Late Night" };
  }
  /* Two looks: Dark Hour is the calm green moon, Day is the waving blue water. Without a saved choice the clock decides. */
  dark = saved === "dark" || saved === "night" ? true : saved === "day" ? false : todOf(new Date().getHours()).key === "night";
  function applyPalette() {
    var t = todOf(new Date().getHours());
    document.documentElement.setAttribute("data-hour", dark ? "night" : "day");
    if (window.LTLWater) window.LTLWater.setPalette(dark ? "night" : t.key === "night" ? "evening" : t.key);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#06191b" : "#050f6e");
    if (modeBtn) {
      modeBtn.setAttribute("aria-checked", dark ? "true" : "false");
      modeBtn.title = dark ? "Switch to day colours" : "Switch to Dark Hour colours";
    }
  }
  function toggleDark() {
    dark = !dark;
    try { localStorage.setItem("ltl-hour", dark ? "dark" : "day"); } catch (e) {}
    applyPalette();
  }

  /* The theme switch: shows the look you would switch to. theme.js handles the click (data-theme-toggle). */
  function themeBtn() {
    var T = window.LTLTheme;
    if (!T) return "";
    var o = T.other;
    return '<button class="theme-btn" type="button" data-theme-toggle aria-label="Switch to the ' + o.label + ' theme" title="Switch to the ' + o.label + ' theme (T)"><span class="tb-g" aria-hidden="true">' + o.glyph + '</span><span class="tb-t">' + o.label + '</span></button>';
  }

  /* ---------- Markup ---------- */
  var html =
    '<noscript><nav class="noscript-nav" aria-label="Pages"><a href="index.html">Home</a><a href="about.html">About</a><a href="projects.html">Projects</a><a href="contact.html">Contact</a></nav></noscript>' +
    '<header class="site-head">' +
    '<div class="pod" id="pod" role="group" aria-label="Music player">' +
    '<span class="ring" aria-hidden="true"></span><span class="plug" aria-hidden="true"></span>' +
    '<span class="phones" aria-hidden="true">' +
    '<svg class="cord" viewBox="0 0 200 40" preserveAspectRatio="none"><path d="M200 6 C176 40 128 40 100 26 C70 12 34 22 0 8" vector-effect="non-scaling-stroke"/><path class="c2" d="M200 10 C170 30 140 34 110 30 C74 26 40 36 0 20" vector-effect="non-scaling-stroke"/></svg>' +
    '<svg class="cans" viewBox="0 0 70 70"><path class="hook" d="M14 30 C6 6 40 -2 52 18"/><circle class="cup" cx="34" cy="40" r="22"/><circle class="cup2" cx="34" cy="40" r="14"/><circle cx="34" cy="40" r="4.5" class="dot"/></svg>' +
    '</span>' +
    '<div class="lcd" aria-live="polite"><div class="artist" id="p-artist"></div><div class="tw"><span class="title" id="p-title"></span></div><i class="meter" id="p-meter"></i></div>' +
    '<button class="pbtn" id="p-prev" type="button" aria-label="Previous track"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5v14l-10-7z"/><rect x="5" y="5" width="3" height="14"/></svg></button>' +
    '<button class="disc" id="p-play" type="button" aria-label="Play"><span class="platter"></span><span class="hub"><svg id="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l14 8-14 8z"/></svg><svg id="i-pause" viewBox="0 0 24 24" aria-hidden="true" hidden><rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/></svg></span></button>' +
    '<button class="pbtn" id="p-next" type="button" aria-label="Next track"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14l10-7z"/><rect x="16" y="5" width="3" height="14"/></svg></button>' +
    '<button class="pbtn" id="p-add" type="button" aria-label="Add your own music" title="Add your own music"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z"/></svg></button>' +
    '<button class="list-btn" id="p-list" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="menu" title="Open the list (Esc)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v2.5H4zM4 10.75h16v2.5H4zM4 15.5h16V18H4z"/></svg>LIST</button>' +
    '<input id="p-file" type="file" accept="audio/*" multiple hidden>' +
    '</div>' +
    '<div class="head-r">' + themeBtn() +
    '<button class="mode" id="mode" type="button" role="switch" aria-checked="false" aria-label="Dark Hour mode" title="Switch to Dark Hour colours">' +
    '<span class="mode-knob" aria-hidden="true"></span>' +
    '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M11 1h2v4h-2zM11 19h2v4h-2zM1 11h4v2H1zM19 11h4v2h-4zM4.2 5.6l1.4-1.4 2.8 2.8-1.4 1.4zM15.6 17l1.4-1.4 2.8 2.8-1.4 1.4zM5.6 19.8l-1.4-1.4L7 15.6l1.4 1.4zM17 8.4l-1.4-1.4 2.8-2.8 1.4 1.4z"/></svg>' +
    '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.7 9.7 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8z"/></svg>' +
    '</button>' +
    '<div class="cal" id="cal" aria-label="Today">' +
    '<div class="cal-row"><span class="cal-date" id="cal-date"></span><span class="cal-day" id="cal-day"></span>' +
    '<svg class="moon" id="moon" viewBox="-12 -12 24 24" role="img" aria-label="Moon phase"></svg></div>' +
    '<div class="cal-row2"><span class="cal-wk" id="cal-wk"></span><span class="cal-tod" id="cal-tod"></span><span class="cal-time" id="cal-time"></span></div></div>' +
    '</div>' +
    '</header>' +
    '<div class="menu" id="menu" role="dialog" aria-modal="true" aria-labelledby="menu-title" hidden>' +
    '<p class="m-ghost" aria-hidden="true">Portfolio</p>' +
    '<div class="m-inner"><div><h2 class="m-title" id="menu-title">List</h2><ul class="m-list" id="m-list"></ul></div>' +
    '<aside class="m-detail" aria-live="polite"><div class="tcard is-img" id="m-card" aria-hidden="true"><span class="mc-in"><span class="mc-f"></span><span class="mc-b"></span></span></div><p class="m-arc" id="m-arc"></p><p class="m-desc" id="m-desc"></p></aside></div>' +
    '<div class="m-hint"><button class="m-key" id="m-ok" type="button"><kbd>Enter</kbd>Confirm</button><button class="m-key" id="m-back" type="button"><kbd>Esc</kbd>Close</button></div>' +
    '</div>';
  /* Duotone for the portrait: maps the photo's brightness onto the theme's two colours, so the photo sits in the
     water palette (blue by day, plum and peach at dawn). Hover shows the real colours (see .p-nat in the CSS). */
  function duo(id, r, g, b) {
    return '<filter id="' + id + '" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.33 0.55 0.12 0 0 0.33 0.55 0.12 0 0 0.33 0.55 0.12 0 0 0 0 0 1 0"/>' +
      '<feComponentTransfer><feFuncR type="table" tableValues="' + r + '"/><feFuncG type="table" tableValues="' + g + '"/><feFuncB type="table" tableValues="' + b + '"/></feComponentTransfer></filter>';
  }
  html = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    duo("duo-day", "0.016 0.11 0.92", "0.067 0.61 0.99", "0.37 1 1") +
    duo("duo-dawn", "0.16 1 1", "0.086 0.435 0.945", "0.41 0.57 0.79") +
    duo("duo-night", "0.02 0.17 0.89", "0.09 0.34 0.94", "0.1 0.3 0.72") +
    "</defs></svg>" + html;
  document.body.insertAdjacentHTML("afterbegin", html);

  /* Logo tiles show the site's logo when it loads and keep the initials when it does not. */
  Array.prototype.forEach.call(document.querySelectorAll(".logo img"), function (img) {
    var tile = img.parentNode;
    function ok() { tile.classList.add("has-img"); }
    function bad() { img.remove(); }
    if (img.complete) { img.naturalWidth > 0 ? ok() : bad(); }
    else { img.addEventListener("load", ok); img.addEventListener("error", bad); }
  });

  var modeBtn = document.getElementById("mode");
  modeBtn.addEventListener("click", toggleDark);

  /* ---------- Calendar ---------- */
  var elDate = document.getElementById("cal-date");
  var elDay = document.getElementById("cal-day");
  var elTod = document.getElementById("cal-tod");
  var elTime = document.getElementById("cal-time");
  var elWk = document.getElementById("cal-wk");
  var elMoon = document.getElementById("moon");
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function moonSvg(d) {
    var SYN = 29.530588853;
    var ref = Date.UTC(2000, 0, 6, 18, 14);
    var p = (((d.getTime() - ref) / 86400000) % SYN + SYN) % SYN / SYN;
    var waning = p > 0.5;
    var q = waning ? 1 - p : p;
    var c = Math.cos(2 * Math.PI * q);
    var rx = (10 * Math.abs(c)).toFixed(2);
    var sweep = c > 0 ? 0 : 1;
    var lit = "M0 -10 A10 10 0 0 1 0 10 A" + rx + " 10 0 0 " + sweep + " 0 -10Z";
    var flip = waning ? ' transform="scale(-1 1)"' : "";
    elMoon.innerHTML =
      '<circle r="10" fill="#0a1a66" stroke="#ffe66b" stroke-width="1.4"/>' +
      '<path d="' + lit + '" fill="#ffe66b"' + flip + "/>";
    elMoon.setAttribute("aria-label", "Moon phase " + Math.round(p * 100) + " percent through the cycle");
  }
  var lastTod = "";
  function tick() {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    elDate.textContent = (d.getMonth() + 1) + "/" + d.getDate();
    elDay.textContent = DAYS[d.getDay()];
    elWk.textContent = d.getDay() === 0 || d.getDay() === 6 ? "WEEKEND" : "WEEKDAY";
    elTime.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
    var t = todOf(d.getHours());
    elTod.textContent = t.label;
    if (t.key !== lastTod) { lastTod = t.key; applyPalette(); moonSvg(d); }
  }
  applyPalette();
  tick();
  setInterval(tick, 15000);

  /* ---------- Page changes ---------- */
  function go(href) {
    if (reduce) { location.href = href; return; }
    document.body.classList.add("leaving");
    setTimeout(function () { location.href = href; }, 200);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    var h = a.getAttribute("href");
    if (!/^[\w-]+\.html(#.*)?$/.test(h)) return;
    e.preventDefault();
    go(h);
  });

  /* ---------- Menu ---------- */
  var menu = document.getElementById("menu");
  var listEl = document.getElementById("m-list");
  var cardEl = document.getElementById("m-card");
  var arcEl = document.getElementById("m-arc");
  var descEl = document.getElementById("m-desc");
  var openBtn = document.getElementById("p-list");
  var rows = [];
  var sel = 0;
  var isOpen = false;
  var inertEls = Array.prototype.slice.call(document.querySelectorAll("main, footer"));
  inertEls.push(document.querySelector(".site-head"));

  function hourVal() { return dark ? "On" : "Off"; }
  function build() {
    listEl.innerHTML = "";
    rows = PAGES.map(function (it, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "m-row" + (it.id === page ? " here" : "");
      b.style.setProperty("--i", i);
      b.innerHTML = '<span class="m-num"></span><span class="m-name"></span><span class="m-rank"><small></small><b></b></span><span class="m-sub"></span>';
      b.querySelector(".m-num").textContent = it.num;
      b.querySelector(".m-name").textContent = it.name;
      b.querySelector("small").textContent = it.label;
      b.querySelector("b").textContent = it.act === "hour" ? hourVal() : it.val;
      b.querySelector(".m-sub").textContent = it.sub;
      b.addEventListener("pointermove", function (e) { if (e.pointerType === "touch" || i === sel) return; select(i, false); });
      b.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch" && i !== sel) select(i, false); });
      b.addEventListener("click", function () { select(i, false); activate(i); });
      li.appendChild(b);
      listEl.appendChild(li);
      return b;
    });
  }
  var T = window.LTLTarot;
  var faceEl = cardEl.querySelector(".mc-f");
  var backEl = cardEl.querySelector(".mc-b");
  if (T) { T.preload(PAGES.map(function (p) { return p.card; }).concat(["back"])); }
  backEl.style.backgroundImage = "url(assets/tarot/back.png)";
  function playCard(cls) {
    if (reduce) return;
    cardEl.classList.remove("deal", "swap");
    void cardEl.offsetWidth;
    cardEl.classList.add(cls);
  }
  function select(i, focus, first) {
    var changed = i !== sel;
    sel = i;
    rows.forEach(function (r, k) {
      var on = k === i;
      if (r.classList.contains("sel") !== on) r.classList.toggle("sel", on);
      r.setAttribute("aria-current", PAGES[k].id === page ? "page" : "false");
    });
    var it = PAGES[i];
    faceEl.style.backgroundImage = "url(assets/tarot/" + it.card + ".png)";
    if (first) playCard("deal");
    else if (changed) playCard("swap");
    arcEl.textContent = it.num + " / Arcana: " + it.arc;
    descEl.textContent = it.desc;
    if (focus) rows[i].focus({ preventScroll: true });
  }
  var closeTimer = 0;
  function finishClose() {
    clearTimeout(closeTimer);
    menu.classList.remove("closing");
    menu.hidden = true;
  }
  function openMenu(viaKey) {
    if (isOpen) return;
    clearTimeout(closeTimer);
    menu.classList.remove("closing");
    build();
    isOpen = true;
    var start = 0;
    PAGES.forEach(function (p, i) { if (p.id === page) start = i; });
    sel = -1;
    menu.classList.toggle("kb", viaKey === true);
    menu.hidden = false;
    document.documentElement.classList.add("menu-open");
    inertEls.forEach(function (el) { if (el) el.inert = true; });
    menu.inert = false;
    openBtn.setAttribute("aria-expanded", "true");
    select(start, true, true);
  }
  /* Closing plays a short exit instead of vanishing, hands the page back at once, and can be interrupted by reopening. */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    document.documentElement.classList.remove("menu-open");
    inertEls.forEach(function (el) { if (el) el.inert = false; });
    openBtn.setAttribute("aria-expanded", "false");
    if (reduce) { menu.hidden = true; return; }
    menu.classList.add("closing");
    closeTimer = setTimeout(finishClose, 180);
  }
  function activate(i) {
    var it = PAGES[i];
    if (it.act === "hour") {
      toggleDark();
      rows[i].querySelector("b").textContent = hourVal();
      return;
    }
    if (it.id === page) { closeMenu(); openBtn.focus(); return; }
    go(it.href);
  }

  /* The player lives in .site-head, which the menu makes inert. Keep it usable by closing first. */
  openBtn.addEventListener("click", function () { openMenu(false); });
  document.getElementById("m-ok").addEventListener("click", function () { activate(sel); });
  document.getElementById("m-back").addEventListener("click", function () { closeMenu(); openBtn.focus(); });
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    var typing = /INPUT|TEXTAREA|SELECT/.test(tag);
    if (!isOpen) {
      if (typing) return;
      /* Esc opens the menu; M still works too. */
      if (e.key === "Escape" || e.key === "m" || e.key === "M") {
        e.preventDefault();
        if (!e.repeat) openMenu(true);
      }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); if (!e.repeat) { closeMenu(); openBtn.focus(); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); select((sel + 1) % PAGES.length, true); }
    else if (e.key === "ArrowUp") { e.preventDefault(); select((sel - 1 + PAGES.length) % PAGES.length, true); }
    else if (e.key === "Home") { e.preventDefault(); select(0, true); }
    else if (e.key === "End") { e.preventDefault(); select(PAGES.length - 1, true); }
  });

  /* ---------- Persona-style hover menus ([data-pm]): hover, focus or tap an item to show its detail ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-pm]"), function (wrap) {
    var items = Array.prototype.slice.call(wrap.querySelectorAll(".pm > li"));
    var pane = wrap.querySelector(".pm-pane");
    var cur = -1;
    function pick(i) {
      if (i === cur) return;
      cur = i;
      items.forEach(function (li, k) { li.classList.toggle("on", k === i); });
      pane.innerHTML = items[i].querySelector(".pm-d").innerHTML + '<p class="pm-cmd">Command</p>';
      pane.classList.remove("pop");
      void pane.offsetWidth;
      if (!reduce) pane.classList.add("pop");
    }
    wrap.classList.add("pm-js");
    items.forEach(function (li, i) {
      var b = li.querySelector(".pm-btn");
      b.addEventListener("mouseenter", function () { pick(i); });
      b.addEventListener("focus", function () { pick(i); });
      b.addEventListener("click", function () { pick(i); if (window.innerWidth <= 900) pane.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          var n = (i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length;
          items[n].querySelector(".pm-btn").focus();
        }
      });
    });
    pick(0);
  });

  /* ---------- Header ----------
     Hides after a deliberate scroll down. Comes back at once when the pointer reaches the top edge or the header,
     on scroll up, swipe right, or keyboard focus. Never hides while the pointer or focus is inside it. */
  (function () {
    var root = document.documentElement;
    var head = document.querySelector(".site-head");
    var zone = document.createElement("div");
    zone.className = "head-zone";
    zone.setAttribute("aria-hidden", "true");
    document.body.appendChild(zone);
    var tab = document.createElement("button");
    tab.type = "button";
    tab.className = "head-tab";
    tab.setAttribute("aria-label", "Show the player and menu");
    tab.innerHTML = '<svg viewBox="0 0 10 14" aria-hidden="true"><path d="M2 1l7 6-7 6z"/></svg>';
    document.body.appendChild(tab);
    var lastY = window.scrollY, down = 0, ticking = false, tx = 0, ty = 0, inside = false;
    function setHide(h) {
      if (h && (inside || menuIsOpen())) return;
      if (root.classList.contains("head-hide") !== h) root.classList.toggle("head-hide", h);
    }
    function menuIsOpen() { return root.classList.contains("menu-open"); }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = window.scrollY, dy = y - lastY;
        lastY = y;
        if (y < 80) { down = 0; setHide(false); return; }
        if (dy < -4) { down = 0; setHide(false); }
        else if (dy > 0) { down += dy; if (down > 28) setHide(true); }
      });
    }, { passive: true });
    /* hover in: the top strip and the header itself */
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      if (e.clientY <= 56) { down = 0; setHide(false); }
    }, { passive: true });
    tab.addEventListener("click", function () { down = 0; setHide(false); var b = document.getElementById("p-list"); if (b) b.focus({ preventScroll: true }); });
    tab.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") { down = 0; setHide(false); } });
    zone.addEventListener("pointerenter", function () { down = 0; setHide(false); });
    document.addEventListener("mouseleave", function () { inside = false; });
    if (head) {
      head.addEventListener("pointerenter", function () { inside = true; setHide(false); });
      head.addEventListener("pointerleave", function () { inside = false; });
      head.addEventListener("focusin", function () { setHide(false); });
    }
    window.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
      if (dx > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { down = 0; setHide(false); }
    }, { passive: true });
  })();
})();
