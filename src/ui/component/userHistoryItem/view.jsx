// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import moment from 'moment';
import classnames from 'classnames';
import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  lastViewed: number,
  uri: string,
  claim: ?Claim,
  selected: boolean,
  onSelect: () => void,
  resolveUri: string => void,
};

class UserHistoryItem extends React.PureComponent<Props> {
  componentDidMount() {
    const { claim, uri, resolveUri } = this.props;

    if (!claim) {
      resolveUri(uri);
    }
  }

  render() {
    const { lastViewed, selected, onSelect, claim } = this.props;

    let name;
    let title;
    let uri;
    if (claim && claim.value && claim.value.stream) {
      ({ name } = claim);
      ({ title } = claim.value.stream.metadata);
      uri = claim.permanent_url;
    }

    return (
      <div
        role="button"
        onClick={onSelect}
        className={classnames('item-list__item', {
          'item-list__item--selected': selected,
        })}
      >
        <FormField checked={selected} type="checkbox" onChange={onSelect} />
        <span className="time time--ago">{moment(lastViewed).from(moment())}</span>
        <span className="item-list__item--cutoff">{title}</span>
        <Button
          constrict
          button="link"
          label={name ? `lbry://${name}` : `lbry://...`}
          navigate={uri}
        />
      </div>
    );
  }
}

export default UserHistoryItem;
