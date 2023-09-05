<script lang="ts">
  import { autoClose } from '~/lib/autoClose';

  let dropdown: HTMLDivElement;

  export function close() {
    dropdown.toggleAttribute('data-opened', false);
  }
</script>

<div class="dropdown" bind:this={dropdown} use:autoClose>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="caption"
    on:click={() => {
      dropdown.toggleAttribute('data-opened');
    }}>
    <slot />
  </div>

  <div class="content">
    <slot name="content" />
  </div>
</div>

<style lang="scss">
  $border-radius: 3px;

  .caption {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #eee;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    &:hover,
    &:active {
      color: #fff;
    }
  }

  .content {
    display: none;
    position: absolute;
    background-color: #fff;
    right: 0;
    padding: 5px 0;
    border-radius: $border-radius;
    box-shadow: 0 1px 3px rgb(0 0 0 / 6%), 0 2px 6px rgb(0 0 0 / 6%), 0 3px 8px rgb(0 0 0 / 9%);
    user-select: none;
  }

  .dropdown {
    position: relative;
    &[data-opened] {
      > .caption {
        color: #fff;
      }

      > .content {
        display: block;
      }
    }
  }
</style>
