(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = { theme: 'yllipsis.theme', lang: 'yllipsis.lang' };
  var THEMES = ['light', 'dark'];
  var LANGS = ['pl', 'en'];
  var THEME_COLOR = { light: '#ffffff', dark: '#0a0a0a' };

  function read(key, allowed, fallback) {
    try {
      var v = localStorage.getItem(key);
      return allowed.indexOf(v) >= 0 ? v : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {  }
  }

  var state = { theme: read(KEY.theme, THEMES, 'light'), lang: read(KEY.lang, LANGS, 'pl') };
  root.setAttribute('data-theme', state.theme);
  root.setAttribute('lang', state.lang);

  var reduceMotion = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function applyI18n(scope) {
    (scope || document).querySelectorAll('[data-pl]').forEach(function (n) {
      var v = n.getAttribute('data-' + state.lang);
      if (v == null) return;
      var attr = n.getAttribute('data-attr');
      if (attr) n.setAttribute(attr, v);
      else n.textContent = v;
    });
  }

  function syncThemeColor() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', THEME_COLOR[state.theme]);
  }

  function syncBar() {
    document.querySelectorAll('.yl-lang').forEach(function (g) {
      g.setAttribute('data-v', state.lang);
      g.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-lang') === state.lang)); });
    });
    document.querySelectorAll('.yl-theme').forEach(function (b) { b.setAttribute('aria-pressed', String(state.theme === 'dark')); });
  }

  function transition(cls, change, afterReady) {
    if (!document.startViewTransition || reduceMotion()) { change(); return; }
    root.classList.add(cls);
    var t = document.startViewTransition(change);
    if (afterReady) t.ready.then(afterReady).catch(function () {  });
    t.finished.then(function () { root.classList.remove(cls); }, function () { root.classList.remove(cls); });
  }

  function emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail: detail })); }

  function applyLang(l) {
    state.lang = l;
    root.setAttribute('lang', l);
    applyI18n();
    syncBar();
    emit('yllipsis:lang', { lang: l });
  }
  function applyTheme(t) {
    state.theme = t;
    root.setAttribute('data-theme', t);
    syncThemeColor();
    syncBar();
    emit('yllipsis:theme', { theme: t });
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === state.lang) return;
    write(KEY.lang, l);
    transition('vt-lang', function () { applyLang(l); });
  }
  function setTheme(t, origin) {
    if (THEMES.indexOf(t) < 0 || t === state.theme) return;
    write(KEY.theme, t);
    var x = origin ? origin.x : window.innerWidth / 2;
    var y = origin ? origin.y : 0;
    var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    transition('vt-theme', function () { applyTheme(t); }, function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 720, easing: 'cubic-bezier(0.65, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  var SVG_SUN = '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var SVG_MOON = '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  var SVG_LINK = '<svg class="i-link" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></svg>';
  var SVG_OK = '<svg class="i-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var SVG_ERR = '<svg class="i-err" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function shareHTML() {
    return '<button type="button" class="yl-share" data-s="idle" data-attr="aria-label" data-pl="Kopiuj link do tego widoku" data-en="Copy link to this view">' +
      '<span class="yl-share-ic">' + SVG_LINK + SVG_OK + SVG_ERR + '</span>' +
      '<span class="yl-share-tx"><span class="t-idle" data-pl="Kopiuj link" data-en="Copy link"></span><span class="t-ok" data-pl="Skopiowano!" data-en="Copied!"></span><span class="t-err" data-pl="Nie udało się" data-en="Failed"></span></span>' +
      '<span class="yl-burst" aria-hidden="true">' + '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>' + '</span>' +
      '<span class="yl-sr" role="status" aria-live="polite"></span></button>';
  }

  function share(btn) {
    clearTimeout(btn._t);
    var live = btn.querySelector('.yl-sr');
    navigator.clipboard.writeText(location.href).then(function () {
      btn.setAttribute('data-s', 'idle');
      void btn.offsetWidth;
      btn.setAttribute('data-s', 'ok');
      live.textContent = state.lang === 'en' ? 'Link copied' : 'Link skopiowany';
    }, function (err) {
      console.error('yllipsis: copy link failed', err);
      btn.setAttribute('data-s', 'err');
      live.textContent = state.lang === 'en' ? 'Could not copy the link' : 'Nie udało się skopiować linku';
    });
    btn._t = setTimeout(function () { btn.setAttribute('data-s', 'idle'); live.textContent = ''; }, 1900);
  }

  function buildShares() {
    document.querySelectorAll('[data-yl-share]').forEach(function (slot) {
      var wrap = document.createElement('span');
      wrap.innerHTML = shareHTML();
      var btn = wrap.firstChild;
      slot.replaceWith(btn);
    });
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('.yl-share');
    if (b) share(b);
  });

  function params() { return new URLSearchParams(location.search); }
  function setParams(obj) {
    var p = new URLSearchParams();
    Object.keys(obj).forEach(function (k) { p.set(k, obj[k]); });
    history.replaceState(null, '', location.pathname + '?' + p.toString() + location.hash);
  }

  function buildBar() {
    var host = document.getElementById('yl-bar');
    if (!host) return;
    var cp = host.getAttribute('data-crumb-pl'), ce = host.getAttribute('data-crumb-en');
    host.className = 'yl-bar';
    host.innerHTML =
      '<div class="yl-bar-in">' +
      '<a class="yl-logo" href="/" data-attr="aria-label" data-pl="yllipsis, strona główna" data-en="yllipsis, home"><span>yllipsis</span><span class="yl-dots" aria-hidden="true"><i></i><i></i><i></i></span></a>' +
      (cp ? '<span class="yl-crumb" data-pl="' + esc(cp) + '" data-en="' + esc(ce || cp) + '"></span>' : '') +
      '<div class="yl-ctl">' +
      '<span data-yl-share></span>' +
      '<div class="yl-lang" role="radiogroup" data-attr="aria-label" data-pl="Język" data-en="Language"><span class="yl-thumb"></span>' +
      '<button type="button" role="radio" data-lang="pl">PL</button><button type="button" role="radio" data-lang="en">EN</button></div>' +
      '<button type="button" class="yl-theme" data-attr="aria-label" data-pl="Przełącz motyw jasny i ciemny" data-en="Switch between light and dark theme">' + SVG_SUN + SVG_MOON + '</button>' +
      '</div></div>';
    host.querySelectorAll('.yl-lang button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
    host.querySelector('.yl-theme').addEventListener('click', function (ev) {
      var r = ev.currentTarget.getBoundingClientRect();
      setTheme(state.theme === 'dark' ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });
  }

  function buildFoot() {
    var host = document.getElementById('yl-foot');
    if (!host) return;
    host.className = 'yl-foot';
    host.textContent = 'yllipsis.com \u00b7 ' + new Date().getFullYear() + ' \u00b7 made by skiid777';
  }

  function init() {
    buildBar();
    buildFoot();
    buildShares();
    applyI18n();
    syncBar();
    syncThemeColor();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.addEventListener('storage', function (ev) {
    if (ev.key === KEY.theme) { var t = read(KEY.theme, THEMES, 'light'); if (t !== state.theme) applyTheme(t); }
    if (ev.key === KEY.lang) { var l = read(KEY.lang, LANGS, 'pl'); if (l !== state.lang) applyLang(l); }
  });

  window.Yllipsis = {
    get lang() { return state.lang; },
    get theme() { return state.theme; },
    t: function (pl, en) { return state.lang === 'en' ? en : pl; },
    setLang: setLang,
    setTheme: setTheme,
    params: params,
    setParams: setParams
  };
})();
