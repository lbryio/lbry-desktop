import React, {useState} from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router-dom';
import { FormField } from 'component/common/form';

type Props = {
  closeModal: () => void,
  collectionDelete: (arg1: string, arg2?: string | null | undefined) => void,
  claim: Claim,
  collectionId: string,
  collectionName: string,
  uri: string | null | undefined,
  redirect: string | null | undefined
};

function ModalRemoveCollection(props: Props) {
  const { closeModal, claim, collectionDelete, collectionId, collectionName, uri, redirect } = props;
  const title = claim && claim.value && claim.value.title;
  const { replace } = useHistory();
  const [confirmName, setConfirmName] = useState('');

  return (
// @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; type: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen contentLabel={__('Confirm List Unpublish')} type="card" onAborted={closeModal}>
      <Card
        title={__('Delete List')}
        body={
          uri ? (
            <React.Fragment>
              <p>{__('This will permanently delete the list.')}</p>
              <p>{__('Type "%name%" to confirm.', { name: collectionName })}</p>
{ /* @ts-expect-error - TS2741 - Property 'name' is missing in type '{ value: string; type: string; onChange: (e: any) => void; }' but required in type 'Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | "type" | "name" | "value" | "disabled" | "label" | "children" | "render" | ... 15 more ... | "onChange">'. */}
              <FormField value={confirmName} type={'text'} onChange={(e) => setConfirmName(e.target.value)} />
            </React.Fragment>
          ) : (
            // @ts-expect-error - TS2745, TS2322 (ts-migration)
            <I18nMessage tokens={{ title: <cite>{uri && title ? `"${title}"` : `"${collectionName}"`}</cite> }}>
              Are you sure you'd like to remove %title%?
            </I18nMessage>
          )
        }
        actions={
          <>
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                label={__('Delete')}
                disabled={uri && collectionName !== confirmName}
                onClick={() => {
                  if (redirect) replace(redirect);
                  collectionDelete(collectionId, uri ? 'resolved' : undefined);
                  closeModal();
                }}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__('Cancel')} onClick={closeModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveCollection;
