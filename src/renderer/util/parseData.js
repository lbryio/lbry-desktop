// Beautify JSON
const parseJson = data => JSON.stringify(data, null, "\t");

// No need for an external module:
// https://gist.github.com/btzr-io/55c3450ea3d709fc57540e762899fb85
const parseCsv = data => {
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
};

const parseData = (data, format) => {
  // Check for validation
  const valid = data && data[0] && format;
  // Pick a format
  const formats = {
    csv: list => parseCsv(list),
    json: list => parseJson(list),
  };
  // Return parsed data: JSON || CSV
  return valid && formats[format] ? formats[format](data) : undefined;
};

export default parseData;
