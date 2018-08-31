// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import moment from 'moment';
import classnames from 'classnames';
import { FormRow, FormField } from 'component/common/form';
import Button from 'component/button';

type Props = {
  lastViewed: number,
  uri: string,
  claim: ?{},
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
    if (claim) {
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
        <td>
          <Button
            tourniquet
            button="link"
            label={`lbry://${name}`}
            navigate="/show"
            navigateParams={{ uri }}
          />
        </td>
        <td>{title}</td>
      </tr>
    );
  }
}

export default UserHistoryItem;
