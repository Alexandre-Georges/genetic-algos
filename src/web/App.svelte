<script>
  import LetterFinder from './LetterFinder.svelte';

  let ww = null;
  let wwSupported = true;

  let data = null;

  let algo = 'sentence';
  let timeout = 10;
  let config = {};

  function handleConfig(configEvent) {
    config = configEvent.detail;
  }

  function handleStart(startEvent) {
    data = null;
    ww.postMessage({ type: 'start', algo, timeout, config });
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
      };

      ww.postMessage({ type: 'get-config', algo });
    } else {
      wwSupported = false;
    }
  });
</script>

<style>
  hr {
    height: 1px;
    border: 0;
    background-color: black;
  }
  .container {
    margin: 2rem auto 0;
    width: 95%;
    max-width: 60rem;
    padding: 2rem;
    border-radius: 0.4rem;
    border: 1px solid lightgray;
    background-color: whitesmoke;
  }

  .start-button {
    margin-left: 2rem;
  }

  .separator {
    margin-bottom: 2rem;
  }
</style>

<div class="container pure-g">
  {#if !wwSupported}
    <span class="pure-u-1">Web workers are not supported</span>
  {:else}
    <form class="pure-u-1 pure-form">
      <select class="pure-input-1-2">
        <option>Letter finder</option>
      </select>
      <input bind:value={timeout} type="number" placeholder="Timeout between generations" />
      <button type="button" class="start-button pure-button pure-button-primary" on:click={handleStart}>Start</button>
    </form>
    <hr class="separator pure-u-1" />
    <LetterFinder on:config={handleConfig} {config} {data} />
  {/if}
</div>
