<script>
  import Counter from './lib/Counter.svelte'
  console.log("ok app")
</script>

<div class="ui">

  <h1>wts ?</h1>

  <div class="card">
    <Counter />
  </div>

</div>

<style>
.ui {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
}
</style>
