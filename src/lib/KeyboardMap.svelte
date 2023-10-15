<script>  
  import { fade } from "svelte/transition"
  import forwardArrow from "../../assets/ui/forward.svg"
  import left from "../../assets/ui/left.svg"
  import right from "../../assets/ui/right.svg"
  import back from "../../assets/ui/back.svg"
  import interact from "../../assets/ui/interact.svg"
  import flask from "../../assets/ui/flask.svg"
  import fruit from "../../assets/ui/fruit.svg"
  import equipment from "../../assets/ui/equipment.svg"
  import targetNext from "../../assets/ui/target-next.svg"
  import targetPrev from "../../assets/ui/target-prev.svg"
  import openMenu from "../../assets/ui/openMenu.svg"
  import spin from "../../assets/ui/strafe-toggle.svg"
  import look from "../../assets/ui/cursor-camera.svg"

  // STORE VALUES:
    // @ts-ignore
    const config = Avern.Store.config
    // @ts-ignore
    const weapons = Avern.Store.weapons
    // @ts-ignore
    const actions = Avern.Store.actions
    // @ts-ignore
    const player = Avern.Store.player
    console.log($player)
    // @ts-ignore
    const interaction = Avern.Store.interaction

  </script>
  <div class="player-input" class:rightHanded={!$config.leftHanded} in:fade={{ duration: 250, delay: 300 }}>

    {#if $actions.length > 0}
      <div class="equipped">

        <div class="action-inventory">
          <div class="flask-count">
            <div class="flask-count-inner">
              <svg viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.44558 4.81608C5.9742 4.33744 5.45537 3.93532 5.01409 3.43745C4.82758 3.22703 4.78439 2.8353 4.91816 2.5908C5.11604 2.22912 4.78842 1.96983 4.85913 1.64673C5.05154 0.767542 7.52508 1.03984 8.17223 1.03984C8.68945 1.03984 9.28878 0.899866 9.66275 1.2796C10.0172 1.63947 9.76605 3.09507 9.76605 3.66972C9.76605 4.01507 9.47612 4.06281 9.23478 4.17173C8.72805 4.40041 8.94265 4.33187 8.96914 4.81608C8.99611 5.30899 9.09699 5.91105 9.2274 6.37454C9.40402 7.00224 12.7667 6.81462 13.485 7.13878C13.7702 7.26751 14.0572 7.38204 14.3483 7.5134C14.6754 7.66104 14.6652 7.87868 14.8796 8.05287C15.1039 8.23512 14.946 9.28037 14.946 9.56636C14.946 10.2307 14.946 10.895 14.946 11.5594C14.946 13.8746 14.946 16.1898 14.946 18.505C14.946 19.0244 15.1274 19.8407 14.4147 19.9211C13.7543 19.9956 13.0266 20.0759 12.3634 20.1983C9.76077 20.6788 7.09532 21 4.39426 21C3.74485 21 3.17657 20.8163 2.59383 20.5205C2.28198 20.3622 1.97713 20.1849 1.6641 20.026C1.23206 19.8066 1.26564 19.7759 1.26564 19.2467C1.26564 18.011 1.13282 16.8922 1.13282 15.6353C1.13282 14.2986 1 12.9797 1 11.6268C1 11.2918 1.4542 8.43402 1.26555 8.18773C0.990584 7.82876 2.32146 7.38235 2.48738 7.34491C2.9567 7.23901 2.3331 7.3911 4.18449 7.13878C5.72732 6.92851 5.34528 6.89774 5.72732 6.87492C7.09977 6.79295 6.17994 6.42707 6.17994 5.35555" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{ $player.flasks }</span>
            </div>
          </div>
          <div class="flask-count">
            <div class="flask-count-inner">
              <svg viewBox="0 0 28 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.09569 9.74418C9.09569 10.7661 8.72551 12.9062 9.29361 13.7924C10.0917 15.0375 11.1245 16.1451 12.1723 17.1929C13.4119 18.4324 14.9565 18.9272 16.6704 19.1721C18.6592 19.4562 21.1349 19.5562 23.1026 19.0461C24.0373 18.8038 26.498 18.4176 26.737 17.103C27.1651 14.7483 27.145 12.0315 26.1702 9.81615C25.5071 8.30912 24.7237 7.15992 23.6693 5.92985C22.7215 4.82402 21.4231 3.07761 19.945 2.65528C18.3871 2.21019 16.7849 1.97158 15.168 1.97158C13.9005 1.97158 12.6271 1.82159 11.4886 2.25945C10.9162 2.47963 9.73571 3.10957 9.41955 3.66284C9.28165 3.90417 8.9961 3.98072 8.77184 4.11264C8.51482 4.26383 8.73755 4.89663 8.44798 4.76036C7.3333 4.23581 6.42483 3.45984 5.36233 2.86219C4.75352 2.51973 3.24052 1.59627 2.94238 1" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M7.80103 5.20993C7.22049 5.20993 6.55146 5.1169 5.98382 5.24591C4.97259 5.47574 3.67873 7.07202 3.11408 7.89076C1.78322 9.8205 1 11.4286 1 13.7922" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M8.12489 5.53394C8.12489 7.49333 7.49533 9.96553 6.01981 11.3634C4.61881 12.6906 2.57112 12.9068 1 13.9543" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
                
              <span>{ $player.fruit }</span>
            </div>
          </div>
        </div>

        <div class="top-row">
          <div id="flask" class="flask input-key"  class:oom={$player.flasks===0}>
            <div class="key-inner">
              <span>{$config.leftHanded ? "E" : "I"}</span>
              <img class="svg" src={flask} alt="">
            </div>
            <div class="action-active-indicator"></div>
            <div class="action-tooltip">
              <h3>Drink healing flask</h3>
              <p>Regain health. Refills to 5 whenever you return to the Courtyard.</p>
            </div>
          </div>
          <div id="fruit" class="fruit input-key" style="width: 32px; height: 32px;" class:oom={$player.fruit===0}>
            <div class="key-inner">
              <span>{$config.leftHanded ? "R" : "U"}</span>
              <img class="svg" src={fruit} alt="">
            </div>
            <div class="action-active-indicator"></div>
            <div class="action-tooltip">
              <h3>Eat fruit</h3>
              <p>Delicious oasis fruit that restores energy. Can be found in the environment or purchased from the Smithmaster.</p>
            </div>
          </div>
        </div>

        <div class="main-row">
          
          {#each $actions as action}
          {#if action.assignment <= 4 && action.assignment !== null}
            <div id="action{action.assignment}" class="equipment-action input-key {action.assignment}" class:primed={action.primed} class:oom={(action.cost > $player.energy)} class:locked={action.locked}>
              <div class="key-inner">
                <span>{$config.leftHanded ? action.inputKeyLeft : action.inputKeyRight}</span>
                <img class="svg" src={action.image} alt="">
              </div>
              <div class="action-active-indicator"></div>
              <div class="action-tooltip">
                <h3>{action.label}</h3>
                <p>{action.description}</p>
                <p style="font-family: var(--serif-italic);">[{action.primaryModifier}]</p>
                <p style="font-family: var(--serif-italic);">[{action.secondaryModifier}]</p>
              </div>
            </div>            
          {/if}

          {/each}

          <div id="setTarget" class="target-key input-key">   
            <div class="key-inner">     
              <span>{$config.leftHanded ? "G" : "H"}</span>
              <img class="svg" src={targetNext} alt="">
            </div>
            <div class="action-active-indicator"></div>
            <div class="action-tooltip">
              <h3>Target (Left to Right)</h3>
              <p>Cycle through targets toward the right side of the screen.</p>
            </div>
          </div>

        </div>
        <div class="bottom-row">
          <div style="font-family:var(--serif); font-size: 12px; margin: auto;">[SHIFT] - Clear Target</div>
          <div id="characterMenu" class="equipment input-key">
            <div class="key-inner">
            <span>{$config.leftHanded ? "c" : "m"}</span>
            <img class="svg" src={equipment} alt="">
            </div>
            <div class="action-active-indicator"></div>
            <div class="action-tooltip">
              <h3>Character Menu</h3>
              <p>Select actions, view stats and examine items and weapons.</p>
            </div>
          </div>
          <div id="prevTarget" class="target-key input-key">   
            <div class="key-inner">     
              <span>{$config.leftHanded ? "V" : "N"}</span>
              <img class="svg" src={targetPrev} alt="">
            </div>
            <div class="action-active-indicator"></div>
            <div class="action-tooltip">
              <h3>Target (Right to Left)</h3>
              <p>Cycle through targets toward the left side of the screen. </p>
            </div>
          </div>
        </div>
      </div>      
    {/if}

    <div class="offhand">
      <div class="top-row">
        <div id="cameraUp" class="camera-down input-key" style="width: 32px; height: 32px;">   
          <div class="key-inner">     
            <span>{$config.leftHanded ? "u" : "r"}</span>
            <img class="svg" src={look} alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Raise camera</h3>
          </div>
        </div>

        <div id="forward" class="forward input-key">
          <div class="key-inner">

          <span>{$config.leftHanded ? "I" : "E"}</span>
          <img class="svg" src={forwardArrow} alt="">
        </div>
        <div class="action-active-indicator"></div>
        <div class="action-tooltip">
          <h3>Move forward</h3>
        </div>
        </div>
      </div>

      <div class="main-row">

        <div id="interact" class="interact input-key">    
          <div class="key-inner">
      
          <span>{$config.leftHanded ? "H" : "G"}</span>
          <img class="svg" src={interact} alt="">
        </div>
        <div class="action-active-indicator"></div>
        <div class="action-tooltip">
          <h3>Interact</h3>
          <p>Have conversations, pick up items, unlock gates and more.</p>
        </div>
        </div>

        <div id="left" class="left input-key">
          <div class="key-inner">           
            <span>{$config.leftHanded ? "J" : "S"}</span>
            <img class="svg" src={left} alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Turn left</h3>
          </div>

        </div>

        <div id="back" class="back input-key">
          <div class="key-inner">

          <span>{$config.leftHanded ? "K" : "D"}</span>
          <img class="svg" src={back} alt="">
        </div>
        <div class="action-active-indicator"></div>
        <div class="action-tooltip">
          <h3>Move backward</h3>
        </div>
        </div>

        <div id="right" class="right input-key">
          <div class="key-inner">

          <span>{$config.leftHanded ? "L" : "F"}</span>
          <img class="svg" src={right} alt="">
        </div>
        <div class="action-active-indicator"></div>
        <div class="action-tooltip">
          <h3>Turn right</h3>
        </div>
        </div>

        <div id="turn" class="strafe input-key">
          <div class="key-inner">

          <span>{$config.leftHanded ? ";" : "A"}</span>
          <img class="svg" src={spin} alt="">
        </div>
        <div class="action-active-indicator"></div>
        <div class="action-tooltip">
          <h3>Turn around</h3>
          <p>Spin around to face the opposite direction.</p>
        </div>
        </div>

      </div>
      <div class="bottom-row">
        <div id="cameraDown" class="camera-down input-key">   
          <div class="key-inner">     
            <span>{$config.leftHanded ? "n" : "v"}</span>
            <img class="svg" src={look} alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Lower camera</h3>
          </div>
        </div>

        <div id="pauseMenu" class="open-menu input-key">
          <div class="key-inner">

          <span>{$config.leftHanded ? "m" : "c"}</span>
          <img class="svg" src={openMenu} alt="">
        </div>
        <div class="action-active-indicator"></div>
        <div class="action-tooltip">
          <h3>Game Menu</h3>
          <p>Save your game, change settings, or review tutorials and recent interactions.</p>
        </div>
        </div>
        <div style="font-family:var(--serif); font-size: 12px; margin: auto;">[SPACE] - Jump</div>

      </div>
    </div>

  </div>
  <style>

  </style>
  