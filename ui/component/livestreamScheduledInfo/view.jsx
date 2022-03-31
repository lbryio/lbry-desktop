// @flow

import React, { useState, useEffect } from 'react';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import moment from 'moment';
import 'scss/component/livestream-scheduled-info.scss';
import I18nMessage from 'component/i18nMessage';
import { getTimeAgoStr } from 'util/time';

type Props = {
  releaseTimeMs: number,
};

export default function LivestreamScheduledInfo(props: Props) {
  const { releaseTimeMs } = props;
  const [startDateFromNow, setStartDateFromNow] = useState('');
  const [inPast, setInPast] = useState('pending');

  useEffect(() => {
    const calcTime = () => {
      const zeroDurationStr = '---';
      const timeAgoStr = getTimeAgoStr(releaseTimeMs, true, true, zeroDurationStr);

      if (timeAgoStr === zeroDurationStr) {
        setInPast(true);
      } else {
        setStartDateFromNow(timeAgoStr);
        setInPast(releaseTimeMs < Date.now());
      }
    };

    const intervalId = setInterval(calcTime, 1000);
    return () => clearInterval(intervalId);
  }, [releaseTimeMs]);

  const startDate = moment(releaseTimeMs).format('MMMM Do, h:mm a');

  return (
    inPast !== 'pending' && (
      <div className={'livestream-scheduled'}>
        <Icon icon={ICONS.LIVESTREAM_SOLID} size={32} />
        <p className={'livestream-scheduled__time'}>
          {!inPast && (
            <span>
              <I18nMessage tokens={{ time_date: startDateFromNow }}>Live %time_date%</I18nMessage>
              <br />
              <span className={'livestream-scheduled__date'}>{startDate}</span>
            </span>
          )}
          {inPast && <span>{__('Starting Soon')}</span>}
        </p>
      </div>
    )
  );
}
