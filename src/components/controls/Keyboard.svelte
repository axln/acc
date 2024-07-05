<script lang="ts">
  import BackspaceIcon from '../icons/BackspaceIcon.svelte';

  export let onkey: (key: string) => void;
  function onkeydown(e) {
    if (e.target instanceof HTMLSpanElement && e.target.dataset.key) {
      onkey(e.target.dataset.key);
    }
  }
</script>

<div class="keyboard" on:pointerdown|preventDefault={onkeydown}>
  <div>
    <span data-key="1">1</span>
    <span data-key="2">2</span>
    <span data-key="3">3</span>
  </div>
  <div>
    <span data-key="4">4</span>
    <span data-key="5">5</span>
    <span data-key="6">6</span>
  </div>
  <div>
    <span data-key="7">7</span>
    <span data-key="8">8</span>
    <span data-key="9">9</span>
  </div>
  <div>
    <span data-key="<">
      <BackspaceIcon size={24} />
    </span>
    <span data-key="0">0</span>
    <span data-key=".">.</span>
  </div>
</div>

<style lang="scss">
  .keyboard {
    > div {
      display: flex;
      gap: 5px;

      & + div {
        margin-top: 5px;
      }

      > span {
        flex: 1 1 0;

        background-color: #eee;
        border-radius: 5px;
        padding: 5px;
        font-size: 26px;
        color: #555;
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
          display: block;
          pointer-events: none;
        }
      }
    }
  }
</style>
