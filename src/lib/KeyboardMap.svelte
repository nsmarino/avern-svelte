<script>  
  import { fade } from "svelte/transition";

  import { cubicIn, cubicOut } from "svelte/easing";

  import forwardArrow from "../../assets/ui/forward.svg"
  import left from "../../assets/ui/left.svg"
  import right from "../../assets/ui/right.svg"
  import back from "../../assets/ui/back.svg"
  import interact from "../../assets/ui/interact.svg"
  import flask from "../../assets/ui/flask.svg"
  import equipment from "../../assets/ui/equipment.svg"
  import targetNext from "../../assets/ui/target-next.svg"
  import targetPrev from "../../assets/ui/target-prev.svg"
  import openMenu from "../../assets/ui/openMenu.svg"
  import spin from "../../assets/ui/strafe-toggle.svg"
  import look from "../../assets/ui/cursor-camera.svg"

    // @ts-ignore
    const config = Avern.Store.config
    // @ts-ignore
    const actions = Avern.Store.actions

    // @ts-ignore
    const player = Avern.Store.player

    // @ts-ignore
    const interaction = Avern.Store.interaction

  </script>
  {#if !$interaction.active}
  <div class="player-input" class:rightHanded={!$config.leftHanded} in:fade={{ duration: 250, delay: 300 }}>

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
      </div>

      <div class="top-row">
        <div id="flask" class="flask input-key">
          <div class="key-inner">
            <span>{$config.leftHanded ? "E" : "I"}</span>
            <img class="svg" src={flask} alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Drink healing flask</h3>
            <p>The mountain water is fresh and clear. How else could the fortress endure?</p>
          </div>
        </div>

        <div id="characterMenu" class="equipment input-key">
          <div class="key-inner">
          <span>{$config.leftHanded ? "R" : "U"}</span>
          <img class="svg" src={equipment} alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Character Menu</h3>
            <p>Select actions, change ammo type, view stats and examine items.</p>
          </div>
        </div>
      </div>

      <div class="main-row">
        <div id="action4" data-linked-action="3" class="equipment-action input-key action4 locked">
          <div class="key-inner">
            <span>{$config.leftHanded ? "A" : ";"}</span>
            <img class="svg" src="/assets/ui/aimed-shot.svg" alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Blast at close range</h3>
            <p>You stuff the barrel of the rifle with dozens of razor sharp projectiles. The closer an enemy, the more savagely will their flesh be torn.</p>
            <p style="font-family: var(--serif-italic);">[Bravado]</p>
          </div>
        </div>

        <div id="action3" data-linked-action="2" class="equipment-action input-key action3 locked">
          <div class="key-inner">
            <span>{$config.leftHanded ? "S" : "L"}</span>
            <img class="svg" src="/assets/ui/land-mine.svg" alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Set landmine</h3>
            <p>You produce an oily iron capsule from the pouch at your waist. Once planted in the earth, it can be detonated from a distance. Be careful, as the blast can harm you as well.</p>
            <p  style="font-family: var(--serif-italic);">[Guile]</p>
          </div>
        </div>

        <div id="action2" data-linked-action="1" class="equipment-action input-key action2">
          <div class="key-inner">
            <span>{$config.leftHanded ? "D" : "K"}</span>
            <img class="svg" src="/assets/ui/bayonet.svg" alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Slash with bayonet</h3>
            <p>A quick slash with the blade attachment on the rifle. Does little damage.</p>
            <p  style="font-family: var(--serif-italic);">[Bravado]</p>
          </div>
        </div>

        <div id="action1" data-linked-action="0" class="equipment-action input-key action1">
          <div class="key-inner">
            <span>{$config.leftHanded ? "F" : "J"}</span>
            <img class="svg" src="/assets/ui/muzzle-blast.svg" alt="">
          </div>
          <div class="action-active-indicator is-prepared"></div>
          <div class="action-tooltip">
            <h3>Shoot from a distance</h3>
            <p>You ready the rifle and take careful aim. Your eyes narrow and time seems to stop.</p>
            <p style="font-family: var(--serif-italic);">[Cruelty]</p>
          </div>
        </div>

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
        <div style="font-family:var(--serif); font-size: 14px;">[SHIFT] - Clear Target</div>
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

    <div class="offhand">
      <div class="top-row">
        <div id="pauseMenu" class="open-menu input-key">
          <div class="key-inner">

          <span>{$config.leftHanded ? "U" : "R"}</span>
          <img class="svg" src={openMenu} alt="">
        </div>
        <div class="action-active-indicator"></div>
        <div class="action-tooltip">
          <h3>Game Menu</h3>
          <p>Save your game, change settings, or review recent dialogue.</p>
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
          <p>Talk to people, open doors and treasure chests, make the world your oyster.</p>
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
        <div id="look" class="target-key input-key">   
          <div class="key-inner">     
            <span>{$config.leftHanded ? "N" : "V"}</span>
            <img class="svg" src={look} alt="">
          </div>
          <div class="action-active-indicator"></div>
          <div class="action-tooltip">
            <h3>Look around</h3>
            <p>Examine your environment by moving the mouse. Disables player movement.</p>
          </div>
        </div>
        <div style="font-family:var(--serif); font-size: 14px;">[SPACE] - Jump</div>

      </div>
    </div>

  </div>
  {/if}
  <style>

  </style>
  