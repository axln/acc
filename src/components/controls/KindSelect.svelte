<script lang="ts">
  import { transactionKinds } from '~/lib/const';
  import type { TransactionKind } from '~/lib/db';

  export let kind: TransactionKind;
</script>

<select class="select" bind:value={kind}>
  {#each transactionKinds as kind}
    <option value={kind.value}>{kind.title}</option>
  {/each}
</select>

<style lang="scss">
  .select {
    font-size: inherit;
    padding: 5px;
    width: 100%;
  }
</style>
