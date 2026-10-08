# Shuffle Sweat: project guide for Claude Code

Read this file first in every session. The design direction lives in `DESIGN.md`. The step-by-step plan the owner will follow is in `PROMPTS.md`.

## What this is

Shuffle Sweat is a personal home-workout web app for Julie. It runs on her iPhone (added to the Home Screen) and in a desktop browser. It was first built as a single-file HTML page in claude.ai. This repo is where it grows into a proper app.

Julie has ADHD and kept quitting follow-along workout videos (like Growingannanas) because they got boring. Every design decision below serves one goal: **get her to start, keep her going, and let her stop without guilt.**

## Product principles (don't break these)

1. **Short, surprising, chosen by mood, with permission to stop.** Cards are face-down until their turn. Rounds are short. Stopping early always counts as a win, never as a failure.
2. **Efficient, not gentle.** Julie wants real training value: calories, strength and flexibility. No slow filler moves. Every move should be a real calisthenics, HIIT, athletic or active-flexibility exercise.
3. **Reps for strength, time for cardio and holds.** Reps feel better for her because the finish line is concrete and she controls the pace. Rep cards have a Done button and no clock. Burn cards, holds and mobility cards use a timer.
4. **The "I'm bored" button is the heart of the app.** First tap: instant wildcard. Second tap within 2 minutes: offer "something harder" or a 60-second breather. Third tap: offer "end here as a win." Boredom is treated as information, not weakness.
5. **Clarity over cleverness.** Themed language is welcome (see DESIGN.md), but every control and every move must still be instantly understandable. Plain words win over puns where they conflict.
6. **Honest numbers.** Weekly targets come from real guidelines (sources below). Don't invent calorie counts or claims the app can't back up.

## Current state

- A small installable web app (PWA): vanilla HTML, CSS and JavaScript. No build step, no framework, no dependencies except Google Fonts (Bricolage Grotesque and Figtree, to be replaced by the new design).
- It started as a single-file claude.ai artifact (`shuffle-sweat.html`, still in the git history) and was split into files without changing how it looks or works.
- All state lives in `localStorage` (keys below), wrapped in try/catch.
- Works in light and dark mode through CSS custom properties on `:root`, with a `prefers-color-scheme` block and a `[data-theme]` override.

### Files

| File | What's in it |
|---|---|
| `index.html` | Document skeleton, install meta tags, and the markup for every screen |
| `css/styles.css` | All styles and the color tokens |
| `js/store.js` | `$` (get element by id) and `store` (safe localStorage) |
| `js/moves.js` | Data: `MOVES`, `GROUP`, names, timings (`LADDER`, `HOLD`, `REST`, `ROUNDS`) and `WILD` |
| `js/poses.js` | Stick-figure poses (`P`). **Generated**: edit `tools/poses.py`, then run `python3 tools/poses.py` |
| `js/figure.js` | Props (`PROPS`: chair, wall, door, step, stairs, table, counter, couch), move → pose loop + prop (`FIG`, per level), wildcards (`WILD_FIG`) and the animation |
| `tools/poses.py` | Builds poses from where the hands and feet go, with joints that only bend the natural way |
| `debug/poses.html` | Every move and level, every pose, with props. Open it to check the figures |
| `js/week.js` | Daily log, `credit()`, today's stats, the weekly goals screen, `weightedShuffle()` and `suggestion()` |
| `js/programs.js` | Set weekly plans (`PLANS`, e.g. **Zero**), the Week type menu, the plan's days on the home screen, and `planCards()` which turns one exercise into one card per set. Add a day's exercises here; each exercise needs a figure entry in `FIG` |
| `js/workout.js` | Wildcard picking, sound and voice, timer, deck building, cards, rests, round end and the bored button |
| `js/app.js` | Remaining button wiring, first-screen choice, service-worker registration |
| `manifest.webmanifest`, `sw.js`, `icons/` | Install and offline support. The icon is a placeholder. |

The scripts are **classic scripts that share one global scope**, loaded with `defer` in the order listed in `index.html`. Code that runs at load time may only use things from earlier files; functions can call anything once the page has loaded.

**When you change any file, bump `VERSION` in `sw.js`** (and add new files to `APP_FILES`), otherwise installed copies keep serving the old cached version.

To run locally: `python3 -m http.server 8000` in the repo folder, then open http://localhost:8000. The service worker only runs over http(s), not from a `file://` URL.

## Screens (all in the one page, toggled with the `hidden` attribute)

| id | Screen | What it does |
|---|---|---|
| `welcome` | Welcome | First-run guide in 5 short steps. Reopened by the "How it works" chip. |
| `week` | Your week | Pick a focus. Targets auto-fill from guidelines, editable with − / + steppers. Collapsible "Where these numbers come from" with sources. |
| `home` | Setup | "This week" progress panel and a **Smart pick for today**, then Type (Mix, Burn, Strength, Athlete, Mobility), Minutes (5 / 15 / 25 = 1 / 3 / 5 rounds), Level (Build / Strong / Beast), Start button. |
| `play` | Card | The face-up card: type label, move name, animated stick figure, cue, Easier/Harder buttons, "Watch how" link, then reps + Done **or** timer + bar. Below: big "I'm bored" button, Pause, Next card. Rests show a dashed face-down card. |
| `end` | Between rounds / end | Session progress bar, today's stats (rounds, work minutes, new records), the week panel, next-round preview, "Next round" / "Call it a win". After the last round: "Bonus round" / "Finish". |

