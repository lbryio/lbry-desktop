// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import moment from 'moment';
import classnames from 'classnames';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import { navigate } from '@reach/router';
import { formatLbryUriForWeb } from 'util/uri';

type Props = {
  lastViewed: number,
  uri: string,
  claim: ?Claim,
  selected: boolean,
  onSelect?: () => void,
  resolveUri: string => void,
  slim: boolean,
};

class NavigationHistoryItem extends React.PureComponent<Props> {
  static defaultProps = {
    slim: false,
  };

  componentDidMount() {
    const { claim, uri, resolveUri } = this.props;

    if (!claim) {
      resolveUri(uri);
    }
  }

  render() {
    const { lastViewed, selected, onSelect, claim, uri, slim } = this.props;

    let name;
    let title;
    if (claim && claim.value && claim.value.stream) {
      ({ name } = claim);
      ({ title } = claim.value.stream.metadata);
    }

    const navigatePath = formatLbryUriForWeb(uri);
    const onClick =
      onSelect ||
      function() {
        navigate(navigatePath);
      };

    return (
      <div
        role="button"
        onClick={onClick}
        className={classnames('item-list__row', {
          'item-list__row--selected': selected,
        })}
      >
        {!slim && <FormField checked={selected} type="checkbox" onChange={onSelect} />}
        <span className="time time--ago">{moment(lastViewed).from(moment())}</span>
        <Button className="item-list__element" constrict button="link" label={uri} navigate={uri} />
        <span className="item-list__element">{title}</span>
      </div>
    );
  }
}

export default NavigationHistoryItem;
