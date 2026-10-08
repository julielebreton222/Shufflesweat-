// Exercise data: moves, muscle groups, timings and wildcards.

// m: burn | str | ath | mob. n: [Build, Strong, Beast].
// r: reps per level (tap Done). No r = timed. s: one side at a time.
const MOVES=[
 // BURN (timed, HIIT ladder)
 {m:"burn",n:["Step-back burpees","Burpees","Burpee tuck jumps"],c:"Chest to the floor, jump back up. Keep moving the whole time."},
 {m:"burn",n:["Squat pulses","Jump squats","180° jump squats"],c:"Sit deep, drive through your heels. Land soft and go again."},
 {m:"burn",n:["Fast reverse lunges","Jumping lunges","Jumping lunge + knee drive"],c:"Switch legs every rep. Back knee almost touches the floor."},
 {m:"burn",n:["Mountain climbers","Cross-body climbers","Spider climbers"],c:"Shoulders over wrists. Drive the knees as fast as you can."},
 {m:"burn",n:["High knees","High knees + punches","Sprint high knees"],c:"Knees to hip height, arms pumping. This is a sprint."},
 {m:"burn",n:["Jumping jacks","Star jumps","Seal jacks + squat"],c:"Explode out wide, land soft, straight back up."},
 {m:"burn",n:["Step-out plank jacks","Plank jacks","Plank jack + push-up"],c:"Hips level, core tight. Feet out and in."},
 {m:"burn",n:["Skaters","Skater + floor touch","Skater + hold and hop"],c:"Leap side to side, land on one foot, swing your arms across."},
 {m:"burn",n:["Squat thrusts","Sprawls","Sprawl + jump"],c:"Hands down, feet back, hips drop, feet in, stand. Fast."},
 {m:"burn",n:["Up-down planks on knees","Up-down planks","Up-down plank + jack"],c:"Forearms to hands and back. Don't let the hips rock."},
 {m:"burn",n:["Speed squats","Squat + calf raise jump","Squat jump + tuck"],c:"Full depth every rep. Stand tall or jump at the top."},
 {m:"burn",n:["Fast feet","Fast feet + drop","Fast feet + sprawl"],c:"Tiny quick steps on the balls of your feet. Drop down every few seconds."},
 // STRENGTH (reps, holds timed)
 {m:"str",n:["Knee push-ups","Push-ups","Archer push-ups"],r:[10,12,10],c:"Body in one line, elbows about 45°. Chest all the way down."},
 {m:"str",n:["Pike push-ups","Feet-up pike push-ups","Deficit pike push-ups"],r:[8,10,8],c:"Hips high, lower your head between your hands. Deficit: hands on two thick books."},
 {m:"str",n:["Bent-knee chair dips","Straight-leg dips","Feet-up dips"],r:[10,12,12],c:"Hands on a sturdy chair. Lower until elbows hit 90°, press up."},
 {m:"str",n:["Split squats","Bulgarian split squats","Bulgarian + 2s pause"],r:[10,10,8],s:1,c:"Back foot on a chair for Bulgarian. Front knee tracks over toes."},
 {m:"str",n:["Assisted pistols","Pistol to chair","Pistol squats"],r:[6,5,5],s:1,c:"Hold a door frame if you need. Control the way down."},
 {m:"str",n:["Single-leg glute bridges","Single-leg hip thrusts","Hip thrust + 3s hold"],r:[12,12,8],s:1,c:"Shoulders on the couch for thrusts. Squeeze the glute at the top."},
 {m:"str",n:["Prone Y-raises","Superman pull-downs","Table rows"],r:[12,12,10],c:"Squeeze shoulder blades together. Rows: lie under a sturdy table and pull your chest up to it."},
 {m:"str",n:["Towel door rows","Towel rows, feet closer","Single-arm towel rows"],r:[10,12,8],c:"Loop a towel round both handles of a closed, sturdy door. Lean back, pull your chest to the door."},
 {m:"str",n:["Prone reverse snow angels","Superman + snow angel","Prone W-to-Y lifts"],r:[10,10,10],c:"Face down, arms off the floor. Sweep them slowly, squeezing your upper back the whole time."},
 {m:"str",n:["Tuck-ups","V-ups","Slow V-ups"],r:[12,12,10],c:"Reach for your toes, lower with control. No flopping back down."},
 {m:"str",n:["Downdog to cobra","Hindu push-ups","Dive-bomber push-ups"],r:[8,8,8],c:"Swoop from hips high, chest low along the floor, up into a cobra."},
 {m:"str",n:["Single-leg calf raises","Single-leg on a step","Step raise, 3s lower"],r:[12,15,10],s:1,c:"Full height at the top. Use a step for a bigger range."},
 {m:"str",n:["Tuck hollow hold","Hollow body hold","Hollow rocks"],c:"Lower back glued to the floor. Ribs down, arms by your ears."},
 {m:"str",n:["Plank shoulder taps","Bear crawl","Bear crawl + taps"],c:"Knees an inch off the floor, back flat. Don't let the hips sway."},
 {m:"str",n:["Plank lean","Planche lean","Planche lean + pulses"],c:"Fingers point out or back. Lean your shoulders past your hands."},
 {m:"str",n:["Seated leg lifts","Tuck L-sit","L-sit"],c:"Hands on the floor or two chairs, push down hard and lift your legs."},
 {m:"str",n:["Side plank","Side plank hip dips","Star side plank"],s:1,c:"Hips stacked and high. Switch sides at the beep."},
 {m:"str",n:["Wall sit","Wall sit, arms overhead","Single-leg wall sit"],c:"Thighs parallel to the floor. Breathe through it."},
 // ATHLETE (reps)
 {m:"ath",n:["Squat to calf raise","Broad jump, stick it","Broad jump + 180"],r:[10,6,6],c:"Swing the arms, jump far, land and freeze for a second. Walk back."},
 {m:"ath",n:["Lateral step and stick","Lateral bounds","Bound, stick, 2s hold"],r:[10,10,8],c:"Push off one leg, land on the other. Each landing is one rep."},
 {m:"ath",n:["Pogo hops","Tuck jumps","Tuck jump + squat"],r:[20,10,8],c:"Stiff ankles, bounce off the floor. Knees to chest for tucks."},
 {m:"ath",n:["Single-leg deadlift (hold wall)","Single-leg deadlift","Single-leg deadlift + hop"],r:[8,8,8],s:1,c:"Hinge at the hip, back leg straight behind you. Hips square."},
 {m:"ath",n:["Beast hold reaches","Beast kick-throughs","Kick-through + crab reach"],r:[10,12,10],c:"From all fours with knees up, thread one leg under, switch fast."},
 {m:"ath",n:["Incline plyo push-ups","Plyo push-ups","Clap push-ups"],r:[8,8,6],c:"Push so hard your hands leave the surface. Kitchen counter for incline."},
 {m:"ath",n:["Reverse lunge to knee drive","Lunge, knee drive + hop","Split jump to knee drive"],r:[8,8,8],s:1,c:"Step back, then drive the knee up hard. Balance at the top."},
 {m:"ath",n:["Sprint and drop","Sprint, drop, push-up","Sprint, drop, burpee"],r:[6,6,6],c:"Three seconds sprinting in place, drop to the floor, back up. That's one."},
 {m:"ath",n:["Shuffle and touch","Shuffle, touch, jump","Shuffle + sprawl"],r:[8,8,8],c:"Three quick side shuffles, touch the floor, go the other way."},
 {m:"ath",n:["Skater holds","Skater to single-leg hop","Skater + broad hop"],r:[10,10,8],c:"Land on one leg and hold it still. Control beats speed."},
 {m:"ath",n:["Short Copenhagen plank","Copenhagen plank","Copenhagen + leg lifts"],s:1,c:"Side plank with your top leg on a chair: knee for short, ankle for full."},
 // MOBILITY (timed, active flexibility)
 {m:"mob",n:["Supported Cossack squats","Cossack squats","Cossack + bottom pause"],c:"Wide stance, sit into one hip with the other leg straight, toes up."},
 {m:"mob",n:["Deep squat hold (hold door)","Deep squat pry","Deep squat, arms overhead"],c:"Sit all the way down. Elbows push knees out, shift side to side."},
 {m:"mob",n:["Standing roll-downs","Jefferson curl on a step","Jefferson curl holding books"],c:"Roll down one vertebra at a time, legs straight. Roll up just as slow."},
 {m:"mob",n:["Straddle reach","Pancake pulses","Pancake + hands lifted"],c:"Sit wide, flat back, hinge forward. At the end, lift your hands off the floor."},
 {m:"mob",n:["Bent-knee leg lifts","Single pike lifts","Pike compression lifts"],c:"Sit with legs straight, hands by your knees. Lift your heels with your quads."},
 {m:"mob",n:["90/90 switches (hands back)","90/90 switches hands-free","90/90 to tall kneel"],c:"Both knees bent at 90°, rotate side to side through the hips."},
 {m:"mob",n:["World's greatest stretch","WGS + hamstring rock-back","WGS + hip lift"],s:1,c:"Deep lunge, elbow to the floor, then rotate and reach up."},
 {m:"mob",n:["Half-kneeling hip flexor squeeze","Couch stretch","Couch stretch + hand lift"],s:1,c:"Back shin up the couch or wall. Squeeze that glute, stay tall."},
 {m:"mob",n:["Glute bridge hold","Tabletop bridge","Full bridge"],c:"Push through your feet and open your chest and shoulders."},
 {m:"mob",n:["Prone Y-T raises","Prone swimmers","Swimmers, hands high"],c:"Face down, forehead on the floor. Sweep the arms from overhead to your hips."},
 {m:"mob",n:["Standing leg raises (hold wall)","Active leg raises","Leg raise + 3s hold"],s:1,c:"Straight leg, lift it as high as you can with no swinging."},
 {m:"mob",n:["Frog rocks","Frog to deep squat","Frogger jumps"],c:"Knees wide on all fours, rock your hips back. Feel the inner thighs."}
];

