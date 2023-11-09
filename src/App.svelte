<script>
  import CharacterMenu from "./lib/CharacterMenu.svelte";
  import PauseMenu from "./lib/PauseMenu.svelte";
  import Interaction from "./lib/Interaction.svelte";
  import KeyboardMap from "./lib/KeyboardMap.svelte";
  import Prompt from "./lib/Prompt.svelte";
    import PlayerHud from "./lib/PlayerHUD.svelte";

  // @ts-ignore
  const pauseMenu = Avern.Store.pauseMenu

</script>

<div id="hud">
  <Prompt />
  <Interaction />
  <PlayerHud />
  <KeyboardMap />
  {#if $pauseMenu}
    <PauseMenu />    
  {/if}

  <CharacterMenu />
</div>

