// @flow
import React from 'react';
// $FlowFixMe
import homepages from 'homepages';
import LANGUAGES from 'constants/languages';
import { FormField } from 'component/common/form';

type Props = {
  homepage: string,
  setHomepage: string => void,
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
  // return (
  //   <Menu>
  //     <MenuButton className="button button-toggle button--alt">
  //       <Icon icon={ICONS.WEB} />
  //       <span className="button__label">{`${homepage}`}</span>
  //     </MenuButton>
  //     <MenuList className="menu__list">
  //       {Object.keys(homepages).map(k => {
  //         return (
  //           <MenuItem
  //             className={classnames('comment__menu-option menu__link', { 'menu__link--active': homepage === k })}
  //             key={k}
  //             onSelect={() => handleSetHomepage(k)}
  //           >
  //             {`${LANGUAGES[k][1]}`}
  //           </MenuItem>
  //         );
  //       })}
  //     </MenuList>
  //   </Menu>
  // );
  return (
    <React.Fragment>
      <FormField
        name="homepage_select"
        type="select"
        label={__('Homepage')}
        onChange={handleSetHomepage}
        value={homepage}
        helper={__(
          'Multi-language support is brand new and incomplete. Switching your language may have unintended consequences, like glossolalia.'
        )}
      >
        {Object.keys(homepages).map(hp => (
          <option key={'hp' + hp} value={hp}>
            {`${LANGUAGES[hp][1]}`}
          </option>
        ))}
      </FormField>
    </React.Fragment>
  );
}

export default SelectHomepage;
