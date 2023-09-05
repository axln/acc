<script lang="ts">
  import { Link } from 'svelte-routing';
  import type { MenuItem } from '~/components/controls/Menu.svelte';
  import { createEventDispatcher } from 'svelte';
  import DropDown from './DropDown.svelte';
  import Menu from '~/components/controls/Menu.svelte';
  import BackIcon from '~/lib/icons/BackIcon.svelte';
  import PlusIcon from '~/lib/icons/PlusIcon.svelte';
  import MenuIcon from '~/lib/icons/MenuIcon.svelte';

  export let title: string;
  export let returnPath: string = undefined;
  export let addPath: string = undefined;
  export let menuItems: MenuItem[] = null;

  let dropDown: any = null;

  const dispatch = createEventDispatcher();
</script>

<header class="header">
  <div class="back">
    {#if returnPath}
      <Link class="link" to={returnPath}><BackIcon /></Link>
    {/if}
  </div>

  <h1 class="title">
    {title}
  </h1>

  <div class="buttons">
    {#if addPath}
      <Link class="link" to={addPath}><PlusIcon /></Link>
    {/if}

    {#if menuItems}
      <DropDown class="dropdown" bind:this={dropDown}>
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
    color: #fff;
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
</style>
