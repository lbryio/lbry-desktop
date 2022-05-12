// @flow
import React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import Card from 'component/common/card';
import ClaimPreview from 'component/claimPreview';
import ChannelSelector from 'component/channelSelector';
import Spinner from 'component/spinner';
import ErrorText from 'component/common/error-text';
import Icon from 'component/common/icon';
import { COUNTRIES } from 'util/country';
import { EMAIL_REGEX } from 'constants/email';
import {
  FF_MAX_CHARS_REPORT_CONTENT_DETAILS,
  FF_MAX_CHARS_REPORT_CONTENT_SHORT,
  FF_MAX_CHARS_REPORT_CONTENT_ADDRESS,
} from 'constants/form-field';
import * as REPORT_API from 'constants/report_content';
import * as ICONS from 'constants/icons';
import { useHistory } from 'react-router-dom';

const PAGE_TYPE = 'page--type';
const PAGE_CATEGORY = 'page--category';
const PAGE_INFRINGEMENT_DETAILS = 'page--infringement-details';
const PAGE_SUBMITTER_DETAILS = 'page--submitter-details';
const PAGE_SUBMITTER_DETAILS_ADDRESS = 'page--submitter-details-address';
const PAGE_CONFIRM = 'page--confirm';
const PAGE_SENT = 'page--sent';

const isDev = process.env.NODE_ENV !== 'production';

const DEFAULT_INPUT_DATA = {
  // page: string,
  type: '',
  category: '',
  timestamp: '',
  additionalDetails: '',
  email: '',
  additional_email: '',
  phone_number: '',
  country: '',
  street_address: '',
  city: '',
  state_or_province: '',
  zip_code: '',
  signature: '',
  reporter_name: '',
  acting_on_behalf_of: REPORT_API.BEHALF_SELF,
  client_name: '',
  specific_law: '',
  law_url: '',
  clarification: '',
  affected_party: REPORT_API.PARTY_SELF,
  copyright_owner_name: '',
  relationship_to_copyrighted_content: '',
  remove_now: true,
};

type Props = {
  claimId: string,
  claim: StreamClaim,
  isReporting: boolean,
  error: string,
  activeChannelClaim: ?ChannelClaim,
  incognito: boolean,
  doClaimSearch: (any) => void,
  doReportContent: (string, string) => void,
};

