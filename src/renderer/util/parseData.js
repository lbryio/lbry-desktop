// JSON parser
const parseJson = (data, filters = []) => {
  const list = data.map(item => {
    const temp = {};
    // Apply filters
    for (const [key, value] of Object.entries(item)) {
      if (!filters.includes(key)) temp[key] = value;
    }
    return temp;
  });
  // Beautify JSON
  return JSON.stringify(list, null, '\t');
}

// CSV Parser
// No need for an external module:
// https://gist.github.com/btzr-io/55c3450ea3d709fc57540e762899fb85
const parseCsv = (data, filters=[]) => {

  // Get items for header
  const getHeaders = temp => {
      const headers = [];
      // Apply filters
      for (const [key] of Object.entries(temp)) {
        !filters.includes(key) && headers.push(key);
      }
      return headers.join(',');
  };

  // Get rows content
  const getData = list =>
    list.map(item => {
          const row = [];
           // Apply filters
          for (const [key, value] of Object.entries(item)) {
            !filters.includes(key) && row.push(value);
          }
        return row.join(',');
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
