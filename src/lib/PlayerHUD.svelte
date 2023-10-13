<script>
    const player = Avern.Store.player
</script>
<div>
    <div class="player-state">
        <!-- Top Left -->
        <div class="bars">
          <div class="health-bar">
            <div class="health"><div class="inner-health" style="width: {($player.hp / $player.maxHp) * 100}%"></div></div>
          </div>
          <div class="energy-bar">
            <div class="energy">
              <div class="inner-energy" style="width: {($player.energy / $player.maxEnergy) * 100}%"></div></div>
              <div style="position:absolute; left: 4px; font-size: 8px;">{Math.floor($player.energy)}</div>

            </div>
        </div>
        <!-- Top Right -->
        <div class="xp">
          <div class="xp-inner"><span>{$player.xp}</span></div>
        </div>
      </div>
</div>