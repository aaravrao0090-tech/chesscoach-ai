/* Loads Stockfish in a Worker so calculation cannot freeze the UI. */
let engine;
try {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
  engine = typeof STOCKFISH === 'function' ? STOCKFISH() : (typeof Stockfish === 'function' ? Stockfish() : self);
  engine.onmessage = event => postMessage({ type: 'engine', data: typeof event === 'string' ? event : event.data });
  engine.postMessage('uci');
} catch (error) {
  postMessage({ type: 'error', message: 'Stockfish could not load. Check your connection or browser Worker settings.' });
}
onmessage = event => {
  if (engine && event.data?.type === 'analyze') {
    engine.postMessage('ucinewgame');
    engine.postMessage('position fen ' + event.data.fen);
    engine.postMessage('go depth ' + event.data.depth);
  }
};
