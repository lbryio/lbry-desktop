// @flow
import React from 'react';
import Button from 'component/button';
import { getSavedPassword } from 'util/saved-passwords';
import Card from 'component/common/card';
import { withRouter } from 'react-router';
import Spinner from 'component/spinner';
import Lbry from 'lbry';
import ErrorText from 'component/common/error-text';
import I18nMessage from 'component/i18nMessage';

type Props = {
  setSyncEnabled: (boolean) => void,
  syncEnabled: boolean,
  getSyncError: ?string,
  getSyncPending: boolean,
  getSync: (pw: string, cb: () => void) => void,
  checkSync: () => void,
  closeModal: () => void,
  updatePreferences: () => void,
  mode: string,
};

const ENABLE_MODE = 'enable';

// steps
const FETCH_FOR_ENABLE = 'fetch-for-enable';
const FETCH_FOR_DISABLE = 'fetch-for-disable';
const CONFIRM = 'confirm';
const INITIAL = 'initial';
const ERROR = 'error';

const SHARED_KEY = 'shared';
const LOCAL_KEY = 'local';

function SyncEnableFlow(props: Props) {
  const {
    setSyncEnabled,
    getSyncError,
    getSyncPending,
    getSync,
    checkSync,
    mode,
    closeModal,
    updatePreferences,
  } = props;

  const [step, setStep] = React.useState(INITIAL);
  const [prefDict, setPrefDict]: [any, (any) => void] = React.useState();
  const [error, setError] = React.useState();
  const [password, setPassword] = React.useState('');

  const handleSyncToggle = async () => {
    const shared = prefDict.shared;
    const local = prefDict.local;
    let finalPrefs;
    if (shared && local) {
      if (mode === ENABLE_MODE) {
        finalPrefs = makeMergedPrefs(local, shared);
      } else {
        finalPrefs = makeMergedPrefs(shared, local);
      }
    } else {
      finalPrefs = local || shared || null;
    }

    // set busy (disable button)
    if (finalPrefs) {
      await Lbry.preference_set({ key: mode === ENABLE_MODE ? SHARED_KEY : LOCAL_KEY, value: finalPrefs });
    }
    await setSyncEnabled(mode === ENABLE_MODE);
    await updatePreferences();
    closeModal();
  };

  const makeMergedPrefs = (alt, base) => {
    let finalPrefs = base;
    let baseData = base.value;
    let altData = alt.value;
    if (!altData) {
      return base;
    }

    let mergedBlockListSet = new Set(baseData.blocked || []);
    let mergedSubscriptionsSet = new Set(baseData.subscriptions || []);
    let mergedTagsSet = new Set(baseData.tags || []);

    const altBlocklist = altData.blocked || [];
    const altSubscriptions = altData.subscriptions || [];
    const altTags = altData.tags || [];

    if (altBlocklist.length) {
      altBlocklist.forEach((el) => mergedBlockListSet.add(el));
    }
    if (altSubscriptions.length) {
      altSubscriptions.forEach((el) => mergedSubscriptionsSet.add(el));
    }
    if (altTags.length) {
      altTags.forEach((el) => mergedTagsSet.add(el));
    }

    baseData.blocked = Array.from(mergedBlockListSet);
    baseData.subscriptions = Array.from(mergedSubscriptionsSet);
    baseData.tags = Array.from(mergedTagsSet);
    finalPrefs.value = baseData;
    return finalPrefs;
  };

  React.useEffect(() => {
    if (mode) {
      checkSync();
      if (mode === ENABLE_MODE) {
        getSavedPassword().then((pw) => {
          setPassword(pw);
          setStep(FETCH_FOR_ENABLE);
        });
      } else {
        setStep(FETCH_FOR_DISABLE);
      }
    }
  }, [mode, setPassword]);

  React.useEffect(() => {
    if (step === FETCH_FOR_ENABLE) {
      getSync(password, (e, hasChanged) => {
        if (e) {
          setStep(ERROR);
          setError(e && e.message ? e.message : e);
        } else {
          Lbry.preference_get().then((result) => {
            const prefs = {};
            if (result[SHARED_KEY]) prefs[SHARED_KEY] = result[SHARED_KEY];
            if (result[LOCAL_KEY]) prefs[LOCAL_KEY] = result[LOCAL_KEY];
            setPrefDict(prefs);
            setStep(CONFIRM);
          });
        }
      });
    }
    if (step === FETCH_FOR_DISABLE) {
      Lbry.preference_get().then((result) => {
        const prefs = {};
        if (result[SHARED_KEY]) prefs[SHARED_KEY] = result[SHARED_KEY];
        if (result[LOCAL_KEY]) prefs[LOCAL_KEY] = result[LOCAL_KEY];
        setPrefDict(prefs);
        setStep(CONFIRM);
      });
    }
  }, [step, setPrefDict, setStep, password]);

  if (getSyncPending) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <Card
      title={mode === ENABLE_MODE ? 'Enable Sync' : 'Disable Sync'}
      subtitle={
        <div>
          {(error || getSyncError) && (
            <I18nMessage
              tokens={{
                click_here: (
                  <Button
                    button="link"
                    href="https://lbry.com/faq/accounts-and-sync#limitations"
                    label={__('Click here')}
                  />
                ),
              }}
            >
              Something went wrong. Please %click_here% to learn about sync limitations.
            </I18nMessage>
          )}
          {step === INITIAL && (
            <>
              <h1>{__(`Please wait...`)}</h1>
              <Spinner />
            </>
          )}
          {(step === FETCH_FOR_ENABLE || step === FETCH_FOR_DISABLE) && (
            <>
              <h1>{__(`Getting your profiles...`)}</h1>
              <Spinner />
            </>
          )}
          {step === CONFIRM && mode === ENABLE_MODE && (
            <>
              <h1>{__(`Enabling sync will switch to your cloud profile.`)}</h1>
            </>
          )}
          {step === CONFIRM && mode !== ENABLE_MODE && (
            <>
              <h1>{__(`Disabling sync will switch to your local profile.`)}</h1>
            </>
          )}
          {(error || getSyncError) && (
            <>
              <ErrorText>{error || (getSyncError && String(getSyncError)) || __('Unknown error')}</ErrorText>
            </>
          )}
        </div>
      }
      actions={
        <>
          {step === CONFIRM && (
            <div className={'card__actions'}>
              <Button
                button="primary"
                name={'syncbutton'}
                label={mode === ENABLE_MODE ? __('Enable Sync') : __('Disable Sync')}
                onClick={() => handleSyncToggle()}
              />
              <Button button="link" name={'cancel'} label={__('Cancel')} onClick={() => closeModal()} />
            </div>
          )}
          {(step === FETCH_FOR_ENABLE || step === FETCH_FOR_DISABLE) && (
            <div className={'card__actions'}>
              <Button
                button="primary"
                name={'syncbutton'}
                label={mode === ENABLE_MODE ? __('Enable Sync') : __('Disable Sync')}
                onClick={() => handleSyncToggle()}
                disabled
              />
              <Button button="link" name={'cancel'} label={__('Cancel')} onClick={() => closeModal()} />
            </div>
          )}
          {(error || getSyncError) && (
            <div className={'card__actions'}>
              <Button button="primary" name={'cancel'} label={__('Close')} onClick={() => closeModal()} />
              <ErrorText>{error || (getSyncError && String(getSyncError)) || __('Unknown error')}</ErrorText>
            </div>
          )}
        </>
      }
    />
  );
}

export default withRouter(SyncEnableFlow);
