<script lang="ts">
  import Header from '~/components/controls/Header.svelte';
  import View from '~/components/controls/View.svelte';
  import AccountGroup from '~/components/AccountGroup.svelte';
  import {
    downloadJSON,
    formatAmount,
    getCurrencyRate,
    formatTimestamp,
    chooseTextFile,
    safeJSONParse,
    restoreSnapshot
  } from '~/lib/utils';
  import { accountGroups, accounts, currencies, settings } from '~/lib/store';
  import { getDBSnapshot } from '~/lib/utils';
  import { loadData } from '~/lib/db';
  import { baseCurrencyName } from '~/lib/const';

  $: baseCurrency =
    $settings.find((item) => item.name === baseCurrencyName)?.value || $currencies[0]?.code;

  const menuItems = [
    {
      id: 'groups',
      title: 'Account Groups',
      to: '/groups'
    },
    {
      id: 'category',
      title: 'Categories',
      to: '/categories'
    },
    {
      id: 'currency',
      title: 'Currencies',
      to: '/currencies'
    },
    {
      id: 'backup',
      title: 'Backup'
    },
    {
      id: 'restore',
      title: 'Restore'
    },
    {
      id: 'settings',
      title: 'Settings',
      to: '/settings'
    }
  ];

  $: total = $accounts.reduce((total, acc) => {
    if (acc.currencyCode === baseCurrency) {
      total += acc.balance;
    } else {
      total += acc.balance * getCurrencyRate(acc.currencyCode, baseCurrency);
    }

    return total;
  }, 0);
</script>

<View>
  <Header
    slot="header"
    title="Accounts"
    addPath={'/accounts/new'}
    {menuItems}
    on:menu={(e) => {
      switch (e.detail.id) {
        case 'backup':
          getDBSnapshot().then((backup) => {
            downloadJSON(backup, `${formatTimestamp(Date.now())}.json`);
          });
          break;

        case 'restore':
          chooseTextFile((text) => {
            const dbSnapshot = safeJSONParse(text);

            if (dbSnapshot) {
              restoreSnapshot(dbSnapshot).then((restored) => {
                if (restored) {
                  loadData();
                }
              });
            }
          });
          break;
      }
    }} />

  {#each $accountGroups as accountGroup}
    <AccountGroup {accountGroup} />
  {/each}
  <div class="total">
    <div>Total</div>
    <div class="amount">{formatAmount(total, true)} {baseCurrency || ''}</div>
  </div>
</View>

<style lang="scss">
  .accounts {
    margin: 1rem 0;

    > [data-role='account'] {
      margin: 5px 0;
    }
  }

  .total {
    padding: 0 10px;
    background-color: #f4f4f8;
    display: flex;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
    color: #777;
  }

  .amount {
    margin-left: auto;
  }
</style>
