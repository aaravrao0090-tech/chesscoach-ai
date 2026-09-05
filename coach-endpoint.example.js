// Deploy this logic SERVER-SIDE (for example in a serverless function). Never expose an AI API key in the browser.
// POST body: { message, fen, mode }
// Return JSON: { reply: "Coach's concise spoken answer" }
// The frontend uses this endpoint only when window.CHESSCOACH_COACH_ENDPOINT is configured.
