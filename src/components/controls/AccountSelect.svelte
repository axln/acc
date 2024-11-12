<script lang="ts" module>
  import type { AccountDoc } from '~/lib/db';

  interface AccountByGroupItem {
    title: string;
    accounts: AccountDoc[];
  }
</script>

<script lang="ts">
  import { accounts, accountGroups } from '~/lib/store';

  export let accountId: string | undefined;
  export let placeholder: string = 'Account';

  $: accountsByGroup = $accountGroups.reduce((acc, group) => {
    const item = {
      title: group.title,
      accounts: $accounts.filter((account) => {
        return account.groupId === group.id;
      })
    };
    acc.push(item);
    return acc;
  }, [] as AccountByGroupItem[]);
</script>

<select class="select" bind:value={accountId} required>
  <option value="" disabled selected hidden>{placeholder}</option>
  {#each accountsByGroup as accountGroup}
    <optgroup label={accountGroup.title}>
      {#each accountGroup.accounts as account}
        <option value={account.id}>{account.title}</option>
      {/each}
    </optgroup>
  {/each}
</select>

<style lang="scss">
  .select {
    font-size: inherit;
    width: 100%;
    padding: 5px;

    &:invalid {
      color: #777;
    }
  }
</style>
