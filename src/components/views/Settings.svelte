<script lang="ts">
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import CurrencySelect from '~/components/controls/CurrencySelect.svelte';
  import { settings } from '~/lib/store';
  import { updateSettings } from '~/lib/db';
  import { baseCurrencyName } from '~/lib/const';

  let currencyCode = $settings.find((item) => item.name === baseCurrencyName)?.value;

  function submitHandler() {
    updateSettings({ name: baseCurrencyName, value: currencyCode }).then(() => {
      push(`/`);
    });
  }
</script>

<View>
  <Header slot="header" title="Settings" returnPath="/" />
  
  <form class="form" on:submit|preventDefault={submitHandler}>
    <div>
      Base currency:
      <CurrencySelect bind:currencyCode placeholder="Base Currency" />
    </div>

    <div>
      <button class="button" type="submit">Save</button>
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

  .button {
    width: 100%;
    padding: 5px;
    font-size: inherit;
  }
</style>
