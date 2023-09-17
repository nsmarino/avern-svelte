<script>
  import CharacterMenu from "./lib/CharacterMenu.svelte";
  import PauseMenu from "./lib/PauseMenu.svelte";
  import Interaction from "./lib/Interaction.svelte";
  import KeyboardMap from "./lib/KeyboardMap.svelte";
  import Prompt from "./lib/Prompt.svelte";
  import Tutorial from "./lib/Tutorial.svelte";
</script>

<div id="hud">
  <Prompt />
  <Interaction />
  <KeyboardMap />
  <PauseMenu />
  <CharacterMenu />
  <Tutorial />  
</div>

