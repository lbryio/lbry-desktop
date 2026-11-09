import {regexAddress} from 'util/lbryURI';

export default function validateSendTx(address: string) {
  const errors = {
    address: '',
  } as const;

  // All we need to check is if the address is valid
  // If values are missing, users wont' be able to submit the form
  if (!process.env.NO_ADDRESS_VALIDATION && !regexAddress.test(address)) {
// @ts-expect-error - TS2540 - Cannot assign to 'address' because it is a read-only property.
    errors.address = __('Not a valid LBRY address');
  }

  return errors;
}
