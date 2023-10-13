<script lang="ts">
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import { currencies } from '~/lib/store';

  function clickHandler(e: MouseEvent) {
    console.log('e:', e);

    if (e.target instanceof HTMLElement) {
      const item = e.target.closest('[data-role="item"]');
      if (item instanceof HTMLElement && item.dataset.code) {
        push(`/currencies/${item.dataset.code}`);
      }
    }
  }
</script>

<View>
  <Header slot="header" title="Currencies" returnPath="/" addPath="/currencies/new" />

  {#each $currencies as currency (currency.code)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="currency" data-role="item" data-code={currency.code} on:click={clickHandler}>
      <div class="code">{currency.code}</div>
      <div class="title">{currency.title}</div>
    </div>
  {/each}
</View>

<style lang="scss">
  .currency {
    padding: 10px;
    display: flex;
    border-bottom: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background-color: #e1effa;
    }
  }

  .code {
    flex: 0 0 50px;
  }

  .title {
    flex: 1 1 auto;
  }
</style>
