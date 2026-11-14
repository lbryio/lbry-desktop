import React from "react";
import { FormField, FormFieldPrice } from "component/common/form";
import Card from "component/common/card";

type Props = {
  contentIsFree: boolean;
  fee: Fee;
  disabled: boolean;
  updatePublishForm: (arg1: Record<any, any>) => void;
};

function PublishPrice(props: Props) {
  const { contentIsFree, fee, updatePublishForm, disabled } = props;

  return (
    <>
      <label>{__("Price")}</label>
      <Card
        actions={
          <React.Fragment>
            <FormField
              type="radio"
              name="content_free"
              label={__("Free")}
              // @ts-expect-error - TS2322 - Type '{ type: string; name: string; label: string; checked: boolean; disabled: boolean; onChange: () => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
              checked={contentIsFree}
              disabled={disabled}
              onChange={() => updatePublishForm({ contentIsFree: true })}
            />

            <FormField
              type="radio"
              name="content_cost"
              label={__("Add a price to this file")}
              // @ts-expect-error - TS2322 - Type '{ type: string; name: string; label: string; checked: boolean; disabled: boolean; onChange: () => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
              checked={!contentIsFree}
              disabled={disabled}
              onChange={() => updatePublishForm({ contentIsFree: false })}
            />
            {!contentIsFree && (
              <FormFieldPrice
                name="content_cost_amount"
                min={0}
                // @ts-expect-error - TS2322 - Type 'Fee' is not assignable to type 'FormPrice'.
                price={fee}
                onChange={(newFee) => updatePublishForm({ fee: newFee })}
              />
            )}
            {fee && fee.currency !== "LBC" && (
              <p className="form-field__help">
                {__(
                  "All content fees are charged in LBRY Credits. For alternative payment methods, the number of LBRY Credits charged will be adjusted based on the value of LBRY Credits at the time of purchase."
                )}
              </p>
            )}
          </React.Fragment>
        }
      />
    </>
  );
}

export default PublishPrice;
