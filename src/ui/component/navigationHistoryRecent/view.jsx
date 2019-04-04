// @flow
import React, { Fragment } from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import ReactPaginate from 'react-paginate';
import NavigationHistoryItem from 'component/navigationHistoryItem';

type HistoryItem = {
  uri: string,
  lastViewed: number,
};

type Props = {
  history: Array<HistoryItem>,
  page: number,
  pageCount: number,
  clearHistoryUri: string => void,
  params: { page: number },
};

export default function UserHistoryRecent(props: Props) {
  const { history = [], page, pageCount } = props;

  return history.length ? (
    <div className="item-list">
      <section className="card__content">
        {history.map(({ lastViewed, uri }) => (
          <NavigationHistoryItem slim key={uri} uri={uri} lastViewed={lastViewed} />
        ))}
      </section>
      <div className="card__actions">
        <Button navigate="/$/history/all" button="link" label={__('See All Visited Links')} />
      </div>
    </div>
  ) : null;
}
