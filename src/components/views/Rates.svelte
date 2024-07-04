<script lang="ts">
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import CurrencySelect from '~/components/controls/CurrencySelect.svelte';
  import { rates, currencies, baseCurrencyCode } from '~/lib/store';
  import { updateRates, updateSettings } from '~/lib/db';
  import { baseCurrencyName } from '~/lib/const';

  let baseCode = $baseCurrencyCode;

  let currentRates = $currencies.reduce((acc, { code }) => {
    acc[code] = String($rates[code] || 1);
    return acc;
  }, {});

  function submitHandler() {
    const validationError = validateFields();
    if (validationError) {
      alert(validationError);
      return;
    }
    const rateDocs = $currencies
      .filter(({ code }) => code !== baseCode)
      .map(({ code }) => {
        return {
          code,
          rate: parseRate(currentRates[code])
        };
      });
    // console.log('rateDocs:', rateDocs);

    updateSettings({
      name: baseCurrencyName,
      value: baseCode
    })
      .then(() => {
        $baseCurrencyCode = baseCode;
        return updateRates(rateDocs, baseCode);
      })
      .then(() => {
        push('/');
      });
  }

  function validateFields(): string {
    for (const [code, value] of Object.entries<string>(currentRates)) {
      if (!validateRate(value)) {
        const input = document.getElementById(code);
        if (input) {
          input.focus();
        }
        return `Invalid rate for ${code}`;
      }
    }

    return '';
  }

  export function validateRate(value: string) {
    return /^([1-9]\d*|[0])([.,]\d+)?$/.test(value);
  }

  export function parseRate(value: string): number {
    return parseFloat(value.replace(',', '.'));
  }
</script>

<View>
  <Header slot="header" title="Rates" returnPath="/" />

  <form class="form" on:submit|preventDefault={submitHandler}>
    <div>
      Base currency:
      <CurrencySelect bind:currencyCode={baseCode} placeholder="Base Currency" />
    </div>

    {#each $currencies as { code }}
      {#if code !== baseCode}
        <div>
          <div>{code}:</div>

          <div class="rate">
            <input
              id={code}
              class="input"
              class:invalid={!validateRate(currentRates[code])}
              type="text"
              bind:value={currentRates[code]} />
            <span>{baseCode}</span>
          </div>
        </div>
      {/if}
    {/each}

    <div>
      <button class="submit" type="submit">Save</button>
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
    font-size: inherit;
    padding: 5px;
    width: 100%;
    outline: none;
    border: 1px solid #777;
    border-radius: 3px;
  }

  .submit {
    width: 100%;
    padding: 5px;
    font-size: inherit;
  }

  .rate {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .invalid {
    border: 1px solid red;
    color: red;
  }
</style>
