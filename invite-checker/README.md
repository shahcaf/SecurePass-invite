# Discord Invite Checker Bot

A robust Discord bot built with `discord.js v14` and `CockroachDB` to accurately track server invites, members joining, and leaving.

## Features

- **Invite Counting**: Track who invited which member.
- **Join/Leave Logging**: Automated logs for joins (who invited) and leaves.
- **Database Persistence**: All data stored securely in CockroachDB.
- **Slash Commands**:
  - `/invites`: Check your or another user's invite statistics.
  - `/leaderboard`: View the top inviters in the server.
- **Anti-Abuse**: Ignores bots and prevents duplicate tracking.

## Setup Instructions

### 1. Database Configuration
1. Create a free cluster on [CockroachDB Cloud](https://www.cockroachlabs.com/).
2. Get your connection string (PostgreSQL format).
3. Ensure the database user has permissions to create tables.

### 2. Environment Variables
Create a `.env` file in the root directory and fill in the following:
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_bot_client_id
DATABASE_URL=your_cockroachdb_connection_url
```

### 3. Installation
```bash
npm install
```

### 4. Running the Bot
```bash
# Production
npm start

# Development (requires nodemon)
npm run dev
```

## Deployment on Render
1. Push this code to a GitHub repository.
2. Connect the repository to [Render](https://render.com/).
3. Choose the **Worker** service type (it will use `render.yaml` automatically).
4. Add your environment variables in the Render dashboard.

## Technical Details
- **Language**: Node.js
- **Library**: discord.js v14
- **Database Driver**: pg (node-postgres)
- **Deployment**: Render / Background Worker
