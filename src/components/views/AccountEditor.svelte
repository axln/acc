<script lang="ts">
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import AccountForm from '~/components/AccountForm.svelte';
  import { createAccount, updateAccount } from '~/lib/db';
  import { accounts } from '~/lib/store';

  export let params: { id: string };
  const { id } = params;

  let accountDoc = id ? $accounts.find((item) => item.id === id) : null;

  function saveHandler(e: CustomEvent<{ title: string; groupId: string; currencyCode: string }>) {
    const { title, groupId, currencyCode } = e.detail;
    if (id) {
      updateAccount({
        ...accountDoc,
        title,
        groupId,
        currencyCode
      }).then(() => {
        push(`/`);
      });
    } else {
      createAccount(title, groupId, currencyCode).then(() => {
        push(`/`);
      });
    }
  }
</script>

<View>
  <Header slot="header" title={id ? accountDoc?.title : 'New Account'} returnPath="/" />

  {#if id}
    <AccountForm class="editor" {accountDoc} on:save={saveHandler} />
  {:else}
    <AccountForm class="editor" on:save={saveHandler} />
  {/if}
</View>

<style lang="scss">
  .editor {
    margin: 10px;
  }
</style>
