<script lang="ts">
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import TransactionForm from '~/components/TransactionForm.svelte';
  import {
    type TransactionDoc,
    type TransactionParams,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } from '~/lib/db';
  import { accounts } from '~/lib/store';

  export let params: { id: string; tid?: string };
  const { id, tid } = params;

  $: account = $accounts.find((account) => account.id === id);

  let transactionDoc: TransactionDoc | undefined;

  const defaultTimestamp = tid ? null : getDefaultTimestamp();
  // console.log('defaultTimestamp:', defaultTimestamp);

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
      if (!transactionDoc) {
        return;
      }
      updateTransaction(transactionDoc, e.detail.params).then(() => {
        push(`/accounts/${id}`);
      });
    } else {
      createTransaction(e.detail.params).then((doc) => {
        push(`/accounts/${id}?tid=${doc.id}`);
      });
    }
  }

  function getDefaultTimestamp(): number | null {
    const [_, qs] = location.hash.split('?');
    if (!qs) {
      return null;
    }

    if (qs) {
      const params = new URLSearchParams(qs);
      const t = params.get('t');
      if (t) {
        return parseInt(t) || null;
      }
    }

    return null;
  }
</script>

<View>
  <Header
    slot="header"
    title={account ? `${account.title}: Transaction` : 'Transaction'}
    returnPath={`/accounts/${id}`}
    {menuItems}
    on:menu={(e) => {
      switch (e.detail.id) {
        case 'delete':
          if (!confirm('Delete transaction?')) {
            return false;
          }
          if (tid) {
            deleteTransaction(tid).then(() => {
              push(`/accounts/${id}`);
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
    <TransactionForm accountId={id} {defaultTimestamp} on:save={saveHandler} />
  {/if}
</View>

<style lang="scss">
</style>
