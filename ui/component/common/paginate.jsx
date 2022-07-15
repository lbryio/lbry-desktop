// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { Form, FormField } from 'component/common/form';
import ReactPaginate from 'react-paginate';
import { useIsMobile } from 'effects/use-screensize';

const PAGINATE_PARAM = 'page';

type Props = {
  totalPages: number,
  location: { search: string },
  history: { push: (string) => void },
  onPageChange?: (number) => void,
  disableHistory?: boolean, // Disables the use of '&page=' param and history stack.
};

function Paginate(props: Props) {
  const { totalPages = 1, location, history, onPageChange, disableHistory } = props;
  const { search } = location;
  const [textValue, setTextValue] = React.useState('');
  const urlParams = new URLSearchParams(search);
  const urlParamPage = Number(urlParams.get(PAGINATE_PARAM));
  const initialPage = disableHistory ? 1 : urlParamPage || 1;
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const isMobile = useIsMobile();

  function handleChangePage(newPageNumber: number) {
    if (onPageChange) {
      onPageChange(newPageNumber);
    }

    if (currentPage !== newPageNumber) {
      setCurrentPage(newPageNumber);

      if (!disableHistory) {
        const params = new URLSearchParams(search);
        params.set(PAGINATE_PARAM, newPageNumber.toString());
        history.push('?' + params.toString());
      }
    }
  }

  function handlePaginateKeyUp() {
    const newPage = Number(textValue);
    if (newPage && newPage > 0 && newPage <= totalPages) {
      handleChangePage(newPage);
    }
    setTextValue('');
  }

  React.useEffect(() => {
    if (urlParamPage) {
      setCurrentPage(urlParamPage);
    }
  }, [urlParamPage, setCurrentPage]);

  return (
    // Hide the paginate controls if we are loading or there is only one page
    // It should still be rendered to trigger the onPageChange callback
    <Form style={totalPages <= 1 ? { display: 'none' } : null} onSubmit={handlePaginateKeyUp}>
      <fieldset-group class="fieldset-group--smushed fieldgroup--paginate">
        <fieldset-section>
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={2}
            previousLabel="‹"
            nextLabel="›"
            activeClassName="pagination__item--selected"
            pageClassName="pagination__item"
            previousClassName="pagination__item pagination__item--previous"
            nextClassName="pagination__item pagination__item--next"
            breakClassName="pagination__item pagination__item--break"
            marginPagesDisplayed={2}
            onPageChange={(e) => handleChangePage(e.selected + 1)}
            forcePage={currentPage - 1}
            initialPage={currentPage - 1}
            containerClassName="pagination"
          />
        </fieldset-section>
        {!isMobile && (
          <FormField
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="paginate-channel"
            label={__('Go to page:')}
            type="text"
            name="paginate-file"
          />
        )}
      </fieldset-group>
    </Form>
  );
}

export default withRouter(Paginate);
