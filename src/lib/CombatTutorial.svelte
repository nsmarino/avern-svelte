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
      <p>Defend yourself with the <span>Goatherd's Rifle.</span> If you don't have one, go back and talk to the Gatekeeper.</p>

      <div class="demo-container">
        <div>
            <p>Target an enemy with {#if $config.leftHanded }<span>G</span>{:else}<span>H</span>{/if}.</p>
            <p>Press {#if $config.leftHanded}<span>F</span>{:else}<span>J</span>{/if} to fire your rifle and generate energy.</p>
            <p>Energy is needed for more powerful attacks like the Bayonet Slash {#if $config.leftHanded}<span>D</span>{:else}<span>K</span>{/if}.</p>
            <p>Energy is also generated when you receive damage or eat fruit {#if $config.leftHanded}<span>R</span>{:else}<span>U</span>{/if}</p>
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