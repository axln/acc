export function autoClose(node: HTMLElement) {
  function documentClickHandler(e: MouseEvent) {
    if (e.target instanceof Node && node.hasAttribute('data-opened')) {
      if (!node.contains(e.target)) {
        node.removeAttribute('data-opened');
      }
    }
  }

  function documentKeyHandler(e: KeyboardEvent) {
    if (e.code === 'Escape' && node.hasAttribute('data-opened')) {
      node.removeAttribute('data-opened');
    }
  }

  document.addEventListener('click', documentClickHandler);
  document.addEventListener('keydown', documentKeyHandler);

  return {
    destroy() {
      document.removeEventListener('keydown', documentKeyHandler);
      document.removeEventListener('click', documentClickHandler);
    }
  };
}
