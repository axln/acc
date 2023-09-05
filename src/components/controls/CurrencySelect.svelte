<script lang="ts">
  import { currencies } from '~/lib/store';
  export let currencyCode: string;

  export let placeholder = 'Currency';
</script>

<select class="select" bind:value={currencyCode} required>
  <option value="" disabled selected hidden>{placeholder}</option>

  {#each $currencies as { code, title } (code)}}
    <option value={code}>
      {code}
      {title}
    </option>
  {/each}
</select>

<style lang="scss">
  .select {
    font-size: inherit;
    width: 100%;
    padding: 5px;

    &:invalid {
      color: #777;
    }
  }
</style>
