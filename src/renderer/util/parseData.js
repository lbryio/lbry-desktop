// Beautify JSON
const parseJson = data => JSON.stringify(data, null, '\t');

// No need for an external module:
// https://gist.github.com/btzr-io/55c3450ea3d709fc57540e762899fb85
const parseCsv = (data, filters=[]) => {

  // Filters!
  const filterKeys = (list, ([key])) => {
      !filters.includes(key) && list.push(key)
      return list;
  };

  const filterValues = (list, ([key, value])) => {
      !filters.includes(key) && list.push(value||'')
      return list;
  };

  // Get items for header
  const getHeaders = temp =>
    Object.entries(temp)
      .reduce(filterKeys)
      .join(',');

  // Get rows content
  const getData = list =>
    list
      .map(item => {
        const row = Object.entries(item)
          .reduce(filterValues)
          .join(',');
        return row;
      })
      .join('\n');
  // Return CSV string
  return `${getHeaders(data[0])} \n ${getData(data)}`;
};

const parseData = (data, format, filters=[]) => {
  // Check for validation
  const valid = data && data[0] && format;
  // Pick a format
  const formats = {
    csv: (list, filters) => parseCsv(list, filters),
    json: (list, filters) => parseJson(list, filters),
  };

  // Return parsed data: JSON || CSV
  return valid && formats[format] ? formats[format](data, filters) : undefined;
};

export default parseData;
