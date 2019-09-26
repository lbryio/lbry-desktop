export default () => null;
// // @flow
// import React, { useState } from 'react';
// import { Form, FormField, Submit } from 'component/common/form';
// import Button from 'component/button';
// import UserEmail from 'component/userEmail';
// import * as ICONS from 'constants/icons';

// import { getSavedPassword, setSavedPassword, deleteAuthToken } from 'util/saved-passwords';

// type Props = {
//   // wallet statuses
//   walletEncryptSucceeded: boolean,
//   walletEncryptPending: boolean,
//   walletDecryptSucceeded: boolean,
//   walletDecryptPending: boolean,
//   updateWalletStatus: boolean,
//   walletEncrypted: boolean,
//   // wallet methods
//   encryptWallet: (?string) => void,
//   decryptWallet: (?string) => void,
//   updateWalletStatus: () => void,
//   // housekeeping
//   setPasswordSaved: () => void,
//   syncEnabled: boolean,
//   setClientSetting: (string, boolean | string) => void,
//   isPasswordSaved: boolean,
//   // data
//   user: any,
//   // sync statuses
//   hasSyncedWallet: boolean,
//   getSyncIsPending?: boolean,
//   syncApplyErrorMessage?: string,
//   hashChanged: boolean,
//   // sync data
//   syncData: string | null,
//   syncHash: string | null,
//   // sync methods
//   syncApply: (string | null, string | null, string) => void,
//   checkSync: () => void,
//   setDefaultAccount: () => void,
//   hasTransactions: boolean,
// };

// type State = {
//   newPassword: string,
//   newPasswordConfirm: string,
//   passwordMatch: boolean,
//   understandConfirmed: boolean,
//   understandError: boolean,
//   submitted: boolean,
//   failMessage: ?string,
//   rememberPassword: boolean,
//   showEmailReg: boolean,
//   failed: boolean,
//   enableSync: boolean,
//   encryptWallet: boolean,
//   obscurePassword: boolean,
//   advancedMode: boolean,
//   showPasswordFields: boolean,
// };

// function WalletSecurityAndSync(props: Props) {
//   const {
//     // walletEncryptSucceeded,
//     // walletEncryptPending,
//     // walletDecryptSucceeded,
//     // walletDecryptPending,
//     // updateWalletStatus,
//     walletEncrypted,
//     encryptWallet,
//     decryptWallet,
//     syncEnabled,
//     user,
//     hasSyncedWallet,
//     getSyncIsPending,
//     syncApplyErrorMessage,
//     hashChanged,
//     syncData,
//     syncHash,
//     syncApply,
//     checkSync,
//     hasTransactions,
//     // setDefaultAccount,
//   } = props;

//   const defaultComponentState: State = {
//     newPassword: '',
//     newPasswordConfirm: '',
//     passwordMatch: false,
//     understandConfirmed: false,
//     understandError: false,
//     submitted: false, // Prior actions could be marked complete
//     failMessage: undefined,
//     rememberPassword: false,
//     showEmailReg: false,
//     failed: false,
//     enableSync: syncEnabled,
//     encryptWallet: walletEncrypted,
//     obscurePassword: true,
//     advancedMode: false,
//     showPasswordFields: false,
//   };
//   const [componentState, setComponentState] = useState<State>(defaultComponentState);

//   const safeToSync = !hasTransactions || !hashChanged;

//   // on mount
//   // useEffect(() => {
//   //   checkSync();
//   //   getSavedPassword().then(p => {
//   //     if (p) {
//   //       setComponentState({
//   //         ...componentState,
//   //         newPassword: p,
//   //         newPasswordConfirm: p,
//   //         showPasswordFields: true,
//   //         rememberPassword: true,
//   //       });
//   //     }
//   //   });
//   // }, []);

//   // useEffect(() => {
//   //   setComponentState({
//   //     ...componentState,
//   //     passwordMatch: componentState.newPassword === componentState.newPasswordConfirm,
//   //   });
//   // }, [componentState.newPassword, componentState.newPasswordConfirm]);

//   const isEmailVerified = user && user.primary_email && user.has_verified_email;
//   // const syncDisabledMessage = 'You cannot sync without an email';

//   function onChangeNewPassword(event: SyntheticInputEvent<>) {
//     setComponentState({ ...componentState, newPassword: event.target.value || '' });
//   }

//   function onChangeRememberPassword(event: SyntheticInputEvent<>) {
//     if (componentState.rememberPassword) {
//       deleteAuthToken();
//     }
//     setComponentState({ ...componentState, rememberPassword: event.target.checked });
//   }

//   function onChangeNewPasswordConfirm(event: SyntheticInputEvent<>) {
//     setComponentState({ ...componentState, newPasswordConfirm: event.target.value || '' });
//   }

