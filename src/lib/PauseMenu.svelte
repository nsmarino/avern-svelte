<script>
  import { writable, get} from 'svelte/store'
  import { fly } from "svelte/transition";
    import { cubicIn, cubicOut } from "svelte/easing";

  import GameMenu from "../Components/Interface/GameMenu";
  import { onDestroy } from 'svelte';

  // @ts-ignore
  const GameplayComponent = Avern.GameObjects.getGameObjectByName("interface").getComponent(GameMenu)

  function handleClick() {
    console.log("Just testing things out")
  }
  function saveGame() {
    console.log("SAVE GAME")
    const copyOfStore = {}
    for (const entry in Avern.Store) {
      copyOfStore[entry] = get(Avern.Store[entry])
    }
    console.log(copyOfStore)
    localStorage.setItem("AvernStore", JSON.stringify(copyOfStore))
    console.log("localStorage", localStorage)
  }
  function loadGame() {
    console.log("LOAD GAME", localStorage)
  }

  function setFilesTab(tab) {
    filesTab.set(tab)
  }

  const filesTab = writable("root")

  onDestroy(()=> {
    console.log("On destroy?")
    filesTab.set("root")
  })

</script>

<div id="game-menu" in:fly={{ easing: cubicOut, y: 10, duration: 200 }} out:fly={{ easing: cubicIn, y: -10, duration: 300 }}>
  <!-- <button on:click={handleClick} class="status">Game Paused</button> -->

  <div class="menu-pane info-pane">
    <h2 class="menu-heading">Info</h2>
    <div class="tabs">
      <button>Log</button>
      <button>Tutorials</button>
    </div>
    <div>
      Example content for log
    </div>
    <div>
      Example content for tutorials
    </div>
  </div>

  <div class="flex-col">
    <div class="menu-pane files-pane">
      <h2 class="menu-heading">Files</h2>
      {#if $filesTab==="root"}
        <div class="files-root">
          <button on:click={()=>setFilesTab("save")}>Save Game</button>
          <button on:click={()=>setFilesTab("load")}>Load Game</button>
          <button on:click={()=>setFilesTab("credits")}>Credits</button>
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
      {:else if $filesTab==="credits"}
        <div class="files-credits">
          <button on:click={()=>setFilesTab("root")}>back</button>

          credits
        </div>
      {/if}
      <div>

      </div>
    </div>
    <div class="menu-pane">
      <h2 class="menu-heading">Settings</h2>
      <div>
        <h3>Keyboard</h3>
        <div>
          <button>Left Handed</button><button>Right Handed</button>
        </div>
        <!-- checkboxes? -->
        <p>Show combat keymap</p>
        <p>Show navigation keymap</p>
        <h3>Background Music</h3>
        <h3>Sound Effects</h3>
      </div>
    </div>
  </div>
</div>    