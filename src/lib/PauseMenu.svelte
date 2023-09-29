<script>
  import { writable, get} from 'svelte/store'
  import { fly } from "svelte/transition";
    import { cubicIn, cubicOut } from "svelte/easing";

  import GameMenu from "../Components/Interface/GameMenu";
  import { onDestroy } from 'svelte';

  // @ts-ignore
  const config = Avern.Store.config

  // @ts-ignore
  const GameplayComponent = Avern.GameObjects.getGameObjectByName("interface").getComponent(GameMenu)

  const openingRemarksShown = Avern.Store.openingRemarksShown
  const combatTutorialShown = Avern.Store.combatTutorialShown
  const endOfDemoShown = Avern.Store.endOfDemoShown
  function saveGame() {
    console.log("SAVE GAME")
    const copyOfStore = {}
    for (const entry in Avern.Store) {
      // 'actions' is derived from Store.weapons so should not be saved to localStorage
      if (entry !== "actions") copyOfStore[entry] = get(Avern.Store[entry])
    }
    localStorage.setItem("AvernStore", JSON.stringify(copyOfStore))
  }

  function setFilesTab(tab) {
    filesTab.set(tab)
  }
  function setInfoTab(tab) {
    infoTab.set(tab)
  }

  const filesTab = writable("root")
  const infoTab = writable("log")

  onDestroy(()=> {
    console.log("On destroy?")
    filesTab.set("root")
    infoTab.set("log")
  })
  function updateKeyboardConfig(isLeft){
      if (isLeft) {
        Avern.Inputs.leftHanded = true
        Avern.Inputs.config=Avern.Inputs.leftHandedConfig
      } else {
        Avern.Inputs.leftHanded = false
        Avern.Inputs.config=Avern.Inputs.rightHandedConfig
      }
      Avern.Store.config.update(st => {
          const updatedSt = {
              ...st,
              leftHanded: isLeft
          }
          return updatedSt
        })    
      }

</script>

<div id="game-menu" in:fly={{ easing: cubicOut, y: 10, duration: 200 }} out:fly={{ easing: cubicIn, y: -10, duration: 300 }}>
  <!-- <button on:click={handleClick} class="status">Game Paused</button> -->

  <div class="menu-pane info-pane">
    <h2 class="menu-heading">Info</h2>
    <div class="tabs">
      <button on:click={()=>setInfoTab("log")} class:active={$infoTab==="log"}>Log</button>
      <button on:click={()=>setInfoTab("tutorial")} class:active={$infoTab==="tutorial"}>Tutorials</button>
    </div>
    {#if $infoTab==="log"}
    <div class="info-log">
    </div>
  {:else if $infoTab==="tutorial"}
    <div class="info-tutorial">
      {#if $endOfDemoShown}
        <h3>End of Demo</h3>
        <p>This concludes the gameplay demo of <span>FORTRESS SHEPHERD EUNUCH</span>.</p>
        <p>The game remains under active development. Updates and development logs are available on <a href="https://avern-systems.itch.io/fse" target="_blank">itch.io</a> and <a href="https://www.instagram.com/yard_gfx/" target="_blank">instagram</a>.</p>
        <p>Thank you for playing! If you wish, you can return to the Cliffs area to try out the dagger that Yoshua gave you.</p>
      {/if}
      {#if $combatTutorialShown}
        <h3>Combat</h3>
        <div class="demo-container">
          <p>Target an enemy with {#if $config.leftHanded }<span>G</span>{:else}<span>H</span>{/if}.</p>
          <p>Press {#if $config.leftHanded}<span>F</span>{:else}<span>J</span>{/if} to load your rifle.</p>
          <p>Once you've loaded the rifle, press {#if $config.leftHanded}<span>F</span>{:else}<span>J</span>{/if} again to fire.</p>
          <p>You must be on the same elevation as your target for the attack to succeed.</p>
          <p>Hover the cursor over the Keyboard Map to see what other attacks are available.</p>
      </div>
      {/if}
        {#if $openingRemarksShown}
        <div>
          <h3>Opening Remarks</h3>
          <p><span>FORTRESS SHEPHERD EUNUCH</span> is primarily played with both hands on the keyboard. Hover the cursor over the <span>Keyboard Map</span> below to learn more.</p>
          <p>Keyboard controls are available for both left-handed and right-handed players. This can be changed at any time from the Pause Menu.</p>
          <p>It is now the early morning.</p>
        </div>
        {/if}
    </div>
  {/if}

  </div>

  <div class="flex-col">
    <div class="menu-pane files-pane">
      <h2 class="menu-heading">Files</h2>
      {#if $filesTab==="root"}
        <div class="files-root">
          <button on:click={()=>setFilesTab("save")}>Save Game</button>
          <button on:click={()=>setFilesTab("load")}>Load Game</button>
          <a href="http://avern.systems" target="_blank">Avern.Systems</a>
        </div>
      {:else if $filesTab==="save"}
        <div class="files-save">
          <button on:click={()=>setFilesTab("root")}>back</button>
          <button on:click={saveGame}>SAVE GAME</button>
        </div>
      {:else if $filesTab==="load"}
        <div class="files-load">
          <button on:click={()=>setFilesTab("root")}>back</button>

          load
        </div>
      {/if}
      <div>

      </div>
    </div>
    <div class="menu-pane settings-pane">
      <h2 class="menu-heading">Settings</h2>
      <div>
        <h3>Keyboard</h3>
        <div>
          <button class="config-button" class:active={$config.leftHanded} on:click={() => updateKeyboardConfig(true)}>Use Left Handed Config</button>
          <button class="config-button" class:active={!$config.leftHanded} on:click={() => updateKeyboardConfig(false)}>Use Right Handed Config</button>
        </div>
      </div>
    </div>
  </div>
</div>    