<script>
    import { writable, get} from 'svelte/store'

    // @ts-ignore
    const characterMenu = Avern.Store.characterMenu
    // @ts-ignore
    const items = Avern.Store.items
    const weapons = Avern.Store.weapons
    const actions = Avern.Store.actions
    const config = Avern.Store.config
    import { fly } from "svelte/transition";
    import { cubicIn, cubicOut } from "svelte/easing";

    import { flip } from 'svelte/animate'

    const dragDuration = 300
    let draggingCard
    let animatingCards = new Set()

    function swapWith(card) {
      if (draggingCard === card || animatingCards.has(card)) return
      animatingCards.add(card)
      setTimeout(() => animatingCards.delete(card), dragDuration)
      const cardAIndex = $actions.indexOf(draggingCard)
      const cardBIndex = $actions.indexOf(card)
      $weapons.forEach(weapon=> {
        weapon.actions.forEach(action => {
          if (action.id === card.id) {
            // console.log("This is the target", action)
            // console.log("Target should be set to:", cardAIndex+1)
            action.assignment = cardAIndex+1
          } else if (action.id === draggingCard.id) {
            // console.log("This is the selected", action)
            // console.log("Selected should be set to:", cardBIndex+1)
            action.assignment = cardBIndex+1
          }
          if (action.assignment <= 4) {
            switch (action.assignment) {
              case 1:
                action.inputKeyLeft = "F"
                action.inputKeyRight = "J"
                break;
              case 2:
                action.inputKeyLeft = "D"
                action.inputKeyRight = "K"
                break;
              case 3:
                action.inputKeyLeft = "S"
                action.inputKeyRight = "L"
                break;
              case 4:
                action.inputKeyLeft = "A"
                action.inputKeyRight = ";"
                break;
            }
          } else {
            action.inputKeyLeft = ""
            action.inputKeyRight = ""
          }
          // console.log(action.label, action.assignment)
          // switch(action.assignment) {
          //   case 1:
          //     action.inputKey = $config.leftHanded ? "F" : "J"
          //     break;
          //   case 2:
          //     break;
          //   case 3:
          //     break;
          //   case 4:
          //     break;
          //   default:
          //     action.inputKey = ""
          //     break;
          // }

        })
      })
      // not completely sure how this works but it does
      weapons.update(weapons => {
        return weapons
      })
    }
    function setItemsTab(tab) {
    itemsTab.set(tab)
  }

  const itemsTab = writable("items")

</script>
{#if $characterMenu}
  <div id="character-menu" class:rightHanded={!$config.leftHanded} class="menu-bg" in:fly={{ easing: cubicOut, y: 10, duration: 200 }} out:fly={{ easing: cubicIn, y: -10, duration: 300 }}>
    <div class="menu-pane">
      <div>
        <!-- <div class="action-descript">
          <div class="action-descript-bg"></div>
        </div> -->
        <div class="actions">
          {#each $actions as weaponAction (weaponAction)}
            <div
              role="button"
              tabindex="-1"
              animate:flip={{ duration: dragDuration }}
              class="card action-tile action{weaponAction.assignment}"
              class:assigned={weaponAction.assignment<=4}

              draggable="true"
              on:dragstart={() => draggingCard = weaponAction}
              on:dragend={() => draggingCard = undefined}
              on:dragenter={() => swapWith(weaponAction)}
              on:dragover|preventDefault
            >
              {#if (weaponAction.inputKeyLeft && weaponAction.inputKeyRight)}<span>{$config.leftHanded ? weaponAction.inputKeyLeft : weaponAction.inputKeyRight}</span>{/if}
              <img src={weaponAction.image} alt="">
              <div class="menu-action-tooltip">
                <h3>{weaponAction.label}</h3>
                <p>{weaponAction.description}</p>
              </div>
            </div>
          {/each}
        </div>        
      </div>



      <div class="flex-col">
        <div class="stats">
          <div class="attributes">
            <div class="attribute-line">
              <div>Vigor</div>
              <div>10</div>
            </div>
            <div class="attribute-line">
              <div>Guile</div>
              <div>10</div>
            </div>
            <div class="attribute-line">
              <div>Bravado</div>
              <div>10</div>
            </div>
            <div class="attribute-line">
              <div>Cruelty</div>
              <div>10</div>
            </div>
            <div class="attribute-line">
              <div>Faith</div>
              <div>10</div>
            </div>
          </div>
          <div class="level-rel">
            <div class="level-line">
              <div>Level</div>
              <div>10</div>
            </div>
            <div class="level-line">
              <div>XP</div>
              <div>0</div>
            </div>
            <div class="level-line">
              <div>Next level</div>
              <div>0</div>
            </div>
            <div class="level-line">
              <div>Health</div>
              <div>40/100</div>
            </div>
          </div>
        </div>
        <div class="item-container">
          <div class="tabs">
            <button on:click={()=>setItemsTab("items")} class:active={$itemsTab==="items"}>Items</button>
            <button on:click={()=>setItemsTab("weapons")} class:active={$itemsTab==="weapons"}>Weapons</button>
          </div>
      {#if $itemsTab === "items"}
        <div class="item-thumbs">
          {#each $items as item}
            <div>{item.name}</div>
          {/each}
        </div>
      {/if}
      {#if $itemsTab === "weapons"}
        <div class="weapon-thumbs">
          {#each $weapons as weapon}
            <div>{weapon.name}</div>
          {/each}
        </div>
      {/if}
      </div>
    </div>      
  </div>

  </div>  
{/if}

  