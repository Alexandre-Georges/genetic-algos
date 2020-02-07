<script>
  import { createEventDispatcher } from 'svelte';

  export let data = null;
  let history = '';
  let finalData = null;

	const dispatch = createEventDispatcher();
  
  let sentence = 'Find the sentence';

  $: {
    if (data) {
      if (data.type === 'new-state') {
        history = `Generation ${data.state.generation} : ${data.state.best}<br>${history}`;
      } else if (data.type === 'end') {
        finalData = data.state;
      }
    }
  }

  function setup() {
    dispatch('setup', { algo: 'sentence', setup: { sentence } });
  }
</script>

<div>
  <form on:submit|preventDefault={setup}>
    <input type="text" value={sentence}>
    <button type="submit">Set up</button>
  </form>
  {#if finalData}
    <div>Solution found after {finalData.generation} generation(s) : {finalData.best}</div>
  {/if}
  {@html history}
</div>