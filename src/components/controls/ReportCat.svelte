<script lang="ts" context="module">
  import type { TransactionDoc } from '~/lib/db';

  export interface Cat {
    title?: string;
    total: number;
    docs?: TransactionDoc[];
    cats?: Record<string, Cat>;
    sorted?: Cat[];
  }
</script>

<script lang="ts">
  import { formatAmount } from '~/lib/utils';

  export let cat: Cat;
  export let nested = false;
  export let ondocs: ((docs: TransactionDoc[]) => void) | undefined = undefined;
</script>

<div>
  {#each cat.sorted as subcat}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="subcat"
      class:nested
      on:click={() => {
        ondocs?.(subcat.docs);
      }}>
      <span class="title">{subcat.title}</span>
      <span>{formatAmount(subcat.total, true)}</span>
    </div>
    {#if subcat.sorted}
      <svelte:self cat={subcat} nested {ondocs} />
    {/if}
  {/each}
</div>

<style lang="scss">
  .subcat {
    display: flex;
    gap: 10px;
    padding: 5px 10px;
    border-top: 1px solid #ddd;

    &.nested {
      padding-left: 20px;
    }

    > .title {
      flex: 1 1 auto;
    }
  }
</style>