There's also a bottom-sheet dialog (`#scrim` / `.sheet`) used by the bored-button escalation. Never use `alert`, `confirm` or `prompt`.

## Data model

### Moves (`MOVES` array)

```js
{ m: "burn" | "str" | "ath" | "mob",   // type
  n: ["Build name", "Strong name", "Beast name"],  // three levels
  r: [10, 12, 8],      // reps per level. Missing = timed card
  s: 1,                // one side at a time. Timed cards beep "switch sides" at halfway; rep cards say "each side"
  c: "Cue text",       // one or two plain sentences
  g: "push" | "pull" | "legs" | "core",  // muscle group, added from the GROUP map keyed by n[0]
  id }                 // index, added at load
```

There are about 12 burn, 18 strength, 11 athlete and 12 mobility moves. **Pull moves are thin** (towel door rows, table rows, prone raises) because there's no pull-up bar. Adding a doorframe bar or a resistance band option is a good future feature.

### Wildcards (`WILD` object, by category)

`burst` (all-out 20–40 s), `emom` (every minute on the minute: reps, tap Done, rest for the rest of the minute), `count` (max reps in 30 s with a +1 tap counter, saves personal bests), `hold`, `choice` (pick one of two in 6 seconds, or the deck picks), `scene` (go to the stairs, kitchen counter or doorframe), `story`, `music`.

Wildcard learning: `ss_wild` stores `{category: {u: used, f: finished}}`. Categories are picked with weights `(f+1)/(u+2)+0.15`, so the ones that keep her going come up more often.

### Timing rules

- **Burn cards follow a ladder across the session**, inspired by Growingannanas: 40 s, then 30 s, then 20 s. The index is `floor((round-1)*3/totalRounds)`. Bonus rounds stay at 20 s.
- Strength and athlete holds: 40 s. Mobility: 40 s (45 s in Mobility mode). Wildcards set their own `dur`.
- Rest after a card: burn 10 s, strength 20 s, athlete 20 s, mobility 10 s, wildcard 10 s.
- **Deck per round:** Mobility mode = 5 mobility cards. Mix = 2 burn + 1 strength + 1 athlete, shuffled. Other modes = 4 of that type. Then always **1 mobility "flexibility finisher" last**. There's a 40% chance one non-finisher card is swapped for a wildcard. No repeats within a session until the pool runs out.
- Card selection is weighted toward muscle groups that are behind on their weekly sets (`weightedShuffle`).

### Weekly goals

`ss_goals = { focus, vig, str, sets, mob }`

| Focus | Vigorous min/wk | Strength days | Sets per muscle group/wk | Mobility days |
|---|---|---|---|---|
| Health basics | 75 | 2 | 4 | 2 |
| Get fitter | 150 | 2 | 6 | 2 |
| Get stronger | 75 | 3 | 10 | 2 |
| Build muscle | 75 | 3 | 14 | 2 |
| Flexibility | 75 | 2 | 6 | 5 |
| All-round athlete | 120 | 3 | 10 | 3 |

`ss_log = { "YYYY-MM-DD": { vig: seconds, mob: seconds, sets: {push, pull, legs, core} } }`, keyed by **local** date and pruned after 35 days. The week starts on Monday.

How work is credited (`credit()`):
- Vigorous seconds: burn, athlete and all-out wildcard work, **plus the short rest after them**. Partial cards count the time actually done.
- Sets: +1 to the move's muscle group when a strength/athlete card (or a hold/EMOM wildcard with a `g`) is **finished**.
- Mobility seconds: mobility cards and the deep-squat hold.
- A **strength day** = 6+ sets that day (`STR_DAY`). A **mobility day** = 90+ s of mobility (`MOB_DAY`).

**Smart pick** (`suggestion()`): computes what's still needed versus days left, with urgency scores:
- vigorous: `need / (daysLeft × 10)`
- strength: `need / strengthSlots`, where `strengthSlots` is roughly days left ÷ 2, damped if she did strength yesterday (about 48 h recovery)
- mobility: `need / daysLeft`

The highest score wins. Mix is chosen when cardio and strength are both urgent. Minutes are scaled to the per-day need. When everything is met, it suggests 5 easy mobility minutes.

### Set weekly plans

`ss_plan = { type: "shuffle" | "zero", done: { "<Monday YYYY-MM-DD>": [day indexes] } }`. A plan day plays one exercise per round (so "Call it a win" works between exercises) and one card per set, with the plan's own rest between sets. Easier/Harder are hidden on plan cards; Shake it up still swaps in a wildcard. A day gets its checkmark when it ends, early or not. Zero still needs: the 12th Full Body (day 1) exercise and the Day 6 HIIT. The third Day 1 exercise name was hidden in the screenshot and is a guess ("Alternating reverse lunge with rotation").

