// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';

type HomepageOrder = { active: ?Array<string>, hidden: ?Array<string> };

const FYP_SECTION: RowDataItem = {
  id: 'FYP',
  title: 'Recommended',
  icon: ICONS.GLOBE,
  link: `/$/${PAGES.FYP}`,
};

function pushAllValidCategories(rowData: Array<RowDataItem>, hasMembership: ?boolean) {
  const x: Array<RowDataItem> = [];

  rowData.forEach((data: RowDataItem) => {
    if (!data.hideByDefault) {
      x.push(data);
    }

    if (data.id === 'FOLLOWING' && hasMembership) {
      x.push(FYP_SECTION);
    }
  });

  return x;
}

export function getSortedRowData(
  authenticated: boolean,
  hasMembership: ?boolean,
  homepageOrder: HomepageOrder,
  rowData: Array<RowDataItem>
) {
  let sortedRowData: Array<RowDataItem> = [];

  if (authenticated) {
    if (homepageOrder.active) {
      // Grab categories that are still valid in the latest homepage:
      homepageOrder.active.forEach((key) => {
        const dataIndex = rowData.findIndex((data) => data.id === key);
        if (dataIndex !== -1) {
          sortedRowData.push(rowData[dataIndex]);
          rowData.splice(dataIndex, 1);
        } else if (key === 'FYP') {
          // Special-case injection (not part of category definition):
          sortedRowData.push(FYP_SECTION);
        }
      });

      // For remaining 'rowData', display it if it's a new category:
      rowData.forEach((data: RowDataItem) => {
        if (!data.hideByDefault) {
          if (!homepageOrder.hidden || !homepageOrder.hidden.includes(data.id)) {
            sortedRowData.push(data);
          }
        }
      });
    } else {
      sortedRowData = pushAllValidCategories(rowData, hasMembership);
    }
  } else {
    sortedRowData = pushAllValidCategories(rowData, hasMembership);
  }

  return sortedRowData;
}
