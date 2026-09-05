# API contract (production adapter)

All routes require an authenticated application session except public username lookup. Validate request bodies and rate-limit every route.

| Method / route | Purpose |
| --- | --- |
| `GET /api/chesscom/profile?username=` | Fetch/cache public profile data. Do not represent as OAuth. |
| `GET /api/chesscom/games?username=&year=&month=` | Fetch/cache public archive month; return provider errors transparently. |
| `POST /api/games/import` | Parse/validate PGN and save only with consent. |
| `POST /api/positions/validate` | Validate FEN and return normalized game state. |
| `POST /api/analysis` | Queue engine analysis with FEN, depth and MultiPV bounds. |
| `POST /api/coach/respond` | Supply current session context to the AI adapter; execute only allowlisted tools. |
| `POST /api/sessions` | Save a consented coaching-session summary. |

Suggested bounds: depth 1–30, MultiPV 1–5, PGN 1 MB, tool-call request timeout 20 seconds. Return source metadata (`stockfish`, `opening_database`, `tablebase`, `ai_coach`) with every result.
