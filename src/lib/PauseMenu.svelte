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
</script>

{#if $pauseMenu} 
  <div id="game-menu"  role="button">
    <button on:click={handleClick} class="status">Game Paused</button>
  </div>  
{/if}
  