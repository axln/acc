<script lang="ts">
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import { categoires } from '~/lib/store';

  function clickHandler(e: MouseEvent) {
    if ((e.target as HTMLDivElement).dataset.id) {
      const categoryId = (e.target as HTMLDivElement).dataset.id;
      push(`/categories/${categoryId}`);
    }
  }
</script>

<View>
  <Header slot="header" title="Categories" returnPath="/" addPath="/categories/new" />
  {#each $categoires as category (category.id)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="category" data-id={category.id} on:click={clickHandler}>
      {category.title}{category.subtitle ? `:${category.subtitle}` : ''}
    </div>
  {/each}
</View>

<style lang="scss">
  .category {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    cursor: pointer;

    & + & {
      border-top: none;
    }

    &:hover {
      background-color: #e1effa;
    }
  }
</style>
