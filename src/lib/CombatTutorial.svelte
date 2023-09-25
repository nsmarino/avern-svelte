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
            <p>Press {#if $config.leftHanded}<span>F</span>{:else}<span>J</span>{/if} to load your rifle.</p>
            <p>Once you've loaded the rifle, press {#if $config.leftHanded}<span>F</span>{:else}<span>J</span>{/if} again to fire.</p>
            <p>Hover the cursor over the <span>Keyboard Map</span> to see what other attacks are available.</p>
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