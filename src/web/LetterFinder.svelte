<script>
  import { createEventDispatcher } from 'svelte';

  export let data = null;
  export let config = null;
  let history = '';
  let finalData = null;

	const dispatch = createEventDispatcher();

  $: {
    if (data) {
      if (data.type === 'new-state') {
        history = `Generation ${data.state.generation} : ${data.state.best}<br>${history}`;
      } else if (data.type === 'end') {
        finalData = data.state;
      }
    }
  }

  function updateConfig(event) {
    dispatch('config', config);
  }
</script>

<div class="pure-u-1">
  <div class="pure-g">
    <div class="pure-u-1-3">
      <form on:submit|preventDefault={updateConfig} class="pure-form pure-form-stacked">
        <fieldset>
          <legend>Model Parameters</legend>

          <label for="sentence">Sentence to find</label>
          <input bind:value={config.answer} on:change={updateConfig} id="sentence" type="text" placeholder="Sentence">

          <label for="population-size">Population Size</label>
          <input bind:value={config.populationSize} on:change={updateConfig} id="population-size" type="number" placeholder="Population Size">

          <label for="mutation-rate">Mutation Rate</label>
          <input bind:value={config.mutationRate} on:change={updateConfig} id="mutation-rate" type="number" placeholder="Mutation Rate">

          <label for="gene-mutation-rate">Gene Mutation Rate</label>
          <input bind:value={config.geneMutationRate} on:change={updateConfig} id="gene-mutation-rate" type="number" placeholder="Gene Mutation Rate">
        </fieldset>
      </form>
    </div>
    <div class="pure-u-2-3">
      {#if finalData}
        <div>Solution found after {finalData.generation} generation(s) : {finalData.best}</div>
      {/if}
      {@html history}
    </div>
  </div>
</div>