<script lang="ts">
  import { categoires } from '~/lib/store';

  export let categoryId: string;
</script>

<select class="select" bind:value={categoryId} class:placeholder={!categoryId}>
  <option value="" disabled selected hidden>Category</option>

  {#each $categoires as category (category.id)}
    <option value={category.id}
      >{category.title}{category.subtitle ? `:${category.subtitle}` : ''}</option>
  {/each}
</select>

<style lang="scss">
  .select {
    font-size: inherit;
    width: 100%;
    padding: 5px;
  }

  .placeholder {
    color: #777;
  }
</style>
