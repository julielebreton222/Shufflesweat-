// Weekly goals: the daily log, crediting work, today's stats and the smart pick.

// weekly log, keyed by local date
const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
let LOG=store.get("ss_log",{});
(function(){const cut=ymd(new Date(Date.now()-35*864e5)); Object.keys(LOG).forEach(k=>{if(k<cut) delete LOG[k]});})();
function dayRec(k){ k=k||ymd(new Date()); return LOG[k]||(LOG[k]={vig:0,mob:0,sets:{push:0,pull:0,legs:0,core:0}}); }
const saveLog=()=>store.set("ss_log",LOG);
function weekDays(){ const n=new Date(); const dow=(n.getDay()+6)%7; return Array.from({length:7},(_,i)=>ymd(new Date(n.getFullYear(),n.getMonth(),n.getDate()-dow+i))); }
const setsOf=r=>r?Object.values(r.sets).reduce((a,b)=>a+b,0):0;
const STR_DAY=6, MOB_DAY=90;
function weekSummary(){
  const s={vig:0,strDays:0,mobDays:0,sets:{push:0,pull:0,legs:0,core:0}};
  weekDays().forEach(k=>{const r=LOG[k]; if(!r) return; s.vig+=r.vig; if(setsOf(r)>=STR_DAY) s.strDays++; if(r.mob>=MOB_DAY) s.mobDays++; Object.keys(s.sets).forEach(g=>s.sets[g]+=r.sets[g]||0);});
  s.vigMin=Math.round(s.vig/60); return s;
}
function credit(c,secs,finished){
  if(!c||c.choice||secs<=0&&!finished) return; const r=dayRec();
  const tp=c.wild?(c.wild==="hold"?(c.mobw?"mob":"hold"):"vig"):c.m;
  if(tp==="burn"||tp==="ath"||tp==="vig") r.vig+=secs;
  if(tp==="mob") r.mob+=secs;
  if(finished&&c.g) r.sets[c.g]++;
  saveLog();
  return tp;
}

// today
const todayKey=()=>ymd(new Date());
let today=store.get("ss_today",{});
if(today.d!==todayKey()) today={d:todayKey(),rounds:0,secs:0,prs:0};
today.prs=today.prs||0;
const saveToday=()=>store.set("ss_today",today);
function renderTodayHome(){
  $("todayHome").textContent = today.rounds ? `Today so far: ${today.rounds} round${today.rounds>1?"s":""}, ${Math.max(1,Math.round(today.secs/60))} work min.` : "Nothing yet today. Even the 5-minute option counts.";
}

