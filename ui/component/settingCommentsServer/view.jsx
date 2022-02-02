// @flow
import { COMMENT_SERVER_API } from 'config'; // COMMENT_SERVER_NAME,
import React from 'react';
import Comments from 'comments';
import ItemPanel from 'component/common/item-panel';
import ItemInputRow from 'component/common/item-panel-input-row';
import Button from 'component/button';

type Props = {
  customServerEnabled: boolean,
  customServerUrl: string,
  setCustomServerEnabled: (boolean) => void,
  setCustomServerUrl: (string) => void,
  setCustomServers: (Array<CommentServerDetails>) => void,
  customCommentServers: Array<CommentServerDetails>,
};
const defaultServer = { name: 'Default', url: COMMENT_SERVER_API };
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

  // React.useEffect(() => {
  //   const timer = setTimeout(() => {
  //     Comments.setServerUrl(customServerEnabled ? url : undefined);
  //     if (url !== customServerUrl) {
  //       setCustomServerUrl(url);
  //     }
  //   }, DEBOUNCE_TEXT_INPUT_MS);
  //
  //   return () => clearTimeout(timer);
  // }, [url, customServerUrl, customServerEnabled, setCustomServerUrl]);

  const handleSelectServer = (serverItem: CommentServerDetails) => {
    if (serverItem.url !== COMMENT_SERVER_API) {
      alert(`set ${serverItem.url}`);
      Comments.setServerUrl(serverItem.url);
      setCustomServerUrl(serverItem.url);
      setCustomServerEnabled(true);
    } else {
      alert('reset');
      Comments.setServerUrl(undefined);
      setCustomServerEnabled(false);
    }
  };

  const handleAddServer = (serverItem: CommentServerDetails) => {
    const newCustomServers = customCommentServers.slice();
    newCustomServers.push(serverItem);
    setCustomServers(newCustomServers);
    handleSelectServer(serverItem);
  };

  const handleRemoveServer = (serverItem) => {
    handleSelectServer(defaultServer);
    const newCustomServers = customCommentServers.slice().filter((server) => {
      return server.url !== serverItem.url;
    });
    setCustomServers(newCustomServers);
  };

  return (
    <React.Fragment>
      <div className={'fieldset-section'}>
        <ItemPanel onClick={handleSelectServer} active={!customServerEnabled} serverDetails={defaultServer} />
        {!!customCommentServers.length && <label>{__('Custom Servers')}</label>}
        {customCommentServers.map((server) => (
          <ItemPanel
            key={server.url}
            active={customServerEnabled && customServerUrl === server.url}
            onClick={handleSelectServer}
            serverDetails={server}
            onRemove={handleRemoveServer}
          />
        ))}
      </div>
      <div className={'fieldset-section'}>
        {!addServer && (
          <div className="section__actions">
            <Button type="button" button="link" onClick={() => setAddServer(true)} label={__('Add A Server')} />
          </div>
        )}
        {addServer && <ItemInputRow update={handleAddServer} onCancel={setAddServer} />}
      </div>
    </React.Fragment>
  );
}

export default SettingCommentsServer;
