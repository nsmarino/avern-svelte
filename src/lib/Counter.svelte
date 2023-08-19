<script>
  let count = 0
  const increment = () => {
    console.log("click event is registered here")
    count += 1
  }
</script>

<button on:click={increment}>
  count is {count}
</button>
