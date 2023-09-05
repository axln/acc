<script lang="ts">
  import { navigate } from 'svelte-routing';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import TransactionForm from '~/components/TransactionForm.svelte';
  import {
    type TransactionDoc,
    getTransaction,
    type TransactionParams,
    createTransaction,
    updateTransaction
  } from '~/lib/db';
  import { basepath } from '~/lib/const';

  export let id: string;
  export let tid: string = undefined;

  let transactionDoc: TransactionDoc;

  async function loadTransaction(id: string) {
    transactionDoc = await getTransaction(id);
  }

  function saveHandler(e: CustomEvent<{ params: TransactionParams }>) {
    // console.log('trans params:', e.detail.params);
    if (tid) {
      updateTransaction(transactionDoc, e.detail.params).then(() => {
        navigate(`${basepath}/accounts/${id}`);
      });
    } else {
      createTransaction(e.detail.params).then(() => {
        navigate(`${basepath}/accounts/${id}`);
      });
    }
  }
</script>

<View>
  <Header slot="header" title="Transaction" returnPath={`accounts/${id}`} />
  {#if tid}
    {#await loadTransaction(tid) then}
      <TransactionForm accountId={id} {transactionDoc} on:save={saveHandler} />
    {/await}
  {:else}
    <TransactionForm accountId={id} on:save={saveHandler} />
  {/if}
</View>

<style lang="scss">
</style>
