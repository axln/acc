<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { link, push } from 'svelte-spa-router';
  import type { MenuItem } from '~/components/controls/Menu.svelte';
  import DropDown from './DropDown.svelte';
  import Menu from '~/components/controls/Menu.svelte';
  import BackIcon from '~/components/icons/BackIcon.svelte';
  import PlusIcon from '~/components/icons/PlusIcon.svelte';
  import MenuIcon from '~/components/icons/MenuIcon.svelte';

  export let title: string;
  export let returnPath: string | undefined = undefined;
  export let addPath: string | undefined = undefined;
  export let menuItems: MenuItem[] | null = null;

  let dropDown: any = null;

  const dispatch = createEventDispatcher();
</script>

<header class="header">
  <div class="back">
    {#if returnPath}
      <a class="link" href={returnPath} use:link draggable={false}><BackIcon /></a>
    {/if}
  </div>

  <h1 class="title">
    {title}
  </h1>

  <div class="buttons">
    {#if addPath}
      <!-- <a class="link" href={addPath} use:link draggable={false}><PlusIcon /></a> -->
      <button
        class="linkbutton"
        on:click={() => {
          dispatch('add');
          push(addPath);
        }}>
        <PlusIcon />
      </button>
    {/if}

    {#if menuItems}
      <DropDown class="dropdown" bind:this={dropDown}>
        <MenuIcon />
        <Menu
          slot="content"
          items={menuItems}
          on:menu={(e) => {
            dropDown.close();
            dispatch('menu', {
              id: e.detail.id
            });
          }} />
      </DropDown>
    {/if}
  </div>
</header>

<style lang="scss">
  .header {
    position: sticky;
    top: 0;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: cadetblue;
    z-index: 1;
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

  .link {
    color: inherit;
    display: flex;
    align-items: center;
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

  .dropdown {
    color: var(--default-text-color);
  }
  .linkbutton {
    background-color: transparent;
    color: inherit;
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    padding: 0;
  }
</style>
