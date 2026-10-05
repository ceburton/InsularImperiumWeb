// Use rendered text positions so bookmarks survive font changes and resizing.
function textNodes(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}

function characterPage(root: HTMLElement, node: Text, offset: number, stride: number) {
  const range = document.createRange();
  range.setStart(node, offset);
  range.setEnd(node, Math.min(offset + 1, node.length));
  const rect = range.getBoundingClientRect();
  if (!rect.height) return -1;
  return Math.max(0, Math.floor((rect.left - root.getBoundingClientRect().left + 1) / stride));
}

export function pageForOffset(root: HTMLElement, offset: number, stride: number) {
  for (const node of textNodes(root)) {
    if (offset < node.length) {
      const page = characterPage(root, node, offset, stride);
      if (page >= 0) return page;
      offset = node.length;
    }
    offset -= node.length;
  }
  return 0;
}

export function offsetForPage(root: HTMLElement, page: number, stride: number) {
  let offset = 0;
  for (const node of textNodes(root)) {
    if (node.textContent?.trim() && characterPage(root, node, node.length - 1, stride) >= page) {
      let low = 0;
      let high = node.length - 1;
      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (characterPage(root, node, mid, stride) < page) low = mid + 1;
        else high = mid;
      }
      return offset + low;
    }
    offset += node.length;
  }
  return offset;
}
