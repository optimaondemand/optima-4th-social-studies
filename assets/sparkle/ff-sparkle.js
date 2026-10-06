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
     scene1.type   mapquest | habitcard
     explore.reading.type   seasongrid | filesgrid
     explore.evidence.type  wheelsort  | spotdetail
     planner.type  picks | fixit
     vocab.type    rootdig
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
  var P=get(PKEY,null);
  function save(){ put(KEY,S); put(CKEY,C); }
  function el(t,c,h){ var d=document.createElement(t); if(c) d.className=c; if(h!=null) d.innerHTML=h; return d; }
  function after(r,n){ r.parentNode.insertBefore(n,r.nextSibling); } function before(r,n){ r.parentNode.insertBefore(n,r); }
  function voice(t){ return t?'<p class="spk-voice">'+t+'</p>':''; }
  function words(s){ return (s||'').trim().split(/\s+/).filter(Boolean).length; }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function shuffle(a){ return a.slice().sort(function(){return .5-Math.random();}); }
  function find(list,id,key){ key=key||'id'; return (list||[]).filter(function(x){ return x[key]===id; })[0]; }
  function thumb(name,emoji){ var ph=el('div','ph',emoji); if(!name) return ph; var img=new Image(); img.className='ph'; img.alt=''; (function tryI(i){ if(i>=EXT.length) return; var t=new Image(); t.onload=function(){ img.src=t.src; ph.replaceWith(img); }; t.onerror=function(){ tryI(i+1); }; t.src=IMG+name+EXT[i]; })(0); return ph; }
  function nm(){ return P&&P.name?P.name:''; }
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
  function teacher(text,choiceKey,opts){ opts=opts||{}; text=fill(text); push({f:'t',t:text,scene:opts.scene||currentScene(),ts:Date.now()}); if(choiceKey){ pendingKey=choiceKey; S.pendingKey=choiceKey; save(); } if(!opts.quiet){ unread++; toast(text); } render(); }
  function student(text){ var sc=(pendingKey&&CHOICES[pendingKey]&&CHOICES[pendingKey].scene)||currentScene(); push({f:'s',t:text,scene:sc}); pendingKey=null; S.pendingKey=null; save(); }
  function choicesHTML(){ var cs=pendingKey&&CHOICES[pendingKey]; if(!cs) return ''; return '<div class="spk-choices">'+cs.map(function(c,i){ return '<button type="button" class="spk-choice'+(c.go?' go':'')+'" data-key="'+pendingKey+'" data-i="'+i+'">'+esc(c.t)+'</button>'; }).join('')+'</div>'; }
  function msgHTML(m){ return '<div class="spk-msg '+m.f+'">'+esc(m.t)+'</div>'; }
  function ack(sc){ var n=thread.filter(function(m){return m.scene===sc;}).length; if((S.ack[sc]||0)!==n){ S.ack[sc]=n; save(); render(); } }
  function noteHTML(label){ return '<div class="hd"><div class="k"><span class="spk-avatar">👩‍🏫</span>'+label+'</div><button type="button" class="fold">Fold up ▴</button></div><div class="spk-msgs"></div><div class="spk-ch"></div><button type="button" class="mini"><span class="dot"></span><span class="spk-avatar">👩‍🏫</span><span class="pv"></span><span class="go">Open ▸</span></button>'; }
  function onNote(e){ var n=e.currentTarget; if(e.target.closest('.mini')){ openPhone(true); return; } if(e.target.closest('.fold')){ ack(n.dataset.scene); return; } onChoice(e); }
  function onChoice(e){ var b=e.target.closest('.spk-choice'); if(!b) return; var cs=CHOICES[b.dataset.key]; if(!cs||b.dataset.key!==pendingKey) return; var c=cs[+b.dataset.i]; student(c.t); if(c.reply) teacher(c.reply,c.next||null,{scene:cs.scene,quiet:true}); render(); }
  function render(){
    if(phoneEl){ var w=phoneEl.querySelector('.spk-msgs-wrap'); w.querySelector('.spk-msgs').innerHTML='<div class="spk-msg sys">Today</div>'+thread.map(msgHTML).join(''); w.scrollTop=w.scrollHeight; var comp=phoneEl.querySelector('.spk-composer'); comp.innerHTML=pendingKey&&CHOICES[pendingKey]?'<div class="lab">Tap a reply</div>'+choicesHTML():'<div class="none">No reply needed. Keep going — I’ll text when something changes.</div>'; phoneEl.querySelector('.spk-status .tm').textContent=clock(); }
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
  function toast(text){ if(!toastEl||phoneEl.classList.contains('open')) return; toastEl.querySelector('.tx span').textContent=text; toastEl.querySelector('.tx small').textContent='now'; toastEl.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(hideToast,7000); }
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
    if(!thread.length){
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
    fileEl=el('div','spk spk-file'); fileEl.innerHTML='<div class="spk-file-row">'+folderSVG()+'<div><div class="spk-file-sub"><span><span class="ttl">The Florida Files · '+esc(FILE_TITLE)+' · </span><span class="pg"></span></span><button type="button" class="spk-mail" aria-expanded="false">📱 Messages <span class="n">0</span></button></div><div class="spk-tabs" role="tablist">'+STAGES.map(function(s,i){return '<button type="button" role="tab" class="spk-tab" data-tab="'+s.tab+'"><span class="n"><span>'+(i+1)+'</span></span><span class="l">'+esc(s.r)+'<small>'+esc(s.t)+'</small></span></button>';}).join('')+'</div></div></div>';
    fileEl.addEventListener('click',function(e){ var t=e.target.closest('.spk-tab'); if(t){ switchTab(t.dataset.tab); } });
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
  var R={}, CATS=DATA.categories||[];
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
    var g=el('div','spk spk-game'); g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'Map Quest')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice)+'<div class="spk-maplock"><div class="spk-map">'+mapSVG()+'</div><div><div class="spk-chips"></div><p class="spk-miss"></p></div></div><div class="spk-notes spk-hide"><div class="k">'+esc(N.label||'Notes · finish each line in your own words')+'</div><div class="spk-stems" data-help="spk-stems"></div><button type="button" class="spk-link" disabled></button></div>';
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
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice)
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
    var g=el('div','spk spk-game'); g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice)+'<div class="spk-wheelwrap"><div class="spk-wheel"></div><div><div class="spk-chips"></div><p class="spk-miss"></p></div></div><div class="spk-win">'+(cfg.win||'')+'</div>';
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
    g.innerHTML='<div class="spk-game-head"><span class="spk-kicker">'+esc(cfg.kicker||'')+'</span><span class="spk-h">'+esc(cfg.h||'')+'</span></div>'+voice(cfg.voice)
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
    var b=el('div','spk spk-builder'); b.innerHTML=voice(cfg.voice)
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
    b.innerHTML=voice(cfg.voice)
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
      +voice(cfg.voice)
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

  function buildModules(){
    var ex=DATA.explore||{};
    function run(cfg){ if(!cfg||!cfg.type) return null; if(!MOD[cfg.type]){ console.warn('sparkle layer: unknown type '+cfg.type); return null; } try{ return MOD[cfg.type](cfg); }catch(e){ console.warn('sparkle layer: '+cfg.type,e); return null; } }
    R.scene1=run(DATA.scene1); R.reading=run(ex.reading); R.evidence=run(ex.evidence); R.planner=run(DATA.planner); R.vocab=run(DATA.vocab);
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
    var st=[ ['journal-q1','journal-q2','journal-q3'].every(flagsMet),
             R.planner?R.planner.done():true,
             notebookWritten()&&w('journal-chronicle')>=5,
             checklistDone() ];
    stepperEl.querySelectorAll('button').forEach(function(b,i){ b.classList.toggle('done',st[i]); }); }

  /* ================================================================ VOICE NOTES — the teacher's audio guides.
     Never read the page, never give an answer. Hidden until the .mp3 exists (?review shows empty slots).
     DATA.voice: [{slot,label,at:'scene1'|'explore'|'mapdone'|'write'|'score',when:'perfect'|'review',script}]
     Multi-part (plays in a row, e.g. teacher → historical voice → teacher):
       {label,at,parts:[{slot,who,script},…]} → files g4ss-<lesson>-<slot>.mp3; shown only when every part loads. */
  var AT={
    scene1:function(){ var fc=document.querySelector('#panel-scene .canvas-file-card'); return fc&&[fc,'before']; },
    explore:function(){ var a=(R.reading&&R.reading.act)||document.querySelector('#panel-explore .activity'); var sb=a&&a.previousElementSibling; return a&&[sb&&sb.classList.contains('step-badge')?sb:a,'before']; },
    write:function(){ var h=document.getElementById('spk-step-3'); return h&&[h,'after']; },
    mapdone:function(){ var k=document.querySelector('.spk-game .spk-notes > .k'); return k&&[k,'before']; },
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
  function paintVideos(){ document.querySelectorAll('.video-wrap').forEach(function(v){ v.classList.toggle('spk-empty',!v.querySelector('iframe,video')); }); }
  function buildMedia(){ paintVideos(); if(!window.__spkVidObs){ window.__spkVidObs=new MutationObserver(function(){ clearTimeout(window.__spkVidT); window.__spkVidT=setTimeout(paintVideos,100); }); window.__spkVidObs.observe(document.body,{childList:true,subtree:true}); } }

  /* ================================================================ flags, hints, "go further", wrong-answer lines — all from DATA */
  function flagCount(f,v){ if(f.groups) return f.groups.filter(function(g){ return new RegExp('\\b('+g+')','i').test(v); }).length;
    var m=v.match(new RegExp(f.rx,'gi'))||[]; var u={}; m.forEach(function(x){ u[x.toLowerCase().trim()]=1; }); return Object.keys(u).length; }
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
    new MutationObserver(paint).observe(document.getElementById('panel-check'),{attributes:true,subtree:true,attributeFilter:['class']});
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
    {n:4,t:'Explorers',            lon:-80.60,lat:28.39, where:'The Atlantic coast', blurb:'Ships on the horizon. Spain, France and England arrive in La Florida.'},
    {n:5,t:'Checkpoint',door:true, blurb:'A checkpoint between units. It opens when the files before it are finished.'},
    {n:6,t:'Spanish Florida',      lon:-81.31,lat:29.89, where:'St. Augustine and the missions', blurb:'The oldest city, the mission trail, and life in a Spanish colony.'},
    {n:7,t:'Fort Mose & Pioneers', lon:-81.33,lat:30.05, where:'Fort Mose, north of St. Augustine', blurb:'The first free Black settlement, and the pioneers who followed.'},
    {n:8,t:'Statehood & War',      lon:-84.28,lat:30.44, where:'Tallahassee', blurb:'Florida becomes a state, the Seminole Wars, and the Civil War.'},
    {n:9,t:'Checkpoint',door:true, blurb:'A checkpoint between units. It opens when the files before it are finished.'},
    {n:10,t:'Modern Florida',      lon:-82.44,lat:27.96, where:'Tampa, Ybor City and the railroads', blurb:'Cigars, oranges, railroads and the land boom.'},
    {n:11,t:'Civil Rights & Citizens', lon:-81.20,lat:29.60, where:'St. Augustine, 1964', blurb:'Floridians who stood up for their rights, and what changed.'},
    {n:12,t:'Government',          lon:-84.10,lat:30.20, where:'The Capitol', blurb:'How Florida governs itself: the Capitol, the courts, and you.'},
    {n:13,t:'The Exhibit',         lon:-81.38,lat:28.54, where:'The whole state', blurb:'The capstone: build the Florida History Exhibit from everything in this drawer.'}
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
    var st=f.door?'<div class="st locked">Checkpoint door</div>':open?'<div class="st open">✓ File open</div>':now?'<div class="st now">This file · in progress</div>':'<div class="st locked">🔒 Locked · opens in unit '+f.n+'</div>';
    var sent=open?C.sentences[f.n]:null;
    var body=esc(f.blurb)+(f.where?'<br><span style="color:var(--ffs)">📍 '+esc(f.where)+'</span>':'')+(sent?'<br><span class="qq">“'+esc(sent)+'”</span><br><span style="font-size:12px;color:var(--ffs)">— your Historian’s Sentence</span>':(now?'<br><span style="color:var(--ffs)">Your Historian’s Sentence will be filed here when you write it.</span>':''));
    w.innerHTML='<div class="spk-card"><span class="tab">FILE · '+(f.n<10?'0':'')+f.n+'</span>'+(f.img&&(open||now)?'<img class="th" alt="" src="'+IMG+f.img+'" onerror="this.outerHTML=\'<div class=th>📁</div>\'">':'<div class="th">'+(f.door?'🚪':open?'📂':'📁')+'</div>')+'<div><div class="tt">'+esc(f.t)+'</div>'+st+'<div class="bd">'+body+'</div></div>'+(open?'<span class="stamp'+(anim&&f.n===THIS?' new':'')+'">Open</span>':'')+'</div>'; }

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
  function build(){ try{ P=get(PKEY,null); var h=document.documentElement; h.classList.add('spk-on'); if(QUIET) h.classList.add('spk-quiet');
    buildTop(); buildPhone(); buildOpening(); buildFile(); dockPhone(); buildScenes(); buildLens(); buildModules(); buildCheck(); buildCoach(); buildSteps(); buildVoice(); buildMedia(); buildQuizSteps(); buildOpti(); buildHelp(); buildQuizMiss(); buildJournal(); buildKey(); buildCabinet(); refreshFile(); render(); }catch(e){ console.warn('sparkle layer:',e); } }
  window.__ffSparkleAPI={teardown:teardown,build:build,data:DATA};
  function go(){ build(); buildReviewBar(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();
