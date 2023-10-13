<script lang="ts">
  import type { CategoryDoc } from '~/lib/db';
  import DropDown from './DropDown.svelte';
  import { categoires } from '~/lib/store';

  export let categoryId: string | undefined;

  let dropdown: DropDown;
  let input: HTMLInputElement;

  function getCategoryTitle(category: CategoryDoc) {
    return `${category.title}${category.subtitle ? `:${category.subtitle}` : ''}`;
  }

  export function clear() {
    categoryId = '';
    value = '';
  }

  let category = categoryId ? $categoires.find((cat) => cat.id === categoryId) : null;
  let value = category ? getCategoryTitle(category) : '';

  function clickHandler(e: Event) {
    if (e.target instanceof HTMLLIElement) {
      // console.log('id:', e.target.dataset.id);
      categoryId = e.target.dataset.id;
      dropdown.close();
      const category = $categoires.find((cat) => cat.id === categoryId);
      if (category) {
        value = getCategoryTitle(category);
      }
    }
  }

  function inputHandler() {
    const category = $categoires.find(
      (cat) => input.value.trim().toLocaleLowerCase() === getCategoryTitle(cat).toLocaleLowerCase()
    );
    if (category) {
      categoryId = category.id;
      input.value = getCategoryTitle(category);
    } else {
      categoryId = '';
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
<DropDown class="combo" bind:this={dropdown} clickToggle={true}>
  <input
    class="input"
    type="text"
    placeholder="Category"
    bind:this={input}
    bind:value
    on:input={inputHandler} />
  <ul class="list" slot="content" on:click={clickHandler}>
    {#each categoryId ? $categoires : $categoires.filter((cat) => {
          const fullTitle = `${cat.title}:${cat.subtitle}`;
          return fullTitle.toLowerCase().includes(value.trim().toLowerCase());
        }) as category (category.id)}
      <li data-id={category.id} class:selected={category.id === categoryId}>
        {category.title}{category.subtitle ? `:${category.subtitle}` : ''}
      </li>
    {:else}
      <li class="empty">Empty</li>
    {/each}
  </ul>
</DropDown>

<style lang="scss">
  .combo {
    width: 100%;

    > [data-role='popover'] {
      left: 0;
      margin-top: 2px;
      padding: 0;
      border: 1px solid #aaa;
      overflow-y: scroll;
      max-height: 400px;
    }
  }

  .input {
    font-size: inherit;
    padding: 5px;
    width: 100%;
    outline: none;
  }

  .list {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      line-height: 40px;
      padding: 0 5px;
      cursor: pointer;

      &:hover {
        background-color: #e1effa;
      }

      &:active,
      &.selected {
        background-color: #d1e3f0;
      }
    }
  }

  .empty {
    color: #aaa;
  }
</style>
