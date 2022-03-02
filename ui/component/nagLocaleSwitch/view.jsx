// @flow
import { FormField } from 'component/common/form';
import * as MODALS from 'constants/modal_types';
import HOMEPAGE_LANGUAGES, { getHomepageLanguage } from 'constants/homepage_languages';
import Nag from 'component/common/nag';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import { getLanguageEngName, getLanguageName } from 'constants/languages';

const LOCALE_OPTIONS = {
  BOTH: 'both',
  LANG: 'lang',
  HOME: 'home',
};

type Props = {
  localeLangs: Array<string>,
  noLanguageSet: boolean,
  // redux
  doSetLanguage: (string) => void,
  doSetHomepage: (string) => void,
  doOpenModal: (string, {}) => void,
};

export default function NagLocaleSwitch(props: Props) {
  const { localeLangs, noLanguageSet, doSetLanguage, doSetHomepage, doOpenModal } = props;

  const [switchOption, setSwitchOption] = React.useState(LOCALE_OPTIONS.BOTH);
  const [localeSwitchDismissed, setLocaleSwitchDismissed] = usePersistedState('locale-switch-dismissed', false);

  const hasHomepageForLang = localeLangs.some((lang) => getHomepageLanguage(lang));
  const message = __(
    // If no homepage, only suggest language switch
    !hasHomepageForLang
      ? 'There are language translations available for your location! Do you want to switch from English?'
      : 'A homepage and language translations are available for your location! Do you want to switch?'
  );

  if (localeSwitchDismissed || (!noLanguageSet && !hasHomepageForLang)) return null;

  function dismissNag() {
    setLocaleSwitchDismissed(true);
  }

  function handleSwitch() {
    const homepages = [];
    localeLangs.forEach((lang) => {
      const homepageLanguage = getHomepageLanguage(lang);

      if (homepageLanguage && !homepages.includes(homepageLanguage)) {
        homepages.push(homepageLanguage);
      }
    });

    const homeSwitchSelected = switchOption === LOCALE_OPTIONS.BOTH || switchOption === LOCALE_OPTIONS.HOME;
    const multipleHomepages = homeSwitchSelected && homepages.length > 1;
    const langSwitchSelected = switchOption === LOCALE_OPTIONS.BOTH || switchOption === LOCALE_OPTIONS.LANG;
    const multipleLangs = langSwitchSelected && localeLangs.length > 1;

    // if language or homepage has more than 1 option, modal for selection
    // if some has only one option, still show the selection for confirmation of what's being switched
    if (multipleHomepages || multipleLangs) {
      doOpenModal(MODALS.CONFIRM, {
        title: __('Choose Your Preference'),
        body: (
          <>
            {langSwitchSelected && <LanguageSelect langs={localeLangs} />}
            {homeSwitchSelected && <HomepageSelect homepages={homepages} />}
          </>
        ),
        onConfirm: (closeModal) => {
          if (langSwitchSelected) {
            // $FlowFixMe
            const selection = document.querySelector('.language-switch.checked').id.split(' ')[1];
            doSetLanguage(selection);
          }
          if (homeSwitchSelected) {
            // $FlowFixMe
            const selection = document.querySelector('.homepage-switch.checked').id.split(' ')[1];
            let homepageSelection = '';
            Object.values(HOMEPAGE_LANGUAGES).some((lang, index) => {
              if (lang === selection) {
                homepageSelection = Object.keys(HOMEPAGE_LANGUAGES)[index];
                return true;
              }
            });

            doSetHomepage(homepageSelection);
          }
          dismissNag();
          closeModal();
        },
      });

      // if selected switch has only one option, just make the switch
    } else {
      const onlyLanguage = localeLangs[0];

      if (langSwitchSelected) doSetLanguage(onlyLanguage);
      if (homeSwitchSelected) doSetHomepage(onlyLanguage);

      dismissNag();
    }
  }

  return (
    <Nag
      message={message}
      type="helpful"
      action={
        // Menu field only needed if there is a homepage + language to choose, otherwise
        // there is only 1 option to switch, so use the nag button
        hasHomepageForLang && (
          <FormField
            className="nag__select"
            type="select"
            value={switchOption}
            onChange={(e) => setSwitchOption(e.target.value)}
          >
            <option value={LOCALE_OPTIONS.BOTH}>{__('Both')}</option>
            <option value={LOCALE_OPTIONS.LANG}>{__('Only Language')}</option>
            <option value={LOCALE_OPTIONS.HOME}>{__('Only Homepage')}</option>
          </FormField>
        )
      }
      actionText={__('Switch Now')}
      onClick={handleSwitch}
      onClose={dismissNag}
      closeTitle={__('Dismiss')}
    />
  );
}

type HomepageProps = {
  homepages: Array<string>,
};

const HomepageSelect = (props: HomepageProps) => {
  const { homepages } = props;

  const [selection, setSelection] = React.useState(homepages[0]);

  return (
    <>
      <h1>{__('Homepage')}</h1>

      {homepages.map((homepage) => (
        <FormField
          type="radio"
          className={`homepage-switch ${selection === homepage ? 'checked' : ''}`}
          name={`homepage_switch ${homepage}`}
          key={homepage}
          label={homepage}
          checked={selection === homepage}
          onChange={() => setSelection(homepage)}
        />
      ))}
    </>
  );
};

type LangProps = {
  langs: Array<string>,
};

const LanguageSelect = (props: LangProps) => {
  const { langs } = props;

  const [selection, setSelection] = React.useState(langs[0]);

  return (
    <>
      <h1>{__('Language')}</h1>

      {langs.map((lang) => {
        const language = getLanguageEngName(lang);
        const languageName = getLanguageName(lang);
        const label = language === languageName ? language : `${language} - ${languageName}`;

        return (
          <FormField
            type="radio"
            className={`language-switch ${selection === lang ? 'checked' : ''}`}
            name={`language_switch ${lang}`}
            key={lang}
            label={label}
            checked={selection === lang}
            onChange={() => setSelection(lang)}
          />
        );
      })}
    </>
  );
};
