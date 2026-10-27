# Cricket 72-0 (T20 World Cup Edition)

An arcade draft and simulation challenge inspired by the viral *38-0: Football Draft* game.

Can you draft an all-time Starting XI across 10 Men's T20 World Cup editions (2007–2026) and simulate a 72-match international gauntlet without suffering a single defeat?

---

## Game Mechanics

1. **11-Round Tournament Draft:**
   - Spin the randomized wheel each round to land on a historical World Cup squad (e.g., *India 2007*, *Pakistan 2009*, *West Indies 2012*, *Sri Lanka 2014*, *England 2022*, *India 2024*).
   - Select **exactly 1 player** to add to your starting XI.
   - **No Duplicate Athletes:** Drafting an athlete in one edition prevents drafting any of their other editions in later rounds.
2. **Edition-Specific Player Ratings (60–99 OVR):**
   - Player ratings are mathematically computed strictly from their performance in that specific tournament year with Bayesian shrinkage for small sample sizes.
   - *Example:* Virat Kohli is **97 OVR** in 2014 (319 runs) and **86 OVR** in 2024.
3. **Tactical Balance & Neutral Conditions:**
   - Matches are simulated on standard, neutral international T20 pitches.
   - Requires at least 1 Wicketkeeper and at least 5 capable bowlers (to bowl 20 overs).
   - Features a synergy bonus (+2 Bowling OVR) for fielding both Pace and Spin bowling options.
4. **The 72-0 Gauntlet:**
   - Simulates 72 consecutive fixtures against international opponents across escalating difficulty tiers (Group Stage $\rightarrow$ Super 8s $\rightarrow$ Knockout Gauntlet $\rightarrow$ The 72-0 Boss).
   - A single loss ends the streak immediately!

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS (Glassmorphism / Google Antigravity style)
- **Animation:** Framer Motion & Canvas Confetti
- **Testing:** Vitest (TDD unit test suite)

---

## Development & Testing

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Legal & Nominative Fair Use

This application is an independent, unofficial trivia and simulation game for entertainment purposes. It is not affiliated with, endorsed by, or sponsored by the International Cricket Council (ICC), the Board of Control for Cricket in India (BCCI), or any professional franchise or player. All statistics and player references are used strictly under factual/nominative fair use.
