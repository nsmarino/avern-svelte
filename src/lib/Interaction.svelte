<script>
  // @ts-ignore
  const interaction = Avern.Store.interaction
  // @ts-ignore
  const config = Avern.Store.config

</script>

    {#if $interaction.active}
      <div class="interaction-bg"></div>
      <div class="interaction-container">
        {#if $interaction.node.type==="dialogue" || $interaction.node.type==="narration"}
          <div class="interaction-content">
            {#if $interaction.node.image}
              <img src="{$interaction.node.image}" alt="">
            {/if}
            <div class="interaction-card">
              {#if $interaction.node.label}
                <h2>
                  {$interaction.node.label}
                </h2>
              {/if}
              <div class="text-content" class:narration={$interaction.node.type==="narration"}>
                {$interaction.node.text}
              </div>
              <div class="next-node-input-key">
                {$config.leftHanded ? "H" : "G"}
              </div>           
            </div>
          </div>
        {/if}

      </div>
    {/if}
