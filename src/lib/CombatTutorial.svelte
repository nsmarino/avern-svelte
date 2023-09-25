<script>
    // @ts-ignore
    const config = Avern.Store.config

    function closeTutorial(){
      Avern.Store.combatTutorialVisible.set(false)
    }

</script>

<div class="menu-bg">
  <div class="menu-pane tutorial">
    <h2 class="menu-heading">Combat</h2>
    <div>
      <p>The cliff path is dangerous. Defend yourself with the <span>Goatherd's Rifle.</span></p>

      <div class="demo-container">
        <div>
            <p>Target an enemy with {#if $config.leftHanded }<span>G</span>{:else}<span>H</span>{/if}.</p>
            <p>Press {#if $config.leftHanded}<span>F</span> or <span>D</span>{:else}<span>J</span> or <span>K</span>{/if} to prepare an attack.</p>
            <p>When an attack is ready, press that key again to perform it.</p>
        </div>
        <div><video src="showing-combat.mov" muted loop autoplay></video></div>
      </div>
      <button on:click={closeTutorial}>Close</button>
    </div>

  </div>
</div>

<style>
    span {
        color: white;
    }
    .demo-container span {
        background-color: var(--avern-off-black);
        border: 1px solid white;
        width: 10px;
        padding: 0px 4px;
        border-radius: 2px;
        display: inline-block;
        margin: 0 2px;
        border-bottom-width: 2px;
    }
    video {
        width: 280px;
    }
    .demo-container {
        align-items: start;
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
    }
    p {
            margin: 0 0 20px;
        }
</style>