const QUOTES = [
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { q: "Focus on being productive instead of busy.", a: "Tim Ferriss" },
  { q: "Small daily improvements are the key to staggering long-term results.", a: "Robin Sharma" },
  { q: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
  { q: "Discipline is the bridge between goals and accomplishment.", a: "Jim Rohn" },
  { q: "Productivity is never an accident.", a: "Paul J. Meyer" },
  { q: "Do something today that your future self will thank you for.", a: "Sean Patrick Flanery" },
  { q: "Action is the foundational key to all success.", a: "Pablo Picasso" },
  { q: "What you do every day matters more than what you do once in a while.", a: "Gretchen Rubin" },
  { q: "Well done is better than well said.", a: "Benjamin Franklin" },
];

export function dailyQuote() {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return QUOTES[day % QUOTES.length];
}
