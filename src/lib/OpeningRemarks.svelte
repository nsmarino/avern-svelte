<script>
    // @ts-ignore
    const config = Avern.Store.config

    function closeTutorial(){
      Avern.Store.openingRemarks.set(false)
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
      <p>FORTRESS SHEPHERD EUNUCH is primarily played with both hands on the keyboard. The mouse is to be used mainly when navigating menus.</p>

      <p>However, you will notice that hovering the cursor over the KEYBOARD MAP at the bottom of the screen provides information about what each key is used for. Please take a moment to collect your bearings and prepare for the journey ahead.</p>
        
      <p>Out of respect for the world’s left-handed population, two keyboard configurations are available. Please select the one you feel would be more comfortable for you. This setting can be changed at any time from the Pause Menu.</p>
        
      <div>
        <button class="config-button" class:active={$config.leftHanded} on:click={() => updateKeyboardConfig(true)}>Left Handed Config</button>
        <button class="config-button" class:active={!$config.leftHanded} on:click={() => updateKeyboardConfig(false)}>Right Handed Config</button>
      </div>
        
      <p>There is much more I would like to tell you, but time is short and it would perhaps be best for you to discover the rest yourself.</p>
        
      <p>Enjoy!</p>
      <button on:click={closeTutorial}>Wake Up</button>
    </div>

  </div>
</div>

  