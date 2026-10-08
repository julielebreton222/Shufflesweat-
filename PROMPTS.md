# Shuffle Sweat: step-by-step prompts for Claude Code

Paste these into Claude Code **one at a time, in order**. Check the result in your browser before moving on. Each step is small on purpose, so nothing breaks in a way that's hard to undo.

---

## Before you start

1. **Install Claude Code.** Follow Anthropic's setup guide: https://docs.claude.com/en/docs/claude-code/overview
2. **Make a folder** on your Mac, for example `Documents/shuffle-sweat`, and put these four files in it:
   - `shuffle-sweat.html` (the app)
   - `CLAUDE.md` (how the app works; Claude Code reads it automatically)
   - `DESIGN.md` (the pink cowgirl fairy look)
   - `PROMPTS.md` (this file)
3. **Open Terminal in that folder** and start Claude Code by typing `claude`.
4. **Your saved progress:** anything already saved in the claude.ai version stays there. The new version starts fresh unless you use the backup feature from Step 9.

### Tips that make it go smoothly

- **Ask for a plan first on big steps.** Add "Show me your plan before you change anything" to a prompt. You approve it, then it builds.
- **Look at it after every step.** Ask "Start a local preview and tell me the link", then open it on your Mac (and on your phone if it's on the same wifi).
- **Screenshots help a lot.** Drag in a screenshot of anything you like (a wellness app, a Pinterest board) or anything that looks wrong, and say what you mean.
- **To undo:** "That's not what I wanted. Go back to the last commit."
- **When something breaks:** "The Done button doesn't do anything on the card screen. Find out why and fix it, then click through a whole round to check."
- **Keep it in your words.** "Too much glitter", "make it calmer", "I want it to feel like a jewellery box" all work.

---

## Step 1: Get to know the app (no changes)

```
Read CLAUDE.md, DESIGN.md and shuffle-sweat.html carefully. Don't change anything yet.

Then explain back to me in plain language:
1. what the app does, screen by screen
2. how the cards, the "I'm bored" button and the weekly goals work
3. anything that looks fragile, buggy or confusing in the code
4. what you'd suggest as the structure for turning this into a proper app I can install on my iPhone

Keep it short and non-technical. I'm not a developer.
```

---

## Step 2: Turn it into a proper, installable app

```
Turn shuffle-sweat.html into a small, clean project, without changing how anything looks or works yet.

- Keep it plain HTML, CSS and JavaScript, no framework, so it stays simple. Split it into sensible files (for example index.html, styles.css and separate JS files for moves/data, the workout engine, the weekly goals, and the stick figure).
- Add a proper HTML document skeleton (doctype, head, viewport meta with viewport-fit=cover).
- Make it an installable PWA for iPhone: web app manifest, service worker so it works offline, an Apple touch icon (a simple placeholder pink icon for now), and the meta tags so it opens full screen from the Home Screen.
- Keep all the existing localStorage keys exactly as they are (listed in CLAUDE.md).
- Set up git and commit this as the first version.
- Start a local preview and give me the link.

Then click through Welcome → Your week → Setup → one full round → End screen at iPhone size and confirm there are no console errors. Show me your plan before you start.
```

---

## Step 3: Design exploration (a style tile first, not the real app)

```
Read DESIGN.md. Before touching the real app, make a separate page called style-tile.html that shows 3 different takes on the pink cowgirl sparkle fairy princess wellness look, side by side or one after another.

For each take, show:
- the color palette as swatches (light and dark theme)
- the font pairing (logo, heading, body, a big rep number)
- one face-down card back and one face-up move card
- the "Shake it up ✦" button, a primary button and a selected chip
- a week progress ring
- the Yeehaw round-done stamp

Make them genuinely different, for example: (A) soft blush and gold, very calm and modern; (B) bolder hot pink with turquoise western details; (C) dreamy lilac fairy with pink and gold sparkles.

It must look like a modern wellness app first, with the theme on top. Check text contrast passes in both themes. Give me the preview link so I can pick.
```

When you've looked, reply with something like: "I like B's colors, A's fonts and C's card back. Make a final version of the tile combining those." Repeat until you love it.

---

## Step 4: Apply the chosen design to the whole app

```
Apply the final style from the style tile to the whole app, following DESIGN.md.

- Put all colors, fonts, radii, shadows and spacing in CSS variables (design tokens) in one place, with light ("Pink Rodeo") and dark ("Midnight Rodeo") themes.
- Restyle every screen: Welcome, Your week, Setup, the card screen, rest cards, the bottom sheet, and the End screen.
- Keep every feature and every piece of logic exactly as it is. This step is only about looks.
- Check it at iPhone sizes (390×844 and 375×667) in both light and dark mode, with no horizontal scrolling and nothing hidden behind the iPhone notch or home bar.

Show me your plan first, then commit when done and give me the preview link.
```

---

## Step 5: Themed names and copy

```
Update the wording to match the "Voice and copy" and "Card-type colors" sections of DESIGN.md:

- Types become Lucky Draw / Rodeo / Ranch Strong / Wild Mustang / Fairy Stretch, always with the plain subtitle shown too.
- Levels become Pony / Cowgirl / Rodeo Queen, with boot icons.
- "I'm bored" becomes "Shake it up ✦" with the subtitle "Swap for a wildcard". Keep the same escalation behavior.
- Add the celebration lines (Yeehaw!, New sheriff in town, Rodeo Queen behavior, etc.) and the welcome greeting "Howdy, Julie ✦".
- Do NOT change any exercise names or cues. Those stay plain and clear.

Show me a list of every text change before applying it.
```

---

## Step 6: The card deck feel

```
Make the cards feel like a lucky saloon card deck, as described in DESIGN.md:

- Face-down card back: pink with a gold star or horseshoe pattern, a thin rope border and a small twinkling sparkle. It's used for rests ("next card is face down").
- Flipping: a smooth 3D flip (about 450ms) with a gold shimmer sweeping across the face.
- Wildcards: gold "wild card" style with a sheriff-star corner badge.
- All of this must turn off or simplify when the phone has Reduce Motion switched on.

Draw everything with SVG and CSS (no image files needed). Commit and give me the preview link.
```

---

## Step 7: Cowgirl stick figure

```
Restyle the animated stick figure on each card into a little cowgirl, as described in DESIGN.md: a small cowboy hat on the head that tilts with the torso, a ponytail, little boots at the feet, drawn in the card's type color. Keep the existing pose system and animation from CLAUDE.md.

While you're in there, improve any poses that look wrong or unclear (side plank, Cossack squat and 90/90 are approximate). Make a debug page that shows every pose and every move's animation in a grid so I can check them all at once. Show me that page.
```

Then look through the grid and tell it which ones look off: "Pike push-ups looks like she's falling over" is perfect feedback.

---

## Step 8: Sparkles, celebrations and sounds

```
Add the micro-interactions from the "Motion and sound" section of DESIGN.md:

- a sparkle burst from the Done button
- star, heart and hat confetti when a round ends (under 1.5 seconds)
- a lasso loop that draws around a weekly goal ring when it's completed
- a spur "ching-ching" sound on Done and a soft twinkle on wildcards, generated with Web Audio and controlled by the existing Beeps toggle

Keep everything quick and light, and turn it all off with Reduce Motion. Make sure it still runs smoothly on an iPhone. Commit when done.
```

---

## Step 9: Bottom tabs, Records and backup

```
Add a bottom tab bar with Today, Week, Records and Settings (hide it during a workout):

- Today: the smart pick for today with a one-tap start, plus the normal type / minutes / level setup.
- Week: progress rings for vigorous minutes, strength days and mobility days, plus the muscle-group sets, and the "Edit my week" goals screen.
- Records: my max-rep personal bests as sheriff-star badges, rounds and work minutes this week and in total, and which wildcard types keep me going.
- Settings: sound on/off, read-aloud voice on/off, light/dark/automatic theme, "How it works" (the welcome guide), and Backup.

Backup: an "Export my data" button that copies all my saved data as text (and lets me save it as a file), and an "Import" that restores it. This matters because the iPhone Home Screen version and Safari keep separate storage.

Show me the plan first.
```

---

## Step 10: Put it online and on your iPhone

```
Help me put this app online for free so I can install it on my iPhone. I'm not technical, so give me the simplest option, step by step. Netlify Drop (drag and drop a folder) or GitHub Pages are fine. If it needs a build step, make one and tell me which folder to upload.

Then tell me exactly how to add it to my iPhone Home Screen from Safari, and how to update it later when we change things.
```

---

## Later: the wellness features

Do these one at a time, only once the workout part feels great.

**Voice workout buddy**
```
Add a "Buddy" feature from the Planned features section of CLAUDE.md: I can record short voice clips on my phone and tag each one (start, halfway, struggling, bored, done). During workouts, the app plays a random clip from the right tag. Store the recordings on the device (IndexedDB). If recording isn't allowed, let me upload audio files instead. Include a screen to listen to, re-tag and delete clips.
```

**Soothe room with my own music**
```
Add a "Soothe" room: I upload MP3s that feel good to me and tag each with a mood (calm, cozy, focus, sleep, energizing). I can browse by mood and play them with a simple, pretty player. Store them on the device. Optional: analyze the tempo of energizing tracks so Rodeo cards can switch on the beat drop.
```

**Mood check on open**
```
Make the app open with one gentle question, "How are you right now?", with a few big options (wired, sluggish, restless, low, short on time). Each one routes me to the right place: a workout type and length, the Soothe room, or a short breathing moment. Keep it skippable with one tap.
```

---

## Check-up prompt (use any time)

```
Do a full check of the app at iPhone size in light and dark mode: click through every screen and a complete session with a wildcard, the Shake it up escalation, a rep card, a timed card and a one-side move. List anything broken, ugly, confusing or slow, then fix the issues one by one and commit.
```