// muscle group for strength and athlete moves, keyed by the Build name
const GROUP={"Knee push-ups":"push","Pike push-ups":"push","Bent-knee chair dips":"push","Downdog to cobra":"push","Plank lean":"push","Incline plyo push-ups":"push",
 "Prone Y-raises":"pull","Towel door rows":"pull","Prone reverse snow angels":"pull",
 "Split squats":"legs","Assisted pistols":"legs","Single-leg glute bridges":"legs","Single-leg calf raises":"legs","Wall sit":"legs","Squat to calf raise":"legs","Lateral step and stick":"legs","Pogo hops":"legs","Single-leg deadlift (hold wall)":"legs","Reverse lunge to knee drive":"legs","Sprint and drop":"legs","Shuffle and touch":"legs","Skater holds":"legs",
 "Tuck-ups":"core","Tuck hollow hold":"core","Plank shoulder taps":"core","Seated leg lifts":"core","Side plank":"core","Beast hold reaches":"core","Short Copenhagen plank":"core"};
MOVES.forEach((m,i)=>{m.id=i; if(GROUP[m.n[0]]) m.g=GROUP[m.n[0]];});
// Themed names, always shown with a plain word (PLAIN) where it matters.
const MODE_NAMES={mix:"Lucky Draw",burn:"Rodeo",str:"Ranch Strong",ath:"Wild Mustang",mob:"Fairy Stretch"};
const PLAIN={mix:"a bit of everything",burn:"HIIT cardio",str:"strength",ath:"jumps and power",mob:"flexibility"};
const TYPE_NAMES={burn:"Rodeo · cardio",str:"Ranch Strong · strength",ath:"Wild Mustang · power",mob:"Fairy Stretch · mobility"};
const LEVELS=["Pony","Cowgirl","Rodeo Queen"];
const LADDER=[40,30,20];
const HOLD={str:40,ath:40,mob:40};
const REST={burn:10,str:20,ath:20,mob:10,wild:10};
const ROUNDS={5:1,15:3,25:5};

