<script lang="ts">
  import type { MenuItem } from '~/components/controls/Menu.svelte';
  import { createEventDispatcher } from 'svelte';
  import DropDown from './DropDown.svelte';
  import Menu from '~/components/controls/Menu.svelte';
  import BackIcon from '~/lib/icons/BackIcon.svelte';
  import PlusIcon from '~/lib/icons/PlusIcon.svelte';
  import MenuIcon from '~/lib/icons/MenuIcon.svelte';

  export let title: string;
  export let back = false;
  export let add = false;
  export let menuItems: MenuItem[] = null;

  let dropDown: any = null;

  const dispatch = createEventDispatcher();
</script>

<header class="header">
  <div class="back">
    {#if back}
      <button
        class="button"
        on:click={() => {
          dispatch('back');
        }}>
        <BackIcon />
      </button>
    {/if}
  </div>

  <h1 class="title">
    {title}
  </h1>

  <div class="buttons">
    {#if add}
      <button
        class="button"
        on:click={() => {
          dispatch('add');
        }}>
        <PlusIcon />
      </button>
    {/if}

    {#if menuItems}
      <DropDown bind:this={dropDown}>
        <MenuIcon />
        <div slot="content">
          <Menu
            items={menuItems}
            on:menu={(e) => {
              dropDown.close();
              dispatch('menu', {
                id: e.detail.id
              });
            }} />
        </div>
      </DropDown>
    {/if}
  </div>
</header>

<style lang="scss">
  .header {
    padding: 10px;
    background-color: cadetblue;
    display: flex;
    align-items: center;
  }

  .title {
    flex: 1 1 auto;
    margin: 0;
    font-size: 18px;
    color: inherit;
    color: #fff;
    text-align: center;
    font-weight: normal;
  }

  .buttons {
    margin-left: auto;
    display: flex;
    gap: 15px;
    min-width: 24px;
  }

  .back {
    min-width: 24px;
  }

  .button {
    display: flex;
    align-items: center;
    border: none;
    padding: 0;
    cursor: pointer;
    background-color: transparent;
    color: #fff;
    &:hover,
    &:active {
      color: #eee;
    }
  }
</style>
