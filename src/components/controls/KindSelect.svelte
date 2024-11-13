<script lang="ts">
  import type { TransactionKind } from '~/lib/enum';
  import { transactionKinds } from '~/lib/const';

  export let kind: TransactionKind;

  function onclick(e: Event) {
    if (e.target instanceof HTMLSpanElement) {
      // console.log('kind:', e.target.dataset.value);
      kind = e.target.dataset.value as TransactionKind;
    }
  }
</script>

<!-- <select class="select" bind:value={kind}>
  {#each transactionKinds as kind}
    <option value={kind.value}>{kind.title}</option>
  {/each}
</select> -->

<div class="radio">
  {#each transactionKinds as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span data-value={item.value} class:selected={item.value === kind} on:pointerdown={onclick}>
      {item.title}
    </span>
  {/each}
</div>

<style lang="scss">
  .select {
    font-size: inherit;
    padding: 5px;
    width: 100%;
  }

  .radio {
    display: flex;
    border: 1px solid #777;
    border-radius: 3px;

    > span {
      flex: 1 1 0;
      padding: 5px;
      text-align: center;
      &.selected {
        background-color: cadetblue;
        color: #fff;
      }

      & + span {
        border-left: 1px solid #777;
      }
    }
  }
</style>
