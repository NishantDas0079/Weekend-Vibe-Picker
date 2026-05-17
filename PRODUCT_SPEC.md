# Reelief: The Weekend Reset Specification

## 1. Product Concept
Reelief is a premium AI-powered entertainment concierge designed for the "Sunday Scaries" and "Friday Fatigue." It moves beyond generic algorithms by using deep emotional analysis to recommend exactly what a user needs to watch to transition from "Work Mode" to "Reset Mode."

**The Problem:** Choice paralysis. Mentally exhausted users spend 45 minutes scrolling Netflix only to end up more tired.
**The Solution:** A 30-second conversational check-in that returns 3-5 highly curated, fresh (last 1-2 years) recommendations.

## 2. Brand Identity
- **Name:** Reelief
- **Tagline:** Reset your mind, one frame at a time.
- **Mission:** To eliminate weekend choice paralysis and provide therapeutic entertainment curation.
- **Emotional Promise:** You’ll feel understood, relaxed, and recharged.

## 3. The AI Agent (ReelEngine)
The core logic resides in a Gemini-powered agent that:
1.  **Sentiment Mapping:** Maps "I had a rough week" to "Catharsis" or "Escapism."
2.  **Content Guardrails:** Strictly limited to Bollywood/Hollywood from 2023-2026.
3.  **Explanation Engine:** Instead of just a title, it provides a "Why this works for your reset."

## 4. Feature Set
- **Mood Matrix:** Interactive sliders for Exhaustion vs. Excitement.
- **Vibe Input:** Natural language field for describing the week.
- **Smart Filters:** Bollywood, Hollywood, Animation, Thriller.
- **The Reset Card:** Beautifully designed recommendation cards with "Mood Fit" scores.
- **Watchlist:** Simple persistence for future weekends.

## 5. Design Vision
- **Theme:** "Deep Cinematic Night" (Dark mode by default, rich purples, soft glows).
- **Typography:** Inter for UI, Playfair Display for headings.
- **Motion:** Staggered card entries, soft fades using Framer Motion.

## 6. MVP Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion.
- **Backend:** Node.js (Express) + Gemini 1.5 Flash.
- **State:** React Context / Local Storage for Watchlist.
