<script lang="ts">
  import Router from 'svelte-spa-router';
  import { initTask } from '~/lib/db';
  import { routes } from './routes';
</script>

{#await initTask then}
  <Router {routes} />
{/await}
