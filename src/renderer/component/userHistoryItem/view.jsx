// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import moment from 'moment';
import classnames from 'classnames';
import { FormRow, FormField } from 'component/common/form';

type Props = {
  lastViewed: number,
  uri: string,
  claim: ?{}
};

class UserHistoryItem extends React.PureComponent<Props> {
  componentDidMount() {
    const { claim, uri, resolveUri } = this.props;
    
    if (!claim) {
      console.log("fetch claim")
      resolveUri(uri)
    }
  }

  render() {
    const { lastViewed, selected, onSelect, claim } = this.props;
    
    let name;
    if (claim) {
      ({ name } = claim);
    }

    return (
        <tr className={classnames({
              "history__selected": selected
            })}>
          <td>
            <FormField
              checked={selected}
              type="checkbox"
              onClick={onSelect}
              />
          </td>
          <td>
            {moment(lastViewed).from(moment())}
          </td>
          <td>
            {name}
          </td>
      </tr>
    );
  }
}
export default UserHistoryItem;
