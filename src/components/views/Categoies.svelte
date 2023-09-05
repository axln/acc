<script lang="ts">
  import { navigate } from 'svelte-routing';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import { categoires } from '~/lib/store';
  import { basepath } from '~/lib/const';

  function clickHandler(e: MouseEvent) {
    if ((e.target as HTMLDivElement).dataset.id) {
      const categoryId = (e.target as HTMLDivElement).dataset.id;
      navigate(`${basepath}/categories/${categoryId}`);
    }
  }
</script>

<View>
  <Header slot="header" title="Categories" returnPath="/" addPath="categories/new" />
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
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    cursor: pointer;

    & + & {
      border-top: none;
    }

    &:hover {
      background-color: #e1effa;
    }
  }
</style>
