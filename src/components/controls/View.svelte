<main class="view">
  <slot name="header" />
  <slot />
</main>

<style lang="scss">
  .view {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }
</style>
