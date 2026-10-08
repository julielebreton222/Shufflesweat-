// Set weekly plans. "shuffle" is the default goals-based mode; anything else here is a fixed 7-day plan.
// Exercise fields: n name, m type (burn/str/ath/mob, for the weekly log), g muscle group, c cue (our own words),
// sets, reps OR dur (seconds of work), side 1 = reps or time are per side (timed cards beep "switch sides" at halfway),
// rest = seconds of rest after each set.
// A day with ex:null hasn't been added yet; rest:true is a rest day.
// A day with rounds:N is a circuit: every exercise once (one set each) per round, N rounds.
const REP_REST=45;   // rest between rep sets when the plan doesn't say
const PLANS={
 zero:{
  name:"Zero",
  about:"A set 7-day plan: full body, lower body, upper body and core, HIIT and rest days.",
  weeks:[{days:[
   {name:"Full Body",mins:50,ex:[
    {n:"Forward and back ladder touchdowns",m:"ath",g:"legs",sets:4,dur:30,rest:60,c:"Quick feet forward and back as if over a ladder, then drop low and touch the floor. Light and fast."},
    {n:"Low to high woodchoppers",m:"str",g:"core",sets:4,reps:10,side:1,c:"Reach down by one knee, then sweep up and across past the other shoulder. Pivot your feet so your knees follow your toes."},
    {n:"Alternating reverse lunge with rotation",m:"str",g:"legs",sets:3,reps:12,c:"12 total, 6 per side. Step back into a lunge and turn your chest over the front leg. Keep your weight in the front foot."},
    {n:"Alternating down dog to knee drive",m:"str",g:"core",sets:3,reps:12,c:"12 total, 6 per side. From down dog, drive one knee hard toward your chest, back to down dog, switch. Brace your core."},
    {n:"Plank shoulder tap to sit back",m:"str",g:"core",sets:3,reps:12,c:"In a plank, tap each shoulder, then push your hips back toward your heels and return. Core tight, push through the legs."},
    {n:"Single leg bent over Ts",m:"str",g:"pull",sets:3,reps:8,side:1,c:"Hinge forward on one leg and open your arms wide like a T. Squeeze your shoulder blades. Hold a chair or wall for balance if you need it."},
    {n:"Single leg body saw crunch",m:"str",g:"core",sets:3,dur:40,side:1,rest:60,c:"Forearm plank with one foot lifted. Rock forward and back, then pull the knee in. 20 seconds each side, switch at the beep."},
    {n:"Squat to calf raise",m:"ath",g:"legs",sets:3,dur:30,rest:40,c:"Sit into a squat, then stand and rise onto your toes. Knees track over your toes the whole time."},
    {n:"Super clamshells",m:"str",g:"legs",sets:3,reps:10,side:1,c:"Lie on your side, knees bent. Lift the top knee and press out through the bottom glute."},
    {n:"Crab hip thrust reach",m:"str",g:"legs",sets:4,reps:10,c:"From a crab position, drive your hips up and reach one arm over. Keep a soft bend in the arm on the floor."},
    {n:"Assisted transfer push-ups",m:"str",g:"push",sets:3,dur:30,rest:60,c:"Do a push-up, walk your hands sideways, push up again. Drop to your knees to make it easier."}
   ]},
   {name:"Lower Body",mins:50,ex:[
    {n:"Side shuffle",m:"ath",g:"legs",sets:4,dur:30,rest:30,c:"Stay low in a half squat and shuffle side to side. Quick, light feet."},
    {n:"Side lunge transfers",m:"str",g:"legs",sets:4,reps:16,c:"Each shift from one side to the other is one rep. Step out wide enough to sit deep into each side lunge."},
    {n:"Crab hip thrust",m:"str",g:"legs",sets:3,reps:10,c:"Hands behind you, feet flat. Squeeze your glutes to lift your hips high at the top."},
    {n:"Crab hip thrust single leg",m:"str",g:"legs",sets:3,reps:8,side:1,c:"Same crab position with one leg lifted. Keep your glutes working so the hips stay high."},
    {n:"Alternating jumping lunges",m:"burn",g:"legs",sets:3,dur:30,rest:30,c:"Jump and switch legs in the air, land softly in a lunge. Swap to alternating reverse lunges if you'd rather not jump."},
    {n:"Alternating open leg lunges",m:"str",g:"legs",sets:3,reps:16,c:"16 total, 8 per side. Lunge with the back leg turned out and only the toes down, so the front leg does the work."},
    {n:"Glute bridge to calf raise",m:"str",g:"legs",sets:3,reps:8,c:"Lift into a high glute bridge, rise onto your toes, lower your heels, then your hips. Squeeze the glutes every rep."},
    {n:"Side plank clamshells",m:"str",g:"legs",sets:3,reps:8,side:1,c:"Side plank on your elbow with knees bent. Open the top knee. Keep your hips high by squeezing the bottom glute."},
    {n:"Squat tap backs",m:"str",g:"legs",sets:3,reps:16,c:"16 total, 8 per side. Squat, then tap one foot back as you rise. Brace your core and stay steady."},
    {n:"Straight leg calf jumps",m:"ath",g:"legs",sets:3,dur:30,rest:30,c:"Small quick jumps with only a little bend in the knees. Push off from your calves and ankles."},
    {n:"Calf raises",m:"str",g:"legs",sets:3,reps:12,c:"Rise all the way up, lower slowly. For more challenge, do one leg at a time with a hand on the wall."}
   ]},
   {name:"Upper Body + Core",mins:50,ex:[
    {n:"Elbow plank walk outs",m:"str",g:"core",sets:3,reps:6,c:"6 full walk outs. Walk your hands out to an elbow plank and back, keeping your core tight the whole way."},
    {n:"Prisoner hip hinges",m:"str",g:"legs",sets:4,reps:12,c:"Hands behind your head. Push your hips back with a flat back and a soft bend in the knees, then stand tall."},
    {n:"Plank hold shoulder taps",m:"str",g:"core",sets:3,dur:30,rest:30,c:"Hold a plank and tap opposite shoulders. Feet wide helps. Don't let your hips rock side to side."},
    {n:"Elbow plank to dolphin",m:"str",g:"push",sets:3,reps:10,c:"From an elbow plank, push your hips up into dolphin, then lower back to plank. Press the floor away."},
    {n:"Bird dog crunches",m:"str",g:"core",sets:4,reps:8,side:1,c:"On all fours, reach one arm forward and the opposite leg back, then pull elbow and knee together under you."},
    {n:"Assisted commandos",m:"str",g:"push",sets:3,dur:30,rest:30,c:"On your knees, go from elbows up to hands and back down, one arm at a time. Keep your hips steady."},
    {n:"Single leg body saw crunch",m:"str",g:"core",sets:3,dur:40,side:1,rest:60,c:"Forearm plank with one foot lifted. Rock forward and back, then pull the knee in. 20 seconds each side, switch at the beep."},
    {n:"Front down swimmers",m:"str",g:"pull",sets:3,dur:20,rest:40,c:"Face down, chest and legs lifted. Sweep your arms from overhead to your hips and back. Back, glutes and hamstrings stay on."},
    {n:"Plank to down dog",m:"str",g:"push",sets:4,reps:10,c:"From a plank, push your hips up and back into down dog. Keep your legs straight and open up the shoulders."},
    {n:"Elbow side plank dips",m:"str",g:"core",sets:3,reps:12,side:1,c:"Side plank on your elbow. Dip the hips toward the floor and lift back up, hips pushed forward. Knees down is fine."},
    {n:"Back and forth bear crawls",m:"ath",g:"core",sets:3,dur:30,rest:40,c:"Knees an inch off the floor, crawl forward and back. Keep your bum as low as you can."},
    {n:"Russian bicycle twists",m:"str",g:"core",sets:3,dur:30,rest:30,c:"Lean back with feet up, twist and bring the opposite elbow to knee. Feet down to make it easier."}
   ]},
   {rest:true},
   {name:"Full Body",mins:50,ex:[
    {n:"Side shuffle to explosive squat",m:"burn",g:"legs",sets:4,dur:30,rest:60,c:"Shuffle a few steps to the side, drop into a squat and jump up hard. Go the other way."},
    {n:"Alternating open leg lunges",m:"str",g:"legs",sets:3,reps:16,c:"16 total, 8 per side. Lunge with the back leg turned out and only the toes down, so the front leg does the work."},
    {n:"Spider lunges",m:"ath",g:"legs",sets:4,dur:30,rest:60,c:"From a plank, step one foot up outside your hand, then back. Alternate sides and keep your hips low."},
    {n:"Plank walk in to pike",m:"str",g:"core",sets:3,reps:6,c:"From a plank, walk your feet in toward your hands into a pike and back out. Weight over your shoulders, knees can bend a little."},
    {n:"Back and forth bear crawls",m:"ath",g:"core",sets:4,dur:30,rest:30,c:"Knees an inch off the floor, crawl forward and back. Keep your bum as low as you can."},
    {n:"Bird dog",m:"str",g:"core",sets:3,reps:12,c:"12 total, 6 per side. On all fours, reach one arm forward and the opposite leg back. Hold your body still."},
    {n:"Side lunge transfers",m:"str",g:"legs",sets:3,dur:30,rest:60,c:"Shift from one side lunge to the other. Step out wide enough to sit deep into each side."},
    {n:"Glute bridge to calf raise",m:"str",g:"legs",sets:4,reps:12,c:"Lift into a high glute bridge, rise onto your toes, lower your heels, then your hips. Squeeze the glutes every rep."},
    {n:"Chameleon sit backs",m:"str",g:"core",sets:4,reps:12,c:"From a low crawl position, sit your hips back toward your heels and come forward again. Core on, push through the legs."},
    {n:"Front down swimmers",m:"str",g:"pull",sets:3,dur:30,rest:30,c:"Face down, chest and legs lifted. Sweep your arms from overhead to your hips and back. Back, glutes and hamstrings stay on."},
    {n:"Knee corkscrew",m:"str",g:"core",sets:3,reps:12,c:"12 total, 6 per side. Lying on your back, knees up, circle and twist your knees to one side, then the other."},
    {n:"Russian bicycle twists",m:"str",g:"core",sets:3,dur:30,rest:60,c:"Lean back with feet up, twist and bring the opposite elbow to knee. Feet down to make it easier."}
   ]},
   {name:"HIIT",mins:15,rounds:3,ex:[
    {n:"Rocket launches",m:"burn",g:"legs",sets:1,dur:30,rest:30,c:"Sink into a squat, then explode up and reach high like you're launching off the floor. Land soft."},
    {n:"Chameleon sit backs with alternating knee tap",m:"burn",g:"core",sets:1,dur:30,rest:30,c:"From a low crawl, sit your hips back, come forward and tap one knee in, then the other. Core on, push through the legs."},
    {n:"Invisible ball slams",m:"burn",g:"core",sets:1,dur:30,rest:30,c:"Reach tall with an imaginary ball, then slam it down hard as you drop into a squat. Super explosive."},
    {n:"Crab marches",m:"burn",g:"legs",sets:1,dur:30,rest:30,c:"In a crab position with hips high, march one foot up, then the other. Don't let the hips sag."},
    {n:"Alternating knee strikes",m:"burn",g:"core",sets:1,dur:30,rest:30,c:"Stand tall, reach your arms up, then pull your hands down as you drive one knee up. Switch quickly."}
   ]},
   {rest:true}
  ]}]
 }
};
const PLAN_TYPES={shuffle:{name:"Shuffle Sweat",about:"Your own goals. The app picks a fresh deck each day."},zero:PLANS.zero};
let PLAN=Object.assign({type:"shuffle",done:{}},store.get("ss_plan",{}));
const savePlan=()=>store.set("ss_plan",PLAN);
const planWeekKey=()=>weekDays()[0];
const planDoneThisWeek=()=>PLAN.done[planWeekKey()]||[];
function markPlanDay(i,on){
  const k=planWeekKey(), d=new Set(PLAN.done[k]||[]); on===false?d.delete(i):d.add(i);
  PLAN.done={[k]:[...d]};            // only the current week matters
  savePlan();
}
// The cards for one exercise: one card per set, shaped like a MOVES entry so the card engine can play it.
function planCards(ex,dayName){
  return Array.from({length:ex.sets},(_,i)=>({m:ex.m,g:ex.g,n:[ex.n,ex.n,ex.n],r:ex.reps?[ex.reps,ex.reps,ex.reps]:undefined,
    s:ex.side||0,c:ex.c,dur:ex.dur,rest:ex.rest||(ex.reps?REP_REST:30),lvl:0,fixed:1,setNo:i+1,sets:ex.sets,plan:dayName}));
}

