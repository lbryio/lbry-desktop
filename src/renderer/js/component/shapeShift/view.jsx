// @flow
import * as React from "react";
import { shell } from "electron";
import { Formik } from "formik";
import classnames from "classnames";
import * as statuses from "constants/shape_shift";
import { validateShapeShiftForm } from "util/shape_shift";
import Link from "component/link";
import Spinner from "component/common/spinner";
import { BusyMessage } from "component/common";
import ShapeShiftForm from "./internal/form";
import ActiveShapeShift from "./internal/active-shift";

import type { ShapeShiftState } from "redux/reducers/shape_shift";
import type { Dispatch, ShapeShiftFormValues } from "redux/actions/shape_shift";

type Props = {
  shapeShift: ShapeShiftState,
  getCoinStats: Dispatch,
  createShapeShift: Dispatch,
  clearShapeShift: Dispatch,
  getActiveShift: Dispatch,
  doShowSnackBar: Dispatch,
  shapeShiftInit: Dispatch,
  receiveAddress: string,
};

class ShapeShift extends React.PureComponent<Props> {
  componentDidMount() {
    const {
      shapeShiftInit,
      shapeShift: { hasActiveShift, shiftSupportedCoins },
    } = this.props;

    if (!hasActiveShift && !shiftSupportedCoins.length) {
      // calls shapeshift to see list of supported coins for shifting
      shapeShiftInit();
    }
  }

  render() {
    const {
      getCoinStats,
      receiveAddress,
      createShapeShift,
      shapeShift,
      clearShapeShift,
      getActiveShift,
      doShowSnackBar,
    } = this.props;

    const {
      loading,
      updating,
      error,
      shiftSupportedCoins,
      hasActiveShift,
      originCoin,
      // ShapeShift response values
      originCoinDepositMax,
      originCoinDepositMin,
      originCoinDepositFee,
      shiftDepositAddress,
      shiftReturnAddress,
      shiftCoinType,
      shiftOrderId,
      shiftState,
    } = shapeShift;

    const initialFormValues: ShapeShiftFormValues = {
      receiveAddress,
      originCoin: "BTC",
      returnAddress: "",
    };

    return (
      // add the "shapeshift__intital-wrapper class so we can avoid content jumping once everything loads"
      // it just gives the section a min-height equal to the height of the content when the form is rendered
      // if the markup below changes for the initial render (form.jsx) there will be content jumping
      // the styling in shapeshift.scss will need to be updated to the correct min-height
      <section
        className={classnames("card shapeshift__wrapper", {
          "shapeshift__initial-wrapper": loading,
        })}
      >
        <div className="card__title-primary">
          <h3>{__("Convert Crypto to LBC")}</h3>
          <p className="help">
            {__("Powered by ShapeShift. Read our FAQ")}{" "}
            <Link href="https://lbry.io/faq/shapeshift">{__("here")}</Link>.
            {hasActiveShift &&
              shiftState !== "complete" && (
                <span>{__("This will update automatically.")}</span>
              )}
          </p>
        </div>

        <div className="card__content shapeshift__content">
          {error && <div className="form-field__error">{error}</div>}
          {loading && <Spinner dark />}
          {!loading &&
            !hasActiveShift &&
            !!shiftSupportedCoins.length && (
              <Formik
                onSubmit={createShapeShift}
                validate={validateShapeShiftForm}
                initialValues={initialFormValues}
                render={formProps => (
                  <ShapeShiftForm
                    {...formProps}
                    updating={updating}
                    originCoin={originCoin}
                    shiftSupportedCoins={shiftSupportedCoins}
                    getCoinStats={getCoinStats}
                    receiveAddress={receiveAddress}
                    originCoinDepositMax={originCoinDepositMax}
                    originCoinDepositMin={originCoinDepositMin}
                    originCoinDepositFee={originCoinDepositFee}
                  />
                )}
              />
            )}
          {hasActiveShift && (
            <ActiveShapeShift
              getActiveShift={getActiveShift}
              shiftCoinType={shiftCoinType}
              shiftReturnAddress={shiftReturnAddress}
              shiftDepositAddress={shiftDepositAddress}
              originCoinDepositMax={originCoinDepositMax}
              shiftOrderId={shiftOrderId}
              shiftState={shiftState}
              clearShapeShift={clearShapeShift}
              doShowSnackBar={doShowSnackBar}
            />
          )}
        </div>
      </section>
    );
  }
}

export default ShapeShift;
