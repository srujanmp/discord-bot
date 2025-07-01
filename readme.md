# LeetCode Daily Challenge Discord Bot

This Discord bot posts a daily LeetCode Blind 75 challenge to one or more specified Discord channels at 5 AM IST every day. Users can react to the message to indicate if they solved the problem.

---

## Features

- Posts a daily LeetCode problem from the Blind 75 list.
- Sends to multiple Discord channels.
- Adds ✅ and ❌ reaction emojis for user interaction.
- Uses cron scheduling to post once daily at 5 AM IST.

---

## Setup

### Prerequisites

- Node.js
- A Discord bot 
- Channel IDs 

### Installation

1. Clone or download this repository.

2. Install dependencies:

```bash
npm install discord.js node-cron dotenv
node app.js
```

## How the daily question is selected

- **Get current time in milliseconds:**  
  `Date.now()` returns the current timestamp in milliseconds since the Unix epoch (Jan 1, 1970 UTC).

- **Convert to days since epoch:**  
  Dividing by `(1000 * 60 * 60 * 24)` converts milliseconds to days.  
  `Math.floor()` is used to get the integer day count.

- **Rotate index using modulo:**  
  Taking `today % questions.length` cycles through the question list in a loop.  
  This means every day you get a different question, and once you reach the end, it restarts from the beginning.

- **Pick question by index:**  
  `questions[index]` fetches the question object for today’s challenge.
