<script module lang="ts">
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
      id: 'report',
      title: 'Report',
      to: '/report'
    },
    {
      id: 'currency',
      title: 'Currencies',
      to: '/currencies'
    },
    {
      id: 'rates',
      title: 'Rates',
      to: '/rates'
    },
    {
      id: 'backup',
      title: 'Backup'
    },
    {
      id: 'restore',
      title: 'Restore'
    }
    /* {
      id: 'settings',
      title: 'Settings',
      to: '/settings'
    } */
  ];
</script>

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
  import { accountGroups, accounts, baseCurrencyCode } from '~/lib/store';
  import { getDBSnapshot } from '~/lib/utils';
  import { loadData } from '~/lib/db';

  $: total = $accounts.reduce((total, acc) => {
    if (acc.currencyCode === $baseCurrencyCode) {
      total += acc.balance;
    } else {
      total += acc.balance * getCurrencyRate(acc.currencyCode, $baseCurrencyCode);
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
            downloadJSON(backup, `acc-${formatTimestamp(Date.now())}.json`);
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
    <div class="amount">
      {formatAmount(total, true)}
      {$baseCurrencyCode || ''}
    </div>
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
