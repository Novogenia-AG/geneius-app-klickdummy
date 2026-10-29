/* GENEius embed shim for NOVO Drug Response (presentation only).
   Loaded only with ?embed=geneius. It does NOT compute, rate or reword anything:
   it only (1) reports the current view address to the GENEius frame,
   (2) follows navigation requests from the GENEius frame by changing the
   address (the app routes itself via its own hashchange handler), and
   (3) forwards the mode and language buttons of the GENEius header to the
   app's own functions setModus() and setLang().
   Pure ASCII on purpose. */
(function(){
  'use strict';
  var parentWin = (window.parent && window.parent !== window) ? window.parent : null;
  if(!parentWin) return;
  var suppressModusDialog = false;

  function state(){
    var m = '', l = 'de';
    try{ m = (typeof MODUS === 'string') ? MODUS : ''; }catch(e){}
    try{ l = (typeof LANG === 'string') ? LANG : 'de'; }catch(e){}
    return { src:'ndr-embed', type:'nav', hash: location.hash || '#liste', modus: m, lang: l };
  }
  var lastSent = '';
  function report(force){
    var s = state(), key = s.hash + '|' + s.modus + '|' + s.lang;
    if(!force && key === lastSent) return;
    lastSent = key;
    try{ parentWin.postMessage(s, '*'); }catch(e){}
  }

  /* the app writes its address with history.pushState / replaceState */
  ['pushState','replaceState'].forEach(function(fn){
    var orig = history[fn];
    if(typeof orig !== 'function') return;
    history[fn] = function(){
      var r = orig.apply(this, arguments);
      setTimeout(function(){ report(false); }, 0);
      return r;
    };
  });
  window.addEventListener('hashchange', function(){ report(false); });
  window.addEventListener('popstate', function(){ setTimeout(function(){ report(false); }, 0); });

  /* the first-visit mode dialog: GENEius already offers the mode switch in its header.
     If GENEius sends a mode (user picked one before), close the dialog quietly. */
  function closeModusDialog(){
    var m = document.getElementById('modusmodal');
    if(m && m.classList.contains('open')){
      m.classList.remove('open');
      var s = document.getElementById('scrim');
      if(s) s.classList.remove('open');
    }
  }
  try{
    var mo = new MutationObserver(function(){ if(suppressModusDialog) closeModusDialog(); });
    mo.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:['class'] });
    setTimeout(function(){ mo.disconnect(); }, 4000);
  }catch(e){}

  window.addEventListener('message', function(ev){
    if(ev.source !== parentWin) return;
    var d = ev.data || {};
    if(d.src !== 'geneius') return;
    if(d.type === 'goto' && typeof d.hash === 'string'){
      if(location.hash !== d.hash){
        /* replace: the GENEius frame already wrote the history entry */
        try{ location.replace(d.hash); }catch(e){ location.hash = d.hash; }
      }else{
        report(true);
      }
    }else if(d.type === 'modus' && typeof d.m === 'string'){
      if(d.quiet){ suppressModusDialog = true; closeModusDialog(); }
      try{ if(typeof setModus === 'function' && MODUS !== d.m) setModus(d.m); }catch(e){}
      report(true);
    }else if(d.type === 'lang' && (d.l === 'de' || d.l === 'en')){
      try{ if(typeof setLang === 'function' && LANG !== d.l) setLang(d.l); }catch(e){}
      report(true);
    }else if(d.type === 'hello'){
      report(true);
    }
  });

  /* a dialog of the app opens (mode question, intro, tile popup, add dialog):
     GENEius scrolls its page so the whole app frame - and the centred dialog - is in view */
  try{
    var scrim = document.getElementById('scrim');
    if(scrim){
      new MutationObserver(function(){
        if(scrim.classList.contains('open')){
          try{ parentWin.postMessage({ src:'ndr-embed', type:'modal' }, '*'); }catch(e){}
        }
      }).observe(scrim, { attributes:true, attributeFilter:['class'] });
    }
  }catch(e){}

  /* scroll position, so GENEius can tuck its page header away while reading */
  var lastY = 0, rafOn = false;
  window.addEventListener('scroll', function(){
    if(rafOn) return; rafOn = true;
    requestAnimationFrame(function(){
      rafOn = false;
      var y = window.scrollY || 0, up = y < lastY; lastY = y;
      try{ parentWin.postMessage({ src:'ndr-embed', type:'scroll', y:y, up:up }, '*'); }catch(e){}
    });
  }, { passive:true });

  /* mode chosen inside the app (first-visit dialog): tell GENEius */
  document.addEventListener('click', function(){ setTimeout(function(){ report(false); }, 30); }, true);

  try{ parentWin.postMessage({ src:'ndr-embed', type:'ready', hash: location.hash || '#liste' }, '*'); }catch(e){}
  report(true);
})();
