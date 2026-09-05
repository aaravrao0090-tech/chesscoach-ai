# ChessCoach AI

A polished, runnable local prototype for an AI chess-coaching workspace. It intentionally distinguishes demo UI from verified chess data and external AI services.

## Run

Open `index.html` in a modern browser, or serve the directory:

```powershell
cd outputs/chesscoach-ai
python -m http.server 8080
```

Then visit `http://localhost:8080`. A local server is required for the browser screen-sharing permission flow in many browsers.

## Included, working now

- Responsive dashboard, multiple stateful workspace tabs, coaching chat, game library, opening lab, endgame and tactic views, settings, and a video-call-style workspace.
- Interactive local board with selectable/movable pieces, FEN board-layout loading, PGN metadata import, and board annotations via last-move highlighting.
- Explicit browser `getDisplayMedia()` screen-share consent flow. The demo never captures or transmits a screen unless the browser permission flow is completed.
- No invented player ratings, engine evaluation, games, opening statistics, tablebase results, or account access.

## Production architecture

Use a Next.js + TypeScript application with these boundaries:

| Area | Recommended implementation |
| --- | --- |
| Chess state | `chess.js` validates legal moves, PGN/FEN, variations and game reconstruction. A board component renders controlled annotations. |
| Engine | Stockfish WASM in a Web Worker. Emit depth, nodes, MultiPV, and evaluation only from worker messages. Analyze only the active workspace. |
| Chess.com | Backend route proxies Chess.com public API calls (for example `/pub/player/{username}/games/{year}/{month}`) with caching/rate limits. Public endpoints are not an OAuth login; offer PGN import when an API cannot authorize access. |
| AI coach | Server-side Realtime/Responses adapter receives structured context and calls validated tools such as `get_current_position`, `run_stockfish`, `draw_arrow`, and `show_variation`. Never permit model-generated browser JavaScript. |
| Voice/video | WebRTC or a realtime provider for microphone audio; explicit `getUserMedia`/`getDisplayMedia` permissions. Stream text and speech chunks. Keep camera and screen video separate. |
| Data | PostgreSQL tables: users, chess_accounts, games, analyses, training_sessions, coach_messages, saved_positions, settings, and user_memory. Store only consented content. |

## Controlled AI tools

Validate parameters server-side and expose a fixed allowlist: `getCurrentPosition`, `loadPosition`, `makeMove`, `analyzePosition`, `runStockfish`, `getOpeningData`, `getPlayerGames`, `drawArrow`, `highlightSquare`, `clearAnnotations`, `showVariation`, `createExercise`, `startScreenShare`, and `stopScreenShare`.

## Privacy and limitations

- Calls, camera, microphone, screens, and transcripts must be opt-in. Do not record calls or save screen recordings by default.
- A browser cannot secretly inspect arbitrary desktop applications. Screen sharing requires a user’s selection and permission; transmitting frames to a vision model needs prominent consent and a service agreement.
- This prototype’s board intentionally allows free exploration. Add `chess.js` before presenting moves as legal.
- The UI labels Stockfish and opening data as unavailable until a real adapter supplies verifiable results.

## Tests to add in the production app

Test PGN/FEN parsing, legal moves/variations, engine worker protocol, data-source labeling, backend authorization/rate limits, Chess.com API failures, tool schemas, consent/permission errors, call state transitions, session persistence, and mobile accessibility.

## Deployment

Host the static prototype anywhere. For production, deploy the Next.js backend separately from the browser, use HTTPS (required for media permissions in production), secure HTTP-only session cookies, CSP, CSRF protection where relevant, input validation, rate limiting, and a managed PostgreSQL database.
