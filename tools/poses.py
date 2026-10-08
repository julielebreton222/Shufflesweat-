"""Builds the stick-figure poses in js/poses.js from key points (where hands and feet go).

Run:  python3 tools/poses.py   (writes js/poses.js)

Figure faces right. Ground is y=111. Lengths: torso 34, neck 12, upper arm 18, forearm 17, thigh 22, shin 22.
Angles (degrees): torso t 0 = up, 90 = forward; limbs 0 = down, 90 = forward, 180 = up, -90 = back.
A limb can be given as angles (a1, a2) or as a target point with a bend side: ("knee"/"elbow" goes "fwd", "back", "up" or "down").
"""
import math, json, os

TORSO, NECK, UA, FA, TH, SH = 34, 12, 18, 17, 22, 22
G = 111

def ang(dx, dy):                       # direction -> our angle
    return math.degrees(math.atan2(dx, dy))

def norm(a):
    return (a + 180) % 360 - 180

def ik(o, target, l1, l2, bend, kind):
    """Two-segment reach. Knees only flex one way (shin turns back vs thigh), elbows the other.
    `bend` forces the joint to a side ("fwd", "back", "up", "down"); use it only for face-up poses with the head on the right,
    where the side-view figure is really seen from its other side."""
    dx, dy = target[0] - o[0], target[1] - o[1]
    d = max(1e-6, min(math.hypot(dx, dy), l1 + l2 - 0.01))
    phi = ang(dx, dy)
    a = math.degrees(math.acos(max(-1, min(1, (l1*l1 + d*d - l2*l2) / (2*l1*d)))))
    best = None
    for a1 in (phi + a, phi - a):
        j = (o[0] + l1*math.sin(math.radians(a1)), o[1] + l1*math.cos(math.radians(a1)))
        a2 = ang(target[0] - j[0], target[1] - j[1])
        if bend:
            score = {"fwd": j[0], "back": -j[0], "up": -j[1], "down": j[1]}[bend]
        else:
            flex = norm(a2 - a1)
            score = -flex if kind == "leg" else flex
        if best is None or score > best[0]:
            best = (score, a1, a2)
    return round(best[1], 1), round(best[2], 1)

def pose(hip, t, nl, fl, na, fa):
    hx, hy = hip
    S = (hx + TORSO*math.sin(math.radians(t)), hy - TORSO*math.cos(math.radians(t)))
    def limb(spec, origin, l1, l2, kind):
        if spec[0] == "at":
            return ik(origin, spec[1], l1, l2, spec[2], kind)
        if spec[0] == "knee":            # thigh toward a knee point, shin at a fixed angle
            return round(ang(spec[1][0] - origin[0], spec[1][1] - origin[1]), 1), spec[2]
        return spec
    th, sh = limb(nl, hip, TH, SH, "leg"); th2, sh2 = limb(fl, hip, TH, SH, "leg")
    ua, fa_ = limb(na, S, UA, FA, "arm"); ua2, fa2 = limb(fa, S, UA, FA, "arm")
    r = lambda v: round(v, 1)
    return dict(hx=r(hx), hy=r(hy), t=r(t), ua=ua, fa=fa_, ua2=ua2, fa2=fa2, th=th, sh=sh, th2=th2, sh2=sh2)

def at(x, y, bend=None): return ("at", (x, y), bend)
def knee(x, y, shin): return ("knee", (x, y), shin)

def body_line(feet, length, angle_up):
    """Point `length` from `feet` along a straight body rising at `angle_up` degrees, plus the torso angle."""
    a = math.radians(angle_up)
    return (feet[0] + length*math.cos(a), feet[1] - length*math.sin(a)), 90 - angle_up

def straight(feet, angle_up, hand_at, extra_back=0):
    """A straight plank-like body from the feet: returns hip, torso angle."""
    hip, t = body_line(feet, TH + SH, angle_up)
    return hip, t

ARMS_DOWN = (5, 5); ARMS_DOWN2 = (-5, -5); ARMS_UP = (175, 175); ARMS_UP2 = (185, 185)
ARMS_FWD = (90, 90); ARMS_FWD2 = (85, 85)

P = {}
def add(name, **kw): P[name] = pose(**kw)

