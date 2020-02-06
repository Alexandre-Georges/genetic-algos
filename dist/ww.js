importScripts('./ww-exports.js')

onmessage = (message) => {
  if (message.data.type === 'start') {
    genetics.start(100, model, (generation, state) => {
      postMessage({ type: 'new-state', generation, state });
    }, (generation, state) => {
      postMessage({ type: 'solution-found', generation, state });
    });
  }
}