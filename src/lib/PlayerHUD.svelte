<script>
    const player = Avern.Store.player
</script>
<div>
    <div class="player-state">
        <!-- Top Left -->
        <div class="energy">
          <div class="health"><div class="inner-health" style="width: {($player.hp / $player.maxHp) * 100}%"></div></div>
        </div>
        <!-- Top Right -->
        <div class="xp">
          <div class="xp-inner"><span>{$player.xp}</span></div>
        </div>
      </div>
</div>