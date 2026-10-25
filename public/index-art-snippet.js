  var PCOLORS = ['#d93636', '#e08a00', '#0e9f69', '#2f6df0', '#8a4fe0', '#4b5260'];
  function pinoutArt() {
    var pins = '';
    for (var i = 0; i < 6; i++) {
      var y = 52 + i * 18, c = PCOLORS[i];
      pins += '<rect class="b" style="--k:' + i + '" x="96" y="' + y + '" width="38" height="8" rx="4" fill="' + c + '"/>' +
        '<rect class="b" style="--k:' + (i + 6) + '" x="226" y="' + y + '" width="38" height="8" rx="4" fill="' + PCOLORS[5 - i] + '"/>' +
        '<circle class="c" style="--k:' + i + '" cx="136" cy="' + (y + 4) + '" r="5" fill="#d9b44a"/>' +
        '<circle class="c" style="--k:' + (i + 6) + '" cx="224" cy="' + (y + 4) + '" r="5" fill="#d9b44a"/>';
    }
    return '<div class="art" aria-hidden="true"><svg class="rs" viewBox="0 0 360 198">' +
      '<rect x="130" y="24" width="100" height="150" rx="12" fill="#14171c" stroke="var(--y-line)"/>' +
      '<rect x="146" y="36" width="68" height="46" rx="4" fill="#c3c8d0"/>' +
      '<path d="M150 34 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10" fill="none" stroke="#d9b44a" stroke-width="3" stroke-linejoin="round"/>' +
      pins + '</svg></div>';
  }
