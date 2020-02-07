importScripts('./ww-exports.js')

onmessage = (message) => {
  if (message.data.type === 'setup') {
    genetics.setup(100, message.data.algo, message.data.setup, state => {
      postMessage({ type: 'new-state', state });
    }, state => {
      postMessage({ type: 'end', state });
    });
  } else if (message.data.type === 'start') {
    genetics.start();
  }
}