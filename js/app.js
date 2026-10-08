// Wires up the remaining buttons and opens the right first screen.

// remembered choices
level=store.get("ss_level",1); const lr=$("l-"+level); if(lr) lr.checked=true;
const mr=$("m-"+store.get("ss_mode","mix")); if(mr) mr.checked=true;
const tr=$("t-"+store.get("ss_mins",15)); if(tr) tr.checked=true;
updateStartLabel();

$("helpBtn").onclick=()=>{ if(phase==="work"||phase==="rest"){ pauseTimer(); paused=true; $("pauseBtn").textContent="Resume"; } helpFrom=phase; show("welcome"); $("welcomeBtn").textContent= (phase==="work"||phase==="rest")?"Back to my workout":"Let's set it up"; };
let helpFrom="home";
$("welcomeBtn").onclick=()=>{ store.set("ss_seen",1); if(helpFrom==="work"||helpFrom==="rest") show("play"); else if(helpFrom==="end") show("end"); else if(!GOALS) openWeek(); else goHome(); };
$("easier").onclick=()=>{const c=deck[idx]; if(c&&!c.wild&&c.lvl>0){c.lvl--;renderLevel(c);setFig(figFor(c),propFor(c));say(c.n[c.lvl])}};
$("harder").onclick=()=>{const c=deck[idx]; if(c&&!c.wild&&c.lvl<2){c.lvl++;renderLevel(c);setFig(figFor(c),propFor(c));say(c.n[c.lvl])}};
$("countBtn").onclick=()=>{ count++; $("countBtn").textContent="+1 · "+count; };
$("doneBtn").onclick=()=>{
  const c=deck[idx]; if(phase!=="work"||!c) return;
  if(c.emom){ if(emomDone) return; emomDone=true; $("doneBtn").hidden=true; $("kind").textContent="Earned rest"; $("title").textContent="Rest till the minute's up."; beep(990,.15); say("Nice. Rest."); return; }
  beep(990,.15); cardFinished(true);
};
$("startBtn").onclick=()=>{
  mode=document.querySelector('input[name="mode"]:checked').value;
  level=+document.querySelector('input[name="level"]:checked').value;
  mins=+document.querySelector('input[name="mins"]:checked').value; totalRounds=ROUNDS[mins];
  store.set("ss_level",level); store.set("ss_mode",mode); store.set("ss_mins",mins);
  round=0; used.clear(); beep(0.0001,.01); startRound();
};
$("boredBtn").onclick=onBored;
$("pauseBtn").onclick=()=>{ if(paused){paused=false;resumeTimer();$("pauseBtn").textContent="Pause"} else {paused=true;pauseTimer();$("pauseBtn").textContent="Resume"} };
$("skipBtn").onclick=()=>{ if(phase==="rest"){ stopTimer(); return showCard(); } logPartial(); saveCount(); stopTimer(); clearTimeout(choiceTimer); idx++; if(idx>=deck.length) return endRound(); showCard(); };
$("againBtn").onclick=()=>{ $("winBtn").onclick=endAsWin; startRound(); };
$("winBtn").onclick=endAsWin;

// first visit shows the welcome; after that, straight to setup
if(!store.get("ss_seen",0)) show("welcome");
else if(!GOALS) openWeek();
else goHome();
renderTodayHome();

// offline support (only works when served over http/https)
if("serviceWorker" in navigator&&location.protocol!=="file:"){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
