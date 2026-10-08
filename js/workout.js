// Workout engine: wildcards, sound and voice, the timer, the card deck, rests, round end and the bored button.

const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];

let wstats=store.get("ss_wild",{});
let bests=store.get("ss_best",{});
function pickWildCat(){
  const cats=Object.keys(WILD);
  const w=cats.map(c=>{const s=wstats[c]||{u:0,f:0};return (s.f+1)/(s.u+2)+.15});
  let r=Math.random()*w.reduce((a,b)=>a+b,0);
  for(let i=0;i<cats.length;i++){r-=w[i];if(r<=0)return cats[i]}
  return cats[0];
}
function makeWild(){
  const cat=pickWildCat(); const s=wstats[cat]||{u:0,f:0}; s.u++; wstats[cat]=s; store.set("ss_wild",wstats);
  if(cat==="choice") return {wild:cat,n:"Pick one. Fast.",c:"You have 6 seconds, or the deck picks for you.",choice:pick(WILD.choice)};
  return Object.assign({wild:cat},pick(WILD[cat]));
}

// sound + voice
let soundOn=true, voiceOn=false, ac=null;
function beep(f=880,d=.12){ if(!soundOn) return; try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(),g=ac.createGain(); o.frequency.value=f; o.type="triangle"; g.gain.setValueAtTime(.18,ac.currentTime); g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+d);}catch(e){} }
function say(t){ if(!voiceOn) return; try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.rate=1.05; speechSynthesis.speak(u);}catch(e){} }
$("soundBtn").onclick=e=>{soundOn=!soundOn;e.currentTarget.setAttribute("aria-pressed",soundOn)};
$("voiceBtn").onclick=e=>{voiceOn=!voiceOn;e.currentTarget.setAttribute("aria-pressed",voiceOn); if(voiceOn) say("Okay. I'll read the cards.")};
let wake=null;
async function keepAwake(){ try{ wake=await navigator.wakeLock.request("screen") }catch(e){} }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&(phase==="work"||phase==="rest")) keepAwake(); });

// timer
let T={running:false,left:0,dur:0,done:null,id:null}, onHalf=null;
function startTimer(sec,done,half){ clearInterval(T.id); onHalf=half||null; T={running:true,dur:sec,left:sec,end:performance.now()+sec*1000,done,id:null,lastBeep:null,halfDone:false}; T.id=setInterval(tick,200); tick(); }
function tick(){
  if(!T.running) return;
  T.left=Math.max(0,(T.end-performance.now())/1000);
  const s=Math.ceil(T.left);
  $("secs").innerHTML=s+"<small>s</small>";
  $("barFill").style.width=(100-T.left/T.dur*100)+"%";
  if(onHalf&&!T.halfDone&&T.left<=T.dur/2){T.halfDone=true;onHalf();}
  if(s<=3&&s>0&&T.lastBeep!==s){T.lastBeep=s;beep(660,.08)}
  if(T.left<=0){clearInterval(T.id);T.running=false;beep(990,.2);const d=T.done;T.done=null;d&&d();}
}
function stopTimer(){ clearInterval(T.id); T.running=false; T.done=null; }
function pauseTimer(){ if(!T.running) return; T.running=false; clearInterval(T.id); T.left=Math.max(0,(T.end-performance.now())/1000); }
function resumeTimer(){ if(T.running||!T.done) return; T.running=true; T.end=performance.now()+T.left*1000; T.id=setInterval(tick,200); }

// state
let mode="mix", level=1, mins=15, totalRounds=3, deck=[], idx=0, round=0, phase="home", paused=false, boredTaps=[], choiceTimer=null, used=new Set(), roundPRs=0, count=0, cardStart=0, emomDone=false;

const SCREENS=["welcome","week","home","play","end"];
function show(id){ SCREENS.forEach(s=>$(s).hidden=s!==id); window.scrollTo(0,0); }

