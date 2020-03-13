<script>
  import { createEventDispatcher } from 'svelte';

  export let data = null;
  export let defaultConfig = null;

  let hasReceivedConfig = false;
  let localConfig = {};
  let histories = [];
  let finalGeneration = null;

  const dispatch = createEventDispatcher();

  $: {
    if (data) {
      if (data.type === 'new-state') {
        histories = [{ generation: data.state.generation, best: data.state.best }, ...histories];
      } else if (data.type === 'end') {
        finalGeneration = data.state.generation;
      }
    } else {
      histories = [];
      finalGeneration = null;
    }
  }

  $: {
    if (hasReceivedConfig === false && defaultConfig !== null) {
      localConfig = Object.assign({}, defaultConfig);
      localConfig.numbers = JSON.stringify(defaultConfig.numbers).replace(/"/g, '');
      hasReceivedConfig = true;
    }
  }

  function updateConfig() {
    let numbers = null;
    try {
      numbers = JSON.parse(localConfig.numbers);
    } catch {
      // ignoring the JSON.parse errors
      return;
    }
    dispatch('config', Object.assign({}, localConfig, { numbers }));
  }
</script>

<style>
  .history {
    background-color: white;
  }

  tr.final {
    background-color: brown;
    color: white;
  }
</style>

<div class="pure-u-1">
  <div class="pure-g">
    <div class="pure-u-2-5">
      <form on:submit|preventDefault={updateConfig} class="pure-form pure-form-stacked">
        <fieldset>
          <legend>Model Parameters</legend>

          <label for="result">Result to find</label>
          <input
            bind:value={localConfig.answer}
            on:change={updateConfig}
            id="result"
            class="pure-input-1"
            type="number"
            placeholder="Result" />

          <label for="numbers">Numbers</label>
          <input
            bind:value={localConfig.numbers}
            on:change={updateConfig}
            id="numbers"
            class="pure-input-1"
            type="text"
            placeholder="Numbers" />

          <label for="population-size">Population Size</label>
          <input
            bind:value={localConfig.populationSize}
            on:change={updateConfig}
            id="population-size"
            class="pure-input-1"
            type="number"
            placeholder="Population Size" />

          <label for="mutation-rate">Mutation Rate</label>
          <input
            bind:value={localConfig.mutationRate}
            on:change={updateConfig}
            id="mutation-rate"
            class="pure-input-1"
            type="number"
            placeholder="Mutation Rate" />

          <label for="gene-mutation-rate">Gene Mutation Rate</label>
          <input
            bind:value={localConfig.geneMutationRate}
            on:change={updateConfig}
            id="gene-mutation-rate"
            class="pure-input-1"
            type="number"
            placeholder="Gene Mutation Rate" />
        </fieldset>
      </form>
    </div>
    <div class="pure-u-1-5" />
    <div class="pure-u-2-5">
      <table class="history pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>Generation</th>
            <th>Best Individual</th>
            <th>Result</th>
          </tr>
        </thead>
        {#if histories.length === 0}
          <tr>
            <td colspan="3">No history yet</td>
          </tr>
        {/if}
        {#each histories as history, index}
          <tr class={history.generation === finalGeneration ? 'final' : ''}>
            <td>{history.generation}</td>
            <td>
              {#each history.best.state as stateUnit}{stateUnit}{/each}
            </td>
            <td>{history.best.extras.result}</td>
          </tr>
        {/each}
      </table>
    </div>
  </div>
</div>
