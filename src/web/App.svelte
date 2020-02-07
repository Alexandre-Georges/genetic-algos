<script>
  import LetterFinder from './LetterFinder.svelte';

  let ww = null;
  let wwSupported = true;
  let data = null;

  function handleSetup(setupEvent) {
    ww.postMessage({ type: 'setup', algo: setupEvent.detail.algo, setup: setupEvent.detail.setup });
  }

  function handleStart() {
    ww.postMessage({ type: 'start' });
  }

  window.addEventListener('load', () => {
    if (window.Worker) {
      ww = new Worker('ww.js');

      ww.onmessage = (message) => {
        data = message.data;
      }
    } else {
      wwSupported = false;
    }
  });
</script>

<div class="main">
  {#if !wwSupported}
    <span>Web workers are not supported</span>
  {/if}
  <select>
    <option>Letter finder</option>
  </select>
  <button type="button" on:click={handleStart}>Start</button>
  <LetterFinder on:setup={handleSetup} data={data}></LetterFinder>
</div>