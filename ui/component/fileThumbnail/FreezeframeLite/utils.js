// Modified from
// https://github.com/ctrl-freaks/freezeframe.js/tree/master/packages/freezeframe/src

export const isTouch = () => {
  return 'ontouchstart' in window || 'onmsgesturechange' in window;
};

export const htmlToNode = html => {
  const $wrap = window.document.createElement('div');
  $wrap.innerHTML = html;
  const $content = $wrap.childNodes;
  return $content.length > 1 ? $content : $content[0];
};

export const wrapNode = ($el, $wrapper) => {
  $el.parentNode.insertBefore($wrapper, $el);
  $wrapper.appendChild($el);
};
