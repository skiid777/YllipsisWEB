(function () {
  'use strict';

  var Y = window.Yllipsis;
  var boards = [];
  var byId = {};
  var st = { b: null, pin: null, f: null, ex: 'all', q: '' };

  var $ = function (id) { return document.getElementById(id); };
  var tr = function (a) { return Y.t(a[0], a[1]); };

  var TAGS = {
    dig: ['Cyfrowe I/O', 'Digital I/O'],
    adc: ['Wejście analogowe (ADC)', 'Analog input (ADC)'],
    pwm: ['PWM', 'PWM'],
    dac: ['DAC (wyjście analogowe)', 'DAC (analog output)'],
    touch: ['Dotyk pojemnościowy', 'Capacitive touch'],
    i2c: ['I²C', 'I²C'],
    spi: ['SPI', 'SPI'],
    uart: ['UART', 'UART'],
    int: ['Przerwania', 'Interrupts'],
    pwr: ['Zasilanie / GND', 'Power / GND'],
    in: ['Tylko wejście', 'Input only'],
    strap: ['Pin startowy', 'Strapping pin'],
    flash: ['Flash, nie używać', 'Flash, do not use'],
    usb: ['USB', 'USB'],
    rst: ['Reset / EN', 'Reset / EN'],
    led: ['Dioda na płytce', 'On-board LED']
  };
  var KINDS = {
    pwr: ['Zasilanie', 'Power'],
    gnd: ['Masa (GND)', 'Ground'],
    io: ['Cyfrowy', 'Digital'],
    adc: ['Analogowy', 'Analog'],
    com: ['Magistrala', 'Bus'],
    sys: ['Systemowy, uwaga', 'System, caution']
  };
  var FILTERS = ['dig', 'adc', 'pwm', 'dac', 'touch', 'i2c', 'spi', 'uart', 'pwr'];
  var GROUPS = [['esp32', 'ESP32'], ['arduino', 'Arduino']];
  var STEP = 24;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function p(n, s, k, t, x, w) {
    return { n: n, s: s || '', k: k, t: t, x: x || null, w: w || null };
  }

  function add(b) {
    b.pins = [];
    b.headers.forEach(function (h) {
      h.pins.forEach(function (pin) {
        pin.i = b.pins.length;
        b.pins.push(pin);
      });
    });
    boards.push(b);
    byId[b.id] = b;
  }

  window.Pinout = { p: p, add: add };

  var HL = /("[^"\n]*")|(\b(?:void|int|const|float|double|if|else|for|while|return|uint8_t|uint16_t|uint32_t|byte|bool|true|false|static|unsigned|long|char|volatile|String)\b)|(\b[A-Z][A-Z0-9_]+\b|\bA\d{1,2}\b)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*(?=\())|(#include\s*<[^>]+>)/g;
  function highlight(code) {
    var out = '', last = 0, m;
    HL.lastIndex = 0;
    while ((m = HL.exec(code))) {
      out += esc(code.slice(last, m.index));
      var c = m[1] ? 's' : m[2] ? 'k' : m[3] ? 'c' : m[4] ? 'n' : m[5] ? 'f' : 'k';
      out += '<span class="h-' + c + '">' + esc(m[0]) + '</span>';
      last = HL.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  function cur() { return byId[st.b]; }

  function writeUrl() {
    var o = { b: st.b };
    if (st.pin != null) o.pin = st.pin;
    if (st.f) o.f = st.f;
    Y.setParams(o);
  }

  function boardFilters(b) {
    var have = {};
    b.pins.forEach(function (pin) { pin.t.forEach(function (t) { have[t] = true; }); });
    return FILTERS.filter(function (f) { return have[f]; });
  }

  function featSVG(f) {
    var cx = f.x + (f.w || 0) / 2, cy = f.y + (f.h || 0) / 2;
    switch (f.t) {
      case 'ant': {
        var pts = [], n = 9, i;
        for (i = 0; i < n; i++) pts.push((f.x + 10 + i * (f.w - 20) / (n - 1)).toFixed(1) + ' ' + (i % 2 ? f.y + f.h - 8 : f.y + 8));
        return '<rect class="f-antbg" x="' + f.x + '" y="' + f.y + '" width="' + f.w + '" height="' + f.h + '" rx="4"/><path class="f-ant" d="M' + pts.join(' L') + '"/>';
      }
      case 'mod':
        return '<rect class="f-mod" x="' + f.x + '" y="' + f.y + '" width="' + f.w + '" height="' + f.h + '" rx="4"/>' +
          '<rect class="f-modin" x="' + (f.x + 6) + '" y="' + (f.y + 6) + '" width="' + (f.w - 12) + '" height="' + (f.h - 12) + '" rx="3"/>' +
          '<text class="f-modt" x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle">' + esc(f.txt) + '</text>';
      case 'ic':
        return '<rect class="f-ic" x="' + f.x + '" y="' + f.y + '" width="' + f.w + '" height="' + f.h + '" rx="3"/>' +
          (f.txt ? '<text class="f-ict" x="' + cx + '" y="' + (cy + 3) + '" text-anchor="middle">' + esc(f.txt) + '</text>' : '');
      case 'btn':
        return '<rect class="f-btnb" x="' + (f.x - 13) + '" y="' + (f.y - 9) + '" width="26" height="18" rx="3"/><circle class="f-btn" cx="' + f.x + '" cy="' + f.y + '" r="5.5"/>' +
          '<text class="f-txt" x="' + f.x + '" y="' + (f.y + 24) + '" text-anchor="middle">' + esc(f.txt) + '</text>';
      case 'usb':
      case 'jack':
        return '<rect class="f-' + f.t + '" x="' + f.x + '" y="' + f.y + '" width="' + f.w + '" height="' + f.h + '" rx="4"/>' +
          '<rect class="f-usbi" x="' + (f.x + 6) + '" y="' + (f.y + 6) + '" width="' + (f.w - 12) + '" height="' + (f.h - 12) + '" rx="2"/>' +
          '<text class="f-usbt" x="' + cx + '" y="' + (cy + 3) + '" text-anchor="middle"' + (f.rot ? ' transform="rotate(' + f.rot + ' ' + cx + ' ' + cy + ')"' : '') + '>' + esc(f.txt) + '</text>';
      case 'led':
        if (f.c === 'rgb') {
          return '<circle class="f-led c-red" cx="' + (f.x - 7) + '" cy="' + f.y + '" r="3.5"/><circle class="f-led c-green" cx="' + f.x + '" cy="' + f.y + '" r="3.5"/><circle class="f-led c-blue" cx="' + (f.x + 7) + '" cy="' + f.y + '" r="3.5"/>' +
            (f.txt ? '<text class="f-txt" x="' + f.x + '" y="' + (f.y + 17) + '" text-anchor="middle">' + esc(f.txt) + '</text>' : '');
        }
        return '<circle class="f-led c-' + f.c + '" cx="' + f.x + '" cy="' + f.y + '" r="4"/>' +
          (f.txt ? '<text class="f-txt" x="' + f.x + '" y="' + (f.y + 16) + '" text-anchor="middle">' + esc(f.txt) + '</text>' : '');
      case 'hdr': {
        var s = '', r, c;
        for (r = 0; r < f.rows; r++) for (c = 0; c < f.cols; c++) s += '<rect class="f-hp" x="' + (f.x + c * 12 - 4) + '" y="' + (f.y + r * 12 - 4) + '" width="8" height="8" rx="1"/>';
        return s + '<text class="f-txt" x="' + (f.x + (f.cols - 1) * 6) + '" y="' + (f.y + f.rows * 12 + 6) + '" text-anchor="middle">' + esc(f.txt) + '</text>';
      }
      case 'txt':
        return '<text class="f-txt ' + (f.big ? 'big' : '') + '" x="' + f.x + '" y="' + f.y + '" text-anchor="middle"' + (f.rot ? ' transform="rotate(' + f.rot + ' ' + f.x + ' ' + f.y + ')"' : '') + '>' + esc(f.txt) + '</text>';
      default:
        throw new Error('pinout: unknown feature ' + f.t);
    }
  }

  function pinSVG(b, h, pin, idx) {
    var x = h.dir === 'v' ? h.x : h.x + idx * STEP;
    var y = h.dir === 'v' ? h.y + idx * STEP : h.y;
    var fs = b.fs || 12;
    var w = Math.round(pin.n.length * fs * 0.64 + 18);
    var ph = fs + 10;
    var gap = 16;
    var rot = h.out === 't' ? -90 : h.out === 'b' ? 90 : 0;
    var dir = h.out === 'l' ? -1 : 1;
    var x0 = dir > 0 ? gap : -gap - w;
    var label = pin.n + (pin.s ? ', ' + pin.s : '');
    var s = '<g class="pn-pin k-' + pin.k + (h.onpcb ? ' onpcb' : '') + '" data-i="' + pin.i + '" tabindex="0" role="button" aria-label="' + esc(label) + '" transform="translate(' + x + ' ' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + '">';
    var secW = pin.s && (h.out === 'l' || h.out === 'r') ? Math.round(pin.s.length * (fs - 1) * 0.62) + 12 : 0;
    s += '<rect class="hit" x="' + (dir > 0 ? -8 : -(gap + w + secW + 4)) + '" y="-11" width="' + (gap + w + secW + 12) + '" height="22"/>';
    s += '<line class="lead" x1="0" y1="0" x2="' + dir * gap + '" y2="0"/>';
    s += '<circle class="ring" r="10"/><circle class="pad" r="6"/><circle class="hole" r="2.4"/>';
    s += '<rect class="pill" x="' + x0 + '" y="' + (-ph / 2) + '" width="' + w + '" height="' + ph + '" rx="' + ph / 2 + '"/>';
    s += '<text class="pn-t" x="' + (x0 + w / 2) + '" y="' + (fs * 0.36) + '" text-anchor="middle" style="font-size:' + fs + 'px">' + esc(pin.n) + '</text>';
    if (pin.s && (h.out === 'l' || h.out === 'r')) {
      s += '<text class="pn-s" x="' + (dir > 0 ? x0 + w + 8 : x0 - 8) + '" y="' + (fs * 0.34) + '" text-anchor="' + (dir > 0 ? 'start' : 'end') + '" style="font-size:' + (fs - 1) + 'px">' + esc(pin.s) + '</text>';
    }
    return s + '</g>';
  }

  function boardHTML(b, intro) {
    var pd = b.pad;
    var W = b.w + pd.l + pd.r, H = b.h + pd.t + pd.b;
    var vb = (-pd.l) + ' ' + (-pd.t) + ' ' + W + ' ' + H;
    var r = b.r || 14;
    var rect = '<rect x="0" y="0" width="' + b.w + '" height="' + b.h + '" rx="' + r + '"';
    var svg = function (cls, inner, extra) { return '<svg class="pn-l ' + cls + '" viewBox="' + vb + '" ' + (extra || 'aria-hidden="true"') + '>' + inner + '</svg>'; };
    var holes = (b.holes || []).map(function (h) { return '<circle class="f-hole" cx="' + h[0] + '" cy="' + h[1] + '" r="5"/>'; }).join('');
    var feats = b.feats.map(featSVG).join('');
    var pins = b.headers.map(function (h) {
      return h.pins.map(function (pin, idx) { return pinSVG(b, h, pin, idx); }).join('');
    }).join('');
    var pads = b.headers.map(function (h) {
      return h.pins.map(function (pin, idx) {
        var x = h.dir === 'v' ? h.x : h.x + idx * STEP;
        var y = h.dir === 'v' ? h.y + idx * STEP : h.y;
        return '<circle class="f-via" cx="' + x + '" cy="' + y + '" r="9"/>';
      }).join('');
    }).join('');
    return '<div class="pn-board pcb-' + b.pcb + (intro ? ' intro' : '') + '" id="pn-board" style="aspect-ratio:' + W + ' / ' + H + '">' +
      svg('pn-l-sh', rect + ' class="shadow"/>') +
      svg('pn-l-ed', rect + ' class="edge"/>') +
      svg('pn-l-pcb', rect + ' class="pcb"/>' + pads + holes + feats) +
      svg('pn-l-pins', pins, 'role="group" aria-label="' + esc(tr(b.name)) + '"') +
      '</div>';
  }

  function applyScene(b) {
    var sc = $('pn-scene');
    sc.style.setProperty('--bw', b.show + 'px');
    sc.style.setProperty('--bmin', (b.min || 0) + 'px');
  }

  function markPins() {
    var b = cur();
    document.querySelectorAll('#pn-board .pn-pin').forEach(function (g) {
      var pin = b.pins[+g.getAttribute('data-i')];
      g.classList.toggle('is-sel', st.pin === pin.i);
      g.classList.toggle('off', !!st.f && pin.t.indexOf(st.f) < 0);
      g.setAttribute('aria-pressed', String(st.pin === pin.i));
    });
  }

  function chips(pin) {
    return pin.t.map(function (t) { return '<span class="pn-chip t-' + t + '">' + esc(tr(TAGS[t])) + '</span>'; }).join('');
  }

  function kindBadge(k) {
    return '<span class="pn-kb k-' + k + '"><i></i>' + esc(tr(KINDS[k])) + '</span>';
  }

  function renderTabs() {
    $('pn-tabs').innerHTML = GROUPS.map(function (g) {
      return '<div class="pn-grp"><span class="pn-grp-l">' + g[1] + '</span><div class="pn-grp-b" role="tablist" aria-label="' + g[1] + '">' +
        boards.filter(function (b) { return b.family === g[0]; }).map(function (b) {
          return '<button type="button" role="tab" class="pn-tab" data-b="' + b.id + '" aria-selected="' + (b.id === st.b) + '">' + esc(b.tab) + '</button>';
        }).join('') + '</div></div>';
    }).join('');
  }

  function renderFilters() {
    var b = cur();
    $('pn-filters').innerHTML = '<span class="pn-fl">' + esc(Y.t('Podświetl:', 'Highlight:')) + '</span>' +
      boardFilters(b).map(function (f) {
        return '<button type="button" class="pn-f" data-f="' + f + '" aria-pressed="' + (st.f === f) + '">' + esc(tr(TAGS[f])) + '</button>';
      }).join('');
  }

  function renderLegend() {
    var b = cur(), have = {};
    b.pins.forEach(function (pin) { have[pin.k] = true; });
    $('pn-legend').innerHTML = Object.keys(KINDS).filter(function (k) { return have[k]; }).map(kindBadge).join('');
  }

  function renderInfo() {
    var b = cur();
    var pin = st.pin != null ? b.pins[st.pin] : null;
    var h;
    if (!pin) {
      h = '<p class="pn-eyebrow">' + esc(Y.t('Płytka', 'Board')) + '</p><h3 class="pn-i-t">' + esc(tr(b.name)) + '</h3>' +
        '<p class="pn-muted">' + esc(Y.t('Kliknij dowolny pin na płytce, żeby zobaczyć jego funkcje i ograniczenia.', 'Click any pin on the board to see its functions and limits.')) + '</p>' +
        '<dl class="pn-facts">' + b.specs.slice(0, 6).map(function (s) {
          return '<div><dt>' + esc(Y.t(s[0], s[1])) + '</dt><dd>' + esc(Array.isArray(s[2]) ? tr(s[2]) : s[2]) + '</dd></div>';
        }).join('') + '</dl>';
    } else {
      h = '<p class="pn-eyebrow">' + esc(Y.t('Pin ', 'Pin ')) + (pin.i + 1) + ' / ' + b.pins.length + '</p>' +
        '<h3 class="pn-i-t mono">' + esc(pin.n) + '</h3>' +
        (pin.s ? '<p class="pn-alt">' + esc(pin.s) + '</p>' : '') +
        '<div class="pn-row">' + kindBadge(pin.k) + '</div>' +
        '<div class="pn-chips">' + chips(pin) + '</div>' +
        (pin.x ? '<p class="pn-note">' + esc(tr(pin.x)) + '</p>' : '') +
        (pin.w ? '<p class="pn-warn"><b>' + esc(Y.t('Uwaga. ', 'Careful. ')) + '</b>' + esc(tr(pin.w)) + '</p>' : '') +
        '<button type="button" class="pn-ghost" data-act="clear">' + esc(Y.t('Wyczyść wybór', 'Clear selection')) + '</button>';
    }
    $('pn-info').innerHTML = h;
  }

  function renderAbout() {
    var b = cur();
    $('pn-about').innerHTML =
      '<div class="pn-about-t">' + b.desc.map(function (d) { return '<p>' + esc(tr(d)) + '</p>'; }).join('') + '</div>' +
      '<div class="pn-uses"><h3>' + esc(Y.t('Co można z nią zrobić', 'What you can do with it')) + '</h3><ul>' +
      b.uses.map(function (u) { return '<li>' + esc(tr(u)) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="pn-specs"><h3>' + esc(Y.t('Parametry', 'Specs')) + '</h3><dl class="pn-facts">' +
      b.specs.map(function (s) {
        return '<div><dt>' + esc(Y.t(s[0], s[1])) + '</dt><dd>' + esc(Array.isArray(s[2]) ? tr(s[2]) : s[2]) + '</dd></div>';
      }).join('') + '</dl></div>';
  }

  function renderExamples() {
    var b = cur();
    var kinds = [['all', ['Wszystkie', 'All']], ['dig', ['Cyfrowe', 'Digital']], ['ana', ['Analogowe i PWM', 'Analog and PWM']], ['bus', ['Komunikacja', 'Communication']]];
    var have = {};
    b.ex.forEach(function (e) { have[e.k] = true; });
    var bar = kinds.filter(function (k) { return k[0] === 'all' || have[k[0]]; }).map(function (k) {
      return '<button type="button" class="pn-f" data-ex="' + k[0] + '" aria-pressed="' + (st.ex === k[0]) + '">' + esc(tr(k[1])) + '</button>';
    }).join('');
    var cards = b.ex.map(function (e, i) {
      if (st.ex !== 'all' && st.ex !== e.k) return '';
      return '<article class="pn-ex"><header><span class="pn-kb ' + (e.k === 'dig' ? 'k-io' : e.k === 'ana' ? 'k-adc' : 'k-com') + '"><i></i>' +
        esc(tr(e.k === 'dig' ? kinds[1][1] : e.k === 'ana' ? kinds[2][1] : kinds[3][1])) + '</span><h3>' + esc(tr(e.t)) + '</h3></header>' +
        '<p>' + esc(tr(e.d)) + '</p>' +
        '<p class="pn-wire"><span>' + esc(Y.t('Podłączenie', 'Wiring')) + '</span>' + esc(tr(e.w)) + '</p>' +
        '<div class="pn-code"><button type="button" class="pn-copy" data-copy="' + i + '">' + esc(Y.t('Kopiuj', 'Copy')) + '</button><pre><code>' + highlight(e.code) + '</code></pre></div></article>';
    }).join('');
    $('pn-examples').innerHTML = '<div class="pn-fbar">' + bar + '</div><div class="pn-exgrid">' + cards + '</div>';
  }

  function renderIde() {
    var b = cur(), d = b.ide;
    var menu = '<figure class="pn-menu"><div class="pn-menu-bar"><i></i><i></i><i></i><span>Arduino IDE 2 · Tools</span></div><ul>' +
      d.rows.map(function (r) { return '<li><span class="mk">' + esc(r[0]) + '</span><span class="mv">' + esc(r[1]) + '</span></li>'; }).join('') +
      '</ul><figcaption>' + esc(Y.t('Ilustracja ustawień z menu Tools, nie zrzut ekranu. Nazwy opcji są po angielsku, tak jak w IDE.', 'Illustration of the Tools menu settings, not a screenshot. Option names are in English, as in the IDE.')) + '</figcaption></figure>';
    var table = '<div class="pn-tblwrap"><table class="pn-tbl"><thead><tr><th>' + esc(Y.t('Ustawienie', 'Setting')) + '</th><th>' + esc(Y.t('Wartość', 'Value')) + '</th><th>' + esc(Y.t('Dlaczego', 'Why')) + '</th></tr></thead><tbody>' +
      d.rows.map(function (r) {
        return '<tr><td class="mono">' + esc(r[0]) + '</td><td class="mono strong">' + esc(r[1]) + '</td><td>' + esc(r[2] ? tr(r[2]) : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    var url = d.url ? '<div class="pn-url"><span>' + esc(Y.t('Adres do Preferences → Additional boards manager URLs', 'URL for Preferences → Additional boards manager URLs')) + '</span><code>' + esc(d.url) + '</code><button type="button" class="pn-copy" data-copyurl="1">' + esc(Y.t('Kopiuj', 'Copy')) + '</button></div>' : '';
    $('pn-ide').innerHTML = '<div class="pn-ide-top">' + menu + '<div class="pn-ide-side">' +
      '<h3>' + esc(Y.t('Krok po kroku', 'Step by step')) + '</h3><ol class="pn-steps">' + d.steps.map(function (s) { return '<li>' + esc(tr(s)) + '</li>'; }).join('') + '</ol>' + url + '</div></div>' +
      table +
      '<div class="pn-tips"><h3>' + esc(Y.t('Gdy coś nie działa', 'When something goes wrong')) + '</h3><ul>' + d.tips.map(function (s) { return '<li>' + esc(tr(s)) + '</li>'; }).join('') + '</ul></div>';
  }

  function norm(s) {
    return String(s).toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function renderTable() {
    var b = cur();
    var words = norm(st.q).trim().split(/\s+/).filter(Boolean);
    var rows = b.pins.filter(function (pin) {
      if (st.f && pin.t.indexOf(st.f) < 0) return false;
      if (!words.length) return true;
      var hay = norm([pin.n, pin.s, tr(KINDS[pin.k]), pin.t.map(function (t) { return TAGS[t].join(' '); }).join(' '), pin.x ? pin.x.join(' ') : '', pin.w ? pin.w.join(' ') : ''].join(' '));
      return words.every(function (w) { return hay.indexOf(w) >= 0; });
    });
    $('pn-tbody').innerHTML = rows.length ? rows.map(function (pin) {
      return '<tr data-i="' + pin.i + '" tabindex="0" class="' + (st.pin === pin.i ? 'is-sel' : '') + '"><td class="mono strong">' + esc(pin.n) + '</td><td class="mono">' + esc(pin.s) + '</td><td>' + kindBadge(pin.k) + '</td><td class="pn-tchips">' + chips(pin) + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="pn-muted">' + esc(Y.t('Nic nie pasuje.', 'Nothing matches.')) + '</td></tr>';
    $('pn-count').textContent = rows.length + ' / ' + b.pins.length;
  }

  function renderNames() {
    var b = cur();
    document.querySelectorAll('[data-for]').forEach(function (n) { n.textContent = tr(b.name); });
    document.title = Y.t('Pinout ', 'Pinout ') + tr(b.name) + ' · Yllipsis-skiid777';
  }

  function renderAll(intro) {
    var b = cur();
    renderTabs();
    renderFilters();
    renderLegend();
    applyScene(b);
    $('pn-board-host').innerHTML = boardHTML(b, intro);
    markPins();
    renderInfo();
    renderAbout();
    renderExamples();
    renderIde();
    renderTable();
    renderNames();
  }

  function setBoard(id) {
    if (id === st.b) return;
    st.b = id;
    st.pin = null;
    st.ex = 'all';
    if (st.f && boardFilters(cur()).indexOf(st.f) < 0) st.f = null;
    writeUrl();
    renderAll(true);
  }

  function selectPin(i) {
    st.pin = st.pin === i ? null : i;
    writeUrl();
    markPins();
    renderInfo();
    renderTable();
  }

  function setFilter(f) {
    st.f = st.f === f ? null : f;
    writeUrl();
    renderFilters();
    markPins();
    renderTable();
  }

  function flash(btn, text) {
    var old = btn.getAttribute('data-old') || btn.textContent;
    btn.setAttribute('data-old', old);
    btn.textContent = text;
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.textContent = old; btn.removeAttribute('data-old'); }, 1600);
  }

  function copy(text, btn) {
    navigator.clipboard.writeText(text).then(function () {
      flash(btn, Y.t('Skopiowano', 'Copied'));
    }, function (err) {
      console.error('pinout: copy failed', err);
      flash(btn, Y.t('Nie udało się', 'Failed'));
    });
  }

  function bindScene() {
    var sc = $('pn-scene');
    sc.addEventListener('click', function (ev) {
      var g = ev.target.closest('.pn-pin');
      if (g) selectPin(+g.getAttribute('data-i'));
    });
    sc.addEventListener('keydown', function (ev) {
      var g = ev.target.closest && ev.target.closest('.pn-pin');
      if (g && (ev.key === 'Enter' || ev.key === ' ')) {
        ev.preventDefault();
        selectPin(+g.getAttribute('data-i'));
      }
    });
  }

  function bind() {
    bindScene();
    $('pn-tabs').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-b]');
      if (b) setBoard(b.getAttribute('data-b'));
    });
    $('pn-filters').addEventListener('click', function (ev) {
      var f = ev.target.closest('[data-f]');
      if (f) setFilter(f.getAttribute('data-f'));
    });
    $('pn-info').addEventListener('click', function (ev) {
      if (ev.target.closest('[data-act="clear"]')) selectPin(st.pin);
    });
    $('pn-examples').addEventListener('click', function (ev) {
      var f = ev.target.closest('[data-ex]');
      if (f) {
        st.ex = f.getAttribute('data-ex');
        renderExamples();
        return;
      }
      var c = ev.target.closest('[data-copy]');
      if (c) copy(cur().ex[+c.getAttribute('data-copy')].code, c);
    });
    $('pn-ide').addEventListener('click', function (ev) {
      var c = ev.target.closest('[data-copyurl]');
      if (c) copy(cur().ide.url, c);
    });
    $('pn-q').addEventListener('input', function (ev) {
      st.q = ev.target.value;
      renderTable();
    });
    var rowGo = function (ev) {
      var row = ev.target.closest('tr[data-i]');
      if (!row) return;
      var i = +row.getAttribute('data-i');
      if (st.pin !== i) selectPin(i);
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      $('pn-stage').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    $('pn-tbody').addEventListener('click', rowGo);
    $('pn-tbody').addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') rowGo(ev);
    });
    document.addEventListener('yllipsis:lang', function () { renderAll(false); });
  }

  function init() {
    if (!boards.length) throw new Error('pinout: no boards registered');
    var q = Y.params();
    var b = q.get('b');
    st.b = byId[b] ? b : boards[0].id;
    var n = parseInt(q.get('pin'), 10);
    st.pin = Number.isInteger(n) && n >= 0 && n < cur().pins.length ? n : null;
    var f = q.get('f');
    st.f = FILTERS.indexOf(f) >= 0 && boardFilters(cur()).indexOf(f) >= 0 ? f : null;
    bind();
    renderAll(true);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
