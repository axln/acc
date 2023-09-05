<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import Home from '~/components/views/Home.svelte';
  import AccountGroups from '~/components/views/AccountGroups.svelte';
  import AccountGroupEditor from '~/components/views/AccountGroupEditor.svelte';
  import AccountEditor from '~/components/views/AccountEditor.svelte';
  import AccountView from '~/components/views/AccountView.svelte';
  import Categoies from '~/components/views/Categoies.svelte';
  import Settings from '~/components/views/Settings.svelte';
  import Currencies from '~/components/views/Currencies.svelte';
  import CategoryEditor from '~/components/views/CategoryEditor.svelte';
  import CurrencyEditor from '~/components/views/CurrencyEditor.svelte';
  import TransactionEditor from '~/components/views/TransactionEditor.svelte';
  import { initTask } from '~/lib/db';
  import { basepath } from './lib/const';
</script>

{#await initTask then}
  <Router {basepath}>
    <Route path="/" component={Home} />
    <Route path="/groups" component={AccountGroups} />
    <Route path="/groups/new" component={AccountGroupEditor} />
    <Route path="/groups/:id" component={AccountGroupEditor} />
    <Route path="/accounts/new" component={AccountEditor} />
    <Route path="/accounts/:id" component={AccountView} />
    <Route path="/accounts/:id/edit" component={AccountEditor} />
    <Route path="/accounts/:id/transactions/new" component={TransactionEditor} />
    <Route path="/accounts/:id/transactions/:tid" component={TransactionEditor} />
    <Route path="/categories" component={Categoies} />
    <Route path="/categories/new" component={CategoryEditor} />
    <Route path="/categories/:id" component={CategoryEditor} />
    <Route path="/currencies" component={Currencies} />
    <Route path="/currencies/new" component={CurrencyEditor} />
    <Route path="/currencies/:cid" component={CurrencyEditor} />
    <Route path="/settings" component={Settings} />
    <Route>
      <h2>Default route test</h2>
    </Route>
  </Router>
{/await}
