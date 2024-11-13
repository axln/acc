<script lang="ts">
  import Router from 'svelte-spa-router';
  import { type RouteInfo, prevRoute } from '~/lib/store';
  import { initTask } from '~/lib/db';
  import { routes } from './routes';

  let currentRoute: RouteInfo | null = null;
</script>

{#await initTask then}
  <Router
    {routes}
    on:routeLoaded={(event) => {
      // console.log('routeLoaded:', event.detail);

      prevRoute.set(currentRoute);
      currentRoute = {
        route: event.detail.route,
        params: event.detail.params
      };
    }} />
{/await}