# ---- standing, squats, jumps
add("stand", hip=(100, 66), t=0, nl=at(102, G), fl=at(98, G), na=ARMS_DOWN, fa=ARMS_DOWN2)
add("armsUp", hip=(100, 66), t=0, nl=at(102, G), fl=at(98, G), na=ARMS_UP, fa=ARMS_UP2)
add("tiptoe", hip=(100, 61), t=0, nl=at(102, 106), fl=at(98, 106), na=ARMS_DOWN, fa=ARMS_DOWN2)
add("oneLeg", hip=(100, 66), t=0, nl=at(101, G), fl=at(84, 92), na=(30, 60), fa=(-30, 0))
add("oneLegToe", hip=(100, 61), t=0, nl=at(101, 106), fl=at(84, 87), na=(30, 60), fa=(-30, 0))
add("squat", hip=(84, 89), t=42, nl=at(106, G), fl=at(103, G), na=ARMS_FWD, fa=ARMS_FWD2)
add("squatHalf", hip=(90, 81), t=28, nl=at(106, G), fl=at(103, G), na=ARMS_FWD, fa=ARMS_FWD2)
add("squatLoad", hip=(86, 87), t=45, nl=at(106, G), fl=at(103, G), na=(-50, -45), fa=(-55, -50))
add("squatHands", hip=(86, 94), t=62, nl=at(104, G), fl=at(101, G), na=at(126, 110), fa=at(122, 110))
add("deepSquat", hip=(92, 101), t=22, nl=at(108, G), fl=at(105, G), na=(75, 100), fa=(70, 95))
add("deepSquatShift", hip=(98, 100), t=10, nl=at(110, G), fl=at(104, G), na=(60, 110), fa=(55, 105))
add("deepSquatUp", hip=(92, 101), t=12, nl=at(108, G), fl=at(105, G), na=(172, 178), fa=(176, 182))
add("deepSquatDoor", hip=(92, 101), t=22, nl=at(108, G), fl=at(105, G), na=at(146, 80), fa=at(146, 84))
add("jump", hip=(100, 52), t=0, nl=at(102, 96), fl=at(97, 95), na=(165, 165), fa=(175, 175))
add("hop", hip=(100, 58), t=0, nl=at(102, 102), fl=at(98, 102), na=(20, 60), fa=(-20, 40))
add("tuck", hip=(100, 54), t=8, nl=at(112, 66), fl=at(110, 68), na=at(118, 60), fa=at(116, 62))
add("athletic", hip=(97, 77), t=22, nl=at(108, G), fl=at(92, G), na=(40, 120), fa=(-30, 70))
add("athletic2", hip=(97, 75), t=22, nl=at(110, 104), fl=at(92, G), na=(-30, 70), fa=(40, 120))
add("touchDown", hip=(92, 90), t=55, nl=at(110, G), fl=at(96, G), na=at(126, 110), fa=(-30, 30))
add("broadFly", hip=(112, 52), t=30, nl=at(116, 92), fl=at(96, 94), na=(130, 140), fa=(125, 135))
add("squatLand", hip=(124, 89), t=40, nl=at(146, G), fl=at(143, G), na=ARMS_FWD, fa=ARMS_FWD2)