### Other localStorage keys

`ss_seen` (welcome done), `ss_level`, `ss_mode`, `ss_mins` (last choices), `ss_today` (`{d, rounds, secs, prs}`), `ss_best` (max-rep records), `ss_wild`.

**Keep these keys, or migrate them.** Julie may already have data saved. If you rename anything, write a one-time migration.

## Stick-figure pictures

A side-view cowgirl facing right (hat and ponytail), drawn as SVG polylines (`#fig`, viewBox `0 -14 200 132`, ground at y=111).

- **Pose format:** `{hx, hy, t, ua, fa, ua2, fa2, th, sh, th2, sh2}`, where `hx, hy` is the hip position.
  - `t` = torso angle (0 = straight up, +90 = pointing forward).
  - Limb angles: 0 = straight down, +90 = forward, 180 = up, −90 = back.
  - The `2` suffix = the far limb, drawn at 38% opacity.
- **Segment lengths:** torso 34, neck 12, upper arm 18, forearm 17, thigh 22, shin 22. Head radius 7.5. Scale: about 1.8 cm per unit, so a chair seat is y=86, a step is 10 high, a counter top is y≈61.
- **Poses are generated.** `tools/poses.py` places hands and feet (`at(x, y)`) and solves the angles so knees and elbows only bend the natural way. Face-up poses with the head on the right are the one exception (the figure is then seen from its other side), so they force the bend side. Run it, then check `debug/poses.html`.
- `FIG` maps **any level's move name** to `{s: pose loop, p: prop}`. A level without its own entry uses the Build entry. Easier/Harder redraws the figure.
- `PROPS` are drawn behind the figure; a prop with `tether` draws a towel from that point to the near hand (towel door rows).
- The animation interpolates between poses: 1150 ms per segment, with 850 ms of movement and an ease-in-out. It respects `prefers-reduced-motion` by showing one static pose.
- Still approximate because they really need a front view: side plank, Cossack squat, 90/90, lateral bounds, jumping jacks.
- "Watch how ↗" links to a YouTube search for the current level's move name.

## Sources behind the weekly targets

- WHO 2020 and the US Physical Activity Guidelines (2nd ed., 2018): 75–150 min vigorous (or 150–300 moderate) per week. Muscle-strengthening for all major groups on 2+ days. No minimum bout length. Benefits continue beyond 300 moderate-equivalent minutes.
- Pelland et al., *Sports Medicine* 2025, "The Resistance Training Dose Response" (67 studies): more weekly sets means more hypertrophy and strength, with diminishing returns. Higher frequency helps strength.
- ACSM 2011 position stand: resistance training 2–3 days/week with about 48 h between sessions for the same muscle group. Flexibility 2–3 days/week (daily is better), about 60 s total per muscle group.
- Stamatakis et al., *Nature Medicine* 2022 (VILPA): about 3 vigorous bursts of 1–2 minutes a day were associated with substantially lower mortality in non-exercisers.
- Training inspiration (not copied): Growingannanas (no-repeat HIIT ladders), Natacha Océane's MOVE program (athleticism, power, calisthenics, control), Tom Merrick / Bodyweight Warrior (active flexibility, strength at end range), classic calisthenics progressions.

## Planned features (not built yet)

1. **Voice buddy:** Julie records short clips in her own voice, tagged by moment (start, halfway, struggling, bored, done). The app plays a random clip from the right tag. Needs microphone recording plus local storage (IndexedDB), or a file upload fallback.
2. **Soothe room:** she uploads MP3s that feel good to her, tags them by mood (calm, cozy, focus, sleep, energizing), and plays them by mood. MP3s could also be beat-analyzed so moves switch on the drop.
3. **Mood check on open:** "How are you right now?" routes to Move, Soothe, Breathe or Buddy. This is the long-term "wellness app" shape.
4. **Data backup:** export/import of all localStorage as JSON, because iPhone Home Screen apps keep separate storage from Safari.
5. Better pull exercises (doorframe bar or bands), and front-view poses for lateral moves.

**Spotify note:** Spotify removed audio-features and audio-analysis (beats, BPM) from its Web API for new apps in November 2024. Since February 2026, development-mode apps need the owner to have Premium and are limited to a few users. Song-change syncing is possible, beat syncing isn't. Prefer her own MP3s for anything beat-based.

## Engineering rules for this repo

- Keep it **mobile-first** (test at 390×844 and 375×667), no horizontal scroll, safe-area insets respected, buttons reachable by thumb.
- Keep it **offline-capable and installable**: PWA manifest, service worker, Apple touch icon, `apple-mobile-web-app-capable`.
- No accounts, no backend, no analytics, unless Julie explicitly asks.
- Keep light and dark themes working through tokens. Never hard-code a color in a component.
- Respect `prefers-reduced-motion`: sparkles and confetti must turn off.
- Keep the copy short and plain. Themed flavor lives in headings, celebrations and wildcard names, not in instructions.
- After every change: open it in a browser at phone size, click through Welcome → Week → Setup → a full round → End, and check the console for errors.
- Commit after each working step with a clear message, so any change can be undone.
