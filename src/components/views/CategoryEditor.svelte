<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import { createCategory, updateCategory } from '~/lib/db';
  import { categoires } from '~/lib/store';

  export let params: { id?: string } = {};
  const { id } = params;

  let categoryDoc = id ? $categoires.find((item) => item.id === id) : null;
  let title = categoryDoc ? categoryDoc.title : '';
  let subtitle = categoryDoc ? categoryDoc.subtitle : '';

  let titleInput: HTMLInputElement;

  onMount(() => {
    if (titleInput) {
      titleInput.focus();
    }
  });

  function submitHandler() {
    if (title.trim()) {
      if (categoryDoc) {
        updateCategory({
          ...categoryDoc,
          title: title.trim(),
          subtitle: subtitle.trim()
        }).then(() => {
          push(`/categories`);
        });
      } else {
        createCategory(title.trim(), subtitle.trim()).then(() => {
          push(`/categories`);
        });
      }
    } else {
      alert('The title must be specified.');
    }
  }
</script>

<View>
  <Header
    slot="header"
    title={categoryDoc ? 'Category' : 'New Category'}
    returnPath="/categories" />
  <form class="form" on:submit|preventDefault={submitHandler}>
    <div class="row">
      <input type="text" placeholder="Title" bind:value={title} bind:this={titleInput} />
    </div>

    <div class="row">
      <input type="text" placeholder="Subtitle (optional)" bind:value={subtitle} />
    </div>

    <div class="row">
      <button type="submit">{categoryDoc ? 'Save' : 'Create'}</button>
    </div>
  </form>
</View>

<style lang="scss">
  .form {
    margin: 10px;
    font-size: 1rem;
  }

  .row {
    margin: 10px;
    > input {
      width: 100%;
      padding: 5px;
      font-size: inherit;
      outline: none;
    }

    > button {
      width: 100%;
      padding: 5px;
      font-size: inherit;
    }
  }
</style>
