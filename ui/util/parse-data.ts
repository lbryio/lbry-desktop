// JSON parser
type Row = Record<string, unknown>;

const parseJson = (data: Row[], filters: string[] = []): string => {
  const list = data.map((item) => {
    const temp: Record<string, any> = {};
    // Apply filters
    Object.entries(item).forEach(([key, value]) => {
      if (!filters.includes(key)) temp[key] = value;
    });
    return temp;
  });
  // Beautify JSON
  return JSON.stringify(list, null, "\t");
};

// CSV Parser
// No need for an external module:
// https://gist.github.com/btzr-io/55c3450ea3d709fc57540e762899fb85
const parseCsv = (data: Row[], filters: string[] = []): string => {
  // Get items for header
  const getHeaders = (item: Row): string => {
    const list: string[] = [];
    // Apply filters
    Object.entries(item).forEach(([key]) => {
      if (!filters.includes(key)) list.push(key);
    });
    return list.join(",");
  };

  // Get rows content
  const getData = (list: Row[]): string =>
    list
      .map((item) => {
        const row: string[] = [];
        // Apply filters
        Object.entries(item).forEach(([key, value]) => {
          if (!filters.includes(key)) {
            const sanitizedValue = '"' + value + '"';
            row.push(sanitizedValue);
          }
        });
        return row.join(",");
      })
      .join("\n");

  // Return CSV string
  return `${getHeaders(data[0])} \n ${getData(data)}`;
};

const parseData = (data: Row[], format: string, filters: string[] = []): string | undefined => {
  // Check for validation
  const valid = data && data[0] && format;
  // Pick a format
  const formats: Record<string, (list: Row[]) => string> = {
    csv: (list) => parseCsv(list, filters),
    json: (list) => parseJson(list, filters),
  };

  // Return parsed data: JSON || CSV
  return valid && formats[format] ? formats[format](data) : undefined;
};

export default parseData;
