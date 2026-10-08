# Shuffle Sweat: design brief

**Direction in one line:** a modern wellness app that happens to be a pink, sparkly, cowgirl fairy princess. Think of a saloon card deck in a fairy's jewellery box.

It should feel like the wellness apps people actually use today: soft rounded cards, generous space, big friendly type, gentle gradients, satisfying little animations, a bottom tab bar. The theme lives on top of that, not instead of it. It must never feel like a costume party where you can't find the Start button.

## The big idea: a lucky card deck

The app is already built around face-down cards you flip one at a time. Lean into that:

- **Card backs** look like a saloon playing card: pink with a gold star or horseshoe pattern, a thin rope border and a little sparkle in the corner.
- **Flipping a card** is the main moment of delight: a 3D flip with a short gold shimmer sweeping across.
- **Wildcards** are literally "wild cards": gold cards with a star-badge corner.
- "Shuffle" in the name already fits, so keep **Shuffle Sweat** unless Julie wants to rename it.

## Palette (starting point, tune for contrast)

Light theme, "Pink Rodeo":

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FFF1F6` | blush page background |
| `--surface` | `#FFFFFF` | cards, panels |
| `--surface-2` | `#FFE3EF` | soft pink fills, chips |
| `--ink` | `#3A1E35` | main text (deep plum, not black) |
| `--muted` | `#80607A` | secondary text |
| `--line` | `#F3CFE0` | borders, tracks |
| `--pink` | `#E23D86` | primary buttons, accents. **Check white-on-pink contrast and darken until text passes 4.5:1** |
| `--pink-soft` | `#FFB8D6` | highlights, selected states |
| `--gold` | `#E7B53C` | sparkles, records, wildcards (decoration) |
| `--gold-ink` | `#8A6212` | gold-coloured **text** on light backgrounds |
| `--lilac` | `#B9A2F5` | fairy accents, Mobility |
| `--turquoise` | `#1FA594` | western turquoise jewellery, Athlete |
| `--saddle` | `#9A5A3C` | warm leather brown, Strength, small western details |

Dark theme, "Midnight Rodeo": a deep plum night sky (`--bg #1C0F22`, `--surface #2A1631`), neon-ish pink `#FF6FAE`, gold `#FFD56B`, lilac `#C2B0FF`, turquoise `#45D1BE`. Add a faint star field in the background. Keep every color as a token so both themes stay in sync.

### Card-type colors

| Type | Theme name | Plain subtitle | Color |
|---|---|---|---|
| Mix | Lucky Draw | A bit of everything | pink + gold |
| Burn | Rodeo | HIIT cardio | hot pink |
| Strength | Ranch Strong | Calisthenics reps and holds | saddle / rose-gold |
| Athlete | Wild Mustang | Jumps, power and control | turquoise |
| Mobility | Fairy Stretch | Active flexibility | lilac |

**Always show the plain subtitle next to the theme name.** Clarity first.

## Typography (Google Fonts)

- **Display, used sparingly** (logo, celebration stamps, the big rep number): a western slab like **Rye** or **Sancreek**. Never use it for paragraphs or buttons.
- **Headings and UI:** a rounded, friendly, modern face like **Fredoka** or **Baloo 2**.
- **Body:** **Nunito** or **Quicksand** at 16–17px, line height about 1.5.
- Use tabular numbers for timers, reps and stats.

Let Claude Code show 2–3 pairings in the style tile before deciding.

## Motifs and where they go

- **Sparkles ✦:** on Done, on records, around the smart pick, and a slow twinkle on the card back. Small and quick, never constant.
- **Cowgirl hat:** on the stick figure's head, on the logo, as the "Round done" stamp.
- **Lasso rope:** a dashed rope border on rest cards (the face-down "next card" state) and on the session progress bar.
- **Sheriff star badge:** personal records ("New record!") and wildcard corners.
- **Horseshoe:** the "lucky" smart pick for today.
- **Tiara or crown:** the "Session done" screen.
- **Fairy wings or wand:** the "I'm bored" button, renamed **"Shake it up ✦"** with the subtitle "Swap for a wildcard". The wand waves when tapped.
- **Gingham:** a very faint pink gingham texture on the page background or the setup panels (optional, keep it subtle).
- **Boots:** the level picker icons (see below).

## Levels

| Plain | Theme name | Icon idea |
|---|---|---|
| Build | Pony | small boot |
| Strong | Cowgirl | boot with spur |
| Beast | Rodeo Queen | boot with spur and crown |

## Voice and copy

Playful, warm and short. Flavor goes in celebrations and headings. Instructions stay plain.

- Welcome: "Howdy, Julie ✦" / "Saddle up. One round counts."
- Start button: "Saddle up" (with the minutes and type underneath in plain words).
- Round done: "Yeehaw!" · Session done: "Rodeo Queen behavior." · Record: "New sheriff in town."
- Ending early: "You showed up. That counts, cowgirl."
- Rest: "Catch your breath, partner."
- **Never theme the move cues.** "Chest to the floor, elbows at 45°" stays exactly like that.

## Layout and modern wellness patterns

- **Bottom tab bar** (thumb-friendly): Today · Week · Records · Settings. Today holds the smart pick and quick start, so she can begin in one tap.
- **Progress rings** for the week (vigorous minutes, strength days, mobility days) instead of flat bars, with gold sparkles when a ring closes.
- Rounded corners (cards about 24px, buttons fully rounded), soft pink shadows, plenty of padding.
- **One clear primary action per screen.**
- The card screen stays focused: card, big Done or timer, Shake it up button, then Pause and Next. No tab bar during a workout.

## Motion and sound

- Card flip with a shimmer, about 450 ms.
- Sparkle burst from the Done button.
- On round end, confetti of tiny stars, hearts and hats (short, under 1.5 s).
- A rope-lasso loop draws around a goal ring when it completes.
- **Sound (optional, togglable):** a little spur "ching-ching" on Done, a soft twinkle on wildcards. Generate it with Web Audio, no files needed.
- **Everything decorative turns off with `prefers-reduced-motion`.**
- `navigator.vibrate` doesn't work on iPhone Safari, so don't rely on haptics.

## Stick figure

Make the stick figure a cowgirl: a small cowboy hat on the head, a ponytail and little boot shapes at the feet, drawn in the card's type color. Same pose system as now (see CLAUDE.md), just restyled. Optionally add sparkle trails on jumping moves.

## Accessibility guardrails

- Text contrast is at least 4.5:1 in both themes. Pink and gold are tricky, so test them.
- Tap targets are at least 44×44 px.
- Color is never the only signal. Card types also have a name and an icon.
- Visible focus rings (a gold glow works nicely).
- Plain-language labels for screen readers on themed icons.

## Avoid

- Using real brand logos, mascots or characters (no Disney princesses, no real rodeo or app brands). Everything is original.
- Glitter so heavy it hurts readability or battery.
- Western fonts in body text.
- Hiding how-to information behind theme jokes.
