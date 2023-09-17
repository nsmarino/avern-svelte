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
    <h2 class="menu-heading">Fountain</h2>
    <div>
        <button>Level Up</button>
        <button>Leave</button>
    </div>
  </div>

  <div class="menu-pane">
    <h2 class="menu-heading right-align">XP</h2>
    <div>
        <div>
            <span>Vigor</span>
            <div>10</div>
        </div>
        <div>
            <span>Agility</span>
            <div>10</div>
        </div>
        <div>
            <span>Bravado</span>
            <div>10</div>
        </div>
        <div>
            <span>Guile</span>
            <div>10</div>
        </div>
        <div>
            <span>Cruelty</span>
            <div>10</div>
        </div>
        <div>
            <span>Health</span>
            <div>120</div>
        </div>

        <button>Use XP</button>
    </div>
  </div>
</div>
  