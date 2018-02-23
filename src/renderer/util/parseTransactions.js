function parseJson(data) {
  return JSON.stringify(data);
}

function parseCsv(data) {
  // Get items for header
  const getHeaders = temp =>
    Object.entries(temp)
      .map(([key]) => key)
      .join(',');
  // Get rows content
  const getData = list =>
    list
      .map(item => {
        const row = Object.entries(item)
          .map(([key, value]) => value)
          .join(',');
        return row;
      })
      .join('\n');
  // Return CSV string
  return `${getHeaders(data[0])} \n ${getData(data)}`;
}

export function parseTransactions(transactions, format) {
  const formats = {
    csv: data => parseCsv(data),
    json: data => parseJson(data),
  };
  return formats[format] ? formats[format](transactions) : undefined;
}
