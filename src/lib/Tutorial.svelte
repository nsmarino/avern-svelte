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
    <h2 class="menu-heading">title</h2>
    <div>
      tutorial content
      <button on:click={closeTutorial}>Close</button>
    </div>

  </div>
</div>
  