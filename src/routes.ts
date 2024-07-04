import Home from '~/components/views/Home.svelte';
import AccountGroups from '~/components/views/AccountGroups.svelte';
import AccountGroupEditor from '~/components/views/AccountGroupEditor.svelte';
import AccountEditor from '~/components/views/AccountEditor.svelte';
import AccountView from '~/components/views/AccountView.svelte';
import Categoies from '~/components/views/Categoies.svelte';
import Settings from '~/components/views/Settings.svelte';
import Currencies from '~/components/views/Currencies.svelte';
import Rates from '~/components/views/Rates.svelte';
import CategoryEditor from '~/components/views/CategoryEditor.svelte';
import CurrencyEditor from '~/components/views/CurrencyEditor.svelte';
import TransactionEditor from '~/components/views/TransactionEditor.svelte';
import NotFound from '~/components/views/NotFound.svelte';

export const routes = {
  '/': Home,
  '/groups': AccountGroups,
  '/groups/new': AccountGroupEditor,
  '/groups/:id': AccountGroupEditor,
  '/accounts/new': AccountEditor,
  '/accounts/:id/edit': AccountEditor,
  '/accounts/:id': AccountView,
  '/accounts/:id/transactions/new': TransactionEditor,
  '/accounts/:id/transactions/:tid': TransactionEditor,
  '/categories': Categoies,
  '/categories/new': CategoryEditor,
  '/categories/:id': CategoryEditor,
  '/currencies': Currencies,
  '/rates': Rates,
  '/currencies/new': CurrencyEditor,
  '/currencies/:cid': CurrencyEditor,
  '/settings': Settings,
  '*': NotFound
};
