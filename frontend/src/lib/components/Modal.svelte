<script>
let { width, children, bgWhite } = $props()
</script>

<div class="content" class:bgWhite={bgWhite} style="width: {width}">{@render children()}</div>

<style>
.content {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  overflow: visible;
}
.bgWhite {
  background-color: var(--white);
}
</style>