// ---------- weekly goals ----------
const FOCUS={
 health:{n:"Health basics",d:"The WHO minimum",g:{vig:75,str:2,sets:4,mob:2}},
 fit:{n:"Get fitter",d:"More cardio and stamina",g:{vig:150,str:2,sets:6,mob:2}},
 strong:{n:"Get stronger",d:"Calisthenics strength",g:{vig:75,str:3,sets:10,mob:2}},
 muscle:{n:"Build muscle",d:"More hard sets",g:{vig:75,str:3,sets:14,mob:2}},
 flex:{n:"Flexibility",d:"Mobility most days",g:{vig:75,str:2,sets:6,mob:5}},
 athlete:{n:"All-round athlete",d:"Power, cardio and range",g:{vig:120,str:3,sets:10,mob:3}}
};
let GOALS=store.get("ss_goals",null);
const TARGETS=[
 {k:"vig",n:"Vigorous cardio",u:"min / week",step:15,min:0,max:300,why:"WHO: 75–150 min of vigorous activity a week. More than that brings extra benefit."},
 {k:"str",n:"Strength days",u:"days / week",step:1,min:0,max:6,why:"WHO: at least 2 days a week, all major muscle groups. Leave about 48 hours before hitting the same muscles hard again."},
 {k:"sets",n:"Hard sets per muscle group",u:"sets / week",step:2,min:0,max:20,why:"Research: around 10+ hard sets per muscle group a week builds muscle well. More still helps, by less each time."},
 {k:"mob",n:"Mobility days",u:"days / week",step:1,min:0,max:7,why:"ACSM: flexibility work 2–3 days a week. Daily is even better."}
];
const REG_NAMES={push:"Push",pull:"Pull",legs:"Legs",core:"Core"};
const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
let draft=null;
function renderWeekSetup(){
  renderPlanPick();
  draft=Object.assign({focus:"health"},FOCUS.health.g,GOALS||{});
  $("focusPick").innerHTML=Object.entries(FOCUS).map(([k,f])=>`<input type="radio" name="focus" id="f-${k}" value="${k}" ${draft.focus===k?"checked":""}><label for="f-${k}"><b>${f.n}</b><small>${f.d}</small></label>`).join("");
  $("focusPick").querySelectorAll("input").forEach(i=>i.onchange=()=>{draft=Object.assign({focus:i.value},FOCUS[i.value].g);renderTargets();});
  renderTargets();
}
function renderTargets(){
  $("targets").innerHTML=TARGETS.map(t=>`<div class="target"><b>${t.n}</b><div class="stepper"><button data-k="${t.k}" data-d="-1" aria-label="Less">−</button><output id="o-${t.k}">${draft[t.k]}<small>${t.u}</small></output><button data-k="${t.k}" data-d="1" aria-label="More">+</button></div><span class="why">${t.why}</span></div>`).join("");
  $("targets").querySelectorAll("button").forEach(b=>b.onclick=()=>{const t=TARGETS.find(x=>x.k===b.dataset.k); draft[t.k]=Math.max(t.min,Math.min(t.max,draft[t.k]+t.step*(+b.dataset.d))); $("o-"+t.k).innerHTML=`${draft[t.k]}<small>${t.u}</small>`;});
}
function openWeek(){ renderWeekSetup(); phase="week"; show("week"); }
function goalBar(label,val,goal,unit,c){ const p=goal?Math.min(100,val/goal*100):100; const met=val>=goal; return `<div class="goal ${met?"met":""}" style="--c:${c}"><div class="row"><span>${label}</span><span>${val} / ${goal}${unit}${met?" ✓":""}</span></div><div class="track"><i style="width:${p}%"></i></div></div>`; }
function renderWeekBars(target,dl){
  const s=weekSummary(); const dow=(new Date().getDay()+6)%7, left=7-dow;
  $(dl).textContent=`${DAYS[dow]} · ${left} day${left>1?"s":""} left`;
  $(target).innerHTML=`<div style="display:grid;gap:10px">${goalBar("Vigorous cardio",s.vigMin,GOALS.vig," min","var(--burn)")}${goalBar("Strength days",s.strDays,GOALS.str,"","var(--str)")}${goalBar("Mobility days",s.mobDays,GOALS.mob,"","var(--mob)")}<div class="regions">${Object.keys(REG_NAMES).map(g=>`<span class="${s.sets[g]>=GOALS.sets?"met":""}">${REG_NAMES[g]} ${s.sets[g]}/${GOALS.sets} sets</span>`).join("")}</div></div>`;
}
function weightedShuffle(pool){
  if(!GOALS) return shuffle(pool);
  const s=weekSummary();
  return pool.map(m=>({m,k:Math.random()*(m.g?Math.max(0,GOALS.sets-s.sets[m.g])+2:3)})).sort((a,b)=>b.k-a.k).map(x=>x.m);
}
function suggestion(){
  const s=weekSummary(); const n=new Date(); const dow=(n.getDay()+6)%7, left=7-dow;
  const t=dayRec(), y=dow>0?LOG[ymd(new Date(n.getFullYear(),n.getMonth(),n.getDate()-1))]:null;
  const strToday=setsOf(t)>=STR_DAY, strYest=setsOf(y)>=STR_DAY, mobToday=t.mob>=MOB_DAY;
  const need={vig:Math.max(0,GOALS.vig-s.vigMin),str:Math.max(0,GOALS.str-s.strDays),mob:Math.max(0,GOALS.mob-s.mobDays)};
  const strSlots=Math.max(1,Math.ceil((strYest?left-1:left)/2));
  const u={vig:need.vig/(left*10), str:strToday?0:need.str/strSlots*(strYest&&need.str<strSlots?0.4:1), mob:mobToday?0:need.mob/left};
  const order=Object.entries(u).sort((a,b)=>b[1]-a[1]);
  const dl=`${left} day${left>1?"s":""} left`;
  if(order[0][1]<=0) return {mode:"mob",mins:5,why:"Every goal for this week is done. Anything now is a bonus, so keep it easy and loosen up."};
  const top=order[0][0];
  let mode= top==="vig" ? (GOALS.focus==="athlete"?"ath":"burn") : top;
  const both=u.vig>=0.6&&u.str>=0.6;
  if(both) mode="mix";
  let mins=15, why;
  if(mode==="burn"||mode==="ath"||mode==="mix"){ const perDay=need.vig/left; mins= perDay>12?25:perDay>5?15:5; }
  if(mode==="str") mins= need.str>=strSlots?25:15;
  if(mode==="mob") mins= need.mob>=left?15:5;
  const weakest=Object.entries(s.sets).sort((a,b)=>a[1]-b[1])[0][0];
  if(mode==="str") why=`${need.str} more strength day${need.str>1?"s":""} to go, ${dl}. The deck leans toward ${REG_NAMES[weakest].toLowerCase()}, your lowest muscle group this week.`;
  else if(mode==="mob") why=`${need.mob} more mobility day${need.mob>1?"s":""} to go, ${dl}.`;
  else why=`${need.vig} vigorous minutes to go, ${dl}. That's about ${Math.ceil(need.vig/left)} a day.`;
  if(mode==="mix") why=`You're behind on cardio and strength, so a mix covers both. `+why;
  if(strYest&&mode!=="str"&&need.str>0&&!both) why+=" You did strength yesterday, so today rests those muscles.";
  return {mode,mins,why};
}
function renderHomeWeek(){
  renderPlan();
  $("weekPanel").hidden=!GOALS; if(!GOALS) return;
  renderWeekBars("weekBars","daysLeft");
  const sg=suggestion();
  $("sugTitle").textContent=`${sg.mins}-minute ${MODE_NAMES[sg.mode]}`; $("sugWhy").textContent=sg.why;
  $("sugBtn").textContent="Use this";
  $("sugBtn").onclick=()=>{ $("m-"+sg.mode).checked=true; $("t-"+sg.mins).checked=true; updateStartLabel(); $("sugBtn").textContent="Selected"; $("startBtn").scrollIntoView({behavior:"smooth",block:"center"}); };
}
function renderEndWeek(){ $("weekPanel2").hidden=!GOALS; if(GOALS) renderWeekBars("weekBars2","daysLeft2"); }
$("saveWeekBtn").onclick=()=>{ PLAN.type=draftPlan; savePlan(); GOALS=draft; store.set("ss_goals",GOALS); store.set("ss_seen",1); goHome(); };
$("editWeekBtn").onclick=openWeek;
