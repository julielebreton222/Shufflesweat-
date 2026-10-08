// ---------- stick-figure pictures ----------
// Side-view stick figure facing right. Angles in degrees.
// t: torso, 0 = straight up, +90 = pointing right (forward). Limb angles: 0 = straight down, +90 = forward (right), 180 = up, -90 = back.
// ua/fa near arm (upper/fore), ua2/fa2 far arm; th/sh near leg (thigh/shin), th2/sh2 far leg.
const P={
 stand:{hx:100,hy:66,t:0,ua:5,fa:5,ua2:-5,fa2:-5,th:3,sh:3,th2:-3,sh2:-3},
 armsUp:{hx:100,hy:66,t:0,ua:175,fa:175,ua2:185,fa2:185,th:3,sh:3,th2:-3,sh2:-3},
 tiptoe:{hx:100,hy:61,t:0,ua:5,fa:5,ua2:-5,fa2:-5,th:3,sh:3,th2:-3,sh2:-3},
 squat:{hx:92,hy:89,t:38,ua:90,fa:90,ua2:85,fa2:85,th:88,sh:-14,th2:84,sh2:-16},
 deepSquat:{hx:94,hy:96,t:20,ua:75,fa:100,ua2:70,fa2:95,th:112,sh:-18,th2:108,sh2:-20},
 jump:{hx:100,hy:56,t:0,ua:165,fa:165,ua2:175,fa2:175,th:5,sh:-5,th2:-5,sh2:-12},
 tuck:{hx:100,hy:54,t:8,ua:70,fa:120,ua2:65,fa2:115,th:125,sh:-5,th2:120,sh2:-10},
 lunge:{hx:96,hy:84,t:0,ua:5,fa:5,ua2:-5,fa2:-5,th:82,sh:-4,th2:-28,sh2:-100},
 lungeUp:{hx:100,hy:66,t:0,ua:5,fa:5,ua2:-5,fa2:-5,th:3,sh:3,th2:-20,sh2:-25},
 kneeDrive:{hx:100,hy:66,t:0,ua:-40,fa:20,ua2:60,fa2:140,th:3,sh:3,th2:95,sh2:5},
 highKnee:{hx:100,hy:64,t:5,ua:60,fa:140,ua2:-40,fa2:20,th:95,sh:5,th2:-5,sh2:-15},
 highKnee2:{hx:100,hy:64,t:5,ua:-40,fa:20,ua2:60,fa2:140,th:-5,sh:-15,th2:95,sh2:5},
 plank:{hx:80,hy:81,t:80,ua:2,fa:2,ua2:-2,fa2:-2,th:-56,sh:-56,th2:-58,sh2:-58},
 plankLean:{hx:88,hy:82,t:80,ua:-22,fa:-22,ua2:-24,fa2:-24,th:-58,sh:-58,th2:-60,sh2:-60},
 pushDown:{hx:80,hy:101,t:87,ua:-125,fa:5,ua2:-128,fa2:3,th:-80,sh:-80,th2:-81,sh2:-81},
 climb:{hx:84,hy:80,t:80,ua:2,fa:2,ua2:-2,fa2:-2,th:40,sh:-60,th2:-58,sh2:-58},
 climb2:{hx:84,hy:80,t:80,ua:2,fa:2,ua2:-2,fa2:-2,th:-58,sh:-58,th2:40,sh2:-60},
 pike:{hx:88,hy:66,t:135,ua:60,fa:60,ua2:58,fa2:58,th:-20,sh:-20,th2:-22,sh2:-22},
 pikeDown:{hx:84,hy:62,t:155,ua:110,fa:5,ua2:108,fa2:3,th:-18,sh:-18,th2:-20,sh2:-20},
 dipUp:{hx:92,hy:78,t:2,ua:-12,fa:-12,ua2:-14,fa2:-14,th:88,sh:2,th2:86,sh2:0},
 dipDown:{hx:94,hy:88,t:5,ua:-70,fa:5,ua2:-72,fa2:3,th:70,sh:50,th2:68,sh2:48},
 bridgeDown:{hx:96,hy:104,t:-96,ua:-92,fa:-92,ua2:-90,fa2:-90,th:128,sh:-8,th2:126,sh2:-10},
 bridgeUp:{hx:98,hy:88,t:-112,ua:-80,fa:-90,ua2:-78,fa2:-88,th:150,sh:-4,th2:148,sh2:-6},
 fullBridge:{hx:100,hy:70,t:-125,ua:-50,fa:-50,ua2:-48,fa2:-48,th:20,sh:-10,th2:18,sh2:-12},
 hollow:{hx:100,hy:104,t:-80,ua:-100,fa:-100,ua2:-98,fa2:-98,th:102,sh:102,th2:100,sh2:100},
 hollowTuck:{hx:100,hy:104,t:-70,ua:150,fa:150,ua2:148,fa2:148,th:150,sh:50,th2:148,sh2:48},
 vup:{hx:100,hy:106,t:45,ua:130,fa:130,ua2:128,fa2:128,th:135,sh:135,th2:133,sh2:133},
 sit:{hx:96,hy:106,t:0,ua:-10,fa:-10,ua2:-12,fa2:-12,th:90,sh:90,th2:88,sh2:88},
 lsit:{hx:96,hy:96,t:0,ua:-2,fa:-2,ua2:-4,fa2:-4,th:95,sh:95,th2:93,sh2:93},
 sitFold:{hx:88,hy:106,t:70,ua:90,fa:90,ua2:88,fa2:88,th:90,sh:90,th2:88,sh2:88},
 pikeLift:{hx:88,hy:106,t:10,ua:-5,fa:20,ua2:-7,fa2:18,th:95,sh:95,th2:90,sh2:90},
 prone:{hx:100,hy:105,t:90,ua:90,fa:90,ua2:92,fa2:92,th:-90,sh:-90,th2:-92,sh2:-92},
 superman:{hx:100,hy:105,t:80,ua:105,fa:105,ua2:107,fa2:107,th:-80,sh:-80,th2:-82,sh2:-82},
 supermanPull:{hx:100,hy:105,t:80,ua:-20,fa:110,ua2:-22,fa2:108,th:-80,sh:-80,th2:-82,sh2:-82},
 hinge:{hx:96,hy:66,t:88,ua:0,fa:0,ua2:-2,fa2:-2,th:3,sh:3,th2:-3,sh2:-3},
 slDeadlift:{hx:96,hy:66,t:88,ua:0,fa:0,ua2:-2,fa2:-2,th:3,sh:3,th2:-88,sh2:-88},
 rollDown:{hx:98,hy:66,t:140,ua:90,fa:0,ua2:88,fa2:-2,th:3,sh:3,th2:-3,sh2:-3},
 rowOut:{hx:92,hy:76,t:-28,ua:95,fa:95,ua2:93,fa2:93,th:32,sh:22,th2:30,sh2:20},
 rowIn:{hx:100,hy:70,t:-14,ua:-25,fa:100,ua2:-27,fa2:98,th:28,sh:14,th2:26,sh2:12},
 wallSit:{hx:90,hy:88,t:0,ua:5,fa:5,ua2:-5,fa2:-5,th:90,sh:0,th2:88,sh2:-2},
 wallSitUp:{hx:90,hy:88,t:0,ua:178,fa:178,ua2:182,fa2:182,th:90,sh:0,th2:88,sh2:-2},
 quad:{hx:82,hy:75,t:88,ua:2,fa:2,ua2:-2,fa2:-2,th:2,sh:-90,th2:-2,sh2:-90},
 bear:{hx:84,hy:82,t:84,ua:2,fa:2,ua2:-2,fa2:-2,th:30,sh:-62,th2:28,sh2:-64},
 bearTap:{hx:84,hy:82,t:84,ua:2,fa:2,ua2:60,fa2:110,th:30,sh:-62,th2:28,sh2:-64},
 frogBack:{hx:72,hy:90,t:70,ua:30,fa:30,ua2:28,fa2:28,th:60,sh:-80,th2:58,sh2:-82},
 kneel:{hx:92,hy:86,t:0,ua:175,fa:175,ua2:185,fa2:185,th:88,sh:0,th2:-8,sh2:-100},
 kneelLean:{hx:96,hy:88,t:-8,ua:170,fa:165,ua2:180,fa2:175,th:80,sh:-4,th2:-20,sh2:-110},
 wgs:{hx:92,hy:84,t:55,ua:180,fa:180,ua2:5,fa2:5,th:80,sh:-4,th2:-30,sh2:-60},
 legRaise:{hx:100,hy:66,t:-3,ua:-90,fa:-90,ua2:-5,fa2:-5,th:3,sh:3,th2:80,sh2:80},
 cossack:{hx:88,hy:90,t:25,ua:80,fa:80,ua2:78,fa2:78,th:100,sh:-25,th2:-55,sh2:-55},
 skater:{hx:100,hy:70,t:35,ua:100,fa:100,ua2:-60,fa2:-60,th:10,sh:-5,th2:-55,sh2:-30},
 sideLand:{hx:100,hy:74,t:30,ua:-40,fa:-40,ua2:80,fa2:80,th:15,sh:-8,th2:-40,sh2:-60},
 sidePlank:{hx:90,hy:88,t:70,ua:2,fa:-60,ua2:180,fa2:180,th:-70,sh:-70,th2:-68,sh2:-68},
 sidePlankDip:{hx:90,hy:98,t:76,ua:2,fa:-60,ua2:180,fa2:180,th:-78,sh:-78,th2:-76,sh2:-76},
 sprawl:{hx:80,hy:100,t:84,ua:-30,fa:0,ua2:-32,fa2:-2,th:-82,sh:-82,th2:-84,sh2:-84},
 broad:{hx:110,hy:58,t:30,ua:120,fa:120,ua2:115,fa2:115,th:-30,sh:-40,th2:-35,sh2:-45},
 punch:{hx:100,hy:68,t:5,ua:90,fa:90,ua2:30,fa2:150,th:10,sh:5,th2:-12,sh2:-8}
};
// move (Build name or wildcard keyword) -> pose loop
const FIG={
 "Step-back burpees":["stand","squat","plank","squat","jump"],
 "Squat pulses":["stand","squat","jump","squat"],
 "Fast reverse lunges":["lungeUp","lunge"],
 "Mountain climbers":["climb","climb2"],
 "High knees":["highKnee","highKnee2"],
 "Jumping jacks":["stand","jump"],
 "Step-out plank jacks":["plank","plankLean"],
 "Skaters":["skater","sideLand"],
 "Squat thrusts":["stand","squat","sprawl","squat"],
 "Up-down planks on knees":["plank","pushDown"],
 "Speed squats":["stand","squat"],
 "Fast feet":["tiptoe","stand","sprawl","stand"],
 "Knee push-ups":["plank","pushDown"],
 "Pike push-ups":["pike","pikeDown"],
 "Bent-knee chair dips":["dipUp","dipDown"],
 "Split squats":["lungeUp","lunge"],
 "Assisted pistols":["stand","squat"],
 "Single-leg glute bridges":["bridgeDown","bridgeUp"],
 "Prone Y-raises":["prone","superman"],
 "Towel door rows":["rowOut","rowIn"],
 "Prone reverse snow angels":["superman","supermanPull"],
 "Tuck-ups":["hollow","vup"],
 "Downdog to cobra":["pike","pushDown","superman"],
 "Single-leg calf raises":["stand","tiptoe"],
 "Tuck hollow hold":["hollowTuck","hollow"],
 "Plank shoulder taps":["bear","bearTap"],
 "Plank lean":["plank","plankLean"],
 "Seated leg lifts":["sit","lsit"],
 "Side plank":["sidePlank","sidePlankDip"],
 "Wall sit":["wallSit","wallSitUp"],
 "Squat to calf raise":["squat","broad","stand"],
 "Lateral step and stick":["skater","sideLand"],
 "Pogo hops":["stand","jump","tuck"],
 "Single-leg deadlift (hold wall)":["stand","slDeadlift"],
 "Beast hold reaches":["bear","bearTap"],
 "Incline plyo push-ups":["plank","pushDown"],
 "Reverse lunge to knee drive":["lunge","kneeDrive"],
 "Sprint and drop":["highKnee","highKnee2","sprawl"],
 "Shuffle and touch":["stand","squat","punch"],
 "Skater holds":["skater","sideLand"],
 "Short Copenhagen plank":["sidePlank","sidePlankDip"],
 "Supported Cossack squats":["stand","cossack"],
 "Deep squat hold (hold door)":["deepSquat","squat"],
 "Standing roll-downs":["stand","rollDown"],
 "Straddle reach":["sit","sitFold"],
 "Bent-knee leg lifts":["sit","pikeLift"],
 "90/90 switches (hands back)":["sit","kneel"],
 "World's greatest stretch":["lunge","wgs"],
 "Half-kneeling hip flexor squeeze":["kneel","kneelLean"],
 "Glute bridge hold":["bridgeDown","bridgeUp","fullBridge"],
 "Prone Y-T raises":["prone","superman","supermanPull"],
 "Standing leg raises (hold wall)":["stand","legRaise"],
 "Frog rocks":["quad","frogBack"]
};
const WILD_FIG=[[/burpee|tabata|chorus|song/i,["stand","squat","plank","squat","jump"]],[/push-up|counter/i,["plank","pushDown"]],[/jump squat|t-rex/i,["squat","jump"]],[/plank jack/i,["plank","plankLean"]],[/high knee|sprint|chase|stair/i,["highKnee","highKnee2"]],[/hollow/i,["hollowTuck","hollow"]],[/wall sit/i,["wallSit","wallSitUp"]],[/deep squat/i,["deepSquat","squat"]],[/lava|bound/i,["skater","sideLand"]],[/cossack/i,["stand","cossack"]],[/pistol|doorframe/i,["stand","squat"]]];