# ---- lunges and split stances (near leg forward)
add("lungeUp", hip=(100, 66), t=0, nl=at(103, G), fl=at(84, 108), na=ARMS_DOWN, fa=ARMS_DOWN2)
add("lunge", hip=(94, 86), t=0, nl=at(116, G), fl=at(66, 108), na=(20, 20), fa=(-20, -20))
add("lungeSwitch", hip=(94, 86), t=0, nl=at(66, 108), fl=at(116, G), na=(-20, -20), fa=(20, 20))
add("lungeAir", hip=(96, 60), t=0, nl=at(112, 100), fl=at(80, 98), na=(150, 160), fa=(-30, -20))
add("splitUp", hip=(96, 70), t=0, nl=at(116, G), fl=at(76, 110), na=ARMS_DOWN, fa=ARMS_DOWN2)
add("splitDown", hip=(94, 88), t=0, nl=at(116, G), fl=at(76, 109), na=ARMS_DOWN, fa=ARMS_DOWN2)
add("bulgUp", hip=(98, 70), t=5, nl=at(116, G), fl=at(66, 86), na=ARMS_DOWN, fa=ARMS_DOWN2)
add("bulgDown", hip=(94, 88), t=8, nl=at(116, G), fl=at(66, 86), na=ARMS_DOWN, fa=ARMS_DOWN2)
add("kneeDrive", hip=(100, 66), t=0, nl=at(101, G), fl=at(124, 70), na=(-40, 20), fa=(60, 140))
add("kneeDriveHop", hip=(100, 60), t=0, nl=at(101, 104), fl=at(124, 64), na=(-40, 20), fa=(60, 140))
add("highKnee", hip=(100, 64), t=5, nl=at(124, 70), fl=at(96, G), na=(60, 140), fa=(-40, 20))
add("highKnee2", hip=(100, 64), t=5, nl=at(96, G), fl=at(124, 70), na=(-40, 20), fa=(60, 140))
add("skater", hip=(100, 74), t=35, nl=at(104, G), fl=at(74, 106), na=(100, 100), fa=(-60, -60))
add("sideLand", hip=(100, 76), t=30, nl=at(110, G), fl=at(82, 100), na=(-40, -40), fa=(80, 80))
add("pistolDown", hip=(90, 99), t=40, nl=at(102, G), fl=at(134, 99), na=ARMS_FWD, fa=ARMS_FWD2)
add("pistolUp", hip=(98, 68), t=8, nl=at(100, G), fl=at(124, 100), na=ARMS_FWD, fa=ARMS_FWD2)
add("pistolDoorUp", hip=(98, 68), t=6, nl=at(100, G), fl=at(124, 100), na=at(142, 60), fa=at(142, 64))
add("pistolDoorDown", hip=(92, 99), t=30, nl=at(104, G), fl=at(136, 99), na=at(142, 74), fa=at(142, 78))
add("pistolChair", hip=(78, 84), t=30, nl=at(102, G), fl=at(124, 86), na=ARMS_FWD, fa=ARMS_FWD2)
add("slDeadlift", hip=(96, 66), t=86, nl=at(98, G), fl=at(52, 64), na=(5, 5), fa=(-5, -5))
add("slDeadliftWall", hip=(96, 66), t=84, nl=at(98, G), fl=at(52, 64), na=at(166, 72), fa=(-5, -5))
add("slDeadliftHop", hip=(98, 60), t=10, nl=at(100, 104), fl=at(120, 66), na=(-40, 20), fa=(60, 140))

# ---- planks (head to the right, feet on the left)
def plank_pose(name, feet, rise, hands, near_arm_bend="back", far_hands=None, knees=None, near_leg=None, far_leg=None, na=None, fa=None):
    hip, t = body_line(feet, TH + SH, rise) if knees is None else body_line(knees, TH, rise)
    nl = near_leg or at(*feet); fl = far_leg or at(feet[0] - 2, feet[1])
    P[name] = pose(hip=hip, t=t, nl=nl, fl=fl, na=na or at(*hands), fa=fa or at(*(far_hands or (hands[0] - 3, hands[1]))))

plank_pose("plank", (40, 109), 26, (110, 110))
plank_pose("plankHop", (42, 104), 24, (110, 110))
plank_pose("pushDown", (40, 109), 12, (110, 110), "up")
plank_pose("plankLean", (34, 109), 21, (98, 110))
plank_pose("plankAir", (40, 109), 34, (122, 96))
plank_pose("climb", (40, 109), 26, (110, 110), near_leg=at(84, 104))
plank_pose("climb2", (40, 109), 26, (110, 110), far_leg=at(84, 104))
plank_pose("plankTap", (40, 109), 26, (110, 110), na=at(112, 80))
plank_pose("sprawl", (34, 109), 8, (112, 110))
# knee plank: hip, knee, shoulder in a line; shins lifted behind
def knee_plank(name, rise, hands, bend="back"):
    knee = (66, 109)
    hip, t = body_line(knee, TH, rise)
    P[name] = pose(hip=hip, t=t, nl=("knee", knee, -100), fl=("knee", (knee[0] - 2, knee[1]), -102),
                   na=at(*hands), fa=at(hands[0] - 3, hands[1]))
knee_plank("kneePlank", 34, (114, 110))
knee_plank("kneePushDown", 16, (114, 110), "up")
# forearm planks
def forearm(name, feet, knees=None):
    if knees:
        hip, t = body_line(knees, TH, 18); nl = ("knee", knees, -100)
    else:
        hip, t = body_line(feet, TH + SH, 13); nl = ("at", feet, None)
    S = (hip[0] + TORSO*math.sin(math.radians(t)), hip[1] - TORSO*math.cos(math.radians(t)))
    elbow = (S[0], 110)
    fl = ("knee", (nl[1][0] - 2, nl[1][1]), -102) if knees else ("at", (nl[1][0] - 2, nl[1][1]), None)
    P[name] = pose(hip=hip, t=t, nl=nl, fl=fl, na=at(elbow[0] + 17, 110), fa=at(elbow[0] + 14, 110))
