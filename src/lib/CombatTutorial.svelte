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
            <p>Some actions, like the bayonet slash {#if $config.leftHanded}<span>D</span>{:else}<span>K</span>{/if}, do not require loading, but cost a great deal more energy.</p>
            <p>Energy recovers gradually over time. It can also be recovered by dealing or receiving damage, defeating enemies, or eating Fruit.</p>
            <p>This tutorial can be viewed from the Pause Menu {#if $config.leftHanded}<span>M</span>{:else}<span>C</span>{/if} at any time.</p>
          </div>
        <div>
          <video src="showing-combat.mov" muted loop autoplay></video>
        </div>
      </div>
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