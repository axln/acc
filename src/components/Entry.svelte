<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { EntryDoc } from '~/lib/db';
  import { categoires } from '~/lib/store';
  import { formatAmount, formatTime } from '~/lib/utils';

  export let entry: EntryDoc;

  const dispatch = createEventDispatcher();

  $: category = entry.categoryId
    ? $categoires.find((category) => category.id === entry.categoryId)
    : null;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="entry"
  on:click={() => {
    dispatch('transaction', { id: entry.transactionId });
  }}>
  <div class="info">
    <div class="comment">
      <span class="title">{entry.comment}</span>
      {#if category}
        <span class="category"
          >{category.title}{category.subtitle ? `:${category.subtitle}` : ''}</span>
      {/if}
    </div>

    <div class="amount" class:income={entry.amount > 0}>
      {formatAmount(entry.amount, true, true)}
    </div>
  </div>

  <div class="details">
    <div class="time">{formatTime(entry.timestamp)}</div>
    <div class="total">{formatAmount(entry.total, true)}</div>
  </div>
</div>

<style lang="scss">
  .entry {
    padding: 5px 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;

    &:hover {
      background-color: #e1effa;
    }

    &:active {
      background-color: #d1e3f0;
    }
  }

  .info,
  .details {
    display: flex;
    gap: 10px;
  }

  .details {
    font-size: 13px;
    color: #ddd;
    margin-top: 5px;
  }

  .comment,
  .time {
    flex: 1 1 auto;
  }

  .amount,
  .total {
    flex: 0 0 auto;
    text-align: right;
  }

  .category {
    font-size: 13px;
    border: 1px solid #ddd;
    background-color: #eee;
    padding: 1px 3px;
    border-radius: 5px;
    line-height: 1em;
    white-space: nowrap;
  }

  .title:not(:only-child) {
    margin-right: 5px;
  }

  .income {
    color: green;
  }
</style>
