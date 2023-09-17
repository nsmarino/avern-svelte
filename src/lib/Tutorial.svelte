<script>
    // @ts-ignore
    const tutorial = Avern.Store.interaction

    function closeTutorial(){
      console.log("close it up!")
    }

    function updateKeyboardConfig(isLeft){
      console.log("Update!", isLeft)
    }
</script>

<div class="menu-bg">
  <div class="menu-pane">
    <h2 class="menu-heading">Opening Remarks</h2>
    <div>
      <p>FORTRESS SHEPHERD EUNUCH is primarily played with both hands on the keyboard. The mouse is to be used mainly when navigating menus.</p>

      <p>However, you will notice that hovering the cursor over the KEYBOARD MAP at the bottom of the screen provides information about what each key is used for. Please take a moment to collect your bearings and prepare for the journey ahead.</p>
        
      <p>Out of respect for the world’s left-handed population, two keyboard configurations are available. Please select the one you feel would be more comfortable for you. This setting can be changed at any time from the Pause Menu.</p>
        
      <div>
        <button on:click={() => updateKeyboardConfig(true)}>Left Handed Config</button>
        <button on:click={() => updateKeyboardConfig(false)}>Right Handed Config</button>
      </div>
        
      <p>There is much more I would like to tell you, but time is short and it would perhaps be best for you to discover the rest yourself.</p>
        
      <p>Enjoy!</p>
      <button on:click={closeTutorial}>Wake Up</button>
    </div>

  </div>
</div>
  