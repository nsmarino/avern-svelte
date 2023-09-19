<script>
    // @ts-ignore
    const characterMenu = Avern.Store.characterMenu
    // @ts-ignore
    const items = Avern.Store.items
    const weapons = Avern.Store.weapons
    const actions = Avern.Store.actions
    import { fly } from "svelte/transition";
    import { cubicIn, cubicOut } from "svelte/easing";

    import { flip } from 'svelte/animate'

    const dragDuration = 300
    let cards = Array(20).fill().map((_, i) => i + 1)
    let draggingCard
    let animatingCards = new Set()

    function swapWith(card) {
      console.log("Here is card", card)
      console.log("here is dragging card", draggingCard)
      if (draggingCard === card || animatingCards.has(card)) return
      animatingCards.add(card)
      setTimeout(() => animatingCards.delete(card), dragDuration)
      const cardAIndex = cards.indexOf(draggingCard)
      const cardBIndex = cards.indexOf(card)
      cards[cardAIndex] = card
      cards[cardBIndex] = draggingCard
    }
</script>
{#if $characterMenu}
  <div id="character-menu" class="menu-bg" in:fly={{ easing: cubicOut, y: 10, duration: 200 }} out:fly={{ easing: cubicIn, y: -10, duration: 300 }}>
    <div class="menu-pane">
      <div class="actions">
<div class="container">
  {#each $actions as action (action)}
  <div
  role="button"
  tabindex="-1"
  animate:flip={{ duration: dragDuration }}
  class="card action-tile active"
  draggable="true"
  on:dragstart={() => draggingCard = action}
  on:dragend={() => draggingCard = undefined}
  on:dragenter={() => swapWith(action)}
  on:dragover|preventDefault
>
  {action.label}
</div>{/each}
  {#each $weapons as weapon}
    {#each weapon.actions as weaponAction (weaponAction)}
      <div
        role="button"
        tabindex="-1"
        animate:flip={{ duration: dragDuration }}
        class="card action-tile"
        draggable="true"
        on:dragstart={() => draggingCard = weaponAction}
        on:dragend={() => draggingCard = undefined}
        on:dragenter={() => swapWith(weaponAction)}
        on:dragover|preventDefault
      >
        {weaponAction.label}
      </div>
    {/each}
	{/each}
</div>




        <!-- <div class="currently-equipped">
          {#each $actions as action}
            <div class="active action-tile">{action.label}</div>
          {/each}
        </div>
        <div class="all-actions">
          {#each $weapons as weapon}
            {#each weapon.actions as weaponAction}
              <div class="action-tile">{weaponAction.label}</div>
            {/each}
          {/each}
        </div> -->
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
            <button>Items</button>
            <button>Weapons</button>
          </div>
          <div class="item-thumbs">
            {#each $items as item}
              <div>{item.name}</div>
            {/each}
          </div>
          <div class="weapon-thumbs">
            {#each $weapons as weapon}
              <div>{weapon.name}</div>
            {/each}
          </div>
        </div>
      </div>      
    </div>

  </div>  
{/if}
<style>
	.container {
		display: grid;
		grid-auto-rows: 1fr;
		grid-template-columns: repeat(4, 1fr);
	}

	.card {
		display: flex;
		justify-content: center;
		align-items: center;
    text-align: center;
    color: var(--avern-red);
		background-color: var(--avern-off-black);
		font-size: 12px;
	}
</style>

  