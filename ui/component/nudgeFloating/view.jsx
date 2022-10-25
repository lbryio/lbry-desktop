// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import Button from 'component/button';

type Props = {
  name: string,
  text: string,
};

export default function NudgeFloating(props: Props) {
  const { name, text } = props;
  const [showNudge, setShowNudge] = React.useState(false);
  const [nudgeAcknowledged, setNudgeAcknowledged] = usePersistedState(name, false);

  React.useEffect(() => {
    if (!nudgeAcknowledged) {
      setShowNudge(true);
    }
  }, [nudgeAcknowledged]);

  return (
    showNudge && (
      <div className="nudge">
        <div className="nudge__wrapper">
          <span className="nudge__text">{text}</span>
          <Button
            className="nudge__close"
            button="close"
            icon={ICONS.REMOVE}
            onClick={() => {
              setNudgeAcknowledged(true);
              setShowNudge(false);
            }}
          />
        </div>
      </div>
    )
  );
}
