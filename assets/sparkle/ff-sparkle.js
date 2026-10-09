/* ═══ THE FLORIDA FILES · sparkle layer (shared) ═══════════════════════════════════════════════════════════════
   One file for every G4 Florida social studies lesson that has been sparkled. It holds NO lesson content:
   every word, place, card and question comes from the lesson's own
   <script type="application/json" id="ff-data"> block in <head>. A missing key only turns off its own feature.

   What it does (built at runtime on anchors the lesson already has; teardown() puts the page back):
   · one header row (Read aloud + Lesson details pills), hero on the first tab only, no progress bar
   · the teacher texts from a phone inside Canvas; texts in the page are one-line pills
   · the four lesson tabs become folder tabs; a tab gets ✓ only when its work is really done
   · Historian Lens, Scene 1 interaction, Explore reading + evidence interaction, Self-Check one at a time,
     a 4-step Assignment (Gather evidence → Plan → Write → Review & turn in), voice notes, hints, flags,
     the Learning Journal, and the Florida Files cabinet
   · quiet lessons (DATA.quiet) drop the party pieces and keep the learning ones

   Interaction types (pick per lesson in DATA):
     scene1.type   mapquest | habitcard | shiporder | packtrunks | claimcoast | stringboard
     explore.reading.type   seasongrid | filesgrid | routemap | stepread | yearslider | ripples
     explore.directive · explore.timelineLast · source.hotspots (tap-to-reveal labels on the source image)
     explore.evidence.type  wheelsort  | spotdetail | shipshore | doctype (uses source.hotspots) | domino (anchors under the Timeline Thread) | sayinfer (says / infer / ask trays; uses source.hotspots)
     planner.type  picks | fixit | choose | scale | ledger | chain
     vocab.type    rootdig | flags | bells | streams | plantfield
     phone texts: a ▶ shows on any teacher text whose clip g4ss-<lesson>-txt-<key>.mp3 exists (key = sayKey(text))
   Add a new type by adding one entry to the MOD table below.

   Review tools: add ?review to the page address to get the review bar (layer on/off, show empty media slots,
   outline additions, reset progress).
   ════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  if(window.__ffSparkle) return; window.__ffSparkle=true;
  var DATA={}; try{ var dj=document.getElementById('ff-data'); if(dj) DATA=JSON.parse(dj.textContent)||{}; }catch(e){ console.warn('sparkle layer: bad ff-data',e); }
  if(!DATA.lesson){ console.warn('sparkle layer: no ff-data for this lesson — layer off'); return; }
  var LESSON=String(DATA.lesson).replace(/\./g,'-');
  var KEY='oao.ff.'+LESSON, PKEY='oao.ff.profile', CKEY='oao.ff.course';
  var IMG='https://raw.githubusercontent.com/bbirchum1/optima-4th-social-studies/main/images/', EXT=['.jpg','.png','.webp','.jpeg'];
  var AUD=DATA.audioBase||'audio/guide/';
  var FILE=DATA.file||{}, THIS=FILE.n||0, FILE_TITLE=FILE.title||DATA.title||'', MIN_WORDS=DATA.minWords||40;
  var T=DATA.texts||{}, QUIET=!!DATA.quiet;
  /* the real Florida outline: us-atlas states-10m (US Census), d3 geoMercator fitted to [[18,38],[282,292]] in a 300×300 box.
     project(lon,lat) uses the same numbers, so pins land where the places really are. */
  var FLORIDA='M256.8,278.9L258.5,277L259.1,278.1L257.4,279.5ZM253.3,281L254.4,279.7L255.8,279.6L255.1,280.7ZM243.8,284.7L250.3,281.7L251,282.7L245.5,285.3ZM220,289.9L222.3,286.5L224.8,285L227.9,283.6L228.3,282.8L232.8,280.6L237.5,282.8L238,284.5L239.7,285.9L239.2,286.3L234.3,287.9L233.9,287L230.5,287.2L230.2,287.9L224.4,290.3L220,290.8ZM213,290.9L217.9,290.1L216.6,291.5L214.5,292L212.9,291.7ZM207.8,290.2L208.5,289L210,289.4L209.4,290.7ZM204.3,208.1L204.9,208.7L207.3,215.8L208.3,216.7L210.4,217.6L211.3,217L213,217.7L211.3,218.7L210.2,218.8L207.5,217.1L206.7,216.2L205.1,212.3L204.3,209.8ZM181.2,287.5L183.1,287.1L183.6,287.8L181.1,288.2ZM121,86.4L124.6,84.8L124.6,85.8L122.7,87.1L121.3,87.3ZM109.5,38L110.2,40.7L111.6,42.5L111.8,45.4L112.6,48L114.3,49.7L131.2,50.5L163.7,52.5L189.3,54.2L206.1,55.4L205.4,55.9L205.7,57.9L206.5,58.8L206.2,61.2L207.5,63.8L212.1,63.4L212.1,60.8L212.9,59.2L213.3,55.1L211.8,51.9L212.3,49.9L212.1,48.2L213.1,47.6L212.6,46.8L214.1,47L215.2,45L217.1,45.2L218,46.4L220.1,46.5L222.3,47.5L223.2,48.3L227.3,49L229.4,49.6L231.2,49.1L232.8,49.7L233.3,50.2L232.8,54.1L233.1,57.3L232.6,58L233.9,58.9L234.4,62.2L234.5,66.1L237.4,79.5L239,83.9L239,85.6L242.5,96L246.4,105.8L250,113.6L258.1,127.6L262.9,134.4L263.3,136.5L264.6,139.3L262.4,141.3L261.9,143.1L261.7,146L262.4,150.4L263.1,153.7L265.1,158.5L269.4,167.6L271.3,173.2L271.9,176L272.5,177L273.9,181.7L276,186.7L277.1,189L277.9,192.1L279.5,195.7L281.6,204.3L281.5,212.2L280.6,218L280,225L279.6,226.2L278.6,235.7L278.6,241.2L278.3,243.9L277.4,246.6L277.4,248L276.6,247.3L277,245.6L276.4,244.9L274.4,245.7L273.2,249.1L272.4,249.7L272.3,251.8L271.3,253.1L271.1,255.7L271.7,256.8L271.4,258.3L272.2,258.8L271.2,260.5L270.2,261L270.1,262.6L272.7,261.3L275.8,254.9L276.6,253.6L276.6,254.9L275.7,257.6L271.4,265L270.3,267.6L267.2,270.7L263,275.3L260,277.4L259.6,277L263.8,273L265.6,271.7L266.5,270L266.8,267.3L267.4,266.3L266.7,265.5L265.6,265.9L264.7,265L264,265.6L259.7,266.3L258,267.7L256.9,267.9L254.6,266.4L252.4,266.8L251.5,268.2L248.2,268.8L245.3,269L243.2,267.3L242.2,265L242.5,262.4L243.2,260.4L244,260.5L243.7,258.9L242.2,255.7L240.9,254.2L241.1,253.1L240.1,251L238.7,250L238.1,247.2L237.4,246.6L236,247.1L234.9,243.7L231.9,242.7L231.8,242.2L229.2,240.9L226.6,239.1L225.2,239.5L224.2,240.8L222.2,236.7L220.3,231.8L219.7,226L218.9,222.4L218,220.5L214.5,216.8L213.1,216.5L213,214.7L211.5,214L211.5,216.1L209.8,216.5L209.7,214.3L208.7,210.5L207.2,208.8L207.5,208L209.2,208.1L210.3,209.4L211.6,204.1L211.4,201.2L210.4,200.8L210.4,199.4L211.4,199.1L210.9,198.1L209.4,198.2L208.8,199.3L207.4,199.7L208.4,204.6L207.3,205.3L204.8,205.6L204.2,207.3L204.2,204.8L203.4,203.1L201.3,200L198.1,194.1L197,191L194.6,186.3L191.3,181.3L189.5,179.4L189,177.5L187.8,175.4L189,176.1L189.1,177.1L191,176.1L192.3,173.6L193.7,172.7L195.4,169.4L197,168.3L196.7,167.5L198.5,166.6L199.8,163.8L199.2,161.3L196.5,160.6L197.1,164.4L194.4,163.4L195.1,162.2L195,160L194.4,158.7L189.6,156.3L189.8,158.5L188.4,159.5L189.8,160.7L191.8,160.9L193.1,164.6L191.9,166L191.9,168.1L191.4,169L188.8,169.2L188.4,170.3L189.3,171.6L188.2,172.6L187.7,171.2L187.9,168.4L186.2,165.6L185,164.7L184.1,162.8L184.8,156.6L184.2,154.4L183.7,148.9L184.8,148.8L184.8,152L185.3,155L186.4,155.2L185.9,150.1L187,148.8L187.2,147.4L188.2,145.9L188.2,144.6L189,143L189,141.6L190.1,140.1L190.3,137L190.9,134.2L190.1,131.9L190.4,130L188.8,129L189.3,127.6L188.2,123.9L189.6,121.7L187,118L187.4,116.9L186.4,115.1L185.2,115L185.8,113.9L185.7,112.2L184.8,111.7L179,111L177.8,112.7L177,112.8L175.9,109.4L176.2,107.9L174.5,106.8L173,106.5L172.7,104.3L171.9,102.4L170.5,100.8L168.6,100.6L168,99.1L165,97.5L165,93.7L164.5,91.4L163,91.1L161.8,89.8L160.2,89.3L158.6,87.2L158.6,85.7L157.5,84.5L156.8,82.8L155.1,81.3L151.6,79.1L146.6,76.7L143.4,74.1L142,74.2L138.8,75.3L135,74.3L134.8,75.5L131.6,77.9L132.7,81.3L132.4,82.2L131.1,82.5L129.2,82L128.6,81.1L125.6,81.8L121.8,84.3L113.7,88.9L113,88.8L113.8,87.3L112.6,86.9L111.7,88.2L109.9,89.6L105.4,89.6L107,91.3L107.2,92.6L109.2,93.3L113,91.5L116.6,90.1L119.9,87.2L120.3,87.7L117.3,90.5L113.8,92L109.5,94.2L108,94.7L106.7,93.6L104.8,92.8L101.9,91.1L99.5,90.8L97.4,91.8L95.8,88.6L95.2,84.5L96.2,83.1L96.2,86.7L96.9,89.8L97.8,90.5L99,89.2L99.2,85.9L97.1,82.3L94.8,80.2L92.7,79.8L90.8,78.4L88.9,76L85.5,74.3L82.8,72L77.7,68.7L71.8,66.1L64.6,63.7L60.8,63L53.1,62.4L49,62.5L43.1,63.4L35,65.1L31.1,65.6L30.2,65.3L22.4,67L24.2,66.1L23.4,65.3L24.5,64.8L25.5,61.9L27.7,60.7L25.2,59L24.8,57.1L26.7,53.6L26.3,51.2L21.9,48.4L21.5,47L18.6,44.2L18.4,43.4L20,39.5L19.6,38.1L40.3,38.1L57,38.3L78.7,38.3L92.3,38.2L101.2,38Z';
  var PROJ={k:1983.9520819265306,tx:3052.8651341112954,ty:1168.0178600761556};
  function project(lon,lat){ var r=Math.PI/180; return [PROJ.k*lon*r+PROJ.tx, -PROJ.k*Math.log(Math.tan(Math.PI/4+lat*r/2))+PROJ.ty]; }

  function get(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } }
  function put(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function fresh(){ return {thread:[],seen:{},ack:{},hints:{}}; }
  var S=get(KEY,null)||fresh(); ['thread','seen','ack','hints'].forEach(function(k){ if(!S[k]) S[k]=k==='thread'?[]:{}; });
  /* older 4.03.05 progress used named beats; keep a returning student's texts from firing twice */
  if(S.seen.mapDone) S.seen.s1Done=true; if(S.seen.wheelDone) S.seen.s2Done=true;
  var C=get(CKEY,{opened:[],sentences:{}}); C.sentences=C.sentences||{};
  var EKEY='oao.profile';   /* the ELA course's profile: same site, so a name typed there greets them here */
  function okName(n){ return !!n&&!nameProblem(n); }
  function loadProfile(){ var p=get(PKEY,null); if(p&&okName(p.name)) return p; var e=get(EKEY,null); return e&&okName(e.name)?{name:e.name}:null; }
  var P=null;   /* loaded in build(), after the name filter is defined */
  function save(){ put(KEY,S); put(CKEY,C); }
  function el(t,c,h){ var d=document.createElement(t); if(c) d.className=c; if(h!=null) d.innerHTML=h; return d; }
  function after(r,n){ r.parentNode.insertBefore(n,r.nextSibling); } function before(r,n){ r.parentNode.insertBefore(n,r); }
  /* every mini-game can carry DATA.<game>.why = {icon, q, t}: a short "why this game?" card that gives the context
     behind the immersion (what a mission was before ringing mission bells, why ships flew flags…). Shown above the directions. */
  function whyCard(w){ if(!w) return ''; if(typeof w==='string') w={t:w}; return '<div class="spk-why"><span class="ic" aria-hidden="true">'+esc(w.icon||'🔎')+'</span><div><b>'+esc(w.q||'Why this?')+'</b> '+w.t+'</div></div>'; }
  function voice(t,c){ return whyCard(c&&c.why)+(t?'<p class="spk-voice">'+t+'</p>':''); }
  function words(s){ return (s||'').trim().split(/\s+/).filter(Boolean).length; }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function shuffle(a){ return a.slice().sort(function(){return .5-Math.random();}); }
  function find(list,id,key){ key=key||'id'; return (list||[]).filter(function(x){ return x[key]===id; })[0]; }
  function thumb(name,emoji){ var ph=el('div','ph',emoji); if(!name) return ph; var img=new Image(); img.className='ph'; img.alt=''; (function tryI(i){ if(i>=EXT.length) return; var t=new Image(); t.onload=function(){ img.src=t.src; ph.replaceWith(img); }; t.onerror=function(){ tryI(i+1); }; t.src=IMG+name+EXT[i]; })(0); return ph; }
  function nm(){ return P&&P.name?P.name:''; }

  /* ================================================================ YOUR NAME — asked once, the same way as the ELA course
     (same card, same filter). Kept on this computer only. Saving also fixes the spelling in the ELA profile if
     one exists; it never creates one, so ELA still asks for the owl. */
  var NAME_STRONG=['fuck','shit','bitch','cunt','whore','slut','wank','bollock','bastard','penis','vagina','boob','anus','turd','scrotum','testicle','nigg','fagg','retard','kike','chink','tranny','porn','rape','nazi','hitler'];
  var NAME_WHOLE=['ass','arse','hell','damn','crap','piss','poop','pee','fart','butt','bum','dick','cock','prick','knob','willy','tit','sex','kill','dumb','stupid','idiot','loser','ugly','fatso','poopy','poopyhead'];
  function nameFold(v){ return String(v).toLowerCase().replace(/[4@]/g,'a').replace(/3/g,'e').replace(/[1!|]/g,'i').replace(/0/g,'o').replace(/[$5]/g,'s').replace(/7/g,'t').replace(/[^a-z ]+/g,' ').replace(/(.)\1+/g,'$1').replace(/\s+/g,' ').trim(); }
  function nameProblem(raw){ var SF=NAME_STRONG.map(nameFold), WF=NAME_WHOLE.map(nameFold), name=String(raw||'').trim(), i;
    if(!name) return 'Type your first name.';
    if(name.replace(/[^A-Za-z]/g,'').length<2) return 'That is a bit short — what do people call you?';
    var f=nameFold(name); if(!f) return 'Use letters for your name.';
    for(i=0;i<SF.length;i++) if(SF[i]&&f.indexOf(SF[i])!==-1) return 'block';
    var sq=f.replace(/ /g,''); for(i=0;i<SF.length;i++) if(SF[i].length>=4&&sq.indexOf(SF[i])!==-1) return 'block';
    var w=f.split(' '); for(i=0;i<w.length;i++) if(WF.indexOf(w[i])!==-1) return 'block';
    return null; }
  function storageWorks(){ try{ var k='oao.__probe'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; }catch(e){ return false; } }
  var openingWaiting=false;
  function showNameCard(isEdit){ if(document.querySelector('.spk-name-card')) return;
    var anchor=document.querySelector('.spk-note.opening')||document.getElementById('introSection'); if(!anchor) return;
    var card=el('div','spk spk-name-card');
    card.innerHTML='<div class="k"><span class="spk-avatar">👩‍🏫</span>'+(isEdit?'Fix your name':'Before we begin')+'</div><h3>'+(isEdit?'How should your name be spelled?':'What should your teacher call you?')+'</h3><p class="sub">Just your first name. It stays on this computer. Nobody else sees it.</p><div class="row"><input class="in" maxlength="24" autocomplete="off" placeholder="Your first name" aria-label="Your first name"><button type="button" class="go">'+(isEdit?'Save':'Begin')+'</button>'+(isEdit?'<button type="button" class="cancel">Cancel</button>':'')+'</div><div class="warn" role="alert"></div>';
    before(anchor,card);
    var input=card.querySelector('.in'), go=card.querySelector('.go'), warn=card.querySelector('.warn');
    function clean(v){ return (v||'').replace(/[^A-Za-z \-']/g,'').trim().slice(0,24); }
    function sync(){ go.disabled=clean(input.value).length===0; warn.textContent=''; }
    input.value=nm(); input.addEventListener('input',sync); sync();
    input.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!go.disabled) go.click(); });
    var cx=card.querySelector('.cancel'); if(cx) cx.addEventListener('click',function(){ card.remove(); });
    go.addEventListener('click',function(){ var name=clean(input.value), pr=nameProblem(input.value)||nameProblem(name);
      if(pr){ warn.textContent=pr==='block'?'Let’s use your real first name. This is the name that goes on your work.':pr; input.focus(); return; }
      P=Object.assign({},get(PKEY,null)||{},{name:name,created:(P&&P.created)||new Date().toISOString()}); put(PKEY,P);
      var e=get(EKEY,null); if(e&&e.name&&e.name!==name){ e.name=name; put(EKEY,e); }
      card.remove(); paintWho(); if(openingWaiting){ openingWaiting=false; startOpening(); } });
    if(!isEdit) setTimeout(function(){ try{ input.focus({preventScroll:true}); }catch(e){} },50); else input.focus(); }
  function paintWho(){ var w=fileEl&&fileEl.querySelector('.spk-who'); if(!w) return; w.classList.toggle('spk-hide',!nm()); w.querySelector('b').textContent=nm(); }
  /* {name,} → "Maya, " or nothing (then the next letter is capitalised) */
  function fill(t){ t=String(t||''); return t.replace(/^\{name,\}(\s*)(.)/,function(m,s,ch){ return nm()?nm()+', '+ch:ch.toUpperCase(); }).replace(/\{name,\}/g,nm()?nm()+', ':'').replace(/\{name\}/g,nm()); }
  function notebookWritten(){ var ta=document.getElementById('journal-assign'); return !!ta && words(ta.value)>=MIN_WORDS; }
  function checklistDone(){ var items=document.querySelectorAll('.turn-in-item'); return items.length>0 && [].every.call(items,function(i){return i.classList.contains('checked');}); }
  /* base nodes the layer moves are put back by teardown */
  var MOVES=[], ATTRS=[];
  function move(n,fn){ if(!n||!n.parentNode) return; var m=document.createComment('spk-move'); n.parentNode.insertBefore(m,n); MOVES.push([n,m]); fn(n); }
  function clock(){ var d=new Date(),h=d.getHours(),m=d.getMinutes(); return (h%12||12)+':'+(m<10?'0':'')+m; }
  function activityTitled(scope,rx){ rx=new RegExp(rx,'i'); return [].filter.call(document.querySelectorAll(scope+' .activity'),function(a){ var t=a.querySelector('.activity-title'); return rx.test(t?t.textContent:a.textContent); })[0]; }

  /* ================================================================
     THE PHONE — the teacher, texting from inside Canvas.
     ================================================================ */
  var thread=S.thread, pendingKey=S.pendingKey||null, phoneEl, mailEl, toastEl, toastTimer, unread=0, CHOICES={};
  function push(m){ thread.push(m); save(); render(); }
  function teacher(text,choiceKey,opts){ opts=opts||{}; text=fill(text); push({f:'t',t:text,k:sayKey(text),scene:opts.scene||currentScene(),ts:Date.now()}); if(choiceKey){ pendingKey=choiceKey; S.pendingKey=choiceKey; save(); } if(!opts.quiet){ unread++; toast(text); } render(); }
  function student(text){ var sc=(pendingKey&&CHOICES[pendingKey]&&CHOICES[pendingKey].scene)||currentScene(); push({f:'s',t:text,scene:sc}); pendingKey=null; S.pendingKey=null; save(); }
  /* every reply option can be sent: after one, the ones not asked yet stay offered (an option with "end":true closes the set) */
  function asked(k){ S.asked=S.asked||{}; return S.asked[k]=S.asked[k]||[]; }
  function choicesHTML(){ var cs=pendingKey&&CHOICES[pendingKey]; if(!cs) return ''; var a=asked(pendingKey); return '<div class="spk-choices">'+cs.map(function(c,i){ return a.indexOf(i)!==-1?'':'<button type="button" class="spk-choice'+(c.go?' go':'')+'" data-key="'+pendingKey+'" data-i="'+i+'">'+esc(c.t)+'</button>'; }).join('')+'</div>'; }
  function msgHTML(m){ if(m.f!=='t') return '<div class="spk-msg '+m.f+'">'+esc(m.t)+'</div>'; var k=m.k||sayKey(m.t); probeSay(k); return '<div class="spk-msg t">'+esc(m.t)+'<button type="button" class="spk-say'+(SAY[k]?' ok':'')+(SAYNOW===k?' playing':'')+'" data-k="'+k+'" aria-label="Listen to this text">'+(SAYNOW===k?'❚❚':'▶')+'</button></div>'; }
  /* ---- the teacher reads her texts aloud: a ▶ appears on a text when its clip exists (g4ss-<lesson>-txt-<key>.mp3).
     key = FNV-1a of the text with the student's name taken out, lower-case letters and digits only (first 6 hex). ---- */
  var SAY={}, SAYP={}, SAYNOW=null, SAYAU=null;
  function sayKey(t){ var s=String(t||''); if(nm()){ s=s.split(nm()+' — good, it’s you. ').join('').split(nm()+', ').join('').split(nm()+' — ').join(''); } s=s.toLowerCase().replace(/[^a-z0-9]+/g,''); var h=0x811c9dc5; for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } return ('0000000'+h.toString(16)).slice(-8).slice(0,6); }
  function probeSay(k){ if(SAYP[k]) return; SAYP[k]=1; var a=new Audio(); a.preload='metadata'; a.addEventListener('loadedmetadata',function(){ SAY[k]=a; document.querySelectorAll('.spk-say[data-k="'+k+'"]').forEach(function(b){ b.classList.add('ok'); }); }); a.addEventListener('ended',function(){ if(SAYNOW===k){ SAYNOW=null; paintSay(); } }); a.src=AUD+'g4ss-'+LESSON+'-txt-'+k+'.mp3'; }
  function paintSay(){ document.querySelectorAll('.spk-say').forEach(function(b){ var on=b.dataset.k===SAYNOW; b.classList.toggle('playing',on); b.textContent=on?'❚❚':'▶'; }); }
  if(!window.__spkSay){ window.__spkSay=true; document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('.spk-say'); if(!b) return; e.stopPropagation(); var k=b.dataset.k, a=SAY[k]; if(!a) return; if(SAYNOW===k){ a.pause(); SAYNOW=null; paintSay(); return; } if(SAYNOW&&SAY[SAYNOW]) SAY[SAYNOW].pause(); document.querySelectorAll('audio').forEach(function(o){ o.pause(); }); a.currentTime=0; var pr=a.play(); if(pr&&pr.catch) pr.catch(function(){}); SAYNOW=k; paintSay(); },true); }
  function ack(sc){ var n=thread.filter(function(m){return m.scene===sc;}).length; if((S.ack[sc]||0)!==n){ S.ack[sc]=n; save(); render(); } }
  function noteHTML(label){ return '<div class="hd"><div class="k"><span class="spk-avatar">👩‍🏫</span>'+label+'</div><button type="button" class="fold">Fold up ▴</button></div><div class="spk-msgs"></div><div class="spk-ch"></div><button type="button" class="mini"><span class="dot"></span><span class="spk-avatar">👩‍🏫</span><span class="pv"></span><span class="go">Open ▸</span></button>'; }
  function onNote(e){ var n=e.currentTarget; if(e.target.closest('.mini')){ openPhone(true); return; } if(e.target.closest('.fold')){ ack(n.dataset.scene); return; } onChoice(e); }
  function onChoice(e){ var b=e.target.closest('.spk-choice'); if(!b) return; var cs=CHOICES[b.dataset.key]; if(!cs||b.dataset.key!==pendingKey) return; var key=b.dataset.key, i=+b.dataset.i, c=cs[i], a=asked(key); if(a.indexOf(i)===-1) a.push(i); student(c.t); if(c.reply) teacher(c.reply,c.next||null,{scene:cs.scene,quiet:true});
    if(!c.next&&!c.end&&a.length<cs.length){ pendingKey=key; S.pendingKey=key; } save(); render(); }
  function render(){
    if(phoneEl){ var w=phoneEl.querySelector('.spk-msgs-wrap'); w.querySelector('.spk-msgs').innerHTML='<div class="spk-msg sys">Today</div>'+thread.map(msgHTML).join(''); w.scrollTop=w.scrollHeight; var comp=phoneEl.querySelector('.spk-composer'); comp.innerHTML=pendingKey&&CHOICES[pendingKey]?'<div class="lab">Tap a reply</div>'+choicesHTML():'<div class="none">No reply needed. Keep going — I’ll text when something changes.</div>'; phoneEl.querySelector('.spk-status .tm').textContent=clock(); phoneEl.querySelector('.spk-contact .st').textContent=nm()?'texting '+nm()+' · inside Canvas':'inside Canvas · online'; }
    if(mailEl){ mailEl.classList.toggle('unread',unread>0); mailEl.querySelector('.n').textContent=unread; }
    var phoneOpen=phoneEl&&phoneEl.classList.contains('open');
    ['open','scene','explore','check','assignment'].forEach(function(sc){ var n=document.querySelector('.spk-note[data-scene="'+sc+'"]'); if(!n) return; var ms=thread.filter(function(m){return m.scene===sc;});
      if(phoneOpen) S.ack[sc]=ms.length;
      var isNew=ms.length>(S.ack[sc]||0), lt=ms.filter(function(m){return m.f==='t';}).slice(-1)[0];
      n.classList.toggle('spk-hide',!ms.length); n.classList.toggle('new',isNew);
      n.querySelector('.spk-msgs').innerHTML=(sc==='open'?ms:ms.slice(-4)).map(msgHTML).join(''); n.querySelector('.spk-ch').innerHTML=(pendingKey&&CHOICES[pendingKey]&&CHOICES[pendingKey].scene===sc)?choicesHTML():'';
      var tc=thread.filter(function(m){return m.f==='t';}).length; n.querySelector('.mini .pv').innerHTML=isNew&&lt?'<b>New text:</b> '+esc(lt.t):'<b>Texts from your teacher</b> · '+tc+' message'+(tc===1?'':'s'); });
    if(phoneOpen) save();
  }
  function openPhone(o){ if(!phoneEl) return; phoneEl.classList.toggle('open',o); mailEl&&mailEl.setAttribute('aria-expanded',!!o); if(o){ unread=0; hideToast(); render(); } }
  function toast(text){ if(!toastEl||phoneEl.classList.contains('open')) return; toastEl.querySelector('.tx span').textContent=(nm()&&text.indexOf(nm())===-1?nm()+' — ':'')+text; toastEl.querySelector('.tx small').textContent='now'; toastEl.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(hideToast,7000); }
  function hideToast(){ if(toastEl) toastEl.classList.remove('show'); }
  function currentScene(){ var a=document.querySelector('.tab-panel.active'); return a?a.id.replace('panel-',''):'scene'; }
  /* DATA.texts.choices = { key: {scene, list:[{t, go, reply, next}]} } */
  Object.keys(T.choices||{}).forEach(function(k){ var c=T.choices[k], list=(c.list||[]).slice(); list.scene=c.scene||'scene'; CHOICES[k]=list; });
  /* DATA.texts.beats = { s1Done|s2Done|quizDone|cracked: [{t, choice, quiet}] } — the scene defaults to where it happened */
  var BEAT_SCENE={s1Done:'scene',s2Done:'explore',quizDone:'check',cracked:'assignment'};
  function beat(k){ if(S.seen[k]) return; S.seen[k]=true; save(); var b=(T.beats||{})[k]; if(!b) return; [].concat(b).forEach(function(m){ if(typeof m==='string') m={t:m}; teacher(m.t,m.choice||null,{scene:m.scene||BEAT_SCENE[k],quiet:!!m.quiet}); }); }
  var missStreak=0;
  function missBeat(hint){ missStreak++; if(missStreak===2){ missStreak=0; teacher('That’s two misses in a row. Here’s a hint: '+hint,null,{scene:'scene'}); } }

  function buildPhone(){
    phoneEl=el('div','spk spk-phone'); phoneEl.setAttribute('role','dialog'); phoneEl.setAttribute('aria-label','Messages from your teacher');
    phoneEl.innerHTML='<div class="spk-screen"><div class="spk-notch"></div><div class="spk-status"><span class="tm"></span><span>●●● 🔋</span></div><div class="spk-contact"><div class="spk-avatar">👩‍🏫</div><div><div class="nm">Your teacher</div><div class="st">inside Canvas · online</div></div><button type="button" class="x" aria-label="Close messages">✕</button></div><div class="spk-msgs-wrap"><div class="spk-msgs"></div></div><div class="spk-composer"></div></div>';
    phoneEl.addEventListener('click',onChoice); phoneEl.querySelector('.x').addEventListener('click',function(){ openPhone(false); });
    document.body.appendChild(phoneEl);
    toastEl=el('div','spk spk-toast'); toastEl.setAttribute('role','status'); toastEl.innerHTML='<div class="ic">💬</div><div class="tx"><b>Your teacher · inside Canvas <small>now</small></b><span></span></div>';
    toastEl.addEventListener('click',function(){ openPhone(true); }); document.body.appendChild(toastEl);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&phoneEl&&phoneEl.classList.contains('open')) openPhone(false); });
  }
  /* The phone and its notification hang from the sticky file bar, so they open on screen wherever the student is
     scrolled (a fixed corner fails in Canvas, where the iframe can be taller than the window). */
  function dockPhone(){ if(!fileEl) return; if(phoneEl) fileEl.appendChild(phoneEl); if(toastEl) fileEl.appendChild(toastEl); fileEl.classList.add('spk-docked'); }
  function buildOpening(){
    var intro=document.getElementById('introSection'); if(!intro) return;
    var note=el('div','spk spk-note opening spk-hide'); note.dataset.scene='open'; note.innerHTML=noteHTML('Texts from your teacher · inside Canvas'); note.addEventListener('click',onNote); before(intro,note);
    if(!thread.length){ if(!nm()&&storageWorks()) openingWaiting=true; else startOpening(); }
  }
  /* THE STORY SO FAR — one line at the top for students who join mid-year (rolling enrollment).
     Course default here; a lesson can override with DATA.storySoFar. */
  function buildStory(){ var anchor=document.querySelector('.spk-note.opening')||document.getElementById('introSection'); if(!anchor) return;
    var t=DATA.storySoFar||(QUIET?'Your teacher is stuck inside Canvas. Every Florida File you finish opens a door and gets your teacher one room closer to getting out.':'Your teacher is stuck inside Canvas! Every Florida File you finish opens a door and gets your teacher one room closer to getting out.');
    before(anchor,el('div','spk spk-story','<span class="k">📁 The story so far</span><span class="t">'+esc(t)+'</span>')); }
  function startOpening(){
    if(thread.length) return;
    {
      var hi=nm()?nm()+' — good, it’s you. ':'';
      var op=[].concat(T.opening||[]);
      teacher(hi+(T.hello||'Hi, it’s me, your teacher. I’m still stuck inside Canvas.')+(DATA.connector?' '+DATA.connector:''),null,{scene:'open',quiet:true});
      op.forEach(function(m){ if(typeof m==='string') m={t:m}; teacher(m.t,m.choice||null,{scene:'open',quiet:true}); });
      unread=op.length+1; render(); setTimeout(function(){ toast(T.toast||'Hi, it’s me, your teacher. I’m still stuck inside Canvas, and I need your help to open today’s file.'); },900);
    }
  }

  /* ================================================================ THE FILE — folder tabs that move through the lesson */
  var fileEl, STAGES=DATA.stages||[];
  function seal(x,y,ico,id){ return '<g class="spk-seal" data-seal="'+id+'"><circle cx="'+x+'" cy="'+y+'" r="13" fill="#A3312B"/><circle cx="'+x+'" cy="'+y+'" r="9.5" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-dasharray="2 2"/><text x="'+x+'" y="'+(y+4.5)+'" text-anchor="middle" style="font-size:11px">'+ico+'</text></g>'; }
  function folderSVG(){ var se=FILE.seals||['🗺️','📄','✍️']; return '<svg class="spk-folder-svg" viewBox="0 0 170 130" aria-hidden="true"><path d="M6,30 h50 l10,-12 h50 a6,6 0 0 1 6,6 v6 h36 a6,6 0 0 1 6,6 v84 a6,6 0 0 1 -6,6 h-152 a6,6 0 0 1 -6,-6 z" fill="#C9A96B"/><rect x="14" y="40" width="142" height="80" fill="#FFFDF5" stroke="#D8C7A2"/><g class="lid"><path d="M6,44 h158 a6,6 0 0 1 6,6 v70 a6,6 0 0 1 -6,6 h-152 a6,6 0 0 1 -6,-6 z" fill="#E8D4A8" stroke="#B89860"/><text x="16" y="66" style="font:800 9px ui-monospace,Menlo,monospace;letter-spacing:.1em;fill:#5C4A2A">'+esc(String(FILE.label||FILE_TITLE).toUpperCase())+'</text>'+seal(40,100,se[0],'s1')+seal(85,100,se[1],'s2')+seal(130,100,se[2],'s4')+'</g></svg>'; }
  function buildFile(){
    var anchor=document.querySelector('.spk-note.opening')||document.getElementById('introSection'); if(!anchor||!STAGES.length) return;
    fileEl=el('div','spk spk-file'); fileEl.innerHTML='<div class="spk-file-row">'+folderSVG()+'<div><div class="spk-file-sub"><span><span class="ttl">The Florida Files · '+esc(FILE_TITLE)+' · </span><span class="pg"></span></span><span class="spk-whowrap"><button type="button" class="spk-who spk-hide" title="Fix the spelling of my name"><b></b> ✎</button><button type="button" class="spk-mail" aria-expanded="false">📱 Messages <span class="n">0</span></button></span></div><div class="spk-tabs" role="tablist">'+STAGES.map(function(s,i){return '<button type="button" role="tab" class="spk-tab" data-tab="'+s.tab+'"><span class="n"><span>'+(i+1)+'</span></span><span class="l">'+esc(s.r)+'<small>'+esc(s.t)+'</small></span></button>';}).join('')+'</div></div></div>';
    fileEl.addEventListener('click',function(e){ var t=e.target.closest('.spk-tab'); if(t){ switchTab(t.dataset.tab); } });
    fileEl.querySelector('.spk-who').addEventListener('click',function(){ showNameCard(true); }); paintWho();
    mailEl=fileEl.querySelector('.spk-mail'); mailEl.addEventListener('click',function(){ openPhone(!phoneEl.classList.contains('open')); });
    before(anchor,fileEl);
    if(window.switchTab&&!window.__spkWrapped){ var orig=window.switchTab; window.switchTab=function(tab){ var prev=currentScene(); orig(tab); if(document.documentElement.classList.contains('spk-on')){ if(prev!==tab){ ack(prev); if(prev==='scene') ack('open'); } document.documentElement.dataset.spkTab=tab; markNow(tab); render(); } }; window.__spkWrapped=true; }
    document.documentElement.dataset.spkTab=currentScene();
    markNow(currentScene());
  }
  function markNow(tab){ if(!fileEl) return; var i=STAGES.map(function(s){return s.tab;}).indexOf(tab); fileEl.querySelectorAll('.spk-tab').forEach(function(s){ var on=s.dataset.tab===tab; s.classList.toggle('now',on); s.setAttribute('aria-selected',on); }); fileEl.querySelector('.pg').textContent='tab '+(i+1)+' of '+STAGES.length; }
  function s1Done(){ return !!(R.scene1&&R.scene1.done()); }
  function s2Done(){ var m=R.evidence||R.reading; return !!(m&&m.done()); }
  function refreshFile(){ var st=[s1Done(),s2Done(),!!S.quizDone,!!S.cracked];
    if(fileEl){ fileEl.querySelectorAll('.spk-tab').forEach(function(s,i){ s.classList.toggle('done',st[i]); }); ['s1','s2','s4'].forEach(function(k,i){ var g=fileEl.querySelector('[data-seal="'+k+'"]'); if(g) g.classList.toggle('on',[st[0],st[1],st[3]][i]); }); fileEl.classList.toggle('open',!!S.cracked); }
    updateStepper();
    if(st[0]) beat('s1Done'); if(st[1]) beat('s2Done'); if(S.quizDone) beat('quizDone'); if(S.cracked) beat('cracked'); }

  /* ================================================================ scenes: a head per tab, a text that lands at each tab's end */
  function buildScenes(){
    STAGES.forEach(function(s,i){ var panel=document.getElementById('panel-'+s.tab); if(!panel) return;
      var sc=el('div','spk spk-scene'); sc.innerHTML='<div class="spk-scene-head"><div class="spk-scene-n">'+(i+1)+'</div><div><div class="spk-scene-t">'+esc(s.t)+'</div><p class="spk-scene-why">'+esc(s.why)+'</p></div></div>';
      panel.insertBefore(sc,panel.firstChild);
      var tw=panel.querySelector('.tab-next-wrap')||panel.lastElementChild; var note=el('div','spk spk-note spk-hide'); note.dataset.scene=s.tab; note.innerHTML=noteHTML('New text from inside Canvas'); note.addEventListener('click',onNote); before(tw,note); });
  }

  /* ================================================================ FLORIDA MAP — shared base for every map */
  function floridaBase(label){ return '<defs><pattern id="spkWave'+label+'" width="22" height="10" patternUnits="userSpaceOnUse"><path d="M0,6 q5.5,-5 11,0 t11,0" fill="none" stroke="#7FB5CC" stroke-width="1" opacity=".6"/></pattern></defs><rect width="300" height="300" fill="#BFE3EE"/><rect width="300" height="300" fill="url(#spkWave'+label+')"/><path d="'+FLORIDA+'" fill="#E7E0B5" stroke="#8A7A4A" stroke-width="1" transform="translate(2,2)" opacity=".35"/><path d="'+FLORIDA+'" fill="#D8E6AE" stroke="#6E8A3A" stroke-width="1.2" stroke-linejoin="round"/><g fill="#4A7830">'+[[61,52],[103,48],[182,62],[44,46]].map(function(p){return '<polygon points="'+p[0]+','+(p[1]-8)+' '+(p[0]+4.5)+','+(p[1]+3)+' '+(p[0]-4.5)+','+(p[1]+3)+'"/>';}).join('')+'</g><path d="M250,153 C239,122 233,98 226,74 S233,62 237,58" fill="none" stroke="#6FA9C4" stroke-width="2" opacity=".85"/><ellipse cx="254" cy="198" rx="8" ry="7" fill="#9FD0E0" stroke="#6FA9C4" stroke-width=".8"/><g transform="translate(272,32)" opacity=".85"><circle r="18" fill="#FFFDF5" stroke="#8A6A1E"/><path d="M0,-15 L4,0 L0,15 L-4,0 Z" fill="#A3312B"/><path d="M-15,0 L0,4 L15,0 L0,-4 Z" fill="#5C4A2A"/><text y="-19" text-anchor="middle" style="font:800 8px Nunito,sans-serif;fill:#5C4A2A">N</text></g>'; }

  /* ================================================================ THE INTERACTION MODULES
     Each type: build(cfg) → {done(), journal()} . Registered results live in R. */
  var R={}, CATS=DATA.categories||[], HOT_TAP=[];
  var MOD={};

  /* ---- Scene 1 · Map Quest: drag a clue to the place on the real Florida map ---- */
  MOD.mapquest=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var Z=(cfg.zones||[]).map(function(z){ var p=project(z.lon,z.lat); return Object.assign({},z,{cx:Math.round(p[0]),cy:Math.round(p[1])}); });
    S.mapSolved=S.mapSolved||[]; S.stems=S.stems||{};
    var done=function(){ return S.mapSolved.length===Z.length; };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    function mapSVG(){ var s='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Florida map">'+floridaBase('A')+(cfg.caption?'<text x="14" y="288" style="font:italic 700 10px Lora,Georgia,serif;fill:#5C4A2A">'+esc(cfg.caption)+'</text>':'');
      Z.forEach(function(z){ var la=z.la||'middle', lx=z.cx+(z.dx||0), ly=z.cy+(z.dy!=null?z.dy:31); s+='<g class="spk-zone" data-zone="'+z.id+'"><circle class="ring" cx="'+z.cx+'" cy="'+z.cy+'" r="19" fill="#FFFDF5" fill-opacity=".6" stroke="#5C4A2A" stroke-width="1.5"/><text class="ico" x="'+z.cx+'" y="'+(z.cy+6)+'" text-anchor="middle" style="font-size:17px">'+z.ico+'</text><text x="'+lx+'" y="'+ly+'" text-anchor="'+la+'" style="font:800 9px Nunito,sans-serif;fill:#0E1C42;paint-order:stroke;stroke:#EAF4F7;stroke-width:3">'+esc(z.label)+'</text><text class="pp" x="'+z.cx+'" y="'+(z.cy-24)+'" text-anchor="middle" style="font:italic 800 10px Lora,Georgia,serif;fill:#A3312B;paint-order:stroke;stroke:#FFFDF5;stroke-width:3">'+esc(z.people)+'</text></g>'; }); return s+'</svg>'; }
    var N=cfg.notes||{};
    var g=el('div','spk spk-game'); g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Map Quest')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)+'<div class="spk-maplock"><div class="spk-map">'+mapSVG()+'</div><div><div class="spk-chips"></div><p class="spk-miss"></p></div></div><div class="spk-notes spk-hide"><div class="k">'+esc(N.label||'Notes · finish each line in your own words')+'</div><div class="spk-stems" data-help="spk-stems"></div><button type="button" class="spk-link" disabled></button></div>';
    var chips=g.querySelector('.spk-chips'), miss=g.querySelector('.spk-miss'), notes=g.querySelector('.spk-notes'), stems=g.querySelector('.spk-stems'), link=g.querySelector('.spk-link'), sel=null;
    var target=N.target||'journal-q1', tlab=N.targetLabel||'Evidence Question 1';
    function stemText(z){ return (N.stem||'The {people} lived {where} because').replace('{people}',z.people).replace('{where}',z.where); }
    shuffle(Z).forEach(function(z){ var c=el('div','spk-chip'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.zone=z.id; c.appendChild(thumb(z.img,z.ico)); c.appendChild(el('span',null,esc(z.clue))); chips.appendChild(c); });
    if(N.stem!==false) Z.forEach(function(z){ var row=el('div','spk-stem'); row.innerHTML='<span>'+esc(stemText(z)).replace(esc(z.people),'<b>'+esc(z.people)+'</b>')+'</span>'; var inp=el('input'); inp.placeholder='…'; inp.value=S.stems[z.id]||''; inp.addEventListener('input',function(){ S.stems[z.id]=inp.value; save(); linkState(); }); row.appendChild(inp); stems.appendChild(row); });
    function linkState(){ var n=Z.filter(function(z){return words(S.stems[z.id])>=3;}).length; link.disabled=n<2; link.textContent=n<2?'Finish at least two lines, then use them in '+tlab+' →':'Use these '+n+' lines in '+tlab+' →'; }
    link.addEventListener('click',function(){ var ta=document.getElementById(target); if(!ta) return; var lines=Z.filter(function(z){return words(S.stems[z.id])>=3;}).map(function(z){ var w=S.stems[z.id].trim(); return stemText(z)+' '+w+(/[.!?]$/.test(w)?'':'.'); }); var cur=ta.value.trim(); ta.value=(cur?cur+'\n':'')+lines.join(' '); ta.dispatchEvent(new Event('input',{bubbles:true})); switchTab('assignment'); setTimeout(function(){ ta.focus(); ta.scrollIntoView({behavior:'smooth',block:'center'}); },50); });
    function paint(){ S.mapSolved.forEach(function(id){ var zg=g.querySelector('.spk-zone[data-zone="'+id+'"]'); if(zg) zg.classList.add('solved'); var c=chips.querySelector('[data-zone="'+id+'"]'); if(c){ c.classList.add('done'); c.draggable=false; } }); notes.classList.toggle('spk-hide',!done()); linkState(); }
    function attempt(chip,zg){ if(!chip||!zg||zg.classList.contains('solved')||chip.classList.contains('done')) return; g.querySelectorAll('.spk-zone').forEach(function(z){z.classList.remove('armed','over');});
      if(zg.dataset.zone===chip.dataset.zone){ S.mapSolved.push(zg.dataset.zone); save(); chip.classList.remove('sel'); sel=null; miss.textContent=''; paint(); refreshFile(); }
      else { chip.classList.add('shake'); setTimeout(function(){chip.classList.remove('shake');},450); var mz=find(Z,chip.dataset.zone).miss; miss.textContent=mz; missBeat(mz); } }
    paint();
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-chip'); if(!c||c.classList.contains('done')) return; ack('open'); chips.querySelectorAll('.spk-chip').forEach(function(x){x.classList.remove('sel');}); c.classList.add('sel'); sel=c; miss.textContent=''; g.querySelectorAll('.spk-zone').forEach(function(z){ z.classList.toggle('armed',!z.classList.contains('solved')); }); });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-chip'); if(!c||c.classList.contains('done')){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.zone); e.dataTransfer.effectAllowed='move'; g.querySelectorAll('.spk-zone').forEach(function(z){ z.classList.toggle('armed',!z.classList.contains('solved')); }); });
    var map=g.querySelector('.spk-map');
    map.addEventListener('click',function(e){ attempt(sel,e.target.closest('.spk-zone')); });
    map.addEventListener('dragover',function(e){ var zg=e.target.closest('.spk-zone'); g.querySelectorAll('.spk-zone').forEach(function(z){z.classList.toggle('over',z===zg);}); if(zg){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    map.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-zone')); });
    body.appendChild(g);
    return {done:done, journal:function(e,NA){ var st=Z.filter(function(z){ return words(S.stems[z.id])>=1; }); return st.length?st.map(function(z){ return '<p class="a">'+e(stemText(z))+' '+e(S.stems[z.id].trim().replace(/[.!?]?$/,function(m){ return m||'.'; }))+'</p>'; }).join(''):NA; }};
  };

  /* ---- Scene 1 · Habit card: match each habit to the example that shows it, then write it in your own words.
     The card being built IS the Show-or-Make reminder card. ---- */
  MOD.habitcard=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var H=cfg.habits||[]; S.habit=S.habit||{placed:[],lines:{}};
    var minW=cfg.minWords||3;
    var placed=function(){ return S.habit.placed.length===H.length; };
    var done=function(){ return placed()&&H.every(function(h){ return words(S.habit.lines[h.id])>=minW; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-habit');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-habit-stamps" aria-label="Habits"></div><p class="spk-miss"></p>'
      +'<div class="spk-icard"><div class="spk-icard-top">'+esc(cfg.cardTitle||'My reminder card')+'</div>'
      +H.map(function(h,i){ return '<div class="spk-islot" data-ex="'+h.id+'"><div class="ex"><span class="q">“</span>'+esc(h.example)+'<span class="q">”</span></div><div class="drop" role="button" tabindex="0" aria-label="Put a habit here"><span class="empty">Drop the habit this shows</span><span class="got"></span></div><label class="mine"><span>'+esc(cfg.lineLabel||'In my words:')+'</span><input type="text" placeholder="…"></label></div>'; }).join('')
      +'</div><div class="spk-habit-ct" data-help="spk-habits"></div>'
      +(cfg.link?'<button type="button" class="spk-link" disabled></button>':'');
    var stamps=g.querySelector('.spk-habit-stamps'), miss=g.querySelector('.spk-miss'), ct=g.querySelector('.spk-habit-ct'), link=g.querySelector('.spk-link'), sel=null;
    /* examples are shuffled so the order on the card doesn't give the answer away */
    var slots=[].slice.call(g.querySelectorAll('.spk-islot')), icard=g.querySelector('.spk-icard'); shuffle(slots).forEach(function(s){ icard.appendChild(s); });
    shuffle(H).forEach(function(h){ var c=el('div','spk-chip noimg spk-stamp','<span class="ico">'+h.ico+'</span><span>'+esc(h.name)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.h=h.id; stamps.appendChild(c); });
    g.querySelectorAll('.spk-islot').forEach(function(s){ var inp=s.querySelector('input'), id=s.dataset.ex; inp.value=S.habit.lines[id]||''; inp.addEventListener('input',function(){ S.habit.lines[id]=inp.value; save(); paint(); refreshFile(); }); });
    function paint(){ g.querySelectorAll('.spk-islot').forEach(function(s){ var id=s.dataset.ex, on=S.habit.placed.indexOf(id)>=0, h=find(H,id); s.classList.toggle('placed',on); s.querySelector('.got').innerHTML=on?'<span class="ico">'+h.ico+'</span> '+esc(h.name):''; s.classList.toggle('written',on&&words(S.habit.lines[id])>=minW); });
      stamps.querySelectorAll('.spk-stamp').forEach(function(c){ var on=S.habit.placed.indexOf(c.dataset.h)>=0; c.classList.toggle('done',on); c.draggable=!on; });
      var n=S.habit.placed.length, w=H.filter(function(h){ return S.habit.placed.indexOf(h.id)>=0&&words(S.habit.lines[h.id])>=minW; }).length;
      ct.innerHTML=!placed()?'<b>'+n+' of '+H.length+'</b> habits on the card.':(w<H.length?'<b>All four are on the card.</b> Now write each one in your own words ('+w+' of '+H.length+' written).':'<b>Your card is ready.</b> Keep it in mind every time you write about real people.');
      g.classList.toggle('done',done());
      if(link){ var lw=H.filter(function(h){ return words(S.habit.lines[h.id])>=minW; }).length; link.disabled=lw<2; link.textContent=lw<2?'Write at least two lines, then use them in '+(cfg.link.label||'Evidence Question 1')+' →':'Use your card in '+(cfg.link.label||'Evidence Question 1')+' →'; } }
    function arm(on){ g.querySelectorAll('.spk-islot').forEach(function(s){ s.classList.toggle('armed',on&&!s.classList.contains('placed')); s.classList.remove('over'); }); }
    function attempt(chip,slot){ if(!chip||!slot||slot.classList.contains('placed')||chip.classList.contains('done')) return; arm(false);
      if(slot.dataset.ex===chip.dataset.h){ S.habit.placed.push(chip.dataset.h); save(); chip.classList.remove('sel'); sel=null; miss.textContent=''; paint(); slot.classList.add('spk-justin'); setTimeout(function(){ slot.classList.remove('spk-justin'); },700); var inp=slot.querySelector('input'); if(inp&&!('ontouchstart' in window)) inp.focus({preventScroll:true}); refreshFile(); }
      else { chip.classList.add('shake'); setTimeout(function(){chip.classList.remove('shake');},450); var h=find(H,chip.dataset.h), m=h.miss||''; miss.textContent=m; missBeat(m); } }
    stamps.addEventListener('click',function(e){ var c=e.target.closest('.spk-stamp'); if(!c||c.classList.contains('done')) return; ack('open'); stamps.querySelectorAll('.spk-stamp').forEach(function(x){x.classList.remove('sel');}); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    stamps.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&e.target.closest('.spk-stamp')){ e.preventDefault(); e.target.closest('.spk-stamp').click(); } });
    stamps.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-stamp'); if(!c||c.classList.contains('done')){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.h); e.dataTransfer.effectAllowed='move'; arm(true); });
    stamps.addEventListener('dragend',function(){ arm(false); });
    icard.addEventListener('click',function(e){ if(e.target.closest('input,label.mine')) return; var s=e.target.closest('.spk-islot'); if(s) attempt(sel,s); });
    icard.addEventListener('keydown',function(e){ var d=e.target.closest('.drop'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(sel,d.closest('.spk-islot')); } });
    icard.addEventListener('dragover',function(e){ var s=e.target.closest('.spk-islot'); g.querySelectorAll('.spk-islot').forEach(function(x){ x.classList.toggle('over',x===s); }); if(s&&!s.classList.contains('placed')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    icard.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-islot')); });
    if(link) link.addEventListener('click',function(){ var ta=document.getElementById(cfg.link.target||'journal-q1'); if(!ta) return; var lines=H.filter(function(h){ return words(S.habit.lines[h.id])>=minW; }).map(function(h){ var w=S.habit.lines[h.id].trim(); return h.name+': '+w+(/[.!?]$/.test(w)?'':'.'); }); var cur=ta.value.trim(); ta.value=(cur?cur+'\n':'')+lines.join(' '); ta.dispatchEvent(new Event('input',{bubbles:true})); switchTab('assignment'); setTimeout(function(){ ta.focus(); ta.scrollIntoView({behavior:'smooth',block:'center'}); },50); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ var rows=H.filter(function(h){ return S.habit.placed.indexOf(h.id)>=0; }); return rows.length?rows.map(function(h){ var w=(S.habit.lines[h.id]||'').trim(); return '<p class="a"><b>'+e(h.name)+'</b> — '+(w?e(w):'<i>(not written yet)</i>')+'</p>'; }).join(''):NA; }};
  };

  /* ---- Explore reading · season grid (4.03.05): four season files rebuilt from DATA, each opens on tap ---- */
  MOD.seasongrid=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var G=(cfg.cards||[]).map(function(c){ return Object.assign({},c,{rx:new RegExp(c.match,'i')}); }), first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ var st=p.querySelector('strong'); if(!st) return; if(G.some(function(g){ return g.rx.test(st.textContent.trim()); })){ p.classList.add('spk-hide'); if(!first) first=p; } });
    if(!first) return null;
    S.seasonsOpen=S.seasonsOpen||[];
    var grid=el('div','spk spk-seasons', G.map(function(g){ var s=find(CATS,g.id)||{}; return '<div class="spk-season" data-s="'+g.id+'" style="--c:'+s.color+'"><div class="hd"><span class="ic">'+s.ico+'</span><div><div class="nm">'+esc(s.label)+'</div><div class="wh">'+esc(g.when)+'</div></div></div><p>'+esc(g.say)+'</p><div class="life"><b>'+esc(cfg.lifeLabel||'Daily life')+'</b>'+esc(g.life)+'</div>'
      +'<button type="button" class="cover" aria-label="Open the '+esc(s.label)+' file"><span class="tabk">'+esc(s.label)+'</span><span class="big">'+s.ico+'</span><span class="cw">'+esc(g.when)+'</span><span class="tap">Tap to open</span></button></div>'; }).join('')+'<div class="spk-seasons-ct"></div>');
    var ct=cfg.counter||{};
    function paint(){ var n=S.seasonsOpen.length; grid.querySelectorAll('.spk-season').forEach(function(c){ c.classList.toggle('open',S.seasonsOpen.indexOf(c.dataset.s)>=0); }); grid.querySelector('.spk-seasons-ct').innerHTML=n<G.length?'<b>'+n+' of '+G.length+'</b> '+esc(ct.some||'files open.'):'<b>'+esc(ct.allHead||'All open.')+'</b> '+esc(ct.all||''); grid.classList.toggle('all',n===G.length); }
    grid.addEventListener('click',function(e){ var cv=e.target.closest('.cover'); if(!cv) return; var c=cv.parentNode; if(S.seasonsOpen.indexOf(c.dataset.s)<0){ S.seasonsOpen.push(c.dataset.s); save(); } c.classList.add('opening'); setTimeout(function(){ c.classList.remove('opening'); },700); paint(); refreshFile(); });
    paint(); before(first,grid); foldThink(act,body);
    return {act:act, done:function(){ return S.seasonsOpen.length===G.length; }};
  };

  /* ---- Explore reading · open-the-files grid: the lesson's OWN paragraphs go into folder cards that hinge open.
     Nothing is rewritten here — each card holds the real paragraph (moved, and put back on teardown). ---- */
  MOD.filesgrid=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var F=(cfg.cards||[]).map(function(c){ return Object.assign({},c,{rx:new RegExp(c.match,'i')}); }), paras={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ var st=p.querySelector('strong'); if(!st) return; F.forEach(function(f){ if(!paras[f.id]&&f.rx.test(st.textContent.trim())){ paras[f.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    S.filesOpen=S.filesOpen||[];
    var grid=el('div','spk spk-seasons spk-files', F.map(function(f){ return '<div class="spk-season" data-s="'+f.id+'" style="--c:'+(f.color||'#1A8A7D')+'"><div class="spk-fbody"></div>'
      +'<button type="button" class="cover" aria-label="Open the file: '+esc(f.label)+'"><span class="tabk">'+esc(f.tab||'')+'</span><span class="big">'+f.ico+'</span><span class="cw">'+esc(f.label)+'</span><span class="tap">Tap to open</span></button></div>'; }).join('')+'<div class="spk-seasons-ct"></div>');
    before(first,grid);
    F.forEach(function(f){ var p=paras[f.id]; if(p) move(p,function(n){ grid.querySelector('[data-s="'+f.id+'"] .spk-fbody').appendChild(n); }); });
    var ct=cfg.counter||{};
    function paint(){ var n=S.filesOpen.length; grid.querySelectorAll('.spk-season').forEach(function(c){ c.classList.toggle('open',S.filesOpen.indexOf(c.dataset.s)>=0); }); grid.querySelector('.spk-seasons-ct').innerHTML=n<F.length?'<b>'+n+' of '+F.length+'</b> '+esc(ct.some||'files open.'):'<b>'+esc(ct.allHead||'All open.')+'</b> '+esc(ct.all||''); grid.classList.toggle('all',n===F.length); }
    grid.addEventListener('click',function(e){ var cv=e.target.closest('.cover'); if(!cv) return; var c=cv.parentNode; if(S.filesOpen.indexOf(c.dataset.s)<0){ S.filesOpen.push(c.dataset.s); save(); } c.classList.add('opening'); setTimeout(function(){ c.classList.remove('opening'); },700); paint(); refreshFile(); });
    paint(); foldThink(act,body);
    return {act:act, done:function(){ return S.filesOpen.length===F.length; }, journal:function(e){ return '<p class="a">Habit files opened: '+S.filesOpen.length+' of '+F.length+'.</p>'; }};
  };
  /* Pause & Think folds into the bottom of the reading card */
  function foldThink(act,body){ var think=act.nextElementSibling; if(think&&think.classList.contains('callout-think')){ var tp=think.querySelector('p'); if(tp){ think.classList.add('spk-hide'); body.appendChild(el('div','spk spk-think',tp.innerHTML)); } } }

  function evidenceAnchor(){ var src=document.querySelector('#panel-explore .source-card'), body=src&&src.querySelector('.source-card-body'); if(!body) return null; return [].filter.call(body.querySelectorAll('.callout'),function(c){ return /What does it mean\?/.test(c.textContent); })[0]||body.lastElementChild; }

  /* ---- Explore evidence · wheel sort (4.03.05): drop each card on its part of a wheel ---- */
  MOD.wheelsort=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var PG=cfg.cards||[]; S.wheelPlaced=S.wheelPlaced||[];
    var done=function(){ return S.wheelPlaced.length===PG.length; };
    var g=el('div','spk spk-game'); g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)+'<div class="spk-wheelwrap"><div class="spk-wheel"></div><div><div class="spk-chips"></div><p class="spk-miss"></p></div></div><div class="spk-win">'+(cfg.win||'')+'</div>';
    var cx=150,cy=150,r=120; function arc(a0,a1){ var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1); return 'M'+cx+','+cy+' L'+x0.toFixed(1)+','+y0.toFixed(1)+' A'+r+','+r+' 0 0 1 '+x1.toFixed(1)+','+y1.toFixed(1)+' Z'; }
    var order=cfg.order||CATS.map(function(c){return c.id;}), q=2*Math.PI/order.length, ctr=cfg.center||[];
    var svg='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.aria||'Sorting wheel')+'"><circle cx="150" cy="150" r="126" fill="#FFFDF5" stroke="#8A6A1E" stroke-width="2"/>';
    order.forEach(function(id,i){ var s=find(CATS,id); var a0=-Math.PI/2+i*q,a1=a0+q,am=(a0+a1)/2,lx=cx+74*Math.cos(am),ly=cy+74*Math.sin(am);
      svg+='<g class="spk-quad" data-season="'+s.id+'"><path d="'+arc(a0,a1)+'" fill="'+s.color+'" fill-opacity=".78" stroke="#FFFDF5" stroke-width="3"/><text x="'+lx.toFixed(0)+'" y="'+(ly-14).toFixed(0)+'" text-anchor="middle" style="font-size:20px;pointer-events:none">'+s.ico+'</text><text x="'+lx.toFixed(0)+'" y="'+(ly+6).toFixed(0)+'" text-anchor="middle" style="font:800 12px Nunito,sans-serif;fill:#fff;pointer-events:none">'+esc(s.label)+'</text><text class="pg" x="'+lx.toFixed(0)+'" y="'+(ly+30).toFixed(0)+'" text-anchor="middle" style="font-size:14px;pointer-events:none">📄</text></g>'; });
    svg+='<circle cx="150" cy="150" r="27" fill="#FFFDF5" stroke="#8A6A1E" stroke-width="2"/>'+ctr.map(function(t,i){ return '<text x="150" y="'+(147+12*i-6*(ctr.length-2))+'" text-anchor="middle" style="font:800 10px Nunito,sans-serif;fill:#3F2E0C">'+esc(t)+'</text>'; }).join('')+'</svg>';
    g.querySelector('.spk-wheel').innerHTML=svg;
    var chips=g.querySelector('.spk-chips'), miss=g.querySelector('.spk-miss'), sel=null;
    shuffle(PG).forEach(function(p){ var c=el('div','spk-chip noimg','<span class="ico">📄</span><span>'+esc(p.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.s=p.s; c.dataset.i=PG.indexOf(p); chips.appendChild(c); });
    function paint(){ S.wheelPlaced.forEach(function(i){ var p=PG[i]; var c=chips.querySelector('[data-i="'+i+'"]'); if(c){ c.classList.add('done'); c.draggable=false; } var pg=g.querySelector('[data-season="'+p.s+'"] .pg'); if(pg) pg.classList.add('on'); }); g.querySelector('.spk-win').classList.toggle('show',done()); }
    function attempt(chip,qd){ if(!chip||!qd||chip.classList.contains('done')) return; g.querySelectorAll('.spk-quad').forEach(function(x){x.classList.remove('armed','over');});
      if(qd.dataset.season===chip.dataset.s){ S.wheelPlaced.push(+chip.dataset.i); save(); chip.classList.remove('sel'); sel=null; miss.textContent=''; paint(); refreshFile(); }
      else { chip.classList.add('shake'); setTimeout(function(){chip.classList.remove('shake');},450); miss.textContent=PG[chip.dataset.i].miss; } }
    paint();
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-chip'); if(!c||c.classList.contains('done')) return; chips.querySelectorAll('.spk-chip').forEach(function(x){x.classList.remove('sel');}); c.classList.add('sel'); sel=c; miss.textContent=''; g.querySelectorAll('.spk-quad').forEach(function(x){x.classList.add('armed');}); });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-chip'); if(!c||c.classList.contains('done')){ e.preventDefault(); return; } sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); g.querySelectorAll('.spk-quad').forEach(function(x){x.classList.add('armed');}); });
    var w=g.querySelector('.spk-wheel'); w.addEventListener('click',function(e){ attempt(sel,e.target.closest('.spk-quad')); });
    w.addEventListener('dragover',function(e){ var qd=e.target.closest('.spk-quad'); g.querySelectorAll('.spk-quad').forEach(function(x){x.classList.toggle('over',x===qd);}); if(qd) e.preventDefault(); });
    w.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-quad')); });
    after(anchor,g);
    return {done:done, journal:function(e){ return '<p class="a">'+e(cfg.journalLabel||'Wheel')+': '+S.wheelPlaced.length+' of '+PG.length+' '+e(cfg.journalUnit||'cards in place')+'.</p>'; }};
  };

  /* ---- Explore evidence · spot the details: tap each detail in the careful sentence that the careless one doesn't have.
     Each found detail lights up and says what kind of detail it is. ---- */
  MOD.spotdetail=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var parts=cfg.parts||[], KINDS=cfg.kinds||{}; S.spot=S.spot||[];
    var targets=parts.map(function(p,i){ return p.k?i:-1; }).filter(function(i){ return i>=0; });
    var done=function(){ return targets.every(function(i){ return S.spot.indexOf(i)>=0; }); };
    var g=el('div','spk spk-game spk-spot');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-spot-pair"><div class="spk-sent flat"><div class="lab">'+esc(cfg.flatLabel||'Careless')+'</div><p>'+esc(cfg.flat||'')+'</p></div>'
      +'<div class="spk-sent care"><div class="lab">'+esc(cfg.careLabel||'Careful')+' · tap the details</div><p>'+parts.map(function(p,i){ return '<button type="button" class="w" data-i="'+i+'">'+esc(p.t)+'</button>'; }).join(' ')+'</p></div></div>'
      +'<p class="spk-miss"></p><div class="spk-spot-key">'+Object.keys(KINDS).map(function(k){ return '<span class="kind" data-k="'+k+'" style="--c:'+KINDS[k].color+'">'+KINDS[k].ico+' '+esc(KINDS[k].t)+' <b>0</b></span>'; }).join('')+'</div><p class="spk-spot-ct"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    var miss=g.querySelector('.spk-miss');
    function paint(){ g.querySelectorAll('.w').forEach(function(b){ var i=+b.dataset.i, p=parts[i], on=S.spot.indexOf(i)>=0; b.classList.toggle('found',on); if(on&&p.k){ b.style.setProperty('--c',KINDS[p.k].color); b.setAttribute('data-kind',KINDS[p.k].t); } });
      Object.keys(KINDS).forEach(function(k){ var n=S.spot.filter(function(i){ return parts[i].k===k; }).length; g.querySelector('.kind[data-k="'+k+'"] b').textContent=n; });
      var n=targets.filter(function(i){ return S.spot.indexOf(i)>=0; }).length; g.querySelector('.spk-spot-ct').innerHTML=done()?'':'<b>'+n+' of '+targets.length+'</b> details found.'; g.querySelector('.spk-win').classList.toggle('show',done()); }
    g.addEventListener('click',function(e){ var b=e.target.closest('.w'); if(!b) return; var i=+b.dataset.i, p=parts[i];
      if(p.k){ if(S.spot.indexOf(i)<0){ S.spot.push(i); save(); b.classList.add('spk-justin'); setTimeout(function(){ b.classList.remove('spk-justin'); },700); } miss.textContent=''; paint(); refreshFile(); }
      else { b.classList.add('shake'); setTimeout(function(){ b.classList.remove('shake'); },450); miss.textContent=p.miss||cfg.miss||''; } });
    paint(); after(anchor,g);
    return {done:done, journal:function(e){ var f=targets.filter(function(i){ return S.spot.indexOf(i)>=0; }).map(function(i){ return parts[i].t+' ('+KINDS[parts[i].k].t+')'; }); return '<p class="a">'+e(cfg.journalLabel||'Details I found')+': '+(f.length?e(f.join(', ')):'none yet')+'.</p>'; }};
  };

  /* ---- Planner · picks (4.03.05): pick a category, a people, then one note per step ---- */
  MOD.picks=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var PEOPLE=cfg.people||[], PLAN=cfg.plan||{}, STEPS=(cfg.steps||[]).map(function(s){return s.k;}), LAB={}; (cfg.steps||[]).forEach(function(s){ LAB[s.k]=s.label; });
    S.plan=S.plan||{}; var pick=S.plan;
    var b=el('div','spk spk-builder'); b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-step"><div class="lab">1 · '+esc(cfg.catLabel||'Which one?')+'</div><div class="spk-opts" data-k="season">'+CATS.map(function(s){return '<button type="button" class="spk-opt" data-v="'+s.id+'">'+s.ico+' '+esc(s.label)+'</button>';}).join('')+'</div></div>'
      +'<div class="spk-step"><div class="lab">2 · '+esc(cfg.peopleLabel||'Which people?')+'</div><div class="spk-opts" data-k="people">'+PEOPLE.map(function(p){return '<button type="button" class="spk-opt" data-v="'+p.id+'">'+p.ico+' '+esc(p.t)+'</button>';}).join('')+'</div></div>'
      +STEPS.map(function(k,i){return '<div class="spk-step"><div class="lab">'+(i+3)+' · '+esc(LAB[k])+'</div><div class="spk-opts" data-k="'+k+'"><p class="spk-gate">'+esc(cfg.gate||'Pick one first.')+'</p></div></div>';}).join('')
      +'<div class="spk-plan">Your plan will show up here as you choose.</div>';
    function fillOpts(){ var s=pick.season; STEPS.forEach(function(k,i){ var box=b.querySelector('[data-k="'+k+'"]'); box.parentNode.classList.toggle('wait',!s&&i>0); if(!s){ box.innerHTML='<p class="spk-gate">'+esc(cfg.gateLong||cfg.gate||'Pick one first.')+'</p>'; return; } box.innerHTML=(PLAN[s][k]||[]).map(function(t,i){return '<button type="button" class="spk-opt'+(pick[k]===i?' on':'')+'" data-v="'+i+'">'+esc(t)+'</button>';}).join(''); }); }
    function lines(){ var s=pick.season, sn=find(CATS,s), p=find(PEOPLE,pick.people); var parts=[]; if(sn) parts.push([cfg.catWord||'Season',sn.label]); if(p) parts.push(['People',p.t]); STEPS.forEach(function(k){ if(s&&pick[k]!=null) parts.push([LAB[k],PLAN[s][k][pick[k]]]); }); return parts; }
    function plan(){ var ps=lines(); b.querySelector('.spk-plan').innerHTML=ps.length?ps.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):'Your plan will show up here as you choose.'; }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var k=o.parentNode.dataset.k; var v=(k==='season'||k==='people')?o.dataset.v:+o.dataset.v; if(k==='season'&&pick.season!==v){ STEPS.forEach(function(x){ delete pick[x]; }); } pick[k]=v; S.plan=pick; save(); updateStepper(); o.parentNode.querySelectorAll('.spk-opt').forEach(function(x){x.classList.toggle('on',x===o);}); if(k==='season') fillOpts(); plan(); });
    b.querySelectorAll('.spk-opt').forEach(function(o){ var k=o.parentNode.dataset.k; if((k==='season'||k==='people')&&pick[k]===o.dataset.v) o.classList.add('on'); }); fillOpts(); plan();
    before(partB,b);
    return {done:function(){ return !!(pick.season&&pick.people&&STEPS.every(function(k){ return pick[k]!=null; })); }, lines:lines};
  };

  /* ---- Planner · fix-it: tap each careless word in the old sentence to see what kind of detail goes there,
     then choose a people, a place and a way of living. Notes only — the student writes the sentence. ---- */
  MOD.fixit=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var OLD=cfg.old||[], PEOPLE=cfg.people||[]; S.fix=S.fix||{tapped:[]}; var pick=S.fix;
    var bad=OLD.map(function(p,i){ return p.fix?i:-1; }).filter(function(i){ return i>=0; });
    var b=el('div','spk spk-builder spk-fixit');
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-step"><div class="lab">1 · '+esc(cfg.step1||'Find the careless words')+'</div><div class="spk-oldsent">'+OLD.map(function(p,i){ return p.fix?'<button type="button" class="bad" data-i="'+i+'">'+esc(p.t)+'<span class="fx"></span></button>':'<span>'+esc(p.t)+'</span>'; }).join(' ')+'</div><p class="spk-fix-ct"></p></div>'
      +'<div class="spk-step"><div class="lab">2 · '+esc(cfg.step2||'Which people?')+'</div><div class="spk-opts" data-k="people">'+PEOPLE.map(function(p){ return '<button type="button" class="spk-opt" data-v="'+p.id+'">'+p.ico+' '+esc(p.t)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step"><div class="lab">3 · '+esc(cfg.step3||'Which place?')+'</div><div class="spk-opts" data-k="place"></div></div>'
      +'<div class="spk-step"><div class="lab">4 · '+esc(cfg.step4||'Which way of living?')+'</div><div class="spk-opts" data-k="way"></div></div>'
      +'<div class="spk-plan"></div>';
    function opts(){ var p=find(PEOPLE,pick.people); ['place','way'].forEach(function(k){ var box=b.querySelector('[data-k="'+k+'"]'); box.parentNode.classList.toggle('wait',!p); box.innerHTML=p?(p[k]||[]).map(function(t,i){ return '<button type="button" class="spk-opt'+(pick[k]===i?' on':'')+'" data-v="'+i+'">'+esc(t)+'</button>'; }).join(''):'<p class="spk-gate">'+esc(cfg.gate||'Pick a people first.')+'</p>'; }); }
    function lines(){ var p=find(PEOPLE,pick.people), out=[]; if(p) out.push(['People',p.t]); if(p&&pick.place!=null) out.push(['Place',p.place[pick.place]]); if(p&&pick.way!=null) out.push(['Way of living',p.way[pick.way]]); var t=pick.tapped.map(function(i){ return OLD[i].t; }); if(t.length) out.push([cfg.leaveOut||'Leave out',t.join(', ')]); return out; }
    function paint(){ b.querySelectorAll('.bad').forEach(function(x){ var i=+x.dataset.i, on=pick.tapped.indexOf(i)>=0; x.classList.toggle('on',on); x.querySelector('.fx').textContent=on?'→ '+OLD[i].fix:''; });
      var n=pick.tapped.length; b.querySelector('.spk-fix-ct').innerHTML=n<bad.length?'<b>'+n+' of '+bad.length+'</b> careless words found.':'<b>All '+bad.length+' found.</b> '+esc(cfg.allFound||'');
      b.querySelectorAll('[data-k="people"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===pick.people); });
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):'Your plan will show up here as you choose.'; updateStepper(); }
    b.addEventListener('click',function(e){ var w=e.target.closest('.bad'); if(w){ var i=+w.dataset.i; if(pick.tapped.indexOf(i)<0){ pick.tapped.push(i); w.classList.add('spk-justin'); setTimeout(function(){ w.classList.remove('spk-justin'); },700); } save(); paint(); return; }
      var o=e.target.closest('.spk-opt'); if(!o) return; var k=o.parentNode.dataset.k;
      if(k==='people'){ if(pick.people!==o.dataset.v){ delete pick.place; delete pick.way; } pick.people=o.dataset.v; opts(); }
      else { pick[k]=+o.dataset.v; o.parentNode.querySelectorAll('.spk-opt').forEach(function(x){ x.classList.toggle('on',x===o); }); }
      save(); paint(); });
    opts(); paint(); before(partB,b);
    return {done:function(){ return pick.tapped.length===bad.length&&!!pick.people&&pick.place!=null&&pick.way!=null; }, lines:lines};
  };

  /* ---- Vocabulary · Root Dig: brush the sand off buried words; the meaning appears when a word is dug up ---- */
  MOD.rootdig=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var DIG=cfg.words||[];
    S.dig=S.dig||{dug:{},matched:[]}; Object.keys(S.dig.dug).forEach(function(k){ if(S.dig.dug[k]>=1&&S.dig.matched.indexOf(+k)<0) S.dig.matched.push(+k); });
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var g=el('div','spk spk-dig');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Root Dig')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'
      +voice(cfg.voice,cfg)
      +'<div class="spk-site"><div class="strata"><i class="s0"></i><i class="s1"></i><i class="s2"></i><i class="s3"></i></div>'
      +'<svg class="deco" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true"><g fill="#E9D8B4" opacity=".7"><path d="M40,20 q6,-8 12,0 q-6,4 -12,0z"/><path d="M330,40 q6,-8 12,0 q-6,4 -12,0z"/></g><g fill="#F5EBD6" opacity=".55"><path d="M120,92 a6,6 0 1 1 12,0 l-6,6z"/><path d="M300,88 a5,5 0 1 1 10,0 l-5,5z"/><path d="M60,100 a4,4 0 1 1 8,0 l-4,4z"/></g><g stroke="#E4DCCB" stroke-width="1.2" fill="none" opacity=".6"><path d="M200,150 q8,-6 16,0 t16,0"/><path d="M40,160 q6,-5 12,0"/></g></svg>'
      +'<div class="warm"></div>'
      +DIG.map(function(d,i){ return '<button type="button" class="tab" data-i="'+i+'" style="top:'+(4+d.layer*24)+'%;--x:'+d.x+'"><span class="word"><b>'+esc(cfg.root)+'</b>'+esc(d.rest)+'</span><span class="mean"></span><span class="sand"></span></button>'; }).join('')
      +'<div class="dust"></div></div>'
      +'<p class="spk-dig-ct"></p>'
      +'<div class="spk-dig-win"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var site=g.querySelector('.spk-site'), dust=g.querySelector('.dust'), brushing=null;
    function prog(i){ return S.dig.dug[i]||0; }
    function paint(){ g.querySelectorAll('.tab').forEach(function(t){ var i=+t.dataset.i, p=prog(i), m=S.dig.matched.indexOf(i)>=0; t.querySelector('.sand').style.opacity=Math.max(0,1-p); t.classList.toggle('dug',p>=1); t.classList.toggle('matched',m); t.querySelector('.mean').innerHTML=m?esc(DIG[i].m)+'<small>'+esc(cfg.root)+' + '+esc(DIG[i].rest)+' · '+esc(DIG[i].part)+'</small>':''; });
      var n=S.dig.matched.length; g.querySelector('.spk-dig-ct').innerHTML=n<DIG.length?'<b>'+n+' of '+DIG.length+'</b> words dug up.':'';
      var all=S.dig.matched.length===DIG.length; g.classList.toggle('done',all); if(all){ window._rootMatchDone=true; } }
    function puff(x,y){ for(var k=0;k<3;k++){ var p=el('i'); p.style.left=(x+(Math.random()*16-8))+'px'; p.style.top=(y+(Math.random()*10-5))+'px'; p.style.setProperty('--dx',(Math.random()*30-15)+'px'); dust.appendChild(p); setTimeout(function(q){ return function(){ q.remove(); }; }(p),700); } }
    function brush(t,amt,e){ var i=+t.dataset.i; if(prog(i)>=1) return; S.dig.dug[i]=Math.min(1,prog(i)+amt); if(e){ var r=site.getBoundingClientRect(); puff(e.clientX-r.left,e.clientY-r.top); } if(S.dig.dug[i]>=1){ if(S.dig.matched.indexOf(i)<0) S.dig.matched.push(i); t.classList.add('pop','spark'); setTimeout(function(){ t.classList.remove('pop','spark'); },900); } save(); paint(); }
    site.addEventListener('pointerdown',function(e){ var t=e.target.closest('.tab'); if(!t) return; brushing=t; if(prog(+t.dataset.i)<1) brush(t,.3,e); });
    site.addEventListener('pointermove',function(e){ if(!brushing) return; var t=e.target.closest('.tab'); if(t&&t===brushing) brush(t,.045,e); });
    window.addEventListener('pointerup',function(){ brushing=null; });
    site.addEventListener('keydown',function(e){ var t=e.target.closest('.tab'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); if(prog(+t.dataset.i)<1) brush(t,.34); } });
    paint(); return {done:function(){ return S.dig.matched.length===DIG.length; }};
  };

  /* ---- small ship drawing for the explorer modules (no words, no people) ---- */
  function shipIcon(sz,col){ var w=Math.round(30+sz*10), h=Math.round(w*.8); return '<svg class="spk-shipico" viewBox="0 0 50 40" width="'+w+'" height="'+h+'" aria-hidden="true"><path d="M4,27 L46,27 L40,36 L10,36 Z" fill="#6B4423" stroke="#3E2612" stroke-width="1"/><line x1="25" y1="4" x2="25" y2="27" stroke="#3E2612" stroke-width="1.6"/><line x1="14" y1="9" x2="14" y2="27" stroke="#3E2612" stroke-width="1.2"/><path d="M26,6 Q37,13 26,24 Z" fill="#FFF8E6" stroke="#B8A27A" stroke-width=".8"/><path d="M15,11 Q22,16 15,23 Z" fill="#FFF8E6" stroke="#B8A27A" stroke-width=".8"/><path d="M25,4 L32,6 L25,8 Z" fill="'+(col||'#A3312B')+'"/><path d="M2,38 q6,-3 12,0 t12,0 t12,0 t12,0" fill="none" stroke="#7FB5CC" stroke-width="1.4"/></svg>'; }

  /* ---- Scene 1 · Ship order: put each expedition's ship on its year on the timeline. Tap or drag. ---- */
  MOD.shiporder=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var SH=cfg.ships||[]; S.ships=S.ships||[];
    var done=function(){ return SH.length>0&&SH.every(function(s){ return S.ships.indexOf(s.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var slots=SH.slice().sort(function(a,b){ return a.year-b.year; });
    var g=el('div','spk spk-game spk-ships');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-dock"><div class="spk-dock-line"></div>'+slots.map(function(s){ return '<div class="spk-berth" data-y="'+s.year+'" role="button" tabindex="0" aria-label="Put a ship on '+s.year+'"><div class="yr">'+s.year+'</div><div class="post"></div><div class="slot"><span class="empty">'+esc(cfg.empty||'Which ship?')+'</span><span class="got"></span></div><p class="fact"></p></div>'; }).join('')+'</div>'
      +'<div class="spk-chips spk-shipchips"></div><p class="spk-miss"></p>'
      +'<div class="spk-shore spk-hide">'+esc(cfg.shore||'')+'</div>'
      +'<div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    var chips=g.querySelector('.spk-shipchips'), miss=g.querySelector('.spk-miss'), sel=null;
    shuffle(SH).forEach(function(s){ var c=el('div','spk-chip noimg spk-shipchip','<span class="ico">'+shipIcon(s.size||1,s.color)+'</span><span><b>'+esc(s.name)+'</b><br>'+esc(s.clue)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.id=s.id; chips.appendChild(c); });
    function paint(){ g.querySelectorAll('.spk-berth').forEach(function(b){ var s=find(SH,+b.dataset.y,'year'), on=s&&S.ships.indexOf(s.id)>=0; b.classList.toggle('placed',!!on); b.querySelector('.got').innerHTML=on?shipIcon(s.size||1,s.color)+'<b>'+esc(s.name)+'</b>':''; b.querySelector('.fact').textContent=on?s.fact:''; });
      chips.querySelectorAll('.spk-shipchip').forEach(function(c){ var on=S.ships.indexOf(c.dataset.id)>=0; c.classList.toggle('done',on); c.classList.toggle('spk-hide',on); c.draggable=!on; });
      g.querySelector('.spk-shore').classList.toggle('spk-hide',!done()); g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function arm(on){ g.querySelectorAll('.spk-berth').forEach(function(b){ b.classList.toggle('armed',on&&!b.classList.contains('placed')); b.classList.remove('over'); }); }
    function attempt(chip,berth){ if(!chip||!berth||berth.classList.contains('placed')||chip.classList.contains('done')) return; arm(false); var s=find(SH,chip.dataset.id);
      if(s.year===+berth.dataset.y){ S.ships.push(s.id); save(); chip.classList.remove('sel'); sel=null; miss.textContent=''; paint(); berth.classList.add('spk-justin'); setTimeout(function(){ berth.classList.remove('spk-justin'); },700); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); miss.textContent=s.miss||''; missBeat(s.miss||''); } }
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-shipchip'); if(!c||c.classList.contains('done')) return; ack('open'); chips.querySelectorAll('.spk-shipchip').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&e.target.closest('.spk-shipchip')){ e.preventDefault(); e.target.closest('.spk-shipchip').click(); } });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-shipchip'); if(!c||c.classList.contains('done')){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.id); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    var dock=g.querySelector('.spk-dock');
    dock.addEventListener('click',function(e){ attempt(sel,e.target.closest('.spk-berth')); });
    dock.addEventListener('keydown',function(e){ var b=e.target.closest('.spk-berth'); if(b&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(sel,b); } });
    dock.addEventListener('dragover',function(e){ var b=e.target.closest('.spk-berth'); g.querySelectorAll('.spk-berth').forEach(function(x){ x.classList.toggle('over',x===b); }); if(b&&!b.classList.contains('placed')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    dock.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-berth')); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ var p=slots.filter(function(s){ return S.ships.indexOf(s.id)>=0; }); return p.length?'<p class="a">'+p.map(function(s){ return e(s.year+' · '+s.name); }).join(' → ')+'</p>':NA; }};
  };

  /* ---- Explore reading · route map: the lesson's own paragraphs sit beside the real Florida map.
     After each paragraph, the student shows that expedition's route; it draws itself on the map. ---- */
  function geoPath(pts){ return pts.map(function(p,i){ var q=project(p[0],p[1]); return (i?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1); }).join(' '); }
  MOD.routemap=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var RT=(cfg.routes||[]).map(function(r){ return Object.assign({},r,{rx:new RegExp(r.match,'i')}); }), SP=cfg.spots||[], paras={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ var st=p.querySelector('strong'); if(!st) return; RT.forEach(function(r){ if(!paras[r.id]&&r.rx.test(p.textContent)){ paras[r.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    S.routes=S.routes||[]; if(S.routeStep==null) S.routeStep=0;
    var done=function(){ return RT.every(function(r){ return S.routes.indexOf(r.id)>=0; }); };
    var svg='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.aria||'Florida map')+'">'+floridaBase('R')
      +(cfg.peoples||[]).map(function(p){ var q=project(p.lon,p.lat); return '<text class="pp" x="'+q[0].toFixed(0)+'" y="'+q[1].toFixed(0)+'" text-anchor="'+(p.a||'middle')+'">'+esc(p.t)+'</text>'; }).join('')
      +RT.map(function(r){ var land=r.land?geoPath(r.land):'', end=r.sea[r.sea.length-1], q=project(end[0],end[1]), lq=r.labelAt?project(r.labelAt[0],r.labelAt[1]):[q[0]+8,q[1]-6], fq=r.from?project(r.from.lon,r.from.lat):null;
        return '<g class="spk-rt" data-r="'+r.id+'" style="--c:'+r.color+'"><path class="sea" pathLength="100" d="'+geoPath(r.sea)+'"/>'+(land?'<path class="land" pathLength="100" d="'+land+'"/>':'')+(r.arrow?'<path class="land" pathLength="100" d="'+geoPath(r.arrow)+'"/>':'')
          +'<circle class="pin" cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="5"/><text class="lb" x="'+lq[0].toFixed(0)+'" y="'+lq[1].toFixed(0)+'" text-anchor="'+(r.labelAnchor||'start')+'">'+esc(r.label)+'</text>'
          +(fq?'<text class="fr" x="'+Math.min(296,Math.max(4,fq[0])).toFixed(0)+'" y="'+Math.min(296,fq[1]).toFixed(0)+'" text-anchor="'+(r.from.a||'middle')+'">'+esc(r.from.t)+'</text>':'')+'</g>'; }).join('')
      +SP.map(function(s){ var q=project(s.lon,s.lat); return '<g class="spk-spot" data-s="'+s.id+'" role="button" tabindex="0" aria-label="'+esc(s.label)+'"><circle class="hit" cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="15"/><circle class="ring" cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="9"/><text class="sl" x="'+(q[0]+(s.dx||0)).toFixed(0)+'" y="'+(q[1]+(s.dy!=null?s.dy:22)).toFixed(0)+'" text-anchor="'+(s.a||'middle')+'">'+esc(s.label)+'</text></g>'; }).join('')+'</svg>';
    var wrap=el('div','spk spk-routes spk-plot','<div class="spk-routes-read"><div class="spk-plot-dots">'+RT.map(function(r,i){ return '<button type="button" class="dot" data-i="'+i+'" style="--c:'+r.color+'">'+(i+1)+'</button>'; }).join('')+'<span class="of"></span></div><div class="spk-plot-steps"></div></div><div class="spk-routes-side"><div class="spk-map">'+svg+'</div><p class="spk-routes-ct"></p></div>');
    before(first,wrap); var steps=wrap.querySelector('.spk-plot-steps');
    RT.forEach(function(r,i){ var st=el('div','spk-plot-step'); st.dataset.i=i; st.style.setProperty('--c',r.color);
      st.innerHTML='<div class="hd"><span class="yr">'+esc(r.year||'')+'</span> '+esc(r.name||'')+'</div><p class="clue">'+esc(r.clue||'')+'</p><div class="spk-plot-do"><div class="spk-chip noimg spk-plotship" draggable="true" role="button" tabindex="0"><span class="ico">'+shipIcon(r.size||1,r.color)+'</span><span>'+esc(cfg.doT||'Drag the ship to where he landed, or tap the spot on the map.')+'</span></div><p class="spk-miss"></p></div><div class="spk-plot-read"></div><button type="button" class="spk-plot-next"></button>';
      steps.appendChild(st); var p=paras[r.id]; if(p) move(p,function(n){ st.querySelector('.spk-plot-read').appendChild(n); }); });
    var ct=cfg.counter||{};
    function paint(anim){ var cur=S.routeStep;
      RT.forEach(function(r,i){ var on=S.routes.indexOf(r.id)>=0, gEl=wrap.querySelector('.spk-rt[data-r="'+r.id+'"]'), st=steps.children[i];
        gEl.classList.toggle('on',on); if(on&&anim===r.id){ gEl.classList.add('drawing'); setTimeout(function(){ gEl.classList.remove('drawing'); },1600); }
        st.classList.toggle('now',i===cur); st.classList.toggle('plotted',on);
        var nx=st.querySelector('.spk-plot-next'); nx.textContent=i<RT.length-1?(cfg.nextT||'Next explorer')+' →':(cfg.lastT||'All three are on the map ✓'); nx.disabled=i===RT.length-1;
        var d=wrap.querySelector('.dot[data-i="'+i+'"]'); d.classList.toggle('on',on); d.classList.toggle('now',i===cur); d.disabled=!(on||i===cur||i===firstOpen()); });
      wrap.querySelectorAll('.spk-spot').forEach(function(s){ s.classList.toggle('armed',!!RT[cur]&&S.routes.indexOf(RT[cur].id)<0); });
      wrap.querySelector('.of').textContent=(cfg.stepWord||'Explorer')+' '+(cur+1)+' of '+RT.length;
      var n=S.routes.length; wrap.querySelector('.spk-routes-ct').innerHTML=n<RT.length?'<b>'+n+' of '+RT.length+'</b> '+esc(ct.some||'routes on the map.'):'<b>'+esc(ct.allHead||'All on the map.')+'</b> '+esc(ct.all||'');
      wrap.classList.toggle('all',done()); var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function firstOpen(){ for(var i=0;i<RT.length;i++) if(S.routes.indexOf(RT[i].id)<0) return i; return -1; }
    function attempt(spotId){ var r=RT[S.routeStep]; if(!r||S.routes.indexOf(r.id)>=0) return; var st=steps.children[S.routeStep], miss=st.querySelector('.spk-miss'), chip=st.querySelector('.spk-plotship');
      if(spotId===r.spot){ S.routes.push(r.id); save(); miss.textContent=''; paint(r.id); refreshFile(); setTimeout(function(){ var rd=st.querySelector('.spk-plot-read'); if(rd&&rd.getBoundingClientRect().top>innerHeight) rd.scrollIntoView({behavior:'smooth',block:'center'}); },300); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); miss.textContent=(r.miss&&r.miss[spotId])||r.missAny||''; } }
    var map=wrap.querySelector('.spk-map');
    map.addEventListener('click',function(e){ var s=e.target.closest('.spk-spot'); if(s) attempt(s.dataset.s); });
    map.addEventListener('keydown',function(e){ var s=e.target.closest('.spk-spot'); if(s&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(s.dataset.s); } });
    map.addEventListener('dragover',function(e){ var s=e.target.closest('.spk-spot'); wrap.querySelectorAll('.spk-spot').forEach(function(x){ x.classList.toggle('over',x===s); }); if(s) e.preventDefault(); });
    map.addEventListener('drop',function(e){ e.preventDefault(); var s=e.target.closest('.spk-spot'); wrap.querySelectorAll('.spk-spot').forEach(function(x){ x.classList.remove('over'); }); if(s) attempt(s.dataset.s); });
    steps.addEventListener('dragstart',function(e){ if(!e.target.closest('.spk-plotship')) return; e.dataTransfer.setData('text/plain','ship'); e.dataTransfer.effectAllowed='move'; });
    steps.addEventListener('click',function(e){ var c=e.target.closest('.spk-plotship'); if(c){ map.scrollIntoView({behavior:'smooth',block:'nearest'}); return; }
      var nx=e.target.closest('.spk-plot-next'); if(nx&&!nx.disabled){ S.routeStep=Math.min(RT.length-1,S.routeStep+1); save(); paint(); var t=steps.children[S.routeStep]; if(t.getBoundingClientRect().top<120) wrap.scrollIntoView({behavior:'smooth',block:'start'}); } });
    wrap.querySelector('.spk-plot-dots').addEventListener('click',function(e){ var d=e.target.closest('.dot'); if(!d||d.disabled) return; S.routeStep=+d.dataset.i; save(); paint(); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(e){ return '<p class="a">Routes plotted on the map: '+S.routes.length+' of '+RT.length+'.</p>'; }};
  };

  /* ---- Source image · tap-to-reveal labels: invisible buttons sit on the numbered badges already drawn on the
     image (positions in % from DATA.source.hotspots). Tapping one shows what that part is. The lesson's own key
     callout is hidden while the layer is on. ---- */
  function buildHotspots(){ var cfg=DATA.source; if(!cfg||!cfg.hotspots) return null;
    var ph=document.querySelector('#panel-explore .source-card .source-image-placeholder'); if(!ph) return null;
    var card=ph.closest('.source-card'), key=card.querySelector('.callout-vocab'); if(key) key.classList.add('spk-hide');
    S.hot=S.hot||[]; var H=cfg.hotspots;
    var info=el('div','spk spk-hotinfo'); ph.parentNode.insertBefore(info,ph.nextSibling);
    var sel=null;
    function paintInfo(){ var h=sel!=null?H[sel]:null, n=H.filter(function(x,i){ return S.hot.indexOf(i)>=0; }).length;
      info.innerHTML=(h?'<div class="now"><span class="n">'+esc(h.n)+'</span><div><b>'+esc(h.title||'')+'</b> '+esc(h.t)+'</div></div>':'<p class="hint">'+esc(cfg.prompt||'Tap each gold number on the map to see what it shows.')+'</p>')
        +'<p class="ct">'+(n<H.length?'<b>'+n+' of '+H.length+'</b> labels opened.':'<b>All '+H.length+' labels opened.</b> '+esc(cfg.allT||''))+'</p>';
      ph.querySelectorAll('.spk-hot').forEach(function(b){ var i=+b.dataset.i; b.classList.toggle('seen',S.hot.indexOf(i)>=0); b.classList.toggle('sel',i===sel); }); }
    function mount(){ if(!document.documentElement.classList.contains('spk-on')||!ph.classList.contains('image-loaded')||ph.querySelector('.spk-hotlayer')) return; ph.classList.add('spk-hotimg');
      var lay=el('div','spk spk-hotlayer',H.map(function(h,i){ return '<button type="button" class="spk-hot" data-i="'+i+'" style="left:'+h.x+'%;top:'+h.y+'%" aria-label="Label '+esc(h.n)+': '+esc(h.title||'')+'"></button>'; }).join(''));
      ph.appendChild(lay); paintInfo(); }
    ph.addEventListener('click',function(e){ var b=e.target.closest('.spk-hot'); if(!b) return; var i=+b.dataset.i; sel=i; if(S.hot.indexOf(i)<0){ S.hot.push(i); save(); } paintInfo(); HOT_TAP.forEach(function(fn){ try{ fn(i); }catch(err){} }); });
    new MutationObserver(mount).observe(ph,{attributes:true,childList:true}); mount(); paintInfo();
    return {done:function(){ return S.hot.length>=H.length; }};
  }

  /* ---- Explore evidence · ship and shore: match each expedition (the ship) to what it meant for the people
     already living here (the shore). One shore card is not true for these years and takes no ship. ---- */
  MOD.shipshore=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var P=cfg.pairs||[], SHORE=P.filter(function(p){ return p.shore; }).map(function(p){ return {id:p.id,t:p.shore}; }).concat((cfg.decoys||[]).map(function(d,i){ return {id:'decoy'+i,t:d.t,decoy:d.miss}; }));
    S.shore=S.shore||[]; var done=function(){ return P.every(function(p){ return S.shore.indexOf(p.id)>=0; }); };
    var g=el('div','spk spk-game spk-shipshore');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-ss"><div class="col"><div class="lab">'+esc(cfg.shipLabel||'From the ship')+'</div><div class="spk-chips"></div></div><div class="col"><div class="lab">'+esc(cfg.shoreLabel||'On the shore')+'</div><div class="spk-shores"></div></div></div><p class="spk-miss"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    var chips=g.querySelector('.spk-chips'), shores=g.querySelector('.spk-shores'), miss=g.querySelector('.spk-miss'), sel=null;
    P.forEach(function(p){ var c=el('div','spk-chip noimg spk-sship','<span class="ico">'+shipIcon(p.size||1,p.color)+'</span><span><b>'+esc(p.year)+'</b> · '+esc(p.name)+'<br><small>'+esc(p.ship)+'</small></span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.id=p.id; chips.appendChild(c); });
    shuffle(SHORE).forEach(function(s){ var d=el('div','spk-shorecard','<span class="tag"></span><span class="tx">'+esc(s.t)+'</span>'); d.dataset.id=s.id; d.setAttribute('role','button'); d.tabIndex=0; shores.appendChild(d); });
    function paint(){ P.forEach(function(p){ var on=S.shore.indexOf(p.id)>=0, c=chips.querySelector('[data-id="'+p.id+'"]'), d=shores.querySelector('[data-id="'+p.id+'"]'); c.classList.toggle('done',on); c.draggable=!on; d.classList.toggle('matched',on); d.querySelector('.tag').textContent=on?p.year+' · '+p.name:''; if(on) d.style.setProperty('--c',p.color); });
      var w=done(); g.querySelector('.spk-win').classList.toggle('show',w); shores.querySelectorAll('.spk-shorecard').forEach(function(d){ if(/^decoy/.test(d.dataset.id)) d.classList.toggle('struck',w); }); }
    function arm(on){ shores.querySelectorAll('.spk-shorecard').forEach(function(d){ d.classList.toggle('armed',on&&!d.classList.contains('matched')); d.classList.remove('over'); }); }
    function attempt(chip,card){ if(!chip||!card||card.classList.contains('matched')||chip.classList.contains('done')) return; arm(false); var p=find(P,chip.dataset.id), s=find(SHORE,card.dataset.id);
      if(card.dataset.id===p.id){ S.shore.push(p.id); save(); chip.classList.remove('sel'); sel=null; miss.textContent=''; paint(); card.classList.add('spk-justin'); setTimeout(function(){ card.classList.remove('spk-justin'); },700); refreshFile(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=s.decoy||p.miss||''; miss.textContent=m; } }
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-sship'); if(!c||c.classList.contains('done')) return; chips.querySelectorAll('.spk-sship').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&e.target.closest('.spk-sship')){ e.preventDefault(); e.target.closest('.spk-sship').click(); } });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-sship'); if(!c||c.classList.contains('done')){ e.preventDefault(); return; } sel=c; e.dataTransfer.setData('text/plain',c.dataset.id); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    shores.addEventListener('click',function(e){ attempt(sel,e.target.closest('.spk-shorecard')); });
    shores.addEventListener('keydown',function(e){ var d=e.target.closest('.spk-shorecard'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(sel,d); } });
    shores.addEventListener('dragover',function(e){ var d=e.target.closest('.spk-shorecard'); shores.querySelectorAll('.spk-shorecard').forEach(function(x){ x.classList.toggle('over',x===d); }); if(d&&!d.classList.contains('matched')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    shores.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-shorecard')); });
    paint(); after(anchor,g);
    return {done:done, journal:function(e){ return P.filter(function(p){ return S.shore.indexOf(p.id)>=0; }).map(function(p){ return '<p class="a"><b>'+e(p.year+' · '+p.name)+'</b> — '+e(p.shore)+'</p>'; }).join('')||'<p class="a"><i>(not matched yet)</i></p>'; }};
  };

  /* ---- Planner · choose: one pick per row (notes only — the student writes the sentences).
     A row can be checked against an earlier pick (cfg.steps[i].mustMatch = {earlierStep, map:{pick:rightAnswer}}). ---- */
  MOD.choose=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var ST=cfg.steps||[]; S.choose=S.choose||{}; var pick=S.choose;
    var b=el('div','spk spk-builder spk-choose'); b.innerHTML=voice(cfg.voice,cfg)+ST.map(function(s,i){ return '<div class="spk-step" data-k="'+s.k+'"><div class="lab">'+(i+1)+' · '+esc(s.label)+'</div><div class="spk-opts">'+s.opts.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.v)+'">'+(o.ico?o.ico+' ':'')+esc(o.t)+'</button>'; }).join('')+'</div><p class="spk-miss"></p></div>'; }).join('')+'<div class="spk-plan"></div>';
    function ok(s){ var v=pick[s.k]; if(v==null) return false; var m=s.mustMatch; if(!m) return true; var want=m.map[pick[m.step]]; return want==null||want===v; }
    function lines(){ var out=[]; ST.forEach(function(s){ var v=pick[s.k]; if(v==null) return; var o=find(s.opts,v,'v'); if(o) out.push([s.word||s.label,o.t]); }); return out; }
    function paint(){ ST.forEach(function(s){ var row=b.querySelector('.spk-step[data-k="'+s.k+'"]'); row.querySelectorAll('.spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===pick[s.k]); }); var bad=pick[s.k]!=null&&!ok(s); row.classList.toggle('bad',bad); row.querySelector('.spk-miss').textContent=bad?(s.mustMatch.miss||''):''; });
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.empty||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var k=o.closest('.spk-step').dataset.k; pick[k]=o.dataset.v; S.choose=pick; save(); paint(); });
    paint(); before(partB,b);
    return {done:function(){ return ST.every(ok); }, lines:lines};
  };

  /* ---- Vocabulary · Run Up the Flags: each word has a mast. Tap a rolled flag to unroll it and read the meaning,
     then hoist it on the mast of the word it means (tap the flag, then the mast, or drag). All flags up → the ship sails. ---- */
  var FLAGART={
    a:'<rect width="40" height="14" fill="#F2C230"/><rect y="14" width="40" height="14" fill="#1F5FA8"/>',
    b:'<rect width="40" height="28" fill="#1F5FA8"/><rect x="12" y="8" width="16" height="12" fill="#fff"/>',
    c:'<rect width="40" height="28" fill="#fff"/><rect width="20" height="14" fill="#C8352E"/><rect x="20" y="14" width="20" height="14" fill="#C8352E"/>',
    d:'<rect width="40" height="28" fill="#F2C230"/><path d="M0,28 L40,0 L40,28 Z" fill="#C8352E"/>',
    e:'<rect width="40" height="28" fill="#fff"/><path d="M0,0 L40,28 M40,0 L0,28" stroke="#1F5FA8" stroke-width="6"/>',
    f:'<rect width="40" height="28" fill="#2E8B57"/><circle cx="20" cy="14" r="7" fill="#fff"/>'};
  function flagSVG(k,w){ return '<svg class="fl" viewBox="0 0 40 28" width="'+(w||40)+'" height="'+Math.round((w||40)*.7)+'" aria-hidden="true">'+(FLAGART[k]||FLAGART.a)+'<rect width="40" height="28" fill="none" stroke="#3E2612" stroke-width="1.2"/></svg>'; }
  MOD.flags=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.flags=S.flags||{open:[],up:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&W.every(function(x,i){ return S.flags.up.indexOf(i)>=0; }); };
    var g=el('div','spk spk-flagrun');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Run Up the Flags')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-flagsea"><div class="spk-flagship"><div class="masts">'+W.map(function(x,i){ return '<div class="mast" data-i="'+i+'" role="button" tabindex="0" aria-label="Mast for '+esc(x.w)+'"><div class="top"><span class="slot"></span></div><div class="pole"></div><div class="plaque"><b>'+esc(cfg.root||'')+'</b>'+esc(x.w.slice((cfg.root||'').length))+'</div></div>'; }).join('')+'</div><div class="hull"></div></div><div class="waves"></div></div>'
      +'<div class="spk-fr-box">'+shuffle(W.map(function(x,i){ return i; })).map(function(i){ var x=W[i]; return '<button type="button" class="spk-fr-flag" data-i="'+i+'" draggable="false"><span class="roll"><span class="tube"></span><span class="tap">'+esc(cfg.tapT||'Tap to unroll')+'</span></span><span class="open">'+flagSVG(x.flag,44)+'<span class="m">'+esc(x.m)+'</span></span></button>'; }).join('')+'</div>'
      +'<p class="spk-miss"></p><p class="spk-fr-ct"></p>'
      +'<div class="spk-fr-win"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var box=g.querySelector('.spk-fr-box'), miss=g.querySelector('.spk-miss'), sel=null;
    function paint(){ g.querySelectorAll('.spk-fr-flag').forEach(function(f){ var i=+f.dataset.i, op=S.flags.open.indexOf(i)>=0, up=S.flags.up.indexOf(i)>=0; f.classList.toggle('opened',op); f.classList.toggle('up',up); f.draggable=op&&!up; f.setAttribute('aria-label',op?'Flag: '+W[i].m:'Rolled-up flag. Tap to unroll.'); });
      g.querySelectorAll('.mast').forEach(function(m){ var i=+m.dataset.i, up=S.flags.up.indexOf(i)>=0; m.classList.toggle('flying',up); m.querySelector('.slot').innerHTML=up?'<span class="m">'+esc(W[i].m)+'</span>'+flagSVG(W[i].flag,46):''; });
      var n=S.flags.up.length, o=S.flags.open.length; g.querySelector('.spk-fr-ct').innerHTML=done()?'':(o<W.length&&n===0?'<b>'+o+' of '+W.length+'</b> flags unrolled.':'<b>'+n+' of '+W.length+'</b> flags flying.');
      g.classList.toggle('done',done()); if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.mast').forEach(function(m){ m.classList.toggle('armed',on&&!m.classList.contains('flying')); m.classList.remove('over'); }); }
    function attempt(flag,mast){ if(!flag||!mast||mast.classList.contains('flying')) return; var i=+flag.dataset.i; if(S.flags.up.indexOf(i)>=0||S.flags.open.indexOf(i)<0) return; arm(false);
      if(+mast.dataset.i===i){ S.flags.up.push(i); save(); flag.classList.remove('sel'); sel=null; miss.textContent=''; var was=done(); paint(); mast.classList.add('spk-justin'); setTimeout(function(){ mast.classList.remove('spk-justin'); },700); if(!was&&done()){ g.classList.add('sailing'); setTimeout(function(){ g.classList.remove('sailing'); },2600); } }
      else { flag.classList.add('shake'); setTimeout(function(){ flag.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    box.addEventListener('click',function(e){ var f=e.target.closest('.spk-fr-flag'); if(!f) return; var i=+f.dataset.i; if(S.flags.up.indexOf(i)>=0) return;
      if(S.flags.open.indexOf(i)<0){ S.flags.open.push(i); save(); f.classList.add('unrolling'); setTimeout(function(){ f.classList.remove('unrolling'); },600); }
      box.querySelectorAll('.spk-fr-flag').forEach(function(x){ x.classList.remove('sel'); }); f.classList.add('sel'); sel=f; miss.textContent=''; paint(); arm(true); });
    box.addEventListener('dragstart',function(e){ var f=e.target.closest('.spk-fr-flag'); if(!f||!f.draggable){ e.preventDefault(); return; } sel=f; e.dataTransfer.setData('text/plain',f.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    box.addEventListener('dragend',function(){ arm(false); });
    var ship=g.querySelector('.masts');
    ship.addEventListener('click',function(e){ attempt(sel,e.target.closest('.mast')); });
    ship.addEventListener('keydown',function(e){ var m=e.target.closest('.mast'); if(m&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(sel,m); } });
    ship.addEventListener('dragover',function(e){ var m=e.target.closest('.mast'); g.querySelectorAll('.mast').forEach(function(x){ x.classList.toggle('over',x===m); }); if(m&&!m.classList.contains('flying')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    ship.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.mast')); });
    paint(); return {done:done};
  };

  /* ---- Scene 1 · Pack the expedition: drag (or tap, then tap a trunk) each detail into the trunk for the reason it shows ---- */
  var TRUNKART={
    cross:'<path d="M20 6h8v10h10v8H28v18h-8V24H10v-8h10z" fill="#F3E3B5" stroke="#5A3418" stroke-width="1.5"/>',
    coins:'<g stroke="#7A5410" stroke-width="1.2"><ellipse cx="24" cy="36" rx="13" ry="4.5" fill="#E6B422"/><rect x="11" y="27" width="26" height="9" fill="#F2C94C"/><ellipse cx="24" cy="27" rx="13" ry="4.5" fill="#F6D86B"/><rect x="11" y="18" width="26" height="9" fill="#F2C94C"/><ellipse cx="24" cy="18" rx="13" ry="4.5" fill="#FBE59A"/></g>',
    flag:'<line x1="12" y1="6" x2="12" y2="42" stroke="#5A3418" stroke-width="2.4"/><path d="M13 8h24l-6 7 6 7H13z" fill="#C8352E" stroke="#7A1E19" stroke-width="1.2"/><circle cx="22" cy="15" r="3" fill="#F2C230"/>'};
  function emblem(k,w){ return '<svg viewBox="0 0 48 48" width="'+(w||40)+'" height="'+(w||40)+'" aria-hidden="true">'+(TRUNKART[k]||'')+'</svg>'; }
  MOD.packtrunks=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var TR=cfg.trunks||[], CD=cfg.cards||[]; S.packed=S.packed||[];
    var done=function(){ return CD.length>0&&CD.every(function(c,i){ return S.packed.indexOf(i)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-pack');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-trunks">'+TR.map(function(t){ return '<div class="spk-trunk" data-t="'+t.id+'" role="button" tabindex="0" style="--c:'+t.color+'"><div class="lid"><span class="em">'+emblem(t.emblem,34)+'</span></div><div class="box"><span class="nm">'+esc(t.label)+'</span><span class="ct"></span></div><ul class="in"></ul></div>'; }).join('')+'</div>'
      +'<div class="spk-chips spk-packcards"></div><p class="spk-miss"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    var chips=g.querySelector('.spk-packcards'), miss=g.querySelector('.spk-miss'), sel=null;
    shuffle(CD.map(function(c,i){ return i; })).forEach(function(i){ var c=el('div','spk-chip noimg spk-packcard','<span class="ico">📦</span><span>'+esc(CD[i].t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=i; chips.appendChild(c); });
    function paint(){ TR.forEach(function(t){ var tr=g.querySelector('.spk-trunk[data-t="'+t.id+'"]'), mine=CD.map(function(c,i){ return i; }).filter(function(i){ return CD[i].t2===t.id&&S.packed.indexOf(i)>=0; }), all=CD.filter(function(c){ return c.t2===t.id; }).length;
        tr.querySelector('.ct').textContent=mine.length+' of '+all; tr.querySelector('.in').innerHTML=mine.map(function(i){ return '<li>'+esc(CD[i].t)+'</li>'; }).join(''); tr.classList.toggle('full',mine.length===all); });
      chips.querySelectorAll('.spk-packcard').forEach(function(c){ var on=S.packed.indexOf(+c.dataset.i)>=0; c.classList.toggle('spk-hide',on); c.draggable=!on; });
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function arm(on){ g.querySelectorAll('.spk-trunk').forEach(function(t){ t.classList.toggle('armed',on); t.classList.remove('over'); }); }
    function attempt(chip,tr){ if(!chip||!tr) return; var i=+chip.dataset.i; if(S.packed.indexOf(i)>=0) return; arm(false);
      if(CD[i].t2===tr.dataset.t){ S.packed.push(i); save(); sel=null; miss.textContent=''; tr.classList.add('thud'); setTimeout(function(){ tr.classList.remove('thud'); },650); paint(); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); miss.textContent=CD[i].miss||''; missBeat(CD[i].miss||''); } }
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-packcard'); if(!c) return; ack('open'); chips.querySelectorAll('.spk-packcard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&e.target.closest('.spk-packcard')){ e.preventDefault(); e.target.closest('.spk-packcard').click(); } });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-packcard'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    var row=g.querySelector('.spk-trunks');
    row.addEventListener('click',function(e){ var t=e.target.closest('.spk-trunk'); if(t) attempt(sel,t); });
    row.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-trunk'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(sel,t); } });
    row.addEventListener('dragover',function(e){ var t=e.target.closest('.spk-trunk'); g.querySelectorAll('.spk-trunk').forEach(function(x){ x.classList.toggle('over',x===t); }); if(t){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    row.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-trunk')); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ return TR.map(function(t){ var it=CD.filter(function(c,i){ return c.t2===t.id&&S.packed.indexOf(i)>=0; }); return it.length?'<p class="a"><b>'+e(t.label)+'</b>: '+e(it.map(function(c){ return c.t; }).join(' · '))+'</p>':''; }).join('')||NA; }};
  };

  /* ---- Explore reading · step-through: the lesson's own paragraphs, one at a time, with Next (and dots to go back) ---- */
  MOD.stepread=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var ST=(cfg.steps||[]).map(function(s){ return Object.assign({},s,{rx:new RegExp(s.match,'i')}); }), paras={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ ST.forEach(function(s){ if(!paras[s.id]&&s.rx.test(p.textContent)){ paras[s.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    if(S.readStep==null) S.readStep=0; S.readMax=S.readMax||0;
    var wrap=el('div','spk spk-stepread','<div class="spk-plot-dots">'+ST.map(function(s,i){ return '<button type="button" class="dot" data-i="'+i+'" style="--c:'+(s.color||'#1A8A7D')+'">'+(s.ico||i+1)+'</button>'; }).join('')+'<span class="of"></span></div><div class="spk-sr-cards"></div><div class="spk-sr-nav"><button type="button" class="back">← Back</button><button type="button" class="next"></button></div>');
    before(first,wrap); var cards=wrap.querySelector('.spk-sr-cards');
    ST.forEach(function(s,i){ var c=el('div','spk-sr-card'); c.style.setProperty('--c',s.color||'#1A8A7D'); c.innerHTML=(s.title?'<div class="hd">'+(s.ico?'<span class="ic">'+s.ico+'</span>':'')+esc(s.title)+'</div>':'')+'<div class="tx"></div>'; cards.appendChild(c); var p=paras[s.id]; if(p) move(p,function(n){ c.querySelector('.tx').appendChild(n); }); });
    function paint(){ var cur=S.readStep; [].forEach.call(cards.children,function(c,i){ c.classList.toggle('now',i===cur); });
      wrap.querySelectorAll('.dot').forEach(function(d,i){ d.classList.toggle('now',i===cur); d.classList.toggle('on',i<=S.readMax); d.disabled=i>S.readMax; });
      wrap.querySelector('.of').textContent=(cfg.word||'Part')+' '+(cur+1)+' of '+ST.length;
      var nx=wrap.querySelector('.next'); nx.textContent=cur<ST.length-1?(ST[cur+1].nextT||cfg.nextT||'Next')+' →':(cfg.lastT||'Done ✓'); nx.disabled=cur===ST.length-1&&S.readMax===ST.length-1&&!!S.readDone;
      wrap.querySelector('.back').disabled=cur===0; wrap.classList.toggle('all',!!S.readDone); var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!S.readDone); }
    wrap.querySelector('.next').addEventListener('click',function(){ if(S.readStep<ST.length-1){ S.readStep++; S.readMax=Math.max(S.readMax,S.readStep); } else S.readDone=true; save(); paint(); refreshFile(); if(wrap.getBoundingClientRect().top<90) wrap.scrollIntoView({behavior:'smooth',block:'start'}); });
    wrap.querySelector('.back').addEventListener('click',function(){ if(S.readStep>0){ S.readStep--; save(); paint(); } });
    wrap.querySelector('.spk-plot-dots').addEventListener('click',function(e){ var d=e.target.closest('.dot'); if(!d||d.disabled) return; S.readStep=+d.dataset.i; save(); paint(); });
    foldThink(act,body); paint();
    return {act:act, done:function(){ return !!S.readDone; }};
  };

  /* ---- Explore evidence · order, letter or map? Pick what kind of document it is, then tap the numbered labels on
     the image (DATA.source.hotspots) that prove it. ---- */
  MOD.doctype=function(cfg){ var card=document.querySelector('#panel-explore .source-card'), cb=card&&card.querySelector('.source-card-body'); if(!cb) return null;
    var CH=cfg.choices||[], PROOF=cfg.proofs||[], need=cfg.need||2; S.doc=S.doc||{pick:null,found:[]};
    var right=function(){ var c=find(CH,S.doc.pick); return !!(c&&c.ok); };
    var done=function(){ return right()&&S.doc.found.length>=need; };
    var anchor=[].filter.call(cb.querySelectorAll('.callout'),function(c){ return /What do I see\?/.test(c.textContent); })[0]||cb.firstElementChild;
    var g=el('div','spk spk-game spk-doctype');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-step"><div class="lab">1 · '+esc(cfg.step1||'What kind of document is this?')+'</div><div class="spk-opts">'+CH.map(function(c){ return '<button type="button" class="spk-opt" data-v="'+c.id+'">'+(c.ico?c.ico+' ':'')+esc(c.t)+'</button>'; }).join('')+'</div><p class="spk-miss m1"></p></div>'
      +'<div class="spk-step s2"><div class="lab">2 · '+esc(cfg.step2||'Tap two numbers on the document that prove it.')+'</div><div class="spk-proofs"></div><p class="spk-miss m2"></p></div>'
      +'<div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    function paint(){ g.querySelectorAll('.spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===S.doc.pick); o.classList.toggle('bad',o.dataset.v===S.doc.pick&&!right()); });
      g.querySelector('.s2').classList.toggle('wait',!right());
      var H=(DATA.source&&DATA.source.hotspots)||[];
      g.querySelector('.spk-proofs').innerHTML=PROOF.map(function(i,k){ var f=S.doc.found.indexOf(i)>=0; return '<span class="pf'+(f?' on':'')+'">'+(f?'✓ '+esc(H[i].n)+' · '+esc((H[i].title||'').replace(/\.$/,'')):'?')+'</span>'; }).slice(0,Math.max(need,PROOF.length)).join('');
      g.querySelector('.spk-win').classList.toggle('show',done()); }
    g.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; S.doc.pick=o.dataset.v; save(); var c=find(CH,o.dataset.v); g.querySelector('.m1').textContent=c&&!c.ok?(c.miss||''):''; paint(); refreshFile(); });
    HOT_TAP.push(function(i){ if(!right()) { g.querySelector('.m2').textContent=cfg.firstT||'First pick what kind of document it is.'; return; }
      if(PROOF.indexOf(i)>=0){ if(S.doc.found.indexOf(i)<0){ S.doc.found.push(i); save(); } g.querySelector('.m2').textContent=''; }
      else g.querySelector('.m2').textContent=(cfg.notProof&&cfg.notProof[i])||cfg.notProofT||'That’s a real part of the document, but it doesn’t show who gave the order. Try another number.';
      paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e){ var c=find(CH,S.doc.pick); return '<p class="a">'+e(cfg.journalLabel||'Kind of document')+': '+(c?e(c.t):'<i>(not chosen yet)</i>')+'. Clues found: '+S.doc.found.length+' of '+need+'.</p>'; }};
  };

  /* ---- Vocabulary · Mission bells: ring each bell (it swings, chimes, and the teacher says the word and its meaning
     when g4ss-<lesson>-bell-<n>.mp3 exists), then hang each meaning tag on the rope of its bell ---- */
  var ACtx=null; function chime(f){ try{ ACtx=ACtx||new (window.AudioContext||window.webkitAudioContext)(); var t=ACtx.currentTime; [1,2.76,5.4].forEach(function(m,k){ var o=ACtx.createOscillator(), g=ACtx.createGain(); o.type='sine'; o.frequency.value=f*m; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(k?0.06/k:0.22,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+(k?1.2:2.4)); o.connect(g); g.connect(ACtx.destination); o.start(t); o.stop(t+2.5); }); }catch(e){} }
  MOD.bells=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], NOTES=[392,330,294,262]; S.bells=S.bells||{rung:[],hung:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.bells.hung.length===W.length; };
    var bellSVG='<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 6c-11 0-17 9-17 20v10l-6 9h46l-6-9V26C47 15 41 6 30 6z" fill="url(#spkBronze)" stroke="#5E3A12" stroke-width="2"/><rect x="26" y="1" width="8" height="7" rx="2" fill="#5E3A12"/><circle cx="30" cy="50" r="5" fill="#5E3A12"/><defs><linearGradient id="spkBronze" x1="0" x2="1"><stop offset="0" stop-color="#9C6B2E"/><stop offset=".45" stop-color="#E2B866"/><stop offset="1" stop-color="#8A5A22"/></linearGradient></defs></svg>';
    var g=el('div','spk spk-bells');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Mission Bells')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-belltower"><div class="wall">'+W.map(function(x,i){ return '<div class="arch" data-i="'+i+'"><button type="button" class="bell" aria-label="Ring the bell: '+esc(x.w)+'">'+bellSVG+'</button><div class="word">'+(x.root?esc(x.w).replace(esc(x.root),'<b>'+esc(x.root)+'</b>'):esc(x.w))+'</div><div class="said"></div><div class="rope" role="button" tabindex="0" aria-label="Rope for '+esc(x.w)+'"><span class="knot"></span><span class="tag"></span></div></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct"></p><div class="spk-chips spk-belltags"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var tags=g.querySelector('.spk-belltags'), miss=g.querySelector('.spk-miss'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-bell-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-belltag','<span class="ico">🏷️</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; tags.appendChild(t); });
    function ring(i,quiet){ var a=g.querySelector('.arch[data-i="'+i+'"]'); a.classList.remove('swing'); void a.offsetWidth; a.classList.add('swing'); chime(NOTES[i%NOTES.length]); if(!quiet){ var au=AU[i]; if(au){ try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} } } }
    function paint(){ var allRung=S.bells.rung.length===W.length;
      g.querySelectorAll('.arch').forEach(function(a){ var i=+a.dataset.i, r=S.bells.rung.indexOf(i)>=0, h=S.bells.hung.indexOf(i)>=0; a.classList.toggle('rung',r); a.classList.toggle('hung',h); a.querySelector('.said').textContent=r&&!h?W[i].m:''; a.querySelector('.tag').textContent=h?W[i].m:''; });
      tags.classList.toggle('wait',!allRung); tags.querySelectorAll('.spk-belltag').forEach(function(t){ var h=S.bells.hung.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',h); t.draggable=allRung&&!h; });
      g.querySelector('.spk-bell-ct').innerHTML=!allRung?'<b>'+S.bells.rung.length+' of '+W.length+'</b> '+esc(cfg.ringT||'bells rung. Ring every bell to hear its word.'):(done()?'':'<b>'+S.bells.hung.length+' of '+W.length+'</b> '+esc(cfg.hangT||'meanings hung. Hang each meaning on the rope of its bell.'));
      g.classList.toggle('done',done()); if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.arch').forEach(function(a){ a.classList.toggle('armed',on&&!a.classList.contains('hung')); a.classList.remove('over'); }); }
    function attempt(tag,arch){ if(!tag||!arch) return; var i=+tag.dataset.i; if(S.bells.hung.indexOf(i)>=0||S.bells.rung.length<W.length) return; arm(false);
      if(+arch.dataset.i===i){ S.bells.hung.push(i); save(); sel=null; miss.textContent=''; ring(i,true); paint(); if(done()) setTimeout(function(){ [0,1,2,3].forEach(function(k){ setTimeout(function(){ if(k<W.length) ring(k,true); },k*260); }); },300); }
      else { tag.classList.add('shake'); setTimeout(function(){ tag.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    g.querySelector('.wall').addEventListener('click',function(e){ var b=e.target.closest('.bell'); if(b){ var i=+b.closest('.arch').dataset.i; if(S.bells.rung.indexOf(i)<0){ S.bells.rung.push(i); save(); } ring(i); paint(); return; } var a=e.target.closest('.arch'); if(a&&sel) attempt(sel,a); });
    g.querySelector('.wall').addEventListener('keydown',function(e){ var r=e.target.closest('.rope'); if(r&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(sel,r.closest('.arch')); } });
    tags.addEventListener('click',function(e){ var t=e.target.closest('.spk-belltag'); if(!t) return; if(S.bells.rung.length<W.length){ miss.textContent=cfg.ringFirstT||'Ring every bell first, so you hear each word.'; return; } tags.querySelectorAll('.spk-belltag').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    tags.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-belltag'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tags.addEventListener('dragend',function(){ arm(false); });
    var wall=g.querySelector('.wall');
    wall.addEventListener('dragover',function(e){ var a=e.target.closest('.arch'); g.querySelectorAll('.arch').forEach(function(x){ x.classList.toggle('over',x===a); }); if(a&&!a.classList.contains('hung')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wall.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.arch')); });
    paint(); return {done:done};
  };

  /* ---- Planner · courage scale: pick a motive, what the voyage took, what it cost, and your honest answer.
     The balance tips toward the side of your answer. Notes only — the student writes the sentences. ---- */
  MOD.scale=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    S.scale=S.scale||{took:[],cost:[]}; var pk=S.scale; var MAXP=cfg.maxPerPan||2;
    var b=el('div','spk spk-builder spk-scale');
    function opts(k,list,multi){ return '<div class="spk-opts" data-k="'+k+'">'+list.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+o.id+'">'+(o.ico?o.ico+' ':'')+esc(o.t)+'</button>'; }).join('')+'</div>'; }
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-balance"><svg viewBox="0 0 320 170" aria-hidden="true"><rect x="150" y="40" width="20" height="112" rx="4" fill="#7A4A26"/><rect x="110" y="150" width="100" height="14" rx="5" fill="#5A3418"/><circle cx="160" cy="40" r="9" fill="#C9A24A" stroke="#5A3418" stroke-width="2"/><g class="beam"><rect x="30" y="34" width="260" height="10" rx="5" fill="#C9A24A" stroke="#5A3418" stroke-width="2"/><g class="pan L"><line x1="45" y1="40" x2="25" y2="96" stroke="#5A3418" stroke-width="1.5"/><line x1="45" y1="40" x2="65" y2="96" stroke="#5A3418" stroke-width="1.5"/><path d="M12 96h66a33 12 0 0 1-66 0z" fill="#E8D4A8" stroke="#5A3418" stroke-width="2"/><text class="n" x="45" y="120" text-anchor="middle">0</text></g><g class="pan R"><line x1="275" y1="40" x2="255" y2="96" stroke="#5A3418" stroke-width="1.5"/><line x1="275" y1="40" x2="295" y2="96" stroke="#5A3418" stroke-width="1.5"/><path d="M242 96h66a33 12 0 0 1-66 0z" fill="#E8D4A8" stroke="#5A3418" stroke-width="2"/><text class="n" x="275" y="120" text-anchor="middle">0</text></g></g></svg><div class="pl"><span>'+esc(cfg.tookLabel||'What it took')+'</span><span>'+esc(cfg.costLabel||'What it cost')+'</span></div></div>'
      +'<div class="spk-step"><div class="lab">1 · '+esc(cfg.motiveLabel||'Which motive?')+'</div>'+opts('motive',cfg.motives||[])+'</div>'
      +'<div class="spk-step"><div class="lab">2 · '+esc(cfg.tookStep||'What did the voyage take? (pick 1 or 2)')+'</div>'+opts('took',cfg.took||[])+'</div>'
      +'<div class="spk-step"><div class="lab">3 · '+esc(cfg.costStep||'What did it cost the people already here? (pick 1 or 2)')+'</div>'+opts('cost',cfg.cost||[])+'</div>'
      +'<div class="spk-step"><div class="lab">4 · '+esc(cfg.answerLabel||'Your honest answer')+'</div>'+opts('answer',cfg.answers||[])+'</div>'
      +'<div class="spk-plan"></div>';
    function f(list,id){ return find(list||[],id); }
    function lines(){ var out=[], m=f(cfg.motives,pk.motive), a=f(cfg.answers,pk.answer); if(m) out.push(['Motive',m.t]); if(pk.took.length) out.push([cfg.tookLabel||'What it took',pk.took.map(function(id){ return f(cfg.took,id).t; }).join('; ')]); if(pk.cost.length) out.push([cfg.costLabel||'What it cost',pk.cost.map(function(id){ return f(cfg.cost,id).t; }).join('; ')]); if(a) out.push(['My answer',a.t]); return out; }
    function paint(){ ['motive','answer'].forEach(function(k){ b.querySelectorAll('[data-k="'+k+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===pk[k]); }); });
      ['took','cost'].forEach(function(k){ b.querySelectorAll('[data-k="'+k+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',pk[k].indexOf(o.dataset.v)>=0); }); });
      var a=f(cfg.answers,pk.answer), tilt=a?(a.tilt||0):0; b.querySelector('.beam').style.transform='rotate('+(tilt*9)+'deg)';
      b.querySelector('.pan.L .n').textContent=pk.took.length; b.querySelector('.pan.R .n').textContent=pk.cost.length;
      b.querySelectorAll('.pan').forEach(function(p){ p.style.transform='rotate('+(-tilt*9)+'deg)'; });
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):'Your plan will show up here as you choose.'; updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var k=o.parentNode.dataset.k, v=o.dataset.v;
      if(k==='took'||k==='cost'){ var arr=pk[k], i=arr.indexOf(v); if(i>=0) arr.splice(i,1); else { arr.push(v); if(arr.length>MAXP) arr.shift(); } } else pk[k]=v;
      S.scale=pk; save(); paint(); });
    paint(); before(partB,b);
    return {done:function(){ return !!(pk.motive&&pk.took.length&&pk.cost.length&&pk.answer); }, lines:lines};
  };

  /* ================================================================ 4.04.03 additions (Oct 2026)
     Flag art for the rival powers, a few WebAudio sounds, and five modules:
     claimcoast (Scene 1) · yearslider (reading) · domino (evidence) · ledger (planner) · streams (vocab). */
  function fleur(x,y,s){ return '<path transform="translate('+x+','+y+') scale('+s+')" d="M0,-6C2,-4 2,-1 0,1C-2,-1 -2,-4 0,-6ZM-1,1C-4,-1 -6,1 -4,3.5C-3,2.4 -2,2.2 -1,2.6ZM1,1C4,-1 6,1 4,3.5C3,2.4 2,2.2 1,2.6ZM-3.2,3h6.4v1.3h-6.4ZM-.8,4.3h1.6l.9,2.4h-3.4Z" fill="#F2C230"/>'; }
  /* Spain: the Cross of Burgundy (red ragged X on white). France: the royal arms (gold fleurs-de-lis on blue).
     England: St George's Cross. Great Britain: the Union Flag of 1707–1801 (before Ireland's cross was added). */
  FLAGART.es='<rect width="40" height="28" fill="#FFFDF5"/><g stroke="#B3261E" stroke-linecap="round"><path d="M7,4L33,24M33,4L7,24" stroke-width="4.5"/><path d="M13.5,9l-2.6,3.1M26.5,19l2.6,-3.1M26.5,9l2.6,3.1M13.5,19l-2.6,-3.1" stroke-width="2.6"/></g>';
  FLAGART.fr='<rect width="40" height="28" fill="#1F3F8F"/>'+fleur(12,10,.95)+fleur(28,10,.95)+fleur(20,20,.95);
  FLAGART.en='<rect width="40" height="28" fill="#FFFDF5"/><rect x="16.5" width="7" height="28" fill="#C8352E"/><rect y="10.5" width="40" height="7" fill="#C8352E"/>';
  FLAGART.gb='<rect width="40" height="28" fill="#1F3A7A"/><path d="M0,0L40,28M40,0L0,28" stroke="#fff" stroke-width="5"/><rect x="15" width="10" height="28" fill="#fff"/><rect y="9" width="40" height="10" fill="#fff"/><rect x="17" width="6" height="28" fill="#C8352E"/><rect y="11" width="40" height="6" fill="#C8352E"/>';
  var FLAGCOL={es:'#B3261E',fr:'#1F3F8F',en:'#C8352E',gb:'#1F3A7A'};
  /* map-unit flag on a pole, planted at (x,y): pole base at the spot */
  function poleFlag(k,x,y,s,cls){ s=s||1; return '<g class="spk-pf '+(cls||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+s+')"><line class="pole" x1="0" y1="0" x2="0" y2="-9" stroke="#3E2612" stroke-width=".7" stroke-linecap="round"/><g transform="translate(0,-9) scale(.16)"><g class="cloth">'+(FLAGART[k]||'')+'<rect width="40" height="28" fill="none" stroke="#3E2612" stroke-width="1.6"/></g></g></g>'; }
  function sfx(kind){ if(QUIET&&kind!=='click') return; try{ ACtx=ACtx||new (window.AudioContext||window.webkitAudioContext)(); var t=ACtx.currentTime, sr=ACtx.sampleRate;
      function noise(dur,f,q,vol,shape){ var n=Math.floor(sr*dur), b=ACtx.createBuffer(1,n,sr), d=b.getChannelData(0); for(var i=0;i<n;i++){ var e=shape?shape(i/n):1; d[i]=(Math.random()*2-1)*e; } var src=ACtx.createBufferSource(); src.buffer=b; var bp=ACtx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=q; var g=ACtx.createGain(); g.gain.value=vol; src.connect(bp); bp.connect(g); g.connect(ACtx.destination); src.start(t); }
      function tone(f,dur,vol,type,f2){ var o=ACtx.createOscillator(), g=ACtx.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f,t); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(g); g.connect(ACtx.destination); o.start(t); o.stop(t+dur+0.05); }
      if(kind==='flap') noise(.45,900,1.2,.35,function(p){ return Math.max(0,Math.sin(p*Math.PI))*(.55+.45*Math.abs(Math.sin(p*38))); });
      else if(kind==='click'){ tone(1900,.05,.12,'triangle',700); noise(.04,3000,2,.18); }
      else if(kind==='water') noise(1.1,1400,.8,.22,function(p){ return Math.max(0,Math.sin(p*Math.PI))*(.4+.6*Math.random()); });
      else if(kind==='thud'){ tone(140,.25,.35,'sine',60); noise(.08,500,1,.25); }
      else if(kind==='pluck'){ tone(392,.5,.22,'triangle',386); tone(784,.25,.06,'sine'); }
      else if(kind==='plop'){ tone(620,.18,.22,'sine',180); noise(.5,700,1,.12,function(p){ return Math.max(0,1-p)*(.5+.5*Math.random()); }); }
      else if(kind==='clink'){ tone(2300,.12,.1,'triangle',2100); tone(3100,.09,.06,'sine'); }
      else if(kind==='plant'){ tone(180,.18,.25,'sine',90); noise(.18,900,1,.18,function(p){ return 1-p; }); }
      else if(kind==='slide') noise(.4,500,.7,.16,function(p){ return Math.max(0,Math.sin(p*Math.PI))*(.7+.3*Math.random()); });
      else if(kind==='paper') noise(.3,2600,.6,.14,function(p){ return Math.max(0,1-p)*(.4+.6*Math.random()); });
      else if(kind==='win') [523,659,784].forEach(function(f,i){ setTimeout(function(){ chime(f); },i*180); });
    }catch(e){} }

  /* ---- Scene 1 · Claim the coast: a close-up of Florida's northeast coast (real lon/lat). Drag each flag card (or tap it,
     then tap a spot) to the place that power came to. Each claim shades the coast around it; where claims overlap, it glows. ---- */
  MOD.claimcoast=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var B=cfg.box||[-82.05,29.45,-80.85,30.75], nw=project(B[0],B[3]), se=project(B[2],B[1]), vw=se[0]-nw[0], vh=se[1]-nw[1], u=vw/42;
    var SP=(cfg.spots||[]).map(function(s){ var q=project(s.lon,s.lat); return Object.assign({},s,{x:q[0],y:q[1]}); }), FL=cfg.flags||[];
    S.claims=S.claims||[]; var done=function(){ return FL.length>0&&FL.every(function(f){ return S.claims.indexOf(f.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    function spot(id){ return find(SP,id); }
    var R0=(cfg.zoneR||11)*u/1;
    var defs='<defs><pattern id="spkWaveC" width="'+(4*u)+'" height="'+(2*u)+'" patternUnits="userSpaceOnUse"><path d="M0,'+(1.2*u)+' q'+(u)+','+(-u)+' '+(2*u)+',0 t'+(2*u)+',0" fill="none" stroke="#7FB5CC" stroke-width="'+(.18*u)+'" opacity=".6"/></pattern>'
      +FL.map(function(f){ var s=spot(f.spot); return '<clipPath id="spkCZ-'+f.id+'"><circle cx="'+s.x.toFixed(1)+'" cy="'+s.y.toFixed(1)+'" r="'+((f.r||cfg.zoneR||11)*u/1).toFixed(1)+'"/></clipPath>'; }).join('')+'<clipPath id="spkCland"><path d="'+FLORIDA+'"/></clipPath></defs>';
    var land='<rect x="'+nw[0]+'" y="'+nw[1]+'" width="'+vw+'" height="'+vh+'" fill="#BFE3EE"/><rect x="'+nw[0]+'" y="'+nw[1]+'" width="'+vw+'" height="'+vh+'" fill="url(#spkWaveC)"/><path d="'+FLORIDA+'" fill="#D8E6AE" stroke="#6E8A3A" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>';
    var rivers=(cfg.rivers||[]).map(function(r){ return '<path d="'+geoPath(r.pts)+'" fill="none" stroke="#6FA9C4" stroke-width="'+((r.w||.9)*u).toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round"/>'+(r.label?'<text class="rv" x="'+project(r.label[0],r.label[1])[0].toFixed(1)+'" y="'+project(r.label[0],r.label[1])[1].toFixed(1)+'" style="font-size:'+(1.35*u).toFixed(2)+'px" text-anchor="'+(r.a||'middle')+'">'+esc(r.t)+'</text>':''); }).join('');
    var zones='<g class="zones">'+FL.map(function(f){ var s=spot(f.spot); return '<circle class="cz" data-f="'+f.id+'" cx="'+s.x.toFixed(1)+'" cy="'+s.y.toFixed(1)+'" r="'+((f.r||cfg.zoneR||11)*u).toFixed(1)+'" fill="'+FLAGCOL[f.flag]+'" clip-path="url(#spkCland)"/>'; }).join('')
      +FL.map(function(a,i){ return FL.slice(i+1).map(function(b){ var sa=spot(a.spot); return '<g clip-path="url(#spkCZ-'+b.id+')"><circle class="ov" data-a="'+a.id+'" data-b="'+b.id+'" cx="'+sa.x.toFixed(1)+'" cy="'+sa.y.toFixed(1)+'" r="'+((a.r||cfg.zoneR||11)*u).toFixed(1)+'" clip-path="url(#spkCland)"/></g>'; }).join(''); }).join('')+'</g>';
    var peoples=(cfg.peoples||[]).map(function(p){ var q=project(p.lon,p.lat); return '<text class="pp" x="'+q[0].toFixed(1)+'" y="'+q[1].toFixed(1)+'" style="font-size:'+(1.5*u).toFixed(2)+'px" text-anchor="'+(p.a||'middle')+'">'+esc(p.t)+'</text>'; }).join('');
    var sea=(cfg.sea||[]).map(function(p){ var q=project(p.lon,p.lat); return '<text class="sea" x="'+q[0].toFixed(1)+'" y="'+q[1].toFixed(1)+'" style="font-size:'+(1.6*u).toFixed(2)+'px" text-anchor="middle">'+esc(p.t)+'</text>'; }).join('');
    var spots=SP.map(function(s){ return '<g class="spk-cspot" data-s="'+s.id+'" role="button" tabindex="0" aria-label="'+esc(s.label)+'"><circle class="hit" cx="'+s.x.toFixed(1)+'" cy="'+s.y.toFixed(1)+'" r="'+(3.4*u).toFixed(1)+'"/><circle class="ring" cx="'+s.x.toFixed(1)+'" cy="'+s.y.toFixed(1)+'" r="'+(1.5*u).toFixed(1)+'" stroke-width="'+(.35*u).toFixed(2)+'"/><text class="sl" x="'+(s.x+(s.dx||0)*u).toFixed(1)+'" y="'+(s.y+(s.dy!=null?s.dy:3.4)*u).toFixed(1)+'" style="font-size:'+(1.45*u).toFixed(2)+'px;stroke-width:'+(.5*u).toFixed(2)+'px" text-anchor="'+(s.a||'middle')+'">'+esc(s.label)+'</text></g>'; }).join('');
    var flags='<g class="planted">'+FL.map(function(f){ var s=spot(f.spot); return poleFlag(f.flag,s.x+(f.px||0)*u,s.y+(f.py||0)*u,u*.62,'f-'+f.id).replace('class="spk-pf ','data-f="'+f.id+'" class="spk-pf '); }).join('')+'</g>';
    var svg='<svg viewBox="'+nw[0].toFixed(1)+' '+nw[1].toFixed(1)+' '+vw.toFixed(1)+' '+vh.toFixed(1)+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.aria||'Map of Florida’s northeast coast')+'">'+defs+land+zones+rivers+peoples+sea+spots+flags+(cfg.caption?'<text class="cap" x="'+(nw[0]+1.2*u).toFixed(1)+'" y="'+(se[1]-1.3*u).toFixed(1)+'" style="font-size:'+(1.35*u).toFixed(2)+'px">'+esc(cfg.caption)+'</text>':'')+'</svg>';
    var g=el('div','spk spk-game spk-claim');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Claim the Coast')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-maplock"><div class="spk-map">'+svg+'</div><div><div class="spk-chips spk-cflags"></div><p class="spk-miss"></p><p class="spk-claim-ct"></p></div></div><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    var chips=g.querySelector('.spk-cflags'), miss=g.querySelector('.spk-miss'), sel=null;
    FL.forEach(function(f){ var c=el('div','spk-chip noimg spk-cflag','<span class="ico">'+flagSVG(f.flag,30)+'</span><span><b>'+esc(f.year)+' · '+esc(f.name)+'</b><br>'+esc(f.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.f=f.id; c.style.borderLeftColor=FLAGCOL[f.flag]; chips.appendChild(c); });
    function paint(anim){ FL.forEach(function(f){ var on=S.claims.indexOf(f.id)>=0, pf=g.querySelector('.spk-pf[data-f="'+f.id+'"]'), cz=g.querySelector('.cz[data-f="'+f.id+'"]'), c=chips.querySelector('[data-f="'+f.id+'"]');
        pf.classList.toggle('on',on); cz.classList.toggle('on',on); if(on&&anim===f.id){ pf.classList.add('rise'); setTimeout(function(){ pf.classList.remove('rise'); },1300); }
        c.classList.toggle('done',on); c.draggable=!on; });
      g.querySelectorAll('.ov').forEach(function(o){ o.classList.toggle('on',S.claims.indexOf(o.dataset.a)>=0&&S.claims.indexOf(o.dataset.b)>=0); });
      var n=S.claims.length; g.querySelector('.spk-claim-ct').innerHTML=n<FL.length?'<b>'+n+' of '+FL.length+'</b> '+esc(cfg.countT||'flags planted.'):'';
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function arm(on){ g.querySelectorAll('.spk-cspot').forEach(function(s){ s.classList.toggle('armed',on); s.classList.remove('over'); }); }
    function attempt(chip,sp){ if(!chip||!sp) return; var f=find(FL,chip.dataset.f); if(!f||S.claims.indexOf(f.id)>=0) return; arm(false);
      if(sp.dataset.s===f.spot){ S.claims.push(f.id); save(); sel=null; chip.classList.remove('sel'); miss.textContent=''; sfx('flap'); paint(f.id); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },700); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=(f.miss&&f.miss[sp.dataset.s])||f.missAny||''; miss.textContent=m; missBeat(m); } }
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-cflag'); if(!c||c.classList.contains('done')) return; ack('open'); chips.querySelectorAll('.spk-cflag').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&e.target.closest('.spk-cflag')){ e.preventDefault(); e.target.closest('.spk-cflag').click(); } });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-cflag'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.f); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    var map=g.querySelector('.spk-map');
    map.addEventListener('click',function(e){ var s=e.target.closest('.spk-cspot'); if(s) attempt(sel,s); });
    map.addEventListener('keydown',function(e){ var s=e.target.closest('.spk-cspot'); if(s&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(sel,s); } });
    map.addEventListener('dragover',function(e){ var s=e.target.closest('.spk-cspot'); g.querySelectorAll('.spk-cspot').forEach(function(x){ x.classList.toggle('over',x===s); }); if(s){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    map.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-cspot')); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ var p=FL.filter(function(f){ return S.claims.indexOf(f.id)>=0; }); return p.length?'<p class="a">'+p.map(function(f){ return e(f.year+' · '+f.name+' → '+spot(f.spot).label); }).join('<br>')+'</p>':NA; }};
  };

  /* ---- Explore reading · Year slider: slide through the years. The map changes, and the lesson's own paragraph
     for that year appears (nothing shows until the student moves to it). DATA: stops [{year,label,paras:[id],show:[layer ids]}],
     paras [{id,match}], layers drawn on the real Florida map. ---- */
  MOD.yearslider=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent)){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.stops||[];
    S.yrSeen=S.yrSeen||[]; if(S.yrAt==null) S.yrAt=-1;
    var done=function(){ return ST.every(function(s,i){ return S.yrSeen.indexOf(i)>=0; }); };
    function at(lon,lat){ return project(lon,lat).map(function(v){ return v.toFixed(1); }); }
    var L=cfg.layers||{}, lay='';
    Object.keys(L).forEach(function(id){ var l=L[id], q=l.lon!=null?at(l.lon,l.lat):null;
      if(l.kind==='tint') lay+='<g class="yl" data-l="'+id+'"><path d="'+FLORIDA+'" fill="'+l.color+'" opacity=".22"/>'+(l.t?'<text class="tl" x="'+at(l.tlon,l.tlat)[0]+'" y="'+at(l.tlon,l.tlat)[1]+'" text-anchor="middle" style="fill:'+l.color+'">'+esc(l.t)+'</text>':'')+'</g>';
      else if(l.kind==='flag') lay+='<g class="yl" data-l="'+id+'">'+poleFlag(l.flag,+q[0],+q[1],l.s||1.6)+(l.t?'<text class="fl-t" x="'+(+q[0]+(l.dx||8))+'" y="'+(+q[1]+(l.dy||-3))+'" text-anchor="'+(l.a||'start')+'">'+esc(l.t)+'</text>':'')+'</g>';
      else if(l.kind==='gone') lay+='<g class="yl" data-l="'+id+'"><path d="M'+(q[0]-4)+','+(q[1]-4)+'l8,8M'+(+q[0]+4)+','+(q[1]-4)+'l-8,8" stroke="#5C4A2A" stroke-width="2" stroke-linecap="round"/>'+(l.t?'<text class="fl-t" x="'+(q[0]-(l.dx||7))+'" y="'+(+q[1]+(l.dy||3))+'" text-anchor="end">'+esc(l.t)+'</text>':'')+'</g>';
      else if(l.kind==='fire') lay+='<g class="yl fire" data-l="'+id+'"><circle cx="'+q[0]+'" cy="'+q[1]+'" r="7" fill="#F28C28" opacity=".35"/><path d="M'+q[0]+','+(q[1]-9)+'c3,4 5,6 3,9 c-1,2 -5,2 -6,0 c-2,-3 1,-5 3,-9z" fill="#E8542A"/></g>';
      else if(l.kind==='ships') lay+='<g class="yl ships" data-l="'+id+'">'+(l.pts||[]).map(function(p){ var s=at(p[0],p[1]); return '<g transform="translate('+(s[0]-9)+','+(s[1]-8)+') scale(.38)">'+shipIcon(1,FLAGCOL.en).replace(/<svg[^>]*>|<\/svg>/g,'')+'</g>'; }).join('')+(l.t?'<text class="fl-t" x="'+at(l.tlon,l.tlat)[0]+'" y="'+at(l.tlon,l.tlat)[1]+'" text-anchor="start">'+esc(l.t)+'</text>':'')+'</g>';
    });
    var peoples=(cfg.peoples||[]).map(function(p){ var q=at(p.lon,p.lat); return '<text class="pp" x="'+q[0]+'" y="'+q[1]+'" text-anchor="'+(p.a||'middle')+'">'+esc(p.t)+'</text>'; }).join('');
    var svg='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.aria||'Map of Florida that changes with the year')+'">'+floridaBase('Y')+lay+peoples+'<text class="yr-big" x="16" y="282"></text></svg>';
    var wrap=el('div','spk spk-yslider');
    wrap.innerHTML='<div class="spk-ys-top"><div class="spk-map">'+svg+'</div><div class="spk-ys-side"><div class="spk-ys-ctl"><div class="lab">'+esc(cfg.label||'Slide to a year')+'</div><input type="range" min="-100" max="'+((ST.length-1)*100)+'" step="1" value="'+(S.yrAt>=0?S.yrAt*100:-100)+'" aria-label="Year"><div class="ticks">'+ST.map(function(s,i){ return '<button type="button" class="tick" data-i="'+i+'" style="left:'+((i+1)/ST.length*100).toFixed(1)+'%">'+s.year+'</button>'; }).join('')+'</div></div><p class="spk-ys-ct"></p></div></div><div class="spk-ys-read"></div>';
    before(first,wrap);
    var read=wrap.querySelector('.spk-ys-read'), rng=wrap.querySelector('input'), boxes={};
    PA.forEach(function(a){ var p=found[a.id]; if(!p) return; var b=el('div','spk-ys-p'); boxes[a.id]=b; read.appendChild(b); move(p,function(n){ b.appendChild(n); }); });
    function paint(anim){ var i=S.yrAt, s=ST[i];
      wrap.querySelectorAll('.yl').forEach(function(l){ l.classList.toggle('on',!!s&&(s.show||[]).indexOf(l.dataset.l)>=0); });
      Object.keys(boxes).forEach(function(id){ var on=!!s&&(s.paras||[]).indexOf(id)>=0; boxes[id].classList.toggle('on',on); if(on&&anim) { boxes[id].classList.remove('pop'); void boxes[id].offsetWidth; boxes[id].classList.add('pop'); } });
      wrap.querySelector('.yr-big').textContent=s?(s.label||s.year):'';
      wrap.querySelectorAll('.tick').forEach(function(t,k){ t.classList.toggle('seen',S.yrSeen.indexOf(k)>=0); t.classList.toggle('now',k===i); });
      var n=S.yrSeen.length; wrap.querySelector('.spk-ys-ct').innerHTML=i<0?esc(cfg.startT||'Drag the slider to the first year.'):(n<ST.length?'<b>'+n+' of '+ST.length+'</b> '+esc(cfg.countT||'years visited. Slide on to the next year.'):'<b>'+esc(cfg.allT||'You visited every year.')+'</b>');
      wrap.classList.toggle('all',done()); var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i,fromTick){ if(i<0||i>=ST.length) return; var was=S.yrAt; S.yrAt=i; if(S.yrSeen.indexOf(i)<0) S.yrSeen.push(i); save(); if(fromTick) rng.value=i*100; paint(was!==i); if(was!==i) sfx('click'); refreshFile(); }
    function nearest(v){ var i=Math.round(v/100); return Math.abs(v-i*100)<=22&&i>=0&&i<ST.length?i:-1; }
    rng.addEventListener('input',function(){ var i=nearest(+rng.value); if(i>=0&&i!==S.yrAt) go(i); });
    rng.addEventListener('change',function(){ var i=Math.max(0,Math.min(ST.length-1,Math.round(+rng.value/100))); rng.value=i*100; go(i); });
    wrap.querySelector('.ticks').addEventListener('click',function(e){ var t=e.target.closest('.tick'); if(t) go(+t.dataset.i,true); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(e){ return '<p class="a">Years visited on the map: '+S.yrSeen.length+' of '+ST.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Domino chain: put the dominoes in cause → effect order (tap the one that comes next, or
     drag it to the line). When a line is full, tip the first one and watch them fall. DATA: chains [{id,title,items:[{yr,t,miss}]}] ---- */
  MOD.domino=function(cfg){ var tl=document.querySelector('#panel-explore .timeline-card'); if(!tl) return null;
    var CH=cfg.chains||[]; S.dom=S.dom||{}; CH.forEach(function(c){ S.dom[c.id]=S.dom[c.id]||{placed:[],fell:false}; });
    var done=function(){ return CH.length>0&&CH.every(function(c){ return S.dom[c.id].fell; }); };
    function cur(){ for(var i=0;i<CH.length;i++) if(!S.dom[CH[i].id].fell) return i; return CH.length-1; }
    var g=el('div','spk spk-game spk-domino');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Domino Chain')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +CH.map(function(c,ci){ return '<div class="spk-dchain" data-c="'+ci+'"><div class="hd">'+esc(c.title||'')+'</div><div class="line">'+c.items.map(function(x,k){ return '<div class="slot" data-k="'+k+'"><span class="n">'+(k+1)+'</span></div>'; }).join('<span class="arr" aria-hidden="true">→</span>')+'</div><div class="spk-chips spk-dtray"></div><p class="spk-miss"></p><button type="button" class="spk-tip">'+esc(cfg.tipT||'Tip the first domino')+' 👉</button><p class="spk-dwin">'+(c.win||'')+'</p></div>'; }).join('')
      +'<div class="spk-win">'+(cfg.win||'')+'</div>';
    after(tl,g);
    function tile(x){ return '<span class="pips">'+esc(x.yr||'')+'</span><span class="tx">'+esc(x.t)+'</span>'; }
    CH.forEach(function(c,ci){ var box=g.querySelector('.spk-dchain[data-c="'+ci+'"]'), tray=box.querySelector('.spk-dtray');
      shuffle(c.items.map(function(x,k){ return k; })).forEach(function(k){ var d=el('div','spk-dom',tile(c.items[k])); d.setAttribute('role','button'); d.tabIndex=0; d.draggable=true; d.dataset.k=k; tray.appendChild(d); }); });
    function paint(){ var on=cur();
      CH.forEach(function(c,ci){ var st=S.dom[c.id], box=g.querySelector('.spk-dchain[data-c="'+ci+'"]'); box.classList.toggle('wait',ci>on&&!st.fell); box.classList.toggle('fell',st.fell); box.classList.toggle('full',st.placed.length===c.items.length);
        box.querySelectorAll('.slot').forEach(function(sl,k){ var has=st.placed[k]; if(has!=null&&!sl.querySelector('.spk-dom')){ var d=el('div','spk-dom in',tile(c.items[has])); sl.appendChild(d); } sl.classList.toggle('next',k===st.placed.length&&!st.fell&&ci===on); });
        box.querySelectorAll('.spk-dtray .spk-dom').forEach(function(d){ d.classList.toggle('spk-hide',st.placed.indexOf(+d.dataset.k)>=0); });
        box.querySelector('.spk-tip').classList.toggle('spk-hide',!(st.placed.length===c.items.length&&!st.fell)); });
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function place(ci,k,d){ var c=CH[ci], st=S.dom[c.id]; if(ci!==cur()||st.fell||st.placed.indexOf(k)>=0) return; var box=g.querySelector('.spk-dchain[data-c="'+ci+'"]'), miss=box.querySelector('.spk-miss');
      if(k===st.placed.length){ st.placed.push(k); save(); miss.textContent=''; sfx('click'); paint(); var sl=box.querySelectorAll('.slot')[k]; if(sl){ sl.classList.add('snap'); setTimeout(function(){ sl.classList.remove('snap'); },400); } }
      else { if(d){ d.classList.add('shake'); setTimeout(function(){ d.classList.remove('shake'); },450); } var m=c.items[k].miss||cfg.missT||'Not yet. What had to happen first?'; miss.textContent=m; missBeat(m); } }
    function topple(ci){ var c=CH[ci], st=S.dom[c.id], box=g.querySelector('.spk-dchain[data-c="'+ci+'"]'), sl=box.querySelectorAll('.slot .spk-dom'), reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
      box.querySelector('.spk-tip').classList.add('spk-hide');
      [].forEach.call(sl,function(d,k){ setTimeout(function(){ d.classList.add('fall'); sfx('click'); },reduce?0:k*260); });
      setTimeout(function(){ st.fell=true; save(); paint(); refreshFile(); refreshVoice(); if(done()) sfx('win'); },reduce?50:sl.length*260+500); }
    g.addEventListener('click',function(e){ var tip=e.target.closest('.spk-tip'); if(tip){ topple(+tip.closest('.spk-dchain').dataset.c); return; }
      var d=e.target.closest('.spk-dtray .spk-dom'); if(d){ ack('explore'); place(+d.closest('.spk-dchain').dataset.c,+d.dataset.k,d); } });
    g.addEventListener('keydown',function(e){ var d=e.target.closest('.spk-dtray .spk-dom'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); d.click(); } });
    g.addEventListener('dragstart',function(e){ var d=e.target.closest('.spk-dtray .spk-dom'); if(!d){ e.preventDefault(); return; } e.dataTransfer.setData('text/plain',d.closest('.spk-dchain').dataset.c+':'+d.dataset.k); e.dataTransfer.effectAllowed='move'; });
    g.addEventListener('dragover',function(e){ if(e.target.closest('.line')) e.preventDefault(); });
    g.addEventListener('drop',function(e){ var ln=e.target.closest('.line'); if(!ln) return; e.preventDefault(); var v=(e.dataTransfer.getData('text/plain')||'').split(':'); if(v.length!==2) return; var ci=+v[0], k=+v[1]; if(+ln.closest('.spk-dchain').dataset.c!==ci) return; place(ci,k,g.querySelector('.spk-dchain[data-c="'+ci+'"] .spk-dtray .spk-dom[data-k="'+k+'"]')); });
    paint();
    return {done:done, journal:function(e,NA){ var out=CH.filter(function(c){ return S.dom[c.id].placed.length; }).map(function(c){ return '<p class="a"><b>'+e(c.title||'')+'</b>: '+S.dom[c.id].placed.map(function(k){ return e(c.items[k].t); }).join(' → ')+'</p>'; }); return out.length?out.join(''):NA; }};
  };

  /* ---- Planner · Three-flag ledger: one column per power (a motive + one event), then the people already here
     (a nation + what the rivalry meant). Each finished column gets a wax seal. Notes only — the student writes. ---- */
  MOD.ledger=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var PW=cfg.powers||[], MO=cfg.motives||[]; S.ledger=S.ledger||{cols:{},nation:null,meant:[]}; var L=S.ledger, MAXM=cfg.maxMeant||2;
    PW.forEach(function(p){ L.cols[p.id]=L.cols[p.id]||{}; });
    function colDone(id){ var c=L.cols[id]; return !!(c&&c.motive&&c.event); }
    var peopleDone=function(){ return !!(L.nation&&L.meant.length); };
    var done=function(){ return PW.every(function(p){ return colDone(p.id); })&&peopleDone(); };
    function opts(k,list){ return '<div class="spk-opts" data-k="'+k+'">'+list.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+o.id+'">'+(o.ico?o.ico+' ':'')+esc(o.t)+'</button>'; }).join('')+'</div>'; }
    function wax(t){ return '<span class="spk-wax" aria-hidden="true"><svg viewBox="0 0 60 60"><path d="M30 3c5 0 7 4 11 5s8 0 10 4-1 8 1 12 5 6 4 11-6 6-8 10-3 9-8 10-8-3-10-3-6 4-11 2-4-7-8-9-9-3-11-8 2-8 1-12-5-7-2-11 8-2 11-5S25 3 30 3z" fill="#A3312B"/><circle cx="30" cy="30" r="16" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-dasharray="3 2"/><text x="30" y="36" text-anchor="middle" font-size="17">'+t+'</text></svg></span>'; }
    var b=el('div','spk spk-builder spk-ledger');
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-lbook"><div class="cols">'+PW.map(function(p){ return '<div class="col" data-p="'+p.id+'" style="--c:'+(FLAGCOL[p.flag]||'#5C4A2A')+'"><div class="hd">'+flagSVG(p.flag,34)+'<span>'+esc(p.name)+'</span></div><div class="lab">'+esc(cfg.motiveLabel||'Motive')+'</div>'+opts('m:'+p.id,MO)+'<div class="lab">'+esc(cfg.eventLabel||'One event')+'</div>'+opts('e:'+p.id,p.events||[])+wax(p.seal||'✓')+'</div>'; }).join('')+'</div>'
      +'<div class="ppl"><div class="lab">'+esc(cfg.nationLabel||'The people already here')+'</div>'+opts('nation',cfg.nations||[])+'<div class="lab">'+esc(cfg.meantLabel||'What the rivalry meant for them (pick 1 or 2)')+'</div>'+opts('meant',cfg.meant||[])+wax(cfg.peopleSeal||'🌿')+'</div>'
      +'<div class="final">'+wax(cfg.finalSeal||'🗝️')+'<span>'+esc(cfg.doneT||'Ledger sealed.')+'</span></div></div>'
      +'<div class="spk-plan"></div>';
    function f(list,id){ return find(list||[],id); }
    function lines(){ var out=[]; PW.forEach(function(p){ var c=L.cols[p.id], m=f(MO,c.motive), ev=f(p.events,c.event); if(m||ev) out.push([p.name,[m&&m.t,ev&&ev.t].filter(Boolean).join(' · ')]); });
      var n=f(cfg.nations,L.nation); if(n||L.meant.length) out.push([cfg.nationShort||'First Peoples',[n&&n.t].concat(L.meant.map(function(id){ return f(cfg.meant,id).t; })).filter(Boolean).join(' · ')]); return out; }
    var was={};
    function paint(){ PW.forEach(function(p){ var c=L.cols[p.id], col=b.querySelector('.col[data-p="'+p.id+'"]');
        col.querySelectorAll('[data-k="m:'+p.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===c.motive); });
        col.querySelectorAll('[data-k="e:'+p.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===c.event); });
        var d=colDone(p.id); col.classList.toggle('sealed',d); if(d&&was[p.id]===false){ col.classList.add('stamp'); sfx('thud'); setTimeout(function(){ col.classList.remove('stamp'); },700); } was[p.id]=d; });
      b.querySelectorAll('[data-k="nation"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===L.nation); });
      b.querySelectorAll('[data-k="meant"] .spk-opt').forEach(function(o){ o.classList.toggle('on',L.meant.indexOf(o.dataset.v)>=0); });
      var pp=b.querySelector('.ppl'), pd=peopleDone(); pp.classList.toggle('sealed',pd); if(pd&&was.ppl===false){ pp.classList.add('stamp'); sfx('thud'); setTimeout(function(){ pp.classList.remove('stamp'); },700); } was.ppl=pd;
      var all=done(); b.querySelector('.spk-lbook').classList.toggle('sealed',all); if(all&&was.all===false){ b.querySelector('.final').classList.add('stamp'); setTimeout(function(){ sfx('win'); },300); } was.all=all;
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var k=o.parentNode.dataset.k, v=o.dataset.v;
      if(k==='meant'){ var i=L.meant.indexOf(v); if(i>=0) L.meant.splice(i,1); else { L.meant.push(v); if(L.meant.length>MAXM) L.meant.shift(); } }
      else if(k==='nation') L.nation=v;
      else { var pr=k.split(':'), c=L.cols[pr[1]]; c[pr[0]==='m'?'motive':'event']=v; }
      S.ledger=L; save(); paint(); });
    paint(); before(partB,b);
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Dig the streams: tap a word to dig a channel from the spring to it — the water flows in and the
     teacher says the word (g4ss-<lesson>-stream-<n>.mp3 when it exists). Then float each meaning down to its word. ---- */
  MOD.streams=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.streams=S.streams||{dug:[],fed:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.streams.fed.length===W.length; };
    var n=W.length, xs=W.map(function(x,i){ return (i+.5)*400/n; });
    var ch=xs.map(function(x,i){ return 'M200,22 C200,58 '+x.toFixed(0)+',52 '+x.toFixed(0)+',100'; });
    var svg='<svg class="spk-chan" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">'+ch.map(function(d,i){ return '<path class="dirt" d="'+d+'" vector-effect="non-scaling-stroke"/><path class="wtr" data-i="'+i+'" d="'+d+'" pathLength="100" vector-effect="non-scaling-stroke"/><path class="glint" data-i="'+i+'" d="'+d+'" pathLength="100" vector-effect="non-scaling-stroke"/>'; }).join('')+'</svg>';
    var g=el('div','spk spk-streams');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Dig the Streams')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-valley"><div class="spring"><span class="pool"></span><span class="nm"><b>'+esc(cfg.root||'riv')+'</b> '+esc(cfg.rootMeaning||'= stream')+'</span></div>'+svg
      +'<div class="basins">'+W.map(function(x,i){ return '<div class="basin" data-i="'+i+'" role="button" tabindex="0" aria-label="Dig to '+esc(x.w)+'"><span class="shovel" aria-hidden="true">⛏️</span><span class="word">'+(x.root?esc(x.w).replace(esc(x.root),'<b>'+esc(x.root)+'</b>'):esc(x.w))+'</span><span class="mean"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-st-ct"></p><div class="spk-chips spk-sleaves"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var leaves=g.querySelector('.spk-sleaves'), miss=g.querySelector('.spk-miss'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-stream-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-sleaf','<span class="ico">🍃</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; leaves.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allDug=S.streams.dug.length===W.length;
      g.querySelectorAll('.basin').forEach(function(b){ var i=+b.dataset.i, d=S.streams.dug.indexOf(i)>=0, f=S.streams.fed.indexOf(i)>=0; b.classList.toggle('dug',d); b.classList.toggle('fed',f); b.querySelector('.mean').textContent=f?W[i].m:''; });
      g.querySelectorAll('.wtr,.glint').forEach(function(p){ var i=+p.dataset.i; p.classList.toggle('on',S.streams.dug.indexOf(i)>=0); if(anim===i&&p.classList.contains('wtr')){ p.classList.remove('flow'); void p.getBoundingClientRect(); p.classList.add('flow'); } });
      leaves.classList.toggle('wait',!allDug); leaves.querySelectorAll('.spk-sleaf').forEach(function(t){ var f=S.streams.fed.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allDug&&!f; });
      g.querySelector('.spk-st-ct').innerHTML=!allDug?'<b>'+S.streams.dug.length+' of '+W.length+'</b> '+esc(cfg.digT||'streams dug. Tap each word to dig its stream and hear it.'):(done()?'':'<b>'+S.streams.fed.length+' of '+W.length+'</b> '+esc(cfg.floatT||'meanings floated. Send each meaning down the stream to its word.'));
      g.classList.toggle('done',done()); if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.basin').forEach(function(b){ b.classList.toggle('armed',on&&!b.classList.contains('fed')); b.classList.remove('over'); }); }
    function attempt(t,b){ if(!t||!b) return; var i=+t.dataset.i; if(S.streams.fed.indexOf(i)>=0||S.streams.dug.length<W.length) return; arm(false);
      if(+b.dataset.i===i){ S.streams.fed.push(i); save(); sel=null; miss.textContent=''; sfx('water'); paint(); if(done()) setTimeout(function(){ sfx('win'); },400); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    var bs=g.querySelector('.basins');
    bs.addEventListener('click',function(e){ var b=e.target.closest('.basin'); if(!b) return; var i=+b.dataset.i;
      if(sel&&S.streams.dug.length===W.length){ attempt(sel,b); return; }
      var first=S.streams.dug.indexOf(i)<0; if(first){ S.streams.dug.push(i); save(); sfx('water'); } say(i); paint(first?i:null); });
    bs.addEventListener('keydown',function(e){ var b=e.target.closest('.basin'); if(b&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); b.click(); } });
    leaves.addEventListener('click',function(e){ var t=e.target.closest('.spk-sleaf'); if(!t) return; if(S.streams.dug.length<W.length){ miss.textContent=cfg.digFirstT||'Dig every stream first, so you hear each word.'; return; } leaves.querySelectorAll('.spk-sleaf').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    leaves.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-sleaf'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    leaves.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-sleaf'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    leaves.addEventListener('dragend',function(){ arm(false); });
    bs.addEventListener('dragover',function(e){ var b=e.target.closest('.basin'); g.querySelectorAll('.basin').forEach(function(x){ x.classList.toggle('over',x===b); }); if(b&&!b.classList.contains('fed')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    bs.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.basin')); });
    paint(); return {done:done};
  };

  /* ═══ 4.04.04 additions: string board · ripples · says / infer / ask · cause-effect chain · plant the field ═══ */

  /* ---- Scene 1 · String board: cause cards pinned on the left, effect cards on the right. Tap (or drag) a cause, then
     its effect: a red string pulls taut between the two pins. DATA: causes [{id,ico,t,effect,miss}], effects [{id,ico,t}] ---- */
  MOD.stringboard=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var CA=cfg.causes||[], EF=cfg.effects||[]; S.strings=S.strings||[];
    var done=function(){ return CA.length>0&&CA.every(function(c){ return S.strings.indexOf(c.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-sboard');
    function cardH(x,side){ return '<div class="spk-scard '+side+'" data-id="'+esc(x.id)+'" role="button" tabindex="0"'+(side==='c'?' draggable="true"':'')+'><span class="pin" aria-hidden="true"></span><span class="ic" aria-hidden="true">'+(x.ico||'')+'</span><span class="tx">'+esc(x.t)+'</span></div>'; }
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'String Board')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-cork"><svg class="spk-strings" aria-hidden="true"></svg><div class="col"><div class="lab">'+esc(cfg.causeLabel||'Causes')+'</div>'+CA.map(function(c){ return cardH(c,'c'); }).join('')+'</div><div class="col"><div class="lab">'+esc(cfg.effectLabel||'Effects')+'</div>'+EF.map(function(f){ return cardH(f,'e'); }).join('')+'</div></div>'
      +'<p class="spk-miss"></p><p class="spk-claim-ct spk-sb-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var cork=g.querySelector('.spk-cork'), svg=g.querySelector('.spk-strings'), miss=g.querySelector('.spk-miss'), sel=null, fresh=null;
    function pinXY(cardEl){ var r=cork.getBoundingClientRect(), p=cardEl.querySelector('.pin').getBoundingClientRect(); return [p.left+p.width/2-r.left, p.top+p.height/2-r.top]; }
    function draw(){ if(!cork.offsetWidth) return; var r=cork.getBoundingClientRect(); svg.setAttribute('viewBox','0 0 '+r.width.toFixed(0)+' '+r.height.toFixed(0)); svg.setAttribute('width',r.width.toFixed(0)); svg.setAttribute('height',r.height.toFixed(0));
      svg.innerHTML=S.strings.map(function(id){ var c=find(CA,id); if(!c) return ''; var a=g.querySelector('.spk-scard.c[data-id="'+id+'"]'), b=g.querySelector('.spk-scard.e[data-id="'+c.effect+'"]'); if(!a||!b) return '';
        var p=pinXY(a), q=pinXY(b), mx=(p[0]+q[0])/2, my=Math.max(p[1],q[1])+14, d='M'+p[0].toFixed(1)+','+p[1].toFixed(1)+' Q'+mx.toFixed(1)+','+my.toFixed(1)+' '+q[0].toFixed(1)+','+q[1].toFixed(1);
        return '<path class="sh" d="'+d+'" transform="translate(1.5,2.5)"/><path class="st'+(fresh===id?' new':'')+'" d="'+d+'" pathLength="100"/>'; }).join(''); }
    function paint(){ g.querySelectorAll('.spk-scard').forEach(function(x){ var id=x.dataset.id, on=x.classList.contains('c')?S.strings.indexOf(id)>=0:CA.some(function(c){ return c.effect===id&&S.strings.indexOf(c.id)>=0; }); x.classList.toggle('tied',on); if(x.classList.contains('c')) x.draggable=!on; });
      var n=S.strings.length; g.querySelector('.spk-sb-ct').innerHTML=n<CA.length?'<b>'+n+' of '+CA.length+'</b> '+esc(cfg.countT||'strings tied.'):'';
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); draw(); }
    function arm(on){ g.querySelectorAll('.spk-scard.e').forEach(function(x){ x.classList.toggle('armed',on&&!x.classList.contains('tied')); x.classList.remove('over'); }); }
    function choose(c){ g.querySelectorAll('.spk-scard.c').forEach(function(x){ x.classList.remove('sel'); }); sel=c; if(c){ c.classList.add('sel'); miss.textContent=''; } arm(!!c); }
    function attempt(cEl,eEl){ if(!cEl||!eEl) return; var c=find(CA,cEl.dataset.id); if(!c||S.strings.indexOf(c.id)>=0) return;
      if(eEl.dataset.id===c.effect){ S.strings.push(c.id); fresh=c.id; save(); choose(null); sfx('pluck'); [cEl,eEl].forEach(function(x){ x.classList.remove('pop'); void x.offsetWidth; x.classList.add('pop'); }); paint(); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },500); setTimeout(function(){ fresh=null; },1200); }
      else { eEl.classList.add('shake'); setTimeout(function(){ eEl.classList.remove('shake'); },450); var m=(c.misses&&c.misses[eEl.dataset.id])||c.miss||''; miss.textContent=m; missBeat(m); } }
    g.addEventListener('click',function(e){ var x=e.target.closest('.spk-scard'); if(!x) return; ack('open');
      if(x.classList.contains('c')){ if(x.classList.contains('tied')) return; choose(x); return; }
      if(x.classList.contains('tied')) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a cause on the left first, then the effect it led to.'; return; } attempt(sel,x); });
    g.addEventListener('keydown',function(e){ var x=e.target.closest('.spk-scard'); if(x&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); x.click(); } });
    g.addEventListener('dragstart',function(e){ var x=e.target.closest('.spk-scard.c'); if(!x||!x.draggable){ e.preventDefault(); return; } ack('open'); choose(x); e.dataTransfer.setData('text/plain',x.dataset.id); e.dataTransfer.effectAllowed='link'; });
    g.addEventListener('dragend',function(){ arm(false); });
    g.addEventListener('dragover',function(e){ var x=e.target.closest('.spk-scard.e'); g.querySelectorAll('.spk-scard.e').forEach(function(y){ y.classList.toggle('over',y===x); }); if(x&&!x.classList.contains('tied')){ e.preventDefault(); e.dataTransfer.dropEffect='link'; } });
    g.addEventListener('drop',function(e){ var x=e.target.closest('.spk-scard.e'); if(!x) return; e.preventDefault(); attempt(sel,x); });
    if(window.ResizeObserver) new ResizeObserver(function(){ if(document.documentElement.classList.contains('spk-on')) draw(); }).observe(cork); else window.addEventListener('resize',draw);
    var tabBtn=document.getElementById('panel-scene'); if(tabBtn) new MutationObserver(function(){ if(document.documentElement.classList.contains('spk-on')) draw(); }).observe(tabBtn,{attributes:true,attributeFilter:['class']});
    paint(); setTimeout(draw,60);
    return {done:done, journal:function(e,NA){ var p=CA.filter(function(c){ return S.strings.indexOf(c.id)>=0; }); return p.length?'<p class="a">'+p.map(function(c){ return e(c.t)+' → '+e((find(EF,c.effect)||{}).t||''); }).join('<br>')+'</p>':NA; }};
  };

  /* ---- Explore reading · Ripples: a ship drops anchor off Florida's coast. Each tap on the water sends out a ring;
     each ring reaches a new effect on the map, and the lesson's own paragraph for it appears.
     DATA: paras [{id,match}], ship [lon,lat], rings [{label,ico,paras:[ids],show:[layer ids]}], layers {id:{kind,…}} ---- */
  MOD.ripples=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent)){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var RG=cfg.rings||[]; if(S.rip==null) S.rip=-1;
    var done=function(){ return RG.length>0&&S.rip>=RG.length-1; };
    function at(lon,lat){ return project(lon,lat).map(function(v){ return +v.toFixed(1); }); }
    var sh=at(cfg.ship[0],cfg.ship[1]), L=cfg.layers||{}, lay='';
    Object.keys(L).forEach(function(id){ var l=L[id], pts=(l.pts||(l.lon!=null?[[l.lon,l.lat]]:[])).map(function(p){ return at(p[0],p[1]); }), s='';
      if(l.kind==='fade') s=pts.map(function(q,k){ return '<circle class="vd" cx="'+q[0]+'" cy="'+q[1]+'" r="3.2" style="animation-delay:'+(k*.18).toFixed(2)+'s"/>'; }).join('');
      else if(l.kind==='cross') s=pts.map(function(q,k){ return '<g class="mx" style="animation-delay:'+(k*.15).toFixed(2)+'s" transform="translate('+q[0]+','+q[1]+')"><rect x="-1" y="-6" width="2" height="9" fill="#5C3A1A"/><rect x="-3.4" y="-3.8" width="6.8" height="1.8" fill="#5C3A1A"/></g>'; }).join('');
      else if(l.kind==='fire') s=pts.map(function(q){ return '<g class="fx" transform="translate('+q[0]+','+q[1]+')"><circle r="6" fill="#F28C28" opacity=".3"/><path d="M0,-7c2.4,3 4,4.6 2.4,7 c-.8,1.6 -4,1.6 -4.8,0 c-1.6,-2.4 .8,-4 2.4,-7z" fill="#E8542A"/></g>'; }).join('');
      else if(l.kind==='arrow'&&pts.length>1) s='<path class="ar" d="M'+pts[0][0]+','+pts[0][1]+' Q'+((pts[0][0]+pts[1][0])/2+(l.bend||0))+','+((pts[0][1]+pts[1][1])/2)+' '+pts[1][0]+','+pts[1][1]+'" marker-end="url(#spkRipAr)"/>';
      else if(l.kind==='star') s=pts.map(function(q){ return '<path class="stx" transform="translate('+q[0]+','+q[1]+')" d="M0,-6 L1.8,-1.9 6,-1.9 2.6,.8 3.8,5 0,2.5 -3.8,5 -2.6,.8 -6,-1.9 -1.8,-1.9Z"/>'; }).join('');
      else if(l.kind==='emoji') s=pts.map(function(q){ return '<text class="em" x="'+q[0]+'" y="'+(q[1]+4)+'" text-anchor="middle">'+esc(l.e||'•')+'</text>'; }).join('');
      else if(l.kind==='flag') s=poleFlag(l.flag,pts[0][0],pts[0][1],l.s||1.5).replace('spk-pf ','spk-pf on ');
      var tl=l.t?'<text class="lb" x="'+(l.tlon!=null?at(l.tlon,l.tlat)[0]:pts[0][0]+(l.dx||8))+'" y="'+(l.tlon!=null?at(l.tlon,l.tlat)[1]:pts[0][1]+(l.dy||3))+'" text-anchor="'+(l.a||'start')+'">'+esc(l.t)+'</text>':'';
      lay+='<g class="rl k-'+l.kind+'" data-l="'+id+'">'+s+tl+'</g>'; });
    var peoples=(cfg.peoples||[]).map(function(p){ var q=at(p.lon,p.lat); return '<text class="pp" x="'+q[0]+'" y="'+q[1]+'" text-anchor="'+(p.a||'middle')+'">'+esc(p.t)+'</text>'; }).join('');
    var rings=RG.map(function(r,i){ return '<circle class="rg" data-i="'+i+'" cx="'+sh[0]+'" cy="'+sh[1]+'" r="'+(r.r||(26+i*42))+'"/>'; }).join('');
    var ship='<g class="sp" transform="translate('+(sh[0]-11)+','+(sh[1]-15)+') scale(.45)">'+shipIcon(1,cfg.shipColor||FLAGCOL.es).replace(/<svg[^>]*>|<\/svg>/g,'')+'</g>';
    var svg='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.aria||'Map of Florida with rings spreading from a ship')+'"><defs><marker id="spkRipAr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#A3312B"/></marker><clipPath id="spkRipClip"><rect width="300" height="300"/></clipPath></defs>'+floridaBase('R')+'<g clip-path="url(#spkRipClip)">'+rings+'<circle class="wave" cx="'+sh[0]+'" cy="'+sh[1]+'" r="10"/></g>'+peoples+lay+ship+'<g class="tapme" transform="translate('+sh[0]+','+(sh[1]+16)+')"><circle r="7"/><text y="3" text-anchor="middle">👆</text></g></svg>';
    var wrap=el('div','spk spk-ripples');
    wrap.innerHTML='<div class="spk-rp-top"><div class="spk-map">'+svg+'</div><div class="spk-rp-side"><div class="lab">'+esc(cfg.label||'Send out the ripples')+'</div><ol class="spk-rp-list">'+RG.map(function(r,i){ return '<li data-i="'+i+'"><button type="button" disabled><span class="ic">'+(r.ico||'〰️')+'</span><span>'+esc(r.label)+'</span></button></li>'; }).join('')+'</ol><button type="button" class="spk-rp-go"></button><p class="spk-ys-ct spk-rp-ct"></p></div></div><div class="spk-rp-read"></div>';
    before(first,wrap);
    var read=wrap.querySelector('.spk-rp-read'), boxes={};
    PA.forEach(function(a){ var p=found[a.id]; if(!p) return; var b=el('div','spk-ys-p spk-rp-p'); boxes[a.id]=b; read.appendChild(b); move(p,function(n){ b.appendChild(n); }); });
    var view=S.rip;
    function paint(anim){ var r=RG[view];
      var shown={}; for(var i=0;i<=S.rip;i++) (RG[i].show||[]).forEach(function(id){ shown[id]=true; });
      wrap.querySelectorAll('.rl').forEach(function(l){ l.classList.toggle('on',!!shown[l.dataset.l]); l.classList.toggle('now',!!r&&(r.show||[]).indexOf(l.dataset.l)>=0); });
      wrap.querySelectorAll('.rg').forEach(function(c){ var i=+c.dataset.i; c.classList.toggle('on',i<=S.rip); if(anim&&i===S.rip){ c.classList.remove('go'); void c.getBoundingClientRect(); c.classList.add('go'); } });
      Object.keys(boxes).forEach(function(id){ var on=!!r&&(r.paras||[]).indexOf(id)>=0; boxes[id].classList.toggle('on',on); if(on&&anim){ boxes[id].classList.remove('pop'); void boxes[id].offsetWidth; boxes[id].classList.add('pop'); } });
      wrap.querySelectorAll('.spk-rp-list li').forEach(function(li){ var i=+li.dataset.i, b=li.querySelector('button'); b.disabled=i>S.rip; li.classList.toggle('seen',i<=S.rip); li.classList.toggle('now',i===view); });
      var go=wrap.querySelector('.spk-rp-go'), nx=RG[S.rip+1]; go.classList.toggle('spk-hide',!nx); if(nx) go.textContent=(S.rip<0?(cfg.startBtn||'Drop the anchor'):(cfg.nextBtn||'Send the next ripple'))+' → '+nx.label;
      wrap.classList.toggle('started',S.rip>=0); wrap.classList.toggle('all',done());
      var n=S.rip+1; wrap.querySelector('.spk-rp-ct').innerHTML=S.rip<0?esc(cfg.startT||'Tap the ship to drop its anchor.'):(n<RG.length?'<b>'+n+' of '+RG.length+'</b> '+esc(cfg.countT||'ripples sent. Read this part, then send the next one.'):'<b>'+esc(cfg.allT||'Every ripple reached the shore.')+'</b>');
      var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function next(){ if(S.rip>=RG.length-1) return; S.rip++; view=S.rip; save(); sfx('plop'); paint(true); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },600); }
    wrap.querySelector('.spk-map').addEventListener('click',function(e){ if(e.target.closest('.sp,.tapme,.wave,.rg')||S.rip<0) next(); });
    wrap.querySelector('.spk-rp-go').addEventListener('click',function(){ ack('explore'); next(); var t=read.getBoundingClientRect(); if(t.top>window.innerHeight*.8) read.scrollIntoView({behavior:'smooth',block:'nearest'}); });
    wrap.querySelector('.spk-rp-list').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b||b.disabled) return; view=+b.closest('li').dataset.i; paint(true); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(e){ return '<p class="a">Ripples sent: '+(S.rip+1)+' of '+RG.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Says / Infer / Ask: tap the numbered labels on the source (DATA.source.hotspots), then sort
     each statement into what the source SAYS, what we can INFER from it, and what we still have to ASK.
     DATA: bins [{id,ico,t,sub}], cards [{t,bin,why,miss}] ---- */
  MOD.sayinfer=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var BI=cfg.bins||[], CD=cfg.cards||[]; S.sort=S.sort||{};
    var sorted=function(){ return CD.length>0&&CD.every(function(c,i){ return S.sort[i]===c.bin; }); };
    var done=function(){ return sorted()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-sayinfer');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Says · Infer · Ask')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-sicards spk-chips"></div><p class="spk-miss"></p>'
      +'<div class="spk-trays">'+BI.map(function(b){ return '<div class="spk-tray" data-b="'+esc(b.id)+'" role="button" tabindex="0"><div class="hd"><span class="ic" aria-hidden="true">'+(b.ico||'')+'</span><div><b>'+esc(b.t)+'</b><small>'+esc(b.sub||'')+'</small></div></div><div class="in"></div><span class="ink" aria-hidden="true">'+esc(b.ink||b.t)+'</span></div>'; }).join('')+'</div>'
      +'<p class="spk-claim-ct spk-si-ct"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var tray=g.querySelector('.spk-sicards'), miss=g.querySelector('.spk-miss'), sel=null;
    shuffle(CD.map(function(c,i){ return i; })).forEach(function(i){ var c=el('div','spk-chip noimg spk-sicard','<span class="ico">🗒️</span><span>'+esc(CD[i].t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=i; tray.appendChild(c); });
    function paint(stampB){ var n=0;
      g.querySelectorAll('.spk-tray').forEach(function(t){ var b=t.dataset.b, inn=t.querySelector('.in'); var have=CD.map(function(c,i){ return i; }).filter(function(i){ return S.sort[i]===b; });
        inn.innerHTML=have.map(function(i){ return '<div class="put"><span>'+esc(CD[i].t)+'</span>'+(CD[i].why?'<small>'+esc(CD[i].why)+'</small>':'')+'</div>'; }).join(''); t.classList.toggle('has',have.length>0);
        if(stampB===b){ t.classList.remove('stamp'); void t.offsetWidth; t.classList.add('stamp'); } });
      tray.querySelectorAll('.spk-sicard').forEach(function(c){ var p=S.sort[+c.dataset.i]!=null; c.classList.toggle('spk-hide',p); c.draggable=!p; if(p) n++; });
      g.querySelector('.spk-si-ct').innerHTML=n<CD.length?'<b>'+n+' of '+CD.length+'</b> '+esc(cfg.countT||'cards sorted.'):'';
      var gate=''; if(sorted()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the baptism book above.'; else if(sorted()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish the ripples in Learn the Story.';
      g.querySelector('.spk-si-gate').textContent=gate;
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function arm(on){ g.querySelectorAll('.spk-tray').forEach(function(t){ t.classList.toggle('armed',on); t.classList.remove('over'); }); }
    function attempt(c,t){ if(!c||!t) return; var i=+c.dataset.i, card=CD[i]; if(S.sort[i]!=null) return; arm(false);
      if(t.dataset.b===card.bin){ S.sort[i]=card.bin; save(); sel=null; miss.textContent=''; sfx('thud'); paint(card.bin); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },400); }
      else { c.classList.add('shake'); setTimeout(function(){ c.classList.remove('shake'); },450); var m=(card.misses&&card.misses[t.dataset.b])||card.miss||''; miss.textContent=m; missBeat(m); } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-sicard'); if(!c) return; ack('explore'); tray.querySelectorAll('.spk-sicard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-sicard'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-sicard'); if(!c||!c.draggable){ e.preventDefault(); return; } sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); });
    var trays=g.querySelector('.spk-trays');
    trays.addEventListener('click',function(e){ var t=e.target.closest('.spk-tray'); if(!t) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a card first, then the tray it belongs in.'; return; } attempt(sel,t); });
    trays.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-tray'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    trays.addEventListener('dragover',function(e){ var t=e.target.closest('.spk-tray'); g.querySelectorAll('.spk-tray').forEach(function(x){ x.classList.toggle('over',x===t); }); if(t){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    trays.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-tray')); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var out=BI.map(function(b){ var have=CD.filter(function(c,i){ return S.sort[i]===b.id; }); return have.length?'<b>'+e(b.t)+':</b> '+have.map(function(c){ return e(c.t); }).join(' · '):''; }).filter(Boolean); return out.length?'<p class="a">'+out.join('<br>')+'</p>':NA; }};
  };

  /* ---- Planner · Cause → effect chain: four links (a cause, an effect, a detail from the source, the Virtue Lens).
     Each link clinks shut when it's filled. Notes only — the student writes. DATA: links [{id,lab,ico,opts:[{id,t}]}] ---- */
  MOD.chain=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var LK=cfg.links||[]; S.chain=S.chain||{}; var was={};
    var done=function(){ return LK.length>0&&LK.every(function(l){ return !!S.chain[l.id]; }); };
    var b=el('div','spk spk-builder spk-chainb');
    var ring='<svg class="lk" viewBox="0 0 64 40" aria-hidden="true"><rect class="o" x="5" y="5" width="54" height="30" rx="15"/><rect class="i" x="14" y="13" width="36" height="14" rx="7"/><path class="gap" d="M27,4 h10 M27,36 h10"/></svg>';
    b.innerHTML=voice(cfg.voice,cfg)+'<div class="spk-chainrow">'+LK.map(function(l,i){ return (i?'<span class="cn" aria-hidden="true"></span>':'')+'<div class="spk-link2" data-l="'+esc(l.id)+'">'+ring+'<span class="ic">'+(l.ico||'')+'</span><span class="nm">'+esc(l.lab)+'</span></div>'; }).join('')+'</div>'
      +LK.map(function(l,i){ return '<div class="spk-step" data-l="'+esc(l.id)+'"><div class="lab">'+(i+1)+' · '+esc(l.q||l.lab)+'</div><div class="spk-opts">'+(l.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join('')
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Every link is shut. Now write your Source Study in Step 3.')+'</p><div class="spk-plan"></div>';
    function lines(){ return LK.filter(function(l){ return S.chain[l.id]; }).map(function(l){ return [l.lab,(find(l.opts,S.chain[l.id])||{}).t||'']; }); }
    function paint(){ LK.forEach(function(l){ var v=S.chain[l.id], lk=b.querySelector('.spk-link2[data-l="'+l.id+'"]');
        b.querySelectorAll('.spk-step[data-l="'+l.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===v); });
        lk.classList.toggle('shut',!!v); if(v&&was[l.id]===false){ lk.classList.add('clink'); sfx('clink'); setTimeout(function(){ lk.classList.remove('clink'); },600); } was[l.id]=!!v; });
      var all=done(); if(all&&was.all===false) setTimeout(function(){ sfx('win'); },250); was.all=all; b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var id=o.closest('.spk-step').dataset.l; S.chain[id]=o.dataset.v; save(); paint(); });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Plant the field: tap each furrow to plant a word — it sprouts and the teacher says it
     (g4ss-<lesson>-seed-<n>.mp3 when it exists). Then water each sprout with its meaning and it grows tall. ---- */
  MOD.plantfield=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.field=S.field||{planted:[],grown:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.field.grown.length===W.length; };
    var g=el('div','spk spk-field');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Plant the Field')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-farm"><div class="sun" aria-hidden="true"></div><div class="sign"><b>'+esc(cfg.root||'col')+'</b> '+esc(cfg.rootMeaning||'')+'</div><div class="rows">'+W.map(function(x,i){ return '<div class="plot" data-i="'+i+'" role="button" tabindex="0" aria-label="Plant '+esc(x.w)+'"><span class="seed" aria-hidden="true">🌰</span><span class="crop" aria-hidden="true"><span class="stem"></span><span class="fruit">'+(x.crop||'🌱')+'</span></span><span class="soil" aria-hidden="true"></span><span class="word">'+(x.root?esc(x.w).replace(esc(x.root),'<b>'+esc(x.root)+'</b>'):esc(x.w))+'</span><span class="mean"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-fd-ct"></p><div class="spk-chips spk-cans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var cans=g.querySelector('.spk-cans'), miss=g.querySelector('.spk-miss'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-seed-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-can','<span class="ico">💧</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; cans.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allP=S.field.planted.length===W.length;
      g.querySelectorAll('.plot').forEach(function(b){ var i=+b.dataset.i, p=S.field.planted.indexOf(i)>=0, gr=S.field.grown.indexOf(i)>=0; b.classList.toggle('planted',p); b.classList.toggle('grown',gr); b.querySelector('.mean').textContent=gr?W[i].m:'';
        if(anim===i){ b.classList.remove('sprout','bloom'); void b.offsetWidth; b.classList.add(gr?'bloom':'sprout'); } });
      cans.classList.toggle('wait',!allP); cans.querySelectorAll('.spk-can').forEach(function(t){ var f=S.field.grown.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allP&&!f; });
      g.querySelector('.spk-fd-ct').innerHTML=!allP?'<b>'+S.field.planted.length+' of '+W.length+'</b> '+esc(cfg.plantT||'seeds planted. Tap each row to plant its word and hear it.'):(done()?'':'<b>'+S.field.grown.length+' of '+W.length+'</b> '+esc(cfg.waterT||'plants watered. Pour each meaning on its word.'));
      g.classList.toggle('done',done()); if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.plot').forEach(function(b){ b.classList.toggle('armed',on&&!b.classList.contains('grown')); b.classList.remove('over'); }); }
    function attempt(t,b){ if(!t||!b) return; var i=+t.dataset.i; if(S.field.grown.indexOf(i)>=0||S.field.planted.length<W.length) return; arm(false);
      if(+b.dataset.i===i){ S.field.grown.push(i); save(); sel=null; miss.textContent=''; sfx('water'); paint(i); if(done()) setTimeout(function(){ sfx('win'); },500); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    var rows=g.querySelector('.rows');
    rows.addEventListener('click',function(e){ var b=e.target.closest('.plot'); if(!b) return; var i=+b.dataset.i;
      if(sel&&S.field.planted.length===W.length){ attempt(sel,b); return; }
      var first=S.field.planted.indexOf(i)<0; if(first){ S.field.planted.push(i); save(); sfx('plant'); } say(i); paint(first?i:null); });
    rows.addEventListener('keydown',function(e){ var b=e.target.closest('.plot'); if(b&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); b.click(); } });
    cans.addEventListener('click',function(e){ var t=e.target.closest('.spk-can'); if(!t) return; if(S.field.planted.length<W.length){ miss.textContent=cfg.plantFirstT||'Plant every row first, so you hear each word.'; return; } cans.querySelectorAll('.spk-can').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    cans.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-can'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    cans.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-can'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    cans.addEventListener('dragend',function(){ arm(false); });
    rows.addEventListener('dragover',function(e){ var b=e.target.closest('.plot'); g.querySelectorAll('.plot').forEach(function(x){ x.classList.toggle('over',x===b); }); if(b&&!b.classList.contains('grown')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    rows.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.plot')); });
    paint(); return {done:done};
  };

  /* ---- Scene 1 · File drawers (4.05.01): a filing cabinet with one drawer per file group. Tap (or drag) an evidence
     card and the drawers slide open; tap a drawer and the card drops in. A full drawer thuds shut and gets a ✓.
     DATA: drawers [{id,ico,label,sub,color}], cards [{t,d,miss:{drawerId:hint}}] ---- */
  MOD.drawers=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var DR=cfg.drawers||[], CD=cfg.cards||[]; S.filed=S.filed||[];
    var done=function(){ return CD.length>0&&CD.every(function(c,i){ return S.filed.indexOf(i)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-drawers');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'File Drawers')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-chips spk-drcards"></div><p class="spk-miss"></p>'
      +'<div class="spk-cabinet2"><div class="top" aria-hidden="true"></div>'+DR.map(function(d){ return '<div class="spk-dr" data-d="'+esc(d.id)+'" role="button" tabindex="0" style="--c:'+(d.color||'#1A8A7D')+'" aria-label="'+esc(d.label)+' drawer"><div class="tray"><ul class="in"></ul></div><div class="front"><span class="tag"><span class="ic" aria-hidden="true">'+(d.ico||'')+'</span><span><b>'+esc(d.label)+'</b><small>'+esc(d.sub||'')+'</small></span></span><span class="pull" aria-hidden="true"></span><span class="ct"></span><span class="ok" aria-hidden="true">✓ Filed</span></div></div>'; }).join('')+'<div class="feet" aria-hidden="true"></div></div>'
      +'<p class="spk-bell-ct spk-dr-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    var chips=g.querySelector('.spk-drcards'), miss=g.querySelector('.spk-miss'), sel=null, was={};
    shuffle(CD.map(function(c,i){ return i; })).forEach(function(i){ var c=el('div','spk-chip noimg spk-drcard','<span class="ico">🗂️</span><span>'+esc(CD[i].t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=i; chips.appendChild(c); });
    function paint(drop){ DR.forEach(function(d){ var dr=g.querySelector('.spk-dr[data-d="'+d.id+'"]'), mine=CD.map(function(c,i){ return i; }).filter(function(i){ return CD[i].d===d.id&&S.filed.indexOf(i)>=0; }), all=CD.filter(function(c){ return c.d===d.id; }).length, full=all>0&&mine.length===all;
        dr.querySelector('.ct').textContent=mine.length+' of '+all; dr.querySelector('.in').innerHTML=mine.map(function(i){ return '<li'+(drop===i?' class="new"':'')+'>'+esc(CD[i].t)+'</li>'; }).join('');
        dr.classList.toggle('full',full); if(full&&was[d.id]===false){ dr.classList.add('shut'); setTimeout(function(){ dr.classList.remove('shut'); },700); setTimeout(function(){ sfx('thud'); },220); } was[d.id]=full; });
      chips.querySelectorAll('.spk-drcard').forEach(function(c){ var on=S.filed.indexOf(+c.dataset.i)>=0; c.classList.toggle('spk-hide',on); c.draggable=!on; });
      var n=S.filed.length; g.querySelector('.spk-dr-ct').innerHTML=done()?'':'<b>'+n+' of '+CD.length+'</b> '+esc(cfg.countT||'cards filed.');
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function arm(on){ g.querySelectorAll('.spk-dr').forEach(function(d){ d.classList.toggle('armed',on&&!d.classList.contains('full')); d.classList.remove('over'); }); if(on) sfx('slide'); }
    function attempt(chip,dr){ if(!chip||!dr) return; var i=+chip.dataset.i; if(S.filed.indexOf(i)>=0) return; arm(false);
      if(CD[i].d===dr.dataset.d){ S.filed.push(i); save(); sel=null; miss.textContent=''; sfx('thud'); paint(i); dr.classList.add('peek'); clearTimeout(dr.__pk); dr.__pk=setTimeout(function(){ dr.classList.remove('peek'); },1600); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },700); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=(CD[i].miss&&CD[i].miss[dr.dataset.d])||CD[i].hint||''; miss.textContent=m; missBeat(m); } }
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-drcard'); if(!c) return; ack('open'); chips.querySelectorAll('.spk-drcard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-drcard'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-drcard'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    var cab=g.querySelector('.spk-cabinet2');
    cab.addEventListener('click',function(e){ var d=e.target.closest('.spk-dr'); if(!d) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a card first, then the drawer it belongs in.'; return; } attempt(sel,d); });
    cab.addEventListener('keydown',function(e){ var d=e.target.closest('.spk-dr'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); d.click(); } });
    cab.addEventListener('dragover',function(e){ var d=e.target.closest('.spk-dr'); g.querySelectorAll('.spk-dr').forEach(function(x){ x.classList.toggle('over',x===d); }); if(d){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    cab.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-dr')); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ return DR.map(function(d){ var it=CD.filter(function(c,i){ return c.d===d.id&&S.filed.indexOf(i)>=0; }); return it.length?'<p class="a"><b>'+e(d.label)+'</b>: '+e(it.map(function(c){ return c.t; }).join(' · '))+'</p>':''; }).join('')||NA; }};
  };

  /* ---- Explore reading · Build the map (4.05.01): one real Florida map. Each tap adds the next layer
     (land and water → the First Peoples → the Europeans → contact), and the lesson's own paragraph for it appears.
     DATA: paras [{id,match}], steps [{label,ico,paras:[ids],show:[layer ids]}], layers {id:{kind,…}}
     kinds: spring · emoji · names · ship · flag · fade · text ---- */
  function lmLayer(l,at){ var pts=(l.pts||(l.lon!=null?[[l.lon,l.lat]]:[])).map(function(p){ return at(p[0],p[1]); }), s='';
    if(l.kind==='spring') s=pts.map(function(q,k){ return '<g class="sg" transform="translate('+q[0]+','+q[1]+')"><circle class="rp" r="3" style="animation-delay:'+(k*.4).toFixed(1)+'s"/><circle r="2.6" fill="#2F9BD0" stroke="#FFFDF5" stroke-width=".8"/></g>'; }).join('');
    else if(l.kind==='emoji') s=pts.map(function(q,k){ return '<text class="em" x="'+q[0]+'" y="'+(q[1]+4)+'" text-anchor="middle" style="animation-delay:'+(k*.12).toFixed(2)+'s">'+esc(l.e||'•')+'</text>'; }).join('');
    else if(l.kind==='names') s=(l.items||[]).map(function(p,k){ var q=at(p.lon,p.lat); return '<g class="nm" style="animation-delay:'+(k*.15).toFixed(2)+'s"><circle cx="'+q[0]+'" cy="'+q[1]+'" r="2.4" fill="#6B4A2A"/><text x="'+(q[0]+(p.a==='end'?-4:p.a==='middle'?0:4))+'" y="'+(q[1]+(p.dy!=null?p.dy:3))+'" text-anchor="'+(p.a||'start')+'">'+esc(p.t)+'</text></g>'; }).join('');
    else if(l.kind==='ship') s=pts.map(function(q){ return '<g class="shp" transform="translate('+(q[0]-9)+','+(q[1]-12)+') scale(.36)">'+shipIcon(1,l.color||FLAGCOL.es).replace(/<svg[^>]*>|<\/svg>/g,'')+'</g>'; }).join('');
    else if(l.kind==='flag') s=poleFlag(l.flag,pts[0][0],pts[0][1],l.s||1.4).replace('spk-pf ','spk-pf on ');
    else if(l.kind==='fade') s=pts.map(function(q,k){ return '<circle class="vd" cx="'+q[0]+'" cy="'+q[1]+'" r="3.2" style="animation-delay:'+(k*.18).toFixed(2)+'s"/>'; }).join('');
    var tl=l.t?'<text class="lb" x="'+(l.tlon!=null?at(l.tlon,l.tlat)[0]:(pts[0]?pts[0][0]:0)+(l.dx||8))+'" y="'+(l.tlon!=null?at(l.tlon,l.tlat)[1]:(pts[0]?pts[0][1]:0)+(l.dy||3))+'" text-anchor="'+(l.a||'start')+'"'+(l.rot&&l.tlon!=null?' transform="rotate('+l.rot+' '+at(l.tlon,l.tlat).join(' ')+')"':'')+'>'+esc(l.t)+'</text>':'';
    return s+tl; }
  MOD.layermap=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.steps||[]; if(S.lm==null) S.lm=-1;
    var done=function(){ return ST.length>0&&S.lm>=ST.length-1; };
    function at(lon,lat){ return project(lon,lat).map(function(v){ return +v.toFixed(1); }); }
    var L=cfg.layers||{}, lay='';
    Object.keys(L).forEach(function(id){ lay+='<g class="ml k-'+L[id].kind+'" data-l="'+id+'">'+lmLayer(L[id],at)+'</g>'; });
    var svg='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.aria||'Map of Florida that builds up one layer at a time')+'">'+floridaBase('M')+lay+'<g class="tapme" transform="translate(150,150)"><circle r="9"/><text y="4" text-anchor="middle">👆</text></g></svg>';
    var wrap=el('div','spk spk-layermap');
    wrap.innerHTML='<div class="spk-rp-top"><div class="spk-map">'+svg+'</div><div class="spk-rp-side"><div class="lab">'+esc(cfg.label||'Build the map')+'</div><ol class="spk-rp-list">'+ST.map(function(r,i){ return '<li data-i="'+i+'"><button type="button" disabled><span class="ic">'+(r.ico||'•')+'</span><span>'+esc(r.label)+'</span></button></li>'; }).join('')+'</ol><button type="button" class="spk-rp-go spk-lm-go"></button><p class="spk-ys-ct spk-lm-ct"></p></div></div><div class="spk-rp-read"></div>';
    before(first,wrap);
    var read=wrap.querySelector('.spk-rp-read'), boxes={};
    PA.forEach(function(a){ var p=found[a.id]; if(!p) return; var b=el('div','spk-ys-p spk-lm-p'); boxes[a.id]=b; read.appendChild(b); move(p,function(n){ b.appendChild(n); }); });
    var view=S.lm;
    function paint(anim){ var r=ST[view], shown={}, nowL={};
      for(var i=0;i<=S.lm;i++) (ST[i].show||[]).forEach(function(id){ shown[id]=true; }); if(r) (r.show||[]).forEach(function(id){ nowL[id]=true; });
      wrap.querySelectorAll('.ml').forEach(function(l){ var id=l.dataset.l; l.classList.toggle('on',!!shown[id]); l.classList.toggle('now',!!nowL[id]); if(anim&&nowL[id]){ l.classList.remove('pop'); void l.getBoundingClientRect(); l.classList.add('pop'); } });
      Object.keys(boxes).forEach(function(id){ var on=!!r&&(r.paras||[]).indexOf(id)>=0; boxes[id].classList.toggle('on',on); if(on&&anim){ boxes[id].classList.remove('pop'); void boxes[id].offsetWidth; boxes[id].classList.add('pop'); } });
      wrap.querySelectorAll('.spk-rp-list li').forEach(function(li){ var i=+li.dataset.i, b=li.querySelector('button'); b.disabled=i>S.lm; li.classList.toggle('seen',i<=S.lm); li.classList.toggle('now',i===view); });
      var go=wrap.querySelector('.spk-lm-go'), nx=ST[S.lm+1]; go.classList.toggle('spk-hide',!nx); if(nx) go.textContent=(cfg.nextBtn||'Add the next layer')+' → '+nx.label;
      wrap.classList.toggle('started',S.lm>=0); wrap.classList.toggle('all',done());
      var n=S.lm+1; wrap.querySelector('.spk-lm-ct').innerHTML=S.lm<0?esc(cfg.startT||'Tap the map or the button to lay down the first layer.'):(n<ST.length?'<b>'+n+' of '+ST.length+'</b> '+esc(cfg.countT||'layers on the map. Read this part, then add the next one.'):'<b>'+esc(cfg.allT||'Every layer is on the map.')+'</b>');
      var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function next(){ if(S.lm>=ST.length-1) return; S.lm++; view=S.lm; save(); sfx('paper'); paint(true); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },600); }
    wrap.querySelector('.spk-map').addEventListener('click',function(){ if(S.lm<0){ ack('explore'); next(); } });
    wrap.querySelector('.spk-lm-go').addEventListener('click',function(){ ack('explore'); next(); var t=read.getBoundingClientRect(); if(t.top>window.innerHeight*.8) read.scrollIntoView({behavior:'smooth',block:'nearest'}); });
    wrap.querySelector('.spk-rp-list').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b||b.disabled) return; view=+b.closest('li').dataset.i; paint(true); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(e){ return '<p class="a">Map layers added: '+(S.lm+1)+' of '+ST.length+'.</p>'; }};
  };

  /* ---- Planner · Bridge builder (4.05.01): pick three cards (they become the bridge's stone posts), one detail from
     each, then lay a plank between each pair with a connecting word. Notes only — the student writes.
     DATA: cards [{id,ico,lab,opts:[{id,t}]}], words [..], pick (default 3) ---- */
  MOD.bridge=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var CA=cfg.cards||[], WD=cfg.words||['because','so','even though','this meant'], NP=cfg.pick||3;
    S.br=S.br||{cards:[],det:{},plank:{}}; var was={};
    function chosen(){ return CA.filter(function(c){ return S.br.cards.indexOf(c.id)>=0; }); }
    function gaps(){ var c=chosen(); var out=[]; for(var i=0;i+1<c.length;i++) out.push(c[i].id+'>'+c[i+1].id); return out; }
    var done=function(){ var c=chosen(); return c.length===NP&&c.every(function(x){ return !!S.br.det[x.id]; })&&gaps().every(function(k){ return !!S.br.plank[k]; }); };
    var b=el('div','spk spk-builder spk-bridgeb');
    b.innerHTML=voice(cfg.voice,cfg)+'<div class="spk-bridge"><svg viewBox="0 0 600 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><linearGradient id="spkBrW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FC3DA"/><stop offset="1" stop-color="#2F86B0"/></linearGradient></defs><rect x="0" y="104" width="600" height="46" fill="url(#spkBrW)"/><path class="wv" d="M0,112 q15,-6 30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0" fill="none" stroke="#E8F6FB" stroke-width="1.4" opacity=".7"/><path d="M0,104 L40,92 L40,150 L0,150Z M600,104 L560,92 L560,150 L600,150Z" fill="#B7A46A"/><g class="posts"></g><g class="planks"></g></svg><div class="labs"></div></div>'
      +'<div class="spk-step" data-k="cards"><div class="lab">1 · '+esc(cfg.q1||'Pick three cards from the Evidence Wall')+'</div><div class="spk-opts">'+CA.map(function(c){ return '<button type="button" class="spk-opt" data-c="'+esc(c.id)+'">'+(c.ico||'')+' '+esc(c.lab)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step" data-k="det"><div class="lab">2 · '+esc(cfg.q2||'Pick one detail from each card')+'</div><div class="dets"></div></div>'
      +'<div class="spk-step" data-k="plank"><div class="lab">3 · '+esc(cfg.q3||'Lay a plank: pick a connecting word for each gap')+'</div><div class="pls"></div></div>'
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'The bridge holds. Now write your synthesis entry in Step 3.')+'</p><div class="spk-plan"></div>';
    var X=[120,300,480];
    function lines(){ var c=chosen(), out=[]; c.forEach(function(x,i){ var d=find(x.opts,S.br.det[x.id]); out.push([x.lab,d?d.t:'(pick a detail)']); if(i+1<c.length){ var w=S.br.plank[x.id+'>'+c[i+1].id]; if(w) out.push(['Connect',w]); } }); return out; }
    function paint(){ var c=chosen();
      b.querySelectorAll('[data-k="cards"] .spk-opt').forEach(function(o){ var on=S.br.cards.indexOf(o.dataset.c)>=0; o.classList.toggle('on',on); o.disabled=!on&&S.br.cards.length>=NP; });
      b.querySelector('.dets').innerHTML=c.length?c.map(function(x){ return '<div class="spk-brdet" data-c="'+esc(x.id)+'"><div class="k">'+(x.ico||'')+' '+esc(x.lab)+'</div><div class="spk-opts">'+(x.opts||[]).map(function(o){ return '<button type="button" class="spk-opt'+(S.br.det[x.id]===o.id?' on':'')+'" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join(''):'<p class="spk-brwait">'+esc(cfg.waitT||'Pick your three cards first.')+'</p>';
      var G=gaps(); b.querySelector('.pls').innerHTML=c.length===NP?G.map(function(k){ var p=k.split('>'), a=find(CA,p[0]), z=find(CA,p[1]); return '<div class="spk-brpl" data-g="'+esc(k)+'"><div class="k">'+esc(a.lab)+' → '+esc(z.lab)+'</div><div class="spk-opts">'+WD.map(function(w){ return '<button type="button" class="spk-opt'+(S.br.plank[k]===w?' on':'')+'" data-w="'+esc(w)+'">'+esc(w)+'</button>'; }).join('')+'</div></div>'; }).join(''):'<p class="spk-brwait">'+esc(cfg.wait3T||'The planks come after your three cards.')+'</p>';
      var posts='', planks='', labs='';
      for(var i=0;i<NP;i++){ var x=c[i], has=!!x, det=has&&!!S.br.det[x.id];
        posts+='<g class="post'+(has?' up':'')+(det?' set':'')+'" transform="translate('+X[i]+',0)"><rect x="-26" y="70" width="52" height="80" rx="4"/><rect class="cap" x="-32" y="62" width="64" height="12" rx="3"/><text x="0" y="104" text-anchor="middle">'+(has?(x.ico||''):'')+'</text></g>';
        labs+='<span style="left:'+(X[i]/6)+'%">'+(has?esc(x.lab):'')+'</span>';
        if(i+1<NP){ var k=has&&c[i+1]?x.id+'>'+c[i+1].id:null, w=k&&S.br.plank[k]; planks+='<g class="plank'+(w?' on':'')+(w&&was[k]===false?' drop':'')+'"><rect x="'+(X[i]+30)+'" y="58" width="'+(X[i+1]-X[i]-60)+'" height="9" rx="2"/><text x="'+((X[i]+X[i+1])/2)+'" y="52" text-anchor="middle">'+(w?esc(w):'')+'</text></g>'; if(k){ if(w&&was[k]===false) sfx('thud'); was[k]=!!w; } } }
      b.querySelector('.posts').innerHTML=posts; b.querySelector('.planks').innerHTML=planks; b.querySelector('.labs').innerHTML=labs;
      var all=done(); if(all&&was.all===false) setTimeout(function(){ sfx('win'); },300); was.all=all; b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o||o.disabled) return; var st=o.closest('.spk-step').dataset.k;
      if(st==='cards'){ var id=o.dataset.c, i=S.br.cards.indexOf(id); if(i>=0){ S.br.cards.splice(i,1); delete S.br.det[id]; } else if(S.br.cards.length<NP){ S.br.cards.push(id); sfx('click'); }
        S.br.cards=CA.map(function(c){ return c.id; }).filter(function(c){ return S.br.cards.indexOf(c)>=0; });
        var keep={}; gaps().forEach(function(k){ if(S.br.plank[k]) keep[k]=S.br.plank[k]; }); S.br.plank=keep; }
      else if(st==='det'){ S.br.det[o.closest('.spk-brdet').dataset.c]=o.dataset.v; sfx('click'); }
      else if(st==='plank'){ var k=o.closest('.spk-brpl').dataset.g; if(!(k in was)) was[k]=false; S.br.plank[k]=o.dataset.w; }
      save(); paint(); });
    before(partB,b); was.all=done(); gaps().forEach(function(k){ was[k]=!!S.br.plank[k]; }); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Chord (4.05.01, syn/sym = together): each word is a note on the staff. Tap a word to hear it
     (g4ss-<lesson>-chord-<n>.mp3 when it exists) and its note plays. Then match each meaning to its word: the note
     fills in. When all four are matched, the notes slide together into one chord and play at the same time. ---- */
  MOD.chord=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.chord=S.chord||{heard:[],matched:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var HZ=cfg.notes||[261.63,329.63,392.0,523.25], NY=[110,96,82,61];
    var done=function(){ return W.length>0&&S.chord.matched.length===W.length; };
    var g=el('div','spk spk-chord');
    var staff=''; for(var s=0;s<5;s++) staff+='<line x1="10" x2="430" y1="'+(40+s*14)+'" y2="'+(40+s*14)+'"/>';
    var notes=W.map(function(x,i){ var cx=110+i*85; return '<g class="nt" data-i="'+i+'" style="--x:'+cx+'px;--dx:'+(330-cx)+'px"><g class="mv"><g transform="rotate(-20 '+cx+' '+NY[i]+')"><ellipse cx="'+cx+'" cy="'+NY[i]+'" rx="9" ry="6.5"/></g>'+(NY[i]>=110?'<line class="ledger" x1="'+(cx-14)+'" x2="'+(cx+14)+'" y1="'+NY[i]+'" y2="'+NY[i]+'"/>':'')+'<text x="'+cx+'" y="136" text-anchor="middle">'+esc(x.w)+'</text></g></g>'; }).join('');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Play the Chord')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-staff"><svg viewBox="0 0 440 142" aria-hidden="true"><g class="ln">'+staff+'</g><text class="clef" x="16" y="88">𝄞</text>'+notes+'<g class="glow"><circle cx="330" cy="86" r="42"/></g></svg></div>'
      +'<div class="spk-chwords">'+W.map(function(x,i){ return '<div class="spk-chw" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(esc(x.root),'<b>'+esc(x.root)+'</b>'):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-ch-ct"></p><div class="spk-chips spk-chmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-chmeans'), miss=g.querySelector('.spk-miss'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-chord-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-chmean','<span class="ico">🎵</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function note(f,d,v){ if(QUIET) v=(v||.12)*.6; try{ ACtx=ACtx||new (window.AudioContext||window.webkitAudioContext)(); var t=ACtx.currentTime; [[1,'triangle',v||.12],[2,'sine',(v||.12)*.25]].forEach(function(h){ var o=ACtx.createOscillator(), gn=ACtx.createGain(); o.type=h[1]; o.frequency.value=f*h[0]; gn.gain.setValueAtTime(0.0001,t); gn.gain.exponentialRampToValueAtTime(h[2],t+0.02); gn.gain.exponentialRampToValueAtTime(0.0001,t+(d||1.4)); o.connect(gn); gn.connect(ACtx.destination); o.start(t); o.stop(t+(d||1.4)+0.05); }); }catch(e){} }
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.chord.heard.length===W.length;
      g.querySelectorAll('.spk-chw').forEach(function(b){ var i=+b.dataset.i, h=S.chord.heard.indexOf(i)>=0, m=S.chord.matched.indexOf(i)>=0; b.classList.toggle('heard',h); b.classList.toggle('matched',m); b.querySelector('.m').textContent=m?W[i].m:''; });
      g.querySelectorAll('.nt').forEach(function(n){ var i=+n.dataset.i; n.classList.toggle('heard',S.chord.heard.indexOf(i)>=0); n.classList.toggle('on',S.chord.matched.indexOf(i)>=0); if(anim===i){ n.classList.remove('ping'); void n.getBoundingClientRect(); n.classList.add('ping'); } });
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-chmean').forEach(function(t){ var f=S.chord.matched.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-ch-ct').innerHTML=!allH?'<b>'+S.chord.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it and its note.'):(done()?'':'<b>'+S.chord.matched.length+' of '+W.length+'</b> '+esc(cfg.matchT||'notes in the chord. Put each meaning on its word.'));
      g.classList.toggle('done',done()); if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.spk-chw').forEach(function(b){ b.classList.toggle('armed',on&&!b.classList.contains('matched')); b.classList.remove('over'); }); }
    function attempt(t,b){ if(!t||!b) return; var i=+t.dataset.i; if(S.chord.matched.indexOf(i)>=0||S.chord.heard.length<W.length) return; arm(false);
      if(+b.dataset.i===i){ S.chord.matched.push(i); save(); sel=null; miss.textContent=''; note(HZ[i],1.6); paint(i); if(done()) setTimeout(function(){ g.classList.add('strum'); HZ.forEach(function(f){ note(f,2.8,.09); }); setTimeout(function(){ g.classList.remove('strum'); },2600); },900); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    var row=g.querySelector('.spk-chwords');
    row.addEventListener('click',function(e){ var b=e.target.closest('.spk-chw'); if(!b) return; var i=+b.dataset.i;
      if(sel&&S.chord.heard.length===W.length){ attempt(sel,b); return; }
      if(S.chord.heard.indexOf(i)<0){ S.chord.heard.push(i); save(); } note(HZ[i],1.2); say(i); paint(i); });
    row.addEventListener('keydown',function(e){ var b=e.target.closest('.spk-chw'); if(b&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); b.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-chmean'); if(!t) return; if(S.chord.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-chmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-chmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-chmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    row.addEventListener('dragover',function(e){ var b=e.target.closest('.spk-chw'); g.querySelectorAll('.spk-chw').forEach(function(x){ x.classList.toggle('over',x===b); }); if(b&&!b.classList.contains('matched')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    row.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-chw')); });
    paint(); return {done:done};
  };

  /* ---- Scene 1 · Council card (4.05.02): a two-sided card. Sort each fact onto side A or side B (tap or drag).
     When both sides are full the card flips and shows both halves joined. DATA: sides [{id,ico,label,sub,color}], cards [{t,s,miss}] ---- */
  MOD.councilcard=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var SD=cfg.sides||[], CD=cfg.cards||[]; S.cc=S.cc||[];
    var done=function(){ return CD.length>0&&CD.every(function(c,i){ return S.cc.indexOf(i)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-ccard');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Council Card')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-chips spk-cccards"></div><p class="spk-miss"></p>'
      +'<div class="spk-ccwrap"><div class="spk-ccq"><span>'+esc(cfg.question||'What changed after contact?')+'</span></div><div class="spk-ccsides">'+SD.map(function(s){ return '<div class="spk-ccside" data-s="'+esc(s.id)+'" role="button" tabindex="0" style="--c:'+(s.color||'#1A8A7D')+'"><div class="hd"><span class="ic" aria-hidden="true">'+(s.ico||'')+'</span><div><b>'+esc(s.label)+'</b><small>'+esc(s.sub||'')+'</small></div><span class="ct"></span></div><ul class="in"></ul></div>'; }).join('<div class="spk-ccseam" aria-hidden="true"><span>'+esc(cfg.seam||'at the same time')+'</span></div>')+'</div></div>'
      +'<p class="spk-bell-ct spk-cc-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    var chips=g.querySelector('.spk-cccards'), miss=g.querySelector('.spk-miss'), wrap=g.querySelector('.spk-ccwrap'), sel=null, was=done();
    shuffle(CD.map(function(c,i){ return i; })).forEach(function(i){ var c=el('div','spk-chip noimg spk-cccard','<span class="ico">'+(CD[i].ico||'🗒️')+'</span><span>'+esc(CD[i].t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=i; chips.appendChild(c); });
    function paint(drop){ SD.forEach(function(s){ var sd=g.querySelector('.spk-ccside[data-s="'+s.id+'"]'), mine=CD.map(function(c,i){ return i; }).filter(function(i){ return CD[i].s===s.id&&S.cc.indexOf(i)>=0; }), all=CD.filter(function(c){ return c.s===s.id; }).length;
        sd.querySelector('.ct').textContent=mine.length+' of '+all; sd.querySelector('.in').innerHTML=mine.map(function(i){ return '<li'+(drop===i?' class="new"':'')+'>'+esc(CD[i].t)+'</li>'; }).join(''); sd.classList.toggle('full',all>0&&mine.length===all); });
      chips.querySelectorAll('.spk-cccard').forEach(function(c){ var on=S.cc.indexOf(+c.dataset.i)>=0; c.classList.toggle('spk-hide',on); c.draggable=!on; });
      var d=done(); g.querySelector('.spk-cc-ct').innerHTML=d?'':'<b>'+S.cc.length+' of '+CD.length+'</b> '+esc(cfg.countT||'facts on the card.');
      if(d&&!was){ wrap.classList.add('flip'); setTimeout(function(){ wrap.classList.remove('flip'); },900); setTimeout(function(){ sfx('win'); },500); } was=d;
      wrap.classList.toggle('whole',d); g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ g.querySelectorAll('.spk-ccside').forEach(function(s){ s.classList.toggle('armed',on); s.classList.remove('over'); }); }
    function attempt(chip,sd){ if(!chip||!sd) return; var i=+chip.dataset.i; if(S.cc.indexOf(i)>=0) return; arm(false);
      if(CD[i].s===sd.dataset.s){ S.cc.push(i); save(); sel=null; miss.textContent=''; sfx('thud'); paint(i); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=CD[i].miss||(find(SD,CD[i].s)||{}).miss||''; miss.textContent=m; missBeat(m); } }
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-cccard'); if(!c) return; ack('open'); chips.querySelectorAll('.spk-cccard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-cccard'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-cccard'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    var sides=g.querySelector('.spk-ccsides');
    sides.addEventListener('click',function(e){ var s=e.target.closest('.spk-ccside'); if(!s) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a fact first, then the side of the card it belongs on.'; return; } attempt(sel,s); });
    sides.addEventListener('keydown',function(e){ var s=e.target.closest('.spk-ccside'); if(s&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); s.click(); } });
    sides.addEventListener('dragover',function(e){ var s=e.target.closest('.spk-ccside'); g.querySelectorAll('.spk-ccside').forEach(function(x){ x.classList.toggle('over',x===s); }); if(s){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    sides.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-ccside')); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ return SD.map(function(s){ var it=CD.filter(function(c,i){ return c.s===s.id&&S.cc.indexOf(i)>=0; }); return it.length?'<p class="a"><b>'+e(s.label)+'</b>: '+e(it.map(function(c){ return c.t; }).join(' · '))+'</p>':''; }).join('')||NA; }};
  };

  /* ---- Explore reading · Two voices (4.05.02): two seats at the council table. Tap a seat and that perspective's own
     paragraph appears in its speech bubble and is read aloud (g4ss-<lesson>-duet-<n>.mp3 when it exists). Then the two
     bubbles slide together for the paragraphs that join them. DATA: paras [{id,match}], steps [{id,label,ico,side:'a'|'b'|'mid',paras:[]}] ---- */
  MOD.duet=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.steps||[]; if(S.duet==null) S.duet=-1;
    var done=function(){ return ST.length>0&&S.duet>=ST.length-1; };
    var seats=cfg.seats||{};
    var w=el('div','spk spk-duet');
    w.innerHTML='<div class="spk-dtable"><button type="button" class="seat a" data-side="a"><span class="chair" aria-hidden="true"></span><span class="ic">'+(seats.a&&seats.a.ico||'⛵')+'</span><span class="nm">'+esc(seats.a&&seats.a.label||'Perspective A')+'</span></button><div class="top" aria-hidden="true"><span class="lamp"></span></div><button type="button" class="seat b" data-side="b"><span class="chair" aria-hidden="true"></span><span class="ic">'+(seats.b&&seats.b.ico||'👣')+'</span><span class="nm">'+esc(seats.b&&seats.b.label||'Perspective B')+'</span></button></div>'
      +'<div class="spk-dbubbles"><div class="bub a"></div><div class="bub b"></div></div><div class="bub mid"></div>'
      +'<div class="spk-dctl"><button type="button" class="spk-rp-go spk-dgo"></button><p class="spk-ys-ct spk-dct"></p></div>';
    before(first,w);
    var boxes={};
    ST.forEach(function(st,i){ var host=w.querySelector('.bub.'+(st.side||'mid')); (st.paras||[]).forEach(function(pid){ var p=found[pid]; if(!p) return; var b=el('div','spk-dp'); b.dataset.i=i; boxes[pid]=b; host.appendChild(b); move(p,function(n){ b.appendChild(n); }); }); });
    ST.forEach(function(st,i){ var host=w.querySelector('.bub.'+(st.side||'mid')); var bt=el('button','spk-dplay','▶'); bt.type='button'; bt.dataset.i=i; bt.setAttribute('aria-label','Listen to this part'); bt.classList.add('spk-hide'); var au=new Audio(); au.preload='metadata'; au.addEventListener('loadedmetadata',function(){ bt.classList.remove('spk-hide'); }); au.addEventListener('ended',function(){ bt.textContent='▶'; }); au.src=AUD+'g4ss-'+LESSON+'-duet-'+(i+1)+'.mp3'; bt.__au=au; host.insertBefore(bt,host.firstChild); });
    function stopAll(){ w.querySelectorAll('.spk-dplay').forEach(function(b){ try{ b.__au.pause(); }catch(e){} b.textContent='▶'; }); }
    function play(i){ var b=w.querySelector('.spk-dplay[data-i="'+i+'"]'); if(!b||b.classList.contains('spk-hide')) return; stopAll(); document.querySelectorAll('.spk-vn.playing').forEach(function(o){ if(o.__stop) o.__stop(); }); try{ b.__au.currentTime=0; var pr=b.__au.play(); if(pr&&pr.catch) pr.catch(function(){}); b.textContent='❚❚'; }catch(e){} }
    w.addEventListener('click',function(e){ var b=e.target.closest('.spk-dplay'); if(!b) return; if(b.textContent==='❚❚'){ stopAll(); return; } play(+b.dataset.i); });
    function paint(anim){ var n=S.duet;
      ST.forEach(function(st,i){ (st.paras||[]).forEach(function(pid){ var b=boxes[pid]; if(!b) return; b.classList.toggle('on',i<=n); if(anim&&i===n){ b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } }); var pb=w.querySelector('.spk-dplay[data-i="'+i+'"]'); if(pb) pb.classList.toggle('lock',i>n); });
      var cur=ST[n], nx=ST[n+1]; ['a','b','mid'].forEach(function(sd){ var on=ST.some(function(st,i){ return i<=n&&(st.side||'mid')===sd; }); w.querySelector('.bub.'+sd).classList.toggle('on',on); });
      w.querySelectorAll('.seat').forEach(function(s){ var sd=s.dataset.side, heard=ST.some(function(st,i){ return i<=n&&st.side===sd; }); s.classList.toggle('heard',heard); s.classList.toggle('next',!!nx&&nx.side===sd); s.classList.toggle('now',!!cur&&cur.side===sd); });
      w.classList.toggle('merged',ST.some(function(st,i){ return i<=n&&st.merge; })); w.classList.toggle('started',n>=0); w.classList.toggle('all',done());
      var go=w.querySelector('.spk-dgo'); go.classList.toggle('spk-hide',!nx||nx.side==='a'||nx.side==='b'); if(nx) go.textContent=(nx.btn||'Next')+' →';
      w.querySelector('.spk-dct').innerHTML=n<0?esc(cfg.startT||'Tap the seat on the left to hear the first perspective.'):(done()?'<b>'+esc(cfg.allT||'The council has heard both voices.')+'</b>':esc(nx&&nx.hint||cfg.countT||'Read this part, then go on.'));
      var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function next(){ if(S.duet>=ST.length-1) return; S.duet++; save(); var st=ST[S.duet]; if(st.merge&&!QUIET) chime(660); else sfx('paper'); paint(true); refreshFile(); refreshVoice(); play(S.duet); if(done()) setTimeout(function(){ sfx('win'); },400); }
    w.querySelector('.spk-dtable').addEventListener('click',function(e){ var s=e.target.closest('.seat'); if(!s) return; ack('explore'); var nx=ST[S.duet+1];
      if(nx&&nx.side===s.dataset.side){ next(); return; }
      var heard=ST.map(function(st,i){ return i; }).filter(function(i){ return i<=S.duet&&ST[i].side===s.dataset.side; }); if(heard.length){ play(heard[heard.length-1]); return; }
      var m=w.querySelector('.spk-dct'); m.textContent=cfg.orderT||'Start with the seat on the left. Each perspective gets its turn.'; });
    w.querySelector('.spk-dgo').addEventListener('click',function(){ ack('explore'); next(); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(e){ return '<p class="a">Council voices heard: '+(S.duet+1)+' of '+ST.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Is it whole? (4.05.02): for each sentence, tap the halves it really has (A, B), then Check.
     Sentences with both halves get the council's seal. DATA: halves [{id,ico,t}], cards [{t,has:[ids],why}] ---- */
  MOD.wholecheck=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var HV=cfg.halves||[], CD=cfg.cards||[]; S.whole=S.whole||{};
    var key=function(a){ return a.slice().sort().join('+'); };
    var sorted=function(){ return CD.length>0&&CD.every(function(c,i){ return S.whole[i]===key(c.has); }); };
    var done=function(){ return sorted()&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-whole');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Is it whole?')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<ol class="spk-wlist">'+CD.map(function(c,i){ return '<li class="spk-wrow" data-i="'+i+'"><p class="tx">'+esc(c.t)+'</p><div class="pick">'+HV.map(function(h){ return '<button type="button" class="spk-whalf" data-h="'+esc(h.id)+'" aria-pressed="false"><span aria-hidden="true">'+(h.ico||'')+'</span> '+esc(h.t)+'</button>'; }).join('')+'<button type="button" class="spk-wchk">'+esc(cfg.checkT||'Check')+'</button></div><p class="res"></p><span class="seal" aria-hidden="true">'+esc(cfg.sealT||'Whole')+'</span></li>'; }).join('')+'</ol>'
      +'<p class="spk-bell-ct spk-w-ct"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var pick={};
    function paint(stampI){ var n=0;
      g.querySelectorAll('.spk-wrow').forEach(function(r){ var i=+r.dataset.i, c=CD[i], ok=S.whole[i]===key(c.has), whole=c.has.length===HV.length;
        r.classList.toggle('ok',ok); r.classList.toggle('whole',ok&&whole); r.classList.toggle('half',ok&&!whole); if(ok) n++;
        var sel=ok?c.has:(pick[i]||[]); r.querySelectorAll('.spk-whalf').forEach(function(b){ var on=sel.indexOf(b.dataset.h)>=0; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); b.disabled=ok; });
        r.querySelector('.spk-wchk').classList.toggle('spk-hide',ok); if(ok) r.querySelector('.res').innerHTML='<b>'+esc(whole?(cfg.wholeT||'Both halves. The council can use this one.'):(cfg.halfT||'Only half the story.'))+'</b> '+esc(c.why||'');
        if(stampI===i){ r.classList.remove('stamp'); void r.offsetWidth; r.classList.add('stamp'); } });
      g.querySelector('.spk-w-ct').innerHTML=n<CD.length?'<b>'+n+' of '+CD.length+'</b> '+esc(cfg.countT||'sentences checked.'):'';
      g.querySelector('.spk-si-gate').textContent=sorted()&&R.reading&&!R.reading.done()?(cfg.readT||'Last step: finish hearing both voices in Learn the Story.'):'';
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    g.addEventListener('click',function(e){ var r=e.target.closest('.spk-wrow'); if(!r) return; var i=+r.dataset.i, c=CD[i]; if(S.whole[i]===key(c.has)) return;
      var hb=e.target.closest('.spk-whalf'); if(hb){ ack('explore'); var p=pick[i]=pick[i]||[], k=p.indexOf(hb.dataset.h); if(k>=0) p.splice(k,1); else p.push(hb.dataset.h); sfx('click'); r.querySelector('.res').textContent=''; paint(); return; }
      if(e.target.closest('.spk-wchk')){ var p2=pick[i]||[]; if(!p2.length){ r.querySelector('.res').textContent=cfg.emptyT||'Tap A, B, or both first.'; return; }
        if(key(p2)===key(c.has)){ S.whole[i]=key(c.has); save(); sfx(c.has.length===HV.length?'thud':'click'); paint(i); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },400); }
        else { r.classList.add('shake'); setTimeout(function(){ r.classList.remove('shake'); },450); var m=c.miss||''; r.querySelector('.res').textContent=m; missBeat(m); } } });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var w=CD.filter(function(c,i){ return S.whole[i]===key(c.has)&&c.has.length===HV.length; }); return w.length?'<p class="a"><b>Whole sentences:</b> '+w.map(function(c){ return e(c.t); }).join(' · ')+'</p>':NA; }};
  };

  /* ---- Planner · Both hands (4.05.02): an A detail in the left hand, a B detail in the right hand, a joining word,
     and a reason. When all four are chosen the hands come together. Notes only — the student writes. ---- */
  MOD.hands=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var RW=cfg.rows||[]; S.hands=S.hands||{}; var was=null;
    var done=function(){ return RW.length>0&&RW.every(function(r){ return !!S.hands[r.id]; }); };
    var hand=function(side){ return '<svg viewBox="0 0 80 90" aria-hidden="true"><g'+(side==='r'?' transform="translate(80,0) scale(-1,1)"':'')+'><path class="pl" d="M18,88 L18,56 C10,50 6,40 10,34 C14,30 20,34 24,40 L26,44 L26,14 C26,8 34,8 34,14 L34,40 L36,10 C36,4 44,4 44,10 L44,40 L46,14 C46,8 54,8 54,14 L54,42 L56,22 C56,16 64,16 64,22 L64,58 C64,72 58,80 52,88 Z"/></g></svg>'; };
    var b=el('div','spk spk-builder spk-handsb');
    b.innerHTML=voice(cfg.voice,cfg)+'<div class="spk-hands"><div class="hand l">'+hand('l')+'<span class="hold"></span></div><div class="join"><span></span></div><div class="hand r">'+hand('r')+'<span class="hold"></span></div></div>'
      +RW.map(function(r,i){ return '<div class="spk-step" data-r="'+esc(r.id)+'"><div class="lab">'+(i+1)+' · '+esc(r.q||r.lab)+'</div><div class="spk-opts">'+(r.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join('')
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Both truths are in your hands. Now write your Council Debrief in Step 3.')+'</p><div class="spk-plan"></div>';
    function val(id){ var r=find(RW,id); return r&&S.hands[id]?(find(r.opts,S.hands[id])||{}).t||'':''; }
    function lines(){ return RW.filter(function(r){ return S.hands[r.id]; }).map(function(r){ return [r.lab,val(r.id)]; }); }
    function paint(){ RW.forEach(function(r){ b.querySelectorAll('.spk-step[data-r="'+r.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===S.hands[r.id]); }); });
      var hs=b.querySelector('.spk-hands'); hs.querySelector('.l .hold').textContent=val(cfg.left||'a'); hs.querySelector('.r .hold').textContent=val(cfg.right||'b'); hs.querySelector('.join span').textContent=val(cfg.join||'join');
      hs.classList.toggle('hasl',!!S.hands[cfg.left||'a']); hs.classList.toggle('hasr',!!S.hands[cfg.right||'b']);
      var all=done(); if(all&&was===false){ sfx('clink'); setTimeout(function(){ sfx('win'); },300); } was=all; hs.classList.toggle('clasp',all); b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; S.hands[o.closest('.spk-step').dataset.r]=o.dataset.v; save(); sfx('click'); paint(); });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Load the ship (4.05.02, port = to carry): crates on the dock. Tap a crate to hear its word
     (g4ss-<lesson>-crate-<n>.mp3 when it exists). Then put each meaning on its crate: the crate swings into the ship's hold.
     When the hold is full, the ship sails for Florida. ---- */
  MOD.cargo=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.cargo=S.cargo||{heard:[],loaded:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.cargo.loaded.length===W.length; };
    var ship='<svg class="spk-cship" viewBox="0 0 220 120" aria-hidden="true"><g class="hull"><path d="M10,78 L210,78 L188,108 L32,108 Z" fill="#6B4423" stroke="#3E2612" stroke-width="2"/><rect x="40" y="62" width="140" height="16" fill="#8B5A2B" stroke="#3E2612" stroke-width="1.5"/><g class="holds">'+W.map(function(x,i){ return '<rect class="hb" data-i="'+i+'" x="'+(48+i*33)+'" y="48" width="26" height="22" rx="2"/>'; }).join('')+'</g><line x1="110" y1="62" x2="110" y2="6" stroke="#3E2612" stroke-width="3"/><path class="sail" d="M112,10 L162,52 L112,52 Z" fill="#F4EAD2" stroke="#6B5A3A"/><path class="sail" d="M108,14 L66,50 L108,50 Z" fill="#EFE2C2" stroke="#6B5A3A"/><path d="M112,6 l16,5 l-16,5z" fill="#B3261E"/></g></svg>';
    var g=el('div','spk spk-cargo');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Load the Ship')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-harbor"><div class="sea" aria-hidden="true"></div><div class="dest" aria-hidden="true">'+esc(cfg.dest||'Florida →')+'</div>'+ship+'<div class="dock">'+W.map(function(x,i){ return '<div class="crate" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(esc(x.root),'<b>'+esc(x.root)+'</b>'):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-cg-ct"></p><div class="spk-chips spk-cgmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-cgmeans'), miss=g.querySelector('.spk-miss'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-crate-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-cgmean','<span class="ico">🏷️</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.cargo.heard.length===W.length;
      g.querySelectorAll('.crate').forEach(function(c){ var i=+c.dataset.i, h=S.cargo.heard.indexOf(i)>=0, l=S.cargo.loaded.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('loaded',l); c.querySelector('.m').textContent=l?W[i].m:''; if(anim===i){ c.classList.remove('lift','swing'); void c.offsetWidth; c.classList.add(l?'swing':'lift'); } });
      g.querySelectorAll('.hb').forEach(function(h){ h.classList.toggle('on',S.cargo.loaded.indexOf(+h.dataset.i)>=0); });
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-cgmean').forEach(function(t){ var f=S.cargo.loaded.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-cg-ct').innerHTML=!allH?'<b>'+S.cargo.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'crates checked. Tap each crate to hear its word.'):(done()?'':'<b>'+S.cargo.loaded.length+' of '+W.length+'</b> '+esc(cfg.loadT||'crates loaded. Put each meaning on its crate.'));
      g.classList.toggle('done',done()); if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.crate').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('loaded')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.cargo.loaded.indexOf(i)>=0||S.cargo.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.cargo.loaded.push(i); save(); sel=null; miss.textContent=''; sfx('thud'); paint(i); if(done()) setTimeout(function(){ g.classList.add('sail'); sfx('win'); },700); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    var dock=g.querySelector('.dock');
    dock.addEventListener('click',function(e){ var c=e.target.closest('.crate'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.cargo.heard.length===W.length){ attempt(sel,c); return; }
      var first=S.cargo.heard.indexOf(i)<0; if(first){ S.cargo.heard.push(i); save(); sfx('click'); } say(i); paint(i); });
    dock.addEventListener('keydown',function(e){ var c=e.target.closest('.crate'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-cgmean'); if(!t) return; if(S.cargo.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every crate first, so you hear each word.'; return; } means.querySelectorAll('.spk-cgmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-cgmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-cgmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    dock.addEventListener('dragover',function(e){ var c=e.target.closest('.crate'); g.querySelectorAll('.crate').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('loaded')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    dock.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.crate')); });
    if(done()) g.classList.add('sail');
    paint(); return {done:done};
  };

  function buildModules(){
    var ex=DATA.explore||{};
    function run(cfg){ if(!cfg||!cfg.type) return null; if(!MOD[cfg.type]){ console.warn('sparkle layer: unknown type '+cfg.type); return null; } try{ return MOD[cfg.type](cfg); }catch(e){ console.warn('sparkle layer: '+cfg.type,e); return null; } }
    R.scene1=run(DATA.scene1); R.reading=run(ex.reading); R.evidence=run(ex.evidence); R.planner=run(DATA.planner); R.vocab=run(DATA.vocab);
    try{ R.source=buildHotspots(); }catch(e){ console.warn('sparkle layer: hotspots',e); }
    /* DATA.explore.directive = {k, steps:[…]}: a plain "what to do" list right under the Investigate step badge */
    var dir=ex.directive, b2=document.querySelectorAll('#panel-explore .step-badge')[1];
    if(dir&&dir.steps&&b2) after(b2,el('div','spk spk-directive','<div class="k">'+esc(dir.k||'What to do')+'</div><ol>'+dir.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ol>'));
    /* DATA.explore.timelineLast: move the lesson's Timeline Thread card below the source card (put back on teardown) */
    var tl=document.querySelector('#panel-explore .timeline-card'), sc=document.querySelector('#panel-explore .source-card');
    if(ex.timelineLast&&tl&&sc) move(tl,function(n){ after(sc,n); });
  }

  /* ================================================================ SCENE 3 · Self-Check */
  function buildCheck(){ var score=document.getElementById('quizScore'); if(!score) return;
    function check(){ if(score.classList.contains('show')&&!S.quizDone){ S.quizDone=true; save(); } refreshFile(); refreshVoice(); } new MutationObserver(check).observe(score,{attributes:true,attributeFilter:['class']}); check(); }

  /* ================================================================ SCENE 4 · the coach under the writing box, and the file opening */
  function buildCoach(){ var ta=document.getElementById('journal-assign'); if(!ta) return; var CO=DATA.coach;
    if(CO&&CO.chips){ var RX=CO.chips.map(function(c){ return new RegExp(c.rx,'i'); });
      var coach=el('div','spk spk-coach',CO.chips.map(function(c,i){ return '<span data-i="'+i+'">'+esc(c.t)+'</span>'; }).join('')), cv=el('div','spk spk-coach-voice',''); after(ta,coach); after(coach,cv);
      var LINES=CO.lines||[];
      var coachIt=function(){ var v=ta.value,hits=0; coach.querySelectorAll('span').forEach(function(s){ var c=CO.chips[+s.dataset.i], m=RX[+s.dataset.i].test(v), h=c.not?(words(v)>=3&&!m):m; s.classList.toggle('hit',h); if(h) hits++; }); var top=LINES.length-1, idx=hits>=CO.chips.length?top:Math.min(Math.floor(hits/2),top); cv.textContent=v.trim()&&LINES.length?LINES[idx]:''; refreshFile(); tryOpen(); };
      ta.addEventListener('input',coachIt); coachIt(); }
    else ta.addEventListener('input',function(){ refreshFile(); tryOpen(); });
    var hs=document.getElementById('journal-chronicle'); if(hs){ var keep=function(){ C.sentences[THIS]=hs.value.trim(); save(); paintCabinet(); }; hs.addEventListener('input',keep); if(hs.value.trim()) keep(); } }
  function buildKey(){ document.querySelectorAll('.turn-in-item').forEach(function(i){ i.addEventListener('click',function(){ setTimeout(tryOpen,0); }); }); tryOpen(); }
  function tryOpen(){ if(S.cracked) return; if(!(notebookWritten()&&checklistDone())) return; S.cracked=true; if(THIS&&C.opened.indexOf(THIS)<0) C.opened.push(THIS); save(); refreshFile(); showCabinet(); paintCabinet(true); var cab=document.querySelector('.spk-cab'); if(cab) cab.scrollIntoView({behavior:'smooth',block:'center'}); }

  /* ================================================================ THE TOP — one header row */
  function buildTop(){ var hd=document.querySelector('.header'); if(!hd) return;
    var hero=hd.nextElementSibling; if(hero&&hero.tagName.toLowerCase()==='svg'){ hero.classList.add('spk-hero'); }
    var cells=document.querySelectorAll('.info-strip .info-cell'), vals=[].map.call(cells,function(c){ var v=c.querySelector('.info-value'); return v?v.textContent.trim():''; });
    var title=hd.querySelector('.header-title');
    if(title&&vals.length>=3) title.appendChild(el('div','spk spk-hd-meta','Unit: <b>'+esc(vals[0])+'</b> · <b>'+esc(vals[1])+'</b> · Focus: <b>'+esc(vals[2])+'</b>'));
    var ra=document.getElementById('optima-read-aloud'), tools=el('div','spk spk-hd-tools'), panels=[];
    function pill(label,panel){ var b=el('button','spk-pill',label); b.type='button'; b.setAttribute('aria-expanded','false'); b.addEventListener('click',function(){ var o=!panel.classList.contains('open'); panels.forEach(function(p){ p[1].classList.remove('open'); p[0].setAttribute('aria-expanded','false'); }); panel.classList.toggle('open',o); b.setAttribute('aria-expanded',o); }); panels.push([b,panel]); tools.appendChild(b); }
    var anchor=hd;
    if(ra){ var rp=el('div','spk spk-hd-panel'); after(anchor,rp); anchor=rp; move(ra,function(n){ rp.appendChild(n); }); pill('🔊 Read aloud',rp); }
    var std=cells[3]&&cells[3].querySelector('.info-value'), stdTx=cells[3]&&cells[3].querySelector('.tx-standards'), tx=document.querySelector('.progress-wrap .tx-toggle');
    if(std||tx){ var dp=el('div','spk spk-hd-panel','<div class="row"><b>Standards</b><span>'+(std?std.innerHTML:'')+'</span>'+(stdTx?'<span class="tx-standards tx-only">'+stdTx.innerHTML+'</span>':'')+(tx?'<b style="margin-left:auto">Texas content</b>':'')+'</div>'); after(anchor,dp); if(tx) move(tx,function(n){ dp.querySelector('.row').appendChild(n); }); pill('ⓘ Lesson details',dp); }
    hd.appendChild(tools); }

  /* ================================================================ Historian Lens — Virtue Spotlight + role in one line */
  function buildLens(){ var panel=document.getElementById('panel-scene'); if(!panel) return; var fc=panel.querySelector('.canvas-file-card'); if(!fc) return;
    var v=panel.querySelector('.virtue-card .virtue-label'), virtue=v&&(v.textContent.match(/—\s*(.+)$/)||[])[1];
    var role=[].filter.call(panel.querySelectorAll('.callout'),function(c){ return /Your Role Today/.test(c.textContent); })[0]; if(role) role.classList.add('spk-hide');
    if(!DATA.lens) return;
    var two=document.querySelector('#introSection .intro-2col'); var lens=el('div','spk spk-lens','<b>Historian Lens</b><span>'+(virtue?'<em>'+esc(virtue.trim())+'.</em> ':'')+esc(DATA.lens)+' You’re on the Florida History Team.</span>'); if(two) after(two,lens); else before(fc,lens); }

  /* ================================================================ Assignment — four steps: Gather evidence → Plan → Write → Review & turn in */
  var STEP4=DATA.steps||[{t:'Gather evidence'},{t:'Plan'},{t:'Write'},{t:'Review & turn in'}];
  var stepperEl=null;
  function stepHead(i){ var h=el('div','spk spk-stephead','<span class="n">'+(i+1)+'</span><div><div class="t">'+esc(STEP4[i].t)+'</div></div>'); h.id='spk-step-'+(i+1); return h; }
  function buildSteps(){ var panel=document.getElementById('panel-assignment'); if(!panel) return;
    var A=panel.querySelector('.activity.bl-cyan'), B=panel.querySelector('.activity.bl-gold'), PL=panel.querySelector('.spk-builder'), G=panel.querySelector('.gathered-card'), Tn=panel.querySelector('.turn-in-card'), sealEl=document.getElementById('historianSeal'), navy=panel.querySelector('.activity.bl-navy');
    if(!A||!B||!G||!Tn) return;
    stepperEl=el('div','spk spk-stepper',STEP4.map(function(s,i){ return '<button type="button" data-i="'+(i+1)+'"><span class="n"><span>'+(i+1)+'</span></span>'+esc(s.t)+'</button>'; }).join(''));
    stepperEl.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; var h=document.getElementById('spk-step-'+b.dataset.i); if(h) h.scrollIntoView({behavior:'smooth',block:'start'}); });
    var intro=[].filter.call(panel.children,function(c){ return c.classList.contains('callout-info'); })[0]; if(intro) intro.classList.add('spk-hide');
    var sh=panel.querySelector('.spk-scene'); if(sh) after(sh,stepperEl); else before(A,stepperEl); before(A,stepHead(0)); before(PL||B,stepHead(1)); before(B,stepHead(2));
    var hs=document.getElementById('journal-chronicle');
    if(navy&&hs){ var last=el('div','spk spk-last','<div class="lab">Last line · Historian’s Sentence</div><p>Finish it in your own words.</p>'); var pr=navy.querySelector('.textbox-prompt'); B.querySelector('.activity-body').appendChild(last); if(pr) move(pr,function(n){ last.appendChild(n); }); move(hs,function(n){ last.appendChild(n); }); }
    var h4=stepHead(3); before(G,h4); var rv=el('button','spk spk-review','📋 Review my work'); rv.type='button'; after(h4,rv);
    G.classList.add('spk-folded'); rv.addEventListener('click',function(){ var f=G.classList.toggle('spk-folded'); if(!f&&typeof gatherAnswers==='function') gatherAnswers(); rv.textContent=f?'📋 Review my work':'Hide my work ▴'; });
    move(Tn,function(n){ after(G,n); }); if(sealEl) move(sealEl,function(n){ after(Tn,n); });
    panel.addEventListener('input',updateStepper); Tn.addEventListener('click',function(){ setTimeout(updateStepper,0); });
    updateStepper(); }
  function updateStepper(){ if(!stepperEl) return; var w=function(id){ var t=document.getElementById(id); return t?words(t.value):0; };
    var st=[ ['journal-q1','journal-q2','journal-q3'].every(qDone),
             R.planner?R.planner.done():true,
             notebookWritten()&&w('journal-chronicle')>=5,
             checklistDone() ];
    stepperEl.querySelectorAll('button').forEach(function(b,i){ b.classList.toggle('done',st[i]); });
    /* say plainly what Step 3 still needs, so nobody wonders why it won't check off */
    function wc(id,boxId,msg){ var t=document.getElementById(id); if(!t) return; var c=document.getElementById(boxId); if(!c){ c=el('div','spk spk-wc'); c.id=boxId; after(t,c); } var r=msg(words(t.value)); c.innerHTML=r[1]; c.classList.toggle('ok',r[0]); }
    ['journal-q1','journal-q2','journal-q3'].forEach(function(id){ var need=(DATA.flags||{})[id]?8:3; wc(id,'spk-wc-'+id,function(n){ return n>=need?[true,'✓ '+n+' words.']:[false,'📝 <b>'+n+' of '+need+' words.</b> '+(n?'Add a little more.':'Write at least '+need+' words.')]; }); });
    wc('journal-assign','spk-wc-main',function(n){ return n>=MIN_WORDS?[true,'✓ '+n+' words. That’s enough for this step.']:[false,'📝 <b>'+n+' of '+MIN_WORDS+' words.</b> '+(n?'Keep going: add another sentence.':'Write at least '+MIN_WORDS+' words.')]; });
    wc('journal-chronicle','spk-wc-hs',function(n){ return n>=5?[true,'✓ Historian’s Sentence done.']:[false,'📝 Finish your Historian’s Sentence (at least 5 words). Step 3 checks off when both boxes are done.']; }); }

  /* ================================================================ VOICE NOTES — the teacher's audio guides.
     Never read the page, never give an answer. Hidden until the .mp3 exists (?review shows empty slots).
     DATA.voice: [{slot,label,at:'scene1'|'s1done'|'explore'|'afterread'|'evidence'|'mapdone'|'plan'|'write'|'score',when:'perfect'|'review',script}]
     Multi-part (plays in a row, e.g. teacher → historical voice → teacher):
       {label,at,parts:[{slot,who,script},…]} → files g4ss-<lesson>-<slot>.mp3; shown only when every part loads. */
  var AT={
    scene1:function(){ var fc=document.querySelector('#panel-scene .canvas-file-card'); return fc&&[fc,'before']; },
    explore:function(){ var a=(R.reading&&R.reading.act)||document.querySelector('#panel-explore .activity'); var sb=a&&a.previousElementSibling; return a&&[sb&&sb.classList.contains('step-badge')?sb:a,'before']; },
    write:function(){ var h=document.getElementById('spk-step-3'); return h&&[h,'after']; },
    mapdone:function(){ var k=document.querySelector('.spk-game .spk-notes > .k'); return k&&[k,'before']; },
    s1done:function(){ var k=document.querySelector('#panel-scene .spk-s1v'); return k&&[k,'before']; },
    afterread:function(){ var a=R.reading&&R.reading.act; return a&&[a,'after']; },
    evidence:function(){ var d=document.querySelector('#panel-explore .spk-sayinfer, #panel-explore .spk-doctype, #panel-explore .spk-shipshore, #panel-explore .spk-game.spk-spot, #panel-explore .spk-domino, #panel-explore .spk-whole'); return d&&[d,'before']; },
    plan:function(){ var p=document.querySelector('#panel-assignment .spk-builder'); return p&&p.firstElementChild&&[p.firstElementChild,'before']; },
    score:function(){ var q=document.getElementById('quizScore'); return q&&[q,'after']; }
  };
  function quizTotal(){ return document.querySelectorAll('#panel-check .quiz-q').length||3; }
  var WHEN={ perfect:function(){ var n=document.getElementById('quizScoreNum'); return !!S.quizDone&&n&&+n.textContent.trim()===quizTotal(); },
             review:function(){ var n=document.getElementById('quizScoreNum'); return !!S.quizDone&&n&&+n.textContent.trim()!==quizTotal(); } };
  function buildVoice(){ (DATA.voice||[]).forEach(function(v){ var w=AT[v.at]&&AT[v.at](); if(!w) return;
    var parts=v.parts||[{slot:v.slot,script:v.script}], key=v.slot||parts.map(function(p){ return p.slot; }).join('+'), bars='';
    for(var i=0;i<30;i++) bars+='<i style="height:'+(5+Math.round(13*Math.abs(Math.sin(i*1.7+key.length))))+'px"></i>';
    var tx=parts.map(function(p){ return (p.who?'<b>'+esc(p.who)+':</b> ':'')+esc(p.script); }).join('<br><br>');
    var n=el('div','spk spk-vn spk-hide','<span class="spk-avatar">👩‍🏫</span><div><div class="k">Voice note from your teacher</div><div class="t">'+esc(v.label)+'</div><div class="wave">'+bars+'</div></div><button type="button" class="play" aria-label="Play voice note">▶</button><button type="button" class="rd">Read along</button><div class="tx">'+tx+'</div>');
    n.dataset.slot=key; n.__when=WHEN[v.when]; w[1]==='after'?after(w[0],n):before(w[0],n);
    var play=n.querySelector('.play'), cur=0, ok=0, bad=false;
    var aus=parts.map(function(p,idx){ var au=new Audio(); au.preload='metadata';
      au.addEventListener('loadedmetadata',function(){ if(++ok===parts.length&&!bad){ n.classList.remove('spk-hide','spk-empty'); play.disabled=false; var m=n.querySelector('.mock'); if(m) m.remove(); } });
      au.addEventListener('error',function(){ bad=true; n.classList.remove('spk-hide'); n.classList.add('spk-empty'); play.disabled=true; if(!n.querySelector('.mock')) n.querySelector('.k').insertAdjacentHTML('beforeend','<span class="mock">· empty slot — g4ss-'+LESSON+'-'+p.slot+'.mp3</span>'); });
      au.addEventListener('ended',function(){ if(idx<parts.length-1){ cur=idx+1; aus[cur].currentTime=0; aus[cur].play(); } else { cur=0; n.classList.remove('playing'); play.textContent='▶'; } });
      return au; });
    function stop(){ aus[cur].pause(); n.classList.remove('playing'); play.textContent='▶'; }
    n.__stop=stop;
    play.addEventListener('click',function(){ if(n.classList.contains('playing')){ stop(); return; }
      document.querySelectorAll('.spk-vn.playing').forEach(function(o){ if(o!==n&&o.__stop) o.__stop(); });
      aus[cur].play(); n.classList.add('playing'); play.textContent='❚❚'; });
    n.querySelector('.rd').addEventListener('click',function(){ n.classList.toggle('read'); this.textContent=n.classList.contains('read')?'Hide words':'Read along'; });
    parts.forEach(function(p,idx){ aus[idx].src=AUD+'g4ss-'+LESSON+'-'+p.slot+'.mp3'; }); }); refreshVoice(); }
  function refreshVoice(){ document.querySelectorAll('.spk-vn').forEach(function(n){ if(n.__when) n.classList.toggle('spk-wait',!n.__when()); }); }
  function paintVideos(){ if(!document.documentElement.classList.contains('spk-on')) return; document.querySelectorAll('.video-wrap').forEach(function(v){ v.classList.toggle('spk-empty',!v.querySelector('iframe,video')); }); }
  function buildMedia(){ paintVideos(); if(!window.__spkVidObs){ window.__spkVidObs=new MutationObserver(function(){ clearTimeout(window.__spkVidT); window.__spkVidT=setTimeout(paintVideos,100); }); window.__spkVidObs.observe(document.body,{childList:true,subtree:true}); } }

  /* ================================================================ flags, hints, "go further", wrong-answer lines — all from DATA */
  function flagCount(f,v){ if(f.groups) return f.groups.filter(function(g){ return new RegExp('\\b('+g+')','i').test(v); }).length;
    var m=v.match(new RegExp(f.rx,'gi'))||[]; var u={}; m.forEach(function(x){ u[x.toLowerCase().trim()]=1; }); return Object.keys(u).length; }
  /* a question counts as answered when it has a real answer (8+ words) and misses at most one "needs" chip —
     the chips are hints, not locks, so a good answer in the student's own words still counts */
  function qDone(id){ var fl=(DATA.flags||{})[id], t=document.getElementById(id); if(!t) return true; var v=t.value||'';
    if(!fl) return words(v)>=3; var hit=fl.filter(function(f){ return flagCount(f,v)>=f.n; }).length;
    return hit===fl.length || (words(v)>=8 && hit>=fl.length-1); }
  function flagsMet(id){ var fl=(DATA.flags||{})[id], t=document.getElementById(id); if(!t) return true; if(!fl) return words(t.value)>=3; return fl.every(function(f){ return flagCount(f,t.value)>=f.n; }); }
  function buildHelp(){
    var ids={}; ['flags','hints','scholar'].forEach(function(k){ Object.keys(DATA[k]||{}).forEach(function(id){ ids[id]=1; }); });
    Object.keys(ids).forEach(function(id){
      var host=document.querySelector('[data-help="'+id+'"]')||document.getElementById(id); if(!host) return;
      var fl=(DATA.flags||{})[id], hs=(DATA.hints||{})[id], sc=(DATA.scholar||{})[id];
      var box=el('div','spk spk-help');
      if(fl) box.innerHTML+='<div class="spk-flags"><span class="lab">Your answer needs</span>'+fl.map(function(f,i){ return '<span class="f" data-i="'+i+'">'+esc(f.t)+'</span>'; }).join('')+'</div>';
      if(hs) box.innerHTML+='<div class="spk-ladder"><button type="button" class="spk-nudge">💡 Need a nudge?</button><ol class="spk-rungs"></ol></div>';
      if(sc) box.innerHTML+='<div class="spk-further">✦ '+esc(sc)+' <span>(optional)</span></div>';
      after(host,box);
      if(fl){ var paint=function(){ box.querySelectorAll('.spk-flags .f').forEach(function(c){ var f=fl[+c.dataset.i]; c.classList.toggle('hit',flagCount(f,host.value||'')>=f.n); }); updateStepper(); }; host.addEventListener('input',paint); paint(); }
      if(hs){ var btn=box.querySelector('.spk-nudge'), ol=box.querySelector('.spk-rungs');
        var show=function(){ var n=S.hints[id]||0; ol.innerHTML=hs.slice(0,n).map(function(h){ return '<li>'+esc(h)+'</li>'; }).join(''); btn.textContent=n===0?'💡 Need a nudge?':n<hs.length?'💡 Another nudge':'That’s every nudge — you’ve got this'; btn.disabled=n>=hs.length; };
        btn.addEventListener('click',function(){ S.hints[id]=Math.min((S.hints[id]||0)+1,hs.length); save(); show(); }); show(); }
    }); }
  function buildQuizMiss(){ if(!DATA.quizMiss||typeof window.checkQuiz!=='function'||window.__spkQuizWrapped) return; window.__spkQuizWrapped=true;
    var orig=window.checkQuiz;
    window.checkQuiz=function(opt){ var q=opt.closest('.quiz-q'), was=q&&q.classList.contains('answered'); orig(opt);
      if(was||!q||!document.documentElement.classList.contains('spk-on')) return;
      var idx=[].indexOf.call(document.querySelectorAll('.quiz-q'),q), v=opt.getAttribute('data-val'), line=(DATA.quizMiss[idx]||{})[v];
      if(line&&v!==q.getAttribute('data-answer')){ var fb=q.querySelector('.fb-wrong')||q.lastElementChild; after(fb,el('div','spk spk-qmiss','<b>Why that one’s tempting:</b> '+esc(line))); } }; }

  /* ================================================================ the Learning Journal: a page to keep */
  var TEXTS=[];
  function setText(n,t){ if(!n) return; TEXTS.push([n,n.innerHTML]); n.innerHTML=t; }
  function journalHTML(){ var e=function(s){ return esc(s==null?'':s); }, NA='<p class="na">(not answered yet)</p>', box=function(v){ v=(v||'').trim(); return v?'<p class="a">'+e(v).replace(/\n/g,'<br>')+'</p>':NA; };
    var bq=document.querySelector('.theme-question .intro-card-body p'), cells=[].map.call(document.querySelectorAll('.info-strip .info-value'),function(c){ return c.textContent.trim(); });
    var N=DATA.notes||{}, h='', st=function(i){ return STAGES[i]?STAGES[i].r:''; };
    h+='<h1>📓 My Social Studies Journal</h1><div class="sub">'+e(DATA.lesson)+' · '+e(DATA.title)+(cells[0]?' · '+e(cells[0])+' · '+e(cells[1]):'')+(nm()?' · '+e(nm()):'')+'</div>';
    if(bq) h+='<div class="bq"><b>Big Question</b>'+e(bq.textContent.trim())+'</div>';
    var vocab=(N.vocab||[]).map(function(v){ return '<b>'+e(v[0])+'</b> — '+e(v[1]); }).join('; ');
    h+='<h2>What I learned</h2><ul>'+(N.learned||[]).map(function(x){ return '<li>'+e(x)+'</li>'; }).join('')+(vocab?'<li>'+(N.wordParts?e(N.wordParts)+' ':'Words: ')+vocab+'.</li>':'')+'</ul>';
    h+='<h2>1 · '+e(st(0))+'</h2>'+(R.scene1&&R.scene1.journal?R.scene1.journal(e,NA):NA);
    h+='<h2>2 · '+e(st(1))+'</h2>'+(R.evidence&&R.evidence.journal?R.evidence.journal(e,NA):(R.reading&&R.reading.journal?R.reading.journal(e,NA):NA));
    var sn=document.getElementById('quizScoreNum'); h+='<h2>3 · '+e(st(2)||'Self-Check')+'</h2>'+(S.quizDone&&sn?'<p class="a">Score: '+e(sn.textContent)+' out of '+quizTotal()+'</p>':NA);
    h+='<h2>4 · '+e(st(3))+'</h2>';
    ['journal-q1','journal-q2','journal-q3'].forEach(function(id,i){ var t=document.getElementById(id); if(!t) return; var qb=t.previousElementSibling; while(qb&&!qb.classList.contains('q-block')) qb=qb.previousElementSibling; var qt=qb?qb.querySelector('.q-text'):null, qtext=qt?qt.textContent.replace(/^\s*\d+\s*/,'').trim():t.getAttribute('data-label'); h+='<h3>'+(i+1)+'. '+e(qtext)+'</h3>'+box(t.value); });
    var plan=R.planner&&R.planner.lines?R.planner.lines():[];
    h+='<h3>My plan</h3>'+(plan.length?'<p class="a">'+plan.map(function(x){ return e(x[0])+': '+e(x[1]); }).join('<br>')+'</p>':NA);
    var da=document.getElementById('journal-assign'), hs=document.getElementById('journal-chronicle');
    h+='<h3>'+e((DATA.write&&DATA.write.label)||'My writing')+'</h3>'+box(da&&da.value)+'<h3>My Historian’s Sentence</h3>'+box(hs&&hs.value);
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+e(DATA.lesson)+' — My Social Studies Journal</title><style>body{font-family:Georgia,serif;max-width:700px;margin:36px auto;padding:0 20px;color:#1a1a2e;line-height:1.6}h1{font-size:24px;margin:0;border-bottom:3px solid #C9A24A;padding-bottom:8px}.sub{color:#5B667A;font:14px system-ui,sans-serif;margin:6px 0 18px}.bq{background:#FAF6EE;border-left:4px solid #C9A24A;padding:10px 14px;margin:0 0 8px}.bq b{display:block;font:700 11px system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8A6A1E}h2{font-size:17px;color:#0E1C42;border-bottom:2px solid #E2E8F4;padding-bottom:4px;margin:26px 0 8px}h3{font:700 14px system-ui,sans-serif;color:#3A4A6B;margin:16px 0 4px}ul{padding-left:20px}li{margin:4px 0}.a{white-space:normal;background:#f8f9fc;border-left:3px solid #1A8A7D;border-radius:4px;padding:6px 12px;margin:4px 0}.na{color:#9AA3B8;font-style:italic;margin:4px 0}.ft{margin-top:30px;color:#9AA3B8;font:12px system-ui,sans-serif}</style></head><body>'+h+'<div class="ft">Optima Academy Online · Social Studies · Grade 4 · The Florida Files</div></body></html>'; }
  function spkJournal(){ if(typeof gatherAnswers==='function') gatherAnswers(); var html=journalHTML(), win=null; try{ win=window.open('','_blank'); }catch(e){}
    if(win){ win.document.write(html); win.document.close(); setTimeout(function(){ try{ win.print(); }catch(e){} },400); return; }
    try{ var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([html],{type:'text/html'})); a.download=(DATA.lesson||'lesson')+'-my-journal.html'; document.body.appendChild(a); a.click(); a.remove(); }catch(e){} }
  function buildJournal(){ window.__spkJournalHTML=journalHTML;
    if(!window.__spkJournalWrapped&&typeof window.downloadJournal==='function'){ var orig=window.downloadJournal; window.downloadJournal=function(){ if(document.documentElement.classList.contains('spk-on')) spkJournal(); else orig(); }; window.__spkJournalWrapped=true; }
    setText(document.querySelector('.gathered-btn-pdf'),'📓 Download your Social Studies journal for the day');
    setText(document.querySelector('.gathered-intro'),'Look over your answers here. Download your journal for the day to keep, and copy your answers to paste into Canvas.'); }

  /* ================================================================ Self-Check one question at a time */
  function buildQuizSteps(){ var qs=[].slice.call(document.querySelectorAll('#panel-check .quiz-q')); if(qs.length<2) return;
    var cur=0, bar=el('div','spk spk-qprog'); before(qs[0],bar);
    qs.forEach(function(q,i){ var nx=el('button','spk spk-qnext',i<qs.length-1?'Next question →':'See my score →'); nx.type='button'; q.appendChild(nx);
      nx.addEventListener('click',function(){ cur=i+1; paint(); var t=qs[cur]||document.getElementById('quizScore'); if(t) t.scrollIntoView({behavior:'smooth',block:'center'}); }); });
    var score=document.getElementById('quizScore');
    function paint(){ qs.forEach(function(q,i){ q.classList.toggle('spk-qhide',i!==cur); q.classList.toggle('spk-qready',q.classList.contains('answered')); });
      if(score) score.classList.toggle('spk-qhide',cur<qs.length);
      bar.innerHTML=cur<qs.length?qs.map(function(q,i){ return '<i class="'+(i<cur?'done':i===cur?'now':'')+'"></i>'; }).join('')+'<span>Question '+(cur+1)+' of '+qs.length+'</span>':''; bar.classList.toggle('spk-hide',cur>=qs.length); }
    new MutationObserver(function(){ if(document.documentElement.classList.contains('spk-on')) paint(); }).observe(document.getElementById('panel-check'),{attributes:true,subtree:true,attributeFilter:['class']});
    paint(); }

  /* ================================================================ Opti hoots softly on hover/tap (WebAudio, once per 8 s) */
  var hootAt=0, actx=null;
  function hoot(){ if(QUIET) return; var now=Date.now(); if(now-hootAt<8000) return; hootAt=now;
    try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); }catch(e){ return; }
    [[0,0.34],[0.46,0.5]].forEach(function(n){ var t0=actx.currentTime+n[0], d=n[1], o=actx.createOscillator(), g=actx.createGain(), lfo=actx.createOscillator(), lg=actx.createGain(), f=actx.createBiquadFilter();
      o.type='sine'; o.frequency.setValueAtTime(410,t0); o.frequency.linearRampToValueAtTime(360,t0+d);
      lfo.frequency.value=6; lg.gain.value=6; lfo.connect(lg); lg.connect(o.frequency);
      f.type='lowpass'; f.frequency.value=900;
      g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(0.07,t0+0.06); g.gain.exponentialRampToValueAtTime(0.0001,t0+d);
      o.connect(f); f.connect(g); g.connect(actx.destination); o.start(t0); lfo.start(t0); o.stop(t0+d+0.05); lfo.stop(t0+d+0.05); }); }
  function buildOpti(){ document.querySelectorAll('.owl-buddy').forEach(function(o){ if(o.__spkHoot) return; o.__spkHoot=true;
    var go=function(){ if(!document.documentElement.classList.contains('spk-on')) return; hoot(); var a=o.querySelector('.owl-buddy-avatar'); if(a){ a.classList.remove('spk-hoot'); void a.offsetWidth; a.classList.add('spk-hoot'); } };
    o.addEventListener('mouseenter',go); o.addEventListener('click',go); }); }

  /* ================================================================ THE FLORIDA FILES — a cabinet and a map (course-wide; pins from real lon/lat) */
  var FILES=[
    {n:1,t:'Being a Historian',    img:'source-4-01-01-florida-historic-photo.jpg', lon:-82.32,lat:29.65, where:'Everywhere — a historian’s desk', blurb:'How Florida historians ask questions, read sources, and tell the difference between a fact and a guess.'},
    {n:2,t:'The Map Room',         img:'source-4-02-01-florida-physical-map.png',  lon:-85.60,lat:30.55, where:'The Panhandle and the peninsula', blurb:'Florida’s land and water: coasts, rivers, wetlands, and the maps that show them.'},
    {n:3,t:'First Peoples',        img:'source-4-03-05-florida-year-wheel.png',    lon:-81.87,lat:26.64, where:'The mangrove coast, the river country, the fields of the north', blurb:'The Apalachee, Timucua, Calusa and Tequesta, and the year they lived through.'},
    {n:4,t:'Explorers',            img:'source-4-04-01-la-florida-map-1584.jpg', lon:-80.60,lat:28.39, where:'The Atlantic coast', blurb:'Ships on the horizon. Spain, France and England arrive in La Florida.'},
    {n:5,t:'Checkpoint',door:true, blurb:'A checkpoint between units. It opens when the files before it are finished.'},
    {n:6,t:'Spanish Florida',      img:'source-4-06-02-st-augustine-engraving.png', lon:-81.31,lat:29.89, where:'St. Augustine and the missions', blurb:'The oldest city, the mission trail, and life in a Spanish colony.'},
    {n:7,t:'Fort Mose & Pioneers', img:'source-4-07-01-fort-mose-map.jpg', lon:-81.33,lat:30.05, where:'Fort Mose, north of St. Augustine', blurb:'The first free Black settlement, and the pioneers who followed.'},
    {n:8,t:'Statehood & War',      img:'source-4-08-01-florida-statehood-map.png', lon:-84.28,lat:30.44, where:'Tallahassee', blurb:'Florida becomes a state, the Seminole Wars, and the Civil War.'},
    {n:9,t:'Checkpoint',door:true, blurb:'A checkpoint between units. It opens when the files before it are finished.'},
    {n:10,t:'Modern Florida',      img:'source-4-10-01-florida-railroad.jpg', lon:-82.44,lat:27.96, where:'Tampa, Ybor City and the railroads', blurb:'Cigars, oranges, railroads and the land boom.'},
    {n:11,t:'Civil Rights & Citizens', img:'source-4-11-01-civil-rights.png', lon:-81.20,lat:29.60, where:'St. Augustine, 1964', blurb:'Floridians who stood up for their rights, and what changed.'},
    {n:12,t:'Government',          img:'source-4-12-01-florida-constitution.png', lon:-84.10,lat:30.20, where:'The Capitol', blurb:'How Florida governs itself: the Capitol, the courts, and you.'},
    {n:13,t:'The Exhibit',         img:'source-4-13-01-exhibit-board.png', lon:-81.38,lat:28.54, where:'The whole state', blurb:'The capstone: build the Florida History Exhibit from everything in this drawer.'}
  ];
  if(DATA.cabinet){ var ce=find(FILES,DATA.cabinet.n||THIS,'n'); if(ce) Object.assign(ce,DATA.cabinet); }
  FILES.forEach(function(f){ if(f.lon!=null){ var p=project(f.lon,f.lat); f.x=Math.round(p[0]); f.y=Math.round(p[1]); } });
  var cabEl, lockEl, cabSel=null;
  function cabMapSVG(){ var s='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Florida, with a pin for every file">'+floridaBase('B')+'<text x="14" y="288" style="font:italic 700 10px Lora,Georgia,serif;fill:#5C4A2A">Where the files have taken us</text>';
    FILES.filter(function(f){return !f.door&&f.x!=null;}).forEach(function(f){ s+='<g class="spk-pin" data-n="'+f.n+'"><circle class="halo" cx="'+f.x+'" cy="'+f.y+'" r="9"/><circle class="dot" cx="'+f.x+'" cy="'+f.y+'" r="9"/><text x="'+f.x+'" y="'+(f.y+3.5)+'" text-anchor="middle">'+f.n+'</text><title>'+esc(f.t)+'</title></g>'; }); return s+'</svg>'; }
  function buildCabinet(){ var chip=document.querySelector('.canvas-path-chip'); if(!chip||!THIS) return;
    cabEl=el('div','spk spk-cab'); cabEl.innerHTML='<div class="spk-cab-head"><span style="font-size:28px" aria-hidden="true">🗄️</span><div><div class="tt">The Florida Files</div><div class="ss">Thirteen files, one state. Tap a folder, or a pin on the map.</div></div><span class="cnt"></span></div><div class="spk-cab-body"><div><div class="spk-cab-map">'+cabMapSVG()+'</div><div class="spk-cab-cap">Pins light up as files open.</div></div><div><div class="spk-drawer"><span class="spk-drawer-lab">G4 · FLORIDA HISTORY</span><div class="spk-folders">'+FILES.map(function(f){return '<div class="spk-f'+(f.door?' door':'')+'" data-n="'+f.n+'" role="button" tabindex="0" title="'+esc(f.t)+'">'+(f.img?'<img alt="" src="'+IMG+f.img+'" onerror="this.remove()">':'')+'<div class="n">'+(f.door?'':esc(f.t))+'</div></div>';}).join('')+'</div></div><div class="spk-cardwrap"></div></div></div>';
    cabEl.addEventListener('click',function(e){ var f=e.target.closest('.spk-f')||e.target.closest('.spk-pin'); if(f){ cabSel=+f.dataset.n; paintCabinet(); } });
    cabEl.addEventListener('keydown',function(e){ var f=e.target.closest('.spk-f'); if(f&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); cabSel=+f.dataset.n; paintCabinet(); } });
    before(chip,cabEl); lockEl=el('div','spk spk-lockline','<span class="i">🗄️</span><span>'+esc(DATA.lockline||'The Florida Files cabinet shows up here after you finish your writing and check off the whole list.')+'</span>'); before(cabEl,lockEl); if(cabSel==null) cabSel=THIS; showCabinet(); paintCabinet(false); }
  function showCabinet(){ if(!cabEl) return; cabEl.classList.toggle('spk-hide',!S.cracked); lockEl.classList.toggle('spk-hide',!!S.cracked); }
  function paintCabinet(anim){ if(!cabEl) return;
    cabEl.querySelectorAll('.spk-f').forEach(function(f){ var n=+f.dataset.n,u=C.opened.indexOf(n)>=0; f.classList.toggle('unlocked',u); f.classList.toggle('now',n===THIS&&!S.cracked); f.classList.toggle('sel',n===cabSel); if(anim&&n===THIS) f.classList.add('justopened'); });
    cabEl.querySelectorAll('.spk-pin').forEach(function(p){ var n=+p.dataset.n; p.classList.toggle('lit',C.opened.indexOf(n)>=0); p.classList.toggle('now',n===THIS&&!S.cracked); p.classList.toggle('sel',n===cabSel); });
    cabEl.querySelector('.cnt').textContent=C.opened.length+' of 13 open'+(nm()?' · '+nm()+'’s drawer':'');
    var f=find(FILES,cabSel,'n'); var w=cabEl.querySelector('.spk-cardwrap'); if(!f){ w.innerHTML=''; return; }
    var open=C.opened.indexOf(f.n)>=0, now=f.n===THIS&&!S.cracked;
    var st=f.door?(open?'<div class="st open">✓ Checkpoint door open</div>':now?'<div class="st now">This checkpoint · in progress</div>':'<div class="st locked">Checkpoint door</div>'):open?'<div class="st open">✓ File open</div>':now?'<div class="st now">This file · in progress</div>':'<div class="st locked">🔒 Locked · opens in unit '+f.n+'</div>';
    var sent=open?C.sentences[f.n]:null;
    var body=esc(f.blurb)+(f.where?'<br><span style="color:var(--ffs)">📍 '+esc(f.where)+'</span>':'')+(sent?'<br><span class="qq">“'+esc(sent)+'”</span><br><span style="font-size:12px;color:var(--ffs)">— your Historian’s Sentence</span>':(now?'<br><span style="color:var(--ffs)">Your Historian’s Sentence will be filed here when you write it.</span>':''));
    w.innerHTML='<div class="spk-card"><span class="tab">FILE · '+(f.n<10?'0':'')+f.n+'</span>'+(f.img?'<span class="thw'+(open||now?'':' lk')+'"><img class="th" alt="" src="'+IMG+f.img+'" onerror="this.parentNode.outerHTML=\'<div class=th>📁</div>\'">'+(open||now?'':'<span class="lkb">🔒</span>')+'</span>':'<div class="th">'+(f.door?'🚪':open?'📂':'📁')+'</div>')+'<div><div class="tt">'+esc(f.t)+'</div>'+st+'<div class="bd">'+body+'</div></div>'+(open?'<span class="stamp'+(anim&&f.n===THIS?' new':'')+'">Open</span>':'')+'</div>'; }

  /* ================================================================ review bar (?review in the address) */
  function buildReviewBar(){ if(!/[?&#]review\b/.test(location.search+location.hash)||document.querySelector('.spk-mockbar')) return;
    var bar=el('div','spk-mockbar'); bar.innerHTML='<b>✦ REVIEW · '+esc(DATA.lesson)+'</b><label><input type="checkbox" id="spkOn" checked> layer on</label><label><input type="checkbox" id="spkEmpty"> show empty media slots</label><label><input type="checkbox" id="spkOutline"> outline additions</label><button type="button" id="spkReset">reset progress</button>'; document.body.appendChild(bar);
    bar.querySelector('#spkOn').addEventListener('change',function(e){ e.target.checked?build():teardown(); }); bar.querySelector('#spkEmpty').addEventListener('change',function(e){ document.documentElement.classList.toggle('spk-showempty',e.target.checked); }); bar.querySelector('#spkOutline').addEventListener('change',function(e){ document.body.classList.toggle('spk-outline',e.target.checked); });
    bar.querySelector('#spkReset').addEventListener('click',function(){ try{ localStorage.removeItem(KEY); }catch(e){} S=fresh(); thread=S.thread; pendingKey=null; teardown(); build(); }); }
  function teardown(){ var h=document.documentElement; h.classList.remove('spk-on','spk-quiet'); delete h.dataset.spkTab;
    MOVES.reverse().forEach(function(x){ x[1].parentNode.insertBefore(x[0],x[1]); x[1].remove(); }); MOVES=[];
    TEXTS.reverse().forEach(function(x){ x[0].innerHTML=x[1]; }); TEXTS=[];
    ATTRS.forEach(function(x){ x[2]==null?x[0].removeAttribute(x[1]):x[0].setAttribute(x[1],x[2]); }); ATTRS=[];
    document.querySelectorAll('.spk').forEach(function(n){n.remove();});
    document.querySelectorAll('[class*="spk-"]').forEach(function(n){ [].slice.call(n.classList).forEach(function(c){ if(c.indexOf('spk-')===0) n.classList.remove(c); }); });
    fileEl=cabEl=lockEl=phoneEl=mailEl=toastEl=stepperEl=null; R={}; unread=0; }
  function build(){ try{ P=loadProfile(); var h=document.documentElement; h.classList.add('spk-on'); if(QUIET) h.classList.add('spk-quiet');
    buildTop(); buildPhone(); buildOpening(); buildFile(); dockPhone(); buildStory(); if(openingWaiting) showNameCard(false); buildScenes(); buildLens(); buildModules(); buildCheck(); buildCoach(); buildSteps(); buildVoice(); buildMedia(); buildQuizSteps(); buildOpti(); buildHelp(); buildQuizMiss(); buildJournal(); buildKey(); buildCabinet(); refreshFile(); render(); }catch(e){ console.warn('sparkle layer:',e); } }
  window.__ffSparkleAPI={teardown:teardown,build:build,data:DATA};
  function go(){ build(); buildReviewBar(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();
