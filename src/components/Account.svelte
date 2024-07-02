<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { type AccountDoc } from '~/lib/db';
  import { formatAmount } from '~/lib/utils';

  export let account: AccountDoc;
  export let editing = false;

  // let className: string | null;
  // export { className as class };

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="account"
  data-role="account"
  on:click={() => {
    if (!editing) {
      dispatch('account', { id: account.id });
    }
  }}>
  <div class="line">
    <span class="title">{account.title}</span>
    <span>{formatAmount(account.balance, true)} {account.currencyCode}</span>
  </div>
</div>

<style lang="scss">
  .account {
    padding: 10px;
    border-bottom: 1px solid #ddd;

    cursor: pointer;

    &:hover {
      background-color: #e1effa;
    }

    &:active {
      background-color: #d1e3f0;
    }
  }

  .line {
    display: flex;
    gap: 10px;
  }

  .title {
    flex-grow: 1;
  }

  .form {
    display: flex;
    flex: 1 1 auto;
    margin-top: 5px;
    gap: 5px;

    > input {
      flex-grow: 1;
    }
  }
</style>