//   function onChangeUnderstandConfirm(event: SyntheticInputEvent<>) {
//     setComponentState({ ...componentState, understandConfirmed: /^.?i understand.?$/i.test(event.target.value) });
//   }

//   function onChangeSync(event: SyntheticInputEvent<>) {
//     if (componentState.enableSync) {
//       setComponentState({ ...componentState, enableSync: false, newPassword: '', newPasswordConfirm: '' });
//       setComponentState({ ...componentState, enableSync: false, newPassword: '', newPasswordConfirm: '' });
//     }
//     if (!(walletEncrypted || syncApplyErrorMessage || componentState.advancedMode)) {
//       easyApply();
//     } else {
//       setComponentState({ ...componentState, enableSync: true });
//     }
//   }

//   function onChangeEncrypt(event: SyntheticInputEvent<>) {
//     setComponentState({ ...componentState, encryptWallet: event.target.checked });
//   }

//   async function easyApply() {
//     return new Promise((resolve, reject) => {
//       return syncApply(syncHash, syncData, componentState.newPassword);
//     })
//       .then(() => {
//         setComponentState({ ...componentState, enableSync: event.target.checked });
//       })
//       .catch();
//   }

//   async function apply() {
//     setComponentState({ ...componentState, failed: false });

//     await checkSync();

//     if (componentState.enableSync) {
//       await syncApply(syncHash, syncData, componentState.newPassword);
//       if (syncApplyErrorMessage) {
//         setComponentState({ ...componentState, failed: true });
//       }
//     }

//     if (walletEncrypted) {
//       await decryptWallet();
//     }

//     if (componentState.encryptWallet && !componentState.failed) {
//       await encryptWallet(componentState.newPassword)
//         .then(() => {})
//         .catch(() => {
//           setComponentState({ ...componentState, failed: false });
//         });
//     }

//     if (componentState.rememberPassword && !componentState.failed) {
//       setSavedPassword(componentState.newPassword);
//     }
//   }

//   return (
//     <React.Fragment>
//       <section className="card card--section">
//         <h2 className="card__title">{__('Wallet Sync and Security')}</h2>
//         {!isEmailVerified && (
//           <React.Fragment>
//             <p className="card__subtitle">
//               {__(`It looks like we don't have your email.`)}{' '}
//               <Button
//                 button="link"
//                 label={__('Verify your email')}
//                 onClick={() => setComponentState({ ...componentState, showEmailReg: !componentState.showEmailReg })}
//               />{' '}
//               {__(`and then come back here.`)}
//             </p>
//             {componentState.showEmailReg && <UserEmail />}
//           </React.Fragment>
//         )}
//         <p>
//           {__(
//             'Your LBRY password can help you encrypt your wallet or sync it to another device. You must use the same LBRY password on every device if you wish to sync.'
//           )}{' '}
//           <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />.
//         </p>
//         {/* Errors and status */}
//         {!componentState.advancedMode && (
//           <React.Fragment>
//             <p className="card__subtitle">
//               {__(`Easy Mode: Sync and go with default security! Don't trust your roommate?`)}{' '}
//               <Button
//                 button="link"
//                 label={__('Advanced Mode')}
//                 onClick={() => setComponentState({ ...componentState, advancedMode: !componentState.advancedMode })}
//               />
//               .
//             </p>
//           </React.Fragment>
//         )}
//         {componentState.advancedMode && (
//           <React.Fragment>
//             <p className="card__subtitle">
//               {__('Advanced Mode: Enter a password that matches your other devices LBRY password.')}{' '}
//               <Button
//                 button="link"
//                 label={__('Easy Mode')}
//                 onClick={() => setComponentState({ ...componentState, advancedMode: !componentState.advancedMode })}
//               />
//               .
//             </p>
//           </React.Fragment>
//         )}
//         {syncApplyErrorMessage && <div className="card__subtitle--status">{__(syncApplyErrorMessage)}</div>}

