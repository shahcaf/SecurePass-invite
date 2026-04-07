# SecurePass-invite

This repository contains the **SecurePass Verification Bot**, the **Invite Checker Bot**, and the **Premium Landing Page**.

## 🚀 One-Click Deployment

Click the button below to deploy both bots to **Render** via Blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shahcaf/SecurePass-invite)

## 📁 Repository Structure
- `/bot`: The main SecurePass verification bot.
- `/invite-checker`: Accurately track server invites and leaderboard.
- `index.html`: Premium landing page (automatically hosted on GitHub Pages).

## 🛠️ Setup Instructions
1. **GitHub Pages**: Go to **Settings > Pages** and set the source to **GitHub Actions** to host the landing page.
2. **Render**: Click the deploy button above. You will need to provide:
   - `DISCORD_TOKEN` (for both services)
   - `CLIENT_ID` (for both services)
   - `DATABASE_URL` (CockroachDB connection string)

---
*Built for secure Discord communities.*
