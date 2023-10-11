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
      <p>Defend yourself with the <span>Goatherd's Rifle.</span></p>

      <div class="demo-container">
        <div>
            <p>Target an enemy with {#if $config.leftHanded }<span>G</span>{:else}<span>H</span>{/if}.</p>
            <p>Press {#if $config.leftHanded}<span>F</span>{:else}<span>J</span>{/if} to load your rifle.</p>
            <p>Once you've loaded the rifle, press {#if $config.leftHanded}<span>F</span>{:else}<span>J</span>{/if} again to fire.</p>
            <p>Performing actions cost energy.</p>
          </div>
        <div>
          <video src="showing-combat.mov" muted loop autoplay></video>
        </div>
      </div>
      <p>Hover the cursor over the <span>Keyboard Map</span> to see what other attacks are available.</p>
      <p>This tutorial can be viewed from the Pause Menu at any time.</p>
      <button on:click={closeTutorial} style="margin-top: 20px;">Close</button>
    </div>

  </div>
</div>

<style>
    span {
        color: white;
    }

    video {
        width: 240px;
    }
    .demo-container {
        align-items: start;
        display: flex;
        gap: 40px;
        margin-bottom: 20px;
    }
    p {
            margin: 0 0 10px;
        }
</style>