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

<div>
  <form on:submit|preventDefault={updateConfig}>
    Sentence to find <input type="text" bind:value={config.answer} on:change={updateConfig}><br />
    Population size <input type="number" bind:value={config.populationSize} on:change={updateConfig}><br />
    Mutation rate <input type="number" bind:value={config.mutationRate} on:change={updateConfig}><br />
    Gene mutation rate <input type="number" bind:value={config.geneMutationRate} on:change={updateConfig}><br />
  </form>
  {#if finalData}
    <div>Solution found after {finalData.generation} generation(s) : {finalData.best}</div>
  {/if}
  {@html history}
</div>