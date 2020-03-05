<script>
  import { createEventDispatcher } from 'svelte';

  export let data = null;
  export let config = null;
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

  function updateConfig(event) {
    dispatch('config', config);
  }
</script>

<div class="pure-u-1">
  <div class="pure-g">
    <div class="pure-u-2-5">
      <form on:submit|preventDefault={updateConfig} class="pure-form pure-form-stacked">
        <fieldset>
          <legend>Model Parameters</legend>

          <label for="sentence">Sentence to find</label>
          <input bind:value={config.answer} on:change={updateConfig} id="sentence" class="pure-input-1" type="text" placeholder="Sentence">

          <label for="population-size">Population Size</label>
          <input bind:value={config.populationSize} on:change={updateConfig} id="population-size" class="pure-input-1" type="number" placeholder="Population Size">

          <label for="mutation-rate">Mutation Rate</label>
          <input bind:value={config.mutationRate} on:change={updateConfig} id="mutation-rate" class="pure-input-1" type="number" placeholder="Mutation Rate">

          <label for="gene-mutation-rate">Gene Mutation Rate</label>
          <input bind:value={config.geneMutationRate} on:change={updateConfig} id="gene-mutation-rate" class="pure-input-1" type="number" placeholder="Gene Mutation Rate">
        </fieldset>
      </form>
    </div>
    <div class="pure-u-1-5"></div>
    <div class="pure-u-2-5">
      <table class="history pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>Generation</th>
            <th>Best Individual</th>
          </tr>
        </thead>
        {#if histories.length === 0}
          <tr>
            <td colspan="2">No history yet</td>
          </tr>
        {/if}
        {#each histories as history, index}
          <tr class="{history.generation === finalGeneration ? 'final' : ''}">
            <td>{history.generation}</td>
            <td>{history.best}</td>
          </tr>
        {/each}
      </table>
    </div>
  </div>
</div>

<style>
  .history {
    background-color: white;
  }

	tr.final {
    background-color: brown;
    color: white;
  }
</style>