function draw(type,n){
  let pool=MOVES.filter(m=>m.m===type&&!used.has(m.id));
  if(pool.length<n){ MOVES.filter(m=>m.m===type).forEach(m=>used.delete(m.id)); pool=MOVES.filter(m=>m.m===type); }
  return weightedShuffle(pool).slice(0,n).map(m=>{used.add(m.id);return {...m,lvl:level}});
}
function buildDeck(){
  if(mode==="mob") return draw("mob",5);
  let main= mode==="mix" ? shuffle([...draw("burn",2),...draw("str",1),...draw("ath",1)]) : draw(mode,4);
  if(Math.random()<.4) main[Math.floor(Math.random()*main.length)]=makeWild();
  return [...main,...draw("mob",1).map(c=>({...c,finisher:true}))];
}
const ladderFor=r=> r>totalRounds ? 20 : LADDER[Math.min(2,Math.floor((r-1)*3/totalRounds))];
const isReps=c=>!c.wild&&c.r;
const repsOf=c=>c.r[c.lvl];
const workSecs=c=>c.dur||(c.m==="burn"?ladderFor(round):c.m==="mob"&&mode==="mob"?45:HOLD[c.m]);

function renderPips(){
  $("pips").innerHTML=deck.map((_,i)=>`<span class="pip ${i<idx?"done":i===idx?"now":""}"></span>`).join("");
  $("roundLabel").textContent= round<=totalRounds ? `Round ${round} of ${totalRounds} · ${MODE_NAMES[mode]}` : `Bonus round · ${MODE_NAMES[mode]}`;
}
function updateStartLabel(){
  const m=document.querySelector('input[name="mode"]:checked').value;
  const t=document.querySelector('input[name="mins"]:checked').value;
  $("startBtn").innerHTML=`Saddle up<small>${t} minutes · ${MODE_NAMES[m]} (${PLAIN[m]})</small>`;
}
document.querySelectorAll('input[name="mode"],input[name="mins"]').forEach(i=>i.addEventListener("change",updateStartLabel));

function startRound(){
  round++; deck=buildDeck(); idx=0; boredTaps=[]; roundPRs=0;
  show("play"); keepAwake(); showCard();
}

