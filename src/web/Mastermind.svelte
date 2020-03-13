<script>
  import { createEventDispatcher } from 'svelte';

  export let data = null;
  export let defaultConfig = null;

  let hasReceivedConfig = false;
  let localConfig = {};
  let histories = [];
  let finalGeneration = null;
  let objective = null;

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
      localConfig.answer = JSON.stringify(defaultConfig.answer)
        .replace(/^"/, '')
        .replace(/"$/, '');
      localConfig.colours = JSON.stringify(defaultConfig.colours)
        .replace(/^"/, '')
        .replace(/"$/, '');
      objective = defaultConfig.answer;
      hasReceivedConfig = true;
    }
  }

  function updateConfig() {
    let colours = null;
    let answer = null;
    try {
      answer = JSON.parse(localConfig.answer);
      colours = JSON.parse(localConfig.colours);
    } catch {
      // ignoring the JSON.parse errors
      return;
    }
    objective = answer;
    dispatch('config', Object.assign({}, localConfig, { answer, colours }));
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

  .token {
    height: 0.75rem;
    width: 0.75rem;
    display: block;
    border: solid 1px black;
    border-radius: 0.5rem;
    display: inline-block;
    margin-right: 0.5rem;
  }
</style>

<div class="pure-u-1">
  <div class="pure-g">
    <div class="pure-u-2-5">
      <form on:submit|preventDefault={updateConfig} class="pure-form pure-form-stacked">
        <fieldset>
          <legend>Model Parameters</legend>

          <label for="result">Combination to find</label>
          <input
            bind:value={localConfig.answer}
            on:change={updateConfig}
            id="result"
            class="pure-input-1"
            type="text"
            placeholder="Result" />

          <label for="colours">Colours</label>
          <input
            bind:value={localConfig.colours}
            on:change={updateConfig}
            id="colours"
            class="pure-input-1"
            type="text"
            placeholder="Colours" />

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
          </tr>
        </thead>
        {#if objective}
          <tr>
            <td>Objective</td>
            <td>
              {#each objective as tokenColour}
                <span style="background-color: {tokenColour}" class="token" />
              {/each}
            </td>
          </tr>
        {/if}
        {#if histories.length === 0}
          <tr>
            <td colspan="2">No history yet</td>
          </tr>
        {/if}
        {#each histories as history, index}
          <tr class={history.generation === finalGeneration ? 'final' : ''}>
            <td>{history.generation}</td>
            <td>
              {#each history.best.state as tokenColour}
                <span style="background-color: {tokenColour}" class="token" />
              {/each}
            </td>
          </tr>
        {/each}
      </table>
    </div>
  </div>
</div>
