<script lang="ts">
  import { push } from 'svelte-spa-router';
  import Account from './Account.svelte';
  import { type AccountGroupDoc } from '~/lib/db';
  import { accounts } from '~/lib/store';
  import { formatAmount, getGroupBalance } from '~/lib/utils';

  export let accountGroup: AccountGroupDoc;

  $: groupAccounts = $accounts.filter((account) => account.groupId === accountGroup.id);
  $: balance = getGroupBalance(groupAccounts, accountGroup.currencyCode);
</script>

<div>
  <div class="header">
    <span class="title">{accountGroup.title}</span>
    <span>{formatAmount(balance, true)} {accountGroup.currencyCode}</span>
  </div>

  {#each groupAccounts as account (account.id)}
    <Account
      {account}
      on:account={(e) => {
        push(`/accounts/${e.detail.id}`);
      }} />
  {/each}
</div>

<style lang="scss">
  .header {
    padding: 0 10px;
    background-color: #f4f4f8;
    display: flex;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
    color: #777;
  }

  .title {
    flex: 1 1 auto;
  }
</style>
