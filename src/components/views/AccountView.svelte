<script lang="ts">
  import { push } from 'svelte-spa-router';
  import Header from '~/components/controls/Header.svelte';
  import View from '~/components/controls/View.svelte';
  import Entry from '~/components/Entry.svelte';
  import { getEntries, type EntryDoc } from '~/lib/db';
  import { accounts } from '~/lib/store';
  import { formatAmount, formatDate } from '~/lib/utils';

  type EntryGroup = Record<
    string,
    {
      entries: EntryDoc[];
      total: number;
    }
  >;

  export let params: { id: string };
  const { id } = params;

  // let entries: EntryDoc[] = [];
  let entriesByDays: EntryGroup = {};

  getEntries(id).then((entryDocs) => {
    // entries = entryDocs;

    entriesByDays = entryDocs.reduce((acc, entry) => {
      const title = formatDate(entry.timestamp);

      if (acc[title]) {
        acc[title].entries.push(entry);
      } else {
        acc[title] = {
          entries: [entry],
          total: 0
        };
      }
      return acc;
    }, {} as EntryGroup);

    for (const day of Object.values(entriesByDays)) {
      day.total = day.entries.reduce((acc, item) => {
        acc += item.amount;
        return acc;
      }, 0);
    }
    // console.log('entriesByDays:', entriesByDays);
  });

  $: account = $accounts.find((item) => item.id === id);

  const menuItems = [
    {
      id: 'edit',
      title: 'Edit',
      to: `/accounts/${id}/edit`
    }
  ];
</script>

<View>
  <Header
    slot="header"
    title={account ? `${account.title}` : 'Not Found'}
    returnPath="/"
    addPath={`/accounts/${id}/transactions/new`}
    {menuItems} />

  {#each Object.keys(entriesByDays) as dayKey}
    <div class="day">
      <span class="date">{dayKey}</span>
      <span class="total">{formatAmount(entriesByDays[dayKey].total, true, true)}</span>
    </div>
    {#each entriesByDays[dayKey].entries as entry (entry.id)}
      <Entry
        on:transaction={(e) => {
          push(`/accounts/${id}/transactions/${e.detail.id}`);
        }}
        {entry} />
    {/each}
  {/each}
</View>

<style lang="scss">
  .day {
    padding: 0 10px;
    background-color: #f4f4f8;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 10px;
  }
  .date {
    flex: 1 1 auto;
  }
  .total {
    flex: 0 0 auto;
  }
</style>
