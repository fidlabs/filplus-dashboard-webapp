function createNode(text) {
  const node = document.createElement('pre');
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.position = 'fixed';
  node.style.top = '5px';
  node.textContent = text;
  return node;
}

function copyNode(node) {
  const selection = document.getSelection();
  selection.removeAllRanges();

  const range = document.createRange();
  range.selectNodeContents(node);
  selection.addRange(range);

  document.execCommand('copy');
  selection.removeAllRanges();
}

export function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    try {
      const node = createNode(text);
      document.body.appendChild(node);
      copyNode(node);
      document.body.removeChild(node);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}
