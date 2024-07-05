<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createCategory, type TransactionDoc, type TransactionParams } from '~/lib/db';
  import AccountSelect from '~/components/controls/AccountSelect.svelte';
  import KindSelect from './controls/KindSelect.svelte';
  import { TransactionKind } from '~/lib/enum';
  import { accounts } from '~/lib/store';
  import {
    formatAmount,
    getLocalCustomISODateString,
    parseAmount,
    validateAmount
  } from '~/lib/utils';
  import CategoryCombo from './controls/CategoryCombo.svelte';
  import Keyboard from './controls/Keyboard.svelte';
  import { categoires } from '~/lib/store';

  export let accountId: string;
  export let transactionDoc: TransactionDoc = null;

  let categoryCombo: CategoryCombo;

  let amountInput: HTMLInputElement;
  let categoryValue: string;

  // $: console.log('categoryValue:', categoryValue);

  onMount(() => {
    if (amountInput) {
      // amountInput.focus();
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

  async function submitHandler() {
    const validationError = validateFields();
    if (validationError) {
      alert(validationError);
      return;
    }
    if (!categoryId && categoryValue.trim() !== '') {
      const [title, subtitle = ''] = categoryValue.trim().split(':');

      const existingCat = $categoires.find(
        (cat) => cat.title === title && cat.subtitle === subtitle
      );
      if (!existingCat) {
        const cat = await createCategory(title, subtitle);
        // console.log('new cat added:', cat);
        categoryId = cat.id;
      }
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

  function onkey(k: string) {
    // console.log('key:', k);
    if (k === '<') {
      amount = amount.substring(0, amount.length - 1);
    } else {
      amount += k;
    }
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
        <CategoryCombo bind:categoryId bind:this={categoryCombo} bind:value={categoryValue} />
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
      <input class="input" type="text" bind:value={secondAmount} />
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

  <Keyboard {onkey} />

  <div>
    <button class="button submit" type="submit">{transactionDoc ? 'Save' : 'Create'}</button>
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
    border: 1px solid #777;
    outline: none;
    border-radius: 3px;
  }

  .button {
    width: 100%;
    padding: 5px;
    font-size: inherit;

    &.submit {
      padding: 10px;
      margin-top: 10px;
    }
  }

  .category {
    display: flex;
    gap: 10px;
  }
</style>
