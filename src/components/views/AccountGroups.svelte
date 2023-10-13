<script lang="ts">
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import { accountGroups } from '~/lib/store';

  function clickHandler(e: MouseEvent) {
    if (e.target instanceof HTMLElement && e.target.dataset.id) {
      push(`/groups/${e.target.dataset.id}`);
    }
  }
</script>

<View>
  <Header slot="header" title="Account Groups" returnPath="/" addPath="/groups/new" />

  {#each $accountGroups as accountGroup (accountGroup.id)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="item" on:click={clickHandler} data-id={accountGroup.id}>
      {accountGroup.title}
    </div>
  {/each}
</View>

<style lang="scss">
  .item {
    padding: 10px;
    display: flex;
    gap: 10px;
    cursor: pointer;

    &:hover {
      background-color: #e1effa;
    }
  }
</style>
