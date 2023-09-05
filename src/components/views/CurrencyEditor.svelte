<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import { createCurrency, updateCurrency } from '~/lib/db';
  import { currencies } from '~/lib/store';
  import { basepath } from '~/lib/const';

  export let cid: string = undefined;

  let currencyDoc = cid ? $currencies.find((item) => item.code === cid) : null;

  let code = currencyDoc ? currencyDoc.code : '';
  let title = currencyDoc ? currencyDoc.title : '';

  let codeInput: HTMLInputElement;
  let titleInput: HTMLInputElement;

  function submitHandler() {
    if (code.trim() && title.trim()) {
      if (currencyDoc) {
        updateCurrency({
          ...currencyDoc,
          title: title.trim()
        }).then(() => {
          navigate(`${basepath}/currencies`);
        });
      } else {
        createCurrency(code.trim(), title.trim()).then(() => {
          navigate(`${basepath}/currencies`);
        });
      }
    } else {
      alert('Code and title must be specified.');
    }
  }

  onMount(() => {
    if (currencyDoc) {
      if (titleInput) {
        titleInput.focus();
      }
    } else {
      if (codeInput) {
        codeInput.focus();
      }
    }
  });
</script>

<View>
  <Header slot="header" title={currencyDoc ? 'Currency' : 'New Currency'} returnPath="currencies" />
  <form on:submit|preventDefault={submitHandler}>
    <div class="row">
      <input
        type="text"
        placeholder="Code"
        bind:value={code}
        bind:this={codeInput}
        disabled={currencyDoc !== null} />
    </div>

    <div class="row">
      <input type="text" placeholder="Title" bind:value={title} bind:this={titleInput} />
    </div>

    <div class="row">
      <button type="submit">{currencyDoc ? 'Save' : 'Add'} </button>
    </div>
  </form>
</View>

<style lang="scss">
  .row {
    margin: 10px;
    > input {
      width: 100%;
      padding: 5px;
      font-size: inherit;
      outline: none;
    }

    > button {
      width: 100%;
      padding: 5px;
      font-size: inherit;
    }
  }
</style>
