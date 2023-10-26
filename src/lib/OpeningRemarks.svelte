<script>
    // @ts-ignore
    const config = Avern.Store.config

    function closeTutorial(){
      Avern.Store.openingRemarksVisible.set(false)
    }

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

<div class="menu-bg">
  <div class="menu-pane tutorial">
    <h2 class="menu-heading">Opening Remarks</h2>
    <div>
      <p><span>FORTRESS SHEPHERD EUNUCH</span> is primarily played with both hands on the keyboard. Hover the cursor over the <span>Keyboard Map</span> below to learn more.</p>
        
      <p>There are two keyboard configurations available: a traditional right-handed setup which uses WASD keys for movement, and a setup which uses IJKL for movement, which left-handed players might find more comfortable. You can switch between them at any time from the Pause Menu.</p>
        
      <div>
        <button class="config-button" class:active={$config.leftHanded} on:click={() => updateKeyboardConfig(true)}>Use IJKL Config</button>
        <button class="config-button" class:active={!$config.leftHanded} on:click={() => updateKeyboardConfig(false)}>Use WASD Config</button>
      </div>
      
      <p>It is now the early morning.</p>
      <button on:click={closeTutorial}>Wake Up</button>
    </div>

  </div>
</div>
<style>
  span {
    color: white;
  }
</style>

  