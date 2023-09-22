<script>
  // @ts-ignore
  const interaction = Avern.Store.interaction
  import { fly } from "svelte/transition";
  import { cubicIn, cubicOut } from "svelte/easing";
  // @ts-ignore
  const config = Avern.Store.config

</script>

    {#if $interaction.active}
      <div class="interaction-bg" in:fly={{ easing: cubicOut, y: 10, duration: 200 }} out:fly={{ easing: cubicIn, y: -10, duration: 300 }}></div>
      <div class="interaction-container" in:fly={{ easing: cubicOut, y: 10, duration: 300 }} out:fly={{ easing: cubicIn, y: -10, duration: 300 }}>
          <div 
            class="interaction-content" 
          >
            {#if $interaction.node.image}
              <img src="{$interaction.node.image}" alt="">
            {/if}
            <div class="interaction-card">
              {#if $interaction.node.label}
                <h2>
                  {$interaction.node.label}
                </h2>
              {/if}
              <div class="text-content" class:narration={$interaction.node.type==="narration" || $interaction.node.type==="item"}>
                {$interaction.node.text}
              </div>
              <div class="next-node-input-key">
                {$config.leftHanded ? "H" : "G"}
              </div>           
            </div>
          </div>

      </div>
    {/if}
