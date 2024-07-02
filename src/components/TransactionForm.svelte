<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import AccountSelect from '~/components/controls/AccountSelect.svelte';
  import KindSelect from './controls/KindSelect.svelte';
  import { TransactionKind, type TransactionDoc, type TransactionParams } from '~/lib/db';
  import { accounts } from '~/lib/store';
  import {
    formatAmount,
    getLocalCustomISODateString,
    parseAmount,
    validateAmount
  } from '~/lib/utils';
  import CategoryCombo from './controls/CategoryCombo.svelte';
  import Account from './Account.svelte';

  export let accountId: string;
  export let transactionDoc: TransactionDoc = null;

  let categoryCombo: CategoryCombo;

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
    comment = '',
    reconciled = false
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

    const params: TransactionParams =
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
            comment: comment.trim(),
            ...(reconciled ? { reconciled: true } : {})
          }
        : {
            kind,
            timestamp: new Date(timestamp).getTime(),
            accountId,
            categoryId: categoryId || null,
            amount: parseAmount(amount),
            comment: comment.trim(),
            ...(reconciled ? { reconciled: true } : {})
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

  function clearHandler() {
    // categoryId = '';
    categoryCombo.clear();
  }
</script>

<form class="form" on:submit|preventDefault={submitHandler}>
  <div>
    <KindSelect bind:kind />
  </div>

  <div>
    <input class="input" type="datetime-local" bind:value={timestamp} />
  </div>

  <div>
    {#if kind === TransactionKind.Transfer}
      <AccountSelect bind:accountId={secondAccountId} placeholder="To" />
    {:else}
      <!-- <div class="category">
        <CategorySelect bind:categoryId />
        <button type="button" disabled={!categoryId} on:click|stopPropagation={clearHandler}
          >Clear</button>
      </div>
      <br /> -->
      <div class="category">
        <CategoryCombo bind:categoryId bind:this={categoryCombo} />
        <button type="button" disabled={!categoryId} on:click|stopPropagation={clearHandler}
          >Clear</button>
      </div>
    {/if}
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
    <label class="reconciled">
      <input type="checkbox" bind:checked={reconciled} />
      Reconciled
    </label>
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

  .reconciled {
    display: flex;
  }

  .invalid {
    border: 1px solid red;
    color: red;
  }

  .input {
    font-size: inherit;
    padding: 5px;
    width: 100%;
    outline: none;
    border-width: 1px;
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
