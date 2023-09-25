<script>
    // @ts-ignore
    const config = Avern.Store.config

    function closeTutorial(){
      Avern.Store.openingRemarksVisible.set(false)
    }

    function updateKeyboardConfig(isLeft){
      Avern.Store.config.update(st => {
          const updatedSt = {
              ...st,
              leftHanded: isLeft
          }
          return updatedSt
        })    
      }
</script>

<div class="menu-bg">
  <div class="menu-pane tutorial">
    <h2 class="menu-heading">Opening Remarks</h2>
    <div>
      <p><span>FORTRESS SHEPHERD EUNUCH</span> is primarily played with both hands on the keyboard. Hover the cursor over the <span>Keyboard Map</span> below to learn more.</p>
        
      <p>Keyboard controls are available for both left-handed and right-handed players. This can be changed at any time from the Pause Menu.</p>
        
      <div>
        <button class="config-button" class:active={$config.leftHanded} on:click={() => updateKeyboardConfig(true)}>Use Left Handed Config</button>
        <button class="config-button" class:active={!$config.leftHanded} on:click={() => updateKeyboardConfig(false)}>Use Right Handed Config</button>
      </div>
                
      <p>It is now the early morning.</p>
      <button on:click={closeTutorial}>Start Journey</button>
    </div>

  </div>
</div>
<style>
  span {
    color: white;
  }
</style>

  