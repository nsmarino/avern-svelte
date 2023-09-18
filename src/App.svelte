<script>
  import CharacterMenu from "./lib/CharacterMenu.svelte";
  import PauseMenu from "./lib/PauseMenu.svelte";
  import Interaction from "./lib/Interaction.svelte";
  import KeyboardMap from "./lib/KeyboardMap.svelte";
  import Prompt from "./lib/Prompt.svelte";
  import Tutorial from "./lib/Tutorial.svelte";

  // @ts-ignore
  const pauseMenu = Avern.Store.pauseMenu

</script>

<div id="hud">
  <Prompt />
  <Interaction />
  <KeyboardMap />
  {#if $pauseMenu}
    <PauseMenu />    
  {/if}

  <CharacterMenu />
  <!-- <Tutorial />   -->
</div>