forearm("forearmPlank", (38, 109))
forearm("kneeForearm", None, knees=(66, 109))
knee_plank("kneeHandPlank", 34, (114, 110))

# downdog / pike (hands right, feet left, hips high)
add("pike", hip=(88, 66), t=124, nl=at(66, G), fl=at(63, G), na=at(140, 110), fa=at(137, 110))
add("pikeDown", hip=(94, 62), t=145, nl=at(68, G), fl=at(65, G), na=at(124, 110), fa=at(121, 110))
add("pikeChair", hip=(96, 56), t=150, nl=at(68, 86), fl=at(66, 86), na=at(118, 110), fa=at(115, 110))
add("pikeChairDown", hip=(98, 58), t=160, nl=at(68, 86), fl=at(66, 86), na=at(112, 110), fa=at(109, 110))
add("cobra", hip=(84, 106), t=58, nl=at(40, 109), fl=at(38, 109), na=at(116, 110), fa=at(113, 110))
add("swoop", hip=(80, 97), t=84, nl=at(36, 108), fl=at(34, 108), na=at(124, 110), fa=at(121, 110))

# all fours
add("beast", hip=(80, 88), t=86, nl=knee(80, 107, -90), fl=knee(78, 107, -90), na=at(114, 110), fa=at(111, 110))
add("bear", hip=(80, 86), t=86, nl=knee(92, 104, -76), fl=knee(74, 107, -86), na=at(108, 110), fa=at(120, 110))
add("bear2", hip=(84, 86), t=86, nl=knee(78, 107, -86), fl=knee(96, 104, -76), na=at(124, 110), fa=at(110, 110))
add("bearTap", hip=(80, 88), t=86, nl=knee(80, 107, -90), fl=knee(78, 107, -90), na=at(116, 82), fa=at(111, 110))
add("kickThrough", hip=(96, 96), t=20, nl=at(138, 104), fl=knee(80, 110, -95), na=(150, 170), fa=at(72, 110))
add("quad", hip=(82, 86), t=86, nl=knee(82, 109, -90), fl=knee(80, 109, -90), na=at(116, 110), fa=at(113, 110))
add("frogBack", hip=(70, 92), t=72, nl=knee(84, 109, -92), fl=knee(82, 109, -92), na=at(118, 110), fa=at(115, 110))

# ---- lying face down (head right)
add("prone", hip=(84, 106), t=85, nl=(-89, -89), fl=(-91, -91), na=(95, 95), fa=(97, 97))
add("proneY", hip=(84, 106), t=78, nl=(-86, -86), fl=(-88, -88), na=(110, 110), fa=(112, 112))
add("proneW", hip=(84, 106), t=80, nl=(-86, -86), fl=(-88, -88), na=(-100, -60), fa=(-104, -64))

# ---- lying on the back (head left)
add("backLie", hip=(100, 106), t=-85, nl=at(122, G), fl=at(120, G), na=(88, 88), fa=(90, 90))
add("bridgeUp", hip=(100, 86), t=-110, nl=at(122, G), fl=at(120, G), na=(88, 88), fa=(90, 90))
add("slBridgeDown", hip=(100, 106), t=-85, nl=at(122, G), fl=(120, 120), na=(88, 88), fa=(90, 90))
add("slBridgeUp", hip=(100, 86), t=-110, nl=at(122, G), fl=(112, 112), na=(88, 88), fa=(90, 90))
add("thrustDown", hip=(92, 100), t=-62, nl=at(124, G), fl=at(122, G), na=(-92, -92), fa=(-94, -94))
add("thrustUp", hip=(96, 84), t=-88, nl=at(124, G), fl=(100, 100), na=(-92, -92), fa=(-94, -94))
add("hollow", hip=(100, 104), t=-78, nl=(100, 100), fl=(102, 102), na=(-100, -100), fa=(-98, -98))
add("hollowTuck", hip=(100, 104), t=-72, nl=at(112, 88), fl=at(110, 90), na=(-130, -130), fa=(-128, -128))
add("hollowRock", hip=(100, 100), t=-70, nl=(106, 106), fl=(108, 108), na=(-110, -110), fa=(-108, -108))
add("vup", hip=(100, 106), t=-38, nl=(138, 138), fl=(140, 140), na=(150, 150), fa=(152, 152))
add("tuckUp", hip=(100, 106), t=-30, nl=at(116, 80), fl=at(114, 82), na=(100, 100), fa=(102, 102))
add("tabletop", hip=(100, 88), t=-100, nl=at(124, G), fl=at(122, G), na=at(66, 110), fa=at(68, 110))
add("wheel", hip=(102, 66), t=-140, nl=at(128, G), fl=at(126, G), na=at(70, 110), fa=at(72, 110))

