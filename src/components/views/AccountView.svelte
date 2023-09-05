<script lang="ts">
  import { navigate } from 'svelte-routing';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import Entry from '~/components/Entry.svelte';
  import { getEntries, type EntryDoc } from '~/lib/db';
  import { accounts } from '~/lib/store';
  import { formatAmount, formatDate } from '~/lib/utils';

  type EntryGroup = Record<string, EntryDoc[]>;

  export let id: string;
  export let entries: EntryDoc[] = [];
  export let entriesByDays: EntryGroup = {};

  getEntries(id).then((entryDocs) => {
    entries = entryDocs;

    entriesByDays = entryDocs.reduce((acc, entry) => {
      const title = formatDate(entry.timestamp);

      if (acc[title]) {
        acc[title].push(entry);
      } else {
        acc[title] = [entry];
      }
      return acc;
    }, {} as EntryGroup);
  });

  $: account = $accounts.find((item) => item.id === id);

  const menuItems = [
    {
      id: 'edit',
      title: 'Edit'
    }
  ];
</script>

<View>
  <Header
    slot="header"
    title={account ? `${account.title}` : 'Not Found'}
    back
    on:back={() => {
      navigate('/');
    }}
    add
    on:add={() => {
      navigate(`/accounts/${id}/transactions/new`);
    }}
    {menuItems}
    on:menu={(e) => {
      switch (e.detail.id) {
        case 'edit':
          navigate(`/accounts/${id}/edit`);
          break;
      }
    }} />

  {#each Object.keys(entriesByDays) as dayKey}
    <div class="day">{dayKey}</div>
    {#each entriesByDays[dayKey] as entry (entry.id)}
      <Entry
        on:transaction={(e) => {
          navigate(`/accounts/${id}/transactions/${e.detail.id}`);
        }}
        {entry} />
    {/each}
  {/each}
</View>

<style lang="scss">
  .day {
    padding: 0 10px;
    background-color: #f4f4f8;
    border-bottom: 1px solid #eee;
  }
</style>
