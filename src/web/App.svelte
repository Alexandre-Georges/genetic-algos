<script>
  import LetterFinder from './LetterFinder.svelte';
  import Calculation from './Calculation.svelte';
  import Mastermind from './Mastermind.svelte';

  let ww = null;
  let wwSupported = true;

  let data = null;

  let algo = null;
  let timeout = 10;
  let defaultConfig = null;
  let currentConfig = null;

  function handleConfig(configEvent) {
    currentConfig = configEvent.detail;
  }

  function setAlgo(newAlgo) {
    algo = newAlgo;
    requestConfig();
  }

  function requestConfig(newAlgo) {
    defaultConfig = null;
    currentConfig = null;
    ww.postMessage({ type: 'get-config', algo });
  }

  function handleStart(startEvent) {
    data = null;
    console.log(currentConfig);
    ww.postMessage({ type: 'start', algo, timeout, config: currentConfig });
  }

  window.addEventListener('load', () => {
    if (window.Worker) {
      ww = new Worker('ww.js');

      ww.onmessage = (message) => {
        if (message.data.type === 'config') {
          defaultConfig = message.data.config;
        } else {
          data = message.data;
        }
      };

      setAlgo('sentence');
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
    max-width: 100rem;
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

<!-- svelte-ignore a11y-no-onchange -->
<div class="container pure-g">
  {#if !wwSupported}
    <span class="pure-u-1">Web workers are not supported</span>
  {:else}
    <form class="pure-u-1 pure-form">
      <select on:change={(event) => setAlgo(event.target.value)} class="pure-input-1-2">
        <option value="sentence">Letter finder</option>
        <option value="calculation">Calculation</option>
        <option value="mastermind">Mastermind</option>
      </select>
      <input bind:value={timeout} type="number" placeholder="Timeout between generations" />
      <button type="button" class="start-button pure-button pure-button-primary" on:click={handleStart}>Start</button>
    </form>
    <hr class="separator pure-u-1" />
    {#if algo === 'sentence'}
      <LetterFinder on:config={handleConfig} {defaultConfig} {data} />
    {:else if algo === 'calculation'}
      <Calculation on:config={handleConfig} {defaultConfig} {data} />
    {:else if algo === 'mastermind'}
      <Mastermind on:config={handleConfig} {defaultConfig} {data} />
    {/if}
  {/if}
</div>
