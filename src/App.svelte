<script>
  import CharacterMenu from "./lib/CharacterMenu.svelte";
  import PauseMenu from "./lib/PauseMenu.svelte";
  import Interaction from "./lib/Interaction.svelte";
  import KeyboardMap from "./lib/KeyboardMap.svelte";
  import Prompt from "./lib/Prompt.svelte";
  import OpeningRemarks from "./lib/OpeningRemarks.svelte";
  import EndOfDemo from "./lib/EndOfDemo.svelte";
    import PlayerHud from "./lib/PlayerHUD.svelte";

  // @ts-ignore
  const pauseMenu = Avern.Store.pauseMenu
    // @ts-ignore
  const openingRemarksVisible = Avern.Store.openingRemarksVisible
  const endOfDemoVisible = Avern.Store.endOfDemoVisible

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

  {#if $openingRemarksVisible}
    <OpeningRemarks />  
  {/if}

  {#if $endOfDemoVisible}
    <EndOfDemo />  
  {/if}
</div>

