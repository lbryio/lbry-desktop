// JSON parser
const parseJson = (data, filters = []) => {
  const list = data.map(item => {
    const temp = {};
    // Apply filters
    Object.entries(item).forEach(([key, value]) => {
      if (!filters.includes(key)) temp[key] = value;
    });
    return temp;
  });
  // Beautify JSON
  return JSON.stringify(list, null, '\t');
};

// CSV Parser
// No need for an external module:
// https://gist.github.com/btzr-io/55c3450ea3d709fc57540e762899fb85
const parseCsv = (data, filters = []) => {
  // Get items for header
  const getHeaders = temp => {
    // Apply filters
    return Object.entries(temp)
      .map(([key]) => {
        if (!filters.includes(key)) return key;
      })
      .join(',');
  };

  // Get rows content
  const getData = list => {
    return list
      .map(item =>
        Object.entries(item)
          .map(([key, value]) => {
            if (!filters.includes(key)) return value;
          })
          .join(',')
      )
      .join('\n');
  };

  // Return CSV string
  return `${getHeaders(data[0])} \n ${getData(data)}`;
};

const parseData = (data, format, filters = []) => {
  // Check for validation
  const valid = data && data[0] && format;
  // Pick a format
  const formats = {
    csv: list => parseCsv(list, filters),
    json: list => parseJson(list, filters),
  };

  // Return parsed data: JSON || CSV
  return valid && formats[format] ? formats[format](data) : undefined;
};

export default parseData;
