<script>
  let { width, children } = $props()
</script>

<div class="background">
  <div class="content" style="width: {width}">{@render children()}</div>
</div>

<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(20px);
  z-index: 2;
}
.content {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  background-color: var(--white);
  overflow: visible;
}
</style>