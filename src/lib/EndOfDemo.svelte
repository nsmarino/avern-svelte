<script>
    // @ts-ignore
    const config = Avern.Store.config

    function closeTutorial(){
      Avern.Store.endOfDemoVisible.set(false)
    }

</script>

<div class="menu-bg">
  <div class="menu-pane tutorial">
    <h2 class="menu-heading">End of Demo</h2>
    <div>
      <p>This concludes the gameplay demo of <span>FORTRESS SHEPHERD EUNUCH</span>.</p>
      <p>The game remains under active development. Updates and development logs are available on <a href="https://avern-systems.itch.io/fse" target="_blank">itch.io</a> and <a href="https://www.instagram.com/yard_gfx/" target="_blank">instagram</a>.</p>
      <p>Thank you for playing! If you wish, you can return to the Cliffs area to try out the dagger that Yoshua gave you.</p>
      <button on:click={closeTutorial}>Close</button>
    </div>
  </div>
</div>

<style>
    a {
        color: var(--avern-green);
    }
    span {
        color: white;
    }
</style>

  