const WILD={
 burst:[
  {n:"Tabata burst",c:"20 seconds, completely all out. Burpees. Nothing held back.",dur:20},
  {n:"Sprint finish",c:"High knees at full speed. 20 seconds. Faster than you think you can.",dur:20},
  {n:"Burpee ladder",c:"1 burpee, 1 jump squat. Then 2 and 2. Then 3 and 3. Keep climbing.",dur:40}],
 emom:[
  {n:"EMOM: 8 push-ups",c:"Do 8 clean push-ups, tap Done. Whatever's left of the minute is your rest.",dur:60,emom:1,g:"push"},
  {n:"EMOM: 12 jump squats",c:"12 jump squats, tap Done. The faster you go, the longer you rest.",dur:60,emom:1,g:"legs"},
  {n:"EMOM: 6 burpees",c:"6 burpees, tap Done. Rest for the rest of the minute.",dur:60,emom:1},
  {n:"EMOM: 10 Cossacks",c:"10 Cossack squats, alternating. Tap Done and rest till the minute ends.",dur:60,emom:1,g:"legs"}],
 count:[
  {n:"Max burpees",c:"As many as you can in 30 seconds. Tap +1 after each one.",dur:30,key:"burpees"},
  {n:"Max push-ups",c:"Clean reps only, chest to the floor. Tap after each.",dur:30,key:"pushups"},
  {n:"Max jump squats",c:"Full depth every rep. Tap after each.",dur:30,key:"jumpsquats"},
  {n:"Max plank jacks",c:"Feet out and in counts as one. Tap after each.",dur:30,key:"plankjacks"}],
 hold:[
  {n:"Longest hollow hold",c:"Hold it until the timer ends. Lower back stays down.",dur:40,g:"core"},
  {n:"Wall sit, arms up",c:"Thighs parallel, arms straight overhead. Breathe.",dur:45,g:"legs"},
  {n:"Deep squat hold",c:"Sit all the way down and stay. Heels down if you can.",dur:45,mobw:1}],
 choice:[["Clap push-ups","Tuck jumps"],["Pistol squats","Bulgarian split squats"],["Burpees","Sprawls"],["L-sit","Hollow body hold"],["Cossack squats","Pancake pulses"]],
 scene:[
  {n:"Stairs. Go.",c:"Run up and down the stairs, or fast step-ups on one step, until the timer ends.",dur:40},
  {n:"Kitchen counter",c:"Incline plyo push-ups on the counter. Explode off it.",dur:40},
  {n:"Doorframe",c:"Hold the frame and do deep assisted pistols. Switch at halfway.",dur:40}],
 story:[
  {n:"Rooftop chase",c:"They're right behind you. Sprint high knees, sprawl every 5 seconds.",dur:30},
  {n:"The floor is lava",c:"Lateral bounds from rock to rock. Stick every landing or you're toast.",dur:40},
  {n:"T-rex rampage",c:"Tiny arms, huge jump squats. Stomp the city.",dur:30}],
 music:[{n:"Loudest song",c:"Put on a song you love, loud. Burpee on every chorus, squats the rest of the time.",dur:45}]
};
const WILD_NAMES={burst:"All out",emom:"Every minute",count:"Beat your record",hold:"Hold",choice:"Your pick",scene:"Change of scene",story:"Story",music:"Music"};
