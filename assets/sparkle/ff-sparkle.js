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
     scene1.type   mapquest | habitcard | shiporder | packtrunks | claimcoast | stringboard | drawers | councilcard | mapdesk | buildtown | sitedig | storehouse | castlebuild | homelands | museumshelf | scatterpages | pockets | flagpole | letgo | loadwagon
     explore.reading.type   seasongrid | filesgrid | routemap | stepread | yearslider | ripples | layermap | duet | threewinds | calendar | plazawalk | sunpath | candle | lanterns | trench | highlighter | raisewalls | treatybook | yearwalk | trail
     explore.directive · explore.timelineLast · source.hotspots (tap-to-reveal labels on the source image)
     explore.evidence.type  wheelsort  | spotdetail | shipshore | doctype (uses source.hotspots) | domino (anchors under the Timeline Thread) | sayinfer (says / infer / ask trays; uses source.hotspots) | wholecheck | namehunt (magnified map names → Native / European trays) | clothesline (events in order on a line + one because string) | halfpic (guess from half a picture, lift the paper, true / not true) | shadowclock (events onto a pole's shadows by time of day + pick the real causes) | thennow (slide between an old picture and today's photo, then sort stayed / changed) | whatchanged (match each effect to the numbered part of the "before" picture it disrupted; uses source.hotspots) | spotpic (tap a clue card, then the number on the photo where you spot it; a lens settles there) | fillentry (build one Source / Detail / Explanation entry from the labeled source; uses source.hotspots) | turnmap (turn an old map until north is up, then lay its own scale bar between two places) | traceborder (tap the border's turning points in order on the source image, then two questions) | madehere (sort the photo's parts into 'grew right here' / 'brought in' baskets, then one question)
     planner.type  picks | fixit | choose | scale | ledger | chain | bridge | hands | coin | train | plazaplan | comicstrip | postcard | stones | magnifier | ribbons | factcard | hourglass | treatycard | saddlebags
     vocab.type    rootdig | flags | bells | streams | plantfield | chord | cargo | bloom | raisefort | roofrings | windclock | wallstack | memorypath | clayhands | focusglass | opengate | ferry | keypass | signposts
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
      else if(kind==='brush') noise(.22,3400,.5,.1,function(p){ return Math.max(0,Math.sin(p*Math.PI))*(.6+.4*Math.random()); });
      else if(kind==='door'){ tone(196,.5,.07,'triangle',150); noise(.35,700,1.4,.08,function(p){ return Math.max(0,Math.sin(p*Math.PI)); }); }
      else if(kind==='bell'){ [392,392*2.01,392*3.02].forEach(function(f,i){ tone(f,1.6-i*.35,.12/(i+1),'sine'); }); }
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

  /* ---- Scene 1 · Mapmaker's desk (4.06.01): a blank piece of old paper with faint outlines. Put each piece on its
     outline (tap the piece, then the outline, or drag it). The coastline goes first. Each piece draws itself onto the
     card and adds a line to "What your card tells a historian".
     DATA: pieces [{id,kind:'coast'|'ship'|'route'|'compass'|'label'|'town',ico,t,tells,miss, lon,lat | pts:[[lon,lat]…] | x,y, text}] ---- */
  MOD.mapdesk=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var PC=cfg.pieces||[]; S.desk=S.desk||[];
    var done=function(){ return PC.length>0&&PC.every(function(p){ return S.desk.indexOf(p.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    function at(p){ if(p.x!=null) return [p.x,p.y]; var q=project(p.lon,p.lat); return [+q[0].toFixed(1),+q[1].toFixed(1)]; }
    function line(pts){ return pts.map(function(c,i){ var q=project(c[0],c[1]); return (i?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1); }).join(''); }
    function art(p){ var a=at(p);
      if(p.kind==='coast') return '<path class="coast" d="'+FLORIDA+'" pathLength="1"/>';
      if(p.kind==='route') return '<path class="route" d="'+line(p.pts||[])+'"/>';
      if(p.kind==='ship') return '<g transform="translate('+a[0]+','+a[1]+')"><g class="bob"><path d="M-13,3 L13,3 L9,10 L-9,10 Z" fill="#6B4423" stroke="#3E2612" stroke-width=".8"/><line x1="0" y1="3" x2="0" y2="-16" stroke="#3E2612" stroke-width="1.3"/><path d="M1,-14 Q11,-7 1,1 Z" fill="#FFF8E6" stroke="#8A6A3A" stroke-width=".7"/><path d="M-1,-12 Q-9,-6 -1,0 Z" fill="#FFF8E6" stroke="#8A6A3A" stroke-width=".7"/><path d="M0,-16 l7,2 l-7,2z" fill="#B3261E"/></g></g>';
      if(p.kind==='compass') return '<g transform="translate('+a[0]+','+a[1]+')"><g class="spin"><circle r="15" fill="#FFF6DC" stroke="#6B4F2A" stroke-width="1"/><polygon points="0,-13 -3,0 3,0" fill="#B3261E"/><polygon points="0,13 -3,0 3,0" fill="#4A3A22"/><polygon points="-13,0 0,-3 0,3" fill="#8A6A3A"/><polygon points="13,0 0,-3 0,3" fill="#8A6A3A"/><circle r="2" fill="#3E2612"/><text y="-17" text-anchor="middle" style="font:700 7px Lora,Georgia,serif;fill:#3E2612">N</text></g></g>';
      if(p.kind==='label') return '<text class="lbl" x="'+a[0]+'" y="'+a[1]+'" text-anchor="middle" transform="rotate('+(p.rot||0)+' '+a[0]+' '+a[1]+')">'+esc(p.text||'La Florida')+'</text>';
      if(p.kind==='town') return '<g transform="translate('+a[0]+','+a[1]+')"><g class="huts">'+[[-7,2],[0,-3],[7,2]].map(function(h){ return '<path d="M'+(h[0]-3.5)+','+(h[1]+3)+' L'+(h[0]-3.5)+','+(h[1])+' Q'+h[0]+','+(h[1]-6)+' '+(h[0]+3.5)+','+(h[1])+' L'+(h[0]+3.5)+','+(h[1]+3)+' Z" fill="#B5483C" stroke="#5C1F14" stroke-width=".6"/>'; }).join('')+(p.text?'<text y="15" text-anchor="middle" style="font:italic 700 7.5px Lora,Georgia,serif;fill:#5C1F14">'+esc(p.text)+'</text>':'')+'</g></g>';
      return ''; }
    function ghost(p){ var a=at(p), g='<g class="gh" data-p="'+esc(p.id)+'" role="button" tabindex="0" aria-label="'+esc(p.slotT||'An empty spot on the card')+'">';
      if(p.kind==='coast') g+='<path d="'+FLORIDA+'" class="ghl" fill="rgba(255,255,255,.01)"/>';
      else if(p.kind==='route') g+='<path d="'+line(p.pts||[])+'" class="ghl" fill="none"/><path d="'+line(p.pts||[])+'" fill="none" stroke="transparent" stroke-width="16"/>';
      else if(p.kind==='ship') g+='<ellipse cx="'+a[0]+'" cy="'+(a[1]-3)+'" rx="17" ry="15" class="ghl"/>';
      else if(p.kind==='compass') g+='<circle cx="'+a[0]+'" cy="'+a[1]+'" r="18" class="ghl"/>';
      else if(p.kind==='label') g+='<rect x="'+(a[0]-30)+'" y="'+(a[1]-11)+'" width="60" height="16" rx="3" class="ghl" transform="rotate('+(p.rot||0)+' '+a[0]+' '+a[1]+')"/>';
      else if(p.kind==='town') g+='<rect x="'+(a[0]-13)+'" y="'+(a[1]-9)+'" width="26" height="'+(p.text?28:18)+'" rx="4" class="ghl"/>';
      return g+'</g>'; }
    var order=['coast','route','label','town','ship','compass'], byK=PC.slice().sort(function(a,b){ return order.indexOf(a.kind)-order.indexOf(b.kind); });
    var g=el('div','spk spk-game spk-desk');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Mapmaker’s Desk')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-deskwrap"><div class="spk-paper"><svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'An old map card of Florida')+'"><defs><radialGradient id="spkStain" cx="70%" cy="25%" r="60%"><stop offset="0" stop-color="#E8D3A0" stop-opacity=".0"/><stop offset="1" stop-color="#C9A86A" stop-opacity=".35"/></radialGradient></defs>'
      +'<rect width="300" height="300" fill="#F3E4BE"/><rect width="300" height="300" fill="url(#spkStain)"/><rect x="5" y="5" width="290" height="290" fill="none" stroke="#8A6A3A" stroke-width="1.2"/><rect x="9" y="9" width="282" height="282" fill="none" stroke="#8A6A3A" stroke-width=".5"/>'
      +'<g class="arts">'+byK.map(function(p){ return '<g class="art" data-p="'+esc(p.id)+'">'+art(p)+'</g>'; }).join('')+'</g>'
      +'<g class="ghosts">'+byK.map(ghost).join('')+'</g></svg></div>'
      +'<div class="spk-desktray"><div class="spk-chips spk-deskpcs"></div><p class="spk-miss"></p></div></div>'
      +'<div class="spk-desktells"><div class="k">'+esc(cfg.tellsK||'What your card tells a historian')+'</div><ol></ol></div>'
      +'<p class="spk-bell-ct spk-desk-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    var pcs=g.querySelector('.spk-deskpcs'), miss=g.querySelector('.spk-miss'), svg=g.querySelector('svg'), sel=null, was=done();
    PC.forEach(function(p){ var c=el('div','spk-chip noimg spk-deskpc','<span class="ico">'+(p.ico||'🗺️')+'</span><span><b>'+esc(p.t)+'</b></span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.p=p.id; pcs.appendChild(c); });
    function paint(drop){ var coastOn=S.desk.indexOf((find(PC,'coast','kind')||{}).id)>=0;
      PC.forEach(function(p){ var on=S.desk.indexOf(p.id)>=0; svg.querySelector('.art[data-p="'+p.id+'"]').classList.toggle('on',on); var gh=svg.querySelector('.gh[data-p="'+p.id+'"]'); gh.classList.toggle('spk-hide',on); gh.classList.toggle('wait',!on&&p.kind!=='coast'&&!coastOn);
        var c=pcs.querySelector('[data-p="'+p.id+'"]'); c.classList.toggle('spk-hide',on); c.draggable=!on; });
      if(drop){ var a=svg.querySelector('.art[data-p="'+drop+'"]'); a.classList.remove('drawn'); void a.getBoundingClientRect(); a.classList.add('drawn'); }
      g.querySelector('.spk-desktells ol').innerHTML=PC.filter(function(p){ return S.desk.indexOf(p.id)>=0; }).map(function(p){ return '<li'+(drop===p.id?' class="new"':'')+'><span aria-hidden="true">'+(p.ico||'')+'</span> <b>'+esc(p.t)+'.</b> '+esc(p.tells||'')+'</li>'; }).join('');
      g.querySelector('.spk-desktells').classList.toggle('spk-hide',!S.desk.length);
      var d=done(); g.querySelector('.spk-desk-ct').innerHTML=d?'':'<b>'+S.desk.length+' of '+PC.length+'</b> '+esc(cfg.countT||'pieces on the card.');
      if(d&&!was) setTimeout(function(){ sfx('win'); },500); was=d;
      g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ svg.querySelectorAll('.gh').forEach(function(x){ x.classList.toggle('armed',on); x.classList.remove('over'); }); }
    function attempt(chip,gh){ if(!chip||!gh) return; var id=chip.dataset.p, p=find(PC,id); if(!p||S.desk.indexOf(id)>=0) return; arm(false);
      var coast=find(PC,'coast','kind');
      if(coast&&p.kind!=='coast'&&S.desk.indexOf(coast.id)<0){ chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); miss.textContent=cfg.coastFirstT||'Start with the coastline. Everything else goes on it or around it.'; return; }
      if(gh.dataset.p===id){ S.desk.push(id); save(); sel=null; miss.textContent=''; sfx(p.kind==='coast'||p.kind==='route'?'paper':'thud'); paint(id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=p.miss||''; miss.textContent=m; missBeat(m); } }
    pcs.addEventListener('click',function(e){ var c=e.target.closest('.spk-deskpc'); if(!c) return; ack('open'); pcs.querySelectorAll('.spk-deskpc').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    pcs.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-deskpc'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    pcs.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-deskpc'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.p); e.dataTransfer.effectAllowed='move'; arm(true); });
    pcs.addEventListener('dragend',function(){ arm(false); });
    svg.addEventListener('click',function(e){ var gh=e.target.closest('.gh'); if(!gh) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a piece first, then tap its outline on the card.'; return; } attempt(sel,gh); });
    svg.addEventListener('keydown',function(e){ var gh=e.target.closest('.gh'); if(gh&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); gh.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    svg.addEventListener('dragover',function(e){ var gh=e.target.closest('.gh'); svg.querySelectorAll('.gh').forEach(function(x){ x.classList.toggle('over',x===gh); }); if(gh){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    svg.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.gh')); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ var it=PC.filter(function(p){ return S.desk.indexOf(p.id)>=0; }); return it.length?'<p class="a"><b>My source card:</b> '+e(it.map(function(p){ return p.t; }).join(' · '))+'</p>':NA; }};
  };

  /* ---- Explore reading · Three winds, then the shore (4.06.01): raise the sail, then tap each wind (one reason
     each) and the sail fills; tap each year on the rope; then turn the picture to the shore side for the other side
     of the story. Each action opens its paragraph. DATA: paras [{id,match}], steps [{kind:'sail'|'wind'|'rope'|'flip',
     ico,label,paras:[],knots:[{y,t}],btn,hint}] ---- */
  MOD.threewinds=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.steps||[]; if(S.winds==null) S.winds=-1; S.knots=S.knots||[];
    var done=function(){ return ST.length>0&&S.winds>=ST.length-1; };
    var winds=ST.map(function(st,i){ return st.kind==='wind'?i:-1; }).filter(function(i){ return i>=0; }), rope=ST.filter(function(st){ return st.kind==='rope'; })[0];
    var cloud=function(st,k){ var y=36+k*52; return '<g class="wind" data-i="'+ST.indexOf(st)+'" role="button" tabindex="0" aria-label="'+esc(st.label)+'"><g class="puff"><ellipse cx="66" cy="'+y+'" rx="56" ry="23" fill="#fff" stroke="#9FB8C8"/><ellipse cx="36" cy="'+(y-10)+'" rx="22" ry="15" fill="#fff"/><ellipse cx="88" cy="'+(y-11)+'" rx="24" ry="15" fill="#fff"/><text x="22" y="'+(y+7)+'" style="font-size:20px">'+(st.ico||'')+'</text><text x="50" y="'+(y+6)+'" style="font:800 16px Nunito,sans-serif;fill:#22304A">'+esc(st.label)+'</text></g><path class="gust" d="M124,'+y+' q50,-10 100,'+(6+k*4)+' t118,'+(18-k*30)+'" fill="none" stroke="#7FB5CC" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="8 7"/></g>'; };
    var ship='<svg class="face ship" viewBox="0 0 560 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="false" role="img" aria-label="A Spanish ship"><rect width="560" height="190" fill="#DCEFF5"/><path d="M0,150 Q140,138 280,150 T560,150 L560,190 L0,190Z" fill="#6FA9C4"/><path class="sw" d="M0,160 q20,-6 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>'
      +ST.filter(function(st){ return st.kind==='wind'; }).map(cloud).join('')
      +'<g class="vessel"><path d="M300,140 L440,140 L424,166 L318,166Z" fill="#6B4423" stroke="#3E2612" stroke-width="2"/><rect x="316" y="128" width="112" height="12" fill="#8B5A2B" stroke="#3E2612"/><line x1="370" y1="128" x2="370" y2="26" stroke="#3E2612" stroke-width="4"/><g class="sailg" data-i="0" role="button" tabindex="0" aria-label="'+esc((ST[0]||{}).label||'The sail')+'"><rect x="336" y="22" width="92" height="110" fill="rgba(255,255,255,.01)"/><path class="sail" d="M372,32 Q432,78 372,124 L372,32Z" fill="#FFF8E6" stroke="#8A6A3A" stroke-width="1.5"/><path class="cross" d="M384,70 h14 M391,62 v22" stroke="#B3261E" stroke-width="3"/></g><path d="M370,26 l20,6 l-20,6z" fill="#B3261E"/></g></svg>';
    var shore='<svg class="face shore" viewBox="0 0 560 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Florida shore, with a village"><rect width="560" height="190" fill="#F6E3C2"/><path d="M0,120 Q160,104 300,118 T560,112 L560,190 L0,190Z" fill="#E4C98E"/><path d="M0,150 Q140,142 280,152 T560,148 L560,190 L0,190Z" fill="#6FA9C4"/>'
      +[[90,118],[140,112],[470,112]].map(function(t){ return '<g transform="translate('+t[0]+','+t[1]+')"><path d="M0,0 Q3,-26 0,-52" stroke="#7A5530" stroke-width="4" fill="none"/><g class="frond"><path d="M0,-52 q-22,-4 -30,10 M0,-52 q22,-6 30,8 M0,-52 q-12,-16 -26,-14 M0,-52 q14,-16 26,-12" stroke="#2F7A3E" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>'; }).join('')
      +[[250,116],[300,110],[350,116]].map(function(h){ return '<path d="M'+(h[0]-20)+','+h[1]+' L'+(h[0]-20)+','+(h[1]-14)+' Q'+h[0]+','+(h[1]-40)+' '+(h[0]+20)+','+(h[1]-14)+' L'+(h[0]+20)+','+h[1]+'Z" fill="#B88A4E" stroke="#6B4423" stroke-width="2"/>'; }).join('')
      +'<path class="smoke" d="M300,70 q-8,-14 0,-26 q8,-12 0,-26" stroke="#9C948A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/><path d="M180,140 q30,10 60,0 l-6,6 q-24,6 -48,0z" fill="#7A4A26"/><g fill="#E86A8A">'+[[60,128],[200,124],[420,122],[510,126]].map(function(f){ return '<circle cx="'+f[0]+'" cy="'+f[1]+'" r="4"/>'; }).join('')+'</g></svg>';
    var w=el('div','spk spk-winds');
    w.innerHTML='<div class="spk-wcard"><div class="flipper">'+ship+shore+'</div></div>'
      +(rope?'<div class="spk-rope spk-hide"><span class="cord" aria-hidden="true"></span>'+(rope.knots||[]).map(function(k,i){ return '<button type="button" class="knot" data-k="'+i+'"><b>'+esc(k.y)+'</b><span>'+esc(k.t)+'</span></button>'; }).join('')+'</div>':'')
      +'<div class="spk-wparas"></div><div class="spk-dctl"><button type="button" class="spk-rp-go spk-wgo spk-hide"></button><p class="spk-ys-ct spk-wct"></p></div>';
    before(first,w);
    var boxes={}, list=w.querySelector('.spk-wparas');
    ST.forEach(function(st,i){ (st.paras||[]).forEach(function(pid){ var p=found[pid]; if(!p) return; var b=el('div','spk-wp'+(st.kind==='flip'?' shoreside':'')); b.dataset.i=i; boxes[pid]=b; list.appendChild(b); move(p,function(n){ b.appendChild(n); }); }); });
    function paint(anim){ var n=S.winds, nx=ST[n+1];
      ST.forEach(function(st,i){ (st.paras||[]).forEach(function(pid){ var b=boxes[pid]; if(!b) return; b.classList.toggle('on',i<=n); if(anim&&i===n){ b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } }); });
      var filled=winds.filter(function(i){ return i<=n; }).length; w.style.setProperty('--fill',(n>=0?.35:0)+filled*.22);
      w.querySelectorAll('.wind').forEach(function(c){ var i=+c.dataset.i; c.classList.toggle('blown',i<=n); c.classList.toggle('next',!!nx&&ST.indexOf(nx)===i); });
      w.querySelector('.sailg').classList.toggle('next',n<0); w.classList.toggle('raised',n>=0);
      var rp=w.querySelector('.spk-rope'); if(rp){ var ri=ST.indexOf(rope); rp.classList.toggle('spk-hide',n<ri-1); rp.querySelectorAll('.knot').forEach(function(k){ var on=S.knots.indexOf(+k.dataset.k)>=0||n>=ri; k.classList.toggle('tied',on); }); }
      w.classList.toggle('flipped',ST.some(function(st,i){ return i<=n&&st.kind==='flip'; }));
      var go=w.querySelector('.spk-wgo'); go.classList.toggle('spk-hide',!nx||nx.kind!=='flip'); if(nx&&nx.kind==='flip') go.textContent=(nx.btn||'Turn to the shore side')+' →';
      w.querySelector('.spk-wct').innerHTML=done()?'<b>'+esc(cfg.allT||'You read both sides of the story.')+'</b>':esc(nx&&nx.hint||'');
      var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function next(){ if(S.winds>=ST.length-1) return; S.winds++; save(); var st=ST[S.winds]; sfx(st.kind==='flip'?'paper':'flap'); if(st.kind==='wind'&&!QUIET) chime(520+60*winds.indexOf(S.winds)); paint(true); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },500); }
    function say(t){ w.querySelector('.spk-wct').textContent=t; }
    w.addEventListener('click',function(e){ var nx=ST[S.winds+1];
      if(e.target.closest('.sailg')){ ack('explore'); if(nx&&nx.kind==='sail') next(); return; }
      var c=e.target.closest('.wind'); if(c){ ack('explore'); if(!nx) return; if(nx.kind==='wind'&&+c.dataset.i===S.winds+1) next(); else if(nx.kind==='sail') say(cfg.sailFirstT||'Raise the sail first. Tap the sail on the ship.'); else if(nx.kind==='wind') say(cfg.orderT||'Tap the wind that is glowing. The reasons go in order.'); return; }
      var k=e.target.closest('.knot'); if(k&&nx&&nx.kind==='rope'){ var i=+k.dataset.k; if(S.knots.indexOf(i)<0){ S.knots.push(i); save(); sfx('clink'); } k.classList.add('tied'); if(S.knots.length>=(nx.knots||[]).length) next(); else paint(); return; }
      if(e.target.closest('.spk-wgo')){ ack('explore'); next(); } });
    w.addEventListener('keydown',function(e){ var t=e.target.closest('.wind, .sailg'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(e){ return '<p class="a">Parts read: '+(S.winds+1)+' of '+ST.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Native name hunt (4.06.01): magnified bits of the source map. For each name, decide
     whether it came from Native people or from Europeans, and put it in that tray. Uses the tapped labels and the
     reading as gates. DATA: trays [{id,ico,label,sub,color}], cards [{id,nm,plain,x,y,span,tray,fact,miss}] (x,y,span in % of image width/height) ---- */
  MOD.namehunt=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var TR=cfg.trays||[], CD=cfg.cards||[]; S.names=S.names||[];
    var sorted=function(){ return CD.length>0&&CD.every(function(c){ return S.names.indexOf(c.id)>=0; }); };
    var done=function(){ return sorted()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-namehunt');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Name Hunt')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-nhcards"></div><p class="spk-miss"></p>'
      +'<div class="spk-nhtrays">'+TR.map(function(t){ return '<div class="spk-nhtray" data-t="'+esc(t.id)+'" role="button" tabindex="0" style="--c:'+(t.color||'#1A8A7D')+'"><div class="hd"><span class="ic" aria-hidden="true">'+(t.ico||'')+'</span><div><b>'+esc(t.label)+'</b><small>'+esc(t.sub||'')+'</small></div><span class="ct"></span></div><ul class="in"></ul></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-nh-ct"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var cards=g.querySelector('.spk-nhcards'), miss=g.querySelector('.spk-miss'), sel=null, was=done();
    shuffle(CD).forEach(function(c){ var d=el('div','spk-nhcard','<span class="lens" aria-hidden="true"></span><span class="tx"><b>'+esc(c.nm)+'</b><small>'+esc(c.where||'')+'</small></span>'); d.setAttribute('role','button'); d.tabIndex=0; d.draggable=true; d.dataset.c=c.id; d.setAttribute('aria-label','Map name: '+c.nm); cards.appendChild(d); });
    function lenses(){ var ph=document.querySelector('#panel-explore .source-card .source-image-placeholder'), im=ph&&ph.querySelector('img'); if(!im||!im.naturalWidth) return;
      cards.querySelectorAll('.spk-nhcard').forEach(function(d){ var c=find(CD,d.dataset.c), L=d.querySelector('.lens'), D=L.offsetWidth||76; if(!c) return; var BW=D/((c.span||8)/100), BH=BW*im.naturalHeight/im.naturalWidth;
        L.style.backgroundImage='url("'+im.src+'")'; L.style.backgroundSize=BW.toFixed(0)+'px '+BH.toFixed(0)+'px'; L.style.backgroundPosition=(-(c.x/100*BW-D/2)).toFixed(0)+'px '+(-(c.y/100*BH-D/2)).toFixed(0)+'px'; L.classList.add('on'); }); }
    var ph0=document.querySelector('#panel-explore .source-card .source-image-placeholder');
    if(ph0) new MutationObserver(function(){ if(document.documentElement.classList.contains('spk-on')) lenses(); }).observe(ph0,{childList:true,attributes:true});
    function paint(drop){ TR.forEach(function(t){ var sd=g.querySelector('.spk-nhtray[data-t="'+t.id+'"]'), mine=CD.filter(function(c){ return c.tray===t.id&&S.names.indexOf(c.id)>=0; }), all=CD.filter(function(c){ return c.tray===t.id; }).length;
        sd.querySelector('.ct').textContent=mine.length+' of '+all; sd.querySelector('.in').innerHTML=mine.map(function(c){ return '<li'+(drop===c.id?' class="new"':'')+'><b>'+esc(c.nm)+'</b>'+(c.plain?' · '+esc(c.plain):'')+'<small>'+esc(c.fact||'')+'</small></li>'; }).join(''); sd.classList.toggle('full',all>0&&mine.length===all); });
      cards.querySelectorAll('.spk-nhcard').forEach(function(d){ var on=S.names.indexOf(d.dataset.c)>=0; d.classList.toggle('spk-hide',on); d.draggable=!on; });
      var n=S.names.length; g.querySelector('.spk-nh-ct').innerHTML=sorted()?'':'<b>'+n+' of '+CD.length+'</b> '+esc(cfg.countT||'names sorted.');
      var gate=''; if(sorted()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the map above.'; else if(sorted()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Learn the Story above.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var d=done(); if(d&&!was) setTimeout(function(){ sfx('win'); },400); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ g.querySelectorAll('.spk-nhtray').forEach(function(t){ t.classList.toggle('armed',on); t.classList.remove('over'); }); }
    function attempt(card,tray){ if(!card||!tray) return; var c=find(CD,card.dataset.c); if(!c||S.names.indexOf(c.id)>=0) return; arm(false);
      if(c.tray===tray.dataset.t){ S.names.push(c.id); save(); sel=null; miss.textContent=''; sfx('thud'); paint(c.id); refreshFile(); refreshVoice(); }
      else { card.classList.add('shake'); setTimeout(function(){ card.classList.remove('shake'); },450); var m=c.miss||''; miss.textContent=m; missBeat(m); } }
    cards.addEventListener('click',function(e){ var d=e.target.closest('.spk-nhcard'); if(!d) return; ack('explore'); lenses(); cards.querySelectorAll('.spk-nhcard').forEach(function(x){ x.classList.remove('sel'); }); d.classList.add('sel'); sel=d; miss.textContent=''; arm(true); sfx('click'); });
    cards.addEventListener('keydown',function(e){ var d=e.target.closest('.spk-nhcard'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); d.click(); } });
    cards.addEventListener('dragstart',function(e){ var d=e.target.closest('.spk-nhcard'); if(!d||!d.draggable){ e.preventDefault(); return; } ack('explore'); sel=d; e.dataTransfer.setData('text/plain',d.dataset.c); e.dataTransfer.effectAllowed='move'; arm(true); });
    cards.addEventListener('dragend',function(){ arm(false); });
    var trays=g.querySelector('.spk-nhtrays');
    trays.addEventListener('click',function(e){ var t=e.target.closest('.spk-nhtray'); if(!t) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a name first, then the tray it belongs in.'; return; } attempt(sel,t); });
    trays.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-nhtray'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    trays.addEventListener('dragover',function(e){ var t=e.target.closest('.spk-nhtray'); g.querySelectorAll('.spk-nhtray').forEach(function(x){ x.classList.toggle('over',x===t); }); if(t){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    trays.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.spk-nhtray')); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint(); setTimeout(lenses,0);
    return {done:done, journal:function(e,NA){ return TR.map(function(t){ var it=CD.filter(function(c){ return c.tray===t.id&&S.names.indexOf(c.id)>=0; }); return it.length?'<p class="a"><b>'+e(t.label)+'</b>: '+e(it.map(function(c){ return c.nm+(c.plain?' ('+c.plain+')':''); }).join(' · '))+'</p>':''; }).join('')||NA; }};
  };

  /* ---- Planner · Two-sided coin (4.06.01): heads = why they came, tails = what happened to the people already here.
     Fill the heads rows and the coin flips over; fill the tails rows and it rings. Notes only — the student writes.
     DATA: heads {label,ico}, tails {label,ico}, rows [{id,side:'h'|'t',lab,q,opts:[{id,t}]}] ---- */
  MOD.coin=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var RW=cfg.rows||[]; S.coin=S.coin||{}; var was=null, wasH=null;
    var side=function(s){ return RW.filter(function(r){ return r.side===s; }); };
    var full=function(s){ var rs=side(s); return rs.length>0&&rs.every(function(r){ return !!S.coin[r.id]; }); };
    var done=function(){ return RW.length>0&&RW.every(function(r){ return !!S.coin[r.id]; }); };
    var H=cfg.heads||{}, Tl=cfg.tails||{};
    var face=function(cls,o){ return '<div class="face '+cls+'"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" class="rim"/><circle cx="60" cy="60" r="47" class="in"/>'+(cls==='h'?'<path d="M60,30 v60 M42,48 h36" class="mk"/>':'<path d="M38,88 Q60,74 82,88 M60,84 Q62,60 60,40 M60,42 q-16,-4 -22,6 M60,42 q16,-6 22,4 M60,42 q-8,-12 -18,-10 M60,42 q10,-12 18,-8" class="mk"/>')+'</svg><span class="lb">'+esc(o.label||'')+'</span></div>'; };
    var b=el('div','spk spk-builder spk-coinb');
    b.innerHTML=voice(cfg.voice,cfg)+'<div class="spk-coinrow"><div class="spk-coin"><div class="flipper">'+face('h',H)+face('t',Tl)+'</div></div><div class="spk-coinhold"><div class="hh"><b>'+esc(H.label||'Heads')+'</b><span></span></div><div class="th"><b>'+esc(Tl.label||'Tails')+'</b><span></span></div></div></div>'
      +RW.map(function(r,i){ return '<div class="spk-step side-'+r.side+'" data-r="'+esc(r.id)+'"><div class="lab">'+(r.side==='h'?(H.ico||'🪙'):(Tl.ico||'🌴'))+' '+(i+1)+' · '+esc(r.q||r.lab)+'</div><div class="spk-opts">'+(r.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join('')
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Both sides of the coin are filled. Now write your notebook entry in Step 3.')+'</p><div class="spk-plan"></div>';
    function val(id){ var r=find(RW,id); return r&&S.coin[id]?(find(r.opts,S.coin[id])||{}).t||'':''; }
    function lines(){ return RW.filter(function(r){ return S.coin[r.id]; }).map(function(r){ return [r.lab,val(r.id)]; }); }
    function paint(){ RW.forEach(function(r){ b.querySelectorAll('.spk-step[data-r="'+r.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===S.coin[r.id]); }); });
      b.querySelector('.hh span').textContent=side('h').map(function(r){ return val(r.id); }).filter(Boolean).join(' · ');
      b.querySelector('.th span').textContent=side('t').map(function(r){ return val(r.id); }).filter(Boolean).join(' · ');
      var hf=full('h'), all=done(), coin=b.querySelector('.spk-coin');
      if(hf&&wasH===false&&!all) sfx('clink');
      if(all&&was===false){ sfx('clink'); setTimeout(function(){ sfx('win'); },300); coin.classList.remove('ring'); void coin.offsetWidth; coin.classList.add('ring'); }
      was=all; wasH=hf; coin.classList.toggle('tails',hf&&!all); coin.classList.toggle('both',all); b.classList.toggle('done',all);
      b.querySelectorAll('.side-t').forEach(function(s){ s.classList.toggle('locked',!hf); });
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var c=e.target.closest('.spk-coin'); if(c&&done()){ c.classList.toggle('peek'); sfx('click'); return; }
      var o=e.target.closest('.spk-opt'); if(!o) return; var st=o.closest('.spk-step'), r=find(RW,st.dataset.r); if(r&&r.side==='t'&&!full('h')){ st.classList.add('shake'); setTimeout(function(){ st.classList.remove('shake'); },450); return; }
      S.coin[st.dataset.r]=o.dataset.v; save(); sfx('click'); paint(); });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Bloom the garden (4.06.01, flor = flower): four buds in a garden bed. Tap each bud to hear its
     word (g4ss-<lesson>-bloom-<n>.mp3 when it exists). Then put each meaning on its bud and it opens into a flower. ---- */
  MOD.bloom=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.bloom=S.bloom||{heard:[],open:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.bloom.open.length===W.length; };
    var COL=['#E86A8A','#F2B705','#B57BD8','#F08A3C'];
    var flower=function(i){ var c=W[i].color||COL[i%COL.length]; return '<svg viewBox="0 0 80 110" aria-hidden="true"><path d="M40,108 Q42,80 40,52" stroke="#3E7A34" stroke-width="4" fill="none"/><path d="M40,86 q-16,-4 -20,-16 q14,2 20,12z M41,76 q14,-6 20,-18 q-14,2 -20,14z" fill="#5E9A4A"/>'
      +'<g class="bud"><path d="M40,56 q-10,-14 0,-30 q10,16 0,30z" fill="#7DB35E" stroke="#3E7A34" stroke-width="1.2"/><path d="M40,30 q-4,-6 0,-10 q4,4 0,10z" fill="'+c+'"/></g>'
      +'<g class="petals" style="--pc:'+c+'">'+[0,60,120,180,240,300].map(function(a){ return '<ellipse cx="40" cy="26" rx="7" ry="13" transform="rotate('+a+' 40 38)"/>'; }).join('')+'<circle cx="40" cy="38" r="6" fill="#F7D046" stroke="#B88A10"/></g></svg>'; };
    var g=el('div','spk spk-bloom');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Bloom the Garden')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-garden"><div class="sun" aria-hidden="true"></div><span class="bee" aria-hidden="true">🦋</span><div class="bed">'+W.map(function(x,i){ return '<div class="plant" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'">'+flower(i)+'<span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-bl-ct"></p><div class="spk-chips spk-blmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-blmeans'), miss=g.querySelector('.spk-miss'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-bloom-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-blmean','<span class="ico">🌱</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.bloom.heard.length===W.length;
      g.querySelectorAll('.plant').forEach(function(c){ var i=+c.dataset.i, h=S.bloom.heard.indexOf(i)>=0, o=S.bloom.open.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('open',o); c.querySelector('.m').textContent=o?W[i].m:''; if(anim===i){ c.classList.remove('sway','pop'); void c.offsetWidth; c.classList.add(o?'pop':'sway'); } });
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-blmean').forEach(function(t){ var f=S.bloom.open.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-bl-ct').innerHTML=!allH?'<b>'+S.bloom.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'buds touched. Tap each bud to hear its word.'):(done()?'':'<b>'+S.bloom.open.length+' of '+W.length+'</b> '+esc(cfg.openT||'flowers open. Put each meaning on its bud.'));
      g.classList.toggle('done',done()); if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.plant').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('open')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.bloom.open.indexOf(i)>=0||S.bloom.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.bloom.open.push(i); save(); sel=null; miss.textContent=''; sfx('pluck'); if(!QUIET) chime(587+i*70); paint(i); if(done()) setTimeout(function(){ sfx('win'); },600); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    var bed=g.querySelector('.bed');
    bed.addEventListener('click',function(e){ var c=e.target.closest('.plant'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.bloom.heard.length===W.length){ attempt(sel,c); return; }
      if(S.bloom.heard.indexOf(i)<0){ S.bloom.heard.push(i); save(); sfx('click'); } say(i); paint(i); });
    bed.addEventListener('keydown',function(e){ var c=e.target.closest('.plant'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-blmean'); if(!t) return; if(S.bloom.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every bud first, so you hear each word.'; return; } means.querySelectorAll('.spk-blmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-blmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-blmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    bed.addEventListener('dragover',function(e){ var c=e.target.closest('.plant'); g.querySelectorAll('.plant').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('open')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    bed.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.plant')); });
    paint(); return {done:done};
  };

  /* ---- Scene 1 · Build the town (4.06.02): a plan of the town by its harbor with faint outlines. Put each part
     (tap it, then its outline, or drag it). Each part draws itself and says why it helped the town stay.
     DATA: parts [{id,ico,t,why,miss,x,y,w,h,shape:'plaza'|'church'|'houses'|'fields'|'fort'|'gate'}], fixed [{t,x,y}] ---- */
  MOD.buildtown=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var PT=cfg.parts||[]; S.town=S.town||[];
    var done=function(){ return PT.length>0&&PT.every(function(p){ return S.town.indexOf(p.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    function art(p){ var x=p.x,y=p.y,w=p.w,h=p.h;
      if(p.shape==='plaza') return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#EADFBF" stroke="#8A6A3A" stroke-width="1.2"/><circle cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" r="4" fill="#7FB5CC" stroke="#4A7A8C"/>'+[[x+5,y+5],[x+w-5,y+5],[x+5,y+h-5],[x+w-5,y+h-5]].map(function(t){ return '<circle cx="'+t[0]+'" cy="'+t[1]+'" r="3" fill="#4E8A3E"/>'; }).join('');
      if(p.shape==='church') return '<rect x="'+x+'" y="'+(y+8)+'" width="'+w+'" height="'+(h-8)+'" fill="#E9E1CF" stroke="#6B5A3A" stroke-width="1.2"/><path d="M'+x+','+(y+8)+' L'+(x+w/2)+','+y+' L'+(x+w)+','+(y+8)+'Z" fill="#A0522D"/><path d="M'+(x+w/2)+','+(y-8)+' v8 M'+(x+w/2-3)+','+(y-5)+' h6" stroke="#3E2612" stroke-width="1.4"/><rect x="'+(x+w/2-3)+'" y="'+(y+h-9)+'" width="6" height="9" fill="#6B4423"/>';
      if(p.shape==='houses'){ var s=''; for(var i=0;i<3;i++) for(var j=0;j<2;j++){ var hx=x+i*(w/3)+2, hy=y+j*(h/2)+2, hw=w/3-4, hh=h/2-4; s+='<rect x="'+hx+'" y="'+(hy+4)+'" width="'+hw+'" height="'+(hh-4)+'" fill="#D9C7A0" stroke="#6B5A3A" stroke-width=".8"/><path d="M'+hx+','+(hy+4)+' L'+(hx+hw/2)+','+hy+' L'+(hx+hw)+','+(hy+4)+'Z" fill="#B88A4E"/>'; } return s; }
      if(p.shape==='fields'){ var f='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#C9D98E" stroke="#6E8A3A" stroke-width="1"/>'; for(var k=1;k<6;k++) f+='<line x1="'+(x+3)+'" y1="'+(y+k*h/6)+'" x2="'+(x+w-3)+'" y2="'+(y+k*h/6)+'" stroke="#6E8A3A" stroke-width=".8" stroke-dasharray="2 2"/>'; return f; }
      if(p.shape==='fort'){ var cx=x+w/2, cy=y+h/2, r=Math.min(w,h)/2-3; return '<path d="M'+(cx-r)+','+(cy-r*.55)+' L'+(cx-r*.55)+','+(cy-r)+' L'+(cx+r*.55)+','+(cy-r)+' L'+(cx+r)+','+(cy-r*.55)+' L'+(cx+r)+','+(cy+r*.55)+' L'+(cx+r*.55)+','+(cy+r)+' L'+(cx-r*.55)+','+(cy+r)+' L'+(cx-r)+','+(cy+r*.55)+'Z" fill="#B88A4E" stroke="#5A3A18" stroke-width="1.4"/><rect x="'+(cx-r*.4)+'" y="'+(cy-r*.4)+'" width="'+(r*.8)+'" height="'+(r*.8)+'" fill="#E2D2A8"/><g class="flag"><line x1="'+cx+'" y1="'+(cy-r*.4)+'" x2="'+cx+'" y2="'+(cy-r*1.5)+'" stroke="#3E2612" stroke-width="1.2"/><path d="M'+cx+','+(cy-r*1.5)+' l10,3 l-10,3z" fill="#FFF" stroke="#B3261E" stroke-width=".8"/><path d="M'+(cx+2)+','+(cy-r*1.5+1)+' l5,4 M'+(cx+7)+','+(cy-r*1.5+1)+' l-5,4" stroke="#B3261E" stroke-width="1"/></g>'; }
      if(p.shape==='gate') return '<rect x="'+x+'" y="'+(y+h/2-3)+'" width="'+w+'" height="6" fill="#B88A4E" stroke="#5A3A18" stroke-width=".8"/><rect x="'+(x+w/2-9)+'" y="'+y+'" width="6" height="'+h+'" fill="#D9C7A0" stroke="#5A3A18"/><rect x="'+(x+w/2+3)+'" y="'+y+'" width="6" height="'+h+'" fill="#D9C7A0" stroke="#5A3A18"/><path d="M'+(x+w/2-9)+','+y+' l3,-4 l3,4 M'+(x+w/2+3)+','+y+' l3,-4 l3,4" fill="#D9C7A0" stroke="#5A3A18" stroke-width=".8"/>';
      return ''; }
    var bg='<rect width="360" height="240" fill="#E8DDB8"/>'
      +'<path d="M250,0 C262,60 248,120 266,170 C276,205 272,226 280,240 L360,240 L360,0Z" fill="#9FCFE0"/>'
      +'<path d="M296,0 C306,70 300,140 316,240 L360,240 L360,0Z" fill="#D8C98E" stroke="#B8A86A" stroke-width="1"/>'
      +'<g fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1"><path d="M262,60 q5,-3 10,0 t10,0"/><path d="M266,130 q5,-3 10,0 t10,0"/><path d="M272,200 q5,-3 10,0 t10,0"/></g>'
      +'<text x="270" y="232" style="font:italic 700 8px Lora,Georgia,serif;fill:#2E6A80" transform="rotate(-80 270 232)">'+esc(cfg.bayT||'Matanzas Bay')+'</text>'
      +'<text x="330" y="150" style="font:italic 700 7.5px Lora,Georgia,serif;fill:#6B5A33" transform="rotate(-82 330 150)">'+esc(cfg.islandT||'Anastasia Island')+'</text>'
      +'<g fill="#4E8A3E" opacity=".6">'+[[20,20],[40,200],[200,225],[12,120],[230,12]].map(function(t){ return '<circle cx="'+t[0]+'" cy="'+t[1]+'" r="5"/>'; }).join('')+'</g>'
      +(cfg.fixed||[]).map(function(f){ return '<g class="fixed"><g fill="#B88A4E" stroke="#6B4423" stroke-width=".8">'+[[-8,0],[0,-3],[8,0]].map(function(o){ return '<path d="M'+(f.x+o[0]-5)+','+(f.y+o[1]+4)+' Q'+(f.x+o[0])+','+(f.y+o[1]-6)+' '+(f.x+o[0]+5)+','+(f.y+o[1]+4)+'Z"/>'; }).join('')+'</g><text x="'+f.x+'" y="'+(f.y+15)+'" text-anchor="middle" style="font:italic 700 7.5px Lora,Georgia,serif;fill:#5C3A1A">'+esc(f.t)+'</text></g>'; }).join('')
      +'<path d="M8,8 h344 v224 h-344z" fill="none" stroke="#8A6A3A" stroke-width="1"/><g transform="translate(26,206)"><circle r="11" fill="#FFF6DC" stroke="#6B4F2A"/><polygon points="0,-9 -2,0 2,0" fill="#B3261E"/><polygon points="0,9 -2,0 2,0" fill="#4A3A22"/><text y="-12" text-anchor="middle" style="font:700 6px Lora,Georgia,serif;fill:#3E2612">N</text></g>';
    var g=el('div','spk spk-game spk-town');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Build the Town')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-deskwrap"><div class="spk-paper"><svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A plan of St. Augustine by its harbor')+'">'+bg
      +'<g class="arts">'+PT.map(function(p){ return '<g class="art" data-p="'+esc(p.id)+'">'+art(p)+'</g>'; }).join('')+'</g>'
      +'<g class="ghosts">'+PT.map(function(p){ return '<g class="gh" data-p="'+esc(p.id)+'" role="button" tabindex="0" aria-label="'+esc(cfg.slotT||'An empty spot in the town')+'"><rect x="'+(p.x-2)+'" y="'+(p.y-(p.shape==='church'?10:2))+'" width="'+(p.w+4)+'" height="'+(p.h+(p.shape==='church'?12:4))+'" rx="3" class="ghl"/></g>'; }).join('')+'</g></svg></div>'
      +'<div class="spk-desktray"><div class="spk-chips spk-towntray"></div><p class="spk-miss"></p></div></div>'
      +'<div class="spk-desktells"><div class="k">'+esc(cfg.tellsK||'Why each part helped the town stay')+'</div><ol></ol></div>'
      +'<p class="spk-bell-ct spk-town-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    var tray=g.querySelector('.spk-towntray'), miss=g.querySelector('.spk-miss'), svg=g.querySelector('svg'), sel=null, was=done();
    PT.forEach(function(p){ var c=el('div','spk-chip noimg spk-deskpc','<span class="ico">'+(p.ico||'🏠')+'</span><span><b>'+esc(p.t)+'</b></span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.p=p.id; tray.appendChild(c); });
    function paint(drop){ PT.forEach(function(p){ var on=S.town.indexOf(p.id)>=0; svg.querySelector('.art[data-p="'+p.id+'"]').classList.toggle('on',on); svg.querySelector('.gh[data-p="'+p.id+'"]').classList.toggle('spk-hide',on); var c=tray.querySelector('[data-p="'+p.id+'"]'); c.classList.toggle('spk-hide',on); c.draggable=!on; });
      if(drop){ var a=svg.querySelector('.art[data-p="'+drop+'"]'); a.classList.remove('drawn'); void a.getBoundingClientRect(); a.classList.add('drawn'); }
      g.querySelector('.spk-desktells ol').innerHTML=PT.filter(function(p){ return S.town.indexOf(p.id)>=0; }).map(function(p){ return '<li'+(drop===p.id?' class="new"':'')+'><span aria-hidden="true">'+(p.ico||'')+'</span> <b>'+esc(p.t)+'.</b> '+esc(p.why||'')+'</li>'; }).join('');
      g.querySelector('.spk-desktells').classList.toggle('spk-hide',!S.town.length);
      var d=done(); g.querySelector('.spk-town-ct').innerHTML=d?'':'<b>'+S.town.length+' of '+PT.length+'</b> '+esc(cfg.countT||'parts of the town built.');
      if(d&&!was) setTimeout(function(){ sfx('win'); },500); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ svg.querySelectorAll('.gh').forEach(function(x){ x.classList.toggle('armed',on); x.classList.remove('over'); }); }
    function attempt(chip,gh){ if(!chip||!gh) return; var id=chip.dataset.p, p=find(PT,id); if(!p||S.town.indexOf(id)>=0) return; arm(false);
      if(gh.dataset.p===id){ S.town.push(id); save(); sel=null; miss.textContent=''; sfx(p.shape==='fields'?'plant':'thud'); paint(id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=p.miss||''; miss.textContent=m; missBeat(m); } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-deskpc'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-deskpc').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-deskpc'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-deskpc'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.p); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); });
    svg.addEventListener('click',function(e){ var gh=e.target.closest('.gh'); if(!gh) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a part of the town first, then tap its outline.'; return; } attempt(sel,gh); });
    svg.addEventListener('keydown',function(e){ var gh=e.target.closest('.gh'); if(gh&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); gh.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    svg.addEventListener('dragover',function(e){ var gh=e.target.closest('.gh'); svg.querySelectorAll('.gh').forEach(function(x){ x.classList.toggle('over',x===gh); }); if(gh){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    svg.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.gh')); });
    paint(); body.appendChild(g);
    return {done:done, journal:function(e,NA){ var it=PT.filter(function(p){ return S.town.indexOf(p.id)>=0; }); return it.length?'<p class="a"><b>My town:</b> '+e(it.map(function(p){ return p.t; }).join(' · '))+'</p>':NA; }};
  };

  /* ---- Explore reading · Tear-off calendar (4.06.02): a wall calendar. Tear each page and that date's paragraph
     drops into the reading below. DATA: paras [{id,match}], pages [{d,sub,paras:[]}], endT ---- */
  MOD.calendar=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var PG=cfg.pages||[]; if(S.cal==null) S.cal=0;
    var done=function(){ return PG.length>0&&S.cal>=PG.length; };
    var w=el('div','spk spk-cal');
    w.innerHTML='<div class="spk-calwrap"><div class="nail" aria-hidden="true"></div><div class="rings" aria-hidden="true"><i></i><i></i><i></i></div><div class="pad"><div class="under"></div><button type="button" class="page" aria-label="'+esc(cfg.tearT||'Tear off this page')+'"><span class="m"></span><span class="d"></span><span class="s"></span><span class="tear" aria-hidden="true">'+esc(cfg.tearT||'Tear off this page')+' ↗</span></button></div></div>'
      +'<div class="spk-calread"></div><p class="spk-ys-ct spk-calct"></p>';
    before(first,w);
    var list=w.querySelector('.spk-calread'), boxes={};
    PG.forEach(function(pg,i){ var b=el('div','spk-calp'); b.dataset.i=i; b.innerHTML='<div class="tab"><b>'+esc(pg.d)+'</b>'+(pg.sub?' <span>'+esc(pg.sub)+'</span>':'')+'</div>'; list.appendChild(b); (pg.paras||[]).forEach(function(pid){ var p=found[pid]; if(p) move(p,function(n){ b.appendChild(n); }); }); boxes[i]=b; });
    function face(el2,pg){ el2.querySelector('.m').textContent=pg?pg.top||'':''; el2.querySelector('.d').textContent=pg?pg.d:''; el2.querySelector('.s').textContent=pg?pg.sub||'':''; }
    function paint(anim){ var n=S.cal, page=w.querySelector('.page'), under=w.querySelector('.under');
      PG.forEach(function(pg,i){ var b=boxes[i]; b.classList.toggle('on',i<n); if(anim&&i===n-1){ b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } });
      if(n<PG.length){ face(page,PG[n]); page.classList.remove('spk-hide'); under.innerHTML=PG[n+1]?'<span class="d">'+esc(PG[n+1].d)+'</span>':'<span class="d end">'+esc(cfg.endT||'')+'</span>'; }
      else { page.classList.add('spk-hide'); under.innerHTML='<span class="d end">'+esc(cfg.endT||'')+'</span>'; }
      w.classList.toggle('all',done());
      w.querySelector('.spk-calct').innerHTML=done()?'<b>'+esc(cfg.allT||'Every page is torn. You read the whole story.')+'</b>':(n===0?esc(cfg.startT||'Tap the calendar page to tear it off.'):'<b>'+n+' of '+PG.length+'</b> '+esc(cfg.countT||'pages torn. Read this part, then tear the next page.'));
      var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    w.querySelector('.page').addEventListener('click',function(){ if(S.cal>=PG.length) return; ack('explore'); var page=this;
      var fly=page.cloneNode(true); fly.classList.add('fly'); fly.removeAttribute('aria-label'); page.parentNode.appendChild(fly); setTimeout(function(){ fly.remove(); },900);
      S.cal++; save(); sfx('paper'); paint(true); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },500);
      var nb=boxes[S.cal-1]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },120); } });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(e){ return '<p class="a">Calendar pages torn: '+Math.min(S.cal,PG.length)+' of '+PG.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Clothesline (4.06.02): clip each event card on the line in order (tap the card, then a
     peg, or drag). Then tie one "because" string: tap the cause, then what it caused. Uses the tapped labels and the
     reading as gates. DATA: cards [{id,t,y,miss}], pairs [[causeId,effectId,sentence]] ---- */
  MOD.clothesline=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var CD=cfg.cards||[], ORD=CD.slice().sort(function(a,b){ return a.o-b.o; }), PR=cfg.pairs||[]; S.line=S.line||{pinned:[],tie:null};
    var placed=function(){ return S.line.pinned.length===CD.length; };
    var sorted=function(){ return placed()&&!!S.line.tie; };
    var done=function(){ return sorted()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-cline');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Clothesline')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-chips spk-clcards"></div><p class="spk-miss"></p>'
      +'<div class="spk-clwrap"><svg class="rope" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0,10 Q500,48 1000,10" fill="none" stroke="#8A6A3A" stroke-width="3"/><path class="tie" d="" fill="none" stroke="#B3261E" stroke-width="4" stroke-linecap="round"/></svg>'
      +'<div class="pegs">'+ORD.map(function(c,i){ return '<div class="peg" data-k="'+i+'" role="button" tabindex="0" aria-label="Spot '+(i+1)+' on the line"><span class="pin" aria-hidden="true"></span><span class="n">'+(cfg.slotLabels&&cfg.slotLabels[i]||(i+1))+'</span><div class="hang"></div></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-cl-ct"></p><p class="spk-cl-because"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var chips=g.querySelector('.spk-clcards'), miss=g.querySelector('.spk-miss'), sel=null, tie1=null, was=done();
    shuffle(CD).forEach(function(c){ var d=el('div','spk-chip noimg spk-clcard','<span class="ico">'+(c.ico||'📄')+'</span><span>'+esc(c.t)+'</span>'); d.setAttribute('role','button'); d.tabIndex=0; d.draggable=true; d.dataset.c=c.id; chips.appendChild(d); });
    function paint(drop){ var P=S.line.pinned;
      g.querySelectorAll('.peg').forEach(function(pg){ var k=+pg.dataset.k, c=ORD[k], on=P.indexOf(c.id)>=0, h=pg.querySelector('.hang');
        pg.classList.toggle('full',on); h.innerHTML=on?'<div class="card'+(drop===c.id?' new':'')+(S.line.tie&&(S.line.tie[0]===c.id||S.line.tie[1]===c.id)?' tied':'')+(tie1===c.id?' pick':'')+'" data-c="'+esc(c.id)+'" role="button" tabindex="0"><b>'+esc(c.y)+'</b>'+esc(c.t)+'</div>':''; });
      chips.querySelectorAll('.spk-clcard').forEach(function(d){ var on=P.indexOf(d.dataset.c)>=0; d.classList.toggle('spk-hide',on); d.draggable=!on; });
      var path=g.querySelector('.tie'); if(S.line.tie){ var a=ORD.map(function(c){ return c.id; }).indexOf(S.line.tie[0]), b=ORD.map(function(c){ return c.id; }).indexOf(S.line.tie[1]), xa=(a+.5)*1000/ORD.length, xb=(b+.5)*1000/ORD.length; path.setAttribute('d','M'+xa+',30 Q'+((xa+xb)/2)+',58 '+xb+',30'); } else path.setAttribute('d','');
      var pr=S.line.tie&&PR.filter(function(p){ return p[0]===S.line.tie[0]&&p[1]===S.line.tie[1]; })[0];
      g.querySelector('.spk-cl-because').innerHTML=pr?'🔗 <b>'+esc(cfg.becauseK||'Because:')+'</b> '+esc(pr[2]):'';
      g.querySelector('.spk-cl-ct').innerHTML=!placed()?'<b>'+P.length+' of '+CD.length+'</b> '+esc(cfg.countT||'cards on the line.'):(!S.line.tie?esc(tie1?(cfg.tie2T||'Now tap the card it caused.'):(cfg.tieT||'Now tie a because string: tap a CAUSE card on the line, then the card it caused.')):'');
      var gate=''; if(sorted()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the map above.'; else if(sorted()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Learn the Story above.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var d=done(); if(d&&!was) setTimeout(function(){ sfx('win'); },400); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); g.classList.toggle('placed',placed()); }
    function arm(on){ g.querySelectorAll('.peg').forEach(function(p){ p.classList.toggle('armed',on&&!p.classList.contains('full')); p.classList.remove('over'); }); }
    function attempt(card,peg){ if(!card||!peg) return; var c=find(CD,card.dataset.c), k=+peg.dataset.k; if(!c||S.line.pinned.indexOf(c.id)>=0) return; arm(false);
      if(ORD[k].id===c.id){ S.line.pinned.push(c.id); save(); sel=null; miss.textContent=''; sfx('clink'); paint(c.id); refreshFile(); refreshVoice(); }
      else { card.classList.add('shake'); setTimeout(function(){ card.classList.remove('shake'); },450); var m=c.miss||cfg.orderMiss||''; miss.textContent=m; missBeat(m); } }
    chips.addEventListener('click',function(e){ var d=e.target.closest('.spk-clcard'); if(!d) return; ack('explore'); chips.querySelectorAll('.spk-clcard').forEach(function(x){ x.classList.remove('sel'); }); d.classList.add('sel'); sel=d; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ var d=e.target.closest('.spk-clcard'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); d.click(); } });
    chips.addEventListener('dragstart',function(e){ var d=e.target.closest('.spk-clcard'); if(!d||!d.draggable){ e.preventDefault(); return; } ack('explore'); sel=d; e.dataTransfer.setData('text/plain',d.dataset.c); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    var pegs=g.querySelector('.pegs');
    pegs.addEventListener('click',function(e){ var card=e.target.closest('.card');
      if(card&&placed()){ if(S.line.tie) return; var id=card.dataset.c; if(!tie1){ tie1=id; sfx('click'); paint(); return; } if(tie1===id){ tie1=null; paint(); return; }
        var ok=PR.filter(function(p){ return p[0]===tie1&&p[1]===id; })[0];
        if(ok){ S.line.tie=[tie1,id]; tie1=null; save(); sfx('pluck'); miss.textContent=''; paint(); refreshFile(); refreshVoice(); }
        else { var back=PR.filter(function(p){ return p[0]===id&&p[1]===tie1; })[0]; var m=back?(cfg.backT||'Close! Flip them: tap the cause first. The cause always happens before what it caused.'):(cfg.tieMiss||'Did the second card really happen because of the first? Look for one event that made the other one happen.'); tie1=null; miss.textContent=m; missBeat(m); paint(); }
        return; }
      var pg=e.target.closest('.peg'); if(!pg||pg.classList.contains('full')) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a card first, then tap its spot on the line.'; return; } attempt(sel,pg); });
    pegs.addEventListener('keydown',function(e){ var t=e.target.closest('.card, .peg'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    pegs.addEventListener('dragover',function(e){ var p=e.target.closest('.peg'); g.querySelectorAll('.peg').forEach(function(x){ x.classList.toggle('over',x===p); }); if(p&&!p.classList.contains('full')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    pegs.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.peg')); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var P=ORD.filter(function(c){ return S.line.pinned.indexOf(c.id)>=0; }); var pr=S.line.tie&&PR.filter(function(p){ return p[0]===S.line.tie[0]&&p[1]===S.line.tie[1]; })[0]; return P.length?'<p class="a"><b>In order:</b> '+e(P.map(function(c){ return c.y+' '+c.t; }).join(' → '))+'</p>'+(pr?'<p class="a"><b>Because:</b> '+e(pr[2])+'</p>':''):NA; }};
  };

  /* ---- Planner · Story train (4.06.02): three cars (First → Then → After that), each holding an event, and a
     coupling that holds a "because" pair. Cars must be in time order. When all are filled in order, the train
     chugs off. Notes only — the student writes. DATA: cars [{id,lab,q}], events [{id,t,o}], couple {lab,q,opts:[{id,t}]} ---- */
  MOD.train=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var CR=cfg.cars||[], EV=cfg.events||[], CP=cfg.couple||{opts:[]}; S.train=S.train||{}; var was=null;
    var ev=function(id){ return find(EV,id); };
    var filled=function(){ return CR.every(function(c){ return !!S.train[c.id]; })&&!!S.train.couple; };
    var inOrder=function(){ var os=CR.map(function(c){ var e=ev(S.train[c.id]); return e?e.o:null; }); for(var i=1;i<os.length;i++){ if(os[i]==null||os[i-1]==null||os[i]<=os[i-1]) return false; } return true; };
    var done=function(){ return filled()&&inOrder(); };
    var car=function(c,i){ return '<div class="car" data-c="'+esc(c.id)+'"><svg viewBox="0 0 120 70" aria-hidden="true"><rect x="6" y="10" width="108" height="40" rx="5" class="body"/><circle cx="30" cy="56" r="9" class="wh"/><circle cx="90" cy="56" r="9" class="wh"/></svg><span class="lab">'+esc(c.lab)+'</span><span class="load"></span></div>'+(i<CR.length-1?'<span class="link" aria-hidden="true"></span>':''); };
    var b=el('div','spk spk-builder spk-trainb');
    b.innerHTML=voice(cfg.voice,cfg)+'<div class="spk-track"><div class="spk-train"><div class="eng"><svg viewBox="0 0 120 80" aria-hidden="true"><rect x="10" y="22" width="70" height="36" rx="5" class="body"/><rect x="58" y="6" width="26" height="30" rx="3" class="cab"/><rect x="22" y="8" width="12" height="16" class="stack"/><circle cx="30" cy="64" r="11" class="wh"/><circle cx="70" cy="64" r="11" class="wh"/><path d="M80,50 l18,8 l-18,4z" class="cow"/></svg><span class="puff" aria-hidden="true"></span></div><span class="coup" aria-hidden="true"></span>'+CR.map(car).join('')+'</div><div class="rails" aria-hidden="true"></div></div>'
      +CR.map(function(c,i){ return '<div class="spk-step" data-r="'+esc(c.id)+'"><div class="lab">🚃 '+(i+1)+' · '+esc(c.q||c.lab)+'</div><div class="spk-opts">'+EV.map(function(e){ return '<button type="button" class="spk-opt" data-v="'+esc(e.id)+'">'+esc(e.t)+'</button>'; }).join('')+'</div></div>'; }).join('')
      +'<div class="spk-step" data-r="couple"><div class="lab">🔗 '+(CR.length+1)+' · '+esc(CP.q||CP.lab||'Couple them: pick a because')+'</div><div class="spk-opts">'+(CP.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<p class="spk-miss spk-trmiss"></p><p class="spk-chain-done">'+esc(cfg.doneT||'All aboard! Your train is in order and coupled. Now write in Step 3.')+'</p><div class="spk-plan"></div>';
    function val(id){ if(id==='couple') return S.train.couple?(find(CP.opts,S.train.couple)||{}).t||'':''; var e=ev(S.train[id]); return e?e.t:''; }
    function lines(){ return CR.filter(function(c){ return S.train[c.id]; }).map(function(c){ return [c.lab,val(c.id)]; }).concat(S.train.couple?[[CP.lab||'Because',val('couple')]]:[]); }
    function paint(){ CR.concat([{id:'couple'}]).forEach(function(r){ var cur=r.id==='couple'?S.train.couple:S.train[r.id]; b.querySelectorAll('.spk-step[data-r="'+r.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===cur); }); });
      CR.forEach(function(c){ var cEl=b.querySelector('.car[data-c="'+c.id+'"]'); cEl.querySelector('.load').textContent=val(c.id); cEl.classList.toggle('full',!!S.train[c.id]); });
      var f=filled(), ok=inOrder(), all=done();
      b.querySelector('.spk-trmiss').textContent=(CR.every(function(c){ return !!S.train[c.id]; })&&!ok)?(cfg.orderT||'Check the dates: each car should happen after the one in front of it.'):'';
      b.querySelector('.spk-train').classList.toggle('coupled',!!S.train.couple);
      var trk=b.querySelector('.spk-track'); if(all&&was===false){ sfx('clink'); setTimeout(function(){ sfx('win'); },300); trk.classList.add('go'); setTimeout(function(){ trk.classList.remove('go'); },4400); } if(!all) trk.classList.remove('go'); was=all; b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var r=o.closest('.spk-step').dataset.r; if(r==='couple') S.train.couple=o.dataset.v; else S.train[r]=o.dataset.v; save(); sfx('click'); paint(); });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Raise the fort (4.06.02, fort = strong): the Castillo's four corner bastions, low. Tap each to
     hear its word (g4ss-<lesson>-fort-<n>.mp3 when it exists). Then put each meaning on its bastion and the wall
     rises; when all four are up, the flag goes up. ---- */
  MOD.raisefort=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.rf=S.rf||{heard:[],up:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.rf.up.length===W.length; };
    var pos=[[70,40],[290,40],[290,170],[70,170]];
    var svg='<svg class="spk-rfmap" viewBox="0 0 360 210" aria-hidden="true"><rect width="360" height="210" fill="#CFE6EE"/><rect x="20" y="10" width="320" height="190" rx="10" fill="#B9D8A6" opacity=".5"/><rect x="95" y="65" width="170" height="80" class="court"/><g class="walls"><rect x="95" y="58" width="170" height="10" class="wl"/><rect x="95" y="142" width="170" height="10" class="wl"/><rect x="88" y="65" width="10" height="80" class="wl"/><rect x="262" y="65" width="10" height="80" class="wl"/></g><g transform="translate(336,30)"><circle r="11" fill="#FFF6DC" stroke="#6B4F2A"/><polygon points="0,-9 -2.5,0 2.5,0" fill="#B3261E"/><polygon points="0,9 -2.5,0 2.5,0" fill="#4A3A22"/><text y="-13" text-anchor="middle" style="font:700 8px Lora,Georgia,serif;fill:#3E2612">N</text></g><g class="flag"><line x1="180" y1="105" x2="180" y2="62" stroke="#3E2612" stroke-width="2"/><g class="cloth"><path d="M180,62 l24,6 l-24,6z" fill="#FFF" stroke="#B3261E"/><path d="M184,64 l10,8 M194,64 l-10,8" stroke="#B3261E" stroke-width="1.6"/></g></g></svg>';
    var g=el('div','spk spk-rfort');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Raise the Fort')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-rfwrap">'+svg+W.map(function(x,i){ return '<div class="bast" data-i="'+i+'" role="button" tabindex="0" style="left:'+(pos[i%4][0]/3.6)+'%;top:'+(pos[i%4][1]/2.1)+'%" aria-label="'+esc(x.w)+'"><span class="dia" aria-hidden="true"><i></i></span><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="nm">'+esc(x.name||'')+'</span><span class="m"></span></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-rf-ct"></p><div class="spk-chips spk-rfmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-rfmeans'), miss=g.querySelector('.spk-miss'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-fort-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-rfmean','<span class="ico">🧱</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.rf.heard.length===W.length;
      g.querySelectorAll('.bast').forEach(function(c){ var i=+c.dataset.i, h=S.rf.heard.indexOf(i)>=0, u=S.rf.up.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap','rise'); void c.offsetWidth; c.classList.add(u?'rise':'tap'); } });
      g.querySelector('.walls').classList.toggle('up',S.rf.up.length>=2); g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-rfmean').forEach(function(t){ var f=S.rf.up.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-rf-ct').innerHTML=!allH?'<b>'+S.rf.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'corners checked. Tap each corner of the fort to hear its word.'):(done()?'':'<b>'+S.rf.up.length+' of '+W.length+'</b> '+esc(cfg.upT||'corners raised. Put each meaning on its corner.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ g.querySelectorAll('.bast').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.rf.up.indexOf(i)>=0||S.rf.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.rf.up.push(i); save(); sel=null; miss.textContent=''; sfx('thud'); paint(i); if(done()) setTimeout(function(){ sfx('win'); },700); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    var wrap=g.querySelector('.spk-rfwrap');
    wrap.addEventListener('click',function(e){ var c=e.target.closest('.bast'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.rf.heard.length===W.length){ attempt(sel,c); return; }
      if(S.rf.heard.indexOf(i)<0){ S.rf.heard.push(i); save(); sfx('click'); } say(i); paint(i); });
    wrap.addEventListener('keydown',function(e){ var c=e.target.closest('.bast'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-rfmean'); if(!t) return; if(S.rf.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every corner of the fort first, so you hear each word.'; return; } means.querySelectorAll('.spk-rfmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-rfmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-rfmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wrap.addEventListener('dragover',function(e){ var c=e.target.closest('.bast'); g.querySelectorAll('.bast').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wrap.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.bast')); });
    paint(); return {done:done};
  };

  /* ---- Scene 1 · Dig the site (4.06.03): a dig square over a town plan. Brush the soil away (tap a square, or press
     and drag across squares). When every square over a buried feature is brushed, that feature is found and its
     field note appears, tagged with its side of the plaza. Done when every feature is found.
     DATA: cols, rows, feats [{id,ico,t,side,tells,shape:'ring'|'hut'|'plaza'|'church'|'friary'|'fort'|'houses',x,y,w,h}], sides {id:label} ---- */
  MOD.sitedig=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var FT=cfg.feats||[], COLS=cfg.cols||6, ROWS=cfg.rows||4, VW=360, VH=240, CW=VW/COLS, CH=VH/ROWS, SIDES=cfg.sides||{};
    S.dig2=S.dig2||{cells:[],found:[]};
    var cellsOf=function(f){ var out=[]; for(var r=0;r<ROWS;r++) for(var c=0;c<COLS;c++){ var x0=c*CW,y0=r*CH; if(x0<f.x+f.w-3&&x0+CW>f.x+3&&y0<f.y+f.h-3&&y0+CH>f.y+3) out.push(r*COLS+c); } return out; };
    FT.forEach(function(f){ f._cells=cellsOf(f); });
    var done=function(){ return FT.length>0&&FT.every(function(f){ return S.dig2.found.indexOf(f.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    function art(f){ var x=f.x,y=f.y,w=f.w,h=f.h,cx=x+w/2,cy=y+h/2,s='';
      if(f.shape==='ring'){ var r=Math.min(w,h)/2-4; for(var i=0;i<28;i++){ var a=i/28*Math.PI*2; s+='<circle cx="'+(cx+r*Math.cos(a)).toFixed(1)+'" cy="'+(cy+r*Math.sin(a)).toFixed(1)+'" r="2.6" class="ph"/>'; } for(var j=0;j<10;j++){ var b=j/10*Math.PI*2; s+='<circle cx="'+(cx+r*.62*Math.cos(b)).toFixed(1)+'" cy="'+(cy+r*.62*Math.sin(b)).toFixed(1)+'" r="2" class="ph"/>'; } return s+'<circle cx="'+cx+'" cy="'+cy+'" r="7" class="hearth"/><circle cx="'+cx+'" cy="'+cy+'" r="3" class="ember"/>'; }
      if(f.shape==='hut'){ var r2=Math.min(w,h)/2-3; for(var k=0;k<12;k++){ var c2=k/12*Math.PI*2; s+='<circle cx="'+(cx+r2*Math.cos(c2)).toFixed(1)+'" cy="'+(cy+r2*Math.sin(c2)).toFixed(1)+'" r="2.2" class="ph"/>'; } return s+'<circle cx="'+cx+'" cy="'+cy+'" r="3.5" class="hearth"/>'; }
      if(f.shape==='plaza') return '<rect x="'+(x+4)+'" y="'+(y+4)+'" width="'+(w-8)+'" height="'+(h-8)+'" rx="6" class="plz"/>';
      if(f.shape==='church'){ s='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" class="wall"/>'; for(var g=1;g<5;g++) for(var q=0;q<2;q++) s+='<rect x="'+(x+g*w/5-4)+'" y="'+(y+8+q*(h-22))+'" width="8" height="6" rx="1" class="grave"/>'; return s+'<path d="M'+(x+w-10)+','+(cy-6)+' v12 M'+(x+w-14)+','+(cy-2)+' h8" class="crs"/>'; }
      if(f.shape==='friary') return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" class="wall"/><line x1="'+(x+w/2)+'" y1="'+y+'" x2="'+(x+w/2)+'" y2="'+(y+h)+'" class="wall2"/><line x1="'+x+'" y1="'+cy+'" x2="'+(x+w/2)+'" y2="'+cy+'" class="wall2"/>';
      if(f.shape==='houses'){ for(var m=0;m<3;m++) s+='<rect x="'+(x+3+m*(w/3))+'" y="'+(y+6)+'" width="'+(w/3-8)+'" height="'+(h-12)+'" class="wall"/>'; return s; }
      if(f.shape==='fort'){ s='<rect x="'+(x+2)+'" y="'+(y+2)+'" width="'+(w-4)+'" height="'+(h-4)+'" class="moat"/>'; var per=2*(w+h-20), n=26; for(var t=0;t<n;t++){ var d=t/n*per, px, py, ww=w-20, hh=h-20; if(d<ww){ px=x+10+d; py=y+10; } else if(d<ww+hh){ px=x+w-10; py=y+10+(d-ww); } else if(d<2*ww+hh){ px=x+w-10-(d-ww-hh); py=y+h-10; } else { px=x+10; py=y+h-10-(d-2*ww-hh); } s+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="2" class="ph"/>'; } return s; }
      return ''; }
    var soil='';
    for(var r=0;r<ROWS;r++) for(var c=0;c<COLS;c++){ var i=r*COLS+c; soil+='<g class="sq" data-c="'+i+'" role="button" tabindex="0" aria-label="'+esc((cfg.sqT||'Dig square')+' '+(i+1))+'"><rect x="'+(c*CW+.5)+'" y="'+(r*CH+.5)+'" width="'+(CW-1)+'" height="'+(CH-1)+'" class="dirt"/><g class="clods"><circle cx="'+(c*CW+CW*.3)+'" cy="'+(r*CH+CH*.35)+'" r="3"/><circle cx="'+(c*CW+CW*.7)+'" cy="'+(r*CH+CH*.6)+'" r="2.4"/><circle cx="'+(c*CW+CW*.45)+'" cy="'+(r*CH+CH*.78)+'" r="1.8"/></g></g>'; }
    var grid=''; for(var gx=1;gx<COLS;gx++) grid+='<line x1="'+gx*CW+'" y1="0" x2="'+gx*CW+'" y2="'+VH+'"/>'; for(var gy=1;gy<ROWS;gy++) grid+='<line x1="0" y1="'+gy*CH+'" x2="'+VW+'" y2="'+gy*CH+'"/>';
    var g=el('div','spk spk-game spk-sdig');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Dig the Site')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-sdwrap"><svg viewBox="0 0 '+VW+' '+VH+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'An archaeology dig site')+'"><rect width="'+VW+'" height="'+VH+'" class="base"/>'
      +'<g class="feats">'+FT.map(function(f){ return '<g class="ft" data-f="'+esc(f.id)+'">'+art(f)+'</g>'; }).join('')+'</g>'
      +'<g class="soil">'+soil+'</g><g class="strings">'+grid+'</g>'
      +'<g class="tags">'+FT.map(function(f){ return '<g class="tag" data-f="'+esc(f.id)+'"><rect x="'+(f.x+f.w/2-34)+'" y="'+(f.y+f.h/2-8)+'" width="68" height="16" rx="8" class="tagbg side-'+esc(f.side)+'"/><text x="'+(f.x+f.w/2)+'" y="'+(f.y+f.h/2+4)+'" text-anchor="middle">'+esc(f.short||f.t)+'</text></g>'; }).join('')+'</g>'
      +'<rect x="1" y="1" width="'+(VW-2)+'" height="'+(VH-2)+'" class="frame"/></svg><span class="brush" aria-hidden="true">🖌️</span></div>'
      +'<p class="spk-bell-ct spk-sd-ct"></p>'
      +'<div class="spk-desktells spk-sdnotes"><div class="k">'+esc(cfg.tellsK||'Field notes: what each find tells a historian')+'</div><ol></ol></div>'
      +'<div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var svg=g.querySelector('svg'), wrap=g.querySelector('.spk-sdwrap'), was=done(), down=false;
    function paint(newF,newC){ g.querySelectorAll('.sq').forEach(function(q){ var i=+q.dataset.c, on=S.dig2.cells.indexOf(i)>=0; q.classList.toggle('gone',on); if(newC===i){ q.classList.add('sweep'); } });
      FT.forEach(function(f){ var on=S.dig2.found.indexOf(f.id)>=0; svg.querySelector('.ft[data-f="'+f.id+'"]').classList.toggle('found',on); svg.querySelector('.tag[data-f="'+f.id+'"]').classList.toggle('on',on); });
      if(newF){ var t=svg.querySelector('.tag[data-f="'+newF+'"]'); t.classList.remove('pop'); void t.getBoundingClientRect(); t.classList.add('pop'); }
      var L=FT.filter(function(f){ return S.dig2.found.indexOf(f.id)>=0; });
      g.querySelector('.spk-sdnotes ol').innerHTML=L.map(function(f){ return '<li'+(newF===f.id?' class="new"':'')+'><span aria-hidden="true">'+(f.ico||'')+'</span> <b>'+esc(f.t)+'</b> <span class="spk-sdside side-'+esc(f.side)+'">'+esc(SIDES[f.side]||f.side)+'</span> '+esc(f.tells||'')+'</li>'; }).join('');
      g.querySelector('.spk-sdnotes').classList.toggle('spk-hide',!L.length);
      var d=done(); g.querySelector('.spk-sd-ct').innerHTML=d?'':(S.dig2.cells.length===0?esc(cfg.startT||'Tap a square to brush the dirt away, or press and drag across the squares.'):'<b>'+L.length+' of '+FT.length+'</b> '+esc(cfg.countT||'finds uncovered. Keep brushing.'));
      if(d&&!was) setTimeout(function(){ sfx('win'); },500); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function brush(i){ if(i==null||isNaN(i)||S.dig2.cells.indexOf(i)>=0) return; ack('open'); S.dig2.cells.push(i); var nf=null;
      FT.forEach(function(f){ if(S.dig2.found.indexOf(f.id)<0&&f._cells.every(function(c){ return S.dig2.cells.indexOf(c)>=0; })){ S.dig2.found.push(f.id); nf=f.id; } });
      save(); sfx(nf?'clink':'brush'); paint(nf,i); if(nf){ refreshFile(); refreshVoice(); } }
    function cellAt(e){ var t=document.elementFromPoint(e.clientX,e.clientY), q=t&&t.closest&&t.closest('.spk-sdig .sq'); return q?+q.dataset.c:null; }
    function moveBrush(e){ var r=wrap.getBoundingClientRect(), b=wrap.querySelector('.brush'); b.style.left=(e.clientX-r.left)+'px'; b.style.top=(e.clientY-r.top)+'px'; }
    svg.addEventListener('pointerdown',function(e){ down=true; wrap.classList.add('brushing'); moveBrush(e); brush(cellAt(e)); });
    svg.addEventListener('pointermove',function(e){ moveBrush(e); if(down) brush(cellAt(e)); });
    window.addEventListener('pointerup',function(){ down=false; wrap.classList.remove('brushing'); });
    svg.addEventListener('pointerleave',function(){ wrap.classList.remove('brushing'); });
    svg.addEventListener('keydown',function(e){ var q=e.target.closest('.sq'); if(q&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); brush(+q.dataset.c); } });
    /* a drag from outside (a mouse drag with no pointer events) still digs */
    svg.addEventListener('dragover',function(e){ e.preventDefault(); brush(cellAt(e)); });
    paint();
    return {done:done, journal:function(e,NA){ var L=FT.filter(function(f){ return S.dig2.found.indexOf(f.id)>=0; }); return L.length?'<p class="a"><b>My dig found:</b> '+e(L.map(function(f){ return f.t+' ('+(SIDES[f.side]||f.side)+')'; }).join(' · '))+'</p>':NA; }};
  };

  /* ---- Explore reading · Walk the plaza (4.06.03): a town plan with stops. Only the next stop glows. Tap it and the
     footsteps walk there, then that part of the reading opens below. DATA: paras [{id,match}],
     stops [{id,ico,t,x,y,paras:[]}], smokeAt (stop index that dims the town) ---- */
  MOD.plazawalk=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.stops||[]; if(S.walk==null) S.walk=0;
    var done=function(){ return ST.length>0&&S.walk>=ST.length; };
    var plan=cfg.plan||{};
    var bg='<rect width="360" height="220" class="ground"/>'
      +'<path d="M0,196 C80,188 120,200 200,192 S330,186 360,190" class="road"/><text x="352" y="210" text-anchor="end" class="rlab">'+esc(cfg.roadT||'')+'</text>'
      +'<g class="trees">'+[[18,20],[340,24],[14,150],[344,140],[180,14],[300,10],[60,206]].map(function(t){ return '<circle cx="'+t[0]+'" cy="'+t[1]+'" r="9"/>'; }).join('')+'</g>'
      +'<rect x="132" y="62" width="108" height="92" rx="8" class="plaza"/>'
      +'<g class="ch"><circle cx="82" cy="108" r="44" class="thatch"/><circle cx="82" cy="108" r="12" class="hole"/><circle cx="40" cy="168" r="13" class="thatch small"/></g>'
      +'<g class="sp"><rect x="262" y="76" width="64" height="30" class="roof"/><path d="M318,82 v18 M313,88 h10" class="crs"/><rect x="266" y="114" width="40" height="22" class="roof2"/><rect x="276" y="148" width="18" height="12" class="roof2"/><rect x="300" y="148" width="18" height="12" class="roof2"/><rect x="250" y="20" width="44" height="34" class="fort"/></g>'
      +'<g class="smoke"><path d="M80,64 q-10,-20 6,-34 q14,-12 2,-28" /><path d="M296,70 q-8,-18 6,-30 q12,-12 0,-26"/><path d="M190,60 q-8,-16 4,-28 q10,-10 0,-24"/></g>';
    var w=el('div','spk spk-walk');
    w.innerHTML='<div class="spk-walkmap"><svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A plan of Mission San Luis')+'">'+bg
      +'<path class="trail" d=""/><g class="feet"></g>'
      +ST.map(function(s,i){ return '<g class="stop" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc((i+1)+'. '+s.t)+'"><circle cx="'+s.x+'" cy="'+s.y+'" r="13" class="ring"/><text x="'+s.x+'" y="'+(s.y+5)+'" text-anchor="middle" class="ico">'+s.ico+'</text><text x="'+s.x+'" y="'+(s.y+(s.ly||26))+'" text-anchor="middle" class="lab">'+esc(s.short||s.t)+'</text></g>'; }).join('')
      +'</svg></div><p class="spk-ys-ct spk-walkct"></p><div class="spk-walkread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-walkread'), boxes={}, svg=w.querySelector('svg');
    ST.forEach(function(s,i){ var b=el('div','spk-walkp'); b.innerHTML='<div class="tab"><span aria-hidden="true">'+s.ico+'</span> <b>'+esc(s.t)+'</b></div>'; list.appendChild(b); (s.paras||[]).forEach(function(pid){ var p=found[pid]; if(p) move(p,function(n){ b.appendChild(n); }); }); boxes[i]=b; });
    function trailTo(n){ var pts=ST.slice(0,n).map(function(s){ return s.x+','+s.y; }); return pts.length>1?'M'+pts.join(' L'):''; }
    function feet(a,b){ var fe=svg.querySelector('.feet'); fe.innerHTML=''; if(!a||!b) return; var dx=b.x-a.x, dy=b.y-a.y, L=Math.sqrt(dx*dx+dy*dy), n=Math.max(3,Math.floor(L/14)), ang=Math.atan2(dy,dx)*180/Math.PI+90;
      for(var k=1;k<n;k++){ var t=k/n, px=a.x+dx*t+(k%2?3:-3)*Math.cos(ang*Math.PI/180), py=a.y+dy*t+(k%2?3:-3)*Math.sin(ang*Math.PI/180); fe.innerHTML+='<ellipse cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" rx="1.8" ry="3" transform="rotate('+ang.toFixed(0)+' '+px.toFixed(1)+' '+py.toFixed(1)+')" style="animation-delay:'+(k*.12).toFixed(2)+'s"/>'; } }
    function paint(anim){ var n=S.walk;
      svg.querySelectorAll('.stop').forEach(function(s){ var i=+s.dataset.i; s.classList.toggle('been',i<n); s.classList.toggle('next',i===n); });
      ST.forEach(function(s,i){ var b=boxes[i]; b.classList.toggle('on',i<n); if(anim&&i===n-1){ b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } });
      svg.querySelector('.trail').setAttribute('d',trailTo(n));
      w.classList.toggle('smoky',cfg.smokeAt!=null&&n>cfg.smokeAt); w.classList.toggle('all',done());
      w.querySelector('.spk-walkct').innerHTML=done()?'<b>'+esc(cfg.allT||'You walked the whole town.')+'</b>':(n===0?esc(cfg.startT||'Tap the glowing stop to walk there.'):'<b>'+n+' of '+ST.length+'</b> '+esc(cfg.countT||'stops. Read this part, then tap the next glowing stop.'));
      var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i){ if(i!==S.walk||done()) return; ack('explore'); var a=ST[i-1], b=ST[i]; S.walk++; save(); feet(a,b); sfx(cfg.smokeAt!=null&&i===cfg.smokeAt?'paper':'click'); paint(true); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },500);
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },150); } }
    svg.addEventListener('click',function(e){ var s=e.target.closest('.stop'); if(!s) return; var i=+s.dataset.i; if(i<S.walk){ var b=boxes[i]; if(b&&b.scrollIntoView) try{ b.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} return; } if(i>S.walk){ w.querySelector('.spk-walkct').innerHTML=esc(cfg.orderT||'Walk in order: tap the stop that is glowing.'); return; } go(i); });
    svg.addEventListener('keydown',function(e){ var s=e.target.closest('.stop'); if(s&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); s.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Stops walked: '+Math.min(S.walk,ST.length)+' of '+ST.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Half the picture (4.06.03): a drawing of the plaza with half of it covered by paper.
     1) guess from the half you can see, 2) lift the paper (tap or drag it away), 3) mark each statement True or
     Not true now that you see the whole plaza. Also needs every label on the source photo tapped.
     DATA: guessQ, guesses [{id,t,r}], liftT, checks [{t,ok:true|false,miss}] ---- */
  MOD.halfpic=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var CK=cfg.checks||[]; S.half=S.half||{guess:null,lift:false,ans:{}};
    var right=function(){ return CK.length>0&&CK.every(function(c,i){ return S.half.ans[i]===(c.ok?'t':'f'); }); };
    var done=function(){ return !!S.half.guess&&S.half.lift&&right()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var scene='<svg viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'The plaza at Mission San Luis')+'">'
      +'<defs><linearGradient id="spkHalfSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE6F0"/><stop offset="1" stop-color="#F4EFDF"/></linearGradient></defs>'
      +'<rect width="400" height="190" fill="url(#spkHalfSky)"/><rect y="150" width="400" height="40" fill="#C9C08A"/><ellipse cx="200" cy="160" rx="80" ry="10" fill="#D8CC9A"/>'
      +'<g class="ch"><path d="M20,150 L80,40 Q100,30 120,40 L180,150 Z" fill="#9C8A66" stroke="#6E5E3E" stroke-width="1.5"/><path d="M80,40 Q100,30 120,40" fill="none" stroke="#5A4A2A" stroke-width="3"/>'+[60,80,100,120].map(function(y){ var k=(y-40)/110; return '<path d="M'+(80-60*k)+','+y+' Q100,'+(y+6)+' '+(120+60*k)+','+y+'" fill="none" stroke="#7E6E4A" stroke-width="1" opacity=".7"/>'; }).join('')+'<rect x="94" y="136" width="12" height="14" fill="#3A2A14"/></g>'
      +'<g class="sp"><rect x="250" y="96" width="110" height="54" fill="#EDE4CE" stroke="#7A6A4A" stroke-width="1.5"/><path d="M246,98 L305,66 L364,98 Z" fill="#8E6A3E" stroke="#5A3A18" stroke-width="1.5"/><path d="M305,48 v18 M299,54 h12" stroke="#3E2612" stroke-width="2.4"/><rect x="298" y="124" width="14" height="26" fill="#6B4423"/><rect x="214" y="122" width="30" height="28" fill="#E2D8BE" stroke="#7A6A4A"/><path d="M212,124 L229,112 L246,124 Z" fill="#8E6A3E"/></g>'
      +'<g class="trees"><circle cx="390" cy="120" r="14" fill="#5E8A4A"/><rect x="388" y="130" width="4" height="20" fill="#5A3A18"/><circle cx="196" cy="128" r="10" fill="#6E9A54"/><rect x="194" y="136" width="3" height="14" fill="#5A3A18"/></g>'
      +'</svg>';
    var g=el('div','spk spk-game spk-halfpic');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Half the Picture')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-hpwrap">'+scene+'<div class="flap" role="button" tabindex="0" aria-label="'+esc(cfg.liftT||'Lift the paper')+'"><span class="tape t1"></span><span class="tape t2"></span><span class="q">?</span><span class="lift">'+esc(cfg.liftT||'Lift the paper')+' ↖</span></div></div>'
      +'<div class="spk-step hp1"><div class="lab">1 · '+esc(cfg.guessQ||'')+'</div><div class="spk-opts">'+(cfg.guesses||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div><p class="spk-hpr"></p></div>'
      +'<div class="spk-step hp2 locked"><div class="lab">2 · '+esc(cfg.step2||'Now lift the paper and see the whole plaza.')+'</div><p class="spk-hpafter">'+esc(cfg.afterT||'')+'</p></div>'
      +'<div class="spk-step hp3 locked"><div class="lab">3 · '+esc(cfg.step3||'True or not true? Look at the whole plaza.')+'</div><div class="spk-hpchecks">'+CK.map(function(c,i){ return '<div class="row" data-i="'+i+'"><p>'+esc(c.t)+'</p><div class="spk-opts"><button type="button" class="spk-opt" data-v="t">'+esc(cfg.trueT||'True')+'</button><button type="button" class="spk-opt" data-v="f">'+esc(cfg.falseT||'Not true')+'</button></div><p class="res"></p></div>'; }).join('')+'</div></div>'
      +'<p class="spk-miss"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var flap=g.querySelector('.flap'), miss=g.querySelector('.spk-miss'), was=done();
    function paint(anim){ var gs=S.half.guess, gd=find(cfg.guesses,gs);
      g.querySelectorAll('.hp1 .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===gs); });
      g.querySelector('.spk-hpr').textContent=gd?gd.r||'':'';
      g.querySelector('.hp2').classList.toggle('locked',!gs); flap.classList.toggle('ready',!!gs&&!S.half.lift);
      g.classList.toggle('lifted',S.half.lift); if(anim==='lift'){ g.classList.add('lifting'); setTimeout(function(){ g.classList.remove('lifting'); },900); }
      g.querySelector('.hp3').classList.toggle('locked',!S.half.lift);
      g.querySelectorAll('.spk-hpchecks .row').forEach(function(r){ var i=+r.dataset.i, a=S.half.ans[i], ok=a!=null&&a===(CK[i].ok?'t':'f'); r.querySelectorAll('.spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===a); }); r.classList.toggle('good',ok); r.classList.toggle('bad',a!=null&&!ok); r.querySelector('.res').textContent=a==null?'':(ok?(CK[i].why||'✓'):(CK[i].miss||'Look at the whole plaza again.')); });
      var gate=''; if(right()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the photo above.'; else if(right()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Walk the Plaza above.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var d=done(); if(d&&!was) setTimeout(function(){ sfx('win'); },400); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function lift(){ if(!S.half.guess){ miss.textContent=cfg.guessFirstT||'First make your guess in step 1. Then lift the paper.'; return; } if(S.half.lift) return; S.half.lift=true; save(); miss.textContent=''; sfx('paper'); paint('lift'); refreshFile(); refreshVoice(); }
    g.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(o){ ack('explore');
        if(o.closest('.hp1')){ if(S.half.lift) return; S.half.guess=o.dataset.v; save(); sfx('click'); miss.textContent=''; paint(); return; }
        var r=o.closest('.row'); if(r){ if(!S.half.lift) return; var i=+r.dataset.i; S.half.ans[i]=o.dataset.v; save(); var ok=o.dataset.v===(CK[i].ok?'t':'f'); sfx(ok?'clink':'click'); if(!ok){ r.classList.add('shake'); setTimeout(function(){ r.classList.remove('shake'); },450); missBeat(CK[i].miss||''); } paint(); refreshFile(); refreshVoice(); return; } }
      if(e.target.closest('.flap')) lift(); });
    flap.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); lift(); } });
    /* drag the paper away: press on it and pull left */
    var sx=null; flap.addEventListener('pointerdown',function(e){ sx=e.clientX; });
    window.addEventListener('pointerup',function(e){ if(sx!=null&&Math.abs(e.clientX-sx)>30) lift(); sx=null; });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var gd=find(cfg.guesses,S.half.guess); return gd?'<p class="a"><b>My first guess, from half the picture:</b> '+e(gd.t)+'</p>'+(right()?'<p class="a">Then I saw the whole plaza and checked every statement.</p>':''):NA; }};
  };

  /* ---- Planner · Plaza planner (4.06.03): two doors across a plaza. Pick a detail for each door, a "shared" detail
     for the plaza, and a "this matters because". Each lights its part of the picture; all four open the doors.
     Notes only — the student writes. DATA: parts [{id,lab,q,ico,opts:[{id,t}]}] ---- */
  MOD.plazaplan=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var PT=cfg.parts||[]; S.pplan=S.pplan||{}; var was=null;
    var done=function(){ return PT.length>0&&PT.every(function(p){ return !!S.pplan[p.id]; }); };
    var val=function(p){ var o=find(p.opts,S.pplan[p.id]); return o?o.t:''; };
    var pic='<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="400" height="150" fill="#F4EFDF"/><rect y="118" width="400" height="32" fill="#D6CC9C"/>'
      +'<g class="pp-ch"><path d="M10,118 L62,30 Q80,22 98,30 L150,118 Z" class="b"/><path d="M68,118 v-22 q12,-10 24,0 v22 Z" class="door"/><path d="M68,118 v-22 q12,-10 24,0 v22 Z" class="leaf"/></g>'
      +'<g class="pp-sp"><rect x="262" y="66" width="122" height="52" class="b"/><path d="M258,68 L323,38 L388,68 Z" class="r"/><path d="M323,20 v18 M317,26 h12" stroke="#3E2612" stroke-width="2.4"/><rect x="311" y="90" width="24" height="28" class="door"/><rect x="311" y="90" width="24" height="28" class="leaf"/></g>'
      +'<g class="pp-plz"><ellipse cx="205" cy="128" rx="54" ry="10" class="b"/><circle cx="205" cy="104" r="12" class="sun"/></g>'
      +'<g class="pp-why"><rect x="150" y="8" width="110" height="22" rx="11" class="b"/><text x="205" y="23" text-anchor="middle">'+esc(cfg.whyLab||'because…')+'</text></g></svg>';
    var b=el('div','spk spk-builder spk-pplan');
    b.innerHTML=voice(cfg.voice,cfg)+'<div class="spk-pppic">'+pic+'</div>'
      +PT.map(function(p,i){ return '<div class="spk-step" data-r="'+esc(p.id)+'"><div class="lab">'+(p.ico||'')+' '+(i+1)+' · '+esc(p.q||p.lab)+'</div><div class="spk-opts">'+(p.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join('')
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Both doors are open. Now write your entry in Step 3.')+'</p><div class="spk-plan"></div>';
    function lines(){ return PT.filter(function(p){ return S.pplan[p.id]; }).map(function(p){ return [p.lab,val(p)]; }); }
    function paint(){ PT.forEach(function(p){ b.querySelectorAll('.spk-step[data-r="'+p.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===S.pplan[p.id]); }); var part=b.querySelector('.pp-'+(p.part||p.id)); if(part) part.classList.toggle('lit',!!S.pplan[p.id]); });
      var all=done(); if(all&&was===false){ sfx('door'); setTimeout(function(){ sfx('win'); },350); } was=all; b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var r=o.closest('.spk-step').dataset.r; S.pplan[r]=o.dataset.v; save(); sfx('click'); paint(); });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Raise the roof (4.06.03, cap = head): a council house with no thatch. Tap each word post to
     hear its word (g4ss-<lesson>-cap-<n>.mp3 when it exists). Then put each meaning on its word, and a ring of
     thatch goes on, bottom to top, until the roof reaches its head. ---- */
  MOD.roofrings=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.rr=S.rr||{heard:[],up:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.rr.up.length===W.length; };
    var N=Math.max(W.length,1), rings='';
    for(var k=0;k<N;k++){ var y0=150-k*(110/N), y1=150-(k+1)*(110/N), hw0=150-k*(120/N), hw1=150-(k+1)*(120/N); rings+='<path class="ring" data-k="'+k+'" d="M'+(200-hw0)+','+y0.toFixed(1)+' L'+(200-hw1).toFixed(1)+','+y1.toFixed(1)+' L'+(200+hw1).toFixed(1)+','+y1.toFixed(1)+' L'+(200+hw0)+','+y0.toFixed(1)+' Z"/>'; }
    var svg='<svg class="spk-rrhouse" viewBox="0 0 400 175" aria-hidden="true"><rect width="400" height="175" fill="#EAF3F4"/><rect y="150" width="400" height="25" fill="#C9C08A"/>'
      +'<g class="poles">'+[60,100,140,180,220,260,300,340].map(function(x){ return '<line x1="'+x+'" y1="150" x2="'+(200+(x-200)*.25)+'" y2="40"/>'; }).join('')+'</g>'
      +'<g class="rings">'+rings+'</g><rect x="190" y="132" width="20" height="18" fill="#3A2A14"/>'
      +'<g class="smk"><path d="M200,38 q-8,-12 2,-20 q9,-8 0,-16"/></g></svg>';
    var g=el('div','spk spk-rroof');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Raise the Roof')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-rrwrap">'+svg+'</div>'
      +'<div class="spk-rrposts">'+W.map(function(x,i){ return '<div class="post" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-rr-ct"></p><div class="spk-chips spk-rrmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-rrmeans'), miss=g.querySelector('.spk-miss'), posts=g.querySelector('.spk-rrposts'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-cap-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-rrmean','<span class="ico">🌾</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.rr.heard.length===W.length, n=S.rr.up.length;
      posts.querySelectorAll('.post').forEach(function(c){ var i=+c.dataset.i, h=S.rr.heard.indexOf(i)>=0, u=S.rr.up.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      g.querySelectorAll('.ring').forEach(function(r){ var k=+r.dataset.k, on=k<n; if(on&&!r.classList.contains('on')&&anim!=null){ r.classList.add('drop'); setTimeout(function(){ r.classList.remove('drop'); },700); } r.classList.toggle('on',on); });
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-rrmean').forEach(function(t){ var f=S.rr.up.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-rr-ct').innerHTML=!allH?'<b>'+S.rr.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(done()?'':'<b>'+n+' of '+W.length+'</b> '+esc(cfg.upT||'rings of thatch on. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ posts.querySelectorAll('.post').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.rr.up.indexOf(i)>=0||S.rr.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.rr.up.push(i); save(); sel=null; miss.textContent=''; sfx('plant'); paint(i); if(done()) setTimeout(function(){ sfx('win'); },700); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    posts.addEventListener('click',function(e){ var c=e.target.closest('.post'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.rr.heard.length===W.length){ attempt(sel,c); return; }
      if(S.rr.heard.indexOf(i)<0){ S.rr.heard.push(i); save(); sfx('click'); } say(i); paint(i); });
    posts.addEventListener('keydown',function(e){ var c=e.target.closest('.post'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-rrmean'); if(!t) return; if(S.rr.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-rrmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-rrmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-rrmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    posts.addEventListener('dragover',function(e){ var c=e.target.closest('.post'); posts.querySelectorAll('.post').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    posts.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.post')); });
    paint(); return {done:done};
  };

  /* ---- Scene 1 · Mission storehouse (4.06.04): two baskets. Put each food or animal in the basket it belongs in
     (tap it, then a basket, or drag). Each landing adds a line saying where it came from.
     DATA: baskets [{id,ico,t}], items [{id,ico,t,b,tells,miss}] ---- */
  MOD.storehouse=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var BK=cfg.baskets||[], IT=cfg.items||[]; S.store=S.store||[];
    var done=function(){ return IT.length>0&&IT.every(function(x){ return S.store.indexOf(x.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-store');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Mission Storehouse')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-chips spk-sttray"></div><p class="spk-miss"></p>'
      +'<div class="spk-stbaskets">'+BK.map(function(b){ return '<div class="bk" data-b="'+esc(b.id)+'" role="button" tabindex="0" aria-label="'+esc(b.t)+'"><div class="lab"><span aria-hidden="true">'+(b.ico||'🧺')+'</span> '+esc(b.t)+'</div><svg class="wv" viewBox="0 0 200 70" aria-hidden="true"><path d="M8,8 L192,8 L176,66 L24,66 Z" class="body"/>'+[20,34,48].map(function(y){ return '<path d="M14,'+y+' L186,'+y+'" class="weave"/>'; }).join('')+'<path d="M8,8 L192,8" class="rim"/></svg><div class="in"></div></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-st-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var tray=g.querySelector('.spk-sttray'), miss=g.querySelector('.spk-miss'), sel=null, was=done();
    shuffle(IT).forEach(function(x){ var c=el('div','spk-chip noimg spk-stitem','<span class="ico">'+(x.ico||'🌽')+'</span><span><b>'+esc(x.t)+'</b></span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=x.id; tray.appendChild(c); });
    function paint(drop){ IT.forEach(function(x){ var on=S.store.indexOf(x.id)>=0, c=tray.querySelector('[data-i="'+x.id+'"]'); c.classList.toggle('spk-hide',on); c.draggable=!on; });
      BK.forEach(function(b){ var box=g.querySelector('.bk[data-b="'+b.id+'"] .in'), L=IT.filter(function(x){ return x.b===b.id&&S.store.indexOf(x.id)>=0; });
        box.innerHTML=L.map(function(x){ return '<div class="it'+(drop===x.id?' new':'')+'"><span class="ico" aria-hidden="true">'+(x.ico||'')+'</span><b>'+esc(x.t)+'.</b> '+esc(x.tells||'')+'</div>'; }).join('');
        if(drop&&L.some(function(x){ return x.id===drop; })){ var bk=g.querySelector('.bk[data-b="'+b.id+'"]'); bk.classList.remove('bump'); void bk.offsetWidth; bk.classList.add('bump'); } });
      var d=done(); g.querySelector('.spk-st-ct').innerHTML=d?'':'<b>'+S.store.length+' of '+IT.length+'</b> '+esc(cfg.countT||'in the baskets.');
      if(d&&!was) setTimeout(function(){ sfx('win'); },500); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ g.querySelectorAll('.bk').forEach(function(b){ b.classList.toggle('armed',on); b.classList.remove('over'); }); }
    function attempt(chip,bk){ if(!chip||!bk) return; var x=find(IT,chip.dataset.i); if(!x||S.store.indexOf(x.id)>=0) return; arm(false);
      if(x.b===bk.dataset.b){ S.store.push(x.id); save(); sel=null; miss.textContent=''; sfx(x.sound||'plant'); paint(x.id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=x.miss||''; miss.textContent=m; missBeat(m); } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-stitem'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-stitem').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-stitem'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-stitem'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); });
    var bks=g.querySelector('.spk-stbaskets');
    bks.addEventListener('click',function(e){ var b=e.target.closest('.bk'); if(!b) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a food or animal first, then tap its basket.'; return; } attempt(sel,b); });
    bks.addEventListener('keydown',function(e){ var b=e.target.closest('.bk'); if(b&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); b.click(); } });
    bks.addEventListener('dragover',function(e){ var b=e.target.closest('.bk'); g.querySelectorAll('.bk').forEach(function(x){ x.classList.toggle('over',x===b); }); if(b){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    bks.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.bk')); });
    paint();
    return {done:done, journal:function(e,NA){ var L=BK.map(function(b){ var it=IT.filter(function(x){ return x.b===b.id&&S.store.indexOf(x.id)>=0; }); return it.length?'<p class="a"><b>'+e(b.t)+':</b> '+e(it.map(function(x){ return x.t; }).join(', '))+'</p>':''; }).join(''); return L||NA; }};
  };

  /* ---- Explore reading · Move the sun (4.06.04): a sky over a mission with an arc of stops. Tap the next glowing
     stop (or drag the sun along the arc) and the sun moves there; the sky changes and that part of the reading
     opens. A stop with bell:true rings the bell. A stop with away:true sits off the arc, on the road.
     DATA: paras [{id,match}], stops [{id,t,short,at (0..1 along the arc) | away:true, sky, bell, paras:[]}] ---- */
  MOD.sunpath=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.stops||[]; if(S.sun==null) S.sun=0;
    var done=function(){ return ST.length>0&&S.sun>=ST.length; };
    var CX=200, CY=150, RX=165, RY=118;
    function pt(at){ var a=Math.PI*(1-at); return [CX+RX*Math.cos(a), CY-RY*Math.sin(a)]; }
    ST.forEach(function(s){ var p=s.away?[300,186]:pt(s.at); s._x=p[0]; s._y=p[1]; });
    var w=el('div','spk spk-sun');
    w.innerHTML='<div class="spk-sunsky"><svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'The sky over a mission, from sunrise to sunset')+'">'
      +'<rect width="400" height="200" class="sky"/><path d="M'+(CX-RX)+','+CY+' A'+RX+','+RY+' 0 0 1 '+(CX+RX)+','+CY+'" class="arc"/>'
      +'<g class="ground"><rect y="150" width="400" height="50" fill="#9DAE6C"/><g fill="none" stroke="#7E8F4E" stroke-width="1.4">'+[160,170,180,190].map(function(y){ return '<path d="M0,'+y+' Q100,'+(y-4)+' 200,'+y+' T400,'+y+'"/>'; }).join('')+'</g>'
      +'<path d="M120,150 L150,112 Q160,106 170,112 L200,150 Z" fill="#A8956A" stroke="#6E5E3E"/><rect x="236" y="120" width="56" height="30" fill="#EDE4CE" stroke="#7A6A4A"/><path d="M232,122 L264,104 L296,122 Z" fill="#8E6A3E"/><g class="belltower"><rect x="300" y="104" width="14" height="46" fill="#D8CBA8" stroke="#7A6A4A"/><path class="bell" d="M303,112 q4,-6 8,0 l1,6 h-10 z" fill="#B8862E"/></g>'
      +'<path class="road" d="M262,151 C276,164 284,180 300,200" fill="none" stroke="#C9B07A" stroke-width="6" stroke-linecap="round"/></g>'
      +'<g class="stops">'+ST.map(function(s,i){ return '<g class="stop'+(s.away?' away':'')+'" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc((i+1)+'. '+s.t)+'"><circle cx="'+s._x.toFixed(1)+'" cy="'+s._y.toFixed(1)+'" r="9" class="dot"/><text x="'+s._x.toFixed(1)+'" y="'+(s._y+(s.away?4:22)).toFixed(1)+'" text-anchor="middle" class="lab">'+esc(s.short||s.t)+'</text></g>'; }).join('')+'</g>'
      +'<g class="sunw"><g class="sun"><circle r="15" class="glow"/><circle r="9" class="core"/></g></g>'
      +'<g class="rings" aria-hidden="true"><circle cx="307" cy="112" r="8"/><circle cx="307" cy="112" r="8"/></g>'
      +'</svg></div><p class="spk-ys-ct spk-sunct"></p><div class="spk-sunread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-sunread'), boxes={}, svg=w.querySelector('svg'), sun=svg.querySelector('.sunw');
    ST.forEach(function(s,i){ var b=el('div','spk-sunp'); b.innerHTML='<div class="tab"><b>'+esc(s.t)+'</b></div>'; list.appendChild(b); (s.paras||[]).forEach(function(pid){ var p=found[pid]; if(p) move(p,function(n){ b.appendChild(n); }); }); boxes[i]=b; });
    function place(n){ var at=n===0?-1:n-1; var s=at<0?null:ST[at]; var x,y; if(!s){ var p=pt(0); x=p[0]; y=p[1]+26; } else if(s.away){ var q=pt(cfg.awayAt||0.72); x=q[0]; y=q[1]; } else { x=s._x; y=s._y; }
      sun.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+')'); var sky=s&&s.sky?s.sky:(cfg.nightSky||'#2F3B5C'); svg.querySelector('.sky').style.fill=sky; w.classList.toggle('night',!s); w.classList.toggle('road',!!(s&&s.away)); }
    function paint(anim){ var n=S.sun;
      svg.querySelectorAll('.stop').forEach(function(g2){ var i=+g2.dataset.i; g2.classList.toggle('been',i<n); g2.classList.toggle('next',i===n); });
      ST.forEach(function(s,i){ var b=boxes[i]; b.classList.toggle('on',i<n); if(anim&&i===n-1){ b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } });
      place(n); w.classList.toggle('all',done());
      w.querySelector('.spk-sunct').innerHTML=done()?'<b>'+esc(cfg.allT||'You followed the whole day.')+'</b>':(n===0?esc(cfg.startT||'Tap the glowing spot to move the sun.'):'<b>'+n+' of '+ST.length+'</b> '+esc(cfg.countT||'parts of the day. Read this part, then move the sun again.'));
      var th=body.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i){ if(i!==S.sun||done()) return; ack('explore'); S.sun++; save(); var s=ST[i]; if(s.bell){ sfx('bell'); w.classList.remove('ring'); void w.offsetWidth; w.classList.add('ring'); } else sfx(s.away?'paper':'click'); paint(true); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },700);
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },200); } }
    svg.addEventListener('click',function(e){ var s=e.target.closest('.stop'); if(!s) return; var i=+s.dataset.i; if(i<S.sun){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} return; } if(i>S.sun){ w.querySelector('.spk-sunct').innerHTML=esc(cfg.orderT||'Follow the day in order: tap the spot that is glowing.'); return; } go(i); });
    svg.addEventListener('keydown',function(e){ var s=e.target.closest('.stop'); if(s&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); s.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    /* drag the sun: press on the sun and pull it toward the next spot */
    var drag=false; sun.addEventListener('pointerdown',function(e){ drag=true; e.preventDefault(); });
    window.addEventListener('pointerup',function(e){ if(!drag) return; drag=false; if(done()) return; var r=svg.getBoundingClientRect(), x=(e.clientX-r.left)/r.width*400, y=(e.clientY-r.top)/r.height*200, s=ST[S.sun]; if(Math.abs(x-s._x)<40&&Math.abs(y-s._y)<40) go(S.sun); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Parts of the day followed: '+Math.min(S.sun,ST.length)+' of '+ST.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Shadow clock (4.06.04): a pole in the plaza. Put each event where the pole's shadow
     would be at that time (tap the event, then a shadow spot, or drag). Then pick the "because" sentences that
     are real causes. Also needs the source labels and the reading. DATA: spots [{id,t,len,dir:'w'|'e',sun}],
     events [{id,t,ico,spot,miss}], checks [{t,ok,why,miss}], need (true picks needed) ---- */
  MOD.shadowclock=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var SP=cfg.spots||[], EV=cfg.events||[], CK=cfg.checks||[], NEED=cfg.need||2; S.shadow=S.shadow||{put:[],pick:[]};
    var placed=function(){ return EV.length>0&&EV.every(function(x){ return S.shadow.put.indexOf(x.id)>=0; }); };
    var picked=function(){ var t=S.shadow.pick.filter(function(i){ return CK[i]&&CK[i].ok; }).length, f=S.shadow.pick.filter(function(i){ return CK[i]&&!CK[i].ok; }).length; return t>=NEED&&f===0; };
    var done=function(){ return placed()&&picked()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var PX=200, PY=150;
    SP.forEach(function(s){ var L=s.len, dx=s.dir==='w'?-L:L; s._x2=PX+dx; s._y2=PY+L*.18; });
    var svg='<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A pole in the plaza and its shadow')+'">'
      +'<rect width="400" height="200" class="sky"/><rect y="118" width="400" height="82" fill="#E8DDB2"/><ellipse cx="200" cy="158" rx="190" ry="34" fill="#F1E8C8" stroke="#C9B486" stroke-dasharray="4 3"/>'
      +'<text x="18" y="112" class="cmp">W</text><text x="376" y="112" class="cmp">E</text>'
      +'<g class="sunv"><circle r="12" class="core"/></g>'
      +'<rect x="197" y="70" width="6" height="80" rx="2" fill="#5A3A18"/><circle cx="200" cy="68" r="5" fill="#8A6A3A"/>'
      +'<g class="shadows">'+SP.map(function(s){ return '<g class="sh" data-s="'+esc(s.id)+'" role="button" tabindex="0" aria-label="'+esc(s.t)+'"><line x1="'+PX+'" y1="'+PY+'" x2="'+s._x2.toFixed(1)+'" y2="'+s._y2.toFixed(1)+'" class="ghost"/><line x1="'+PX+'" y1="'+PY+'" x2="'+s._x2.toFixed(1)+'" y2="'+s._y2.toFixed(1)+'" class="real"/><circle cx="'+s._x2.toFixed(1)+'" cy="'+s._y2.toFixed(1)+'" r="14" class="tip"/><text x="'+s._x2.toFixed(1)+'" y="'+(s._y2+4).toFixed(1)+'" text-anchor="middle" class="tl"></text></g>'; }).join('')+'</g>'
      +'</svg>';
    var g=el('div','spk spk-game spk-shadow');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Shadow Clock')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-shwrap">'+svg+'</div>'
      +'<div class="spk-chips spk-shevents"></div><p class="spk-miss"></p>'
      +'<ol class="spk-shorder"></ol>'
      +'<div class="spk-step sh2 locked"><div class="lab">2 · '+esc(cfg.step2||'Which of these are real causes? Tap each sentence that is true.')+'</div><div class="spk-shchecks">'+CK.map(function(c,i){ return '<button type="button" class="row" data-i="'+i+'"><span class="box" aria-hidden="true"></span><span class="t">'+esc(c.t)+'</span><span class="res"></span></button>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-sh-ct"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var chips=g.querySelector('.spk-shevents'), miss=g.querySelector('.spk-miss'), sel=null, was=done(), S2=g.querySelector('svg');
    shuffle(EV).forEach(function(x){ var c=el('div','spk-chip noimg spk-shev','<span class="ico">'+(x.ico||'🔔')+'</span><span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.e=x.id; chips.appendChild(c); });
    function sunAt(s){ var x=s.dir==='w'?PX+(s.len*1.1):PX-(s.len*1.1); var y=Math.max(18,104-(150-s.len)*0.55); return [Math.max(16,Math.min(384,x)),y]; }
    function paint(drop){ var P=S.shadow.put;
      SP.forEach(function(s){ var ev=EV.filter(function(x){ return x.spot===s.id&&P.indexOf(x.id)>=0; })[0], gEl=S2.querySelector('.sh[data-s="'+s.id+'"]'); gEl.classList.toggle('full',!!ev); gEl.querySelector('.tl').textContent=ev?(ev.ico||'✓'):''; if(drop&&ev&&ev.id===drop){ gEl.classList.remove('cast'); void gEl.getBoundingClientRect(); gEl.classList.add('cast'); var p=sunAt(s); S2.querySelector('.sunv').setAttribute('transform','translate('+p[0].toFixed(1)+','+p[1].toFixed(1)+')'); S2.querySelector('.sunv').classList.add('on'); } });
      chips.querySelectorAll('.spk-shev').forEach(function(c){ var on=P.indexOf(c.dataset.e)>=0; c.classList.toggle('spk-hide',on); c.draggable=!on; });
      var ord=SP.slice().sort(function(a,b){ return a.order-b.order; }).map(function(s){ var ev=EV.filter(function(x){ return x.spot===s.id&&P.indexOf(x.id)>=0; })[0]; return ev?'<li><b>'+esc(s.t)+':</b> '+esc(ev.t)+'</li>':''; }).join('');
      g.querySelector('.spk-shorder').innerHTML=ord; g.querySelector('.spk-shorder').classList.toggle('spk-hide',!ord);
      g.querySelector('.sh2').classList.toggle('locked',!placed());
      g.querySelectorAll('.spk-shchecks .row').forEach(function(r){ var i=+r.dataset.i, on=S.shadow.pick.indexOf(i)>=0, c=CK[i]; r.classList.toggle('on',on); r.classList.toggle('good',on&&c.ok); r.classList.toggle('bad',on&&!c.ok); r.querySelector('.res').textContent=on?(c.ok?(c.why||'✓'):(c.miss||'')):''; });
      var gate=''; if(placed()&&picked()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the drawing above.'; else if(placed()&&picked()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Learn the Story above.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var tn=S.shadow.pick.filter(function(i){ return CK[i].ok; }).length;
      g.querySelector('.spk-sh-ct').innerHTML=!placed()?'<b>'+P.length+' of '+EV.length+'</b> '+esc(cfg.countT||'events on the shadow clock.'):(picked()?'':'<b>'+tn+' of '+NEED+'</b> '+esc(cfg.pickT||'true causes found. Tap a wrong one again to take it back.'));
      var d=done(); if(d&&!was) setTimeout(function(){ sfx('win'); },400); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ S2.querySelectorAll('.sh').forEach(function(x){ x.classList.toggle('armed',on&&!x.classList.contains('full')); x.classList.remove('over'); }); }
    function attempt(chip,sh){ if(!chip||!sh) return; var x=find(EV,chip.dataset.e); if(!x||S.shadow.put.indexOf(x.id)>=0) return; arm(false);
      if(x.spot===sh.dataset.s){ S.shadow.put.push(x.id); save(); sel=null; miss.textContent=''; sfx('slide'); paint(x.id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=x.miss||cfg.missT||''; miss.textContent=m; missBeat(m); } }
    chips.addEventListener('click',function(e){ var c=e.target.closest('.spk-shev'); if(!c) return; ack('explore'); chips.querySelectorAll('.spk-shev').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    chips.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-shev'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    chips.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-shev'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('explore'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.e); e.dataTransfer.effectAllowed='move'; arm(true); });
    chips.addEventListener('dragend',function(){ arm(false); });
    S2.addEventListener('click',function(e){ var sh=e.target.closest('.sh'); if(!sh||sh.classList.contains('full')) return; if(!sel){ miss.textContent=cfg.firstT||'Tap an event first, then tap the shadow that matches its time.'; return; } attempt(sel,sh); });
    S2.addEventListener('keydown',function(e){ var sh=e.target.closest('.sh'); if(sh&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); sh.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    S2.addEventListener('dragover',function(e){ var sh=e.target.closest('.sh'); S2.querySelectorAll('.sh').forEach(function(x){ x.classList.toggle('over',x===sh); }); if(sh&&!sh.classList.contains('full')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    S2.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.sh')); });
    g.querySelector('.spk-shchecks').addEventListener('click',function(e){ var r=e.target.closest('.row'); if(!r||!placed()) return; ack('explore'); var i=+r.dataset.i, k=S.shadow.pick.indexOf(i); if(k>=0) S.shadow.pick.splice(k,1); else { S.shadow.pick.push(i); if(CK[i].ok) sfx('clink'); else { sfx('click'); r.classList.add('shake'); setTimeout(function(){ r.classList.remove('shake'); },450); missBeat(CK[i].miss||''); } } save(); paint(); refreshFile(); refreshVoice(); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var P=SP.slice().sort(function(a,b){ return a.order-b.order; }).map(function(s){ var ev=EV.filter(function(x){ return x.spot===s.id&&S.shadow.put.indexOf(x.id)>=0; })[0]; return ev?s.t+': '+ev.t:null; }).filter(Boolean); var C=S.shadow.pick.filter(function(i){ return CK[i].ok; }).map(function(i){ return CK[i].t; }); return P.length?'<p class="a"><b>In time order:</b> '+e(P.join(' → '))+'</p>'+(C.length?'<p class="a"><b>Real causes:</b> '+e(C.join(' · '))+'</p>':''):NA; }};
  };

  /* ---- Planner · Comic strip (4.06.04): three panels (morning / midday / evening). Pick a detail for each and
     the panel draws itself; then pick a "because" that links two panels. Notes only — the student writes.
     DATA: panels [{id,lab,q,sky,ico,opts:[{id,t}]}], link {lab,q,opts:[{id,t}]} ---- */
  MOD.comicstrip=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var PN=cfg.panels||[], LK=cfg.link||{opts:[]}; S.comic=S.comic||{}; var was=null;
    var done=function(){ return PN.length>0&&PN.every(function(p){ return !!S.comic[p.id]; })&&!!S.comic.link; };
    var val=function(id){ if(id==='link'){ var o=find(LK.opts,S.comic.link); return o?o.t:''; } var p=find(PN,id), o2=p&&find(p.opts,S.comic[id]); return o2?o2.t:''; };
    var b=el('div','spk spk-builder spk-comic');
    b.innerHTML=voice(cfg.voice,cfg)+'<div class="spk-cmstrip">'+PN.map(function(p,i){ return '<div class="panel" data-p="'+esc(p.id)+'" style="--sky:'+esc(p.sky||'#CFE6F0')+'"><span class="n">'+(i+1)+'</span><span class="pl">'+esc(p.lab)+'</span><span class="ico" aria-hidden="true">'+(p.ico||'')+'</span><span class="cap"></span></div>'+(i<PN.length-1?'<span class="arrow" data-a="'+i+'" aria-hidden="true">→</span>':''); }).join('')+'</div>'
      +PN.map(function(p,i){ return '<div class="spk-step" data-r="'+esc(p.id)+'"><div class="lab">🖼️ '+(i+1)+' · '+esc(p.q||p.lab)+'</div><div class="spk-opts">'+(p.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join('')
      +'<div class="spk-step" data-r="link"><div class="lab">🔗 '+(PN.length+1)+' · '+esc(LK.q||LK.lab||'Pick a because')+'</div><div class="spk-opts">'+(LK.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Your comic strip is done. Now write in Step 3.')+'</p><div class="spk-plan"></div>';
    function lines(){ return PN.filter(function(p){ return S.comic[p.id]; }).map(function(p){ return [p.lab,val(p.id)]; }).concat(S.comic.link?[[LK.lab||'Because',val('link')]]:[]); }
    function paint(newp){ PN.concat([{id:'link'}]).forEach(function(r){ b.querySelectorAll('.spk-step[data-r="'+r.id+'"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===S.comic[r.id]); }); });
      PN.forEach(function(p){ var pe=b.querySelector('.panel[data-p="'+p.id+'"]'); pe.classList.toggle('full',!!S.comic[p.id]); pe.querySelector('.cap').textContent=val(p.id); if(newp===p.id){ pe.classList.remove('draw'); void pe.offsetWidth; pe.classList.add('draw'); } });
      b.querySelector('.spk-cmstrip').classList.toggle('linked',!!S.comic.link);
      var all=done(); if(all&&was===false){ sfx('paper'); setTimeout(function(){ sfx('win'); },300); } was=all; b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var r=o.closest('.spk-step').dataset.r; S.comic[r]=o.dataset.v; save(); sfx('click'); paint(r); });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Wind the clock (4.06.04, chron = time): a clock face with a word at 12, 3, 6 and 9. Tap each
     word to hear it (g4ss-<lesson>-chron-<n>.mp3 when it exists). Then put each meaning on its word; the hand
     sweeps to that hour with a tick, and when all are set the clock chimes. ---- */
  MOD.windclock=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.wc=S.wc||{heard:[],up:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.wc.up.length===W.length; };
    var POS=[[50,10],[90,50],[50,90],[10,50]];
    var ticks=''; for(var t=0;t<12;t++){ var a=t/12*Math.PI*2; ticks+='<line x1="'+(100+70*Math.sin(a)).toFixed(1)+'" y1="'+(100-70*Math.cos(a)).toFixed(1)+'" x2="'+(100+78*Math.sin(a)).toFixed(1)+'" y2="'+(100-78*Math.cos(a)).toFixed(1)+'" class="tk'+(t%3===0?' big':'')+'"/>'; }
    var g=el('div','spk spk-wclock');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Wind the Clock')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-wcwrap"><svg class="face" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" class="rim"/><circle cx="100" cy="100" r="80" class="dial"/>'+ticks+'<g class="hand"><line x1="100" y1="100" x2="100" y2="38" class="h"/></g><circle cx="100" cy="100" r="5" class="pin"/></svg>'
      +W.map(function(x,i){ var p=POS[i%4]; return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" style="left:'+p[0]+'%;top:'+p[1]+'%" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-wc-ct"></p><div class="spk-chips spk-wcmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-wcmeans'), miss=g.querySelector('.spk-miss'), wrap=g.querySelector('.spk-wcwrap'), hand=g.querySelector('.hand'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-chron-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-wcmean','<span class="ico">⏱️</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.wc.heard.length===W.length, n=S.wc.up.length;
      wrap.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.wc.heard.indexOf(i)>=0, u=S.wc.up.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      hand.style.transform='rotate('+(n*90)+'deg)';
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-wcmean').forEach(function(t){ var f=S.wc.up.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-wc-ct').innerHTML=!allH?'<b>'+S.wc.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word on the clock to hear it.'):(done()?'':'<b>'+n+' of '+W.length+'</b> '+esc(cfg.upT||'hours set. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ wrap.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.wc.up.indexOf(i)>=0||S.wc.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.wc.up.push(i); save(); sel=null; miss.textContent=''; sfx('clink'); paint(i); if(done()) setTimeout(function(){ sfx('bell'); setTimeout(function(){ sfx('win'); },600); },500); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wrap.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.wc.heard.length===W.length){ attempt(sel,c); return; }
      if(S.wc.heard.indexOf(i)<0){ S.wc.heard.push(i); save(); sfx('click'); } say(i); paint(i); });
    wrap.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-wcmean'); if(!t) return; if(S.wc.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word on the clock first, so you hear each one.'; return; } means.querySelectorAll('.spk-wcmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-wcmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-wcmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wrap.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wrap.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wrap.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };


  /* ---- Scene 1 · Build the Castillo (4.06.05): the fort's four bastions are the four columns of an effects chart.
     Put each coquina "effect" block on the bastion it belongs to (tap it, then a bastion, or drag). Each landing
     stacks a block on that bastion and fills its corner on the fort plan. DATA: bastions [{id,ico,t,name,pos:'nw'|'ne'|'sw'|'se'}],
     blocks [{id,t,b,tells,miss}] ---- */
  MOD.castlebuild=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var BA=cfg.bastions||[], BL=cfg.blocks||[]; S.cb=S.cb||[];
    var done=function(){ return BL.length>0&&BL.every(function(x){ return S.cb.indexOf(x.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var P={nw:[40,40],ne:[240,40],sw:[40,160],se:[240,160]};
    function diamond(c){ var x=c[0],y=c[1]; return (x)+','+(y-34)+' '+(x+34)+','+(y)+' '+(x)+','+(y+34)+' '+(x-34)+','+(y); }
    var plan='<svg class="plan" viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A plan of the Castillo seen from above: a square courtyard with a pointed bastion at each corner')+'">'
      +'<rect x="0" y="0" width="280" height="200" class="water"/><path d="M14,20 C70,8 210,8 266,20 L270,186 C210,196 70,196 10,186 Z" class="moat"/>'
      +'<rect x="40" y="40" width="200" height="120" class="wall"/><rect x="62" y="60" width="156" height="80" class="yard"/>'
      +BA.map(function(b){ var c=P[b.pos]||P.nw; return '<g class="bas" data-b="'+esc(b.id)+'" role="button" tabindex="0" aria-label="'+esc(b.t)+'"><polygon points="'+diamond(c)+'" class="bp"/><text x="'+c[0]+'" y="'+(c[1]+6)+'" text-anchor="middle" class="bi">'+(b.ico||'')+'</text></g>'; }).join('')
      +'<g class="flag"><line x1="140" y1="100" x2="140" y2="72" /><path d="M140,72 l18,5 l-18,5 z"/></g></svg>';
    var g=el('div','spk spk-game spk-cb');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Build the Castillo')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-chips spk-cbtray"></div><p class="spk-miss"></p>'
      +'<div class="spk-cbgrid"><div class="spk-cbplan">'+plan+'</div>'+BA.map(function(b){ return '<div class="ba" data-b="'+esc(b.id)+'" data-pos="'+esc(b.pos||'')+'" role="button" tabindex="0" aria-label="'+esc(b.t)+'"><div class="lab"><span class="ico" aria-hidden="true">'+(b.ico||'🏰')+'</span><span><b>'+esc(b.t)+'</b>'+(b.name?'<small>'+esc(b.name)+'</small>':'')+'</span></div><div class="stack" aria-hidden="true"></div><div class="in"></div></div>'; }).join('')+'</div>'
      +'<p class="spk-cbnote" aria-live="polite"></p><p class="spk-bell-ct spk-cb-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var tray=g.querySelector('.spk-cbtray'), miss=g.querySelector('.spk-miss'), svg=g.querySelector('.plan'), sel=null, was=done();
    shuffle(BL).forEach(function(x){ var c=el('div','spk-chip noimg spk-cbblock','<span class="ico">🧱</span><span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=x.id; tray.appendChild(c); });
    function paint(drop){ BL.forEach(function(x){ var on=S.cb.indexOf(x.id)>=0, c=tray.querySelector('[data-i="'+x.id+'"]'); c.classList.toggle('spk-hide',on); c.draggable=!on; });
      BA.forEach(function(b){ var ba=g.querySelector('.ba[data-b="'+b.id+'"]'), all=BL.filter(function(x){ return x.b===b.id; }), L=all.filter(function(x){ return S.cb.indexOf(x.id)>=0; });
        ba.querySelector('.stack').innerHTML=all.map(function(x,i){ return '<span class="blk'+(i<L.length?' on':'')+(drop&&L[L.length-1]&&L[L.length-1].id===drop&&i===L.length-1?' new':'')+'"></span>'; }).join('');
        ba.querySelector('.in').innerHTML=L.map(function(x){ return '<div class="it'+(drop===x.id?' new':'')+'">'+esc(x.t)+'</div>'; }).join('');
        var full=all.length>0&&L.length===all.length; ba.classList.toggle('full',full);
        var sb=svg.querySelector('.bas[data-b="'+b.id+'"]'); sb.classList.toggle('full',full); sb.classList.toggle('part',L.length>0&&!full);
        if(drop&&L.some(function(x){ return x.id===drop; })){ ba.classList.remove('bump'); void ba.offsetWidth; ba.classList.add('bump'); } });
      var d=done(); g.querySelector('.spk-cb-ct').innerHTML=d?'':'<b>'+S.cb.length+' of '+BL.length+'</b> '+esc(cfg.countT||'blocks in place.');
      if(d&&!was) setTimeout(function(){ sfx('flap'); setTimeout(function(){ sfx('win'); },400); },400); was=d; svg.classList.toggle('up',d); g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ g.querySelectorAll('.ba').forEach(function(b){ b.classList.toggle('armed',on); b.classList.remove('over'); }); svg.querySelectorAll('.bas').forEach(function(b){ b.classList.toggle('armed',on); }); }
    function attempt(chip,bid){ if(!chip||!bid) return; var x=find(BL,chip.dataset.i); if(!x||S.cb.indexOf(x.id)>=0) return; arm(false);
      if(x.b===bid){ S.cb.push(x.id); save(); sel=null; miss.textContent=''; sfx('thud'); paint(x.id); var bb=find(BA,bid), nt=g.querySelector('.spk-cbnote'); nt.innerHTML='<span aria-hidden="true">'+(bb&&bb.ico||'🧱')+'</span> <b>'+esc(bb?bb.t:'')+':</b> '+esc(x.t)+' '+esc(x.tells||''); nt.classList.remove('pop'); void nt.offsetWidth; nt.classList.add('pop'); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=x.miss||''; miss.textContent=m; missBeat(m); } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-cbblock'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-cbblock').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-cbblock'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-cbblock'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); });
    function target(e){ var b=e.target.closest('.ba')||e.target.closest('.bas'); return b?b.dataset.b:null; }
    [g.querySelector('.spk-cbgrid')].forEach(function(zone){
      zone.addEventListener('click',function(e){ var b=target(e); if(!b) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a block first, then tap the corner it belongs to.'; return; } attempt(sel,b); });
      zone.addEventListener('keydown',function(e){ var b=e.target.closest('.ba')||e.target.closest('.bas'); if(b&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); b.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
      zone.addEventListener('dragover',function(e){ var b=target(e); g.querySelectorAll('.ba').forEach(function(x){ x.classList.toggle('over',x.dataset.b===b); }); svg.querySelectorAll('.bas').forEach(function(x){ x.classList.toggle('over',x.dataset.b===b); }); if(b){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
      zone.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,target(e)); }); });
    paint();
    return {done:done, journal:function(e,NA){ var L=BA.map(function(b){ var it=BL.filter(function(x){ return x.b===b.id&&S.cb.indexOf(x.id)>=0; }); return it.length?'<p class="a"><b>'+e(b.t)+':</b> '+e(it.map(function(x){ return x.t; }).join(' · '))+'</p>':''; }).join(''); return L||NA; }};
  };

  /* ---- Explore reading · The 200-year candle (4.06.05): a candle marked with years. Tap the next glowing year
     (or drag the flame down to it) and the candle burns down to that mark; that part of the reading opens.
     The last mark (no paragraphs) shows its own note when the candle burns out.
     DATA: paras [{id,match}], marks [{id,year,t,paras:[],note}] ---- */
  MOD.candle=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var MK=cfg.marks||[]; if(S.cdl==null) S.cdl=0;
    var done=function(){ return MK.length>0&&S.cdl>=MK.length; };
    var TOP=40, BOT=270, n=MK.length;
    function yAt(i){ return TOP+(BOT-TOP)*(n<2?0:i/(n-1)); }
    var w=el('div','spk spk-candle');
    w.innerHTML='<div class="spk-cdwrap"><svg viewBox="0 0 150 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A tall candle marked with years, from 1565 at the top to 1763 near the bottom')+'">'
      +'<defs><linearGradient id="spkCdWax" x1="0" x2="1"><stop offset="0" stop-color="#E9DCC0"/><stop offset=".5" stop-color="#FFF7E6"/><stop offset="1" stop-color="#DCCBA6"/></linearGradient></defs>'
      +'<ellipse cx="45" cy="290" rx="38" ry="7" class="dish"/>'
      +'<rect class="wax" x="25" y="'+TOP+'" width="40" height="'+(BOT-TOP+14)+'" rx="4" fill="url(#spkCdWax)"/>'
      +'<path class="drip" d="M30,'+TOP+' q2,10 0,16 q-2,4 2,6" />'
      +'<g class="flamew"><line class="wick" x1="45" y1="-8" x2="45" y2="0"/><g class="flame"><path d="M45,-30 C55,-18 53,-6 45,-2 C37,-6 35,-18 45,-30 Z" class="f1"/><path d="M45,-20 C50,-12 49,-6 45,-4 C41,-6 40,-12 45,-20 Z" class="f2"/></g><circle class="halo" cx="45" cy="-14" r="22"/></g>'
      +'<g class="marks">'+MK.map(function(m,i){ var y=yAt(i).toFixed(1); return '<g class="mk" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(m.year+'. '+m.t)+'"><line x1="22" y1="'+y+'" x2="68" y2="'+y+'" class="tick"/><circle cx="82" cy="'+y+'" r="6" class="dot"/><text x="94" y="'+(+y+5)+'" class="yr">'+esc(m.year)+'</text></g>'; }).join('')+'</g>'
      +'<g class="smoke" aria-hidden="true"><path d="M45,'+(BOT-6)+' c-6,-10 6,-16 0,-28 c-6,-10 6,-16 0,-26"/></g>'
      +'</svg></div><div class="spk-cdside"><p class="spk-ys-ct spk-cdct"></p><div class="spk-cdread"></div></div>';
    before(first,w);
    var list=w.querySelector('.spk-cdread'), boxes={}, svg=w.querySelector('svg'), wax=svg.querySelector('.wax'), flame=svg.querySelector('.flamew'), drip=svg.querySelector('.drip');
    MK.forEach(function(m,i){ var b=el('div','spk-cdp'); b.innerHTML='<div class="tab"><span class="y">'+esc(m.year)+'</span><b>'+esc(m.t)+'</b></div>'+(m.note?'<p class="note">'+m.note+'</p>':''); list.appendChild(b); (m.paras||[]).forEach(function(pid){ var p=found[pid]; if(p) move(p,function(nd){ b.appendChild(nd); }); }); if(i<MK.length-1){ var nx=el('button','spk-cdnext','🕯️ '+esc((cfg.nextT||'Burn to')+' '+MK[i+1].year)+' ▸'); nx.type='button'; nx.addEventListener('click',function(){ go(i+1); }); b.appendChild(nx); } boxes[i]=b; });
    function place(k){ var y=k===0?TOP:yAt(k-1); var out=done(); wax.setAttribute('y',y.toFixed(1)); wax.setAttribute('height',(BOT+14-y).toFixed(1)); flame.setAttribute('transform','translate(0,'+y.toFixed(1)+')'); drip.setAttribute('transform','translate(0,'+(y-TOP).toFixed(1)+')'); w.classList.toggle('out',out); w.classList.toggle('unlit',k===0); }
    function paint(anim){ var k=S.cdl;
      svg.querySelectorAll('.mk').forEach(function(g2){ var i=+g2.dataset.i; g2.classList.toggle('been',i<k); g2.classList.toggle('next',i===k); });
      MK.forEach(function(m,i){ var b=boxes[i]; b.classList.toggle('on',i<k); b.classList.toggle('cur',i===k-1&&!done()); if(anim&&i===k-1){ b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } });
      place(k); w.classList.toggle('all',done());
      w.querySelector('.spk-cdct').innerHTML=done()?'<b>'+esc(cfg.allT||'The candle burned all 200 years.')+'</b>':(k===0?esc(cfg.startT||'Tap the glowing year to light the candle.'):'<b>'+k+' of '+MK.length+'</b> '+esc(cfg.countT||'years burned. Read this part, then tap the next glowing year.'));
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i){ if(i!==S.cdl||done()) return; ack('explore'); S.cdl++; save(); sfx(i===0?'pluck':(done()?'plop':'click')); paint(true); refreshFile(); refreshVoice(); if(done()) setTimeout(function(){ sfx('win'); },700);
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },250); } }
    svg.addEventListener('click',function(e){ var m=e.target.closest('.mk'); if(!m){ if(e.target.closest('.flamew')&&S.cdl===0) go(0); return; } var i=+m.dataset.i; if(i<S.cdl){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} return; } if(i>S.cdl){ w.querySelector('.spk-cdct').innerHTML=esc(cfg.orderT||'Burn the years in order: tap the year that is glowing.'); return; } go(i); });
    svg.addEventListener('keydown',function(e){ var m=e.target.closest('.mk'); if(m&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); m.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    /* drag the flame down to the next year */
    var drag=false; flame.addEventListener('pointerdown',function(e){ drag=true; e.preventDefault(); });
    window.addEventListener('pointerup',function(e){ if(!drag) return; drag=false; if(done()) return; var r=svg.getBoundingClientRect(), y=(e.clientY-r.top)/r.height*300; if(Math.abs(y-yAt(S.cdl))<30) go(S.cdl); });
    paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Years burned on the candle: '+Math.min(S.cdl,MK.length)+' of '+MK.length+'.</p>'; }};
  };

  /* ---- Explore evidence · Then and now (4.06.05): two pictures of the same fort in one frame. Slide (or tap the
     two year buttons) between the old picture and today's photo; then sort each card into "Stayed the same" or
     "Changed". Also needs the source labels and the reading. DATA: then {img,year,cap}, now {img,year,cap},
     trays [{id,t,ico}], cards [{id,t,tray,why,miss}] ---- */
  MOD.thennow=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var TH=cfg.then||{}, NO=cfg.now||{}, TR=cfg.trays||[], CD=cfg.cards||[]; S.tn=S.tn||{seen:[],put:[]};
    var seen=function(){ return S.tn.seen.indexOf('then')>=0&&S.tn.seen.indexOf('now')>=0; };
    var sorted=function(){ return CD.length>0&&CD.every(function(c){ return S.tn.put.indexOf(c.id)>=0; }); };
    var done=function(){ return seen()&&sorted()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-tn');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Then and Now')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-tnframe"><img class="now" alt="'+esc(NO.alt||'')+'"><img class="then" alt="'+esc(TH.alt||'')+'"><span class="tag t1">'+esc(TH.year||'Then')+'</span><span class="tag t2">'+esc(NO.year||'Now')+'</span></div>'
      +'<div class="spk-tnbar"><button type="button" class="yb" data-v="0">'+esc(TH.year||'Then')+'</button><input type="range" min="0" max="100" step="1" aria-label="'+esc(cfg.sliderT||'Slide between the old picture and today’s photo')+'"><button type="button" class="yb" data-v="100">'+esc(NO.year||'Now')+'</button></div>'
      +'<p class="spk-tncap"></p>'
      +'<div class="spk-step tn2 locked"><div class="lab">2 · '+esc(cfg.step2||'Sort each card: did it stay the same, or did it change?')+'</div><div class="spk-chips spk-tncards"></div><p class="spk-miss"></p>'
      +'<div class="spk-tntrays">'+TR.map(function(t){ return '<div class="tr" data-t="'+esc(t.id)+'" role="button" tabindex="0" aria-label="'+esc(t.t)+'"><div class="lab"><span aria-hidden="true">'+(t.ico||'')+'</span> '+esc(t.t)+'</div><div class="in"></div></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-tn-ct"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var fr=g.querySelector('.spk-tnframe'), iThen=fr.querySelector('.then'), iNow=fr.querySelector('.now'), rng=g.querySelector('input[type=range]'), cards=g.querySelector('.spk-tncards'), miss=g.querySelector('.spk-miss'), sel=null, was=done();
    iThen.src=IMG+TH.img; iNow.src=IMG+NO.img;
    shuffle(CD).forEach(function(c){ var x=el('div','spk-chip noimg spk-tncard','<span class="ico">'+(c.ico||'🔎')+'</span><span>'+esc(c.t)+'</span>'); x.setAttribute('role','button'); x.tabIndex=0; x.draggable=true; x.dataset.c=c.id; cards.appendChild(x); });
    function show(v){ v=Math.max(0,Math.min(100,+v)); rng.value=v; iThen.style.opacity=(1-v/100).toFixed(2); fr.classList.toggle('isnow',v>=50);
      var k=v<=5?'then':(v>=95?'now':null); if(k&&S.tn.seen.indexOf(k)<0){ S.tn.seen.push(k); save(); sfx('paper'); paint(); refreshFile(); refreshVoice(); }
      g.querySelector('.spk-tncap').innerHTML=v<50?(TH.cap||''):(NO.cap||''); }
    function paint(drop){ var P=S.tn.put;
      CD.forEach(function(c){ var x=cards.querySelector('[data-c="'+c.id+'"]'), on=P.indexOf(c.id)>=0; x.classList.toggle('spk-hide',on); x.draggable=!on; });
      TR.forEach(function(t){ var box=g.querySelector('.tr[data-t="'+t.id+'"] .in'); box.innerHTML=CD.filter(function(c){ return c.tray===t.id&&P.indexOf(c.id)>=0; }).map(function(c){ return '<div class="it'+(drop===c.id?' new':'')+'"><b>'+esc(c.t)+'</b> '+esc(c.why||'')+'</div>'; }).join(''); });
      g.querySelector('.tn2').classList.toggle('locked',!seen());
      g.querySelectorAll('.yb').forEach(function(b){ b.classList.toggle('seen',S.tn.seen.indexOf(b.dataset.v==='0'?'then':'now')>=0); });
      var gate=''; if(seen()&&sorted()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the photo above.'; else if(seen()&&sorted()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Learn the Story above.';
      g.querySelector('.spk-si-gate').textContent=gate;
      g.querySelector('.spk-tn-ct').innerHTML=!seen()?esc(cfg.seeT||'Slide all the way to each end to see both pictures.'):(sorted()?'':'<b>'+P.length+' of '+CD.length+'</b> '+esc(cfg.countT||'cards sorted.'));
      var d=done(); if(d&&!was) setTimeout(function(){ sfx('win'); },400); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    rng.addEventListener('input',function(){ ack('explore'); show(rng.value); });
    g.querySelector('.spk-tnbar').addEventListener('click',function(e){ var b=e.target.closest('.yb'); if(!b) return; ack('explore'); show(b.dataset.v); });
    function arm(on){ g.querySelectorAll('.tr').forEach(function(t){ t.classList.toggle('armed',on); t.classList.remove('over'); }); }
    function attempt(chip,tr){ if(!chip||!tr||!seen()) return; var c=find(CD,chip.dataset.c); if(!c||S.tn.put.indexOf(c.id)>=0) return; arm(false);
      if(c.tray===tr.dataset.t){ S.tn.put.push(c.id); save(); sel=null; miss.textContent=''; sfx('slide'); paint(c.id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=c.miss||''; miss.textContent=m; missBeat(m); } }
    cards.addEventListener('click',function(e){ var x=e.target.closest('.spk-tncard'); if(!x) return; if(!seen()){ miss.textContent=cfg.seeT||'Slide all the way to each end to see both pictures first.'; return; } ack('explore'); cards.querySelectorAll('.spk-tncard').forEach(function(y){ y.classList.remove('sel'); }); x.classList.add('sel'); sel=x; miss.textContent=''; arm(true); });
    cards.addEventListener('keydown',function(e){ var x=e.target.closest('.spk-tncard'); if(x&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); x.click(); } });
    cards.addEventListener('dragstart',function(e){ var x=e.target.closest('.spk-tncard'); if(!x||!x.draggable||!seen()){ e.preventDefault(); return; } sel=x; e.dataTransfer.setData('text/plain',x.dataset.c); e.dataTransfer.effectAllowed='move'; arm(true); });
    cards.addEventListener('dragend',function(){ arm(false); });
    var trays=g.querySelector('.spk-tntrays');
    trays.addEventListener('click',function(e){ var t=e.target.closest('.tr'); if(!t) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a card first, then tap where it belongs.'; return; } attempt(sel,t); });
    trays.addEventListener('keydown',function(e){ var t=e.target.closest('.tr'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    trays.addEventListener('dragover',function(e){ var t=e.target.closest('.tr'); g.querySelectorAll('.tr').forEach(function(x){ x.classList.toggle('over',x===t); }); if(t){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    trays.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.tr')); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    show(S.tn.seen.indexOf('now')>=0&&S.tn.seen.indexOf('then')<0?100:0); paint();
    return {done:done, journal:function(e,NA){ var L=TR.map(function(t){ var it=CD.filter(function(c){ return c.tray===t.id&&S.tn.put.indexOf(c.id)>=0; }); return it.length?'<p class="a"><b>'+e(t.t)+':</b> '+e(it.map(function(c){ return c.t; }).join(' · '))+'</p>':''; }).join(''); return L||NA; }};
  };

  /* ---- Planner · Postcard home (4.06.05): the front shows the two effects the student picks; flip it, and the
     back holds the evidence for each, plus a "because" stamp. Notes only — the student writes.
     DATA: effects [{id,ico,t,ev:[{id,t}]}], stamp {lab,q,opts:[{id,t}]}, pick (how many effects, 2) ---- */
  MOD.postcard=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var EF=cfg.effects||[], ST=cfg.stamp||{opts:[]}, NP=cfg.pick||2; S.pc=S.pc||{fx:[],ev:{},st:null,side:'front'}; var was=null;
    var done=function(){ return S.pc.fx.length===NP&&S.pc.fx.every(function(id){ return !!S.pc.ev[id]; })&&!!S.pc.st; };
    var eff=function(id){ return find(EF,id); }, evT=function(id){ var f=eff(id), o=f&&find(f.ev||[],S.pc.ev[id]); return o?o.t:''; }, stT=function(){ var o=find(ST.opts||[],S.pc.st); return o?o.t:''; };
    var b=el('div','spk spk-builder spk-pc');
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-pccard"><div class="face front"><div class="pic"><span class="gr">'+esc(cfg.greet||'Greetings from Spanish Florida')+'</span><div class="slots"><span class="sl" data-k="0"></span><span class="sl" data-k="1"></span></div></div></div>'
      +'<div class="face back"><div class="lines"><div class="ln" data-k="0"></div><div class="ln" data-k="1"></div></div><div class="stampbox"><span class="stamp"></span></div></div></div>'
      +'<div class="spk-pcflip"><button type="button" class="fl">'+esc(cfg.flipT||'↻ Flip the postcard')+'</button></div>'
      +'<div class="spk-step" data-r="fx"><div class="lab">🖼️ 1 · '+esc(cfg.q1||'Front: pick two effects of Spanish rule')+'</div><div class="spk-opts">'+EF.map(function(f){ return '<button type="button" class="spk-opt" data-v="'+esc(f.id)+'">'+(f.ico?f.ico+' ':'')+esc(f.t)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step pcev locked" data-r="ev"><div class="lab">✍️ 2 · '+esc(cfg.q2||'Back: pick the evidence for each effect')+'</div><div class="evs"></div></div>'
      +'<div class="spk-step pcst locked" data-r="st"><div class="lab">📮 3 · '+esc(ST.q||'Add a because stamp')+'</div><div class="spk-opts">'+(ST.opts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Your postcard is ready. Now write in Step 3.')+'</p><div class="spk-plan"></div>';
    function lines(){ var L=[]; S.pc.fx.forEach(function(id,i){ var f=eff(id); if(!f) return; L.push([(cfg.effLab||'Effect')+' '+(i+1),f.t]); if(S.pc.ev[id]) L.push([cfg.evLab||'My evidence is',evT(id)]); }); if(S.pc.st) L.push([ST.lab||'Because',stT()]); return L; }
    function setSide(s,anim){ S.pc.side=s; var cd=b.querySelector('.spk-pccard'); cd.classList.toggle('back',s==='back'); if(anim){ cd.classList.remove('flip'); void cd.offsetWidth; cd.classList.add('flip'); } }
    function paint(){ b.querySelectorAll('.spk-step[data-r="fx"] .spk-opt').forEach(function(o){ var on=S.pc.fx.indexOf(o.dataset.v)>=0; o.classList.toggle('on',on); o.disabled=!on&&S.pc.fx.length>=NP; });
      b.querySelector('.evs').innerHTML=S.pc.fx.map(function(id){ var f=eff(id); return '<div class="ev" data-f="'+esc(id)+'"><div class="t">'+(f.ico||'')+' '+esc(f.t)+'</div><div class="spk-opts">'+(f.ev||[]).map(function(o){ return '<button type="button" class="spk-opt'+(S.pc.ev[id]===o.id?' on':'')+'" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join('');
      b.querySelector('.pcev').classList.toggle('locked',S.pc.fx.length<NP);
      b.querySelector('.pcst').classList.toggle('locked',!(S.pc.fx.length===NP&&S.pc.fx.every(function(id){ return !!S.pc.ev[id]; })));
      b.querySelectorAll('.spk-step[data-r="st"] .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===S.pc.st); });
      [0,1].forEach(function(k){ var id=S.pc.fx[k], f=id&&eff(id); var sl=b.querySelector('.sl[data-k="'+k+'"]'); sl.innerHTML=f?'<span class="i">'+(f.ico||'')+'</span><span class="x">'+esc(f.t)+'</span>':''; sl.classList.toggle('on',!!f);
        b.querySelector('.ln[data-k="'+k+'"]').innerHTML=f?'<b>'+esc(f.t)+'.</b> '+(S.pc.ev[id]?esc(cfg.evLab||'My evidence is')+' '+esc(evT(id).charAt(0).toLowerCase()+evT(id).slice(1))+'.':'<i>'+esc(cfg.evWait||'Evidence: pick it below.')+'</i>'):''; });
      var sp=b.querySelector('.stamp'); sp.textContent=S.pc.st?stT():''; sp.classList.toggle('on',!!S.pc.st);
      var all=done(); if(all&&was===false){ sfx('thud'); setTimeout(function(){ sfx('win'); },300); } was=all; b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ if(e.target.closest('.fl')){ sfx('paper'); setSide(S.pc.side==='back'?'front':'back',true); save(); return; }
      var o=e.target.closest('.spk-opt'); if(!o||o.disabled) return; var st=o.closest('.spk-step'); if(!st||st.classList.contains('locked')) return; var r=st.dataset.r;
      if(r==='fx'){ var k=S.pc.fx.indexOf(o.dataset.v); if(k>=0){ S.pc.fx.splice(k,1); delete S.pc.ev[o.dataset.v]; } else if(S.pc.fx.length<NP) S.pc.fx.push(o.dataset.v); if(S.pc.side!=='front') setSide('front',true); }
      else if(r==='ev'){ var f=o.closest('.ev').dataset.f; S.pc.ev[f]=o.dataset.v; if(S.pc.side!=='back') setSide('back',true); }
      else if(r==='st'){ S.pc.st=o.dataset.v; if(S.pc.side!=='back') setSide('back',true); }
      save(); sfx('click'); paint(); });
    before(partB,b); setSide(S.pc.side||'front'); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Stack the wall (4.06.05, struct = build): a coquina wall that is not built yet. Tap each word
     beside the wall to hear it (g4ss-<lesson>-struct-<n>.mp3 when it exists). Then put each meaning on its word;
     each match lays one course of blocks, bottom to top. When the wall is done, a sentry box goes up on top. ---- */
  MOD.wallstack=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[]; S.ws=S.ws||{heard:[],up:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.ws.up.length===W.length; };
    var NR=W.length, RH=26, BASE=170;
    var rows=''; for(var r=0;r<NR;r++){ var y=BASE-(r+1)*RH, off=r%2?22:0, bl=''; for(var x=10-off;x<300;x+=44){ var x0=Math.max(10,x), x1=Math.min(300,x+40); if(x1-x0>4) bl+='<rect x="'+x0+'" y="'+(y+2)+'" width="'+(x1-x0)+'" height="'+(RH-4)+'" rx="2"/>'; } rows+='<g class="course" data-r="'+r+'">'+bl+'</g>'; }
    var g=el('div','spk spk-wall');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Stack the Wall')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-wswrap"><svg class="wsv" viewBox="0 0 320 200" aria-hidden="true"><rect x="0" y="170" width="320" height="30" class="ground"/><g class="ghosts">'+(function(){ var s=''; for(var r=0;r<NR;r++) s+='<rect x="10" y="'+(BASE-(r+1)*RH+2)+'" width="290" height="'+(RH-4)+'" rx="3"/>'; return s; })()+'</g>'+rows
      +'<g class="garita"><rect x="244" y="'+(BASE-NR*RH-30)+'" width="26" height="30" rx="3"/><path d="M240,'+(BASE-NR*RH-30)+' q17,-22 34,0 z"/><rect x="253" y="'+(BASE-NR*RH-22)+'" width="8" height="12" rx="4" class="win"/></g></svg>'
      +'<div class="wds">'+W.map(function(x,i){ return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-ws-ct"></p><div class="spk-chips spk-wsmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-wsmeans'), miss=g.querySelector('.spk-miss'), wds=g.querySelector('.wds'), svg=g.querySelector('.wsv'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-struct-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-wsmean','<span class="ico">🧱</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.ws.heard.length===W.length, n=S.ws.up.length;
      wds.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.ws.heard.indexOf(i)>=0, u=S.ws.up.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      svg.querySelectorAll('.course').forEach(function(c){ var r=+c.dataset.r; c.classList.toggle('on',r<n); if(anim!=null&&anim!=='h'&&r===n-1){ c.classList.remove('lay'); void c.getBoundingClientRect(); c.classList.add('lay'); } });
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-wsmean').forEach(function(t){ var f=S.ws.up.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-ws-ct').innerHTML=!allH?'<b>'+S.ws.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(done()?'':'<b>'+n+' of '+W.length+'</b> '+esc(cfg.upT||'rows built. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ wds.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.ws.up.indexOf(i)>=0||S.ws.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.ws.up.push(i); save(); sel=null; miss.textContent=''; sfx('thud'); paint(i); if(done()) setTimeout(function(){ sfx('clink'); setTimeout(function(){ sfx('win'); },500); },500); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wds.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.ws.heard.length===W.length){ attempt(sel,c); return; }
      if(S.ws.heard.indexOf(i)<0){ S.ws.heard.push(i); save(); sfx('click'); } say(i); paint('h'); });
    wds.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-wsmean'); if(!t) return; if(S.ws.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-wsmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-wsmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-wsmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wds.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wds.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wds.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };


  /* ---- Scene 1 · Homelands map (4.06.06): the real Florida outline with a quiet ring on each people's homeland.
     Round 1: put each name tag on its homeland (tap a tag, then the ring, or drag). Round 2: put each way-of-life
     card on the homeland it describes; the cards collect in the boxes under the map. Sorts names and facts, never
     people. DATA: homes [{id,name,lon,lat,where,ico,dx,dy}], cards [{id,home,t,miss}] ---- */
  MOD.homelands=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var H=(cfg.homes||[]).map(function(h){ var p=project(h.lon,h.lat); return Object.assign({},h,{cx:Math.round(p[0]),cy:Math.round(p[1])}); }), CD=cfg.cards||[];
    S.hl=S.hl||{named:[],put:[]};
    var named=function(){ return H.length>0&&H.every(function(h){ return S.hl.named.indexOf(h.id)>=0; }); };
    var done=function(){ return named()&&CD.every(function(c){ return S.hl.put.indexOf(c.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var map='<svg class="hlmap" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A map of Florida with a circle on each people’s homeland')+'">'+floridaBase('H')
      +H.map(function(h){ var lx=h.cx+(h.dx||0), ly=h.cy+(h.dy!=null?h.dy:34); return '<g class="hz" data-h="'+esc(h.id)+'" role="button" tabindex="0" aria-label="'+esc(h.where)+'"><circle class="area" cx="'+h.cx+'" cy="'+h.cy+'" r="26"/><circle class="ring" cx="'+h.cx+'" cy="'+h.cy+'" r="17"/><text class="ic" x="'+h.cx+'" y="'+(h.cy+6)+'" text-anchor="middle">'+(h.ico||'')+'</text><g class="nm"><rect x="'+(lx-40)+'" y="'+(ly-11)+'" width="80" height="18" rx="9"/><text x="'+lx+'" y="'+(ly+2)+'" text-anchor="middle">'+esc(h.name)+'</text></g></g>'; }).join('')+'</svg>';
    var g=el('div','spk spk-game spk-hl');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Homelands')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<p class="spk-hlstep"></p><div class="spk-chips spk-hltray"></div><p class="spk-miss"></p>'
      +'<div class="spk-hlwrap"><div class="spk-hlmapw">'+map+'</div><div class="spk-hlboxes">'+H.map(function(h){ return '<div class="hb" data-h="'+esc(h.id)+'" role="button" tabindex="0" aria-label="'+esc(h.where)+'"><div class="lab"><span class="ico" aria-hidden="true">'+(h.ico||'')+'</span><span><b class="nmx">?</b><small>'+esc(h.where)+'</small></span></div><div class="in"></div></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-hl-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var tray=g.querySelector('.spk-hltray'), miss=g.querySelector('.spk-miss'), svg=g.querySelector('.hlmap'), sel=null;
    function fill(){ tray.innerHTML=''; sel=null;
      if(!named()) shuffle(H.filter(function(h){ return S.hl.named.indexOf(h.id)<0; })).forEach(function(h){ var c=el('div','spk-chip noimg spk-hltag','<span class="ico">🏷️</span><span><b>'+esc(h.name)+'</b></span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.k='n'; c.dataset.i=h.id; tray.appendChild(c); });
      else shuffle(CD.filter(function(c){ return S.hl.put.indexOf(c.id)<0; })).forEach(function(x){ var c=el('div','spk-chip noimg spk-hlcard','<span class="ico">'+(x.ico||'📜')+'</span><span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.k='c'; c.dataset.i=x.id; tray.appendChild(c); }); }
    function paint(drop){ var nm=named();
      H.forEach(function(h){ var on=S.hl.named.indexOf(h.id)>=0, z=svg.querySelector('.hz[data-h="'+h.id+'"]'), b=g.querySelector('.hb[data-h="'+h.id+'"]');
        var mine=CD.filter(function(c){ return c.home===h.id; }), L=mine.filter(function(c){ return S.hl.put.indexOf(c.id)>=0; });
        z.classList.toggle('named',on); z.classList.toggle('full',on&&L.length===mine.length); if(drop===h.id&&on){ z.classList.remove('lit'); void z.getBoundingClientRect(); z.classList.add('lit'); }
        b.classList.toggle('named',on); b.querySelector('.nmx').textContent=on?h.name:'?';
        b.querySelector('.in').innerHTML=L.map(function(c){ return '<div class="it'+(drop===c.id?' new':'')+'">'+(c.ico?'<span aria-hidden="true">'+c.ico+'</span> ':'')+esc(c.t)+'</div>'; }).join(''); });
      g.querySelector('.spk-hlstep').innerHTML=!nm?'<b>1 ·</b> '+esc(cfg.nameT||'Put each name on its homeland.'):(done()?'':'<b>2 ·</b> '+esc(cfg.lifeT||'Now put each way-of-life card on the homeland it describes.'));
      var n=nm?S.hl.put.length:S.hl.named.length, of=nm?CD.length:H.length;
      g.querySelector('.spk-hl-ct').innerHTML=done()?'':'<b>'+n+' of '+of+'</b> '+esc(nm?(cfg.cardsCt||'cards placed.'):(cfg.namesCt||'names placed.'));
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); g.classList.toggle('round2',nm); }
    function arm(on){ g.querySelectorAll('.hz,.hb').forEach(function(z){ z.classList.toggle('armed',on); z.classList.remove('over'); }); }
    function attempt(chip,hid){ if(!chip||!hid) return; var k=chip.dataset.k, id=chip.dataset.i; arm(false);
      if(k==='n'){ var h=find(H,id); if(!h||S.hl.named.indexOf(id)>=0) return;
        if(id===hid){ S.hl.named.push(id); save(); miss.textContent=''; sfx('click'); if(named()) fill(); else chip.remove(); sel=null; paint(hid); refreshFile(); refreshVoice(); }
        else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=(h.miss||'')+''; miss.textContent=m; missBeat(m); } }
      else { var c=find(CD,id); if(!c||S.hl.put.indexOf(id)>=0) return;
        if(S.hl.named.indexOf(hid)<0){ miss.textContent=cfg.nameFirstT||'Put a name on that homeland first.'; return; }
        if(c.home===hid){ S.hl.put.push(id); save(); miss.textContent=''; sfx('click'); chip.remove(); sel=null; paint(id); refreshFile(); refreshVoice(); }
        else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m2=c.miss||''; miss.textContent=m2; missBeat(m2); } } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-chip'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-chip').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-chip'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-chip'); if(!c){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); });
    function target(e){ var z=e.target.closest('.hz')||e.target.closest('.hb'); return z?z.dataset.h:null; }
    [svg,g.querySelector('.spk-hlboxes')].forEach(function(zone){
      zone.addEventListener('click',function(e){ var h=target(e); if(!h) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a card first, then tap the homeland it belongs to.'; return; } attempt(sel,h); });
      zone.addEventListener('keydown',function(e){ var z=e.target.closest('.hz')||e.target.closest('.hb'); if(z&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); z.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
      zone.addEventListener('dragover',function(e){ var h=target(e); g.querySelectorAll('.hz,.hb').forEach(function(x){ x.classList.toggle('over',x.dataset.h===h); }); if(h){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
      zone.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,target(e)); }); });
    fill(); paint();
    return {done:done, journal:function(e,NA){ var L=H.map(function(h){ var it=CD.filter(function(c){ return c.home===h.id&&S.hl.put.indexOf(c.id)>=0; }); return it.length?'<p class="a"><b>'+e(h.name)+':</b> '+e(it.map(function(c){ return c.t; }).join(' · '))+'</p>':''; }).join(''); return L||NA; }};
  };

  /* ---- Explore reading · Light the lanterns (4.06.06): a string of paper lanterns over a dark path. Tap the next
     unlit lantern (or the "Light lantern N" button at the end of a part) and its part of the reading opens below.
     Calm glow, one soft click, no fanfare. DATA: paras [{id,match}], lamps [{id,t,paras:[]}] ---- */
  MOD.lanterns=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var LA=cfg.lamps||[], n=LA.length; if(S.lan==null) S.lan=0;
    var done=function(){ return n>0&&S.lan>=n; };
    var W=320, gap=W/(n+1);
    var w=el('div','spk spk-lan');
    w.innerHTML='<div class="spk-lanbar"><svg viewBox="0 0 '+W+' 112" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A string of five paper lanterns hanging over a dark path')+'">'
      +'<defs><radialGradient id="spkLanGlow"><stop offset="0" stop-color="#FFD88A" stop-opacity=".9"/><stop offset=".45" stop-color="#FFC86A" stop-opacity=".35"/><stop offset="1" stop-color="#FFC86A" stop-opacity="0"/></radialGradient></defs>'+'<rect width="'+W+'" height="112" class="sky"/><path d="M0,104 C80,92 240,92 '+W+',104 L'+W+',112 L0,112 Z" class="path"/>'
      +'<path d="M0,10 '+LA.map(function(l,i){ var x=gap*(i+1); return 'Q'+(x-gap/2)+',26 '+x+',18'; }).join(' ')+' Q'+(W-gap/2)+',26 '+W+',10" class="cord"/>'
      +LA.map(function(l,i){ var x=(gap*(i+1)).toFixed(1); return '<g class="ln" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc('Lantern '+(i+1)+'. '+l.t)+'"><circle class="glow" cx="'+x+'" cy="46" r="30" fill="url(#spkLanGlow)"/><line x1="'+x+'" y1="18" x2="'+x+'" y2="28" class="hang"/><rect x="'+(x-8)+'" y="27" width="16" height="4" rx="1.5" class="cap"/><path d="M'+(x-11)+',31 Q'+(x-15)+',46 '+(x-11)+',61 L'+(+x+11)+',61 Q'+(+x+15)+',46 '+(+x+11)+',31 Z" class="paper"/><path d="M'+(x-13)+',41 H'+(+x+13)+' M'+(x-13)+',51 H'+(+x+13)+'" class="rib"/><rect x="'+(x-8)+'" y="61" width="16" height="4" rx="1.5" class="cap"/><text x="'+x+'" y="84" text-anchor="middle" class="num">'+(i+1)+'</text></g>'; }).join('')
      +'</svg><p class="spk-ys-ct spk-lanct"></p></div><div class="spk-lanread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-lanread'), boxes={}, svg=w.querySelector('svg');
    LA.forEach(function(l,i){ var b=el('div','spk-lanp'); b.innerHTML='<div class="tab"><span class="y">'+(i+1)+'</span><b>'+esc(l.t)+'</b></div>'; list.appendChild(b); (l.paras||[]).forEach(function(pid){ var p=found[pid]; if(p) move(p,function(nd){ b.appendChild(nd); }); });
      if(i<n-1){ var nx=el('button','spk-lannext',esc((cfg.nextT||'Light lantern {n}').replace('{n}',i+2))); nx.type='button'; nx.addEventListener('click',function(){ go(i+1); }); b.appendChild(nx); }
      boxes[i]=b; });
    function paint(anim){ var k=S.lan;
      svg.querySelectorAll('.ln').forEach(function(g2){ var i=+g2.dataset.i; g2.classList.toggle('lit',i<k); g2.classList.toggle('next',i===k); if(anim&&i===k-1){ g2.classList.remove('kindle'); void g2.getBoundingClientRect(); g2.classList.add('kindle'); } });
      LA.forEach(function(l,i){ var b=boxes[i]; b.classList.toggle('on',i<k); b.classList.toggle('cur',i===k-1); });
      w.classList.toggle('all',done());
      w.querySelector('.spk-lanct').innerHTML=done()?'<b>'+esc(cfg.allT||'All five lanterns are lit.')+'</b>':(k===0?esc(cfg.startT||'Tap the first lantern to light it.'):'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'lanterns lit. Read this part, then light the next one.'));
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i){ if(i!==S.lan||done()) return; ack('explore'); S.lan++; save(); sfx('click'); paint(true); refreshFile(); refreshVoice();
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },250); } }
    svg.addEventListener('click',function(e){ var m=e.target.closest('.ln'); if(!m) return; var i=+m.dataset.i; if(i<S.lan){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} return; } if(i>S.lan){ w.querySelector('.spk-lanct').innerHTML=esc(cfg.orderT||'Light the lanterns in order: tap the one with the soft outline.'); return; } go(i); });
    svg.addEventListener('keydown',function(e){ var m=e.target.closest('.ln'); if(m&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); m.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Lanterns lit: '+Math.min(S.lan,n)+' of '+n+'.</p>'; }};
  };

  /* ---- Explore evidence · What did it change? (4.06.06): the labeled engraving is the "before". For each effect
     card, tap the numbered part of the farming life it disrupted (the numbers sit on the picture itself). A matched
     part dims softly and keeps a short note. Also needs the source labels and the reading.
     DATA: img, alt, parts [{id,n,x,y,t}] (x,y in % of the picture), cards [{id,ico,t,part,why,miss}] ---- */
  MOD.whatchanged=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var PT=cfg.parts||[], CD=cfg.cards||[]; S.wc=S.wc||[];
    var sorted=function(){ return CD.length>0&&CD.every(function(c){ return S.wc.indexOf(c.id)>=0; }); };
    var done=function(){ return sorted()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-whc');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'What did it change?')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-whcrow"><div class="spk-whcside"><div class="spk-chips spk-wccards"></div><p class="spk-miss"></p></div>'
      +'<div class="spk-wcpic"><img alt="'+esc(cfg.alt||'')+'"><span class="tag">'+esc(cfg.tag||'Before')+'</span>'+PT.map(function(p){ return '<button type="button" class="pt" data-p="'+esc(p.id)+'" style="left:'+p.x+'%;top:'+p.y+'%" aria-label="'+esc(p.n+'. '+p.t)+'">'+esc(p.n)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-wclist">'+PT.map(function(p){ return '<div class="pr" data-p="'+esc(p.id)+'" role="button" tabindex="0"><div class="lab"><span class="n">'+esc(p.n)+'</span><b>'+esc(p.t)+'</b></div><div class="in"></div></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-whc-ct"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var cards=g.querySelector('.spk-wccards'), miss=g.querySelector('.spk-miss'), sel=null, was=done();
    g.querySelector('.spk-wcpic img').src=IMG+cfg.img;
    shuffle(CD).forEach(function(c){ var x=el('div','spk-chip noimg spk-wccard','<span class="ico">'+(c.ico||'🔎')+'</span><span>'+esc(c.t)+'</span>'); x.setAttribute('role','button'); x.tabIndex=0; x.draggable=true; x.dataset.c=c.id; cards.appendChild(x); });
    function paint(drop){
      CD.forEach(function(c){ var x=cards.querySelector('[data-c="'+c.id+'"]'), on=S.wc.indexOf(c.id)>=0; x.classList.toggle('spk-hide',on); x.draggable=!on; });
      PT.forEach(function(p){ var mine=CD.filter(function(c){ return c.part===p.id&&S.wc.indexOf(c.id)>=0; }), b=g.querySelector('.pt[data-p="'+p.id+'"]'), r=g.querySelector('.pr[data-p="'+p.id+'"]');
        b.classList.toggle('hit',mine.length>0); r.classList.toggle('hit',mine.length>0);
        r.querySelector('.in').innerHTML=mine.map(function(c){ return '<div class="it'+(drop===c.id?' new':'')+'"><b>'+esc(c.t)+'</b> '+esc(c.why||'')+'</div>'; }).join(''); });
      var gate=''; if(sorted()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the picture above.'; else if(sorted()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: light every lantern in Learn the Story above.';
      g.querySelector('.spk-si-gate').textContent=gate;
      g.querySelector('.spk-whc-ct').innerHTML=sorted()?'':'<b>'+S.wc.length+' of '+CD.length+'</b> '+esc(cfg.countT||'effects placed.');
      var d=done(); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ g.querySelectorAll('.pt,.pr').forEach(function(t){ t.classList.toggle('armed',on); t.classList.remove('over'); }); }
    function attempt(chip,pid){ if(!chip||!pid) return; var c=find(CD,chip.dataset.c); if(!c||S.wc.indexOf(c.id)>=0) return; arm(false);
      if(c.part===pid){ S.wc.push(c.id); save(); sel=null; miss.textContent=''; sfx('click'); paint(c.id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=c.miss||''; miss.textContent=m; missBeat(m); } }
    cards.addEventListener('click',function(e){ var x=e.target.closest('.spk-wccard'); if(!x) return; ack('explore'); cards.querySelectorAll('.spk-wccard').forEach(function(y){ y.classList.remove('sel'); }); x.classList.add('sel'); sel=x; miss.textContent=''; arm(true); });
    cards.addEventListener('keydown',function(e){ var x=e.target.closest('.spk-wccard'); if(x&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); x.click(); } });
    cards.addEventListener('dragstart',function(e){ var x=e.target.closest('.spk-wccard'); if(!x||!x.draggable){ e.preventDefault(); return; } sel=x; e.dataTransfer.setData('text/plain',x.dataset.c); e.dataTransfer.effectAllowed='move'; arm(true); });
    cards.addEventListener('dragend',function(){ arm(false); });
    function target(e){ var t=e.target.closest('.pt')||e.target.closest('.pr'); return t?t.dataset.p:null; }
    [g.querySelector('.spk-wcpic'),g.querySelector('.spk-wclist')].forEach(function(zone){
      zone.addEventListener('click',function(e){ var p=target(e); if(!p) return; if(!sel){ miss.textContent=cfg.firstT||'Tap an effect card first, then tap the number it changed.'; return; } attempt(sel,p); });
      zone.addEventListener('keydown',function(e){ var t=e.target.closest('.pr'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
      zone.addEventListener('dragover',function(e){ var p=target(e); g.querySelectorAll('.pt,.pr').forEach(function(x){ x.classList.toggle('over',x.dataset.p===p); }); if(p){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
      zone.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,target(e)); }); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var L=CD.filter(function(c){ return S.wc.indexOf(c.id)>=0; }).map(function(c){ var p=find(PT,c.part); return '<p class="a"><b>'+e(c.t)+'</b> → '+e(p?p.n+'. '+p.t:'')+'</p>'; }).join(''); return L||NA; }};
  };

  /* ---- Planner · Steps on a path (4.06.06): four stepping stones. Tap the event that comes next and it settles
     onto the next stone; then pick a "because" that joins two stones (it lays a plank between them). Notes only —
     the student writes. DATA: events [{id,ico,t,miss}] in the right order, becauses [{id,t,at}] (at = the stone index
     the plank starts from) ---- */
  MOD.stones=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var EV=cfg.events||[], BC=cfg.becauses||[]; S.st=S.st||{laid:0,bc:null}; var was=null;
    var done=function(){ return S.st.laid>=EV.length&&!!S.st.bc; };
    var bcT=function(){ var o=find(BC,S.st.bc); return o?o.t:''; };
    var b=el('div','spk spk-builder spk-stones');
    var SX=[44,124,204,284], SY=[78,58,74,52];
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-stpath"><svg viewBox="0 0 330 112" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A quiet path of four stepping stones')+'"><rect width="330" height="112" class="gr"/><path d="M0,96 C70,70 120,100 180,80 S290,60 330,70 L330,112 L0,112 Z" class="rv"/>'
      +SX.map(function(x,i){ return '<g class="sn" data-i="'+i+'"><ellipse cx="'+x+'" cy="'+SY[i]+'" rx="34" ry="15" class="sb"/><text x="'+x+'" y="'+(SY[i]+5)+'" text-anchor="middle" class="si"></text><text x="'+x+'" y="'+(SY[i]+30)+'" text-anchor="middle" class="sk">'+(i+1)+'</text></g>'; }).join('')
      +'<g class="plank"><line x1="0" y1="0" x2="0" y2="0"/></g></svg></div>'
      +'<div class="spk-stlaid"></div>'
      +'<div class="spk-step" data-r="ev"><div class="lab">👣 1 · '+esc(cfg.q1||'Tap the event that comes next')+'</div><div class="spk-opts">'+shuffle(EV.map(function(e,i){ return i; })).map(function(i){ var e=EV[i]; return '<button type="button" class="spk-opt" data-i="'+i+'">'+(e.ico?e.ico+' ':'')+esc(e.t)+'</button>'; }).join('')+'</div><p class="spk-miss"></p></div>'
      +'<div class="spk-step stbc locked" data-r="bc"><div class="lab">🪵 2 · '+esc(cfg.q2||'Pick a because that joins two stones')+'</div><div class="spk-opts">'+BC.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Your path is laid. Now write in Step 3.')+'</p><div class="spk-plan"></div>';
    function lines(){ var L=[]; for(var i=0;i<Math.min(S.st.laid,EV.length);i++) L.push([(cfg.stoneLab||'Stone')+' '+(i+1),EV[i].t]); if(S.st.bc) L.push([cfg.bcLab||'Because',bcT()]); return L; }
    function paint(anim){ var k=S.st.laid;
      b.querySelectorAll('.sn').forEach(function(s){ var i=+s.dataset.i, on=i<k; s.classList.toggle('on',on); s.classList.toggle('next',i===k); s.querySelector('.si').textContent=on?(EV[i].ico||'●'):''; if(anim===i){ s.classList.remove('set'); void s.getBoundingClientRect(); s.classList.add('set'); } });
      b.querySelector('.spk-stlaid').innerHTML=EV.slice(0,k).map(function(e,i){ return '<div class="it"><span class="n">'+(i+1)+'</span>'+esc(e.t)+'</div>'; }).join('');
      b.querySelectorAll('.spk-step[data-r="ev"] .spk-opt').forEach(function(o){ var i=+o.dataset.i; o.classList.toggle('spk-hide',i<k); });
      b.querySelector('.spk-step[data-r="ev"]').classList.toggle('spk-hide',k>=EV.length);
      b.querySelector('.stbc').classList.toggle('locked',k<EV.length);
      b.querySelectorAll('.stbc .spk-opt').forEach(function(o){ o.classList.toggle('on',o.dataset.v===S.st.bc); });
      var pl=b.querySelector('.plank'), o=find(BC,S.st.bc); pl.classList.toggle('on',!!o);
      if(o){ var a=o.at||0, ln=pl.querySelector('line'); ln.setAttribute('x1',SX[a]+30); ln.setAttribute('y1',SY[a]); ln.setAttribute('x2',SX[a+1]-30); ln.setAttribute('y2',SY[a+1]); }
      var all=done(); was=all; b.classList.toggle('done',all);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var st=o.closest('.spk-step'); if(!st||st.classList.contains('locked')) return; var miss=b.querySelector('.spk-miss');
      if(st.dataset.r==='ev'){ var i=+o.dataset.i; if(i===S.st.laid){ S.st.laid++; miss.textContent=''; save(); sfx('click'); paint(i); } else { o.classList.add('shake'); setTimeout(function(){ o.classList.remove('shake'); },450); miss.textContent=(EV[S.st.laid]&&EV[S.st.laid].miss)||cfg.orderT||'Not yet. What had to happen first?'; } return; }
      S.st.bc=o.dataset.v; save(); sfx('click'); paint(); });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · The memory path (4.06.06, memor = remember): four flat stones along a quiet path, a word on
     each. Tap each word to hear it (g4ss-<lesson>-memor-<n>.mp3 when it exists). Then put each meaning on its word;
     each match sets that stone and lights a small light beside it. When all four are set, a memorial stone appears
     at the end of the path. ---- */
  MOD.memorypath=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], ROOT=cfg.root||'memor'; S.mp=S.mp||{heard:[],set:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.mp.set.length===W.length; };
    var g=el('div','spk spk-mpath');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'The Memory Path')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-mpwrap"><svg class="mpv" viewBox="0 0 340 70" aria-hidden="true"><defs><radialGradient id="spkMpGlow"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".95"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient></defs><rect width="340" height="70" class="gr"/><path d="M0,54 C20,52 28,50 42,50 S100,42 127,44 S190,50 212,48 S272,40 297,40 S330,36 340,36" class="pa"/>'
      +W.map(function(x,i){ var cx=[42.5,127.5,212.5,297.5][i%4], cy=[50,44,48,40][i%4]; return '<g class="mk" data-i="'+i+'"><circle cx="'+cx+'" cy="'+(cy-6)+'" r="22" class="lt" fill="url(#spkMpGlow)"/><ellipse cx="'+cx+'" cy="'+cy+'" rx="17" ry="6" class="lc"/></g>'; }).join('')
      +'<g class="memo"><path d="M321,40 L321,16 Q329,6 337,16 L337,40 Z" class="ms"/><path d="M325,23 H333 M325,29 H333" class="ml"/></g></svg>'
      +'<div class="wds">'+W.map(function(x,i){ return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-mp-ct"></p><div class="spk-chips spk-mpmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-mpmeans'), miss=g.querySelector('.spk-miss'), wds=g.querySelector('.wds'), svg=g.querySelector('.mpv'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-'+ROOT+'-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-mpmean','<span class="ico">🪨</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.mp.heard.length===W.length;
      wds.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.mp.heard.indexOf(i)>=0, u=S.mp.set.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      svg.querySelectorAll('.mk').forEach(function(m){ m.classList.toggle('on',S.mp.set.indexOf(+m.dataset.i)>=0); });
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-mpmean').forEach(function(t){ var f=S.mp.set.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-mp-ct').innerHTML=!allH?'<b>'+S.mp.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(done()?'':'<b>'+S.mp.set.length+' of '+W.length+'</b> '+esc(cfg.upT||'stones set. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ wds.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.mp.set.indexOf(i)>=0||S.mp.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.mp.set.push(i); save(); sel=null; miss.textContent=''; sfx('click'); paint(i); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wds.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.mp.heard.length===W.length){ attempt(sel,c); return; }
      if(S.mp.heard.indexOf(i)<0){ S.mp.heard.push(i); save(); sfx('click'); } say(i); paint('h'); });
    wds.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-mpmean'); if(!t) return; if(S.mp.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-mpmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-mpmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-mpmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wds.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wds.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wds.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };

  /* ---- shared drawings for 4.06.07 (museum shelf, magnifier planner): four early-Florida objects, drawn plainly,
     each in its own 100×100 box. No words in the pictures. ---- */
  function objArt(k){
    if(k==='wall') return '<g class="oa"><rect x="14" y="40" width="72" height="46" fill="#D9C8A0" stroke="#8A7448" stroke-width="2"/>'
      +'<rect x="14" y="28" width="16" height="12" fill="#D9C8A0" stroke="#8A7448" stroke-width="2"/><rect x="42" y="28" width="16" height="12" fill="#D9C8A0" stroke="#8A7448" stroke-width="2"/><rect x="70" y="28" width="16" height="12" fill="#D9C8A0" stroke="#8A7448" stroke-width="2"/>'
      +'<path d="M14,55 H86 M14,70 H86 M38,40 V55 M62,40 V55 M26,55 V70 M50,55 V70 M74,55 V70 M38,70 V86 M62,70 V86" stroke="#A8916A" stroke-width="1.3" fill="none"/>'
      +[[20,46],[31,49],[47,45],[55,49],[68,46],[79,50],[20,62],[34,60],[44,64],[58,61],[66,64],[80,60],[22,78],[30,76],[47,79],[54,75],[70,79],[82,76]].map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.4" fill="#F6EEDA" stroke="#A8916A" stroke-width=".5"/>'; }).join('')+'</g>';
    if(k==='mission') return '<g class="oa"><path d="M20,86 V52 L44,34 L68,52 V86 Z" fill="#E6D3A6" stroke="#7A5A2A" stroke-width="2"/><path d="M14,54 L44,30 L74,54" fill="none" stroke="#8A4A22" stroke-width="5" stroke-linejoin="round"/>'
      +'<path d="M38,86 V68 Q44,60 50,68 V86 Z" fill="#7A5A2A"/><rect x="66" y="40" width="18" height="46" fill="#E6D3A6" stroke="#7A5A2A" stroke-width="2"/><path d="M69,56 Q75,46 81,56 Z" fill="#5A4220"/>'
      +'<path d="M71,58 Q75,50 79,58 L80,62 H70 Z" fill="#C9A24A" stroke="#7A5A1A" stroke-width="1"/><circle cx="75" cy="63" r="1.4" fill="#7A5A1A"/><path d="M75,40 V26 M70,31 H80" stroke="#5A3818" stroke-width="2.4" stroke-linecap="round"/>'
      +'<path d="M6,90 H94" stroke="#8A7448" stroke-width="2"/><path d="M8,94 Q20,88 30,94 M60,94 Q72,88 84,94" stroke="#6E8A3A" stroke-width="2" fill="none"/></g>';
    if(k==='pot') return '<g class="oa"><path d="M36,26 H64 L62,34 Q84,44 80,64 Q76,86 50,88 Q24,86 20,64 Q16,44 38,34 Z" fill="#B8693A" stroke="#6E3414" stroke-width="2"/>'
      +'<path d="M27,50 Q50,58 73,50 M25,60 Q50,68 75,60" stroke="#7A3A12" stroke-width="1.4" fill="none" stroke-dasharray="2 3"/><path d="M30,76 Q50,92 70,76 Q66,88 50,88 Q34,88 30,76 Z" fill="#3A2A20" opacity=".55"/>'
      +'<path d="M78,74 L90,70 L92,82 L80,84 Z" fill="#B8693A" stroke="#6E3414" stroke-width="1.6"/></g>';
    if(k==='tools') return '<g class="oa"><path d="M24,88 L58,20" stroke="#8A5A2A" stroke-width="5" stroke-linecap="round"/><path d="M50,16 L72,14 L74,26 L56,30 Z" fill="#8E949C" stroke="#3E434A" stroke-width="1.6"/><path d="M72,14 L74,26" stroke="#C9CDD2" stroke-width="1.4"/>'
      +'<path d="M70,88 L52,46" stroke="#9A6A34" stroke-width="5" stroke-linecap="round"/><path d="M40,40 Q52,30 64,42 L58,52 Q52,46 46,50 Z" fill="#8E949C" stroke="#3E434A" stroke-width="1.6"/><path d="M41,41 L44,44 M47,38 L49,42" stroke="#5A5F66" stroke-width="1.2"/></g>';
    return '';
  }

  /* ---- Scene 1 · The museum shelf (4.06.07): four early-Florida objects stand on a dark museum shelf with no labels.
     Round 1: hang each name tag on its object (tap a tag, then the object, or drag). Its spotlight comes on.
     Round 2: put each "what it reveals" card on its object; the cards collect on the plaques under the shelf.
     When every object is labeled and explained, the whole case lights up. DATA: items [{id,art,name,where,miss}],
     cards [{id,item,ico,t,miss}] ---- */
  MOD.museumshelf=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var IT=cfg.items||[], CD=cfg.cards||[], n=IT.length||1, W=400, gap=W/n;
    S.mus=S.mus||{named:[],put:[]};
    var named=function(){ return IT.length>0&&IT.every(function(i){ return S.mus.named.indexOf(i.id)>=0; }); };
    var done=function(){ return named()&&CD.every(function(c){ return S.mus.put.indexOf(c.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var shelf='<svg class="musv" viewBox="0 0 '+W+' 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A dark museum shelf with four objects and no labels')+'">'
      +'<defs><linearGradient id="spkMusCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1C8" stop-opacity=".75"/><stop offset="1" stop-color="#FFF1C8" stop-opacity="0"/></linearGradient></defs>'
      +'<rect width="'+W+'" height="190" class="wall"/><rect x="0" y="150" width="'+W+'" height="12" class="ledge"/><rect x="0" y="162" width="'+W+'" height="28" class="base"/>'
      +IT.map(function(it,i){ var cx=gap*i+gap/2, x=cx-45; return '<g class="ob" data-o="'+esc(it.id)+'" role="button" tabindex="0" aria-label="'+esc(it.where||it.name)+'">'
        +'<path class="cone" d="M'+(cx-8)+',0 L'+(cx+8)+',0 L'+(cx+44)+',150 L'+(cx-44)+',150 Z" fill="url(#spkMusCone)"/><rect class="lamp" x="'+(cx-9)+'" y="0" width="18" height="6" rx="2"/>'
        +'<rect class="hit" x="'+(cx-gap/2+3)+'" y="10" width="'+(gap-6)+'" height="150" rx="8"/>'
        +'<g transform="translate('+x.toFixed(1)+',52) scale(.9)">'+objArt(it.art)+'</g>'
        +'<path class="string" d="M'+(cx+30)+',138 Q'+(cx+36)+',150 '+(cx+38)+',158"/><g class="tag"><rect x="'+(cx-40)+'" y="156" width="80" height="22" rx="4"/><text x="'+cx+'" y="171" text-anchor="middle">'+esc(it.name)+'</text></g><g class="blank"><rect x="'+(cx-22)+'" y="156" width="44" height="22" rx="4"/><text x="'+cx+'" y="171" text-anchor="middle">?</text></g></g>'; }).join('')+'</svg>';
    var g=el('div','spk spk-game spk-mus');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'The Museum Shelf')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<p class="spk-hlstep spk-musstep"></p><div class="spk-chips spk-hltray spk-mustray"></div><p class="spk-miss"></p>'
      +'<div class="spk-musw">'+shelf+'</div><div class="spk-musplaques">'+IT.map(function(it){ return '<div class="pq" data-o="'+esc(it.id)+'" role="button" tabindex="0" aria-label="'+esc(it.where||it.name)+'"><div class="lab"><b class="nmx">?</b></div><div class="in"></div></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-mus-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var tray=g.querySelector('.spk-mustray'), miss=g.querySelector('.spk-miss'), svg=g.querySelector('.musv'), sel=null, was=done();
    function fill(){ tray.innerHTML=''; sel=null;
      if(!named()) shuffle(IT.filter(function(i){ return S.mus.named.indexOf(i.id)<0; })).forEach(function(i){ var c=el('div','spk-chip noimg spk-hltag','<span class="ico">🏷️</span><span><b>'+esc(i.name)+'</b></span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.k='n'; c.dataset.i=i.id; tray.appendChild(c); });
      else shuffle(CD.filter(function(c){ return S.mus.put.indexOf(c.id)<0; })).forEach(function(x){ var c=el('div','spk-chip noimg spk-hlcard','<span class="ico">'+(x.ico||'🔎')+'</span><span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.k='c'; c.dataset.i=x.id; tray.appendChild(c); }); }
    function paint(drop){ var nm=named();
      IT.forEach(function(it){ var on=S.mus.named.indexOf(it.id)>=0, o=svg.querySelector('.ob[data-o="'+it.id+'"]'), p=g.querySelector('.pq[data-o="'+it.id+'"]');
        var mine=CD.filter(function(c){ return c.item===it.id&&S.mus.put.indexOf(c.id)>=0; });
        o.classList.toggle('named',on); o.classList.toggle('full',on&&mine.length>0); if(drop===it.id&&on){ o.classList.remove('lit'); void o.getBoundingClientRect(); o.classList.add('lit'); }
        p.classList.toggle('named',on); p.querySelector('.nmx').textContent=on?it.name:'?';
        p.querySelector('.in').innerHTML=mine.map(function(c){ return '<div class="it'+(drop===c.id?' new':'')+'">'+(c.ico?'<span aria-hidden="true">'+c.ico+'</span> ':'')+esc(c.t)+'</div>'; }).join(''); });
      g.querySelector('.spk-musstep').innerHTML=!nm?'<b>1 ·</b> '+esc(cfg.nameT||'Hang each name tag on its object.'):(done()?'':'<b>2 ·</b> '+esc(cfg.revealT||'Now put each card on the object it tells about.'));
      var k=nm?S.mus.put.length:S.mus.named.length, of=nm?CD.length:IT.length;
      g.querySelector('.spk-mus-ct').innerHTML=done()?'':'<b>'+k+' of '+of+'</b> '+esc(nm?(cfg.cardsCt||'cards placed.'):(cfg.namesCt||'labels hung.'));
      var d=done(); if(d&&!was&&drop) setTimeout(function(){ sfx('win'); },350); was=d;
      g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); g.classList.toggle('round2',nm); }
    function arm(on){ g.querySelectorAll('.ob,.pq').forEach(function(z){ z.classList.toggle('armed',on); z.classList.remove('over'); }); }
    function attempt(chip,oid){ if(!chip||!oid) return; var k=chip.dataset.k, id=chip.dataset.i; arm(false);
      if(k==='n'){ var it=find(IT,id); if(!it||S.mus.named.indexOf(id)>=0) return;
        if(id===oid){ S.mus.named.push(id); save(); miss.textContent=''; sfx('clink'); if(named()) fill(); else chip.remove(); sel=null; paint(oid); refreshFile(); refreshVoice(); }
        else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=it.miss||''; miss.textContent=m; missBeat(m); } }
      else { var c=find(CD,id); if(!c||S.mus.put.indexOf(id)>=0) return;
        if(S.mus.named.indexOf(oid)<0){ miss.textContent=cfg.nameFirstT||'Hang a name tag on that object first.'; return; }
        if(c.item===oid){ S.mus.put.push(id); save(); miss.textContent=''; sfx('paper'); chip.remove(); sel=null; paint(id); refreshFile(); refreshVoice(); }
        else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m2=c.miss||''; miss.textContent=m2; missBeat(m2); } } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-chip'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-chip').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-chip'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    /* no ack() on dragstart: it folds the opening text and shifts the page mid-drag; the drop acks instead */
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-chip'); if(!c){ e.preventDefault(); return; } sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); setTimeout(function(){ ack('open'); },0); });
    function target(e){ var z=e.target.closest('.ob')||e.target.closest('.pq'); return z?z.dataset.o:null; }
    [svg,g.querySelector('.spk-musplaques')].forEach(function(zone){
      zone.addEventListener('click',function(e){ var o=target(e); if(!o) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a tag or card first, then tap the object it goes with.'; return; } attempt(sel,o); });
      zone.addEventListener('keydown',function(e){ var z=e.target.closest('.ob')||e.target.closest('.pq'); if(z&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); z.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
      zone.addEventListener('dragover',function(e){ var o=target(e); g.querySelectorAll('.ob,.pq').forEach(function(x){ x.classList.toggle('over',x.dataset.o===o); }); if(o){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
      zone.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,target(e)); }); });
    fill(); paint();
    return {done:done, journal:function(e,NA){ var L=IT.map(function(it){ var c=CD.filter(function(x){ return x.item===it.id&&S.mus.put.indexOf(x.id)>=0; }); return c.length?'<p class="a"><b>'+e(it.name)+':</b> '+e(c.map(function(x){ return x.t; }).join(' · '))+'</p>':''; }).join(''); return L||NA; }};
  };

  /* ---- Explore reading · Dig the trench (4.06.07): a cut-away dig under the ground, five soil layers. Brush the
     glowing layer (tap it, or the "Brush layer N" button at the end of a part): the dirt sweeps away, the object
     buried there shows, and that part of the reading opens below. DATA: paras [{id,match}], layers [{id,t,obj,paras:[]}]
     obj: book | block | bell | shard | unknown ---- */
  function trenchObj(k,x,y){
    if(k==='book') return '<g transform="translate('+x+','+y+')"><rect x="-13" y="-7" width="26" height="15" rx="2" fill="#F3E7C6" stroke="#6E5A3A" stroke-width="1.2"/><path d="M0,-7 V8 M-9,-3 H-3 M-9,1 H-3 M3,-3 H9 M3,1 H9" stroke="#8A7448" stroke-width="1"/><path d="M14,4 L26,-6 L29,-3 L17,7 Z" fill="#9A6A34" stroke="#5A3818" stroke-width="1"/><path d="M26,-6 L31,-11 L34,-8 L29,-3 Z" fill="#8E949C"/></g>';
    if(k==='block') return '<g transform="translate('+x+','+y+')"><rect x="-17" y="-9" width="34" height="18" fill="#D9C8A0" stroke="#8A7448" stroke-width="1.3"/>'+[[-11,-4],[-4,2],[3,-3],[10,3],[-12,5],[6,-6],[13,-2]].map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.3" fill="#F6EEDA" stroke="#A8916A" stroke-width=".5"/>'; }).join('')+'</g>';
    if(k==='bell') return '<g transform="translate('+x+','+y+') rotate(-14)"><path d="M-10,8 Q-10,-10 0,-11 Q10,-10 10,8 L13,11 H-13 Z" fill="#C9A24A" stroke="#7A5A1A" stroke-width="1.3"/><circle cx="0" cy="13" r="2.2" fill="#7A5A1A"/><path d="M-4,-11 Q0,-17 4,-11" fill="none" stroke="#7A5A1A" stroke-width="1.6"/></g>';
    if(k==='shard') return '<g transform="translate('+x+','+y+')"><path d="M-22,-4 L-6,-10 L2,0 L-10,8 L-20,6 Z" fill="#B8693A" stroke="#6E3414" stroke-width="1.2"/><path d="M-18,0 L-6,-4" stroke="#7A3A12" stroke-width="1" stroke-dasharray="2 2"/><path d="M6,8 L22,-8" stroke="#8A5A2A" stroke-width="3" stroke-linecap="round"/><path d="M17,-12 L27,-12 L26,-4 L19,-3 Z" fill="#8E949C" stroke="#3E434A" stroke-width="1"/></g>';
    if(k==='unknown') return '<g transform="translate('+x+','+y+')"><ellipse cx="0" cy="0" rx="18" ry="9" fill="none" stroke="#F3E7C6" stroke-width="1.4" stroke-dasharray="3 3"/><text x="0" y="5" text-anchor="middle" style="font:800 14px Nunito,sans-serif;fill:#F3E7C6">?</text></g>';
    return '';
  }
  MOD.trench=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var LA=cfg.layers||[], n=LA.length; if(S.tch==null) S.tch=0;
    var done=function(){ return n>0&&S.tch>=n; };
    var W=340, top=38, bh=(150-top)/Math.max(n,1), COL=['#B89A6A','#A88458','#97744C','#866642','#73573A'];
    var w=el('div','spk spk-tch');
    w.innerHTML='<div class="spk-tchbar"><svg viewBox="0 0 '+W+' 154" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A cut-away dig with five soil layers under a stone fort')+'">'
      +'<rect width="'+W+'" height="'+top+'" class="sky"/>'
      +'<path class="fort" d="M196,'+top+' V22 H206 V17 H212 V22 H244 V20 L252,13 L260,20 V22 H292 V17 H298 V22 H306 V'+top+' Z"/><path class="grass" d="M0,'+(top-2)+' H'+W+' V'+(top+2)+' H0 Z"/>'
      +LA.map(function(l,i){ var y=top+i*bh, cy=(y+bh/2).toFixed(1); return '<g class="ly" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc('Layer '+(i+1)+'. '+l.t)+'">'
        +'<rect class="soil" x="0" y="'+y.toFixed(1)+'" width="'+W+'" height="'+(bh+.5).toFixed(1)+'" fill="'+COL[i%COL.length]+'"/>'
        +'<g class="obj">'+trenchObj(l.obj,W/2-20+(i%2?40:-30),cy)+'</g>'
        +'<rect class="dirt" x="0" y="'+y.toFixed(1)+'" width="'+W+'" height="'+(bh+.5).toFixed(1)+'"/>'
        +'<path class="crumbs" d="M20,'+(y+bh*.35).toFixed(1)+' h3 M70,'+(y+bh*.7).toFixed(1)+' h4 M140,'+(y+bh*.4).toFixed(1)+' h3 M230,'+(y+bh*.65).toFixed(1)+' h4 M300,'+(y+bh*.3).toFixed(1)+' h3"/>'
        +'<rect class="edge" x="1.5" y="'+(y+1).toFixed(1)+'" width="'+(W-3)+'" height="'+(bh-2).toFixed(1)+'" rx="4"/>'
        +'<text class="num" x="14" y="'+(+cy+4)+'" text-anchor="middle">'+(i+1)+'</text></g>'; }).join('')
      +'<g class="brushg"><path d="M0,0 L18,-6 L20,-1 L2,5 Z" class="bh"/><path d="M18,-6 L28,-9 L30,-3 L20,-1 Z" class="bb"/></g>'
      +'</svg><p class="spk-ys-ct spk-tchct"></p></div><div class="spk-lanread spk-tchread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-tchread'), boxes={}, svg=w.querySelector('svg');
    LA.forEach(function(l,i){ var b=el('div','spk-lanp spk-tchp'); b.innerHTML='<div class="tab"><span class="y">'+(i+1)+'</span><b>'+esc(l.t)+'</b></div>'; list.appendChild(b); (l.paras||[]).forEach(function(pid){ var p=found[pid]; if(p) move(p,function(nd){ b.appendChild(nd); }); });
      if(i<n-1){ var nx=el('button','spk-lannext spk-tchnext','🖌️ '+esc((cfg.nextT||'Brush layer {n}').replace('{n}',i+2))); nx.type='button'; nx.addEventListener('click',function(){ go(i+1); }); b.appendChild(nx); }
      boxes[i]=b; });
    function paint(anim){ var k=S.tch;
      svg.querySelectorAll('.ly').forEach(function(g2){ var i=+g2.dataset.i; g2.classList.toggle('open',i<k); g2.classList.toggle('next',i===k); if(anim&&i===k-1){ g2.classList.remove('sweep'); void g2.getBoundingClientRect(); g2.classList.add('sweep'); } });
      var br=svg.querySelector('.brushg'); if(anim&&k>0){ var yy=top+(k-1)*bh+bh/2; br.setAttribute('transform','translate(0,'+yy.toFixed(1)+')'); br.classList.remove('go'); void br.getBoundingClientRect(); br.classList.add('go'); }
      LA.forEach(function(l,i){ var b=boxes[i]; b.classList.toggle('on',i<k); b.classList.toggle('cur',i===k-1); });
      w.classList.toggle('all',done());
      w.querySelector('.spk-tchct').innerHTML=done()?'<b>'+esc(cfg.allT||'Every layer is brushed. You read the whole dig.')+'</b>':(k===0?esc(cfg.startT||'Tap the glowing layer to brush it.'):'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'layers brushed. Read this part, then brush the next one.'));
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i){ if(i!==S.tch||done()) return; ack('explore'); S.tch++; save(); sfx('brush'); setTimeout(function(){ sfx('brush'); },180); paint(true); refreshFile(); refreshVoice();
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },350); } }
    svg.addEventListener('click',function(e){ var m=e.target.closest('.ly'); if(!m) return; var i=+m.dataset.i; if(i<S.tch){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} return; } if(i>S.tch){ w.querySelector('.spk-tchct').innerHTML=esc(cfg.orderT||'Dig from the top down: brush the glowing layer first.'); return; } go(i); });
    svg.addEventListener('keydown',function(e){ var m=e.target.closest('.ly'); if(m&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); m.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
    paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Layers brushed: '+Math.min(S.tch,n)+' of '+n+'.</p>'; }};
  };

  /* ---- Explore evidence · Spot the detail (4.06.07): a clue card says what to look for ("a way for soldiers to fight
     back"). Tap the card, then the gold number on the photo where you spot it. A magnifying lens settles on that spot,
     and the detail goes in the found list with what it tells us. One clue is honest-historian work: find something in
     the photo that is NOT from Spanish times. Also needs the photo labels and the reading.
     DATA: img, alt, spots [{n,x,y}] (x,y in % of the picture), clues [{id,ico,t,n,kind,reveal,miss}], kinds {k:{t,ico}} ---- */
  MOD.spotpic=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var SP=cfg.spots||[], CL=cfg.clues||[], KD=cfg.kinds||{}; S.spy=S.spy||[];
    var found=function(){ return CL.length>0&&CL.every(function(c){ return S.spy.indexOf(c.id)>=0; }); };
    var done=function(){ return found()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-spy');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Spot the Detail')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-chips spk-spyclues"></div><p class="spk-miss"></p>'
      +'<div class="spk-spypic"><img alt="'+esc(cfg.alt||'')+'">'+SP.map(function(p){ return '<button type="button" class="pt" data-n="'+esc(p.n)+'" style="left:'+p.x+'%;top:'+p.y+'%" aria-label="'+esc('Number '+p.n)+'"></button>'; }).join('')+'<div class="lenses"></div></div>'
      +'<div class="spk-spyfound"></div><p class="spk-bell-ct spk-spy-ct"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var clues=g.querySelector('.spk-spyclues'), miss=g.querySelector('.spk-miss'), pic=g.querySelector('.spk-spypic'), img=pic.querySelector('img'), sel=null, was=done(), SRC=IMG+cfg.img;
    img.src=SRC;
    CL.forEach(function(c){ var x=el('div','spk-chip noimg spk-spyclue','<span class="ico">'+(c.ico||'🔎')+'</span><span>'+esc(c.t)+'</span>'); x.setAttribute('role','button'); x.tabIndex=0; x.draggable=true; x.dataset.c=c.id; clues.appendChild(x); });
    function lens(c,anim){ var p=find(SP,c.n,'n'); if(!p) return ''; var Z=4; return '<span class="lens'+(anim?' new':' kept')+'" style="left:'+p.x+'%;top:'+p.y+'%;background-image:url(\''+SRC+'\');background-size:'+(Z*100)+'% auto;background-position:'+p.x+'% '+p.y+'%"><i>'+esc(p.n)+'</i></span>'; }
    function paint(drop){
      CL.forEach(function(c){ var x=clues.querySelector('[data-c="'+c.id+'"]'), on=S.spy.indexOf(c.id)>=0; x.classList.toggle('spk-hide',on); x.draggable=!on; });
      pic.querySelector('.lenses').innerHTML=CL.filter(function(c){ return S.spy.indexOf(c.id)>=0; }).map(function(c){ return lens(c,drop===c.id); }).join('');
      SP.forEach(function(p){ pic.querySelector('.pt[data-n="'+p.n+'"]').classList.toggle('hit',CL.some(function(c){ return c.n===p.n&&S.spy.indexOf(c.id)>=0; })); });
      g.querySelector('.spk-spyfound').innerHTML=S.spy.map(function(id){ var c=find(CL,id), k=KD[c.kind]||{}; return '<div class="it'+(drop===id?' new':'')+'"><span class="n">'+esc(c.n)+'</span><div><span class="kd kd-'+esc(c.kind||'')+'">'+(k.ico?k.ico+' ':'')+esc(k.t||'')+'</span><b>'+esc(c.t)+'.</b> '+esc(c.reveal||'')+'</div></div>'; }).join('');
      var gate=''; if(found()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the photo above to read its label.'; else if(found()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: brush every layer in Learn the Story at the top of this tab.';
      g.querySelector('.spk-si-gate').textContent=gate;
      g.querySelector('.spk-spy-ct').innerHTML=found()?'':'<b>'+S.spy.length+' of '+CL.length+'</b> '+esc(cfg.countT||'details spotted.');
      var d=done(); if(d&&!was&&drop) setTimeout(function(){ sfx('win'); },300); was=d; g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function arm(on){ pic.querySelectorAll('.pt').forEach(function(t){ t.classList.toggle('armed',on); t.classList.remove('over'); }); }
    function attempt(chip,num){ if(!chip||num==null) return; var c=find(CL,chip.dataset.c); if(!c||S.spy.indexOf(c.id)>=0) return; arm(false);
      if(String(c.n)===String(num)){ S.spy.push(c.id); save(); sel=null; miss.textContent=''; sfx('clink'); paint(c.id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=c.miss||''; miss.textContent=m; missBeat(m); } }
    clues.addEventListener('click',function(e){ var x=e.target.closest('.spk-spyclue'); if(!x) return; ack('explore'); clues.querySelectorAll('.spk-spyclue').forEach(function(y){ y.classList.remove('sel'); }); x.classList.add('sel'); sel=x; miss.textContent=''; arm(true); });
    clues.addEventListener('keydown',function(e){ var x=e.target.closest('.spk-spyclue'); if(x&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); x.click(); } });
    clues.addEventListener('dragstart',function(e){ var x=e.target.closest('.spk-spyclue'); if(!x||!x.draggable){ e.preventDefault(); return; } sel=x; e.dataTransfer.setData('text/plain',x.dataset.c); e.dataTransfer.effectAllowed='move'; arm(true); });
    clues.addEventListener('dragend',function(){ arm(false); });
    pic.addEventListener('click',function(e){ var t=e.target.closest('.pt'); if(!t) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a clue card first, then tap the number where you spot it.'; return; } attempt(sel,t.dataset.n); });
    pic.addEventListener('dragover',function(e){ var t=e.target.closest('.pt'); pic.querySelectorAll('.pt').forEach(function(x){ x.classList.toggle('over',x===t); }); if(t){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    pic.addEventListener('drop',function(e){ e.preventDefault(); var t=e.target.closest('.pt'); if(t) attempt(sel,t.dataset.n); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var L=S.spy.map(function(id){ var c=find(CL,id); return '<p class="a"><b>'+e(c.n)+' · '+e(c.t)+':</b> '+e(c.reveal||'')+'</p>'; }).join(''); return L||NA; }};
  };

  /* ---- Planner · The magnifier (4.06.07): pick one building or object, then slide the magnifying glass over its
     picture (drag it, or tap a faint ring and it glides there). Each detail it passes over is found and kept as a note.
     Then pick what it reveals and one thing it can't tell us. Notes only — the student writes the sentences.
     DATA: objects [{id,art,t,ico,spots:[{x,y,t}],unknowns:[…]}] (x,y on the 100×100 drawing), reveals [...] ---- */
  MOD.magnifier=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var OB=cfg.objects||[], RV=cfg.reveals||[], NEED=cfg.need||2; S.mag=S.mag||{o:null,seen:[],rv:null,un:null}; var M=S.mag;
    var cur=function(){ return find(OB,M.o); };
    var done=function(){ var o=cur(); return !!(o&&M.seen.length>=Math.min(NEED,o.spots.length)&&M.rv!=null&&M.un!=null); };
    var b=el('div','spk spk-builder spk-mag');
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-step" data-r="o"><div class="lab">🏛️ 1 · '+esc(cfg.q1||'Pick your building or object')+'</div><div class="spk-opts">'+OB.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+(o.ico?o.ico+' ':'')+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step locked" data-r="look"><div class="lab">🔍 2 · '+esc(cfg.q2||'Slide the magnifier over the picture to find details')+'</div><div class="spk-magpic"><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="100" height="100" rx="8" class="bg"/><g class="art"></g><g class="rings"></g></svg><div class="glass" role="button" tabindex="0" aria-label="'+esc(cfg.glassT||'Magnifying glass. Drag it, or tap a faint ring.')+'"><span class="rim"></span><span class="hd"></span></div></div><p class="spk-magct"></p><div class="spk-magfound"></div></div>'
      +'<div class="spk-step locked" data-r="rv"><div class="lab">💡 3 · '+esc(cfg.q3||'What does it reveal?')+'</div><div class="spk-opts">'+RV.map(function(t,i){ return '<button type="button" class="spk-opt" data-v="'+i+'">'+esc(t)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step locked" data-r="un"><div class="lab">⚖️ 4 · '+esc(cfg.q4||'What can it NOT tell us?')+'</div><div class="spk-opts spk-magun"></div></div>'
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Your notes are ready. Now write your own sentences in Step 3.')+'</p><div class="spk-plan"></div>';
    var pic=b.querySelector('.spk-magpic'), glass=pic.querySelector('.glass'), art=pic.querySelector('.art'), rings=pic.querySelector('.rings');
    function lines(){ var o=cur(), L=[]; if(!o) return L; L.push([cfg.objLab||'I chose',o.t]); M.seen.forEach(function(i){ L.push([cfg.detLab||'Detail',o.spots[i].t]); }); if(M.rv!=null) L.push([cfg.rvLab||'It reveals',RV[M.rv]]); if(M.un!=null) L.push([cfg.unLab||'Still unknown',o.unknowns[M.un]]); return L; }
    function place(x,y,anim){ glass.classList.toggle('glide',!!anim); glass.style.left=x+'%'; glass.style.top=y+'%'; }
    function check(x,y,fromDrop){ var o=cur(); if(!o) return; var hit=-1; o.spots.forEach(function(s,i){ if(Math.hypot(s.x-x,s.y-y)<13) hit=i; });
      rings.querySelectorAll('.rg').forEach(function(r){ r.classList.toggle('under',+r.dataset.i===hit); });
      if(hit>=0&&M.seen.indexOf(hit)<0){ M.seen.push(hit); save(); sfx('clink'); paint(hit); } }
    function drawObj(){ var o=cur(); art.innerHTML=o?objArt(o.art):''; rings.innerHTML=o?o.spots.map(function(s,i){ return '<g class="rg" data-i="'+i+'"><circle cx="'+s.x+'" cy="'+s.y+'" r="9"/></g>'; }).join(''):''; place(50,92); }
    function paint(newI){ var o=cur();
      b.querySelectorAll('.spk-step[data-r="o"] .spk-opt').forEach(function(x){ x.classList.toggle('on',x.dataset.v===M.o); });
      ['look','rv','un'].forEach(function(r,i){ var st=b.querySelector('.spk-step[data-r="'+r+'"]'); st.classList.toggle('locked',!o||(i>0&&M.seen.length<Math.min(NEED,o.spots.length))); });
      rings.querySelectorAll('.rg').forEach(function(r){ r.classList.toggle('seen',M.seen.indexOf(+r.dataset.i)>=0); });
      b.querySelector('.spk-magct').innerHTML=o?(M.seen.length>=Math.min(NEED,o.spots.length)?'<b>'+M.seen.length+' of '+o.spots.length+'</b> '+esc(cfg.enoughT||'details found. That is enough evidence. Find the last one too if you want.'):'<b>'+M.seen.length+' of '+o.spots.length+'</b> '+esc(cfg.findT||'details found. Find at least 2.')):'';
      b.querySelector('.spk-magfound').innerHTML=o?M.seen.map(function(i){ return '<div class="it'+(newI===i?' new':'')+'">🔍 '+esc(o.spots[i].t)+'</div>'; }).join(''):'';
      b.querySelector('.spk-magun').innerHTML=o?(o.unknowns||[]).map(function(t,i){ return '<button type="button" class="spk-opt'+(M.un===i?' on':'')+'" data-v="'+i+'">'+esc(t)+'</button>'; }).join(''):'';
      b.querySelectorAll('.spk-step[data-r="rv"] .spk-opt').forEach(function(x){ x.classList.toggle('on',+x.dataset.v===M.rv); });
      b.classList.toggle('done',done());
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your notes will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var x=e.target.closest('.spk-opt'); if(!x) return; var st=x.closest('.spk-step'); if(!st||st.classList.contains('locked')) return; var r=st.dataset.r;
      if(r==='o'){ if(M.o!==x.dataset.v){ M.o=x.dataset.v; M.seen=[]; M.un=null; save(); drawObj(); } sfx('click'); paint(); return; }
      if(r==='rv'){ M.rv=+x.dataset.v; } else if(r==='un'){ M.un=+x.dataset.v; } save(); sfx('click'); paint(); });
    rings.addEventListener('click',function(e){ var r=e.target.closest('.rg'); if(!r) return; var s=cur().spots[+r.dataset.i]; place(s.x,s.y,true); setTimeout(function(){ check(s.x,s.y); },matchMedia('(prefers-reduced-motion: reduce)').matches?0:420); });
    var drag=null;
    function pos(e){ var rc=pic.getBoundingClientRect(); return [Math.max(0,Math.min(100,(e.clientX-rc.left)/rc.width*100)),Math.max(0,Math.min(100,(e.clientY-rc.top)/rc.height*100))]; }
    glass.addEventListener('pointerdown',function(e){ if(!cur()) return; drag=true; try{ glass.setPointerCapture(e.pointerId); }catch(err){} glass.classList.add('held'); e.preventDefault(); });
    glass.addEventListener('pointermove',function(e){ if(!drag) return; var p=pos(e); place(p[0],p[1]); check(p[0],p[1]); });
    glass.addEventListener('pointerup',function(e){ if(!drag) return; drag=null; glass.classList.remove('held'); var p=pos(e); check(p[0],p[1]); });
    glass.addEventListener('keydown',function(e){ var o=cur(); if(!o) return; if(e.key==='Enter'||e.key===' '){ e.preventDefault(); var nx=o.spots.map(function(s,i){ return i; }).filter(function(i){ return M.seen.indexOf(i)<0; })[0]; if(nx==null) nx=0; var s=o.spots[nx]; place(s.x,s.y,true); check(s.x,s.y); } });
    before(partB,b); drawObj(); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · Handprints in clay (4.06.07, manu = hand): four soft clay tiles, a word under each. Tap each word
     to hear it (g4ss-<lesson>-manu-<n>.mp3 when it exists). Then put each meaning on its word: each match presses a
     handprint into that tile. When all four are pressed, the tiles are fired in the kiln and turn warm terracotta. ---- */
  MOD.clayhands=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], ROOT=cfg.root||'manu'; S.clay=S.clay||{heard:[],set:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.clay.set.length===W.length; };
    var hand='<g class="hand"><ellipse cx="50" cy="60" rx="17" ry="19"/><ellipse cx="33" cy="47" rx="5" ry="11" transform="rotate(-38 33 47)"/><ellipse cx="41" cy="33" rx="4.6" ry="12" transform="rotate(-10 41 33)"/><ellipse cx="51" cy="30" rx="4.6" ry="13"/><ellipse cx="60" cy="33" rx="4.4" ry="12" transform="rotate(10 60 33)"/><ellipse cx="68" cy="40" rx="4" ry="10" transform="rotate(22 68 40)"/></g>';
    var g=el('div','spk spk-clay');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Handprints in Clay')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-claywrap"><div class="wds">'+W.map(function(x,i){ return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="14" class="tile"/>'+hand+'</svg><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-clay-ct"></p><div class="spk-chips spk-claymeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-claymeans'), miss=g.querySelector('.spk-miss'), wds=g.querySelector('.wds'), sel=null, AU={}, was=done();
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-'+ROOT+'-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-claymean','<span class="ico">✋</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.clay.heard.length===W.length;
      wds.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.clay.heard.indexOf(i)>=0, u=S.clay.set.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('press'); void c.offsetWidth; c.classList.add('press'); } });
      var d=done(); g.classList.toggle('done',d); if(d&&!was&&anim!=null) setTimeout(function(){ sfx('win'); },500); was=d;
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-claymean').forEach(function(t){ var f=S.clay.set.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-clay-ct').innerHTML=!allH?'<b>'+S.clay.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(d?'':'<b>'+S.clay.set.length+' of '+W.length+'</b> '+esc(cfg.upT||'handprints pressed. Put each meaning on its word.'));
      if(d) window._rootMatchDone=true; }
    function arm(on){ wds.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.clay.set.indexOf(i)>=0||S.clay.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.clay.set.push(i); save(); sel=null; miss.textContent=''; sfx('plop'); paint(i); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wds.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.clay.heard.length===W.length){ attempt(sel,c); return; }
      if(S.clay.heard.indexOf(i)<0){ S.clay.heard.push(i); save(); sfx('click'); } say(i); paint('h'); });
    wds.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-claymean'); if(!t) return; if(S.clay.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-claymean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-claymean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-claymean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wds.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wds.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wds.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };


  /* ---- Scene 1 · Scattered pages (4.06.08): the wing's notebook pages blew across the floor. Each page shows a
     source from an earlier file and its year. Tap the page that comes next in time (or drag it onto the notebook);
     it settles into the next slot. DATA: pages [{id,img,year,t,file,note,miss}] in time order ---- */
  MOD.scatterpages=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var PG=cfg.pages||[]; if(S.sp==null) S.sp=0;
    var done=function(){ return PG.length>0&&S.sp>=PG.length; };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var SPOT=[[4,6,-9],[36,2,6],[68,8,-4],[10,52,7],[42,56,-7],[72,50,5],[24,30,3],[56,30,-6]];
    var g=el('div','spk spk-game spk-scat');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Scattered pages')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-scfloor"></div><p class="spk-miss"></p>'
      +'<div class="spk-scbook" role="list" aria-label="'+esc(cfg.bookT||'The notebook')+'"><div class="spine"></div>'+PG.map(function(p,i){ return '<div class="sl" data-i="'+i+'" role="listitem"><span class="n">'+(i+1)+'</span><div class="in"></div></div>'; }).join('')+'</div>'
      +'<p class="spk-bell-ct spk-sc-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var floor=g.querySelector('.spk-scfloor'), book=g.querySelector('.spk-scbook'), miss=g.querySelector('.spk-miss'), was=done();
    var order=shuffle(PG.map(function(p,i){ return i; }));
    order.forEach(function(i,k){ var p=PG[i], s=SPOT[k%SPOT.length]; var d=el('div','pg'); d.setAttribute('role','button'); d.tabIndex=0; d.draggable=true; d.dataset.i=i;
      d.style.left=s[0]+'%'; d.style.top=s[1]+'%'; d.style.setProperty('--r',s[2]+'deg');
      d.innerHTML='<div class="ph"></div><div class="yr">'+esc(p.year)+'</div><div class="tt">'+esc(p.t)+'</div>';
      var im=new Image(); im.alt=''; im.onload=function(){ d.querySelector('.ph').appendChild(im); }; im.src=IMG+p.img; floor.appendChild(d); });
    function paint(drop){ var k=S.sp;
      floor.querySelectorAll('.pg').forEach(function(d){ var i=+d.dataset.i; d.classList.toggle('spk-hide',i<k); });
      book.querySelectorAll('.sl').forEach(function(sl){ var i=+sl.dataset.i, p=PG[i], on=i<k; sl.classList.toggle('on',on); sl.classList.toggle('next',i===k);
        sl.querySelector('.in').innerHTML=on?'<img class="th" alt="" src="'+esc(IMG+p.img)+'"><b>'+esc(p.year)+'</b> '+esc(p.t)+(p.file?'<small>'+esc(p.file)+'</small>':'')+(p.note&&drop===i?'<em>'+esc(p.note)+'</em>':''):'';
        if(drop===i){ sl.classList.remove('settle'); void sl.offsetWidth; sl.classList.add('settle'); } });
      var d=done(); g.querySelector('.spk-sc-ct').innerHTML=d?'':'<b>'+k+' of '+PG.length+'</b> '+esc(cfg.countT||'pages back in the notebook. Find the next one in time.');
      if(d&&!was) setTimeout(function(){ sfx('paper'); setTimeout(function(){ sfx('win'); },350); },300); was=d;
      g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function attempt(d){ if(!d) return; var i=+d.dataset.i; if(i<S.sp||done()) return;
      if(i===S.sp){ S.sp++; save(); miss.textContent=''; sfx('paper'); paint(i); refreshFile(); refreshVoice(); }
      else { d.classList.add('shake'); setTimeout(function(){ d.classList.remove('shake'); },450); var nx=PG[S.sp], m=(PG[i].miss||cfg.missT||'Not yet. Look at the years: which page comes next?'); miss.textContent=m; missBeat(m); } }
    floor.addEventListener('click',function(e){ var d=e.target.closest('.pg'); if(!d) return; ack('open'); attempt(d); });
    floor.addEventListener('keydown',function(e){ var d=e.target.closest('.pg'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); attempt(d); } });
    var dragEl=null;
    floor.addEventListener('dragstart',function(e){ var d=e.target.closest('.pg'); if(!d){ e.preventDefault(); return; } ack('open'); dragEl=d; e.dataTransfer.setData('text/plain',d.dataset.i); e.dataTransfer.effectAllowed='move'; book.classList.add('armed'); });
    floor.addEventListener('dragend',function(){ book.classList.remove('armed','over'); });
    book.addEventListener('dragover',function(e){ if(dragEl){ e.preventDefault(); book.classList.add('over'); } });
    book.addEventListener('dragleave',function(){ book.classList.remove('over'); });
    book.addEventListener('drop',function(e){ e.preventDefault(); book.classList.remove('armed','over'); attempt(dragEl); dragEl=null; });
    paint();
    return {done:done, journal:function(e,NA){ return S.sp?'<p class="a">'+e(PG.slice(0,S.sp).map(function(p){ return p.year+' · '+p.t; }).join(' → '))+'</p>':NA; }};
  };

  /* ---- Explore reading · Highlighter (4.06.08): a sample notebook entry sits on top. Swipe (or tap) the
     highlighter across each line in order; each finished line opens its part of the reading below.
     DATA: paras [{id,match}], intro (para ids shown from the start), lines [{id,lab,t,c,paras:[]}] ---- */
  MOD.highlighter=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var LN=cfg.lines||[], n=LN.length; if(S.hlt==null) S.hlt=0;
    var done=function(){ return n>0&&S.hlt>=n; };
    var w=el('div','spk spk-hlt');
    w.innerHTML='<div class="spk-hltcard"><div class="hd"><span class="pen" aria-hidden="true"></span><b>'+esc(cfg.cardT||'A notebook entry')+'</b></div>'
      +LN.map(function(l,i){ return '<div class="ln" data-i="'+i+'" role="button" tabindex="0" style="--hc:'+esc(l.c||'#FFE58A')+'" aria-label="'+esc((cfg.lineAria||'Highlight')+' '+l.lab)+'"><span class="mk"></span><span class="lab">'+esc(l.lab)+'</span> <span class="tx">'+esc(l.t)+'</span></div>'; }).join('')
      +'<p class="spk-ys-ct spk-hltct"></p></div><div class="spk-hltread"></div>';
    var intro=(cfg.intro||[]).map(function(id){ return found[id]; }).filter(Boolean);
    if(intro.length) after(intro[intro.length-1],w); else before(first,w);
    var list=w.querySelector('.spk-hltread'), boxes={};
    LN.forEach(function(l,i){ var b=el('div','spk-hltp'); b.style.setProperty('--hc',l.c||'#FFE58A'); b.innerHTML='<div class="tab"><span class="y">'+esc(l.lab)+'</span></div>'; list.appendChild(b); (l.paras||[]).forEach(function(pid){ var p=found[pid]; if(p) move(p,function(nd){ b.appendChild(nd); }); });
      if(i<n-1){ var nx=el('button','spk-hltnext',esc((cfg.nextT||'Highlight the next line: {l}').replace('{l}',LN[i+1].lab))); nx.type='button'; nx.addEventListener('click',function(){ go(i+1,true); }); b.appendChild(nx); }
      boxes[i]=b; });
    function paint(anim){ var k=S.hlt;
      w.querySelectorAll('.ln').forEach(function(d){ var i=+d.dataset.i; d.classList.toggle('lit',i<k); d.classList.toggle('next',i===k); if(i!==k) d.style.removeProperty('--p'); if(anim===i){ d.classList.remove('swish'); void d.offsetWidth; d.classList.add('swish'); } });
      LN.forEach(function(l,i){ boxes[i].classList.toggle('on',i<k); boxes[i].classList.toggle('cur',i===k-1); });
      w.classList.toggle('all',done());
      w.querySelector('.spk-hltct').innerHTML=done()?'<b>'+esc(cfg.allT||'Every line is highlighted.')+'</b>':(k===0?esc(cfg.startT||'Swipe the highlighter across the first line, or tap it.'):'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'lines highlighted. Read this part, then highlight the next line.'));
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i,scroll){ if(i!==S.hlt||done()) return; ack('explore'); S.hlt++; save(); sfx('brush'); paint(i); refreshFile(); refreshVoice();
      var nb=boxes[i]; if(scroll!==false&&nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },250); } }
    var drag=null;
    w.querySelector('.spk-hltcard').addEventListener('pointerdown',function(e){ var d=e.target.closest('.ln'); if(!d) return; var i=+d.dataset.i; if(i!==S.hlt) return; drag={d:d,i:i,x0:e.clientX,moved:false}; try{ d.setPointerCapture(e.pointerId); }catch(err){} });
    w.querySelector('.spk-hltcard').addEventListener('pointermove',function(e){ if(!drag) return; var r=drag.d.getBoundingClientRect(), p=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)); if(Math.abs(e.clientX-drag.x0)>6) drag.moved=true; if(drag.moved) drag.d.style.setProperty('--p',(p*100).toFixed(0)+'%'); });
    window.addEventListener('pointerup',function(e){ if(!drag) return; var dd=drag; drag=null; var r=dd.d.getBoundingClientRect(), p=(e.clientX-r.left)/r.width; if(!dd.moved||p>0.7) go(dd.i,true); else dd.d.style.removeProperty('--p'); });
    w.querySelector('.spk-hltcard').addEventListener('click',function(e){ var d=e.target.closest('.ln'); if(!d) return; var i=+d.dataset.i; if(i<S.hlt){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} } else if(i>S.hlt){ w.querySelector('.spk-hltct').textContent=cfg.orderT||'Highlight the lines in order, starting with the one that glows.'; } });
    w.querySelector('.spk-hltcard').addEventListener('keydown',function(e){ var d=e.target.closest('.ln'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); go(+d.dataset.i,true); } });
    paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Lines highlighted: '+Math.min(S.hlt,n)+' of '+n+'.</p>'; }};
  };

  /* ---- Explore evidence · Fill the notebook entry (4.06.08): after tapping the source labels, build one entry
     from the map: pick the Source line, a Detail you can see, then the Explanation that fits that detail.
     DATA: src [{id,t,ok,miss}], det [{id,t,n,ok,miss}], exp {<detId>:[{id,t,ok,miss}]} ---- */
  MOD.fillentry=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var SR=cfg.src||[], DT=cfg.det||[], EX=cfg.exp||{}; S.fe=S.fe||{s:null,d:null,e:null};
    var built=function(){ return !!(S.fe.s&&S.fe.d&&S.fe.e); };
    var done=function(){ return built()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-fe');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Fill the notebook entry')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-fepage"><div class="row" data-r="s"><span class="lab">'+esc(cfg.sLab||'Source')+'</span><span class="val"></span></div><div class="row" data-r="d"><span class="lab">'+esc(cfg.dLab||'Detail')+'</span><span class="val"></span></div><div class="row" data-r="e"><span class="lab">'+esc(cfg.eLab||'Explanation')+'</span><span class="val"></span></div></div>'
      +'<div class="spk-step festep" data-r="s"><div class="lab">1 · '+esc(cfg.q1||'Which line names the source?')+'</div><div class="spk-opts">'+SR.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step festep locked" data-r="d"><div class="lab">2 · '+esc(cfg.q2||'Pick a detail you can really see on the map')+'</div><div class="spk-opts">'+DT.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+(o.n?'<span class="num">'+esc(o.n)+'</span> ':'')+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step festep locked" data-r="e"><div class="lab">3 · '+esc(cfg.q3||'Pick the explanation that fits your detail')+'</div><div class="spk-opts feexp"></div></div>'
      +'<p class="spk-miss"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    var miss=g.querySelector('.spk-miss'), was=done();
    function opt(list,id){ return find(list,id); }
    function paint(flash){ var F=S.fe, s=opt(SR,F.s), d=opt(DT,F.d), ex=d?(EX[d.id]||[]):[], e=opt(ex,F.e);
      g.querySelector('.row[data-r="s"] .val').textContent=s?s.t:'…'; g.querySelector('.row[data-r="d"] .val').textContent=d?d.t:'…'; g.querySelector('.row[data-r="e"] .val').textContent=e?e.t:'…';
      ['s','d','e'].forEach(function(r){ var row=g.querySelector('.row[data-r="'+r+'"]'); row.classList.toggle('on',!!F[r]); if(flash===r){ row.classList.remove('ink'); void row.offsetWidth; row.classList.add('ink'); } });
      g.querySelector('.festep[data-r="d"]').classList.toggle('locked',!F.s);
      g.querySelector('.festep[data-r="e"]').classList.toggle('locked',!F.d);
      g.querySelector('.feexp').innerHTML=ex.map(function(o){ return '<button type="button" class="spk-opt'+(F.e===o.id?' on':'')+'" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('');
      g.querySelectorAll('.festep[data-r="s"] .spk-opt').forEach(function(b){ b.classList.toggle('on',b.dataset.v===F.s); });
      g.querySelectorAll('.festep[data-r="d"] .spk-opt').forEach(function(b){ b.classList.toggle('on',b.dataset.v===F.d); });
      var gate=''; if(built()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the map above.'; else if(built()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: highlight every line in Learn the Story above.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var dn=done(); if(dn&&!was) setTimeout(function(){ sfx('win'); },300); was=dn; g.querySelector('.spk-win').classList.toggle('show',dn); g.classList.toggle('done',dn); }
    g.addEventListener('click',function(e){ var b=e.target.closest('.spk-opt'); if(!b) return; var st=b.closest('.festep'); if(!st||st.classList.contains('locked')) return; ack('explore'); var r=st.dataset.r, list=r==='s'?SR:(r==='d'?DT:(EX[S.fe.d]||[])), o=find(list,b.dataset.v); if(!o) return;
      if(o.ok===false){ b.classList.add('shake'); setTimeout(function(){ b.classList.remove('shake'); },450); miss.textContent=o.miss||''; missBeat(o.miss||''); return; }
      miss.textContent=''; S.fe[r]=o.id; if(r==='d') S.fe.e=null; save(); sfx('click'); paint(r); refreshFile(); refreshVoice(); });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var F=S.fe, s=find(SR,F.s), d=find(DT,F.d), x=d&&find(EX[d.id]||[],F.e); return (s||d||x)?'<p class="a"><b>Source:</b> '+e(s?s.t:'')+'<br><b>Detail:</b> '+e(d?d.t:'')+'<br><b>Explanation:</b> '+e(x?x.t:'')+'</p>':NA; }};
  };

  /* ---- Planner · Bookmark ribbons (4.06.08): slip three ribbons into the notebook at events in time order,
     open one bookmarked page to plan its Source / Detail / Explanation, then pick a because. Notes only.
     DATA: events [{id,year,t,y (sort key),plan:{src:[],det:[],exp:[]}}], becauses [{id,t}], pick (3) ---- */
  MOD.ribbons=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var EV=cfg.events||[], BC=cfg.becauses||[], NP=cfg.pick||3; S.rb=S.rb||{ev:[],open:null,src:null,det:null,exp:null,bc:null};
    var RB=S.rb, COL=['#B3261E','#1A8A7D','#C9A24A'];
    var planned=function(){ return RB.open!=null&&RB.src!=null&&RB.det!=null&&RB.exp!=null; };
    var done=function(){ return RB.ev.length===NP&&planned()&&!!RB.bc; };
    var b=el('div','spk spk-builder spk-rib');
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-ribbook"><div class="pages"></div><div class="rbs"></div></div>'
      +'<div class="spk-step" data-r="ev"><div class="lab">🎀 1 · '+esc(cfg.q1||'Slip a ribbon in at three events, in time order')+'</div><div class="spk-opts">'+EV.map(function(v){ return '<button type="button" class="spk-opt" data-v="'+esc(v.id)+'"><b>'+esc(v.year)+'</b> '+esc(v.t)+'</button>'; }).join('')+'</div><p class="spk-miss"></p></div>'
      +'<div class="spk-step ribopen locked" data-r="open"><div class="lab">📖 2 · '+esc(cfg.q2||'Open one bookmarked page and plan its three lines')+'</div><div class="spk-opts rbpick"></div><div class="rbplan"></div></div>'
      +'<div class="spk-step ribbc locked" data-r="bc"><div class="lab">🔗 3 · '+esc(cfg.q3||'Pick a because that connects two events')+'</div><div class="spk-opts">'+BC.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<p class="spk-chain-done">'+esc(cfg.doneT||'Your bookmarks are in. Now write in Step 3.')+'</p><div class="spk-plan"></div>';
    var ev=function(id){ return find(EV,id); };
    function lines(){ var L=[]; RB.ev.forEach(function(id,i){ var v=ev(id); if(v) L.push([(cfg.evLab||'Event')+' '+(i+1),v.year+': '+v.t]); });
      var o=RB.open&&ev(RB.open); if(o){ var P=o.plan||{}; if(RB.src!=null) L.push(['Source',(P.src||[])[RB.src]]); if(RB.det!=null) L.push(['Detail',(P.det||[])[RB.det]]); if(RB.exp!=null) L.push(['Explanation',(P.exp||[])[RB.exp]]); }
      var c=find(BC,RB.bc); if(c) L.push([cfg.bcLab||'Because',c.t]); return L; }
    function paint(drop){
      b.querySelector('.rbs').innerHTML=RB.ev.map(function(id,i){ var v=ev(id); return '<div class="rb'+(drop===id?' slip':'')+(RB.open===id?' open':'')+'" style="--c:'+COL[i%3]+'"><span>'+esc(v.year)+'</span></div>'; }).join('');
      b.querySelector('.pages').classList.toggle('open',!!RB.open);
      b.querySelectorAll('.spk-step[data-r="ev"] .spk-opt').forEach(function(o){ var on=RB.ev.indexOf(o.dataset.v)>=0; o.classList.toggle('on',on); o.disabled=!on&&RB.ev.length>=NP; });
      b.querySelector('.ribopen').classList.toggle('locked',RB.ev.length<NP);
      b.querySelector('.rbpick').innerHTML=RB.ev.map(function(id){ var v=ev(id); return '<button type="button" class="spk-opt'+(RB.open===id?' on':'')+'" data-o="'+esc(id)+'">📖 '+esc(v.year)+'</button>'; }).join('');
      var o=RB.open&&ev(RB.open), P=o?(o.plan||{}):null;
      b.querySelector('.rbplan').innerHTML=P?[['src','Source'],['det','Detail'],['exp','Explanation']].map(function(k){ return '<div class="pl"><div class="t">'+k[1]+'</div><div class="spk-opts">'+(P[k[0]]||[]).map(function(t,j){ return '<button type="button" class="spk-opt'+(RB[k[0]]===j?' on':'')+'" data-k="'+k[0]+'" data-j="'+j+'">'+esc(t)+'</button>'; }).join('')+'</div></div>'; }).join(''):'';
      b.querySelector('.ribbc').classList.toggle('locked',!planned());
      b.querySelectorAll('.ribbc .spk-opt').forEach(function(x){ x.classList.toggle('on',x.dataset.v===RB.bc); });
      b.classList.toggle('done',done());
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var x=e.target.closest('.spk-opt'); if(!x||x.disabled) return; var st=x.closest('.spk-step'); if(!st||st.classList.contains('locked')) return; var r=st.dataset.r, miss=b.querySelector('.spk-miss');
      if(r==='ev'){ var id=x.dataset.v, k=RB.ev.indexOf(id);
        if(k>=0){ RB.ev.splice(k); if(RB.open&&RB.ev.indexOf(RB.open)<0){ RB.open=null; RB.src=RB.det=RB.exp=null; } miss.textContent=''; save(); sfx('click'); paint(); return; }
        var last=RB.ev.length?ev(RB.ev[RB.ev.length-1]):null, v=ev(id);
        if(last&&v.y<last.y){ x.classList.add('shake'); setTimeout(function(){ x.classList.remove('shake'); },450); miss.textContent=(cfg.orderT||'{a} happened before {b}. Put the ribbons in time order: tap the earliest event first.').replace('{a}',v.year).replace('{b}',last.year); return; }
        RB.ev.push(id); miss.textContent=''; save(); sfx('slide'); paint(id); return; }
      if(r==='open'){ if(x.dataset.o){ if(RB.open!==x.dataset.o){ RB.open=x.dataset.o; RB.src=RB.det=RB.exp=null; } save(); sfx('paper'); paint(); return; }
        if(x.dataset.k){ RB[x.dataset.k]=+x.dataset.j; save(); sfx('click'); paint(); } return; }
      if(r==='bc'){ RB.bc=x.dataset.v; save(); sfx('click'); paint(); } });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };

  /* ---- Vocabulary · The focus glass (4.06.08, vid/vis = see): four words lie blurred on an old page. Slide the
     magnifying glass over each word (or tap it) to bring it into focus and hear it
     (g4ss-<lesson>-<root>-<n>.mp3). Then put each meaning on its word. ---- */
  MOD.focusglass=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], ROOT=cfg.root||'vid'; S.fg=S.fg||{seen:[],set:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.fg.set.length===W.length; };
    var POS=[[27,26],[73,22],[27,68],[73,64]];
    var g=el('div','spk spk-fg');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'The Focus Glass')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-fgpage">'+W.map(function(x,i){ var p=POS[i%POS.length]; return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'" style="left:'+p[0]+'%;top:'+p[1]+'%"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')
      +'<div class="glass" aria-hidden="true"><span class="rim"></span><span class="hdl"></span></div></div>'
      +'<p class="spk-bell-ct spk-fg-ct"></p><div class="spk-chips spk-fgmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var page=g.querySelector('.spk-fgpage'), glass=g.querySelector('.glass'), means=g.querySelector('.spk-fgmeans'), miss=g.querySelector('.spk-miss'), sel=null, AU={}, dwell=null;
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-'+ROOT+'-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-fgmean','<span class="ico">🔎</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function focus(i){ if(S.fg.seen.indexOf(i)<0){ S.fg.seen.push(i); save(); sfx('click'); } say(i); paint(i); }
    function paint(anim){ var allS=S.fg.seen.length===W.length;
      page.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, s=S.fg.seen.indexOf(i)>=0, u=S.fg.set.indexOf(i)>=0; c.classList.toggle('seen',s); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } });
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allS); means.querySelectorAll('.spk-fgmean').forEach(function(t){ var f=S.fg.set.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allS&&!f; });
      g.querySelector('.spk-fg-ct').innerHTML=!allS?'<b>'+S.fg.seen.length+' of '+W.length+'</b> '+esc(cfg.seeT||'words in focus. Slide the glass over each blurry word, or tap it.'):(done()?'':'<b>'+S.fg.set.length+' of '+W.length+'</b> '+esc(cfg.upT||'meanings placed. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    /* the glass follows the pointer inside the page; resting on a word for a moment brings it into focus */
    function moveGlass(x,y){ var r=page.getBoundingClientRect(); glass.style.left=(x-r.left)+'px'; glass.style.top=(y-r.top)+'px'; page.classList.add('glassing');
      var hit=null; page.querySelectorAll('.wd').forEach(function(c){ var q=c.getBoundingClientRect(); if(x>=q.left-6&&x<=q.right+6&&y>=q.top-6&&y<=q.bottom+6) hit=c; });
      page.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('under',c===hit); });
      if(hit){ var i=+hit.dataset.i; if(!dwell||dwell.i!==i){ clearTimeout(dwell&&dwell.t); dwell={i:i,t:setTimeout(function(){ if(S.fg.seen.indexOf(i)<0) focus(i); },350)}; } } else { clearTimeout(dwell&&dwell.t); dwell=null; } }
    var gdrag=false;
    page.addEventListener('pointerdown',function(e){ if(e.target.closest('.wd')&&S.fg.seen.length===W.length) return; gdrag=true; ack('scene'); moveGlass(e.clientX,e.clientY); if(e.pointerType!=='mouse') e.preventDefault(); });
    page.addEventListener('pointermove',function(e){ if(e.pointerType==='mouse'&&!gdrag) moveGlass(e.clientX,e.clientY); });
    window.addEventListener('pointermove',function(e){ if(gdrag) moveGlass(e.clientX,e.clientY); });
    window.addEventListener('pointerup',function(){ gdrag=false; });
    page.addEventListener('pointerleave',function(){ if(!gdrag) page.classList.remove('glassing'); });
    function arm(on){ page.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.fg.set.indexOf(i)>=0||S.fg.seen.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.fg.set.push(i); save(); sel=null; miss.textContent=''; sfx('click'); paint(i); if(done()) setTimeout(function(){ sfx('win'); },400); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    page.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.fg.seen.length===W.length){ attempt(sel,c); return; } focus(i); });
    page.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-fgmean'); if(!t) return; if(S.fg.seen.length<W.length){ miss.textContent=cfg.seeFirstT||'Bring every word into focus first.'; return; } means.querySelectorAll('.spk-fgmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-fgmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-fgmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    page.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); page.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    page.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };


  /* ---- Scene 1 · Two pockets (4.07.01): a manila file folder with two pockets. Sort each fact card into the
     pocket it belongs to (tap a card, then a pocket, or drag). Built for "two things true at once": what Spain
     wanted, and what freedom meant for the people who lived there. Sorts facts, never people.
     DATA: pockets [{id,ico,t,sub}], cards [{id,pocket,ico,t,miss}] ---- */
  MOD.pockets=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var PK=cfg.pockets||[], CD=cfg.cards||[]; S.pk=S.pk||[];
    var done=function(){ return CD.length>0&&CD.every(function(c){ return S.pk.indexOf(c.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-pk');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Two pockets')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-chips spk-pktray"></div><p class="spk-miss"></p>'
      +'<div class="spk-pkfolder"><div class="tabl">'+esc(cfg.label||'')+'</div><div class="pks">'+PK.map(function(p){ return '<div class="pkt" data-p="'+esc(p.id)+'" role="button" tabindex="0" aria-label="'+esc(p.t)+'"><div class="lip"><span class="ico" aria-hidden="true">'+(p.ico||'')+'</span><span><b>'+esc(p.t)+'</b>'+(p.sub?'<small>'+esc(p.sub)+'</small>':'')+'</span><span class="ct"></span></div><div class="in"></div></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-pk-ct"></p><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var tray=g.querySelector('.spk-pktray'), miss=g.querySelector('.spk-miss'), sel=null;
    shuffle(CD).forEach(function(x){ var c=el('div','spk-chip noimg spk-pkcard','<span class="ico">'+(x.ico||'📄')+'</span><span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=x.id; tray.appendChild(c); });
    function paint(drop){
      CD.forEach(function(c){ var x=tray.querySelector('[data-i="'+c.id+'"]'), on=S.pk.indexOf(c.id)>=0; if(x){ x.classList.toggle('spk-hide',on); x.draggable=!on; } });
      PK.forEach(function(p){ var mine=CD.filter(function(c){ return c.pocket===p.id; }), L=mine.filter(function(c){ return S.pk.indexOf(c.id)>=0; }), b=g.querySelector('.pkt[data-p="'+p.id+'"]');
        b.querySelector('.in').innerHTML=L.map(function(c){ return '<div class="it'+(drop===c.id?' new':'')+'">'+(c.ico?'<span aria-hidden="true">'+c.ico+'</span> ':'')+esc(c.t)+'</div>'; }).join('');
        b.querySelector('.ct').textContent=L.length+' / '+mine.length; b.classList.toggle('full',L.length===mine.length&&mine.length>0);
        if(drop&&find(CD,drop)&&find(CD,drop).pocket===p.id){ b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } });
      g.querySelector('.spk-pk-ct').innerHTML=done()?'':'<b>'+S.pk.length+' of '+CD.length+'</b> '+esc(cfg.countT||'facts filed.');
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function arm(on){ g.querySelectorAll('.pkt').forEach(function(z){ z.classList.toggle('armed',on); z.classList.remove('over'); }); }
    function attempt(chip,pid){ if(!chip||!pid) return; var c=find(CD,chip.dataset.i); if(!c||S.pk.indexOf(c.id)>=0) return; arm(false);
      if(c.pocket===pid){ S.pk.push(c.id); save(); sel=null; miss.textContent=''; sfx('click'); paint(c.id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); var m=c.miss||''; miss.textContent=m; missBeat(m); } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-pkcard'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-pkcard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-pkcard'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-pkcard'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); });
    var pks=g.querySelector('.pks');
    function target(e){ var z=e.target.closest('.pkt'); return z?z.dataset.p:null; }
    pks.addEventListener('click',function(e){ var p=target(e); if(!p) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a fact card first, then tap the pocket it belongs in.'; return; } attempt(sel,p); });
    pks.addEventListener('keydown',function(e){ var z=e.target.closest('.pkt'); if(z&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); z.click(); } });
    pks.addEventListener('dragover',function(e){ var p=target(e); pks.querySelectorAll('.pkt').forEach(function(x){ x.classList.toggle('over',x.dataset.p===p); }); if(p){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    pks.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,target(e)); });
    paint();
    return {done:done, journal:function(e,NA){ var L=PK.map(function(p){ var it=CD.filter(function(c){ return c.pocket===p.id&&S.pk.indexOf(c.id)>=0; }); return it.length?'<p class="a"><b>'+e(p.t)+':</b> '+e(it.map(function(c){ return c.t; }).join(' · '))+'</p>':''; }).join(''); return L||NA; }};
  };

  /* ---- Explore reading · Raise the walls (4.07.01): a quiet marsh at dawn. Each tap adds the next piece of the
     story to the picture (the road south, Spain's flag, footprints, the fort and its homes, the lookout and gate,
     sunrise over the fields) and opens that part of the reading below. No people are drawn.
     DATA: paras [{id,match}], pieces [{id,t,paras:[]}] (six, in this order) ---- */
  MOD.raisewalls=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var PC=cfg.pieces||[], n=PC.length; if(S.rw==null) S.rw=0;
    var done=function(){ return n>0&&S.rw>=n; };
    var steps=[[40,101],[62,107],[86,114],[110,119],[134,123],[158,126],[182,127]];
    var art=[
      '<path d="M4,97 C40,99 58,104 84,114 S140,126 196,128" class="trail"/>',
      '<g class="flag"><line x1="356" y1="56" x2="356" y2="120" class="pole"/><g class="cloth"><rect x="356" y="57" width="28" height="19" class="fw"/><path d="M359,60 L381,73 M381,60 L359,73" class="fx"/></g></g>',
      steps.map(function(s,i){ return '<g class="fp" style="--d:'+(i*0.18)+'s"><ellipse cx="'+s[0]+'" cy="'+(s[1]-1.6)+'" rx="2.4" ry="1.3"/><ellipse cx="'+(s[0]+4)+'" cy="'+(s[1]+1.4)+'" rx="2.4" ry="1.3"/></g>'; }).join(''),
      '<g class="fort"><path d="M206,104 L336,104 L342,132 L200,132 Z" class="yard"/><path d="M200,132 L342,132 L338,124 L204,124 Z" class="wallf"/><path d="M206,104 L336,104 L333,99 L209,99 Z" class="wallb"/><path d="M200,132 L206,104 L210,104 L205,132 Z" class="walls"/><path d="M342,132 L336,104 L332,104 L337,132 Z" class="walls"/>'
        +[[226,114],[252,111],[312,113]].map(function(h){ return '<g class="hut"><rect x="'+(h[0]-8)+'" y="'+h[1]+'" width="16" height="9" class="hw"/><path d="M'+(h[0]-11)+','+(h[1]+1)+' L'+h[0]+','+(h[1]-9)+' L'+(h[0]+11)+','+(h[1]+1)+' Z" class="hr"/></g>'; }).join('')
        +'<g class="church"><rect x="275" y="104" width="18" height="16" class="hw"/><path d="M272,105 L284,94 L296,105 Z" class="hr"/><path d="M284,94 V84 M280,88 H288" class="cross"/></g></g>',
      '<g class="guard"><path d="M198,124 V96 M212,124 V96" class="post"/><rect x="195" y="92" width="20" height="5" class="deck"/><path d="M193,92 L205,84 L217,92 Z" class="hr"/><rect x="262" y="124" width="16" height="8" class="gate"/><path d="M270,124 V132" class="gl"/></g>',
      '<g class="dawn"><path d="M206,140 H338 M210,146 H334 M214,152 H330" class="row"/><path d="M226,104 q-4,-8 0,-14 q4,-6 0,-12 M312,104 q-4,-8 0,-14 q4,-6 0,-12" class="smoke"/></g>'
    ];
    var w=el('div','spk spk-rw');
    w.innerHTML=whyCard(cfg.why)+'<div class="spk-rwbar"><svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg.alt||'A quiet salt marsh north of St. Augustine where the pieces of Fort Mose appear one at a time')+'">'
      +'<defs><linearGradient id="spkRwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B4C7A"/><stop offset="1" stop-color="#9AA9C6"/></linearGradient><linearGradient id="spkRwDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C98A"/><stop offset="1" stop-color="#FCE9C6"/></linearGradient></defs>'
      +'<rect width="400" height="110" fill="url(#spkRwSky)"/><rect width="400" height="110" fill="url(#spkRwDawn)" class="warm"/>'
      +'<g class="sun"><circle cx="300" cy="96" r="16"/></g>'
      +'<path d="M0,100 Q20,86 40,96 Q58,84 78,95 Q100,86 118,96 Q140,88 160,97 Q180,90 196,98 L196,104 L0,104 Z" class="trees"/>'
      +'<rect y="98" width="400" height="72" class="marsh"/><path d="M400,118 C360,122 352,140 318,146 S250,154 236,170 L262,170 C276,160 320,156 352,148 S384,128 400,126 Z" class="creek"/>'
      +'<path d="M10,150 l3,-8 M30,160 l2,-7 M60,146 l3,-8 M90,158 l2,-7 M130,150 l3,-8 M160,160 l2,-7 M372,156 l2,-7 M352,164 l3,-8" class="grass"/>'
      +art.map(function(a,i){ return '<g class="pc" data-i="'+i+'">'+(a||'')+'</g>'; }).join('')
      +'</svg><div class="spk-rwrow"><p class="spk-ys-ct spk-rwct"></p><button type="button" class="spk-rwgo"></button></div></div><div class="spk-rwread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-rwread'), boxes={}, svg=w.querySelector('svg'), go=w.querySelector('.spk-rwgo');
    PC.forEach(function(p,i){ var b=el('div','spk-rwp'); b.innerHTML='<div class="tab"><span class="y">'+(i+1)+'</span><b>'+esc(p.t)+'</b></div>'; list.appendChild(b); (p.paras||[]).forEach(function(pid){ var q=found[pid]; if(q) move(q,function(nd){ b.appendChild(nd); }); }); boxes[i]=b; });
    function paint(anim){ var k=S.rw;
      svg.querySelectorAll('.pc').forEach(function(g2){ var i=+g2.dataset.i; g2.classList.toggle('on',i<k); g2.classList.toggle('next',i===k); if(anim&&i===k-1){ g2.classList.remove('rise'); void g2.getBoundingClientRect(); g2.classList.add('rise'); } });
      PC.forEach(function(p,i){ boxes[i].classList.toggle('on',i<k); boxes[i].classList.toggle('cur',i===k-1); });
      w.classList.toggle('all',done()); svg.classList.toggle('dawned',done());
      w.querySelector('.spk-rwct').innerHTML=done()?'<b>'+esc(cfg.allT||'Fort Mose stands. You read the whole story.')+'</b>':(k===0?esc(cfg.startT||'Tap the button to add the first piece.'):'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'pieces added. Read this part, then add the next one.'));
      go.classList.toggle('spk-hide',done()); if(!done()) go.textContent=(cfg.nextT||'Add piece {n}: {t}').replace('{n}',k+1).replace('{t}',PC[k].t);
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function build(i){ if(i!==S.rw||done()) return; ack('explore'); S.rw++; save(); sfx('click'); paint(true); refreshFile(); refreshVoice();
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },250); } }
    go.addEventListener('click',function(){ build(S.rw); });
    svg.addEventListener('click',function(e){ var m=e.target.closest('.pc'); if(!m) return; var i=+m.dataset.i; if(i===S.rw) build(i); else if(i<S.rw){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} } });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Pieces added: '+Math.min(S.rw,n)+' of '+n+'.</p>'; }};
  };

  /* ---- Explore evidence · Turn the map, then measure (4.07.01): the old map's north points to the right. Turn it
     until north is up, say which way Fort Mose is from the town, then lay the map's own scale bar from the town
     gate to Fort Mose and pick the distance. Needs the source labels and the reading too.
     DATA: img, iw, ih (image pixels), northDeg (where north points before turning: 90 = right), from {x,y,t}, to {x,y,t}
     (pixels), bar {px, miles, t}, dirOpts/distOpts [{id,t,ok,miss}] ---- */
  MOD.turnmap=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var IW=cfg.iw||1000, IH=cfg.ih||800, N0=cfg.northDeg==null?90:cfg.northDeg, F=cfg.from||{}, T2=cfg.to||{}, BAR=cfg.bar||{px:100,miles:1};
    S.tm=S.tm||{rot:0,dir:null,laid:false,dist:null};
    var norm=function(r){ return ((r%360)+360)%360; };
    var turned=function(){ return norm(N0+S.tm.rot)===0; };
    var dirOk=function(){ var o=find(cfg.dirOpts,S.tm.dir); return !!(o&&o.ok); }, distOk=function(){ var o=find(cfg.distOpts,S.tm.dist); return !!(o&&o.ok); };
    var mine=function(){ return turned()&&dirOk()&&S.tm.laid&&distOk(); };
    var done=function(){ return mine()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var dx=T2.x-F.x, dy=T2.y-F.y, len=Math.sqrt(dx*dx+dy*dy), nb=len/BAR.px, ang=Math.atan2(dy,dx)*180/Math.PI;
    var segs=''; for(var i=0;i<Math.ceil(nb);i++){ var a=i*BAR.px, b=Math.min(len,(i+1)*BAR.px); segs+='<rect class="sg" style="--d:'+(i*0.45)+'s" x="'+a.toFixed(1)+'" y="-9" width="'+(b-a).toFixed(1)+'" height="18"/>'; }
    var g=el('div','spk spk-game spk-tm');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Turn the map')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-tmstage"><span class="cd n">N</span><span class="cd s">S</span><span class="cd e">E</span><span class="cd w">W</span><div class="spk-tmrot" style="aspect-ratio:'+IW+'/'+IH+'"><img alt="'+esc(cfg.alt||'')+'">'
      +'<svg viewBox="0 0 '+IW+' '+IH+'" preserveAspectRatio="none" aria-hidden="true"><g class="nar" transform="translate('+(IW*0.5)+','+(IH*0.5)+') rotate('+(N0-90)+')"><circle r="16" cx="-90" class="nc"/><path d="M-90,0 H60" class="nl"/><path d="M50,-34 L120,0 L50,34 Z" class="nh"/></g>'
      +'<g class="meas" transform="translate('+F.x+','+F.y+') rotate('+ang.toFixed(2)+')"><line x1="0" y1="0" x2="'+len.toFixed(1)+'" y2="0" class="ml"/>'+segs+'</g>'
      +'<circle cx="'+F.x+'" cy="'+F.y+'" r="22" class="pin pf"/><circle cx="'+T2.x+'" cy="'+T2.y+'" r="22" class="pin pt"/></svg>'
      +'</div></div>'
      +'<div class="spk-tmbtns"><button type="button" class="spk-opt" data-t="-90">↺ '+esc(cfg.leftT||'Turn left')+'</button><button type="button" class="spk-opt" data-t="90">↻ '+esc(cfg.rightT||'Turn right')+'</button></div>'
      +'<p class="spk-tmsay"></p>'
      +'<div class="spk-tmkey"><span><i class="kf"></i>'+esc(F.t||'Start')+'</span><span><i class="kt"></i>'+esc(T2.t||'End')+'</span></div>'
      +'<div class="spk-step" data-r="dir"><div class="lab">🧭 '+esc(cfg.dirQ||'Which way is it?')+'</div><div class="spk-opts">'+(cfg.dirOpts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<div class="spk-step" data-r="lay"><div class="lab">📏 '+esc(cfg.layQ||'Measure it')+'</div><button type="button" class="spk-opt spk-tmlay">'+esc(cfg.layT||'Lay the scale bar')+'</button><p class="spk-tmbars"></p></div>'
      +'<div class="spk-step" data-r="dist"><div class="lab">📐 '+esc(cfg.distQ||'How far?')+'</div><div class="spk-opts">'+(cfg.distOpts||[]).map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'
      +'<p class="spk-miss"></p><p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    g.querySelector('.spk-tmrot img').src=IMG+cfg.img;
    var rot=g.querySelector('.spk-tmrot'), miss=g.querySelector('.spk-miss');
    function paint(){ var t=turned(), side=norm(S.tm.rot)%180!==0;
      rot.style.transform='translate(-50%,-50%) rotate('+S.tm.rot+'deg)'; rot.style.width=side?(IH/IW*100).toFixed(1)+'%':'100%'; g.querySelector('.spk-tmstage').classList.toggle('side',side);
      g.classList.toggle('turned',t);
      g.querySelectorAll('.spk-tmbtns .spk-opt').forEach(function(b){ b.disabled=t; });
      g.querySelector('.spk-tmsay').innerHTML=t?'<b>'+esc(cfg.upT||'North is up now.')+'</b>':esc(cfg.turnT||'Turn the map until the N arrow points to the top.');
      var sd=g.querySelector('[data-r="dir"]'), sl=g.querySelector('[data-r="lay"]'), sx=g.querySelector('[data-r="dist"]');
      sd.classList.toggle('locked',!t); sl.classList.toggle('locked',!(t&&dirOk())); sx.classList.toggle('locked',!(t&&dirOk()&&S.tm.laid));
      sd.querySelectorAll('.spk-opt').forEach(function(b){ b.classList.toggle('on',b.dataset.v===S.tm.dir&&dirOk()); });
      sx.querySelectorAll('.spk-opt').forEach(function(b){ b.classList.toggle('on',b.dataset.v===S.tm.dist&&distOk()); });
      g.classList.toggle('laid',!!S.tm.laid);
      g.querySelector('.spk-tmbars').innerHTML=S.tm.laid?esc((cfg.barsT||'').replace('{n}',nb.toFixed(1)).replace('{m}',(nb*BAR.miles).toFixed(1))):'';
      var gate=''; if(mine()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the map above.'; else if(mine()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Learn the Story at the top of this tab.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var d=done(); g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    g.querySelector('.spk-tmbtns').addEventListener('click',function(e){ var b=e.target.closest('.spk-opt'); if(!b||turned()) return; ack('explore'); S.tm.rot+=+b.dataset.t; save(); sfx('click'); paint(); refreshFile(); refreshVoice(); });
    rot.addEventListener('click',function(){ if(turned()) return; ack('explore'); S.tm.rot-=90; save(); sfx('click'); paint(); refreshFile(); });
    g.addEventListener('click',function(e){ var o=e.target.closest('.spk-step .spk-opt'); if(!o) return; var st=o.closest('.spk-step'); if(st.classList.contains('locked')) return; var r=st.dataset.r;
      if(r==='lay'){ if(!S.tm.laid){ S.tm.laid=true; save(); sfx('click'); paint(); } return; }
      var list=r==='dir'?cfg.dirOpts:cfg.distOpts, opt=find(list,o.dataset.v); if(!opt) return;
      if(opt.ok){ S.tm[r]=opt.id; save(); miss.textContent=''; sfx('click'); paint(); refreshFile(); refreshVoice(); }
      else { o.classList.add('shake'); setTimeout(function(){ o.classList.remove('shake'); },450); miss.textContent=opt.miss||''; missBeat(opt.miss||''); } });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var d=find(cfg.dirOpts,S.tm.dir), x=find(cfg.distOpts,S.tm.dist); return (d||x)?'<p class="a">'+(d?'<b>'+e(cfg.dirQ||'')+'</b> '+e(d.t)+'<br>':'')+(x?'<b>'+e(cfg.distQ||'')+'</b> '+e(x.t):'')+'</p>':NA; }};
  };

  /* ---- Vocabulary · Open the gate (4.07.01, liber = free): a wooden gate barred shut across a path to the marsh.
     Tap each word to hear it (g4ss-<lesson>-<root>-<n>.mp3 when it exists). Then put each meaning on its word; each
     match lifts one bar off the gate. When every bar is off, the gate swings open onto the marsh at sunrise. ---- */
  MOD.opengate=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], ROOT=cfg.root||'liber'; S.og=S.og||{heard:[],set:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.og.set.length===W.length; };
    var by=[44,64,84,104];
    var g=el('div','spk spk-gt');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Open the gate')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-gtwrap"><svg class="gtv" viewBox="0 0 340 140" aria-hidden="true"><defs><linearGradient id="spkGtSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C98A"/><stop offset="1" stop-color="#FCEBCB"/></linearGradient></defs>'
      +'<rect width="340" height="140" class="bg"/><g class="view"><rect x="110" y="20" width="120" height="104" fill="url(#spkGtSky)"/><circle cx="170" cy="98" r="15" class="sun"/><rect x="110" y="96" width="120" height="28" class="marsh"/><path d="M110,110 C140,104 190,118 230,108 L230,124 L110,124 Z" class="creek"/></g>'
      +'<rect x="98" y="14" width="12" height="114" class="post"/><rect x="230" y="14" width="12" height="114" class="post"/><rect x="92" y="10" width="156" height="8" class="lintel"/>'
      +'<g class="door l"><rect x="110" y="20" width="60" height="104" class="dw"/><path d="M125,20 V124 M140,20 V124 M155,20 V124" class="dl"/></g>'
      +'<g class="door r"><rect x="170" y="20" width="60" height="104" class="dw"/><path d="M185,20 V124 M200,20 V124 M215,20 V124" class="dl"/></g>'
      +W.map(function(x,i){ return '<g class="bar" data-i="'+i+'"><rect x="92" y="'+by[i%4]+'" width="156" height="9" rx="2" class="bb"/><rect x="100" y="'+(by[i%4]-2)+'" width="7" height="13" class="br"/><rect x="233" y="'+(by[i%4]-2)+'" width="7" height="13" class="br"/></g>'; }).join('')
      +'<rect y="128" width="340" height="12" class="ground"/></svg>'
      +'<div class="wds">'+W.map(function(x,i){ return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-gt-ct"></p><div class="spk-chips spk-gtmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-gtmeans'), miss=g.querySelector('.spk-miss'), wds=g.querySelector('.wds'), svg=g.querySelector('.gtv'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-'+ROOT+'-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-gtmean','<span class="ico">🔑</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.og.heard.length===W.length;
      wds.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.og.heard.indexOf(i)>=0, u=S.og.set.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      var k=S.og.set.length; svg.querySelectorAll('.bar').forEach(function(b){ b.classList.toggle('off',+b.dataset.i<k); });
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-gtmean').forEach(function(t){ var f=S.og.set.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-gt-ct').innerHTML=!allH?'<b>'+S.og.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(done()?'':'<b>'+S.og.set.length+' of '+W.length+'</b> '+esc(cfg.upT||'bars lifted. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ wds.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.og.set.indexOf(i)>=0||S.og.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.og.set.push(i); save(); sel=null; miss.textContent=''; sfx('click'); paint(i); if(done()) setTimeout(function(){ sfx('door'); },500); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wds.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.og.heard.length===W.length){ attempt(sel,c); return; }
      if(S.og.heard.indexOf(i)<0){ S.og.heard.push(i); save(); sfx('click'); } say(i); paint('h'); });
    wds.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-gtmean'); if(!t) return; if(S.og.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-gtmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-gtmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-gtmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wds.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wds.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wds.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };

  /* ---- Planner · Fact card + meaning card (4.07.01): two index cards. The fact card has rows with one right answer
     each (when, where, who); the meaning card has rows where any choice works (an idea, the proof, a name/date/group).
     When both are filled, a pin joins the two cards. Notes only — the student writes.
     DATA: cardA {t, rows:[{id,lab,opts:[{t,ok,miss}]}]}, cardB {t, rows:[{id,lab,opts:[{t}]}]} ---- */
  MOD.factcard=function(cfg){ var partB=document.querySelector('#panel-assignment .activity.bl-gold'); if(!partB) return null;
    var A=cfg.cardA||{rows:[]}, B=cfg.cardB||{rows:[]}; S.fm=S.fm||{};
    var all=A.rows.concat(B.rows);
    var aDone=function(){ return A.rows.every(function(r){ return S.fm[r.id]!=null; }); };
    var done=function(){ return all.length>0&&all.every(function(r){ return S.fm[r.id]!=null; }); };
    function row(r,k){ return '<div class="fr" data-r="'+esc(r.id)+'"><div class="lab">'+esc(r.lab)+'</div><div class="spk-opts">'+r.opts.map(function(o,i){ return '<button type="button" class="spk-opt" data-i="'+i+'">'+esc(o.t)+'</button>'; }).join('')+'</div><p class="pick"></p></div>'; }
    var b=el('div','spk spk-builder spk-fm'+(cfg.cls?' '+cfg.cls:''));
    b.innerHTML=voice(cfg.voice,cfg)
      +'<div class="spk-fmcards"><div class="fc a"><div class="hd">📇 '+esc(A.t||'What it was')+'</div>'+A.rows.map(row).join('')+'</div>'
      +(cfg.mid?'<div class="pin mid" aria-hidden="true">'+cfg.mid+'</div>':'<div class="pin" aria-hidden="true"><svg viewBox="0 0 30 30"><circle cx="15" cy="10" r="7"/><path d="M15,17 V28"/></svg></div>')
      +'<div class="fc b"><div class="hd">💡 '+esc(B.t||'What it tells us')+'</div>'+B.rows.map(row).join('')+'</div></div>'
      +'<p class="spk-miss"></p><p class="spk-chain-done">'+esc(cfg.doneT||'Both cards are pinned together. Now write in Step 3.')+'</p><div class="spk-plan"></div>';
    function lines(){ return all.filter(function(r){ return S.fm[r.id]!=null; }).map(function(r){ return [r.short||r.lab, r.opts[S.fm[r.id]].t]; }); }
    function paint(){ var ad=aDone();
      all.forEach(function(r){ var fr=b.querySelector('.fr[data-r="'+r.id+'"]'), v=S.fm[r.id]; fr.classList.toggle('set',v!=null); fr.querySelector('.pick').textContent=v!=null?r.opts[v].t:'';
        fr.querySelectorAll('.spk-opt').forEach(function(o){ o.classList.toggle('on',+o.dataset.i===v); }); });
      b.querySelector('.fc.b').classList.toggle('locked',!ad); b.querySelector('.fc.a').classList.toggle('filled',ad); b.classList.toggle('topdone',ad);
      var d=done(); b.classList.toggle('done',d);
      var ls=lines(); b.querySelector('.spk-plan').innerHTML=ls.length?ls.map(function(x){ return '<b>'+esc(x[0])+'</b> '+esc(x[1]); }).join('<br>'):esc(cfg.emptyT||'Your plan will show up here as you choose.'); updateStepper(); }
    b.addEventListener('click',function(e){ var o=e.target.closest('.spk-opt'); if(!o) return; var fr=o.closest('.fr'), card=o.closest('.fc'); if(!fr||card.classList.contains('locked')) return;
      var r=find(all,fr.dataset.r), i=+o.dataset.i, opt=r.opts[i], miss=b.querySelector('.spk-miss');
      if(opt.ok===false){ o.classList.add('shake'); setTimeout(function(){ o.classList.remove('shake'); },450); miss.textContent=opt.miss||cfg.missT||'Not quite. Look back at the reading.'; return; }
      var wasDone=done(); S.fm[r.id]=i; save(); miss.textContent=''; sfx('click'); paint();
      if(!wasDone&&done()){ var pn=b.querySelector('.pin'); pn.classList.remove('press'); void pn.getBoundingClientRect(); pn.classList.add('press'); } });
    before(partB,b); paint();
    return {done:done, lines:lines};
  };


  /* ---- 4.07.02 · the U.S. flag of 1821 (13 stripes, a blue corner of stars), for the flagpole ---- */
  FLAGART.us='<rect width="40" height="28" fill="#FFFDF5"/>'+[0,2,4,6,8,10,12].map(function(i){ return '<rect y="'+(i*28/13).toFixed(2)+'" width="40" height="'+(28/13).toFixed(2)+'" fill="#B3261E"/>'; }).join('')+'<rect width="17" height="15.1" fill="#1F3A7A"/>'+[[3,3],[8,3],[13,3],[5.5,7.5],[10.5,7.5],[3,12],[8,12],[13,12]].map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.1" fill="#fff"/>'; }).join('');
  function flagSvg(k,cls){ return '<svg class="'+(cls||'')+'" viewBox="0 0 40 28" aria-hidden="true">'+(FLAGART[k]||'')+'</svg>'; }

  /* ---- Scene 1 · Change the flag (4.07.02): a flagpole over St. Augustine. For each year card, in order, pick the flag
     that went up. The old flag comes down, the new one rises, and the card shows who decided and who had to leave.
     DATA: flags [{id,name}] (ids from FLAGART), stops [{year,flag,who,what,miss}] ---- */
  MOD.flagpole=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var FL=cfg.flags||[], ST=cfg.stops||[]; if(S.fp==null) S.fp=0;
    var done=function(){ return ST.length>0&&S.fp>=ST.length; };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var g=el('div','spk spk-game spk-fp');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Change the flag')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-fprow"><div class="spk-fpscene"><svg viewBox="0 0 220 200" aria-hidden="true"><defs><linearGradient id="spkFpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DB7D4"/><stop offset="1" stop-color="#F3E3C6"/></linearGradient></defs>'
      +'<rect width="220" height="200" fill="url(#spkFpSky)"/><rect y="168" width="220" height="32" class="bay"/><path d="M20,170 L36,140 L184,140 L200,170 Z" class="fort"/><path d="M36,140 L30,130 L48,130 Z M184,140 L172,130 L190,130 Z" class="fort"/><rect x="60" y="148" width="100" height="22" class="fortf"/>'
      +'<line x1="110" y1="24" x2="110" y2="140" class="pole"/><circle cx="110" cy="22" r="3" class="knob"/></svg>'
      +'<div class="flagbox"></div></div>'
      +'<div class="spk-fpside"><div class="spk-fpyears">'+ST.map(function(s,i){ return '<div class="yr" data-i="'+i+'"><b>'+esc(s.year)+'</b><span class="mini"></span></div>'; }).join('')+'</div>'
      +'<p class="spk-fpask"></p><div class="spk-fpflags">'+FL.map(function(f){ return '<button type="button" class="fl" data-f="'+esc(f.id)+'">'+flagSvg(f.id)+'<span>'+esc(f.name)+'</span></button>'; }).join('')+'</div><p class="spk-miss"></p></div></div>'
      +'<div class="spk-fplog"></div><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var box=g.querySelector('.flagbox'), log=g.querySelector('.spk-fplog'), miss=g.querySelector('.spk-miss');
    function paint(anim){ var k=S.fp, cur=k>0?ST[k-1].flag:null;
      box.innerHTML=cur?'<div class="fly'+(anim?' up':'')+'">'+flagSvg(cur)+'</div>':'';
      g.querySelectorAll('.yr').forEach(function(y){ var i=+y.dataset.i; y.classList.toggle('on',i<k); y.classList.toggle('next',i===k); y.querySelector('.mini').innerHTML=i<k?flagSvg(ST[i].flag):''; });
      g.querySelector('.spk-fpask').innerHTML=done()?'':(cfg.askT||'Which flag went up over St. Augustine in {y}?').replace('{y}','<b>'+esc(ST[k].year)+'</b>');
      g.querySelector('.spk-fpflags').classList.toggle('spk-hide',done());
      log.innerHTML=ST.slice(0,k).map(function(s,i){ return '<div class="it'+(anim&&i===k-1?' new':'')+'"><div class="hd">'+flagSvg(s.flag)+'<b>'+esc(s.year)+'</b></div><p><span class="lab">'+esc(cfg.whoLab||'Who decided:')+'</span> '+esc(s.who)+'</p><p><span class="lab">'+esc(cfg.whatLab||'What it meant:')+'</span> '+esc(s.what)+'</p></div>'; }).reverse().join('');
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    g.querySelector('.spk-fpflags').addEventListener('click',function(e){ var b=e.target.closest('.fl'); if(!b||done()) return; ack('open'); var s=ST[S.fp];
      if(b.dataset.f===s.flag){ S.fp++; save(); miss.textContent=''; sfx('click'); paint(true); refreshFile(); refreshVoice(); }
      else { b.classList.add('shake'); setTimeout(function(){ b.classList.remove('shake'); },450); miss.textContent=s.miss||''; missBeat(s.miss||''); } });
    paint();
    return {done:done, journal:function(e,NA){ return S.fp?ST.slice(0,S.fp).map(function(s){ return '<p class="a"><b>'+e(s.year)+':</b> '+e(s.what)+'</p>'; }).join(''):NA; }};
  };

  /* ---- Explore reading · The treaty book (4.07.02): a row of folded documents, each closed with a wax seal. Tap the
     next seal to break it; that part of the reading opens below. DATA: paras [{id,match}], pages [{id,t,year,paras:[]}] ---- */
  MOD.treatybook=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var PG=cfg.pages||[], n=PG.length; if(S.tb==null) S.tb=0;
    var done=function(){ return n>0&&S.tb>=n; };
    var w=el('div','spk spk-tb');
    w.innerHTML=whyCard(cfg.why)+'<div class="spk-tbbar"><div class="docs">'+PG.map(function(p,i){ return '<button type="button" class="doc" data-i="'+i+'" aria-label="'+esc('Break seal '+(i+1)+': '+p.t)+'"><span class="yr">'+esc(p.year||'')+'</span><span class="seal" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20,3 C27,4 34,8 36,15 C39,22 36,31 29,35 C22,39 13,38 8,32 C3,26 3,16 8,10 C11,6 15,3 20,3 Z" class="wax"/><circle cx="20" cy="20" r="9" class="ring"/><path d="M15,20 H25 M20,15 V25" class="mk"/><path d="M8,12 L18,20 L9,30" class="crack"/></svg></span><span class="t">'+esc(p.t)+'</span></button>'; }).join('')+'</div><p class="spk-ys-ct spk-tbct"></p></div><div class="spk-tbread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-tbread'), boxes={};
    PG.forEach(function(p,i){ var b=el('div','spk-tbp'); b.innerHTML='<div class="tab"><span class="y">'+esc(p.year||String(i+1))+'</span><b>'+esc(p.t)+'</b></div>'; list.appendChild(b); (p.paras||[]).forEach(function(pid){ var q=found[pid]; if(q) move(q,function(nd){ b.appendChild(nd); }); });
      if(i<n-1){ var nx=el('button','spk-tbnext',esc((cfg.nextT||'Break the next seal: {t}').replace('{t}',PG[i+1].t))); nx.type='button'; nx.addEventListener('click',function(){ go(i+1); }); b.appendChild(nx); }
      boxes[i]=b; });
    function paint(anim){ var k=S.tb;
      w.querySelectorAll('.doc').forEach(function(d){ var i=+d.dataset.i; d.classList.toggle('open',i<k); d.classList.toggle('next',i===k); if(anim&&i===k-1){ d.classList.remove('crk'); void d.offsetWidth; d.classList.add('crk'); } });
      PG.forEach(function(p,i){ boxes[i].classList.toggle('on',i<k); boxes[i].classList.toggle('cur',i===k-1); });
      w.classList.toggle('all',done());
      w.querySelector('.spk-tbct').innerHTML=done()?'<b>'+esc(cfg.allT||'Every seal is broken. You read the whole story.')+'</b>':(k===0?esc(cfg.startT||'Tap the first seal to break it.'):'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'seals broken. Read this part, then break the next one.'));
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function go(i){ if(i!==S.tb||done()) return; ack('explore'); S.tb++; save(); sfx('click'); paint(true); refreshFile(); refreshVoice();
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },250); } }
    w.querySelector('.docs').addEventListener('click',function(e){ var d=e.target.closest('.doc'); if(!d) return; var i=+d.dataset.i; if(i<S.tb){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} return; } if(i>S.tb){ w.querySelector('.spk-tbct').innerHTML=esc(cfg.orderT||'Break the seals in order: tap the one that glows.'); return; } go(i); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Seals broken: '+Math.min(S.tb,n)+' of '+n+'.</p>'; }};
  };

  /* ---- Vocabulary · Carry it across (4.07.02, trans = across): a small boat waits on one shore of a strait. Tap each
     word to hear it (g4ss-<lesson>-<root>-<n>.mp3 when it exists). Then put each meaning on its word; each match
     sends the boat across with one crate, which lands on the far shore. ---- */
  MOD.ferry=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], ROOT=cfg.root||'trans'; S.fy=S.fy||{heard:[],set:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.fy.set.length===W.length; };
    var g=el('div','spk spk-fy');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Carry it across')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-fywrap"><svg class="fyv" viewBox="0 0 340 110" aria-hidden="true"><rect width="340" height="110" class="sky"/><rect y="60" width="340" height="50" class="sea"/><path d="M0,58 L70,58 L82,72 L0,72 Z" class="shore"/><path d="M340,58 L270,58 L258,72 L340,72 Z" class="shore"/>'
      +'<path d="M90,80 q8,-4 16,0 t16,0 M150,92 q8,-4 16,0 t16,0 M210,82 q8,-4 16,0 t16,0" class="wave"/>'
      +W.map(function(x,i){ return '<rect class="landed" data-i="'+i+'" x="'+(282+(i%2)*22)+'" y="'+(i<2?40:22)+'" width="18" height="16" rx="1.5"/>'; }).join('')
      +'<g class="boatw"><g class="boat"><path d="M60,66 L104,66 L98,78 L66,78 Z" class="hull"/><line x1="82" y1="66" x2="82" y2="38" class="mast"/><path d="M83,40 L100,62 L83,62 Z" class="sail"/><rect x="66" y="54" width="14" height="12" rx="1.5" class="crate"/></g></g></svg>'
      +'<div class="wds">'+W.map(function(x,i){ return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-fy-ct"></p><div class="spk-chips spk-fymeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-fymeans'), miss=g.querySelector('.spk-miss'), wds=g.querySelector('.wds'), svg=g.querySelector('.fyv'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-'+ROOT+'-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-fymean','<span class="ico">📦</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.fy.heard.length===W.length;
      wds.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.fy.heard.indexOf(i)>=0, u=S.fy.set.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      var k=S.fy.set.length; svg.querySelectorAll('.landed').forEach(function(b){ b.classList.toggle('on',+b.dataset.i<k); });
      if(typeof anim==='number'){ var bw=svg.querySelector('.boatw'); bw.classList.remove('go'); void bw.getBoundingClientRect(); bw.classList.add('go'); }
      svg.classList.toggle('empty',done());
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-fymean').forEach(function(t){ var f=S.fy.set.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-fy-ct').innerHTML=!allH?'<b>'+S.fy.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(done()?'':'<b>'+S.fy.set.length+' of '+W.length+'</b> '+esc(cfg.upT||'crates carried across. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ wds.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.fy.set.indexOf(i)>=0||S.fy.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.fy.set.push(i); save(); sel=null; miss.textContent=''; sfx('click'); paint(i); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wds.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.fy.heard.length===W.length){ attempt(sel,c); return; }
      if(S.fy.heard.indexOf(i)<0){ S.fy.heard.push(i); save(); sfx('click'); } say(i); paint('h'); });
    wds.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-fymean'); if(!t) return; if(S.fy.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-fymean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-fymean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-fymean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wds.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wds.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wds.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };

  /* ---- Planner · The hourglass (4.07.02): the fact card + meaning card planner drawn as an hourglass. The top bulb is
     the change (when and who decided); the bottom bulb is what it meant for the people. Sand runs once the top is
     filled; the bottom fills when everything is chosen. Same DATA as factcard (cardA = top, cardB = bottom). ---- */
  MOD.hourglass=function(cfg){
    var mid='<svg viewBox="0 0 60 120" class="hg"><path d="M8,6 H52 M8,114 H52" class="frame"/><path d="M12,8 C12,40 28,52 28,60 C28,68 12,80 12,112 H48 C48,80 32,68 32,60 C32,52 48,40 48,8 Z" class="glass"/><path d="M15,12 C16,36 28,48 30,56 C32,48 44,36 45,12 Z" class="sandT"/><path d="M30,64 L30,108" class="stream"/><path d="M15,111 C20,96 26,90 30,88 C34,90 40,96 45,111 Z" class="sandB"/></svg>';
    return MOD.factcard(Object.assign({},cfg,{mid:mid,cls:'spk-hgp'}));
  };

  /* ---- Scene 1 · Why Spain let go (4.07.03): a rope with four knots ties Florida to Spain's post. Tap a reason card,
     then tap the rope (or drag the card onto it). Each real reason unties one knot; a card that isn't a reason bounces
     back with a hint. When the last knot slips, Spain's flag comes down and Florida drifts free.
     DATA: reasons [{id,t,ico,ok,miss}] (the ok ones are the knots, in any order) ---- */
  MOD.letgo=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var RS=cfg.reasons||[], OK=RS.filter(function(r){ return r.ok; }); S.lg=S.lg||[];
    var done=function(){ return OK.length>0&&OK.every(function(r){ return S.lg.indexOf(r.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var KN=[[98.8, 97.0], [134.4, 99.4], [170.8, 93.4], [208.0, 79.0]];
    var g=el('div','spk spk-game spk-lg');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Why Spain let go')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-lgwrap" role="button" tabindex="0" aria-label="'+esc(cfg.ropeT||'Spain’s rope')+'"><svg viewBox="0 0 360 150" aria-hidden="true"><defs><linearGradient id="spkLgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D8E6"/><stop offset="1" stop-color="#F3E6CC"/></linearGradient></defs>'
      +'<rect width="360" height="150" fill="url(#spkLgSky)"/><rect y="112" width="360" height="38" class="sea"/><path d="M0,112 L84,112 L74,150 L0,150 Z" class="dock"/>'
      +'<g class="pst"><rect x="50" y="62" width="14" height="52" rx="3" class="post"/><rect x="47" y="58" width="20" height="7" rx="2" class="cap"/>'
      +'<line x1="30" y1="18" x2="30" y2="112" class="pole"/><g class="es"><svg x="31" y="19" width="34" height="24" viewBox="0 0 40 28">'+(FLAGART.es||'')+'</svg></g></g>'
      +'<g class="fl"><g transform="translate(232,30) scale(.33)"><path d="'+FLORIDA+'" class="land"/></g><g class="us"><line x1="300" y1="6" x2="300" y2="44" class="pole"/><svg x="301" y="7" width="26" height="18" viewBox="0 0 40 28">'+(FLAGART.us||'')+'</svg></g></g>'
      +'<path class="rope" d="M64,86 Q150,124 246,56"/>'
      +KN.map(function(p,i){ return '<g class="knot" data-i="'+i+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="7"/><path d="M'+(p[0]-5)+','+(p[1]-3)+' q5,7 10,0 M'+(p[0]-5)+','+(p[1]+3)+' q5,-7 10,0"/></g>'; }).join('')
      +'</svg></div>'
      +'<p class="spk-bell-ct spk-lg-ct"></p><div class="spk-chips spk-lgtray"></div><p class="spk-miss"></p>'
      +'<div class="spk-lglog"></div><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var tray=g.querySelector('.spk-lgtray'), miss=g.querySelector('.spk-miss'), wrap=g.querySelector('.spk-lgwrap'), sel=null;
    shuffle(RS).forEach(function(x){ var c=el('div','spk-chip noimg spk-lgcard','<span class="ico">'+(x.ico||'📜')+'</span><span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=x.id; tray.appendChild(c); });
    function paint(anim){ var k=OK.filter(function(r){ return S.lg.indexOf(r.id)>=0; }).length;
      g.querySelectorAll('.knot').forEach(function(n){ var i=+n.dataset.i; n.classList.toggle('off',i<k); if(anim&&i===k-1){ n.classList.remove('slip'); void n.getBoundingClientRect(); n.classList.add('slip'); } });
      tray.querySelectorAll('.spk-lgcard').forEach(function(c){ var on=S.lg.indexOf(c.dataset.i)>=0; c.classList.toggle('spk-hide',on); c.draggable=!on; });
      g.querySelector('.spk-lglog').innerHTML=OK.filter(function(r){ return S.lg.indexOf(r.id)>=0; }).map(function(r){ return '<div class="it"><span aria-hidden="true">'+(r.ico||'📜')+'</span> '+esc(r.t)+'</div>'; }).join('');
      g.querySelector('.spk-lg-ct').innerHTML=done()?'':'<b>'+k+' of '+OK.length+'</b> '+esc(cfg.countT||'knots untied. Find the next real reason.');
      tray.classList.toggle('spk-hide',done());
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function attempt(chip){ if(!chip) return; var r=find(RS,chip.dataset.i); if(!r||S.lg.indexOf(r.id)>=0) return; wrap.classList.remove('armed');
      if(r.ok){ S.lg.push(r.id); save(); sel=null; miss.textContent=''; sfx('click'); paint(true); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); miss.textContent=r.miss||''; missBeat(r.miss||''); chip.classList.remove('sel'); sel=null; } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-lgcard'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-lgcard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; wrap.classList.add('armed'); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-lgcard'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-lgcard'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; wrap.classList.add('armed'); });
    tray.addEventListener('dragend',function(){ wrap.classList.remove('armed','over'); });
    wrap.addEventListener('click',function(){ if(done()) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a reason card first, then tap the rope.'; return; } attempt(sel); });
    wrap.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); wrap.click(); } });
    wrap.addEventListener('dragover',function(e){ if(done()) return; e.preventDefault(); e.dataTransfer.dropEffect='move'; wrap.classList.add('over'); });
    wrap.addEventListener('dragleave',function(){ wrap.classList.remove('over'); });
    wrap.addEventListener('drop',function(e){ e.preventDefault(); wrap.classList.remove('over'); attempt(sel); });
    paint();
    return {done:done, journal:function(e,NA){ var L=OK.filter(function(r){ return S.lg.indexOf(r.id)>=0; }); return L.length?'<p class="a"><b>'+e(cfg.jT||'Why Spain let go:')+'</b> '+e(L.map(function(r){ return r.t; }).join(' · '))+'</p>':NA; }};
  };

  /* ---- Explore reading · Walk the years (4.07.03): stepping stones across a meadow, one per part of the story,
     each marked with its year. Tap the glowing stone (or the button); footprints walk to it and that part opens.
     DATA: paras [{id,match}], stones [{id,year,t,paras:[]}] (up to six) ---- */
  MOD.yearwalk=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.stones||[], n=ST.length; if(S.yw==null) S.yw=0;
    var done=function(){ return n>0&&S.yw>=n; };
    var pos=ST.map(function(s,i){ var x=40+i*(320/Math.max(1,n-1)); return [x,i%2?92:116]; });
    var feet=''; pos.forEach(function(p,i){ if(!i) return; var a=pos[i-1]; for(var j=1;j<=3;j++){ var t=j/4, x=a[0]+(p[0]-a[0])*t, y=a[1]+(p[1]-a[1])*t; feet+='<g class="ft" data-i="'+i+'" style="--d:'+((j-1)*0.22)+'s"><ellipse cx="'+(x-3).toFixed(1)+'" cy="'+(y-2+(j%2?-2:2)).toFixed(1)+'" rx="2.6" ry="1.4"/></g>'; } });
    var w=el('div','spk spk-yw');
    w.innerHTML=whyCard(cfg.why)+'<div class="spk-ywbar"><svg viewBox="0 0 400 150" role="img" aria-label="'+esc(cfg.alt||'Stepping stones across a meadow, one for each year of the story')+'">'
      +'<defs><linearGradient id="spkYwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9D8B4"/><stop offset="1" stop-color="#F7EEDB"/></linearGradient></defs>'
      +'<rect width="400" height="60" fill="url(#spkYwSky)"/><path d="M0,58 Q60,44 120,54 T240,50 T400,54 L400,64 L0,64 Z" class="hills"/><rect y="62" width="400" height="88" class="meadow"/>'
      +'<path d="M8,140 l3,-8 M60,146 l2,-7 M150,142 l3,-8 M250,146 l2,-7 M330,140 l3,-8 M380,146 l2,-7 M110,76 l2,-6 M300,74 l2,-6" class="grass"/>'
      +'<path d="M'+pos.map(function(p){ return p[0]+','+p[1]; }).join(' L')+'" class="trail"/>'+feet
      +pos.map(function(p,i){ return '<g class="stone" data-i="'+i+'"><ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="24" ry="11" class="st"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" class="yr">'+esc(ST[i].year)+'</text></g>'; }).join('')
      +'</svg><div class="spk-ywrow"><p class="spk-ys-ct spk-ywct"></p><button type="button" class="spk-ywgo"></button></div></div><div class="spk-ywread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-ywread'), boxes={}, svg=w.querySelector('svg'), go=w.querySelector('.spk-ywgo');
    ST.forEach(function(s,i){ var b=el('div','spk-ywp'); b.innerHTML='<div class="tab"><span class="y">'+esc(s.year)+'</span><b>'+esc(s.t)+'</b></div>'; list.appendChild(b); (s.paras||[]).forEach(function(pid){ var q=found[pid]; if(q) move(q,function(nd){ b.appendChild(nd); }); }); boxes[i]=b; });
    function paint(anim){ var k=S.yw;
      svg.querySelectorAll('.stone').forEach(function(s){ var i=+s.dataset.i; s.classList.toggle('on',i<k); s.classList.toggle('next',i===k); s.classList.toggle('here',i===k-1); });
      svg.querySelectorAll('.ft').forEach(function(f){ var i=+f.dataset.i; f.classList.toggle('on',i<k); if(anim&&i===k-1){ f.classList.remove('walk'); void f.getBoundingClientRect(); f.classList.add('walk'); } });
      ST.forEach(function(s,i){ boxes[i].classList.toggle('on',i<k); });
      w.classList.toggle('all',done());
      w.querySelector('.spk-ywct').innerHTML=done()?'<b>'+esc(cfg.allT||'You walked the whole path. You read the whole story.')+'</b>':(k===0?esc(cfg.startT||'Tap the first stone to start walking.'):'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'stones reached. Read this part, then step to the next one.'));
      go.classList.toggle('spk-hide',done()); if(!done()) go.textContent=(cfg.nextT||'Step to {y}: {t}').replace('{y}',ST[k].year).replace('{t}',ST[k].t);
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function step(i){ if(i!==S.yw||done()) return; ack('explore'); S.yw++; save(); sfx('click'); paint(true); refreshFile(); refreshVoice();
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },300); } }
    go.addEventListener('click',function(){ step(S.yw); });
    svg.addEventListener('click',function(e){ var s=e.target.closest('.stone'); if(!s) return; var i=+s.dataset.i; if(i===S.yw) step(i); else if(i<S.yw){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} } else w.querySelector('.spk-ywct').innerHTML=esc(cfg.orderT||'Walk the stones in order: tap the one that glows.'); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Stones reached: '+Math.min(S.yw,n)+' of '+n+'.</p>'; }};
  };

  /* ---- Explore evidence · Trace the border (4.07.03): the labeled treaty map with the border's turning points as
     small rings. Tap them in order, from the Gulf of Mexico to the Pacific; each tap draws the next stretch of the
     line. Then two questions about what the line meant. Needs the source labels and the reading too.
     DATA: img, iw, ih, legs [{t, pts:[[x,y]…]}] (each leg ends at its tap point; the first leg is one point),
     qs [{id,q,opts:[{id,t,ok,miss}]}] ---- */
  MOD.traceborder=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var IW=cfg.iw||1000, IH=cfg.ih||600, LG=cfg.legs||[], QS=cfg.qs||[]; S.tbd=S.tbd||{k:0,a:{}};
    var traced=function(){ return LG.length>0&&S.tbd.k>=LG.length; };
    var qOk=function(q){ var o=find(q.opts,S.tbd.a[q.id]); return !!(o&&o.ok); };
    var mine=function(){ return traced()&&QS.every(qOk); };
    var done=function(){ return mine()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var tip=function(l){ return l.pts[l.pts.length-1]; };
    var path=function(i){ var prev=i?tip(LG[i-1]):LG[0].pts[0]; return 'M'+[prev].concat(LG[i].pts).map(function(p){ return p[0]+','+p[1]; }).join(' L'); };
    var g=el('div','spk spk-game spk-tbd');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Trace the border')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-tbdmap" style="aspect-ratio:'+IW+'/'+IH+'"><img alt="'+esc(cfg.alt||'')+'"><svg viewBox="0 0 '+IW+' '+IH+'" preserveAspectRatio="none" aria-hidden="true">'
      +LG.map(function(l,i){ return i?'<path class="seg" data-i="'+i+'" d="'+path(i)+'" pathLength="100"/>':''; }).join('')
      +LG.map(function(l,i){ var p=tip(l); return '<g class="pt" data-i="'+i+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="22" class="hit"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="11" class="ring"/></g>'; }).join('')
      +'</svg></div>'
      +'<p class="spk-tbdsay"></p><p class="spk-miss"></p>'
      +QS.map(function(q){ return '<div class="spk-step" data-q="'+esc(q.id)+'"><div class="lab">'+esc(q.q)+'</div><div class="spk-opts">'+q.opts.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>'; }).join('')
      +'<p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    g.querySelector('.spk-tbdmap img').src=IMG+cfg.img;
    var miss=g.querySelector('.spk-miss'), map=g.querySelector('.spk-tbdmap');
    function paint(anim){ var k=S.tbd.k, t=traced();
      g.querySelectorAll('.seg').forEach(function(s){ var i=+s.dataset.i; s.classList.toggle('on',i<k); if(anim&&i===k-1){ s.classList.remove('draw'); void s.getBoundingClientRect(); s.classList.add('draw'); } });
      g.querySelectorAll('.pt').forEach(function(p){ var i=+p.dataset.i; p.classList.toggle('on',i<k); p.classList.toggle('next',i===k); });
      g.querySelector('.spk-tbdsay').innerHTML=t?'<b>'+esc(cfg.tracedT||'You traced the whole border.')+'</b>':'<b>'+(k+1)+' of '+LG.length+'.</b> '+esc(LG[k].t);
      g.classList.toggle('traced',t);
      QS.forEach(function(q){ var st=g.querySelector('[data-q="'+q.id+'"]'); st.classList.toggle('locked',!t); st.querySelectorAll('.spk-opt').forEach(function(b){ b.classList.toggle('on',b.dataset.v===S.tbd.a[q.id]&&qOk(q)); }); });
      var gate=''; if(mine()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the map above.'; else if(mine()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Learn the Story at the top of this tab.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var d=done(); g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    map.addEventListener('click',function(e){ var p=e.target.closest('.pt'); if(!p||traced()) return; ack('explore'); var i=+p.dataset.i;
      if(i<S.tbd.k) return;
      if(i===S.tbd.k){ S.tbd.k++; save(); miss.textContent=''; sfx('click'); paint(true); refreshFile(); refreshVoice(); }
      else { var m=cfg.orderT||'Follow the border in order. Look for the ring that glows.'; miss.textContent=m; missBeat(m); } });
    g.addEventListener('click',function(e){ var o=e.target.closest('.spk-step .spk-opt'); if(!o) return; var st=o.closest('.spk-step'); if(st.classList.contains('locked')) return;
      var q=find(QS,st.dataset.q), opt=q&&find(q.opts,o.dataset.v); if(!opt) return;
      if(opt.ok){ S.tbd.a[q.id]=opt.id; save(); miss.textContent=''; sfx('click'); paint(); refreshFile(); refreshVoice(); }
      else { o.classList.add('shake'); setTimeout(function(){ o.classList.remove('shake'); },450); miss.textContent=opt.miss||''; missBeat(opt.miss||''); } });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ var L=QS.filter(qOk).map(function(q){ return '<b>'+e(q.q)+'</b> '+e(find(q.opts,S.tbd.a[q.id]).t); }); return (S.tbd.k||L.length)?'<p class="a">Border traced: '+Math.min(S.tbd.k,LG.length)+' of '+LG.length+' stretches.'+(L.length?'<br>'+L.join('<br>'):'')+'</p>':NA; }};
  };

  /* ---- Vocabulary · Hand over the key (4.07.03, cede = to go, to give way): a long table with Spain's flag at one
     end and the United States flag at the other. A big iron key waits at Spain's end. Tap each word to hear it
     (g4ss-<lesson>-<root>-<n>.mp3 when it exists). Then put each meaning on its word; each match slides the key
     one step along the table. At the far end the lock opens. ---- */
  MOD.keypass=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], ROOT=cfg.root||'cede'; S.kp=S.kp||{heard:[],set:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.kp.set.length===W.length; };
    var g=el('div','spk spk-kp');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Hand over the key')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-kpwrap"><svg class="kpv" viewBox="0 0 340 120" aria-hidden="true"><rect width="340" height="120" class="wall"/><rect y="96" width="340" height="24" class="floor"/>'
      +'<path d="M20,70 L320,70 L330,80 L10,80 Z" class="top"/><rect x="18" y="80" width="8" height="30" class="leg"/><rect x="314" y="80" width="8" height="30" class="leg"/>'
      +'<line x1="22" y1="14" x2="22" y2="70" class="pole"/><svg x="23" y="15" width="30" height="21" viewBox="0 0 40 28">'+(FLAGART.es||'')+'</svg>'
      +'<line x1="318" y1="14" x2="318" y2="70" class="pole"/><svg x="287" y="15" width="30" height="21" viewBox="0 0 40 28">'+(FLAGART.us||'')+'</svg>'
      +'<g class="lock"><path d="M286,52 v-8 a9,9 0 0 1 18,0 v8" class="shk"/><rect x="282" y="52" width="26" height="18" rx="3" class="lb"/><circle cx="295" cy="60" r="2.6" class="kh"/></g>'
      +'<g class="keyw"><g class="key"><circle cx="58" cy="62" r="7" class="kb"/><circle cx="58" cy="62" r="3" class="kho"/><rect x="64" y="60" width="26" height="4" class="ks"/><rect x="82" y="64" width="3" height="5" class="kt"/><rect x="87" y="64" width="3" height="4" class="kt"/></g></g>'
      +'</svg>'
      +'<div class="wds">'+W.map(function(x,i){ return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-kp-ct"></p><div class="spk-chips spk-kpmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-kpmeans'), miss=g.querySelector('.spk-miss'), wds=g.querySelector('.wds'), svg=g.querySelector('.kpv'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-'+ROOT+'-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-kpmean','<span class="ico">🗝️</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.kp.heard.length===W.length, k=S.kp.set.length;
      wds.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.kp.heard.indexOf(i)>=0, u=S.kp.set.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      svg.querySelector('.keyw').style.transform='translateX('+(W.length?(k/W.length*196).toFixed(1):0)+'px)';
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-kpmean').forEach(function(t){ var f=S.kp.set.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-kp-ct').innerHTML=!allH?'<b>'+S.kp.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(done()?'':'<b>'+k+' of '+W.length+'</b> '+esc(cfg.upT||'steps along the table. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ wds.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.kp.set.indexOf(i)>=0||S.kp.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.kp.set.push(i); save(); sel=null; miss.textContent=''; sfx('click'); paint(i); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wds.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.kp.heard.length===W.length){ attempt(sel,c); return; }
      if(S.kp.heard.indexOf(i)<0){ S.kp.heard.push(i); save(); sfx('click'); } say(i); paint('h'); });
    wds.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-kpmean'); if(!t) return; if(S.kp.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-kpmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-kpmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-kpmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wds.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wds.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wds.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };

  /* ---- Planner · The treaty card (4.07.03): the fact card + meaning card planner as a two-column treaty card.
     Left: what the treaty said; right: what changed for people. A ribbon with a seal ties them when both are filled.
     Same DATA as factcard (cardA = left, cardB = right). ---- */
  MOD.treatycard=function(cfg){
    var mid='<svg viewBox="0 0 60 120" class="rb"><path d="M30,4 V116" class="rbl"/><path d="M6,60 H54" class="rbl h"/><circle cx="30" cy="60" r="13" class="seal"/><path d="M24,60 H36 M30,54 V66" class="sm"/></svg>';
    return MOD.factcard(Object.assign({},cfg,{mid:mid,cls:'spk-tcp'}));
  };
  /* ---- Scene 1 · Load the wagon (4.07.04): a covered wagon with a few empty spots in its bed. Tap a supply card, then
     tap the wagon (or drag the card onto it). A real need drops into the bed and its "why" shows in the log; a card
     that won't help bounces back with a hint. When the bed is full, the oxen lean in and the wagon rolls.
     DATA: items [{id,t,ico,ok,why,miss}] (the ok ones fill the bed, in any order) ---- */
  MOD.loadwagon=function(cfg){ var card=document.querySelector('.canvas-file-card'), body=card&&card.querySelector('.canvas-file-card-body'); if(!body) return null;
    var IT=cfg.items||[], OK=IT.filter(function(r){ return r.ok; }); S.lw=S.lw||[];
    var done=function(){ return OK.length>0&&OK.every(function(r){ return S.lw.indexOf(r.id)>=0; }); };
    var vis=body.querySelector('.canvas-file-card-visual'); if(vis) vis.classList.add('spk-hide');
    var n=OK.length, slots=''; for(var i=0;i<n;i++){ var x=118+i*(150/Math.max(1,n)); slots+='<g class="slot" data-i="'+i+'"><rect x="'+x.toFixed(1)+'" y="70" width="'+(150/n-4).toFixed(1)+'" height="18" rx="3" class="sl"/><text x="'+(x+(150/n-4)/2).toFixed(1)+'" y="84" text-anchor="middle" class="ic"></text></g>'; }
    var g=el('div','spk spk-game spk-lw');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Load the wagon')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-lwwrap" role="button" tabindex="0" aria-label="'+esc(cfg.wagonT||'The wagon')+'"><svg viewBox="0 0 360 150" aria-hidden="true"><defs><linearGradient id="spkLwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D9A6"/><stop offset="1" stop-color="#F7EEDB"/></linearGradient></defs>'
      +'<rect width="360" height="150" fill="url(#spkLwSky)"/><path d="M0,98 Q90,86 180,94 T360,92 L360,150 L0,150 Z" class="ground"/><path d="M0,124 Q120,116 240,126 T360,122" class="road"/>'
      +'<g class="pines"><path d="M24,98 l10,-34 l10,34 Z M300,96 l9,-30 l9,30 Z M332,98 l8,-26 l8,26 Z"/><path d="M33,98 v8 M308,96 v8 M339,98 v8" class="tr"/></g>'
      +'<g class="rig"><g class="oxen"><ellipse cx="62" cy="100" rx="22" ry="11" class="ox"/><circle cx="40" cy="94" r="7" class="ox"/><path d="M34,88 l-4,-5 M44,88 l4,-5" class="horn"/><path d="M48,108 v12 M58,110 v11 M70,110 v11 M80,108 v12" class="lg"/></g>'
      +'<path d="M84,98 L112,96" class="tong"/><path d="M112,88 L276,88 L272,104 L116,104 Z" class="bed"/>'
      +'<path d="M116,88 C116,40 160,30 194,30 C228,30 272,40 272,88" class="cover"/><path d="M150,88 C150,48 170,36 194,34 M238,88 C238,48 218,36 194,34" class="hoop"/>'
      +slots
      +'<g class="wh"><circle cx="140" cy="112" r="15" class="wheel"/><path d="M125,112 H155 M140,97 V127 M129,101 L151,123 M151,101 L129,123" class="spoke"/></g>'
      +'<g class="wh"><circle cx="250" cy="112" r="15" class="wheel"/><path d="M235,112 H265 M250,97 V127 M239,101 L261,123 M261,101 L239,123" class="spoke"/></g></g>'
      +'</svg></div>'
      +'<p class="spk-bell-ct spk-lw-ct"></p><div class="spk-chips spk-lwtray"></div><p class="spk-miss"></p>'
      +'<div class="spk-lglog spk-lwlog"></div><div class="spk-win">'+(cfg.win||'')+'<div class="spk-s1v"></div></div>';
    body.appendChild(g);
    var tray=g.querySelector('.spk-lwtray'), miss=g.querySelector('.spk-miss'), wrap=g.querySelector('.spk-lwwrap'), sel=null;
    shuffle(IT).forEach(function(x){ var c=el('div','spk-chip noimg spk-lgcard spk-lwcard','<span class="ico">'+(x.ico||'📦')+'</span><span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=x.id; tray.appendChild(c); });
    function packed(){ return OK.filter(function(r){ return S.lw.indexOf(r.id)>=0; }).sort(function(a,b){ return S.lw.indexOf(a.id)-S.lw.indexOf(b.id); }); }
    function paint(anim){ var P=packed(), k=P.length;
      g.querySelectorAll('.slot').forEach(function(s){ var i=+s.dataset.i, on=i<k; s.classList.toggle('on',on); s.querySelector('.ic').textContent=on?(P[i].ico||'📦'):''; if(anim&&i===k-1){ s.classList.remove('drop'); void s.getBoundingClientRect(); s.classList.add('drop'); } });
      tray.querySelectorAll('.spk-lwcard').forEach(function(c){ var on=S.lw.indexOf(c.dataset.i)>=0; c.classList.toggle('spk-hide',on); c.draggable=!on; });
      g.querySelector('.spk-lwlog').innerHTML=P.map(function(r){ return '<div class="it"><span aria-hidden="true">'+(r.ico||'📦')+'</span> <b>'+esc(r.t)+'.</b> '+esc(r.why||'')+'</div>'; }).join('');
      g.querySelector('.spk-lw-ct').innerHTML=done()?'':'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'spots filled. Pick the next thing the family really needs.');
      tray.classList.toggle('spk-hide',done());
      g.querySelector('.spk-win').classList.toggle('show',done()); g.classList.toggle('done',done()); }
    function attempt(chip){ if(!chip) return; var r=find(IT,chip.dataset.i); if(!r||S.lw.indexOf(r.id)>=0) return; wrap.classList.remove('armed');
      if(r.ok){ S.lw.push(r.id); save(); sel=null; miss.textContent=''; sfx('click'); paint(true); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); miss.textContent=r.miss||''; missBeat(r.miss||''); chip.classList.remove('sel'); sel=null; } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-lwcard'); if(!c) return; ack('open'); tray.querySelectorAll('.spk-lwcard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; wrap.classList.add('armed'); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-lwcard'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-lwcard'); if(!c||!c.draggable){ e.preventDefault(); return; } ack('open'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; wrap.classList.add('armed'); });
    tray.addEventListener('dragend',function(){ wrap.classList.remove('armed','over'); });
    wrap.addEventListener('click',function(){ if(done()) return; if(!sel){ miss.textContent=cfg.firstT||'Tap a supply card first, then tap the wagon.'; return; } attempt(sel); });
    wrap.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); wrap.click(); } });
    wrap.addEventListener('dragover',function(e){ if(done()) return; e.preventDefault(); e.dataTransfer.dropEffect='move'; wrap.classList.add('over'); });
    wrap.addEventListener('dragleave',function(){ wrap.classList.remove('over'); });
    wrap.addEventListener('drop',function(e){ e.preventDefault(); wrap.classList.remove('over'); attempt(sel); });
    paint();
    return {done:done, journal:function(e,NA){ var L=packed(); return L.length?'<p class="a"><b>'+e(cfg.jT||'In the wagon:')+'</b> '+e(L.map(function(r){ return r.t; }).join(' · '))+'</p>':NA; }};
  };

  /* ---- Explore reading · Follow the trail (4.07.04): a winding wagon trail from the red-clay hills of Georgia down into
     the Florida pines, with a stop for each part of the story. Tap the glowing stop (or the button); the wagon rolls
     there and that part opens.
     DATA: paras [{id,match}], stops [{id,lab,t,paras:[]}] (up to six) ---- */
  MOD.trail=function(cfg){ var act=activityTitled('#panel-explore',cfg.activity||'.'); if(!act) return null; var body=act.querySelector('.activity-body'); if(!body) return null;
    var PA=(cfg.paras||[]).map(function(p){ return Object.assign({},p,{rx:new RegExp(p.match,'i')}); }), found={}, first=null;
    [].forEach.call(body.querySelectorAll(':scope > p'),function(p){ PA.forEach(function(a){ if(!found[a.id]&&a.rx.test(p.textContent.trim())){ found[a.id]=p; if(!first) first=p; } }); });
    if(!first) return null;
    var ST=cfg.stops||[], n=ST.length; if(S.tr==null) S.tr=0;
    var done=function(){ return n>0&&S.tr>=n; };
    var P=[[34,40],[100,62],[176,48],[250,80],[318,100],[372,128]].slice(0,Math.max(n,1));
    if(n<6){ P=ST.map(function(s,i){ var t=n>1?i/(n-1):0; return [34+t*338, 40+t*88+(i%2?14:-6)]; }); }
    var d='M'+P[0][0]+','+P[0][1]; for(var i=1;i<P.length;i++){ var a=P[i-1], b=P[i], mx=(a[0]+b[0])/2; d+=' C'+mx+','+a[1]+' '+mx+','+b[1]+' '+b[0]+','+b[1]; }
    var w=el('div','spk spk-tr');
    w.innerHTML=whyCard(cfg.why)+'<div class="spk-trbar"><svg viewBox="0 0 400 150" role="img" aria-label="'+esc(cfg.alt||'A wagon trail from Georgia down into Florida, with a stop for each part of the story')+'">'
      +'<rect width="400" height="150" class="flat"/><path d="M0,0 H170 C150,24 90,40 0,46 Z" class="clay"/><path d="M0,46 C90,40 150,24 170,0" class="line"/>'
      +'<text x="10" y="16" class="st">'+esc(cfg.fromT||'Georgia')+'</text><text x="392" y="16" text-anchor="end" class="st">'+esc(cfg.toT||'Florida')+'</text>'
      +'<g class="pn"><path d="M214,40 l6,-18 l6,18 Z M300,30 l5,-15 l5,15 Z M356,56 l6,-18 l6,18 Z M130,110 l6,-18 l6,18 Z M60,128 l5,-15 l5,15 Z M226,128 l6,-18 l6,18 Z"/></g>'
      +'<g class="pal"><path d="M280,130 c-6,-8 -14,-8 -18,-4 M280,130 c4,-10 12,-12 18,-8 M280,130 c-2,-10 0,-16 4,-18 M168,96 c-6,-8 -14,-8 -18,-4 M168,96 c4,-10 12,-12 18,-8"/></g>'
      +'<path d="'+d+'" class="road"/><path d="'+d+'" class="done" pathLength="100" style="stroke-dasharray:100;stroke-dashoffset:100"/>'
      +P.map(function(p,i){ return '<g class="stop" data-i="'+i+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="11" class="dot"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" class="nm">'+(i+1)+'</text></g>'; }).join('')
      +'<g class="wg"><g class="wgi"><path d="M-12,-2 C-12,-14 12,-14 12,-2 Z" class="cv"/><rect x="-13" y="-3" width="26" height="6" rx="1" class="bd"/><circle cx="-8" cy="5" r="3.4" class="wl"/><circle cx="8" cy="5" r="3.4" class="wl"/></g></g>'
      +'</svg><div class="spk-ywrow"><p class="spk-ys-ct spk-trct"></p><button type="button" class="spk-ywgo spk-trgo"></button></div></div><div class="spk-ywread spk-trread"></div>';
    before(first,w);
    var list=w.querySelector('.spk-trread'), boxes={}, svg=w.querySelector('svg'), go=w.querySelector('.spk-trgo'), wg=svg.querySelector('.wg'), dn=svg.querySelector('.done');
    ST.forEach(function(s,i){ var b=el('div','spk-ywp'); b.innerHTML='<div class="tab"><span class="y">'+(i+1)+'</span><b>'+esc(s.t)+'</b></div>'; list.appendChild(b); (s.paras||[]).forEach(function(pid){ var q=found[pid]; if(q) move(q,function(nd){ b.appendChild(nd); }); }); boxes[i]=b; });
    function paint(){ var k=S.tr, at=Math.max(0,Math.min(k,n)-1), p=P[k>0?at:0];
      wg.style.transform='translate('+p[0]+'px,'+(p[1]-21)+'px)'; wg.classList.toggle('home',k===0);
      dn.style.strokeDashoffset=String(n>1&&k>0?100-100*(at/(n-1)):100);
      svg.querySelectorAll('.stop').forEach(function(s){ var i=+s.dataset.i; s.classList.toggle('on',i<k); s.classList.toggle('next',i===k); });
      ST.forEach(function(s,i){ boxes[i].classList.toggle('on',i<k); });
      w.classList.toggle('all',done());
      w.querySelector('.spk-trct').innerHTML=done()?'<b>'+esc(cfg.allT||'You followed the whole trail. You read the whole story.')+'</b>':(k===0?esc(cfg.startT||'Tap stop 1 to start the trip.'):'<b>'+k+' of '+n+'</b> '+esc(cfg.countT||'stops reached. Read this part, then roll on.'));
      go.classList.toggle('spk-hide',done()); if(!done()) go.textContent=(cfg.nextT||'Roll on to stop {n}: {t}').replace('{n}',k+1).replace('{t}',ST[k].lab||ST[k].t);
      var th=act.parentNode.querySelector('.spk-think'); if(th) th.classList.toggle('spk-hide',!done()); }
    function step(i){ if(i!==S.tr||done()) return; ack('explore'); S.tr++; save(); sfx('click'); paint(); refreshFile(); refreshVoice();
      var nb=boxes[i]; if(nb&&nb.scrollIntoView&&!matchMedia('(prefers-reduced-motion: reduce)').matches){ setTimeout(function(){ try{ nb.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} },500); } }
    go.addEventListener('click',function(){ step(S.tr); });
    svg.addEventListener('click',function(e){ var s=e.target.closest('.stop'); if(!s) return; var i=+s.dataset.i; if(i===S.tr) step(i); else if(i<S.tr){ try{ boxes[i].scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(err){} } else w.querySelector('.spk-trct').innerHTML=esc(cfg.orderT||'Follow the trail in order: tap the stop that glows.'); });
    foldThink(act,body); paint();
    return {act:act, done:done, journal:function(){ return '<p class="a">Trail stops reached: '+Math.min(S.tr,n)+' of '+n+'.</p>'; }};
  };

  /* ---- Explore evidence · Made from what grew here (4.07.04): the labeled photo, then two baskets: "Grew right here"
     and "Made somewhere else and brought in". Tap a card (or drag it) into its basket; each shows why. Then one
     question about what the sort shows. Needs the source labels and the reading too.
     DATA: img, baskets [{id,t,ico}], cards [{id,t,b,why,miss}], q {q,opts:[{id,t,ok,miss}]} ---- */
  MOD.madehere=function(cfg){ var anchor=evidenceAnchor(); if(!anchor) return null;
    var BK=cfg.baskets||[], CD=cfg.cards||[], Q=cfg.q; S.mh=S.mh||{c:[],a:null};
    var sorted=function(){ return CD.length>0&&CD.every(function(c){ return S.mh.c.indexOf(c.id)>=0; }); };
    var qOk=function(){ if(!Q) return true; var o=find(Q.opts,S.mh.a); return !!(o&&o.ok); };
    var mine=function(){ return sorted()&&qOk(); };
    var done=function(){ return mine()&&(!R.source||R.source.done())&&(!R.reading||R.reading.done()); };
    var g=el('div','spk spk-game spk-mh');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Made from what grew here')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +(cfg.img?'<div class="spk-mhpic"><img alt="'+esc(cfg.alt||'')+'"></div>':'')
      +'<p class="spk-bell-ct spk-mh-ct"></p><div class="spk-chips spk-mhtray"></div><p class="spk-miss"></p>'
      +'<div class="spk-mhbks">'+BK.map(function(b){ return '<div class="bk" data-b="'+esc(b.id)+'" role="button" tabindex="0"><div class="hd"><span class="ico" aria-hidden="true">'+(b.ico||'🧺')+'</span> '+esc(b.t)+'</div><div class="in"></div></div>'; }).join('')+'</div>'
      +(Q?'<div class="spk-step" data-q="q"><div class="lab">'+esc(Q.q)+'</div><div class="spk-opts">'+Q.opts.map(function(o){ return '<button type="button" class="spk-opt" data-v="'+esc(o.id)+'">'+esc(o.t)+'</button>'; }).join('')+'</div></div>':'')
      +'<p class="spk-si-gate"></p><div class="spk-win">'+(cfg.win||'')+'</div>';
    after(anchor,g);
    if(cfg.img) g.querySelector('.spk-mhpic img').src=IMG+cfg.img;
    var tray=g.querySelector('.spk-mhtray'), miss=g.querySelector('.spk-miss'), sel=null;
    shuffle(CD).forEach(function(x){ var c=el('div','spk-chip noimg spk-mhcard','<span>'+esc(x.t)+'</span>'); c.setAttribute('role','button'); c.tabIndex=0; c.draggable=true; c.dataset.i=x.id; tray.appendChild(c); });
    function arm(on){ g.querySelectorAll('.bk').forEach(function(b){ b.classList.toggle('armed',on); b.classList.remove('over'); }); }
    function paint(anim){ var s=sorted();
      BK.forEach(function(b){ var box=g.querySelector('.bk[data-b="'+b.id+'"] .in');
        box.innerHTML=S.mh.c.map(function(id){ return find(CD,id); }).filter(function(c){ return c&&c.b===b.id; }).map(function(c){ return '<div class="it'+(anim===c.id?' new':'')+'"><b>'+esc(c.t)+'</b> '+esc(c.why||'')+'</div>'; }).join(''); });
      tray.querySelectorAll('.spk-mhcard').forEach(function(c){ c.classList.toggle('spk-hide',S.mh.c.indexOf(c.dataset.i)>=0); });
      tray.classList.toggle('spk-hide',s);
      g.querySelector('.spk-mh-ct').innerHTML=s?'':'<b>'+S.mh.c.length+' of '+CD.length+'</b> '+esc(cfg.countT||'sorted. Tap a card, then tap the basket it belongs in.');
      var st=g.querySelector('[data-q="q"]'); if(st){ st.classList.toggle('locked',!s); st.querySelectorAll('.spk-opt').forEach(function(b){ b.classList.toggle('on',b.dataset.v===S.mh.a&&qOk()); }); }
      var gate=''; if(mine()&&R.source&&!R.source.done()) gate=cfg.hotT||'Last step: tap every gold number on the photo above.'; else if(mine()&&R.reading&&!R.reading.done()) gate=cfg.readT||'Last step: finish Learn the Story at the top of this tab.';
      g.querySelector('.spk-si-gate').textContent=gate;
      var d=done(); g.querySelector('.spk-win').classList.toggle('show',d); g.classList.toggle('done',d); }
    function attempt(chip,bk){ if(!chip||!bk) return; var c=find(CD,chip.dataset.i); if(!c||S.mh.c.indexOf(c.id)>=0) return; arm(false);
      if(c.b===bk.dataset.b){ S.mh.c.push(c.id); save(); sel=null; miss.textContent=''; sfx('click'); bk.classList.remove('thud'); void bk.offsetWidth; bk.classList.add('thud'); paint(c.id); refreshFile(); refreshVoice(); }
      else { chip.classList.add('shake'); setTimeout(function(){ chip.classList.remove('shake'); },450); miss.textContent=c.miss||''; missBeat(c.miss||''); chip.classList.remove('sel'); sel=null; } }
    tray.addEventListener('click',function(e){ var c=e.target.closest('.spk-mhcard'); if(!c) return; ack('explore'); tray.querySelectorAll('.spk-mhcard').forEach(function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); sel=c; miss.textContent=''; arm(true); });
    tray.addEventListener('keydown',function(e){ var c=e.target.closest('.spk-mhcard'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    tray.addEventListener('dragstart',function(e){ var c=e.target.closest('.spk-mhcard'); if(!c){ e.preventDefault(); return; } ack('explore'); sel=c; e.dataTransfer.setData('text/plain',c.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    tray.addEventListener('dragend',function(){ arm(false); });
    var bks=g.querySelector('.spk-mhbks');
    bks.addEventListener('click',function(e){ var b=e.target.closest('.bk'); if(!b) return; if(!sel){ if(!sorted()) miss.textContent=cfg.firstT||'Tap a card first, then tap its basket.'; return; } attempt(sel,b); });
    bks.addEventListener('keydown',function(e){ var b=e.target.closest('.bk'); if(b&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); b.click(); } });
    bks.addEventListener('dragover',function(e){ var b=e.target.closest('.bk'); g.querySelectorAll('.bk').forEach(function(x){ x.classList.toggle('over',x===b); }); if(b){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    bks.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.bk')); });
    g.addEventListener('click',function(e){ var o=e.target.closest('.spk-step .spk-opt'); if(!o||!Q) return; var st=o.closest('.spk-step'); if(st.classList.contains('locked')) return;
      var opt=find(Q.opts,o.dataset.v); if(!opt) return;
      if(opt.ok){ S.mh.a=opt.id; save(); miss.textContent=''; sfx('click'); paint(); refreshFile(); refreshVoice(); }
      else { o.classList.add('shake'); setTimeout(function(){ o.classList.remove('shake'); },450); miss.textContent=opt.miss||''; missBeat(opt.miss||''); } });
    HOT_TAP.push(function(){ paint(); refreshFile(); });
    paint();
    return {done:done, journal:function(e,NA){ if(!S.mh.c.length) return NA; var out=BK.map(function(b){ var L=S.mh.c.map(function(id){ return find(CD,id); }).filter(function(c){ return c&&c.b===b.id; }); return L.length?'<b>'+e(b.t)+':</b> '+e(L.map(function(c){ return c.t; }).join(' · ')):''; }).filter(Boolean);
      if(qOk()&&Q&&S.mh.a) out.push('<b>'+e(Q.q)+'</b> '+e(find(Q.opts,S.mh.a).t)); return '<p class="a">'+out.join('<br>')+'</p>'; }};
  };

  /* ---- Vocabulary · Down the trail (4.07.04, migr = to move): a wagon road with a signpost for each word. Tap each
     word to hear it (g4ss-<lesson>-<root>-<n>.mp3 when it exists). Then put each meaning on its word; each match
     raises that word's sign and moves the wagon one post closer to the new home. ---- */
  MOD.signposts=function(cfg){ var game=document.querySelector('.root-match-game'); if(!game) return null; var body=game.closest('.activity-body'); if(!body) return null;
    var W=cfg.words||[], ROOT=cfg.root||'migr'; S.sp=S.sp||{heard:[],set:[]};
    var cv=body.querySelector('.callout-vocab'); if(cv) cv.classList.add('spk-hide'); game.classList.add('spk-hide');
    var fact=document.getElementById('rootDiscoveryFact'), factTx=fact?fact.textContent.replace(/^\s*🔎\s*Discovery Fact\s*/,'').trim():'';
    var done=function(){ return W.length>0&&S.sp.set.length===W.length; };
    var px=function(i){ return 70+i*(220/Math.max(1,W.length-1)); };
    var g=el('div','spk spk-sp');
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Down the trail')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice,cfg)
      +'<div class="spk-spwrap"><svg class="spv" viewBox="0 0 340 120" aria-hidden="true"><rect width="340" height="120" class="sky"/><path d="M0,78 Q170,66 340,76 L340,120 L0,120 Z" class="gr"/><path d="M0,104 Q170,92 340,100" class="road"/>'
      +'<g class="home"><path d="M300,66 l16,-14 l16,14 Z" class="rf"/><rect x="303" y="66" width="26" height="18" class="hw"/><rect x="313" y="72" width="7" height="12" class="dr"/><path d="M324,52 c2,-6 -2,-8 0,-14" class="smoke"/></g>'
      +W.map(function(x,i){ var X=px(i); return '<g class="post" data-i="'+i+'"><line x1="'+X+'" y1="98" x2="'+X+'" y2="62" class="pl"/><g class="sg"><rect x="'+(X-20)+'" y="56" width="40" height="13" rx="2" class="bd"/><text x="'+X+'" y="66" text-anchor="middle" class="tx">'+esc(x.w)+'</text></g></g>'; }).join('')
      +'<g class="wgw"><g class="wgi"><path d="M10,96 C10,80 38,80 38,96 Z" class="cv"/><rect x="8" y="95" width="32" height="7" rx="1" class="bd2"/><circle cx="14" cy="104" r="4.5" class="wl"/><circle cx="34" cy="104" r="4.5" class="wl"/></g></g>'
      +'</svg>'
      +'<div class="wds">'+W.map(function(x,i){ return '<div class="wd" data-i="'+i+'" role="button" tabindex="0" aria-label="'+esc(x.w)+'"><span class="w">'+(x.root?esc(x.w).replace(new RegExp(esc(x.root),'i'),function(m){ return '<b>'+m+'</b>'; }):esc(x.w))+'</span><span class="m"></span></div>'; }).join('')+'</div></div>'
      +'<p class="spk-bell-ct spk-sp-ct"></p><div class="spk-chips spk-spmeans"></div><p class="spk-miss"></p>'
      +'<div class="spk-flag-win2"><span class="stamp">'+(cfg.win||'')+'</span><p>'+esc(factTx)+'</p></div>';
    after(game,g);
    var means=g.querySelector('.spk-spmeans'), miss=g.querySelector('.spk-miss'), wds=g.querySelector('.wds'), svg=g.querySelector('.spv'), sel=null, AU={};
    W.forEach(function(x,i){ var a=new Audio(); a.preload='none'; a.src=AUD+'g4ss-'+LESSON+'-'+ROOT+'-'+(i+1)+'.mp3'; AU[i]=a; });
    shuffle(W.map(function(x,i){ return i; })).forEach(function(i){ var t=el('div','spk-chip noimg spk-spmean','<span class="ico">🪧</span><span>'+esc(W[i].m)+'</span>'); t.setAttribute('role','button'); t.tabIndex=0; t.draggable=true; t.dataset.i=i; means.appendChild(t); });
    function say(i){ var au=AU[i]; if(!au) return; try{ document.querySelectorAll('audio').forEach(function(o){ if(o!==au) o.pause(); }); au.currentTime=0; var p=au.play(); if(p&&p.catch) p.catch(function(){}); }catch(e){} }
    function paint(anim){ var allH=S.sp.heard.length===W.length, k=S.sp.set.length;
      wds.querySelectorAll('.wd').forEach(function(c){ var i=+c.dataset.i, h=S.sp.heard.indexOf(i)>=0, u=S.sp.set.indexOf(i)>=0; c.classList.toggle('heard',h); c.classList.toggle('up',u); c.querySelector('.m').textContent=u?W[i].m:''; if(anim===i){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } });
      svg.querySelectorAll('.post').forEach(function(p){ p.classList.toggle('up',S.sp.set.indexOf(+p.dataset.i)>=0); });
      var x=k>=W.length?248:(k?px(k-1)-6:0); svg.querySelector('.wgw').style.transform='translateX('+x.toFixed(1)+'px)';
      g.classList.toggle('done',done());
      means.classList.toggle('wait',!allH); means.querySelectorAll('.spk-spmean').forEach(function(t){ var f=S.sp.set.indexOf(+t.dataset.i)>=0; t.classList.toggle('spk-hide',f); t.draggable=allH&&!f; });
      g.querySelector('.spk-sp-ct').innerHTML=!allH?'<b>'+S.sp.heard.length+' of '+W.length+'</b> '+esc(cfg.hearT||'words heard. Tap each word to hear it.'):(done()?'':'<b>'+k+' of '+W.length+'</b> '+esc(cfg.upT||'signs up. Put each meaning on its word.'));
      if(done()) window._rootMatchDone=true; }
    function arm(on){ wds.querySelectorAll('.wd').forEach(function(c){ c.classList.toggle('armed',on&&!c.classList.contains('up')); c.classList.remove('over'); }); }
    function attempt(t,c){ if(!t||!c) return; var i=+t.dataset.i; if(S.sp.set.indexOf(i)>=0||S.sp.heard.length<W.length) return; arm(false);
      if(+c.dataset.i===i){ S.sp.set.push(i); save(); sel=null; miss.textContent=''; sfx('click'); paint(i); }
      else { t.classList.add('shake'); setTimeout(function(){ t.classList.remove('shake'); },450); miss.textContent=W[i].miss||''; } }
    wds.addEventListener('click',function(e){ var c=e.target.closest('.wd'); if(!c) return; var i=+c.dataset.i;
      if(sel&&S.sp.heard.length===W.length){ attempt(sel,c); return; }
      if(S.sp.heard.indexOf(i)<0){ S.sp.heard.push(i); save(); sfx('click'); } say(i); paint('h'); });
    wds.addEventListener('keydown',function(e){ var c=e.target.closest('.wd'); if(c&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); c.click(); } });
    means.addEventListener('click',function(e){ var t=e.target.closest('.spk-spmean'); if(!t) return; if(S.sp.heard.length<W.length){ miss.textContent=cfg.hearFirstT||'Tap every word first, so you hear each one.'; return; } means.querySelectorAll('.spk-spmean').forEach(function(x){ x.classList.remove('sel'); }); t.classList.add('sel'); sel=t; miss.textContent=''; arm(true); });
    means.addEventListener('keydown',function(e){ var t=e.target.closest('.spk-spmean'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });
    means.addEventListener('dragstart',function(e){ var t=e.target.closest('.spk-spmean'); if(!t||!t.draggable){ e.preventDefault(); return; } sel=t; e.dataTransfer.setData('text/plain',t.dataset.i); e.dataTransfer.effectAllowed='move'; arm(true); });
    means.addEventListener('dragend',function(){ arm(false); });
    wds.addEventListener('dragover',function(e){ var c=e.target.closest('.wd'); wds.querySelectorAll('.wd').forEach(function(x){ x.classList.toggle('over',x===c); }); if(c&&!c.classList.contains('up')){ e.preventDefault(); e.dataTransfer.dropEffect='move'; } });
    wds.addEventListener('drop',function(e){ e.preventDefault(); attempt(sel,e.target.closest('.wd')); });
    paint(); return {done:done};
  };

  /* ---- Planner · Saddlebags (4.07.04): the fact card + meaning card planner as two saddlebags over a horse's back.
     Left bag: what daily life was like; right bag: what it took to survive, and whose land it was. A tag ties both
     flaps shut when both are filled. Same DATA as factcard (cardA = left, cardB = right). ---- */
  MOD.saddlebags=function(cfg){
    var mid='<svg viewBox="0 0 60 120" class="sb"><path d="M10,30 Q30,14 50,30" class="strap"/><path d="M30,22 V70" class="strap v"/><rect x="18" y="62" width="24" height="16" rx="3" class="tag"/><path d="M30,62 V56" class="tie"/><circle cx="30" cy="70" r="2.4" class="hole"/></svg>';
    return MOD.factcard(Object.assign({},cfg,{mid:mid,cls:'spk-sbp'}));
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
    evidence:function(){ var d=document.querySelector('#panel-explore .spk-sayinfer, #panel-explore .spk-doctype, #panel-explore .spk-shipshore, #panel-explore .spk-game.spk-spot, #panel-explore .spk-domino, #panel-explore .spk-whole, #panel-explore .spk-namehunt, #panel-explore .spk-cline, #panel-explore .spk-halfpic, #panel-explore .spk-shadow, #panel-explore .spk-tn, #panel-explore .spk-whc, #panel-explore .spk-spy, #panel-explore .spk-fe, #panel-explore .spk-tm, #panel-explore .spk-tbd, #panel-explore .spk-mh'); return d&&[d,'before']; },
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
    {n:7,t:'Fort Mose & Pioneers', img:'source-4-07-01-fort-mose-plan-original.jpg', lon:-81.32,lat:29.93, where:'Fort Mose, two miles north of St. Augustine', blurb:'The first free Black town in what is now the U.S. that the law allowed, and the flags and pioneers that followed.'},
    {n:8,t:'Statehood & War',      img:'source-4-08-01-state-of-florida-1846-original.jpg', lon:-84.28,lat:30.44, where:'Tallahassee', blurb:'Florida becomes a state, the Seminole Wars, and the Civil War.'},
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
