<script>
  import Counter from './lib/Counter.svelte'
  console.log("Svelte App", Avern)
</script>

<div class="ui">
  <div class="card">
    <Counter />
  </div>
</div>

<style>
.ui {
  position: absolute;
  top:50%;
  transform: translateY(-50%);
  left: 50px;
  background-color: brown;
  z-index: 10000;
}
</style>
