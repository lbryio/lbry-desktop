function parseQueryParams(queryString) {
  if (queryString === '') return {};
  const parts = queryString
    .split('?')
    .pop()
    .split('&')
    .map(function(p) { return p.split('=') })

  const params = {};
  parts.forEach(function(arr) {
    params[arr[0]] = arr[1];
  })
  return params;
}

export default parseQueryParams
