<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { type AccountDoc } from '~/lib/db';
  import CurrencySelect from './controls/CurrencySelect.svelte';
  import AccountGroupSelect from './controls/AccountGroupSelect.svelte';

  export let accountDoc: AccountDoc = null;
  let className: string | undefined = undefined;
  export { className as class };

  let { groupId, currencyCode, title = '' } = accountDoc || {};

  /* let groupId: string = accountDoc.groupId || null;
  let currencyCode: string = accountDoc.currencyCode || null;
  export let title: string = accountDoc.title || ''; */

  let adding = false;
  let input: HTMLInputElement;

  const dispatch = createEventDispatcher();

  function submitHandler() {
    if (title.trim() && groupId && currencyCode) {
      adding = true;
      dispatch('save', { groupId, currencyCode, title });
    } else {
      alert('Must fill all fields.');
    }
  }

  onMount(() => {
    if (input) {
      input.focus();
    }
  });
</script>

<form class="form {className}" on:submit|preventDefault={submitHandler}>
  <div>
    <AccountGroupSelect bind:groupId />
  </div>

  <div>
    <CurrencySelect bind:currencyCode />
  </div>

  <div>
    <input
      class="input"
      type="text"
      bind:value={title}
      bind:this={input}
      placeholder="Title"
      disabled={adding} />
  </div>

  <div>
    <button class="button" type="submit" disabled={adding}>
      {accountDoc ? 'Save' : 'Create'}
    </button>
  </div>
</form>

<style lang="scss">
  .form {
    > div + div {
      margin-top: 10px;
    }
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
</style>
