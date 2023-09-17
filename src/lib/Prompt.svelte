<script>
    // @ts-ignore
    const prompt = Avern.Store.prompt
    const config = Avern.Store.config
  
  </script>

  {#if $prompt}
  <div class="interaction-prompt">{$prompt} <span class="prompt-input-key"><span>{$config.leftHanded ? "H": "G"}</span></span></div>
  {/if}

<style>

</style>
  