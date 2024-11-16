<script lang="ts" module>
  type EntryGroup = Record<
    string,
    {
      entries: EntryDoc[];
      total: number;
    }
  >;

  let scrollTop: number | null = null;
</script>

<script lang="ts">
  import { tick } from 'svelte';
  import { get } from 'svelte/store';
  import { push } from 'svelte-spa-router';
  import Header from '~/components/controls/Header.svelte';
  import View from '~/components/controls/View.svelte';
  import Entry from '~/components/Entry.svelte';
  import { getEntries, type EntryDoc } from '~/lib/db';
  import { accounts, prevRoute } from '~/lib/store';
  import { formatAmount, formatDate, highlightElement } from '~/lib/utils';

  export let params: { id: string };
  const { id } = params;

  // let entries: EntryDoc[] = [];
  let entriesByDays: EntryGroup = {};
  let lastTimestamp: number | undefined;

  const createTransactionId = getCreatedTransactionId();
  // console.log('createTransactionId:', createTransactionId);

  $: account = $accounts.find((item) => item.id === id);
  $: menuItems = [
    {
      id: 'edit',
      title: 'Edit',
      to: `/accounts/${id}/edit`
    }
  ];

  getEntries(id).then((entryDocs) => {
    // entries = entryDocs;
    if (entryDocs?.length > 0) {
      lastTimestamp = entryDocs[0].timestamp + 60000; // add 1 minute
    }

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

    tick().then(() => {
      const routeInfo = get(prevRoute);
      if (
        routeInfo?.route === '/accounts/:id/transactions/:tid' ||
        routeInfo?.route === '/accounts/:id/transactions/new'
      ) {
        if (scrollTop) {
          document.documentElement.scrollTop = scrollTop;
        }
        const tid = routeInfo.params?.tid || createTransactionId;
        if (tid) {
          const element = document.getElementById(tid);
          if (element) {
            highlightElement(element, 'highlight-animation');
          }
        }
      }
      scrollTop = null;
    });

    // console.log('entriesByDays:', entriesByDays);
  });

  function getCreatedTransactionId(): string | null {
    const [_, qs] = location.hash.split('?');
    if (!qs) {
      return null;
    }

    if (qs) {
      const params = new URLSearchParams(qs);
      return params.get('tid');
    }

    return null;
  }
</script>

<View>
  <Header
    slot="header"
    title={account ? account.title : 'Not Found'}
    returnPath="/"
    addPath="/accounts/{id}/transactions/new{lastTimestamp ? `?t=${lastTimestamp}` : ''}"
    on:add={() => {
      scrollTop = document.documentElement.scrollTop;
      // console.log('scrollTop saved:', scrollTop);
    }}
    {menuItems} />
  {#each Object.keys(entriesByDays) as dayKey}
    <div class="day">
      <span class="date">{dayKey}</span>
      <span class="total">{formatAmount(entriesByDays[dayKey].total, true, true)}</span>
    </div>
    {#each entriesByDays[dayKey].entries as entry (entry.id)}
      <Entry
        on:transaction={(e) => {
          scrollTop = document.documentElement.scrollTop;
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
    font-weight: bold;
  }

  .total {
    flex: 0 0 auto;
  }
</style>
