<script>
    import GameMenu from "../Components/Interface/GameMenu";

    // @ts-ignore
    const pauseMenu = Avern.Store.pauseMenu
    // @ts-ignore
    const GameplayComponent = Avern.GameObjects.getGameObjectByName("interface").getComponent(GameMenu)
    console.log(GameplayComponent)

    function handleClick() {
      console.log("Just testing things out")
    }
    function saveGame() {
      console.log("SAVE GAME", Avern.Store)
    }
    function loadGame() {
      console.log("LOAD GAME", localStorage)
    }
</script>

{#if $pauseMenu} 
  <div id="game-menu">
    <!-- <button on:click={handleClick} class="status">Game Paused</button> -->

    <div class="menu-pane">
      <h2>Info</h2>
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
      <div class="menu-pane">
        <h2>Files</h2>
        <div>
          <button on:click={saveGame}>Save Game</button>
          <button on:click={loadGame}>Load Game</button>
          <button>Credits</button>
          <a href="http://avern.systems" target="_blank">Avern.Systems</a>
        </div>
        <div>

        </div>
      </div>
      <div class="menu-pane">
        <h2>Settings</h2>
        <div>
          <h3>Keyboard</h3>
          <div>
            <button>Left Handed</button><button>Right Handed</button>
          </div>
          <h3>Background Music</h3>
          <h3>Sound Effects</h3>
        </div>
      </div>
    </div>
  </div>  
{/if}
  