//         <Form onSubmit={() => apply()}>
//           {componentState.advancedMode && (
//             <FormField
//               type="checkbox"
//               name="sync_enabled"
//               checked={componentState.enableSync}
//               disabled={!isEmailVerified || !safeToSync}
//               prefix={<span className="badge badge--alert">ALPHA</span>}
//               onChange={event => onChangeSync(event)}
//               label={
//                 <React.Fragment>
//                   {__('Enable Sync')} <Button button="link" label={__('(?)')} href="https://lbry.com/privacypolicy" />{' '}
//                   <span className="badge badge--alert">ALPHA</span>
//                 </React.Fragment>
//               }
//             />
//           )}
//           {!componentState.advancedMode && (
//             <Button
//               button="primary"
//               label={__('Sync my wallet')}
//               onClick={() => syncApply(syncHash, syncData, componentState.newPassword)}
//             />
//           )}
//           {(walletEncrypted ||
//             syncApplyErrorMessage ||
//             componentState.advancedMode ||
//             componentState.showPasswordFields) && (
//             <React.Fragment>
//               <FormField
//                 autoFocus
//                 inputButton={
//                   <Button
//                     icon={componentState.obscurePassword ? ICONS.EYE : ICONS.EYE_OFF}
//                     button={'primary'}
//                     onClick={() =>
//                       setComponentState({ ...componentState, obscurePassword: !componentState.obscurePassword })
//                     }
//                   />
//                 }
//                 label={__('Password')}
//                 placeholder={__('Shh...')}
//                 type={componentState.obscurePassword ? 'password' : 'text'}
//                 name="wallet-new-password"
//                 onChange={event => onChangeNewPassword(event)}
//                 value={componentState.newPassword}
//               />
//               <FormField
//                 error={componentState.passwordMatch === false ? 'No match' : false}
//                 label={__('Same Password')}
//                 placeholder={__('Your eyes only')}
//                 type="password"
//                 name="wallet-new-password-confirm"
//                 onChange={event => onChangeNewPasswordConfirm(event)}
//                 value={componentState.newPasswordConfirm}
//               />
//               <FormField
//                 label={__('Remember Password')}
//                 type="checkbox"
//                 name="wallet-remember-password"
//                 onChange={event => onChangeRememberPassword(event)}
//                 checked={componentState.rememberPassword}
//               />
//             </React.Fragment>
//           )}

//           {/* Confirmation */}

//           {(walletEncrypted || componentState.advancedMode) && (
//             <React.Fragment>
//               <FormField
//                 type="checkbox"
//                 name="encrypt_enabled"
//                 checked={componentState.encryptWallet}
//                 disabled={false}
//                 onChange={event => onChangeEncrypt(event)}
//                 label={__('Encrypt Wallet')}
//               />
//               <div className="card__subtitle--status">
//                 {__(
//                   'If your password is lost, it cannot be recovered. You will not be able to access your wallet without a password.'
//                 )}
//               </div>
//               <FormField
//                 error={componentState.understandError === true ? 'You must enter "I understand"' : false}
//                 label={__('Enter "I understand"')}
//                 placeholder={__('I understand')}
//                 type="text"
//                 name="wallet-understand"
//                 onChange={event => onChangeUnderstandConfirm(event)}
//               />
//             </React.Fragment>
//           )}

//           {componentState.failMessage && <div className="error-text">{__(componentState.failMessage)}</div>}
//           {(walletEncrypted || componentState.advancedMode || syncApplyErrorMessage) && (
//             <Submit
//               disabled={!componentState.passwordMatch || (!componentState.enableSync && !componentState.encryptWallet)}
//               label={componentState.failMessage ? __('Encrypting Wallet') : __('Apply')}
//             />
//           )}
//         </Form>
//       </section>

//       {/* Testing stuff and Diagnostics */}

//       <section className="card card--section">
//         <Button
//           button="primary"
//           label={__('Sync Apply')}
//           onClick={() => syncApply(syncHash, syncData, componentState.newPassword)}
//         />{' '}
//         <Button button="primary" label={__('Check Sync')} onClick={() => checkSync()} />{' '}
//         <Button button="primary" label={__('Setpass test')} onClick={() => setSavedPassword('testpass')} />{' '}
//         <Button
//           button="primary"
//           label={__('Getpass test')}
//           onClick={() => getSavedPassword().then(p => setComponentState({ ...componentState, newPassword: p }))}
//         />{' '}
//         <Button button="primary" label={__('Deletepass test')} onClick={() => deleteAuthToken()} />{' '}
//         <p>
//           password:{' '}
//           {componentState.newPassword
//             ? componentState.newPassword
//             : componentState.newPassword === ''
//             ? 'blankString'
//             : 'null'}
//         </p>
//         <p>encryptWallet: {String(componentState.encryptWallet)}</p>
//         <p>enableSync: {String(componentState.enableSync)}</p>
//         <p>syncApplyError: {String(syncApplyErrorMessage)}</p>
//         <p>Has Synced: {String(hasSyncedWallet)}</p>
//         <p>getSyncPending: {String(getSyncIsPending)}</p>
//         <p>syncEnabled: {String(syncEnabled)}</p>
//         <p>syncHash: {syncHash ? syncHash.slice(0, 10) : 'null'}</p>
//         <p>syncData: {syncData ? syncData.slice(0, 10) : 'null'}</p>
//         <p>walletEncrypted: {String(walletEncrypted)}</p>
//         <p>emailRegistered: {String(isEmailVerified)}</p>
//         <p>hashChanged: {String(hashChanged)}</p>
//       </section>
//     </React.Fragment>
//   );
// }

// export default WalletSecurityAndSync;
