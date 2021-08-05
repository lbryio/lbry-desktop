// @flow
import React from 'react';
// $FlowFixMe
import homepages from 'homepages';
import LANGUAGES from 'constants/languages';
import { FormField } from 'component/common/form';
import { getDefaultHomepageKey } from 'util/default-languages';

type Props = {
  homepage: string,
  setHomepage: (string) => void,
};

function SelectHomepage(props: Props) {
  const { homepage, setHomepage } = props;

  function handleSetHomepage(e) {
    const { value } = e.target;
    setHomepage(value);
  }
  if (Object.keys(homepages).length <= 1) {
    return null;
  }
  return (
    <div className="section__actions--between">
      <div>
        <p>{__('Homepage')}</p>
        <p className="help">{__('Tailor your experience.')}</p>
      </div>

      <FormField
        name="homepage_select"
        type="select"
        onChange={handleSetHomepage}
        value={homepage || getDefaultHomepageKey()}
      >
        {Object.keys(homepages).map((hp) => (
          <option key={'hp' + hp} value={hp}>
            {`${LANGUAGES[hp][1]}`}
          </option>
        ))}
      </FormField>
    </div>
  );
}

export default SelectHomepage;
