<script>
  import Counter from './lib/Counter.svelte'
  console.log("ok app")
</script>

<div class="ui">

  <h1>svelte app</h1>

  <div class="card">
    <Counter />
  </div>

</div>

<style>
.ui {
  position: absolute;
  top:40%;
  left: 50px;
  background-color: brown;
  z-index: 10000;
}
</style>
