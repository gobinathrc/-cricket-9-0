# Cricket 9-0 (T20 World Cup Edition)

An arcade draft and tournament simulation challenge inspired by the viral *38-0: Football Draft* game.

Can you draft an all-time Starting XI across 10 Men's T20 World Cup editions (2007–2026) and conquer the entire tournament—Group Stage, Super 8s, Semi-Final, and Final—with an invincible **9 – 0** record?

---

## The 9-0 World Cup Path

In the 20-team ICC Men's T20 World Cup format, the road to the trophy consists of **9 consecutive victories**:

1. **Group Stage (Matches 1 – 4):**
   * Match 1: vs Ireland T20
   * Match 2: vs USA T20
   * Match 3: vs Pakistan T20 (High-stakes group clash)
   * Match 4: vs Bangladesh T20
2. **Super 8 Stage (Matches 5 – 7):**
   * Match 5: vs Afghanistan T20
   * Match 6: vs West Indies T20
   * Match 7: vs Australia T20
3. **The Knockout Semi-Final (Match 8):**
   * Match 8: vs England T20
4. **The T20 World Cup Final (Match 9):**
   * Match 9: vs South Africa T20 (The Championship decider)

A single defeat at any stage ends your tournament run!

---

## Game Mechanics

1. **11-Round Tournament Draft:**
   * Spin the randomized wheel each round to land on a historical World Cup squad (e.g., *India 2007*, *Pakistan 2009*, *West Indies 2012*, *Sri Lanka 2014*, *England 2022*, *India 2024*).
   * Select **exactly 1 player** to add to your starting XI.
   * **No Duplicate Athletes:** Drafting an athlete in one edition prevents drafting any of their other editions in later rounds.
2. **Edition-Specific Player Ratings (60–99 OVR):**
   * Player ratings are mathematically computed strictly from their performance in that specific tournament year with Bayesian shrinkage for small sample sizes.
   * *Example:* Virat Kohli is **97 OVR** in 2014 (319 runs) and **86 OVR** in 2024.
3. **Tactical Balance & Neutral Conditions:**
   * Matches are simulated on standard, neutral international T20 pitches.
   * Requires at least 1 Wicketkeeper and at least 5 capable bowlers (to bowl 20 overs).
   * Features a synergy bonus (+2 Bowling OVR) for fielding both Pace and Spin bowling options.

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
