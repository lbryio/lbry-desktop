// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import moment from 'moment';
import classnames from 'classnames';
import Button from 'component/button';

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
      <tr
        onClick={onSelect}
        className={classnames({
          history__selected: selected,
        })}
      >
        <td>
          <input checked={selected} type="checkbox" onClick={onSelect} />
        </td>
        <td>{moment(lastViewed).from(moment())}</td>
        <td>{title}</td>
        <td>
          <Button
            tourniquet
            button="link"
            label={name ? `lbry://${name}` : `lbry://...`}
            navigate="/show"
            navigateParams={{ uri }}
          />
        </td>
      </tr>
    );
  }
}

export default UserHistoryItem;
