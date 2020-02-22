<script>
  import LetterFinder from './LetterFinder.svelte';

  let ww = null;
  let wwSupported = true;

  let data = null;

  let algo = 'sentence';
  let config = {};

  function handleConfig(configEvent) {
    config = configEvent.detail;
  }

  function handleStart(startEvent) {
    ww.postMessage({ type: 'start', algo, config });
  }

  window.addEventListener('load', () => {
    if (window.Worker) {
      ww = new Worker('ww.js');

      ww.onmessage = message => {
        if (message.data.type === 'config') {
          config = message.data.config;
        } else {
          data = message.data;
        }
      }

      ww.postMessage({ type: 'get-config', algo });
    } else {
      wwSupported = false;
    }
  });
</script>

<div class="pure-g">
  {#if !wwSupported}
    <span class="pure-u-1">Web workers are not supported</span>
  {:else}
    <div class="pure-u-1">
      <select>
        <option>Letter finder</option>
      </select>
      <button type="button" on:click={handleStart}>Start</button>
    </div>
    <LetterFinder on:config={handleConfig} config={config} data={data}></LetterFinder>
  {/if}
</div>