function renderLevel(c){
  const has=!c.wild;
  $("lvl").hidden=!has; if(!has) return;
  $("title").textContent=c.n[c.lvl];
  $("lvlName").textContent=LEVELS[c.lvl];
  $("easier").disabled=c.lvl===0; $("harder").disabled=c.lvl===2;
  $("watch").href="https://www.youtube.com/results?search_query="+encodeURIComponent(c.n[c.lvl]+" exercise how to");
  if(isReps(c)){ $("repsNum").textContent=repsOf(c); $("repsUnit").textContent=c.s?"reps each side":"reps"; }
}
function setFoot(kind){ // "reps" | "timer" | "emom" | "none"
  $("repsWrap").hidden=kind!=="reps";
  $("clockWrap").hidden=!(kind==="timer"||kind==="emom");
  $("doneBtn").hidden=!(kind==="reps"||kind==="emom");
  $("pauseBtn").disabled=kind==="reps"||kind==="none";
}
function showCard(){
  if(phase==="rest"&&restVig){ dayRec().vig+=Math.min(restDur,Math.round((performance.now()-restStart)/1000)); saveLog(); }
  restVig=false;
  phase="work"; paused=false; emomDone=false; $("pauseBtn").textContent="Pause";
  const c=deck[idx]; const card=$("card");
  card.classList.remove("rest"); card.classList.toggle("wild",!!c.wild);
  card.dataset.m=c.wild?"":c.m;
  card.style.animation="none"; void card.offsetWidth; card.style.animation="";
  const k=$("kind"); k.classList.remove("switch");
  k.textContent=c.wild?`Wildcard · ${WILD_NAMES[c.wild]}`:c.finisher?"Flexibility finisher":TYPE_NAMES[c.m]+(c.s&&!isReps(c)?" · switch sides at the beep":"");
  if(c.wild) $("title").textContent=c.n;
  $("cue").textContent=c.c;
  renderLevel(c);
  if(c.choice) $("fig").toggleAttribute("hidden",true); else setFig(figFor(c));
  $("boredBtn").innerHTML='Shake it up ✦<small>Swap for a wildcard</small>';
  $("skipBtn").textContent="Next card";
  renderPips(); clearTimeout(choiceTimer); stopTimer();
  count=0; $("counter").hidden=!c.key;
  if(c.key){ $("countBtn").textContent="+1 · 0"; $("best").textContent=bests[c.key]?`Your best: ${bests[c.key]}`:"No record yet"; }
  cardStart=performance.now();
  if(c.choice){
    setFoot("none"); const box=$("choices"); box.hidden=false;
    box.innerHTML=c.choice.map((o,i)=>`<button data-i="${i}">${o}</button>`).join("");
    box.querySelectorAll("button").forEach(b=>b.onclick=()=>chooseOption(+b.dataset.i));
    say("Pick one. "+c.choice.join(" or ")); beep(1200,.1);
    choiceTimer=setTimeout(()=>chooseOption(Math.floor(Math.random()*2)),6000);
    return;
  }
  $("choices").hidden=true;
  const name=c.wild?c.n:c.n[c.lvl];
  beep(880,.12);
  if(isReps(c)){
    setFoot("reps"); $("doneBtn").textContent="Done";
    say(`${name}. ${repsOf(c)} reps${c.s?" each side":""}. Tap done when finished.`);
    return;
  }
  if(c.emom){ setFoot("emom"); $("doneBtn").textContent="Done, rest now"; }
  else setFoot("timer");
  say(name+". "+c.c);
  startTimer(workSecs(c),()=>cardFinished(true), c.s?()=>{k.textContent="Switch sides";k.classList.add("switch");beep(1100,.1);setTimeout(()=>beep(1100,.1),180);say("Switch sides")}:null);
}
function chooseOption(i){
  clearTimeout(choiceTimer); const c=deck[idx]; const name=c.choice[i];
  const m=MOVES.find(x=>x.n.includes(name));
  deck[idx]=m?{...m,lvl:m.n.indexOf(name),fromWild:"choice"}:{wild:"choice",n:name,c:"Go!",dur:40};
  showCard();
}
function elapsed(){ return Math.round((performance.now()-cardStart)/1000); }
function logPartial(){
  const c=deck[idx]; if(!c||phase!=="work"||c.choice) return;
  const s= isReps(c) ? Math.min(elapsed(),180) : Math.max(0,Math.round(T.dur-(T.left||0)));
  today.secs+=s; saveToday(); credit(c,s,false);
}
let restVig=false, restStart=0, restDur=0;
function saveCount(){
  const c=deck[idx]; if(!c||!c.key||!count) return;
  if(!bests[c.key]||count>bests[c.key]){ bests[c.key]=count; store.set("ss_best",bests); today.prs++; roundPRs++; saveToday(); }
}
function cardFinished(natural){
  const c=deck[idx];
  restVig=false;
  if(natural){
    const s= isReps(c) ? Math.min(elapsed(),180) : (c.emom?60:T.dur);
    today.secs+=s;
    const tp=credit(c,s,true); restVig= tp==="burn"||tp==="ath"||tp==="vig";
    const w=c.wild||c.fromWild; if(w){const s=wstats[w]||{u:1,f:0}; s.f++; wstats[w]=s; store.set("ss_wild",wstats);}
    saveCount();
  }
  saveToday();
  idx++;
  if(idx>=deck.length) return endRound();
  const nxt=deck[idx];
  startRest(REST[c.wild?"wild":c.m]||10, nxt.finisher?"Last card: flexibility.":"Next card is face down.", "Catch your breath, partner. Shake it out, sip water.");
}
function startRest(sec,title,cue){
  phase="rest"; paused=false; $("pauseBtn").textContent="Pause";
  const card=$("card"); card.classList.remove("wild"); card.classList.add("rest"); card.dataset.m="";
  $("kind").classList.remove("switch");
  $("kind").textContent=`Rest · ${sec}s`; $("title").textContent=title; $("lvl").hidden=true; $("counter").hidden=true; $("fig").toggleAttribute("hidden",true);
  $("cue").textContent=cue; $("choices").hidden=true; setFoot("timer");
  $("skipBtn").textContent="Flip it now";
  $("boredBtn").innerHTML='Shake it up ✦<small>Flip a wildcard now</small>';
  renderPips(); say(title);
  restStart=performance.now(); restDur=sec;
  startTimer(sec,()=>showCard());
}
function fillStats(){ $("sRounds").textContent=today.rounds; $("sMins").textContent=Math.max(today.secs?1:0,Math.round(today.secs/60)); $("sPR").textContent=today.prs; }
function renderSessbar(){
  const n=Math.max(totalRounds,round);
  $("sessbar").innerHTML=Array.from({length:n},(_,i)=>`<i class="${i<round?"on":""}"></i>`).join("");
}
function endRound(){
  phase="end"; stopTimer();
  today.rounds++; saveToday();
  show("end"); fillStats(); renderSessbar(); renderEndWeek();
  $("winBtn").onclick=endAsWin;
  const best=Object.entries(wstats).filter(([,s])=>s.f>0).sort((a,b)=>(b[1].f/b[1].u)-(a[1].f/a[1].u))[0];
  const tip= best ? `Wildcards that keep you going lately: ${WILD_NAMES[best[0]].toLowerCase()}. You'll get more of those.` : "";
  if(round<totalRounds){
    const left=totalRounds-round;
    $("stamp").textContent= roundPRs?"New sheriff in town":"Yeehaw!";
    $("endTitle").textContent= left===1?"One round left.": round*2>=totalRounds?"Past halfway.":"Round done. Nice.";
    $("nextup").hidden=false;
    const nb=ladderFor(round+1);
    $("nextTitle").textContent=(mode==="burn"||mode==="mix")&&nb<ladderFor(round)?`Shorter: ${nb}s burn cards`:"Five new cards";
    $("nextLen").textContent=`${left} to go`;
    $("endNote").textContent= tip || "Stopping here still counts.";
    $("againBtn").textContent="Next round"; $("winBtn").textContent="Call it a win";
  } else {
    $("stamp").textContent= roundPRs?"New sheriff in town":"Rodeo Queen behavior";
    $("endTitle").textContent= round===totalRounds?`Your ${mins} minutes are done.`:`Bonus round ${round-totalRounds}, done.`;
    $("nextup").hidden=true;
    $("endNote").textContent= tip || "That's the whole session. Anything extra is a bonus.";
    $("againBtn").textContent="Bonus round"; $("winBtn").textContent="Finish";
  }
}
function endAsWin(){
  stopTimer(); clearTimeout(choiceTimer);
  if(phase==="work"){ logPartial(); saveCount(); }
  if(phase!=="end"){ today.rounds++; saveToday(); }
  const finishedAll=round>=totalRounds;
  phase="end"; show("end"); $("nextup").hidden=true; renderSessbar(); renderEndWeek();
  $("stamp").textContent="It counts"; $("endTitle").textContent= finishedAll?"Session done. Rodeo Queen behavior.":"You showed up. That counts, cowgirl.";
  fillStats(); $("endNote").textContent="Stopping when you're done is part of the plan.";
  $("againBtn").textContent="Actually, one more round"; $("winBtn").textContent="Back to start"; $("winBtn").onclick=goHome;
  try{wake&&wake.release()}catch(e){}
}
function goHome(){ phase="home"; round=0; used.clear(); show("home"); renderTodayHome(); renderHomeWeek(); }

