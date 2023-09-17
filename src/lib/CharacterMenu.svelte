<script>
    // @ts-ignore
    const characterMenu = Avern.Store.characterMenu
</script>
{#if $characterMenu}
  <div id="character-menu">
    <div class="actions">
      <div class="currently-equipped">currently equipped</div>
      <div class="description">description</div>
      <div class="all-actions">all actions</div>
    </div>

    <div class="portrait">portrait</div>

    <div class="offhand">
      <div class="ammo-list">ammo list</div>
      <div class="stats">stats</div>
      <div class="item-container">
        <div class="description">item description</div>
        <div class="items">all items</div>
      </div>
    </div>
  </div>  
{/if}

  