/* GeoProof shared site chrome — favicon, fixed top nav, footer, per-visual prev/next,
   shared favorites, and a dark-mode toggle. Include once per page with:
   <script defer src="site-chrome.js"></script>. Overlays via fixed positioning. */
(function(){
  if(window.__gpChrome) return; window.__gpChrome=true;
  var EMBED = /[?&]embed(?:=|&|$)/.test(location.search) || (function(){ try{ return window.top!==window.self; }catch(e){ return true; } })();
  if(EMBED){ try{ document.documentElement.classList.add('gp-embed'); }catch(e){} }
  var ORDER=[["AnglesAroundPoint-Visual.html", "Angles Around a Point"], ["CompSuppAngles-Visual.html", "Complementary & Supplementary"], ["VerticalAngles-Visual.html", "Vertical Angles"], ["ParallelTransversal-Visual.html", "Parallel Lines & Transversal"], ["TriangleAngleSum-Visual.html", "Triangle Angle Sum"], ["ExteriorAngle-Visual.html", "Exterior Angle Theorem"], ["TriangleInequality-Visual.html", "Triangle Inequality"], ["Isosceles-Visual.html", "Isosceles Triangle"], ["PerpBisector-Visual.html", "Perpendicular Bisector"], ["AngleBisectorLocus-Visual.html", "Angle Bisector (Locus)"], ["DistanceMidpoint-Visual.html", "Distance & Midpoint"], ["Midsegment-Visual.html", "Triangle Midsegment"], ["PolygonAngleSum-Visual.html", "Angle Sum of Polygons"], ["PolygonExteriorAngleSum-Visual.html", "Sum of Exterior Angles"], ["TangentRadius-Visual.html", "Tangent ⟂ Radius"], ["GeoProof-Visual.html", "Pythagorean Theorem"], ["Reflection-Visual.html", "Reflection"], ["Rotation-Visual.html", "Rotation"], ["Translation-Visual.html", "Translation"], ["Dilation-Visual.html", "Dilation (Scaling)"], ["ArcSector-Visual.html", "Arc Length & Sector Area"], ["LawOfCosines-Visual.html", "Law of Cosines"], ["InscribedAngle-Visual.html", "Inscribed Angle Theorem"], ["AngleBisector-Visual.html", "Angle Bisector Theorem"], ["BasicProportionality-Visual.html", "Basic Proportionality"], ["AASimilarity-Visual.html", "AA Similarity"], ["SASSimilarity-Visual.html", "SAS Similarity"], ["CentroidMedians-Visual.html", "Centroid & the 2:1 Median"], ["Incircle-Visual.html", "Incenter & Incircle"], ["Circumcircle-Visual.html", "Circumcenter & Circumcircle"], ["Orthocenter-Visual.html", "Orthocenter"], ["Heron-Visual.html", "Heron's Formula"], ["Shoelace-Visual.html", "Shoelace Formula"], ["RegularPolygonArea-Visual.html", "Regular Polygon Area"], ["TriangleAreaSine-Visual.html", "Triangle Area (sine)"], ["AreaInradius-Visual.html", "Area = r·s"], ["EqualTangents-Visual.html", "Equal Tangents"], ["ChordBisector-Visual.html", "Chord & Center"], ["EqualChords-Visual.html", "Equal Chords"], ["TangentChordAngle-Visual.html", "Tangent–Chord Angle"], ["CyclicQuadrilateral-Visual.html", "Cyclic Quadrilateral"], ["PowerOfAPoint-Visual.html", "Power of a Point"], ["IntersectingChordsAngle-Visual.html", "Intersecting Chords Angle"], ["SecantsAngle-Visual.html", "Intersecting Secants Angle"], ["TangentTangentAngle-Visual.html", "Tangent–Tangent Angle"], ["Viviani-Visual.html", "Viviani's Theorem"], ["BritishFlag-Visual.html", "British Flag Theorem"], ["TrapezoidMidsegment-Visual.html", "Trapezoid Midsegment"], ["ParallelogramDiagonals-Visual.html", "Diagonals Bisect"], ["RhombusDiagonals-Visual.html", "Rhombus Diagonals"], ["ParallelogramLaw-Visual.html", "Parallelogram Law"], ["Varignon-Visual.html", "Varignon's Theorem"], ["GeometricMean-Visual.html", "Geometric Mean"], ["RightMedian-Visual.html", "Median to Hypotenuse"], ["StarAngleSum-Visual.html", "Star Angle Sum"], ["LawOfSinesCircumradius-Visual.html", "Sine Rule & 2R"], ["AreaCircumradius-Visual.html", "Area = abc/4R"], ["TwoReflections-Visual.html", "Two Reflections"], ["GlideReflection-Visual.html", "Glide Reflection"], ["Ptolemy-Visual.html", "Ptolemy's Theorem"], ["Ceva-Visual.html", "Ceva's Theorem"], ["Menelaus-Visual.html", "Menelaus' Theorem"], ["Stewart-Visual.html", "Stewart's Theorem"], ["NinePointCircle-Visual.html", "Nine-Point Circle"], ["EulerLine-Visual.html", "Euler Line"], ["SimsonLine-Visual.html", "Simson Line"], ["Napoleon-Visual.html", "Napoleon's Theorem"], ["Morley-Visual.html", "Morley's Trisector"], ["Pitot-Visual.html", "Pitot's Theorem"], ["Brahmagupta-Visual.html", "Brahmagupta's Formula"], ["CarnotTheorem-Visual.html", "Carnot's Theorem"], ["EulerInequality-Visual.html", "Euler's Inequality"], ["Picks-Visual.html", "Pick's Theorem"]];

  // ---- related-explorers data (shape/topic categories per visual) ----
  var CAT={
    'GeoProof-Visual.html':['triangle'],'InscribedAngle-Visual.html':['circle','angle'],
    'LawOfCosines-Visual.html':['triangle'],'PolygonAngleSum-Visual.html':['polygon','angle'],
    'PolygonExteriorAngleSum-Visual.html':['polygon','angle'],'TriangleInequality-Visual.html':['triangle'],
    'AngleBisector-Visual.html':['triangle','angle'],'BritishFlag-Visual.html':['quadrilateral'],
    'Viviani-Visual.html':['triangle'],'PowerOfAPoint-Visual.html':['circle'],
    'Ptolemy-Visual.html':['quadrilateral','circle'],'Ceva-Visual.html':['triangle'],
    'NinePointCircle-Visual.html':['triangle','circle'],'Varignon-Visual.html':['quadrilateral'],
    'Menelaus-Visual.html':['triangle'],'TangentChordAngle-Visual.html':['circle','angle'],
    'SecantsAngle-Visual.html':['circle','angle'],'CentroidMedians-Visual.html':['triangle'],
    'BasicProportionality-Visual.html':['triangle'],'Napoleon-Visual.html':['triangle'],
    'Morley-Visual.html':['triangle','angle'],'Pitot-Visual.html':['quadrilateral','circle'],
    'EulerLine-Visual.html':['triangle'],'SimsonLine-Visual.html':['triangle','circle'],
    'Brahmagupta-Visual.html':['quadrilateral','circle'],'Heron-Visual.html':['triangle'],
    'Incircle-Visual.html':['triangle','circle'],'Circumcircle-Visual.html':['triangle','circle'],
    'Orthocenter-Visual.html':['triangle'],'Midsegment-Visual.html':['triangle'],
    'ExteriorAngle-Visual.html':['triangle','angle'],'ParallelTransversal-Visual.html':['angle'],
    'TriangleAngleSum-Visual.html':['triangle','angle'],'VerticalAngles-Visual.html':['angle'],
    'Isosceles-Visual.html':['triangle','angle'],'PerpBisector-Visual.html':['triangle'],
    'AngleBisectorLocus-Visual.html':['angle'],'CompSuppAngles-Visual.html':['angle'],
    'TangentRadius-Visual.html':['circle','angle'],'EqualTangents-Visual.html':['circle'],
    'AnglesAroundPoint-Visual.html':['angle'],'DistanceMidpoint-Visual.html':['triangle'],
    'Reflection-Visual.html':['transformation'],'Rotation-Visual.html':['transformation'],
    'Translation-Visual.html':['transformation'],'Dilation-Visual.html':['transformation'],
    'ArcSector-Visual.html':['circle'],'Shoelace-Visual.html':['polygon'],
    'RegularPolygonArea-Visual.html':['polygon'],'AASimilarity-Visual.html':['triangle'],
    'CyclicQuadrilateral-Visual.html':['quadrilateral','circle','angle'],'Stewart-Visual.html':['triangle'],
    'GeometricMean-Visual.html':['triangle'],'IntersectingChordsAngle-Visual.html':['circle','angle'],
    'ParallelogramLaw-Visual.html':['quadrilateral'],'Picks-Visual.html':['polygon'],
    'TriangleAreaSine-Visual.html':['triangle'],'AreaInradius-Visual.html':['triangle','circle'],
    'ChordBisector-Visual.html':['circle'],'StarAngleSum-Visual.html':['polygon','angle'],
    'TrapezoidMidsegment-Visual.html':['quadrilateral'],'ParallelogramDiagonals-Visual.html':['quadrilateral'],
    'LawOfSinesCircumradius-Visual.html':['triangle','circle'],'RhombusDiagonals-Visual.html':['quadrilateral'],
    'EqualChords-Visual.html':['circle'],'TwoReflections-Visual.html':['transformation'],
    'AreaCircumradius-Visual.html':['triangle','circle'],'RightMedian-Visual.html':['triangle'],
    'GlideReflection-Visual.html':['transformation'],'SASSimilarity-Visual.html':['triangle'],
    'TangentTangentAngle-Visual.html':['circle','angle'],'CarnotTheorem-Visual.html':['triangle','circle'],
    'EulerInequality-Visual.html':['triangle','circle']
  };
  var TITLE={}, OIDX={};
  ORDER.forEach(function(e,i){ TITLE[e[0]]=e[1]; OIDX[e[0]]=i; });
  function titleOf(f){ return TITLE[f]||f; }
  function relatedFor(file){
    var cats=CAT[file]||[]; if(!cats.length) return [];
    var oi=(file in OIDX)?OIDX[file]:0, scored=[];
    for(var f in CAT){ if(f===file) continue;
      var c=CAT[f], inter=0;
      for(var i=0;i<cats.length;i++){ if(c.indexOf(cats[i])>=0) inter++; }
      if(inter<=0) continue;
      var jac=inter/(cats.length+c.length-inter);
      scored.push({f:f,jac:jac,d:Math.abs(((f in OIDX)?OIDX[f]:0)-oi)});
    }
    scored.sort(function(a,b){ if(Math.abs(b.jac-a.jac)>1e-9) return b.jac-a.jac; return a.d-b.d; });
    return scored.slice(0,4).map(function(x){ return x.f; });
  }

  // ---- theme (set ASAP to limit flash) ----
  var TK='gp:theme';
  function sysDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function curTheme(){ try{var t=localStorage.getItem(TK); if(t==='dark'||t==='light') return t;}catch(e){} return sysDark()?'dark':'light'; }
  function applyTheme(t){ document.documentElement.setAttribute('data-theme',t); }
  applyTheme(curTheme());
  function themeIco(t){ return t==='dark'?'☀':'☾'; }
  function themeTxt(t){ return t==='dark'?'Light':'Dark'; }
  function paintTheme(b,t){ b.innerHTML='<span class="gp-th-i">'+themeIco(t)+'</span><span class="gp-th-t">'+themeTxt(t)+'</span>'; }

  // ---- favicons ----
  if(!document.querySelector('link[rel~="icon"]')){
    var i1=document.createElement('link'); i1.rel='icon'; i1.type='image/svg+xml'; i1.href='favicon.svg'; document.head.appendChild(i1);
    var i2=document.createElement('link'); i2.rel='alternate icon'; i2.href='favicon.ico'; i2.setAttribute('sizes','any'); document.head.appendChild(i2);
  }

  // ---- favorites ----
  var FK='gp:favorites';
  function favGet(){try{return JSON.parse(localStorage.getItem(FK))||[];}catch(e){return [];}}
  function favHas(f){return favGet().indexOf(f)>=0;}
  function favToggle(f){var a=favGet(),i=a.indexOf(f);if(i>=0)a.splice(i,1);else a.push(f);try{localStorage.setItem(FK,JSON.stringify(a));}catch(e){}return i<0;}
  window.gpFav={get:favGet,has:favHas,toggle:favToggle};
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  // ---- styles ----
  var light=[
    '.gp-header{position:fixed;top:0;left:0;right:0;height:54px;z-index:1000;display:flex;align-items:center;',
      'justify-content:space-between;padding:0 18px;background:rgba(255,255,255,0.9);',
      'backdrop-filter:saturate(180%) blur(8px);-webkit-backdrop-filter:saturate(180%) blur(8px);',
      'border-bottom:1px solid #e6e6e8;font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box;}',
    '.gp-brand{display:flex;align-items:center;gap:9px;text-decoration:none;color:#1a1a1a;font-weight:700;font-size:17px;letter-spacing:-0.01em;}',
    '.gp-brand svg{display:block;}','.gp-brand:hover{opacity:0.78;}',
    '.gp-nav{display:flex;align-items:center;gap:18px;}',
    '.gp-nav a{text-decoration:none;color:#555;font-size:14px;font-weight:500;}','.gp-nav a:hover{color:#1a1a1a;}',
    '.gp-theme{display:inline-flex;align-items:center;gap:7px;border:1.5px solid #cfcfcf;background:#ffffff;cursor:pointer;font-size:15px;font-weight:700;line-height:1;color:#1a1a1a;padding:10px 20px;border-radius:999px;font-family:inherit;}',
    '.gp-theme:hover{border-color:#1a1a1a;color:#1a1a1a;}',
    '.gp-footer{position:fixed;bottom:0;left:0;right:0;min-height:40px;z-index:1000;display:flex;flex-wrap:wrap;',
      'align-items:center;justify-content:center;gap:8px;padding:8px 18px;background:#ffffff;',
      'border-top:1px solid #ececee;font-family:system-ui,-apple-system,sans-serif;font-size:12.5px;color:#8a8a8f;box-sizing:border-box;}',
    '.gp-footer a{color:#666;text-decoration:none;}','.gp-footer a:hover{color:#1a1a1a;text-decoration:underline;}',
    '.gp-dot{color:#ccc;}',
    'html:not(.gp-embed) body{padding-top:54px !important;padding-bottom:48px !important;}',
    '.handle:focus{outline:none;}',
    '.handle:focus-visible{stroke-width:3.6px;filter:drop-shadow(0 0 2.5px rgba(26,26,26,0.55));}',
    '.gp-exnav{display:flex;align-items:center;gap:10px;justify-content:space-between;margin:24px auto 8px;',
      'padding:11px 14px;border:1px solid #e6e6e8;border-radius:12px;background:#ffffff;font-family:system-ui,-apple-system,sans-serif;}',
    '.gp-exnav a{text-decoration:none;color:#555;font-size:13px;font-weight:600;display:flex;align-items:center;gap:5px;min-width:0;}',
    '.gp-exnav a:hover{color:#1a1a1a;}','.gp-ex-prev,.gp-ex-next{max-width:34%;}',
    '.gp-ex-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.gp-ex-mid{display:flex;align-items:center;gap:10px;flex:none;}','.gp-ex-all{color:#888 !important;font-weight:700;}',
    '.gp-ex-fav{border:1px solid #d8d8d8;background:#fff;border-radius:999px;padding:6px 13px;font-size:13px;font-weight:600;color:#555;cursor:pointer;font-family:inherit;white-space:nowrap;}',
    '.gp-ex-fav:hover{border-color:#b3b3b3;}','.gp-ex-fav.saved{background:#fff7e6;border-color:#f0c674;color:#9a6b00;}',
    '.gp-related{margin:18px auto 8px;}',
    '.gp-related-h{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9aa0a6;text-align:center;margin-bottom:10px;}',
    '.gp-related-list{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}',
    '.gp-related-list a{text-decoration:none;color:#1a1a1a;font-size:13px;font-weight:600;border:1px solid #e2e2e2;background:#ffffff;border-radius:10px;padding:8px 13px;transition:border-color .12s ease,box-shadow .12s ease;}',
    '.gp-related-list a:hover{border-color:#b9bcc4;box-shadow:0 4px 12px rgba(0,0,0,0.06);}',
    '.gp-share{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:16px auto 4px;}',
    '.gp-share-btn{border:1px solid #d8d8d8;background:#ffffff;color:#444444;border-radius:999px;padding:7px 15px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}',
    '.gp-share-btn:hover{border-color:#1a1a1a;color:#1a1a1a;}',
    '.gp-share-btn:disabled{color:#1e7a3c;border-color:#9ed6b0;background:#f0faf3;cursor:default;}',
    '.gp-keys{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);}',
    '.gp-keys-box{background:#ffffff;border-radius:14px;padding:22px 24px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;}',
    '.gp-keys-box b{font-size:15px;display:block;margin-bottom:12px;}',
    '.gp-keys-row{display:flex;align-items:center;justify-content:space-between;gap:14px;font-size:13.5px;color:#555555;margin:9px 0;}',
    '.gp-keys kbd{display:inline-block;min-width:20px;text-align:center;background:#f0f0f2;border:1px solid #d8d8d8;border-bottom-width:2px;border-radius:6px;padding:2px 7px;font-family:inherit;font-size:12px;font-weight:700;color:#333333;}',
    '.gp-keys-hint{margin-top:14px;font-size:11.5px;color:#999999;text-align:center;}',
    '@media(max-width:520px){.gp-nav{gap:13px;}.gp-hide-sm{display:none !important;}.gp-footer{font-size:11.5px;gap:6px;}',
      '.gp-foot-sm{display:none !important;}.gp-ex-t{display:none;}.gp-ex-prev,.gp-ex-next{max-width:none;}',
      '.gp-th-t{display:none;}.gp-theme{padding:8px 11px;font-size:16px;}}',
    '.gp-zoom-host{position:relative;overflow:hidden;}',
    '.gp-zoom-ctrl{position:absolute;right:10px;bottom:10px;display:flex;flex-direction:column;gap:6px;z-index:8;}',
    '.gp-zoom-ctrl button{width:34px;height:34px;border-radius:9px;border:1px solid #d8d8d8;background:rgba(255,255,255,0.92);color:#1a1a1a;font-size:19px;font-weight:700;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.08);}',
    '.gp-zoom-ctrl button:hover{border-color:#1a1a1a;background:#fff;}',
    '.gp-zoom-ctrl button:active{transform:scale(0.94);}',
    '.gp-zoom-ctrl .gp-zr{font-size:14px;}'
  ];
  var D='html[data-theme=dark] ';
  var dark=[
    D+'body{background:#14151a !important;color:#e6e6e8 !important;}',
    D+'.gp-header{background:rgba(24,25,30,0.86) !important;border-bottom-color:#2c2e36 !important;}',
    D+'.gp-brand,'+D+'.gp-brand span{color:#f0f0f2 !important;}',
    D+'.gp-brand svg polygon{stroke:#f0f0f2 !important;}',
    D+'.gp-nav a{color:#aeb2bb !important;}',D+'.gp-nav a:hover{color:#fff !important;}',
    D+'.gp-theme{background:#2a2d35 !important;border-color:#3a3d45 !important;color:#e6e6e8 !important;}',
    D+'.gp-theme:hover{border-color:#6b6f78 !important;}',
    D+'.gp-footer{background:#181920 !important;border-top-color:#2c2e36 !important;color:#8a8d96 !important;}',
    D+'.gp-footer a{color:#aeb2bb !important;}',D+'.gp-dot{color:#3a3d45 !important;}',
    D+'.gp-exnav{background:#1f2127 !important;border-color:#2e3138 !important;}',
    D+'.gp-exnav a{color:#aeb2bb !important;}',D+'.gp-exnav a:hover{color:#fff !important;}',
    D+'.gp-ex-fav{background:#2a2d35 !important;border-color:#3a3d45 !important;color:#cfd2d8 !important;}',
    D+'.gp-ex-fav.saved{background:#3a2f12 !important;border-color:#7a5e1e !important;color:#f0c674 !important;}',
    // generic surfaces
    D+'.card,'+D+'.widget,'+D+'.stage,'+D+'.drawer,'+D+'.info-drawer{background:#1f2127 !important;border-color:#2e3138 !important;}',
    D+'.stage{box-shadow:none !important;}',
    // diagram canvas stays light so the geometry colors render as designed
    D+'.gp-canvas{background:#ffffff !important;border-radius:8px;}',
    // controls
    D+'.toggle-btn{background:#2a2d35 !important;color:#aeb2bb !important;border-color:#3a3d45 !important;}',
    D+'.toggle-btn.active{background:#e9e9ee !important;color:#16171c !important;border-color:#e9e9ee !important;}',
    D+'.ref-btn{background:#2a2d35 !important;border-color:#3a3d45 !important;}',
    D+'.side-input,'+D+'.slider{background:#2a2d35 !important;color:#e6e6e8 !important;border-color:#3a3d45 !important;}',
    D+'.info-btn,'+D+'.info-toggle{background:#2a2d35 !important;color:#e6e6e8 !important;border-color:#3a3d45 !important;}',
    D+'.info-close,'+D+'.drawer .close{background:#2a2d35 !important;color:#cfd2d8 !important;border-color:#3a3d45 !important;}',
    D+'.formula-box{background:#2a2d35 !important;color:#e9e9ee !important;}',
    D+'.info-drawer h3,'+D+'.drawer h2{color:#f0f0f2 !important;}',
    D+'.info-drawer h4{color:#9aa0a6 !important;}',
    D+'.info-drawer p,'+D+'.drawer p{color:#c2c4ca !important;}',
    D+'.readout{background:#181920 !important;border-color:#2e3138 !important;}',
    D+'h1,'+D+'.sub{color:#e6e6e8 !important;}',D+'.sub{color:#9aa0a6 !important;}',
    // index hero + grid + filters
    D+'.hero h1,'+D+'.hero-lede b{color:#f4f4f6 !important;}',D+'.hero-lede{color:#9aa0a6 !important;}',
    D+'.hero-eyebrow,'+D+'.filter-label,'+D+'.pcount{color:#7e828c !important;}',
    D+'.hero-stats{background:#1f2127 !important;border-color:#2e3138 !important;}',
    D+'.hero-stats .stat{border-color:#2e3138 !important;}',D+'.hero-stats .num{color:#f0f0f2 !important;}',
    D+'.btn-primary{background:#e9e9ee !important;color:#16171c !important;}',
    D+'.btn-ghost{background:#2a2d35 !important;color:#e6e6e8 !important;border-color:#3a3d45 !important;}',
    D+'.search-wrap input{background:#1f2127 !important;color:#e6e6e8 !important;border-color:#3a3d45 !important;}',
    D+'.search-wrap input::placeholder{color:#6b6f78 !important;}',
    D+'.chip{background:#2a2d35 !important;color:#aeb2bb !important;border-color:#3a3d45 !important;}',
    D+'.chip.active{background:#e9e9ee !important;color:#16171c !important;border-color:#e9e9ee !important;}',
    D+'.panel{background:#1f2127 !important;border-color:#2e3138 !important;}',
    D+'.panel h2{color:#f0f0f2 !important;}',D+'.panel p{color:#9aa0a6 !important;}',
    D+'.panel.active:hover{box-shadow:0 10px 22px rgba(0,0,0,0.45) !important;border-color:#3a3d45 !important;}',
    D+'.cat-pill{background:#2a2d35 !important;color:#aeb2bb !important;}',
    D+'.cat-star{background:rgba(36,38,46,0.9) !important;}',
    D+'.panel-icon{background:#ffffff !important;border-radius:9px;}',
    D+'.gp-related-h{color:#7e828c !important;}',
    D+'.gp-related-list a{background:#1f2127 !important;border-color:#2e3138 !important;color:#e6e6e8 !important;}',
    D+'.gp-related-list a:hover{border-color:#3a3d45 !important;box-shadow:0 4px 12px rgba(0,0,0,0.4) !important;}',
    D+'.path-card{background:#1f2127 !important;border-color:#2e3138 !important;}',
    D+'.paths-wrap h1,'+D+'.path-h{color:#f0f0f2 !important;}',
    D+'.lead,'+D+'.path-desc{color:#c2c4ca !important;}',
    D+'.paths-wrap .eyebrow{color:#7e828c !important;}',
    D+'.path-steps li{border-top-color:#2a2d33 !important;}',
    D+'.path-steps li::before{background:#2a2d35 !important;color:#aeb2bb !important;}',
    D+'.path-steps a{color:#e6e6e8 !important;}',
    D+'.path-steps a:hover{color:#7fb2ec !important;}',
    D+'.path-start{background:#e9e9ee !important;color:#16171c !important;}',
    D+'.foot{color:#9aa0a6 !important;}',
    D+'.quiz-card{background:#1f2127 !important;border-color:#2e3138 !important;}',
    D+'.quiz-wrap h1,'+D+'.q-text{color:#f0f0f2 !important;}',
    D+'.quiz-wrap .eyebrow,'+D+'.q-top,'+D+'.q-best{color:#7e828c !important;}',
    D+'.quiz-wrap .lead,'+D+'.q-msg{color:#c2c4ca !important;}',
    D+'.progress-bar{background:#2a2d33 !important;}',D+'.progress-fill{background:#e9e9ee !important;}',
    D+'.q-choice{background:#26282f !important;border-color:#3a3d45 !important;color:#e6e6e8 !important;}',
    D+'.q-choice:hover:not(:disabled){border-color:#6b6f78 !important;}',
    D+'.q-choice.correct{background:#16301f !important;border-color:#2f7a45 !important;color:#7fd49b !important;}',
    D+'.q-choice.wrong{background:#331717 !important;border-color:#7a2f2f !important;color:#f0a0a0 !important;}',
    D+'.q-explain{background:#181920 !important;color:#c2c4ca !important;}',
    D+'.q-explain a{color:#7fb2ec !important;}',
    D+'.q-next{background:#e9e9ee !important;color:#16171c !important;}',
    D+'.q-ghost{background:#26282f !important;border-color:#3a3d45 !important;color:#e6e6e8 !important;}',
    D+'.gp-share-btn{background:#2a2d35 !important;border-color:#3a3d45 !important;color:#cfd2d8 !important;}',
    D+'.gp-share-btn:hover{border-color:#6b6f78 !important;color:#ffffff !important;}',
    D+'.gp-share-btn:disabled{color:#7fd49b !important;border-color:#2f7a45 !important;background:#16301f !important;}',
    D+'.gp-keys-box{background:#1f2127 !important;color:#e6e6e8 !important;}',
    D+'.gp-keys-box b{color:#f0f0f2 !important;}',
    D+'.gp-keys-row{color:#aeb2bb !important;}',
    D+'.gp-keys kbd{background:#2a2d35 !important;border-color:#3a3d45 !important;color:#cfd2d8 !important;}',
    D+'.gp-keys-hint{color:#7e828c !important;}',
    D+'.pager button{background:#1f2127 !important;color:#aeb2bb !important;border-color:#3a3d45 !important;}',
    D+'.pager button.current{background:#e9e9ee !important;color:#16171c !important;border-color:#e9e9ee !important;}',
    D+'.pager .gap{color:#6b6f78 !important;}',
    D+'.no-results{color:#9aa0a6 !important;}',
    // about page
    D+'.about h1,'+D+'.about h2,'+D+'.feature h3{color:#f0f0f2 !important;}',
    D+'.about p,'+D+'.lead{color:#c2c4ca !important;}',
    D+'.feature,'+D+'.callout,'+D+'.stat-strip .s{background:#1f2127 !important;border-color:#2e3138 !important;}',
    D+'.feature p{color:#9aa0a6 !important;}',D+'.cta{background:#e9e9ee !important;color:#16171c !important;}',D+'hr{border-top-color:#2e3138 !important;}',
    // neutral inline text (readout rows etc.) — keep semantic colored spans intact
    D+'[style*="color:#1a1a1a"]{color:#e6e6e8 !important;}',
    D+'[style*="color:#333"]{color:#c2c4ca !important;}',
    D+'[style*="color:#444"]{color:#bcc0c8 !important;}',
    D+'[style*="color:#555"]{color:#aeb2bb !important;}',
    D+'[style*="color:#666"]{color:#a2a6af !important;}',
    D+'[style*="color:#777"]{color:#9aa0a6 !important;}',
    D+'[style*="color:#888"]{color:#8a8f98 !important;}'
  ];
  var st=document.createElement('style'); st.id='gp-chrome-style'; st.textContent=light.join('')+dark.join(''); document.head.appendChild(st);

  var logo='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">'
    +'<polygon points="4,20 20,20 4,7" fill="none" stroke="#1a1a1a" stroke-width="2.2" stroke-linejoin="round"/>'
    +'<rect x="4" y="16.4" width="3.6" height="3.6" fill="#378ADD"/></svg>';

  // Central zoom (+/- and reset) for every 2-D diagram. Scales the SVG within a clipped
  // wrapper so it never overlaps the controls below. Drag/keyboard handles keep working
  // because pointer mapping uses getBoundingClientRect, which scales with the transform.
  function injectZoom(){
    if(document.querySelector('.gp-zoom-host')) return;
    var svg=document.querySelector('.stage svg:not(.panel-icon)');
    if(!svg) return;                       // non-diagram pages and 3-D (canvas) pages: skip
    var host=document.createElement('div'); host.className='gp-zoom-host';
    svg.parentNode.insertBefore(host, svg); host.appendChild(svg);
    svg.style.transformOrigin='center center';
    svg.style.transition='transform .12s ease';
    var scale=1;
    function apply(){ svg.style.transform = (scale===1) ? '' : 'scale('+scale.toFixed(3)+')'; }
    var ctrl=document.createElement('div'); ctrl.className='gp-zoom-ctrl';
    ctrl.innerHTML='<button type="button" data-z="in" aria-label="Zoom in">+</button>'
      +'<button type="button" data-z="out" aria-label="Zoom out">−</button>'
      +'<button type="button" data-z="reset" class="gp-zr" aria-label="Reset zoom" title="Reset zoom">⟲</button>';
    host.appendChild(ctrl);
    ctrl.addEventListener('click',function(e){
      var b=e.target.closest && e.target.closest('button'); if(!b) return;
      var z=b.getAttribute('data-z');
      if(z==='in') scale=Math.min(3,scale*1.25);
      else if(z==='out') scale=Math.max(0.6,scale/1.25);
      else scale=1;
      apply();
    });
  }

  function ready(fn){ if(document.body) fn(); else document.addEventListener('DOMContentLoaded',fn); }

  ready(function(){
    // these run in every mode (incl. embed): light diagram canvas + keyboard a11y
    Array.prototype.forEach.call(document.querySelectorAll('svg:not(.panel-icon)'),function(s){ s.classList.add('gp-canvas'); });
    setupKeyboardHandles();
    injectZoom();       // zoom in/out control on every 2-D diagram (3-D pages bring their own)
    if(EMBED) return;   // embedded widget: no header/footer/nav/share
    if(!document.querySelector('.gp-header')){
      var header=document.createElement('header'); header.className='gp-header';
      header.innerHTML='<a class="gp-brand" href="index.html">'+logo+'<span>GeoProof</span></a>'
        +'<nav class="gp-nav"><a class="gp-hide-sm" href="index.html">All explorers</a><a href="paths.html">Paths</a><a href="quiz.html">Quiz</a><a href="about.html">About</a>'
        +'<button class="gp-theme" id="gp-theme-btn" type="button" aria-label="Toggle dark mode"></button></nav>';
      document.body.insertBefore(header, document.body.firstChild);

      var footer=document.createElement('footer'); footer.className='gp-footer';
      footer.innerHTML='<span>GeoProof <span class="gp-foot-sm">- interactive geometry explorers</span></span>'
        +'<span class="gp-dot gp-foot-sm">&middot;</span><span class="gp-foot-sm">&copy; 2026</span>'
        +'<span class="gp-dot gp-foot-sm">&middot;</span><span class="gp-foot-sm">Press ? for shortcuts</span>';
      document.body.appendChild(footer);

      var tb=document.getElementById('gp-theme-btn'); paintTheme(tb,curTheme());
      tb.addEventListener('click',function(){
        var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
        applyTheme(t); try{localStorage.setItem(TK,t);}catch(e){} paintTheme(tb,t);
      });
    }
    injectExplorerNav();
    injectRelated();
    injectShare();
  });

  function injectExplorerNav(){
    var file=(location.pathname.split('/').pop()||'');
    if(!/-Visual\.html$/i.test(file)) return;
    if(document.querySelector('.gp-exnav')) return;
    var idx=-1; for(var i=0;i<ORDER.length;i++){ if(ORDER[i][0]===file){ idx=i; break; } }
    var host=document.querySelector('.wrap,.widget,.about,.page') || document.body;
    var n=ORDER.length;
    var nav=document.createElement('nav'); nav.className='gp-exnav';
    function arrow(j,dir){
      var e=ORDER[(j%n+n)%n], a=document.createElement('a'); a.href=e[0];
      a.className=dir<0?'gp-ex-prev':'gp-ex-next';
      a.innerHTML=dir<0 ? '&lsaquo; <span class="gp-ex-t">'+esc(e[1])+'</span>' : '<span class="gp-ex-t">'+esc(e[1])+'</span> &rsaquo;';
      return a;
    }
    if(idx>=0) nav.appendChild(arrow(idx-1,-1));
    var mid=document.createElement('div'); mid.className='gp-ex-mid';
    var fav=document.createElement('button'); fav.type='button'; fav.className='gp-ex-fav';
    function paint(){ var s=favHas(file); fav.textContent=s?'★ Saved':'☆ Save'; fav.classList.toggle('saved',s); }
    paint(); fav.addEventListener('click',function(){ favToggle(file); paint(); });
    var all=document.createElement('a'); all.href='index.html'; all.className='gp-ex-all'; all.textContent='⊞ All';
    mid.appendChild(fav); mid.appendChild(all); nav.appendChild(mid);
    if(idx>=0) nav.appendChild(arrow(idx+1,1));
    host.appendChild(nav);
  }

  function injectRelated(){
    var file=(location.pathname.split('/').pop()||'');
    if(!/-Visual\.html$/i.test(file)) return;
    if(document.querySelector('.gp-related')) return;
    var rel=relatedFor(file); if(!rel.length) return;
    var host=document.querySelector('.wrap,.widget,.about,.page') || document.body;
    var wrap=document.createElement('div'); wrap.className='gp-related';
    var h=document.createElement('div'); h.className='gp-related-h'; h.textContent='Related explorers'; wrap.appendChild(h);
    var list=document.createElement('div'); list.className='gp-related-list';
    rel.forEach(function(f){ var a=document.createElement('a'); a.href=f; a.textContent=titleOf(f); list.appendChild(a); });
    wrap.appendChild(list); host.appendChild(wrap);
  }

  // ---- share + copy-embed ----
  function copyText(text,btn,okMsg){
    function done(){ var old=btn.textContent; btn.textContent='✓ '+okMsg; btn.disabled=true; setTimeout(function(){ btn.textContent=old; btn.disabled=false; },1600); }
    function fb(){ try{ var ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done(); }catch(e){} }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done,fb); } else fb();
  }
  function injectShare(){
    var file=(location.pathname.split('/').pop()||'');
    if(!/-Visual\.html$/i.test(file)) return;
    if(document.querySelector('.gp-share')) return;
    var BASE='https://geoproof.knovay.com/', pageUrl=BASE+file;
    var snippet='<iframe src="'+pageUrl+'?embed=1" title="'+(document.title||'GeoProof explorer')+'" width="680" height="800" loading="lazy" style="max-width:100%;border:1px solid #e2e2e2;border-radius:14px;"></iframe>';
    var host=document.querySelector('.wrap,.widget,.about,.page') || document.body;
    var bar=document.createElement('div'); bar.className='gp-share';
    var sBtn=document.createElement('button'); sBtn.type='button'; sBtn.className='gp-share-btn'; sBtn.textContent='↗ Share';
    sBtn.addEventListener('click',function(){
      if(navigator.share){ navigator.share({title:document.title,url:pageUrl}).catch(function(){}); }
      else copyText(pageUrl,sBtn,'Link copied');
    });
    var eBtn=document.createElement('button'); eBtn.type='button'; eBtn.className='gp-share-btn'; eBtn.textContent='</> Copy embed';
    eBtn.addEventListener('click',function(){ copyText(snippet,eBtn,'Embed copied'); });
    bar.appendChild(sBtn); bar.appendChild(eBtn); host.appendChild(bar);
  }

  // ---- global keyboard shortcuts ----
  function gpIndex(){ var f=location.pathname.split('/').pop()||''; for(var i=0;i<ORDER.length;i++){ if(ORDER[i][0]===f) return i; } return -1; }
  function gpGo(dir){ var i=gpIndex(); if(i<0) return; var n=ORDER.length; location.href=ORDER[((i+dir)%n+n)%n][0]; }
  function gpRandom(){ location.href=ORDER[Math.floor(Math.random()*ORDER.length)][0]; }
  function gpShortcuts(){
    var ex=document.getElementById('gp-keys'); if(ex){ ex.parentNode.removeChild(ex); return; }
    function row(keys,label){ return '<div class="gp-keys-row"><span>'+keys+'</span><span>'+label+'</span></div>'; }
    var o=document.createElement('div'); o.id='gp-keys'; o.className='gp-keys';
    o.innerHTML='<div class="gp-keys-box"><b>Keyboard shortcuts</b>'
      +row('<kbd>&larr;</kbd> <kbd>&rarr;</kbd>','Previous / next explorer')
      +row('<kbd>R</kbd>','Random explorer')
      +row('<kbd>/</kbd>','Search (home page)')
      +row('<kbd>T</kbd>','Toggle dark mode')
      +row('<kbd>Tab</kbd> + <kbd>arrows</kbd>','Move a diagram point')
      +'<div class="gp-keys-hint">Press Esc or ? to close</div></div>';
    o.addEventListener('click',function(e){ if(e.target===o){ o.parentNode.removeChild(o); } });
    document.body.appendChild(o);
  }
  document.addEventListener('keydown',function(e){
    if(EMBED) return;
    if(e.ctrlKey||e.metaKey||e.altKey) return;
    var t=e.target, tag=(t&&t.tagName)||'';
    if(/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (t&&t.isContentEditable)) return;
    if(t&&t.classList&&t.classList.contains('handle')) return;   // arrows nudge a focused handle
    var k=e.key;
    if(k==='?'){ gpShortcuts(); e.preventDefault(); return; }
    if(k==='Escape'){ var ke=document.getElementById('gp-keys'); if(ke){ ke.parentNode.removeChild(ke); } return; }
    if(k==='t'||k==='T'){ var nt=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'; applyTheme(nt); try{ localStorage.setItem(TK,nt); }catch(_){ } var b=document.getElementById('gp-theme-btn'); if(b) paintTheme(b,nt); e.preventDefault(); return; }
    if(k==='r'||k==='R'){ gpRandom(); e.preventDefault(); return; }
    var isVisual=/-Visual\.html$/i.test(location.pathname.split('/').pop()||'');
    if(isVisual){
      if(k==='ArrowLeft'){ gpGo(-1); e.preventDefault(); }
      else if(k==='ArrowRight'){ gpGo(1); e.preventDefault(); }
    } else if(k==='/'){ var s=document.getElementById('search'); if(s){ s.focus(); e.preventDefault(); } }
  });

  // ---- keyboard accessibility: arrow-key nudging of diagram handles ----
  function setupKeyboardHandles(){
    if(!window.PointerEvent) return;   // needs synthetic pointer events
    Array.prototype.forEach.call(document.querySelectorAll('svg:not(.panel-icon)'),function(svg){
      if(!svg.querySelector('.handle')) return;
      function tag(){
        Array.prototype.forEach.call(svg.querySelectorAll('.handle'),function(h){
          if(h.getAttribute('tabindex')!=='0'){
            h.setAttribute('tabindex','0'); h.setAttribute('role','button');
            if(!h.getAttribute('aria-label')) h.setAttribute('aria-label','Draggable point — focus and use arrow keys to move (hold Shift for fine steps)');
          }
        });
      }
      tag();
      if(window.MutationObserver){ try{ new MutationObserver(tag).observe(svg,{childList:true,subtree:true}); }catch(e){} }
      svg.addEventListener('keydown',function(e){
        var h=e.target; if(!h||!h.classList||!h.classList.contains('handle')) return;
        var step=e.shiftKey?1:5, dx=0, dy=0;
        if(e.key==='ArrowLeft')dx=-step; else if(e.key==='ArrowRight')dx=step;
        else if(e.key==='ArrowUp')dy=-step; else if(e.key==='ArrowDown')dy=step; else return;
        e.preventDefault(); nudgeHandle(svg,h,dx,dy);
      });
    });
  }
  function nudgeHandle(svg,h,dxU,dyU){
    var hb=h.getBoundingClientRect(), cx=hb.left+hb.width/2, cy=hb.top+hb.height/2;
    var sb=svg.getBoundingClientRect(), vb=svg.viewBox&&svg.viewBox.baseVal;
    var sx=sb.width/((vb&&vb.width)||680), sy=sb.height/((vb&&vb.height)||560);
    var tx=cx+dxU*sx, ty=cy+dyU*sy;
    function fire(el,type,x,y){ try{ el.dispatchEvent(new PointerEvent(type,{clientX:x,clientY:y,bubbles:true,cancelable:true,pointerId:1,pointerType:'mouse',isPrimary:true})); }catch(e){} }
    fire(h,'pointerdown',cx,cy);   // page's handler sets the active handle
    fire(svg,'pointermove',tx,ty); // page's handler moves it (bubbles to window too)
    fire(svg,'pointerup',tx,ty);   // release
    try{ h.focus({preventScroll:true}); }catch(e){ try{ h.focus(); }catch(_){} }
  }
})();