# ---- sitting (legs forward, to the right)
add("sit", hip=(90, 106), t=-4, nl=(90, 90), fl=(88, 88), na=at(80, 110), fa=at(78, 110))
add("sitTall", hip=(90, 106), t=4, nl=(90, 90), fl=(88, 88), na=at(110, 106), fa=at(108, 106))
add("sitLift", hip=(90, 106), t=2, nl=(84, 84), fl=(82, 82), na=at(106, 108), fa=at(104, 108))
add("sitFold", hip=(88, 106), t=64, nl=(90, 90), fl=(88, 88), na=at(128, 106), fa=at(126, 106))
add("lsit", hip=(90, 102), t=0, nl=(92, 92), fl=(90, 90), na=at(92, 110), fa=at(89, 110))
add("tuckLsit", hip=(90, 102), t=0, nl=at(112, 92), fl=at(110, 94), na=at(92, 110), fa=at(89, 110))
add("seatedKnees", hip=(90, 106), t=-10, nl=at(118, G), fl=at(116, G), na=at(72, 110), fa=at(70, 110))
add("seated9090", hip=(90, 106), t=4, nl=(82, -88), fl=(-80, -100), na=at(70, 110), fa=at(68, 110))
add("seated9090Free", hip=(90, 106), t=6, nl=(82, -88), fl=(-80, -100), na=(120, 120), fa=(118, 118))
add("tallKneel", hip=(96, 86), t=0, nl=knee(96, 108, -90), fl=knee(94, 108, -90), na=(150, 150), fa=(30, 60))
add("wallSit", hip=(88, 89), t=0, nl=at(110, G), fl=at(108, G), na=(5, 5), fa=(-5, -5))
add("wallSitUp", hip=(88, 89), t=0, nl=at(110, G), fl=at(108, G), na=(178, 178), fa=(182, 182))
add("wallSitOne", hip=(88, 89), t=0, nl=(90, 90), fl=at(108, G), na=(5, 5), fa=(-5, -5))

# ---- dips: hands on a chair seat behind (chair front edge at x=80, seat y=86)
add("dipUp", hip=(88, 92), t=-4, nl=at(122, G), fl=at(120, G), na=at(80, 86), fa=at(78, 86))
add("dipDown", hip=(90, 104), t=-6, nl=at(122, G), fl=at(120, G), na=at(80, 86), fa=at(78, 86))
add("dipUpStraight", hip=(88, 92), t=-4, nl=at(132, 109), fl=at(130, 109), na=at(80, 86), fa=at(78, 86))
add("dipDownStraight", hip=(90, 104), t=-6, nl=at(132, 109), fl=at(130, 109), na=at(80, 86), fa=at(78, 86))

# ---- side plank (seen from the front-ish: body a diagonal, top arm up)
add("sidePlank", hip=(96, 92), t=72, nl=at(56, 109), fl=at(54, 107), na=at(128, 110), fa=(180, 180))
add("sidePlankDip", hip=(96, 100), t=78, nl=at(56, 109), fl=at(54, 107), na=at(128, 110), fa=(180, 180))
add("sidePlankStar", hip=(96, 92), t=72, nl=at(56, 109), fl=(-150, -150), na=at(128, 110), fa=(160, 160))
# Copenhagen: top leg on a chair seat (chair on the left, seat y=86), forearm on the floor
add("copenhagen", hip=(102, 92), t=78, nl=at(64, 86), fl=at(62, 109), na=at(150, 110), fa=(180, 180))
add("copenhagenLift", hip=(102, 92), t=78, nl=at(64, 86), fl=(-110, -110), na=at(150, 110), fa=(180, 180))

