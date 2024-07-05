<script lang="ts">
  import type { Cat } from '~/components/controls/ReportCat.svelte';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import ReportCat from '~/components/controls/ReportCat.svelte';
  import { TransactionKind } from '~/lib/enum';
  import { type CategoryDoc, type TransactionDoc, getTransactions } from '~/lib/db';
  import { categoires } from '~/lib/store';
  import { formatAmount, formatTimestamp } from '~/lib/utils';

  const now = new Date();
  let monthYear = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  let incomeCat: Cat | undefined = null;
  let expenseCat: Cat | undefined = null;

  let docs: TransactionDoc[] | null = null;

  const categoryHash = $categoires.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  $: updateData(monthYear);

  function updateData(monthYear: string) {
    const [year, month] = monthYear.split('-');
    const start = new Date(parseInt(year), parseInt(month) - 1, 1).getTime();
    const end = new Date(parseInt(year), parseInt(month), 1).getTime();
    // console.log('start:', start);
    // console.log('end:', end);

    getTransactions(start, end).then((docs) => {
      // console.log('total docs:', docs.length);
      const incomeDocs = docs.filter((doc) => doc.kind === TransactionKind.Income);
      const expenseDocs = docs.filter((doc) => doc.kind === TransactionKind.Expense);

      incomeCat = groupByCategory(incomeDocs);
      expenseCat = groupByCategory(expenseDocs);
      addSorted(incomeCat);
      addSorted(expenseCat);

      // console.log('income:', incomeCat);
      // console.log('expences income:', expenseCat);
    });
  }

  function groupByCategory(docs: TransactionDoc[]): Cat {
    return docs.reduce(
      (acc, doc) => {
        const cat = categoryHash[doc.categoryId] as CategoryDoc;
        if (cat) {
          if (!acc.cats[cat.title]) {
            acc.cats[cat.title] = {
              title: cat.title,
              cats: {},
              docs: [],
              total: 0
            };
          }
          acc.cats[cat.title].total += doc.amount;
          acc.cats[cat.title].docs.push(doc);
          if (cat.subtitle) {
            if (!acc.cats[cat.title].cats[cat.subtitle]) {
              acc.cats[cat.title].cats[cat.subtitle] = {
                title: cat.subtitle,
                docs: [],
                total: 0
              };
            }
            acc.cats[cat.title].cats[cat.subtitle].total += doc.amount;
            acc.cats[cat.title].cats[cat.subtitle].docs.push(doc);
          }
        }
        acc.total += doc.amount;
        // acc.docs.push(doc);
        return acc;
      },
      {
        cats: {},
        docs: [],
        total: 0
      }
    );
  }

  function addSorted(cat: Cat) {
    if (cat.cats) {
      cat.sorted = Object.values(cat.cats).sort((a, b) => {
        return b.total - a.total;
      });

      cat.sorted.forEach((item) => {
        if (item.cats) {
          addSorted(item);
        }
      });
    }
  }

  function ondocs(d: TransactionDoc[]) {
    docs = d;
  }
</script>

<View>
  <Header slot="header" title="Report" returnPath="/" />

  <div class="form">
    <input class="input" type="month" bind:value={monthYear} />
  </div>

  {#if incomeCat}
    <div class="header">
      <span class="title">Income</span>
      <span>{formatAmount(incomeCat.total, true)}</span>
    </div>
    <ReportCat cat={incomeCat} {ondocs} />
  {/if}

  {#if expenseCat}
    <div class="header">
      <span class="title">Expenses</span>
      <span>{formatAmount(expenseCat.total, true)}</span>
    </div>
    <ReportCat cat={expenseCat} {ondocs} />
  {/if}

  {#if docs}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="popup">
      <div class="content">
        <div class="header">
          <h2>Transactions</h2>
          <button
            class="close"
            on:click={(e) => {
              docs = null;
            }}>X</button>
        </div>

        {#each docs as doc}
          <div class="transaction">
            <div class="top">
              <span class="comment">{doc.comment}</span>
              <span class="amount"
                >{formatAmount(
                  doc.kind === TransactionKind.Expense ? -doc.amount : doc.amount,
                  true,
                  true
                )}</span>
            </div>

            <div class="bottom">
              {#if categoryHash[doc.categoryId]}
                <span class="category">
                  {`${categoryHash[doc.categoryId].title}${categoryHash[doc.categoryId].subtitle ? `:${categoryHash[doc.categoryId].subtitle}` : ''}`}
                </span>
              {/if}
              <span class="date">
                {formatTimestamp(doc.timestamp)}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</View>

<style lang="scss">
  .form {
    padding: 10px;
  }

  .input {
    font-size: inherit;
    padding: 5px;
    width: 100%;
    border: 1px solid #777;
    outline: none;
    border-radius: 3px;
  }

  .header {
    padding: 0 10px;
    background-color: #f4f4f8;
    display: flex;
    border-top: 1px solid #ddd;

    font-weight: bold;
    color: #777;
    gap: 10px;

    > .title {
      flex: 1 1 auto;
    }
  }

  .popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: #8885;

    padding: 10px;
    overflow: auto;
    display: flex;
    align-items: stretch;

    > .content {
      // border: 1px solid #aaa;
      flex: 1 1 auto;
      background-color: #fff;
      overflow-y: auto;
      box-shadow:
        0 1px 3px hsl(0deg 0% 0% / 16%),
        0 2px 6px hsl(0deg 0% 0% / 16%),
        0 3px 8px hsl(0deg 0% 0% / 19%);

      > .header {
        display: flex;
        padding: 0;
        align-items: center;

        border-top: none;
        border-bottom: 1px solid #ddd;
        position: sticky;
        top: 0;

        h2 {
          margin: 0px 10px;
          font-size: 16px;
          font-weight: bold;

          flex: 1 1 auto;
        }

        .close {
          margin-left: auto;
          margin: 5px;
          vertical-align: middle;
          padding: 5px 10px;
        }
      }
    }
  }

  .transaction {
    padding: 5px 10px;
    border-bottom: 1px solid #ddd;

    > .top {
      display: flex;
      > .amount {
        margin-left: auto;
      }
    }

    > .bottom {
      display: flex;
      .date {
        font-size: 13px;
        margin-left: auto;
        color: #aaa;
      }
    }
  }

  .category {
    font-size: 13px;
    border: 1px solid #ddd;
    background-color: #eee;
    padding: 1px 3px;
    border-radius: 5px;
    line-height: 1em;
    white-space: nowrap;
  }
</style>
