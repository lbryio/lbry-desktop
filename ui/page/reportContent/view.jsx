// @flow
import React, { useState } from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import * as ICONS from 'constants/icons';
import Page from 'component/page';

type Props = {
  claimId: string,
};

const ReportContentPage = (props: Props) => {
  const { claimId } = props;
  const [selectedBtn, setSelectedBtn] = useState(0);
  const [why, setWhy] = useState('');
  const [error, setError] = useState('');

  const confirmReport = e => {
    e.preventDefault();

    if (why !== '') {
      let reportType = '';

      switch (selectedBtn) {
        case 0:
          reportType = 'Mistag';
          break;
        case 1:
          reportType = 'Spam';
          break;
        case 2:
          reportType = 'Illegal Promotion';
          break;
        case 3:
          reportType = 'Violence';
          break;
        case 4:
          reportType = 'Child Abuse';
          break;
        case 5:
          reportType = 'Promotes Terrorism';
          break;
      }

      setError('');
      console.log(reportType);
    } else setError('All Fields Required');
  };

  return (
    <Page>
      <h1 className="section__title">{__('General Report')}</h1>
      <br />
      <hr />
      <br />
      <blockquote>
        <b>claimId</b>: {claimId}
      </blockquote>
      <br />
      <hr />
      <br />

      <p>{__('Choose an option according to the violation')}</p>

      <br />
      <hr />
      <br />

      <React.Fragment>
        <FormField
          checked={selectedBtn === 0}
          type="radio"
          onChange={() => setSelectedBtn(0)}
          name="Mistagged content"
          label={
            <div>
              {__('Mistagged Content')}
              <Button
                className="icon--help"
                title={__('Wrong tags, Mature content not tagged "Mature", Tag abuse, Tag filter bypass attempt')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 1}
          type="radio"
          onChange={() => setSelectedBtn(1)}
          name="Spam"
          label={
            <div>
              {__('Spam')}
              <Button
                className="icon--help"
                title={__(
                  'Excessively Posted,Untargeted,Misleading,Malformed/Manipulated Content or Contains Malware.'
                )}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 2}
          type="radio"
          onChange={() => setSelectedBtn(2)}
          name="Illegal Promotions"
          label={
            <div>
              {__('Illegal Promotion')}
              <Button
                className="icon--help"
                title={__('Selling/Promoting drugs,guns or other illegal material or potentially prohibited by law')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 3}
          type="radio"
          onChange={() => setSelectedBtn(3)}
          name="Violent or Repulsive"
          label={
            <div>
              {__('Violent or Repulsive')}
              <Button
                className="icon--help"
                title={__(
                  'Inciting for violent acts, Physical or Sexual assaults, Media containing severed limbs or such procedures'
                )}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 4}
          type="radio"
          onChange={() => setSelectedBtn(4)}
          name="Child Abuse"
          label={
            <div>
              {__('Child Abuse')}
              <Button
                className="icon--help"
                title={__('Physical or Sexual assault or Mental/Emotional maltreatment which involves "Child"')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 5}
          type="radio"
          onChange={() => setSelectedBtn(5)}
          name="Promotes Terrorism"
          label={
            <div>
              {__('Promotes Terrorism')}
              <Button
                className="icon--help"
                title={__('Medias or contents inciting terrorism or extremism or refers to such organization')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />

        <br />
        <hr />
        <br />

        <div>
          <FormField
            type="text"
            value={why}
            error={error}
            onChange={e => setWhy(e.target.value)}
            name="Why do you think this violates our policy?"
            label={__('Why do you think this violates our policy?')}
          />
        </div>
      </React.Fragment>
      <br />
      <p>
        Please <b>Double Check</b> All Fields, Invalid Reports Will Be Rejected
      </p>
      <hr />
      <div className="card__actions">
        <Button button="primary" onClick={confirmReport} label={__('Report')} />
      </div>
    </Page>
  );
};

export default ReportContentPage;
