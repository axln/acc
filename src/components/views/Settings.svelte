<script lang="ts">
  import { navigate } from 'svelte-routing';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import CurrencySelect from '../controls/CurrencySelect.svelte';
  import { settings } from '~/lib/store';
  import { updateSettings } from '~/lib/db';
  import { baseCurrencyName } from '~/lib/const';

  let currencyCode = $settings.find((item) => item.name === baseCurrencyName)?.value;

  function submitHandler() {
    updateSettings({ name: baseCurrencyName, value: currencyCode }).then(() => {
      navigate('/');
    });
  }
</script>

<View>
  <Header
    slot="header"
    title="Settings"
    back
    add
    on:back={() => {
      navigate('/');
    }} />
  <form class="form" on:submit|preventDefault={submitHandler}>
    <div>
      Base currency:
      <CurrencySelect bind:currencyCode placeholder="Base Currency" />
    </div>

    <div>
      <button type="submit" class="button">Save</button>
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
