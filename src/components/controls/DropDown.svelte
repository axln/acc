<script lang="ts">
  import { autoClose } from '~/lib/autoClose';

  let dropdown: HTMLDivElement;
  let className: string | undefined = undefined;
  export let clickToggle = true;
  export { className as class };

  export function close() {
    dropdown.toggleAttribute('data-opened', false);
  }

  export function show() {
    dropdown.toggleAttribute('data-opened', true);
  }
</script>

<div class="dropdown {className}" bind:this={dropdown} use:autoClose>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="caption"
    onclick={clickToggle
      ? () => {
          dropdown.toggleAttribute('data-opened');
        }
      : null}>
    <slot />
  </div>

  <div class="popover" data-role="popover">
    <slot name="content" />
  </div>
</div>

<style lang="scss">
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

  .popover {
    display: none;
    position: absolute;
    background-color: #fff;
    right: 0;
    padding: 5px 0;
    border-radius: 3px;
    box-shadow:
      0 1px 3px rgb(0 0 0 / 6%),
      0 2px 6px rgb(0 0 0 / 6%),
      0 3px 8px rgb(0 0 0 / 9%);
    user-select: none;
  }

  .dropdown {
    position: relative;

    &[data-opened] {
      > .caption {
        color: #fff;
      }

      > .popover {
        display: block;
      }
    }
  }
</style>
