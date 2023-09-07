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
    updateTransaction,
    deleteTransaction
  } from '~/lib/db';
  import { basepath } from '~/lib/const';

  export let id: string;
  export let tid: string = undefined;

  let transactionDoc: TransactionDoc;

  const menuItems = tid
    ? [
        {
          id: 'delete',
          title: 'Delete'
        }
      ]
    : null;

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
  <Header
    slot="header"
    title="Transaction"
    returnPath={`accounts/${id}`}
    {menuItems}
    on:menu={(e) => {
      switch (e.detail.id) {
        case 'delete':
          if (!confirm('Delete transaction?')) {
            return false;
          }
          if (tid) {
            deleteTransaction(tid).then(() => {
              navigate(`${basepath}/accounts/${id}`);
            });
          }
          break;
      }
    }} />
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