export default function ReportContent(props: Props) {
  const { isReporting, error, activeChannelClaim, incognito, claimId, claim, doClaimSearch, doReportContent } = props;

  const [input, setInput] = React.useState({ ...DEFAULT_INPUT_DATA });
  const [page, setPage] = React.useState(PAGE_TYPE);
  const [timestampInvalid, setTimestampInvalid] = React.useState(false);
  const [isResolvingClaim, setIsResolvingClaim] = React.useState(false);
  const { goBack } = useHistory();

  // Resolve claim if URL is entered directly or if page is reloaded.
  React.useEffect(() => {
    if (!claim) {
      setIsResolvingClaim(true);
      doClaimSearch({
        page_size: 20,
        page: 1,
        no_totals: true,
        claim_ids: [claimId],
      });
    }
  }, [claim, claimId]);

  // On mount, pause player and get the timestamp, if applicable.
  React.useEffect(() => {
    if (window.player) {
      window.player.pause();

      const seconds = window.player.currentTime();
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor((seconds % 3600) % 60);

      const str = (n) => n.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
      updateInput('timestamp', str(h) + ':' + str(m) + ':' + str(s));
    }
  }, []);

  React.useEffect(() => {
    let timer;
    if (isResolvingClaim) {
      timer = setTimeout(() => {
        setIsResolvingClaim(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isResolvingClaim]);

  function onSubmit() {
    if (!claim) {
      if (isDev) throw new Error('ReportContent::onSubmit -- null claim');
      return;
    }

    const pushParam = (params, label, value, encode = true) => {
      if (encode) {
        params.push(`${label}=${encodeURIComponent(value)}`);
      } else {
        params.push(`${label}=${value}`);
      }
    };

    const params = [];
    pushParam(params, 'primary_email', input.email);
    pushParam(params, 'claim_id', claim.claim_id, false);
    pushParam(params, 'transaction_id', claim.txid, false);
    pushParam(params, 'vout', claim.nout.toString(), false);

    if (!incognito && activeChannelClaim) {
      pushParam(params, 'channel_name', activeChannelClaim.name);
      pushParam(params, 'channel_claim_id', activeChannelClaim.claim_id, false);
    }

    switch (input.type) {
      case REPORT_API.INFRINGES_MY_RIGHTS:
        pushParam(params, 'signature', input.signature);
        switch (input.category) {
          case REPORT_API.COPYRIGHT_ISSUES:
            pushParam(params, 'additional_email', input.additional_email);
            pushParam(params, 'phone_number', input.phone_number);
            pushParam(params, 'country', input.country);
            pushParam(params, 'street_address', input.street_address);
            pushParam(params, 'city', input.city);
            pushParam(params, 'state_or_province', input.state_or_province);
            pushParam(params, 'zip_code', input.zip_code);
            pushParam(params, 'affected_party', input.affected_party);
            pushParam(params, 'copyright_owner_name', input.copyright_owner_name);
            pushParam(params, 'relationship_to_copyrighted_content', input.relationship_to_copyrighted_content);
            pushParam(params, 'remove_now', input.remove_now.toString(), false);
            break;

          case REPORT_API.OTHER_LEGAL_ISSUES:
            pushParam(params, 'reporter_name', input.reporter_name);
            pushParam(params, 'acting_on_behalf_of', input.acting_on_behalf_of);
            pushParam(params, 'specific_law', input.specific_law);
            pushParam(params, 'law_url', input.law_url);
            pushParam(params, 'clarification', input.clarification);
            if (input.acting_on_behalf_of === REPORT_API.BEHALF_CLIENT) {
              pushParam(params, 'client_name', input.client_name);
            }
            break;
        }
        break;

      default:
        pushParam(params, 'type', input.type);
        pushParam(params, 'category', input.category);
        pushParam(params, 'additional_details', input.additionalDetails);
        if (includeTimestamp(claim)) {
          pushParam(params, 'timestamp', input.timestamp);
        }
        break;
    }

    doReportContent(input.category, params.join('&'));
  }

  function updateInput(field: string, value: any) {
    let newInput = input;

    if (isDev && newInput[field] === undefined) {
      throw new Error('Unexpected field: ' + field);
    }

    newInput[field] = value;
    if (field === 'type') {
      newInput['category'] = '';
    }
    setInput({ ...newInput });
  }

  function isInfringementDetailsValid(type: string, category: string) {
    switch (type) {
      case REPORT_API.INFRINGES_MY_RIGHTS:
        switch (category) {
          case REPORT_API.COPYRIGHT_ISSUES:
            return (
              input.affected_party &&
              input.copyright_owner_name &&
              input.relationship_to_copyrighted_content &&
              input.relationship_to_copyrighted_content.length > REPORT_API.RELATIONSHIP_FIELD_MIN_WIDTH
            );
          case REPORT_API.OTHER_LEGAL_ISSUES:
            return (
              input.reporter_name &&
              input.specific_law &&
              input.law_url &&
              input.acting_on_behalf_of &&
              (input.acting_on_behalf_of === REPORT_API.BEHALF_SELF || input.client_name) &&
              input.clarification
            );
          default:
            return false;
        }
      default:
        return (!includeTimestamp(claim) || isTimestampValid(input.timestamp)) && input.additionalDetails;
    }
  }

  function isSubmitterDetailsValid(type: string, category: string) {
    if (category === REPORT_API.COPYRIGHT_ISSUES) {
      return (
        input.email.match(EMAIL_REGEX) &&
        (!input.additional_email || input.additional_email.match(EMAIL_REGEX)) &&
        input.phone_number
      );
    }

    return input.email.match(EMAIL_REGEX);
  }

  function isSubmitterDetailsAddressValid() {
    return input.street_address && input.city && input.state_or_province && input.zip_code && input.country;
  }

  function isTimestampValid(timestamp: string) {
    if (timestamp === '0') {
      return true;
    }

    const length = timestamp.length;
    if (length <= 4) {
      return timestamp.match(/\d:[0-5]\d/);
    } else if (length <= 5) {
      return timestamp.match(/[0-5]\d:[0-5]\d/);
    } else if (length <= 8) {
      return timestamp.match(/\d{1,2}:[0-5]\d:\d\d/);
    } else {
      return false;
    }
  }

  function includeTimestamp(claim: StreamClaim) {
    return (
      claim.value_type === 'stream' && (claim.value.stream_type === 'video' || claim.value.stream_type === 'audio')
    );
  }

  function getActionElem() {
    let body;

    switch (page) {
      case PAGE_TYPE:
        return (
          <>
            <div className="section section--vertical-compact">
              <fieldset>
                {Object.keys(REPORT_API.PARAMETERS['type']).map((x) => {
                  return (
                    <FormField
                      type="radio"
                      name={x}
                      key={x}
                      label={__(String(x))}
                      checked={x === input.type}
                      onChange={() => updateInput('type', x)}
                    />
                  );
                })}
              </fieldset>
            </div>
            <div className="section__actions">
              <Button
                button="primary"
                label={__('Next')}
                disabled={input.type === ''}
                onClick={() => setPage(PAGE_CATEGORY)}
              />
            </div>
          </>
        );

      case PAGE_CATEGORY:
        if (!input.type) {
          return null;
        } else {
          return (
            <>
              <div className="section">
                <div>
                  <b>{__(input.type)}</b>
                </div>
                <div className="section section--vertical-compact">
                  <fieldset>
                    {REPORT_API.PARAMETERS['type'][input.type][REPORT_API.CATEGORIES].map((x) => {
                      return (
                        <FormField
                          type="radio"
                          name={x}
                          key={x}
                          label={__(String(x))}
                          checked={input.category === x}
                          onChange={() => updateInput('category', x)}
                        />
                      );
                    })}
                  </fieldset>
                </div>
              </div>
              <div className="section__actions">
                <Button button="alt" label={__('Back')} onClick={() => setPage(PAGE_TYPE)} />
                <Button
                  button="primary"
                  label={__('Next')}
                  disabled={!input.category || input.category === ''}
                  onClick={() => setPage(PAGE_INFRINGEMENT_DETAILS)}
                />
              </div>
            </>
          );
        }

      case PAGE_INFRINGEMENT_DETAILS:
        switch (input.type) {
          case REPORT_API.INFRINGES_MY_RIGHTS:
            switch (input.category) {
              case REPORT_API.COPYRIGHT_ISSUES:
                body = (
                  <div className="section section--vertical-compact">
                    <FormField
                      type="select"
                      name="affected_party"
                      label={__('Affected party')}
                      value={input.affected_party}
                      onChange={(e) => updateInput('affected_party', e.target.value)}
                      blockWrap={false}
                    >
                      <option key={REPORT_API.PARTY_SELF} value={REPORT_API.PARTY_SELF}>
                        {__(REPORT_API.PARTY_SELF)}
                      </option>
                      <option key={REPORT_API.PARTY_GROUP} value={REPORT_API.PARTY_GROUP}>
                        {__(REPORT_API.PARTY_GROUP)}
                      </option>
                    </FormField>
                    <FormField
                      type="text"
                      name="copyright_owner_name"
                      label={__('Copyright owner name')}
                      value={input.copyright_owner_name}
                      maxlength={REPORT_API.COPYRIGHT_OWNER_MAX_LENGTH}
                      onChange={(e) => updateInput('copyright_owner_name', e.target.value)}
                    />
                    <FormField
                      type="textarea"
                      name="relationship_to_copyrighted_content"
                      label={__('Relationship to copyrighted content')}
                      placeholder={__('(between 10 to 500 characters)')}
                      value={input.relationship_to_copyrighted_content}
                      onChange={(e) => updateInput('relationship_to_copyrighted_content', e.target.value)}
                      charCount={input.relationship_to_copyrighted_content.length}
                      textAreaMaxLength={FF_MAX_CHARS_REPORT_CONTENT_DETAILS}
                      noEmojis
                    />
                    <FormField
                      type="checkbox"
                      name="remove_now"
                      label={__('Remove now')}
                      checked={input.remove_now}
                      onChange={() => updateInput('remove_now', !input.remove_now)}
                    />
                  </div>
                );
                break;

              case REPORT_API.OTHER_LEGAL_ISSUES:
                body = (
                  <div className="section section--vertical-compact">
                    <FormField
                      type="text"
                      name="reporter_name"
                      label={__('Your name')}
                      placeholder={__('Your name')}
                      value={input.reporter_name}
                      onChange={(e) => updateInput('reporter_name', e.target.value)}
                    />
                    <FormField
                      type="select"
                      name="acting_on_behalf_of"
                      label={__('Acting on behalf of')}
                      value={input.acting_on_behalf_of}
                      onChange={(e) => updateInput('acting_on_behalf_of', e.target.value)}
                      blockWrap={false}
                    >
                      <option key={REPORT_API.BEHALF_SELF} value={REPORT_API.BEHALF_SELF}>
                        {__('Self')}
                      </option>
                      <option key={REPORT_API.BEHALF_CLIENT} value={REPORT_API.BEHALF_CLIENT}>
                        {__('Client')}
                      </option>
                    </FormField>
                    {input.acting_on_behalf_of === REPORT_API.BEHALF_CLIENT && (
                      <FormField
                        type="text"
                        name="client_name"
                        label={__('Client name')}
                        placeholder={__('Client name')}
                        value={input.client_name}
                        onChange={(e) => updateInput('client_name', e.target.value)}
                      />
                    )}
                    <FormField
                      type="text"
                      name="specific_law"
                      label={__('Title of specific law')}
                      placeholder={__('Specific law')}
                      value={input.specific_law}
                      onChange={(e) => updateInput('specific_law', e.target.value)}
                    />
                    <FormField
                      type="text"
                      name="law_url"
                      label={__('Law URL')}
                      placeholder={'www.lawsrus.com/copyright-act-2030'}
                      value={input.law_url}
                      onChange={(e) => updateInput('law_url', e.target.value)}
                    />
                    <FormField
                      type="textarea"
                      name="clarification"
                      label={__('Clarification')}
                      placeholder={__('Provide additional details')}
                      value={input.clarification}
                      textAreaMaxLength={FF_MAX_CHARS_REPORT_CONTENT_DETAILS}
                      onChange={(e) => updateInput('clarification', e.target.value)}
                      noEmojis
                    />
                  </div>
                );
                break;

              default:
                if (isDev) throw new Error('Unhandled category for DMCA: ' + input.category);
                body = null;
                break;
            }
            break;

          default:
            body = (
              <>
                {includeTimestamp(claim) && (
                  <div className="section">
                    <FormField
                      type="text"
                      name="timestamp"
                      label={__('Timestamp')}
                      placeholder={'00:23:59'}
                      pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                      value={input.timestamp}
                      maxlength={8}
                      onChange={(e) => {
                        updateInput('timestamp', e.target.value);
                        setTimestampInvalid(!isTimestampValid(e.target.value));
                      }}
                      error={timestampInvalid && input.timestamp ? 'Invalid timestamp (e.g. 05:23, 00:23:59)' : ''}
                    />
                  </div>
                )}
                <div className="section">
                  <FormField
                    type="textarea"
                    name="additional_details"
                    value={input.additionalDetails}
                    onChange={(e) => updateInput('additionalDetails', e.target.value)}
                    charCount={input.additionalDetails.length}
                    textAreaMaxLength={FF_MAX_CHARS_REPORT_CONTENT_DETAILS}
                    placeholder={__('Provide additional details')}
                    noEmojis
                  />
                </div>
              </>
            );
        }

        return (
          <>
            {body}
            <div className="section__actions">
              <Button button="alt" label={__('Back')} onClick={() => setPage(PAGE_CATEGORY)} />
              <Button
                button="primary"
                label={__('Next')}
                disabled={!isInfringementDetailsValid(input.type, input.category)}
                onClick={() => setPage(PAGE_SUBMITTER_DETAILS)}
              />
            </div>
          </>
        );

      case PAGE_SUBMITTER_DETAILS:
        return (
          <>
            <div className="section">
              <div className="section">
                <FormField
                  type="email"
                  name="primary_email"
                  label={__('Email')}
                  placeholder={__('e.g. john@example.com')}
                  value={input.email}
                  onChange={(e) => updateInput('email', e.target.value)}
                />
                {input.category === REPORT_API.COPYRIGHT_ISSUES && (
                  <>
                    <FormField
                      type="email"
                      name="additional_email"
                      label={__('Additional email (optional)')}
                      placeholder={__('e.g. satoshi@example.com')}
                      value={input.additional_email}
                      onChange={(e) => updateInput('additional_email', e.target.value)}
                    />
                    <FormField
                      type="text"
                      name="phone_number"
                      label={__('Phone number')}
                      placeholder={'e.g. +1 (xxx) xxx-xx-xx'}
                      value={input.phone_number}
                      maxlength={FF_MAX_CHARS_REPORT_CONTENT_SHORT}
                      onChange={(e) => updateInput('phone_number', e.target.value)}
                    />
                  </>
                )}
              </div>
              <div className="section">
                <label>{__('Your channel')}</label>
                <Icon
                  className="icon--help"
                  icon={ICONS.HELP}
                  tooltip
                  size={16}
                  customTooltipText={__(
                    'Set to "Anonymous" if you do not want to associate your channel in this report.'
                  )}
                />
                <ChannelSelector />
              </div>
            </div>
            <div className="section__actions">
              <Button button="alt" label={__('Back')} onClick={() => setPage(PAGE_INFRINGEMENT_DETAILS)} />
              <Button
                button="primary"
                label={__('Next')}
                disabled={!isSubmitterDetailsValid(input.type, input.category)}
                onClick={() =>
                  setPage(
                    input.category === REPORT_API.COPYRIGHT_ISSUES ? PAGE_SUBMITTER_DETAILS_ADDRESS : PAGE_CONFIRM
                  )
                }
              />
            </div>
          </>
        );

      case PAGE_SUBMITTER_DETAILS_ADDRESS:
        return (
          <>
            <div className="section section--vertical-compact">
              <FormField
                type="text"
                name="street_address"
                label={__('Address')}
                placeholder={'Street address'}
                value={input.street_address}
                maxlength={FF_MAX_CHARS_REPORT_CONTENT_ADDRESS}
                onChange={(e) => updateInput('street_address', e.target.value)}
              />
              <FormField
                type="text"
                name="city"
                placeholder={__('City')}
                value={input.city}
                maxlength={FF_MAX_CHARS_REPORT_CONTENT_SHORT}
                onChange={(e) => updateInput('city', e.target.value)}
              />
              <FormField
                type="text"
                name="state_or_province"
                placeholder={__('State/province')}
                value={input.state_or_province}
                maxlength={FF_MAX_CHARS_REPORT_CONTENT_SHORT}
                onChange={(e) => updateInput('state_or_province', e.target.value)}
              />
              <FormField
                type="text"
                name="zip_code"
                placeholder={__('Zip code')}
                value={input.zip_code}
                maxlength={FF_MAX_CHARS_REPORT_CONTENT_SHORT}
                onChange={(e) => updateInput('zip_code', e.target.value)}
              />
              <FormField
                type="select"
                name="country"
                label={__('Country')}
                value={input.country}
                maxlength={FF_MAX_CHARS_REPORT_CONTENT_SHORT}
                onChange={(e) => updateInput('country', e.target.value)}
              >
                <option value="" disabled defaultValue>
                  {__('Select your country')}
                </option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </FormField>
            </div>
            <div className="section__actions">
              <Button button="alt" label={__('Back')} onClick={() => setPage(PAGE_SUBMITTER_DETAILS)} />
              <Button
                button="primary"
                label={__('Next')}
                disabled={!isSubmitterDetailsAddressValid()}
                onClick={() => setPage(PAGE_CONFIRM)}
              />
            </div>
          </>
        );

      case PAGE_CONFIRM:
        return (
          <>
            <div className="section section--padded card--inline confirm__wrapper">
              <div className="confirm__label">{__('Contact details')}</div>
              <div className="confirm__value">{input.email}</div>
              {input.type === REPORT_API.INFRINGES_MY_RIGHTS && (
                <FormField
                  type="text"
                  name="signature"
                  label={__('Signature')}
                  placeholder={__('e.g. John Doe')}
                  value={input.signature}
                  maxlength={FF_MAX_CHARS_REPORT_CONTENT_SHORT}
                  onChange={(e) => updateInput('signature', e.target.value)}
                />
              )}
            </div>
            <div className="section">{__('Send report?')}</div>
            <div className="section__actions">
              <Button button="alt" label={__('Back')} onClick={() => setPage(PAGE_SUBMITTER_DETAILS)} />
              <Button
                button="primary"
                label={__('Send Report')}
                disabled={input.type === REPORT_API.INFRINGES_MY_RIGHTS ? !input.signature : false}
                onClick={() => {
                  onSubmit();
                  setPage(PAGE_SENT);
                }}
              />
            </div>
          </>
        );

      case PAGE_SENT:
        if (isReporting) {
          body = <Spinner />;
        } else if (error) {
          body = (
            <div className="error__wrapper--no-overflow">
              <ErrorText>{error}</ErrorText>
            </div>
          );
        } else {
          body = (
            <>
              <div className="section__title">{__('Report submitted')}</div>
              <div className="section">{__('We will review and respond shortly.')}</div>
            </>
          );
        }
        return (
          <>
            <div className="section">{body}</div>
            <div className="section__actions">
              {error && <Button button="alt" label={__('Back')} onClick={() => setPage(PAGE_CONFIRM)} />}
              <Button button="primary" label={__('Close')} disabled={isReporting} onClick={() => goBack()} />
            </div>
          </>
        );
    }
  }

  function getClaimPreview(claim: StreamClaim) {
    return (
      <div className="section">
        <ClaimPreview uri={claim.permanent_url} hideMenu hideActions nonClickable type="small" />
      </div>
    );
  }

  return (
    <Form onSubmit={onSubmit}>
      <Card
        title={claim && claim.value_type === 'channel' ? __('Report channel') : __('Report content')}
        subtitle={claim ? getClaimPreview(claim) : null}
        actions={claim ? getActionElem() : isResolvingClaim ? <Spinner /> : __('Invalid claim ID')}
      />
    </Form>
  );
}
