// The bottom menu (Today · Week · Me), the Week progress screen and the Me screen (name, measurements, Apple Health, settings).

const TABS=["home","progress","me"];
function showTab(id){
  if(id==="home") return goHome();
  phase=id; show(id);
  if(id==="progress") renderProgress();
  if(id==="me") renderMe();
}
document.querySelectorAll("#tabbar button").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
// Home, from the title or the Home button at the top. Mid-workout it asks first, so a stray tap never loses a session.
function headHome(){
  if(phase==="work"||phase==="rest"){
    const wasPaused=paused; pauseTimer(); clearTimeout(choiceTimer);
    sheet("Head home?","Stopping now still counts as a win today.",
      "End as a win and go home",()=>{ endAsWin(); goHome(); },
      "Keep going",()=>{ if(!wasPaused) resumeTimer(); });
    return;
  }
  if(phase==="end"){ try{wake&&wake.release()}catch(e){} }
  store.set("ss_seen",1); goHome();
}
$("homeBtn").onclick=headHome; $("brandBtn").onclick=headHome;
// show() calls this so the menu appears only on its own screens, never during a workout
function syncTabbar(id){
  const on=TABS.includes(id);
  $("tabbar").hidden=!on; document.body.classList.toggle("has-tabs",on);
  document.querySelectorAll("#tabbar button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===id?"page":"false"));
  $("homeBtn").setAttribute("aria-current",id==="home"?"page":"false");
}

// ---------- profile ----------
let PROFILE=Object.assign({name:"",units:"metric",height:""},store.get("ss_profile",{}));
let MEASURE=store.get("ss_measure",[]);
const saveProfile=()=>store.set("ss_profile",PROFILE);
function renderGreeting(){
  const g=$("greet"); g.hidden=!PROFILE.name;
  g.innerHTML=PROFILE.name?`Howdy, ${escapeHTML(PROFILE.name)} <span aria-hidden="true">✦</span>`:"";
}
const escapeHTML=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// ---------- Week tab ----------
function renderProgress(){
  const days=weekDays(), n=new Date(), dow=(n.getDay()+6)%7, left=7-dow, tk=todayKey();
  const active=days.filter(k=>{const r=LOG[k]; return r&&(r.vig>0||r.mob>0||setsOf(r)>0);}).length;
  $("progDays").textContent=`${DAYS[dow]} · ${left} day${left>1?"s":""} left · you trained on ${active} day${active===1?"":"s"} so far`;
  $("progStrip").innerHTML=days.map((k,i)=>{
    const r=LOG[k], did=r&&(r.vig>0||r.mob>0||setsOf(r)>0);
    const cls=[did?"did":"",k===tk?"now":"",k>tk?"later":""].join(" ");
    const mins=r?Math.round((r.vig+r.mob)/60):0;
    return `<div class="sday ${cls}"><b>${DAYS[i][0]}</b><span>${did?(mins?mins+"m":"✓"):""}</span><small class="sr">${DAYS[i]}: ${did?"trained":k>tk?"coming up":"no workout"}</small></div>`;
  }).join("");
  const p=PLANS[PLAN.type];
  $("progPlan").hidden=!p;
  if(p){
    const all=p.weeks[0].days, done=planDoneThisWeek();
    $("progPlanTitle").textContent=`${p.name} · Week 1`;
    $("progPlanCount").textContent=`${done.length} of ${all.length} done`;
    planDaysInto($("progPlanDays"),renderProgress);
  }
  $("progGoals").hidden=false;
  if(GOALS) renderWeekBars("progBars","progDays2");
  else $("progBars").innerHTML=`<p class="note">No weekly goals yet.</p>`;
  $("progPlanPick").innerHTML=Object.entries(PLAN_TYPES).map(([k,t])=>`<input type="radio" name="ptype" id="pt-${k}" value="${k}" ${PLAN.type===k?"checked":""}><label for="pt-${k}"><b>${t.name}</b><small>${t.about}</small></label>`).join("");
  $("progPlanPick").querySelectorAll("input").forEach(i=>i.onchange=()=>{ PLAN.type=i.value; savePlan(); renderProgress(); });
}
$("progEditGoals").onclick=openWeek;

// ---------- Me tab ----------
const MFIELDS=[["mWeight","weight"],["mWaist","waist"],["mHips","hips"],["mChest","chest"],["mThigh","thigh"]];
function unitLabels(){
  const m=PROFILE.units!=="imperial";
  document.querySelectorAll(".unit-h").forEach(e=>e.textContent=m?"cm":"in");
  document.querySelectorAll(".unit-w").forEach(e=>e.textContent=m?"kg":"lb");
}
function renderMe(){
  $("meName").value=PROFILE.name||"";
  $("u-"+(PROFILE.units==="imperial"?"imperial":"metric")).checked=true;
  $("mHeight").value=PROFILE.height||"";
  const last=MEASURE[MEASURE.length-1]||{};
  MFIELDS.forEach(([id,k])=>$(id).value=last[k]??"");
  $("mSaved").textContent="";
  unitLabels(); renderHistory(); syncToggles();
}
function renderHistory(){
  if(!MEASURE.length){ $("mHistory").innerHTML=""; return; }
  const first=MEASURE[0], u=PROFILE.units!=="imperial"?{h:"cm",w:"kg"}:{h:"in",w:"lb"};
  const diff=(k,e)=>first[k]!=null&&e[k]!=null&&e!==first?` <em>${e[k]-first[k]>0?"+":""}${+(e[k]-first[k]).toFixed(1)}</em>`:"";
  $("mHistory").innerHTML=`<div class="label">History</div>`+MEASURE.slice(-8).reverse().map(e=>
    `<div class="hrow"><b>${new Date(e.d+"T12:00").toLocaleDateString(undefined,{day:"numeric",month:"short"})}</b><span>${
      MFIELDS.filter(([,k])=>e[k]!=null).map(([,k])=>`${k[0].toUpperCase()+k.slice(1)} ${e[k]}${k==="weight"?u.w:u.h}${diff(k,e)}`).join(" · ")}</span></div>`).join("");
}
$("meName").oninput=e=>{ PROFILE.name=e.target.value.trim(); saveProfile(); renderGreeting(); };
document.querySelectorAll('input[name="units"]').forEach(i=>i.onchange=()=>{ PROFILE.units=i.value; saveProfile(); unitLabels(); renderHistory(); });
$("mHeight").onchange=e=>{ PROFILE.height=e.target.value; saveProfile(); };
$("mSave").onclick=()=>{
  const e={d:todayKey()}; let any=false;
  MFIELDS.forEach(([id,k])=>{ const v=parseFloat($(id).value); if(!isNaN(v)&&v>0){ e[k]=v; any=true; } });
  if(!any){ $("mSaved").textContent="Type at least one number first."; return; }
  MEASURE=MEASURE.filter(x=>x.d!==e.d); MEASURE.push(e); MEASURE.sort((a,b)=>a.d<b.d?-1:1);
  store.set("ss_measure",MEASURE); $("mSaved").textContent="Saved for today. Yeehaw!"; renderHistory();
};
// settings mirror the header chips
function syncToggles(){ $("meSound").setAttribute("aria-pressed",soundOn); $("meVoice").setAttribute("aria-pressed",voiceOn); }
$("meSound").onclick=()=>{ $("soundBtn").click(); syncToggles(); };
$("meVoice").onclick=()=>{ $("voiceBtn").click(); syncToggles(); };
$("meHelp").onclick=()=>$("helpBtn").click();
$("meGoals").onclick=openWeek;
// Start from scratch: delete everything this app saved on the phone, then reopen at the welcome screen.
$("meReset").onclick=()=>sheet("Start from scratch?",
  "This deletes everything saved on this phone: your goals, workout history, records, Zero checkmarks, name and measurements. It can't be undone.",
  "Keep my data",()=>{},
  "Delete everything and start over",()=>{
    try{ Object.keys(localStorage).filter(k=>k.startsWith("ss_")).forEach(k=>localStorage.removeItem(k)); }catch(e){}
    location.reload();
  });
renderGreeting();
