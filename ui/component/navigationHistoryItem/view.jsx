// @flow
import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import { withRouter } from 'react-router-dom';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  lastViewed: number,
  uri: string,
  claim: ?StreamClaim,
  selected: boolean,
  onSelect?: () => void,
  resolveUri: string => void,
  slim: boolean,
  history: { push: string => void },
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
    const { lastViewed, selected, onSelect, claim, uri, slim, history } = this.props;

    let title;
    if (claim && claim.value) {
      ({ title } = claim.value);
    }

    const navigatePath = formatLbryUrlForWeb(uri);
    const onClick =
      onSelect ||
      function() {
        history.push(navigatePath);
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
        <span className="">{moment(lastViewed).from(moment())}</span>
        <Button className="item-list__element" button="link" label={uri} navigate={uri} />
        <span className="item-list__element">{title}</span>
      </div>
    );
  }
}

export default withRouter(NavigationHistoryItem);
