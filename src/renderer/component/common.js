import React from "react";
import PropTypes from "prop-types";
import { formatCredits, formatFullPrice } from "util/formatCredits";
import lbry from "../lbry.js";

//component/icon.js
export class Icon extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    className: PropTypes.string,
    fixed: PropTypes.bool,
  };

  render() {
    const { fixed, className } = this.props;
    const spanClassName =
      "icon " +
      ("fixed" in this.props ? "icon-fixed-width " : "") +
      this.props.icon +
      " " +
      (this.props.className || "");
    return <span className={spanClassName} />;
  }
}

export class TruncatedText extends React.PureComponent {
  static propTypes = {
    lines: PropTypes.number,
  };

  static defaultProps = {
    lines: null,
  };

  render() {
    return (
      <span
        className="truncated-text"
        style={{ WebkitLineClamp: this.props.lines }}
      >
        {this.props.children}
      </span>
    );
  }
}

export class BusyMessage extends React.PureComponent {
  static propTypes = {
    message: PropTypes.string,
  };

  render() {
    return (
      <span>
        {this.props.message} <span className="busy-indicator" />
      </span>
    );
  }
}

export class CurrencySymbol extends React.PureComponent {
  render() {
    return <span>LBC</span>;
  }
}

export class CreditAmount extends React.PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    precision: PropTypes.number,
    isEstimate: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    showFree: PropTypes.bool,
    showFullPrice: PropTypes.bool,
    showPlus: PropTypes.bool,
    look: PropTypes.oneOf(["indicator", "plain", "fee"]),
  };

  static defaultProps = {
    precision: 2,
    label: true,
    showFree: false,
    look: "indicator",
    showFullPrice: false,
    showPlus: false,
  };

  render() {
    const minimumRenderableAmount = Math.pow(10, -1 * this.props.precision);
    const { amount, precision, showFullPrice } = this.props;

    let formattedAmount;
    let fullPrice = formatFullPrice(amount, 2);

    if (showFullPrice) {
      formattedAmount = fullPrice;
    } else {
      formattedAmount =
        amount > 0 && amount < minimumRenderableAmount
          ? "<" + minimumRenderableAmount
          : formatCredits(amount, precision);
    }

    let amountText;
    if (this.props.showFree && parseFloat(this.props.amount) === 0) {
      amountText = __("free");
    } else {
      if (this.props.label) {
        const label =
          typeof this.props.label === "string"
            ? this.props.label
            : parseFloat(amount) == 1 ? __("credit") : __("credits");

        amountText = formattedAmount + " " + label;
      } else {
        amountText = formattedAmount;
      }
      if (this.props.showPlus && amount > 0) {
        amountText = "+" + amountText;
      }
    }

    return (
      <span
        className={`credit-amount credit-amount--${this.props.look}`}
        title={fullPrice}
      >
        <span>{amountText}</span>
        {this.props.isEstimate ? (
          <span
            className="credit-amount__estimate"
            title={__("This is an estimate and does not include data fees")}
          >
            *
          </span>
        ) : null}
      </span>
    );
  }
}

export class Thumbnail extends React.PureComponent {
  static propTypes = {
    src: PropTypes.string,
  };

  handleError() {
    if (this.state.imageUrl != this._defaultImageUri) {
      this.setState({
        imageUri: this._defaultImageUri,
      });
    }
  }

  constructor(props) {
    super(props);

    this._defaultImageUri = lbry.imagePath("default-thumb.svg");
    this._maxLoadTime = 10000;
    this._isMounted = false;

    this.state = {
      imageUri: this.props.src || this._defaultImageUri,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted && !this.refs.img.complete) {
        this.setState({
          imageUri: this._defaultImageUri,
        });
      }
    }, this._maxLoadTime);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const className = this.props.className ? this.props.className : "",
      otherProps = Object.assign({}, this.props);
    delete otherProps.className;
    return (
      <img
        ref="img"
        onError={() => {
          this.handleError();
        }}
        {...otherProps}
        className={className}
        src={this.state.imageUri}
      />
    );
  }
}