# ---- rows
# table rows: lying under a table (edge at x=100, top y=70), heels on the floor
add("tableRowDown", hip=(64, 104), t=86, nl=at(20, 108), fl=at(19, 108), na=at(100, 72, "down"), fa=at(98, 72, "down"))
add("tableRowUp", hip=(60, 92), t=66, nl=at(18, 108), fl=at(17, 108), na=at(100, 72, "down"), fa=at(98, 72, "down"))
# towel door rows: door on the right (x=150), towel from the handle at (148,58)
add("rowOut", hip=(106, 70), t=-32, nl=at(128, G), fl=at(126, G), na=at(122, 52), fa=at(121, 54))
add("rowIn", hip=(112, 68), t=-14, nl=at(128, G), fl=at(126, G), na=at(124, 46), fa=at(123, 48))
P["rowIn"]["ua"], P["rowIn"]["fa"] = -40.0, 100.0
P["rowIn"]["ua2"], P["rowIn"]["fa2"] = -42.0, 98.0

# ---- calf raises on a step (step top y=101, edge at x=118)
add("stepStand", hip=(110, 56), t=0, nl=at(112, 101), fl=at(84 + 26, 82), na=(30, 60), fa=(-30, 0))
add("stepToe", hip=(110, 51), t=0, nl=at(112, 96), fl=at(84 + 26, 77), na=(30, 60), fa=(-30, 0))
add("stepRollDown", hip=(104, 56), t=160, nl=at(106, 101), fl=at(104, 101), na=at(114, 109), fa=at(112, 109))
add("stepStandTall", hip=(104, 56), t=0, nl=at(106, 101), fl=at(104, 101), na=ARMS_DOWN, fa=ARMS_DOWN2)

# ---- folding, kneeling, lunging stretches
add("rollDown", hip=(98, 66), t=145, nl=at(102, G), fl=at(100, G), na=at(116, 109), fa=at(113, 109))
add("kneel", hip=(92, 84), t=0, nl=at(118, G), fl=at(70, 109), na=(175, 175), fa=(185, 185))
add("kneelLean", hip=(98, 88), t=-6, nl=at(122, G), fl=at(70, 109), na=(170, 165), fa=(180, 175))
add("couch", hip=(92, 89), t=0, nl=at(120, G), fl=knee(83, 109, 178), na=(5, 5), fa=(-5, -5))
add("couchUp", hip=(96, 89), t=-6, nl=at(124, G), fl=knee(84, 109, 178), na=(172, 172), fa=(176, 176))
add("lungeHand", hip=(94, 88), t=50, nl=at(118, G), fl=at(58, 109), na=at(114, 110), fa=at(112, 110))
add("wgs", hip=(94, 88), t=50, nl=at(118, G), fl=at(58, 109), na=(180, 180), fa=at(112, 110))
add("wgsRock", hip=(78, 89), t=62, nl=(84, 84), fl=knee(72, 109, -95), na=at(114, 110), fa=at(112, 110))
add("legRaise", hip=(100, 66), t=-2, nl=(95, 95), fl=at(99, G), na=at(64, 34), fa=(-5, -5))
add("legRaiseLow", hip=(100, 66), t=0, nl=(40, 40), fl=at(99, G), na=at(64, 34), fa=(-5, -5))
add("cossack", hip=(90, 92), t=24, nl=at(108, G), fl=at(56, 109), na=(80, 80), fa=(78, 78))

# ---- stairs (steps on the right, each 10 high and 22 deep, starting at x=120)
add("stepUp", hip=(110, 60), t=10, nl=at(130, 101), fl=at(100, G), na=(-40, 20), fa=(60, 140))
add("stepUp2", hip=(124, 52), t=10, nl=at(130, 101), fl=at(150, 91), na=(60, 140), fa=(-40, 20))

# ---- incline push-ups on a kitchen counter (edge x=144, top y=62)
add("inclineUp", hip=(94, 92), t=50, nl=at(58, G), fl=at(56, G), na=at(144, 62), fa=at(141, 62))
add("inclineDown", hip=(100, 88), t=56, nl=at(58, G), fl=at(56, G), na=at(144, 62), fa=at(141, 62))
add("inclineAir", hip=(92, 92), t=46, nl=at(58, G), fl=at(56, G), na=(110, 110), fa=(108, 108))

out = "// Generated by tools/poses.py from key points. Edit that file, then run: python3 tools/poses.py\nconst P={\n" + ",\n".join(
    f' {k}:{{' + ",".join(f"{kk}:{vv:g}" for kk, vv in v.items()) + "}" for k, v in P.items()) + "\n};\n"
path = os.path.join(os.path.dirname(__file__), "..", "js", "poses.js")
open(path, "w").write(out)
print(len(P), "poses ->", os.path.normpath(path))