const FL={torso:34,neck:12,ua:18,fa:17,th:22,sh:22}, RAD=Math.PI/180;
function figPts(p){
  const g=a=>[Math.sin(a*RAD),Math.cos(a*RAD)];
  const H=[p.hx,p.hy], S=[H[0]+FL.torso*Math.sin(p.t*RAD),H[1]-FL.torso*Math.cos(p.t*RAD)];
  const Hd=[S[0]+FL.neck*Math.sin(p.t*RAD),S[1]-FL.neck*Math.cos(p.t*RAD)];
  const limb=(o,a1,a2,l1,l2)=>{const d1=g(a1),d2=g(a2),m=[o[0]+l1*d1[0],o[1]+l1*d1[1]];return [o,m,[m[0]+l2*d2[0],m[1]+l2*d2[1]]]};
  return {H,S,Hd,arm:limb(S,p.ua,p.fa,FL.ua,FL.fa),arm2:limb(S,p.ua2,p.fa2,FL.ua,FL.fa),leg:limb(H,p.th,p.sh,FL.th,FL.sh),leg2:limb(H,p.th2,p.sh2,FL.th,FL.sh)};
}
const KEYS=["hx","hy","t","ua","fa","ua2","fa2","th","sh","th2","sh2"];
const full=p=>{const o={};KEYS.forEach(k=>o[k]=p[k]??p[k.replace("2","")]);return o};
const POSE={}; Object.keys(P).forEach(k=>POSE[k]=full(P[k]));
const ptsStr=a=>a.map(q=>q[0].toFixed(1)+","+q[1].toFixed(1)).join(" ");
function drawPose(p){
  const q=figPts(p);
  $("body").setAttribute("points",ptsStr([q.H,q.S]));
  $("nearArm").setAttribute("points",ptsStr(q.arm)); $("farArm").setAttribute("points",ptsStr(q.arm2));
  $("nearLeg").setAttribute("points",ptsStr(q.leg)); $("farLeg").setAttribute("points",ptsStr(q.leg2));
  $("head").setAttribute("cx",q.Hd[0].toFixed(1)); $("head").setAttribute("cy",q.Hd[1].toFixed(1));
  const hx=q.Hd[0].toFixed(1), hy=q.Hd[1].toFixed(1);
  $("hat").setAttribute("transform",`translate(${hx},${hy}) rotate(${p.t.toFixed(1)})`);
  $("pony").setAttribute("transform",`translate(${hx},${hy}) rotate(${p.t.toFixed(1)})`);
}
const reduceMotion=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}})();
let figSeq=["stand","armsUp"], figT0=0, figRAF=0;
function figFor(c){
  if(c&&!c.wild&&FIG[c.n[0]]) return FIG[c.n[0]];
  const name=c?(c.wild?c.n:c.n[c.lvl]):"";
  for(const [re,seq] of WILD_FIG) if(re.test(name)) return seq;
  return ["stand","armsUp"];
}
function figFrame(now){
  if($("play").hidden||$("fig").hasAttribute("hidden")){ figRAF=0; return; }
  const SEG=1150, MOVE=850, n=figSeq.length, t=Math.max(0,now-figT0)/SEG;
  const i=Math.floor(t)%n, f=Math.min(1,((t%1)*SEG)/MOVE), e=.5-.5*Math.cos(Math.PI*f);
  const a=POSE[figSeq[i]], b=POSE[figSeq[(i+1)%n]], o={};
  KEYS.forEach(k=>o[k]=a[k]+(b[k]-a[k])*e);
  drawPose(o); figRAF=requestAnimationFrame(figFrame);
}
function setFig(seq){
  figSeq=seq.filter(k=>POSE[k]); if(!figSeq.length) figSeq=["stand"];
  $("fig").toggleAttribute("hidden",false);
  if(reduceMotion||figSeq.length<2){ drawPose(POSE[figSeq[Math.min(1,figSeq.length-1)]]); return; }
  figT0=performance.now(); if(!figRAF) figRAF=requestAnimationFrame(figFrame);
}