// ---------- week type menu (Your week screen) ----------
let draftPlan=PLAN.type;
function renderPlanPick(){
  draftPlan=PLAN.type;
  $("planPick").innerHTML=Object.entries(PLAN_TYPES).map(([k,p])=>`<input type="radio" name="plan" id="p-${k}" value="${k}" ${draftPlan===k?"checked":""}><label for="p-${k}"><b>${p.name}</b><small>${p.about}</small></label>`).join("");
  $("planPick").querySelectorAll("input").forEach(i=>i.onchange=()=>{draftPlan=i.value;});
}

// ---------- the plan's week on the home screen ----------
const CHECK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4 8-9"/></svg>';
const CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
// The plan's days as tappable rows, into any container (Today and the Week tab both use it).
function planDaysInto(el,after){
  const p=PLANS[PLAN.type]; if(!p) return;
  const done=planDoneThisWeek(), days=p.weeks[0].days;
  el.innerHTML=days.map((d,i)=>{
    const isDone=done.includes(i), title=d.rest?"Rest Day":d.name;
    const sub=d.rest?(isDone?"Rested. Nice.":"Tap when you've rested"):!d.ex?"Not added yet":d.rounds?`${d.mins} minutes · ${d.ex.length} moves × ${d.rounds} rounds`:`${d.mins} minutes · ${d.ex.length} exercises`;
    const icon=isDone?`<span class="tick">${CHECK}</span>`:d.ex?`<span class="go">${CHEV}</span>`:"";
    return `<button class="planday ${isDone?"done":""}" data-i="${i}" ${!d.rest&&!d.ex?"disabled":""}><span><b>Day ${i+1}: ${title}</b><small>${sub}</small></span>${icon}</button>`;
  }).join("");
  el.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i, d=days[i];
    if(d.rest){ markPlanDay(i,!planDoneThisWeek().includes(i)); after&&after(); return; }
    startPlanDay(i);
  });
}
function renderPlan(){
  const p=PLANS[PLAN.type], on=!!p;
  $("planPanel").hidden=!on; $("shuffleHead").hidden=!on; $("suggest").hidden=on;
  if(!on) return;
  $("planTitle").textContent=`${p.name} · Week 1`;
  planDaysInto($("planDays"),renderPlan);
}
function startPlanDay(i){
  const d=PLANS[PLAN.type].weeks[0].days[i];
  planRun={i,name:d.name,ex:d.ex,rounds:d.rounds||0}; mode="plan"; mins=d.mins; totalRounds=d.rounds||d.ex.length;
  round=0; used.clear(); beep(0.0001,.01); startRound();
}
// One round of a circuit day: every exercise once, labelled with the round number.
function circuitCards(run,r){
  return run.ex.map(ex=>({...planCards({...ex,sets:1},run.name)[0],setNo:r,sets:run.rounds,circuit:1}));
}
