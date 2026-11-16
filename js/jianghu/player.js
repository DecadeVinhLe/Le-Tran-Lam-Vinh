/* Music player in the header (markup is injected by main.js).
   Built-in playlist (TRACKS below): 1. hien-thien-duyen.mp3, 2. ba-ho-thuyet.mp3. They play in order and loop back to the first.
   The "+" button adds any other audio file for the visit.
   Track, position and play state carry over to the next page through sessionStorage.
   Music fades out when you switch theme and fades back in once the new theme has loaded (see js/theme.js). */
(function () {
  "use strict";
  var pod = document.getElementById("pod");
  if (!pod) return;
  var elArtist = document.getElementById("p-artist");
  var elTitle = document.getElementById("p-title");
  var elMeter = document.getElementById("p-meter");
  var bPrev = document.getElementById("p-prev");
  var bPlay = document.getElementById("p-play");
  var bNext = document.getElementById("p-next");
  var bAdd = document.getElementById("p-add");
  var fileIn = document.getElementById("p-file");
  var iPlay = document.getElementById("i-play");
  var iPause = document.getElementById("i-pause");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "ltl-player-" + document.documentElement.getAttribute("data-theme"); /* each theme has its own track, so keep their play positions apart */

  var TRACKS = [
    { url: "assets/audio/hien-thien-duyen.mp3", artist: "Vietsub · Pinyin", title: "Hiện Thiên Duyên", builtin: true },
    { url: "assets/audio/ba-ho-thuyet.mp3", artist: "Bá Tước Johnny · Đường Bá Hổ Annie", title: "Bá Hổ Thuyết · 伯虎说", builtin: true }
  ];

  var audio = new Audio();
  audio.preload = "metadata";
  var tracks = TRACKS.slice();
  var playing = false;
  var saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) {}
  var idx = saved && saved.i >= 0 && saved.i < TRACKS.length ? saved.i : 0; /* come back to the same song */
  var resume = saved; /* position to restore once the track's metadata is in; cleared when the person picks a track */

  /* Volume fades. Browsers that lock volume (iOS) just ignore them. */
  var fadeRaf = 0;
  function fadeTo(v, ms) {
    cancelAnimationFrame(fadeRaf);
    if (reduce || !ms) { audio.volume = v; return; }
    var from = audio.volume, t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, Math.max(0, (now - t0) / ms));
      audio.volume = from + (v - from) * k;
      if (k < 1) fadeRaf = requestAnimationFrame(step);
    })(t0);
  }
  /* Arriving from a theme switch: start silent, then swell as the curtain lifts. */
  if (window.LTLTheme && window.LTLTheme.arriving) {
    audio.volume = 0;
    window.addEventListener("ltl:theme-lift", function () { fadeTo(1, 1100); });
    setTimeout(function () { if (audio.volume === 0) fadeTo(1, 600); }, 5000); /* safety */
  }
  window.addEventListener("ltl:theme-leave", function () { if (playing) fadeTo(0, 380); persist(); });

  function ui() {
    pod.classList.toggle("playing", playing);
    iPlay.hidden = playing;
    iPause.hidden = !playing;
    bPlay.setAttribute("aria-label", playing ? "Pause" : "Play");
  }
  function fitTitle() {
    elTitle.classList.remove("scroll");
    elTitle.style.removeProperty("--shift");
    requestAnimationFrame(function () {
      var over = elTitle.scrollWidth - elTitle.parentNode.clientWidth;
      if (over > 2 && !reduce) {
        elTitle.style.setProperty("--shift", (-over - 4) + "px");
        elTitle.style.setProperty("--dur", Math.max(4, over / 22 + 2) + "s");
        elTitle.classList.add("scroll");
      }
    });
  }
  function show(artist, title) {
    elArtist.textContent = artist;
    elTitle.textContent = title;
    elMeter.style.width = "0";
    fitTitle();
  }

  function loadIdx(i, autoplay) {
    idx = i;
    resume = null;
    audio.pause();
    audio.loop = tracks.length === 1;
    audio.src = tracks[idx].url;
    show(tracks[idx].artist, tracks[idx].title);
    if (autoplay) play(); else { playing = false; ui(); }
  }
  function fail() {
    playing = false;
    ui();
    show("error", tracks[idx].builtin ? "Add " + tracks[idx].url : "This file can't be played here");
  }
  function play() {
    var p = audio.play();
    playing = true;
    ui();
    if (p && p.catch) p.catch(function () { if (!audio.error) { playing = false; ui(); } });
  }
  function pause() { audio.pause(); playing = false; ui(); }
  function next() {
    if (tracks.length > 1) loadIdx((idx + 1) % tracks.length, playing);
    else audio.currentTime = 0;
  }
  function prev() {
    if (audio.currentTime > 3 || tracks.length === 1) { audio.currentTime = 0; return; }
    loadIdx((idx - 1 + tracks.length) % tracks.length, playing);
  }

  bPlay.addEventListener("click", function () { if (playing) pause(); else play(); });
  bNext.addEventListener("click", next);
  bPrev.addEventListener("click", prev);
  bAdd.addEventListener("click", function () { fileIn.click(); });
  audio.addEventListener("ended", function () { loadIdx((idx + 1) % tracks.length, true); });
  audio.addEventListener("error", fail);
  audio.addEventListener("loadedmetadata", function () {
    if (resume && tracks[idx].builtin) {
      if (resume.t > 0 && resume.t < audio.duration) { try { audio.currentTime = resume.t; } catch (e) {} }
      var again = resume.playing;
      resume = null;
      if (again) play();
    }
  });
  fileIn.addEventListener("change", function () {
    var list = Array.prototype.slice.call(fileIn.files || []);
    if (!list.length) return;
    var first = tracks.length;
    list.forEach(function (f) {
      var base = f.name.replace(/\.[^.]+$/, "");
      var parts = base.split(" - ");
      tracks.push({
        url: URL.createObjectURL(f),
        artist: parts.length > 1 ? parts[0].trim() : "My music",
        title: parts.length > 1 ? parts.slice(1).join(" - ").trim() : base
      });
    });
    fileIn.value = "";
    loadIdx(first, true);
  });

  function persist() {
    try {
      if (tracks[idx] && tracks[idx].builtin) sessionStorage.setItem(KEY, JSON.stringify({ i: idx, t: audio.currentTime || 0, playing: playing }));
    } catch (e) {}
  }
  window.addEventListener("pagehide", persist);
  document.addEventListener("visibilitychange", function () { if (document.hidden) persist(); });

  setInterval(function () {
    elMeter.style.width = audio.duration > 0 ? ((audio.currentTime / audio.duration) * 100).toFixed(1) + "%" : "0";
    if (playing) persist();
  }, 500);

  audio.loop = tracks.length === 1;
  audio.src = tracks[idx].url;
  show(tracks[idx].artist, tracks[idx].title);
  ui();
})();
