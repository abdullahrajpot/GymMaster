# Server README

Copy `.env.example` to `.env` and fill in the required values before running the server.

Example:

```bash
cp .env.example .env
# Then edit .env and add your values
```

Required variables:

- `PORT` — The port the server should listen on (default `5000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `NODE_ENV` — `development` or `production` (optional)

Start the server:

```bash
cd server
npm install
npm start
```
