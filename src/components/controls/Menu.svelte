<script context="module" lang="ts">
  import { Link } from 'svelte-routing';
  export interface MenuItem {
    id: string;
    title: string;
    to?: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let items: Array<MenuItem> = [];

  const dispatch = createEventDispatcher();
</script>

<ul class="menu">
  {#each items as item (item.id)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
    <li
      class="item"
      data-id={item.id}
      on:click={(event) => {
        dispatch('menu', { id: event.currentTarget.dataset.id });
      }}>
      {#if item.to}
        <Link class="link" to={item.to}>{item.title}</Link>
      {:else}
        <span class="text">{item.title}</span>
      {/if}
    </li>
  {/each}
</ul>

<style lang="scss">
  .menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
    user-select: none;
  }

  .item {
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background-color: #e1effa;
    }

    &:active {
      background-color: #d1e3f0;
    }
  }

  .link {
    text-decoration: none;
    color: inherit;
    padding: 10px 30px 10px 20px;
    display: block;
  }

  .text {
    padding: 10px 30px 10px 20px;
    display: block;
  }
</style>
