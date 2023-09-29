<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import AccountSelect from '~/components/controls/AccountSelect.svelte';
  import CategorySelect from '~/components/controls/CategorySelect.svelte';
  import { TransactionKind, type TransactionDoc } from '~/lib/db';
  import { transactionKinds } from '~/lib/const';
  import { accounts } from '~/lib/store';
  import {
    formatAmount,
    getLocalCustomISODateString,
    parseAmount,
    validateAmount
  } from '~/lib/utils';

  export let accountId: string;
  export let transactionDoc: TransactionDoc = null;

  let amountInput: HTMLInputElement;

  onMount(() => {
    if (amountInput) {
      amountInput.focus();
      // amountInput.setSelectionRange(0, amountInput.value.length);
    }
  });

  let {
    kind = TransactionKind.Expense,
    categoryId,
    secondAccountId,
    comment = ''
  } = transactionDoc || {};

  let timestamp = getLocalCustomISODateString(new Date(transactionDoc?.timestamp || Date.now()));

  let amount: string = transactionDoc ? formatAmount(transactionDoc.amount) : '';
  let secondAmount: string = transactionDoc ? formatAmount(transactionDoc.secondAmount) : '';

  $: account = $accounts.find((item) => item.id === accountId);
  $: currencyCode = account?.currencyCode;
  $: secondAccount = secondAccountId ? $accounts.find((item) => item.id === secondAccountId) : null;
  $: secondCurrency =
    secondAccount && currencyCode ? secondAccount.currencyCode !== currencyCode : false;

  const dispatch = createEventDispatcher();

  function submitHandler() {
    const validationError = validateFields();
    if (validationError) {
      alert(validationError);
      return;
    }

    const params =
      kind === TransactionKind.Transfer
        ? {
            kind,
            timestamp: new Date(timestamp).getTime(),
            accountId,
            secondAccountId,
            ...(secondCurrency
              ? {
                  secondAmount: parseAmount(secondAmount)
                }
              : {}),
            amount: parseAmount(amount),
            comment: comment.trim()
          }
        : {
            kind,
            timestamp: new Date(timestamp).getTime(),
            accountId,
            categoryId: categoryId || null,
            amount: parseAmount(amount),
            comment: comment.trim()
          };

    dispatch('save', { params });
  }

  function validateFields(): string {
    if (!validateAmount(amount)) {
      return 'Invalid amount';
    }

    if (kind === TransactionKind.Transfer) {
      if (!secondAccountId) {
        return 'Must choose the second account';
      }

      if (secondAccountId === accountId) {
        return 'Cannot transfer to the same account';
      }

      if (secondCurrency && !validateAmount(secondAmount)) {
        return 'Invalid second amount';
      }
    }

    return '';
  }
</script>

<form class="form" on:submit|preventDefault={submitHandler}>
  <div>
    <select class="select" bind:value={kind}>
      {#each transactionKinds as kind}
        <option value={kind.value}>{kind.title}</option>
      {/each}
    </select>
  </div>

  <div>
    {#if kind === TransactionKind.Transfer}
      <AccountSelect bind:accountId={secondAccountId} placeholder="To" />
    {:else}
      <div class="category">
        <CategorySelect bind:categoryId />
        <button
          type="button"
          disabled={!categoryId}
          on:click|stopPropagation={() => {
            categoryId = '';
          }}>Clear</button>
      </div>
    {/if}
  </div>

  <div>
    <input class="input" type="datetime-local" bind:value={timestamp} />
  </div>

  <div>
    Amount, {account?.currencyCode}:
    <input
      class="input"
      type="text"
      bind:value={amount}
      class:invalid={!validateAmount(amount)}
      bind:this={amountInput} />
  </div>

  {#if secondCurrency}
    <div>
      Amount, {secondAccount?.currencyCode}:
      <input class="input" type="string" bind:value={secondAmount} />
    </div>
  {/if}

  <div>
    <input class="input" type="text" bind:value={comment} placeholder="Comment" />
  </div>

  <div>
    <button class="button" type="submit">{transactionDoc ? 'Save' : 'Create'}</button>
  </div>
</form>

<style lang="scss">
  .form {
    margin: 10px;
    > div + div {
      margin-top: 10px;
    }
  }

  .invalid {
    border: 1px solid red;
    color: red;
  }

  .select {
    font-size: inherit;
    padding: 5px;
    width: 100%;
  }

  .input {
    font-size: inherit;
    padding: 5px;
    width: 100%;
    outline: none;
  }

  .button {
    width: 100%;
    padding: 5px;
    font-size: inherit;
  }

  .category {
    display: flex;
    gap: 10px;
  }
</style>
