export function htmlStringRotate (string, n) {
  var statusDOM = new DOMParser().parseFromString(string, 'text/html');
  var traverse  = statusDOM.createTreeWalker(statusDOM.documentElement, NodeFilter.SHOW_TEXT, 
    (node) => { return (node.parentElement.matches("a, a *") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT); }
  );

  while (traverse.nextNode()) {
    traverse.currentNode.nodeValue = rotn(traverse.currentNode.nodeValue, n);
  }

  return statusDOM.documentElement.innerHTML;
}

export function plaintextStringRotate (string, n) {
  string = string.replace(/(^|\s)(?:[@#]|http[s]?:\/\/).*?(\s|$)/gi, (x) => { return rotn(x, 26-n); });
  string = rotn(string, n);
  return string;
}

// Arbitrary rotN on a string
// (although for most use cases, n=13 will suffice)
function rotn (str, n) {
  return str.replace(/[a-z]/gi, (x) => { return String.fromCharCode(((x = x.charCodeAt(0)) & 31) > 26 - n ? x - (26 - n) : x + n); });
}
