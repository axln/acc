<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import CurrencySelect from '~/components/controls/CurrencySelect.svelte';
  import { accountGroups } from '~/lib/store';
  import { createAccountGroup, updateAccountGroup } from '~/lib/db';

  export let id: string = undefined;
  let accountGroupDoc = id ? $accountGroups.find((item) => item.id === id) : null;

  let title: string = accountGroupDoc ? accountGroupDoc.title : '';
  let currencyCode: string = accountGroupDoc ? accountGroupDoc.currencyCode : undefined;

  let titleInput: HTMLInputElement;
  let adding = false;

  onMount(() => {
    titleInput.focus();
  });

  function submitHandler() {
    if (title.trim() && currencyCode) {
      adding = true;
      if (accountGroupDoc) {
        updateAccountGroup({
          ...accountGroupDoc,
          title: title.trim(),
          currencyCode
        })
          .then(() => {
            navigate('/groups');
          })
          .finally(() => {
            adding = false;
          });
      } else {
        createAccountGroup(title, currencyCode)
          .then(() => {
            navigate('/groups');
          })
          .finally(() => {
            adding = false;
          });
      }
    } else {
      alert('All fields must be specified.');
    }
  }
</script>

<View>
  <Header
    slot="header"
    title={accountGroupDoc ? 'Account Group' : 'New Account Group'}
    back
    on:back={() => {
      navigate('/groups');
    }} />

  <form class="form" on:submit|preventDefault={submitHandler}>
    <div>
      <CurrencySelect bind:currencyCode />
    </div>
    <div>
      <input
        class="input"
        type="text"
        bind:this={titleInput}
        bind:value={title}
        disabled={adding}
        placeholder="Title" />
    </div>

    <div>
      <button class="button" type="submit" disabled={adding}
        >{accountGroupDoc ? 'Save' : 'Create'}</button>
    </div>
  </form>
</View>

<style lang="scss">
  .form {
    margin: 10px;
    > div + div {
      margin-top: 10px;
    }
  }

  .input {
    width: 100%;
    padding: 5px;
    font-size: inherit;
    outline: none;
  }

  .button {
    width: 100%;
    padding: 5px;
    font-size: inherit;
  }
</style>
