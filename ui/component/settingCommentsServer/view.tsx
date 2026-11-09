import {COMMENT_SERVER_API, COMMENT_SERVER_NAME} from 'config';
import React from 'react';
import Comments from 'comments';
import ItemInputRow from './internal/input-radio-panel-addCommentServer';
import Button from 'component/button';
import { FormField } from 'component/common/form-components/form-field';

type Props = {
  customServerEnabled: boolean,
  customServerUrl: string,
  setCustomServerEnabled: (arg1: boolean) => void,
  setCustomServerUrl: (arg1: string) => void,
  setCustomServers: (arg1: Array<CommentServerDetails>) => void,
  customCommentServers: Array<CommentServerDetails>
};
const defaultServer = { name: COMMENT_SERVER_NAME, url: COMMENT_SERVER_API } as const;
function SettingCommentsServer(props: Props) {
  const {
    customServerEnabled,
    customServerUrl,
    setCustomServerEnabled,
    setCustomServerUrl,
    customCommentServers,
    setCustomServers,
  } = props;
  const [addServer, setAddServer] = React.useState(false);

  const customServersString = JSON.stringify(customCommentServers);

  // "migrate" to make sure any currently set custom server is in saved list
  React.useEffect(() => {
    // const servers = JSON.parse(customServersString);
    // if customServerUrl is not in servers, make sure it is.
  }, [customServerUrl, customServersString, setCustomServers]);

  const handleSelectServer = (serverItem: CommentServerDetails) => {
    if (serverItem.url !== COMMENT_SERVER_API) {
      Comments.setServerUrl(serverItem.url);
      setCustomServerUrl(serverItem.url);
      setCustomServerEnabled(true);
    } else {
      Comments.setServerUrl(undefined);
      setCustomServerEnabled(false);
    }
  };

  const handleAddServer = (serverItem: CommentServerDetails) => {
    const newCustomServers = customCommentServers.slice();
    newCustomServers.push(serverItem);
    setCustomServers(newCustomServers);
    handleSelectServer(serverItem);
    setAddServer(false);
  };

  const handleRemoveServer = (serverItem: CommentServerDetails) => {
    handleSelectServer(defaultServer);
    const newCustomServers = customCommentServers.slice().filter((server) => {
      return server.url !== serverItem.url;
    });
    setCustomServers(newCustomServers);
  };

  const commentServerLabel = (serverDetails: unknown, onRemove: unknown) => (
    <span className={'compound-label'}>
{ /* @ts-expect-error - TS2339 - Property 'name' does not exist on type 'unknown'. */}
      <span>{serverDetails.name}</span>
{ /* @ts-expect-error - TS2339 - Property 'url' does not exist on type 'unknown'. */}
      <span className="compound-label__details">{serverDetails.url}</span>
{ /* @ts-expect-error - TS2349 - This expression is not callable. */}
      {onRemove && <Button button={'inverse'} label={__('Remove')} onClick={() => onRemove(serverDetails)} />}
    </span>
  );
  const commentServerRadio = (customServerEnabled: unknown, customServerUrl: unknown, onClick: unknown, onRemove: unknown, serverDetails: unknown) => (
    <FormField
      type="radio"
// @ts-expect-error - TS2339 - Property 'url' does not exist on type 'unknown'.
      checked={(!customServerEnabled && !onRemove) || (customServerEnabled && customServerUrl === serverDetails.url)}
// @ts-expect-error - TS2349 - This expression is not callable.
      onClick={() => onClick(serverDetails)}
      label={commentServerLabel(serverDetails, onRemove)}
// @ts-expect-error - TS2339 - Property 'name' does not exist on type 'unknown'. | TS2339 - Property 'url' does not exist on type 'unknown'.
      name={`${serverDetails.name}${serverDetails.url}`}
// @ts-expect-error - TS2339 - Property 'name' does not exist on type 'unknown'. | TS2339 - Property 'url' does not exist on type 'unknown'.
      key={`${serverDetails.name}${serverDetails.url}`}
    />
  );

  return (
    <React.Fragment>
      <div className={'fieldset-section'}>
        {commentServerRadio(customServerEnabled, customServerUrl, handleSelectServer, null, defaultServer)}
        {customCommentServers.map((server) =>
          commentServerRadio(customServerEnabled, customServerUrl, handleSelectServer, handleRemoveServer, server)
        )}
      </div>
      <div className={'fieldset-section'}>
        {!addServer && (
          <div className="section__actions">
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button type="button" button="inverse" onClick={() => setAddServer(true)} label={__('Add A Server')} />
          </div>
        )}
        {addServer && <ItemInputRow update={handleAddServer} onCancel={setAddServer} />}
      </div>
    </React.Fragment>
  );
}

export default SettingCommentsServer;