// bored button
function onBored(){
  const now=Date.now(); boredTaps=boredTaps.filter(t=>now-t<120000); boredTaps.push(now);
  if(phase==="rest"){ stopTimer(); deck[idx]=makeWild(); return showCard(); }
  if(boredTaps.length===1) return swapWild();
  pauseTimer(); clearTimeout(choiceTimer);
  if(boredTaps.length===2){
    sheet("Bored again?","Your body might want a real break, or something even harder.",
      "Something harder",()=>{ logPartial(); stopTimer(); deck[idx]=Object.assign({wild:"burst"},pick(WILD.burst)); showCard(); },
      "60-second breather",()=>{ logPartial(); stopTimer(); restVig=false; idx++; if(idx>=deck.length) return endRound(); startRest(60,"Breather. Shake it all out.","Roll your shoulders. Drink something. The next card waits."); });
  } else {
    boredTaps=[];
    sheet("You're allowed to stop.","You trained. Ending now still counts as a win today.",
      "End here as a win",endAsWin,
      "One more card",()=>swapWild());
  }
}
function swapWild(){ logPartial(); saveCount(); stopTimer(); deck[idx]=makeWild(); showCard(); }
function sheet(t,p,aText,aFn,bText,bFn){
  $("sheetTitle").textContent=t; $("sheetText").textContent=p; $("sheetA").textContent=aText; $("sheetB").textContent=bText;
  $("scrim").hidden=false; $("sheetA").focus();
  $("sheetA").onclick=()=>{$("scrim").hidden=true;aFn()};
  $("sheetB").onclick=()=>{$("scrim").hidden=true;bFn()};
}
