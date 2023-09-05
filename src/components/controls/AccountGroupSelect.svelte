<script lang="ts">
  import { accountGroups } from '~/lib/store';
  export let groupId: string;
</script>

<select class="select" bind:value={groupId} required>
  <option class="placeholder" value="" disabled selected hidden>Account Group</option>

  {#each $accountGroups as group}
    <option value={group.id}>
      {group.title}
    </option>
  {/each}
</select>

<style lang="scss">
  .select {
    font-size: inherit;
    width: 100%;
    padding: 5px;

    &:invalid {
      color: #777;
    }
  }
</style>
