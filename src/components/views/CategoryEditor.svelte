<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import View from '~/components/controls/View.svelte';
  import Header from '~/components/controls/Header.svelte';
  import { createCategory, updateCategory } from '~/lib/db';
  import { categoires } from '~/lib/store';
  import { basepath } from '~/lib/const';

  export let id: string = undefined;
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
          navigate(`${basepath}/categories`);
        });
      } else {
        createCategory(title.trim(), subtitle.trim()).then(() => {
          navigate(`${basepath}/categories`);
        });
      }
    } else {
      alert('The title must be specified.');
    }
  }
</script>

<View>
  <Header slot="header" title={categoryDoc ? 'Category' : 'New Category'} returnPath="categories" />
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

    font-size: 1em;
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
