<script>
    // @ts-ignore
    const characterMenu = Avern.Store.characterMenu
</script>
{#if $characterMenu}
  <div id="character-menu" class="menu-bg">
    <div class="menu-pane">
      <div class="actions">
        <div class="currently-equipped">the four actions from Avern.Store.actions in a row,on:hover for description?</div>
        <div class="all-actions">actions from all available weapons printed out</div>
      </div>

      <div class="portrait">
        <img src="/assets/portraits/castrate/characterMenu.svg" alt="">
      </div>

      <div class="flex-col">
        <div class="stats">
          <dl class="attributes">
            <dt>Vigor</dt>
            <dd>12</dd>
            <dt>Guile</dt>
            <dd>12</dd>
            <dt>Cruelty</dt>
            <dd>10</dd>
            <dt>Bravado</dt>
            <dd>10</dd>
            <dt>Serenity</dt>
            <dd>8</dd>
          </dl>
          <dl class="level-rel">
            <dt>Level</dt>
            <dd>10</dd>
            <dt>XP</dt>
            <dd>0</dd>
            <dt>Next level</dt>
            <dd>800</dd>
            <dt>Health</dt>
            <dd>40/100</dd>
          </dl>
        </div>
        <div class="item-container">
          <div class="tabs">
            <button>All</button>
            <button>Weapons</button>
            <button>Key Items</button>
            <button>Materials</button>
          </div>
          <div class="items">all items and weapons printed out as thumbnails (no border)</div>
        </div>
      </div>      
    </div>

  </div>  
{/if}

  