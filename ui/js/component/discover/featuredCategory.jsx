import React from "react";
import FileCard from "component/fileCard";
import ToolTip from "component/tooltip.js";

/*
Only show scroll arrow if cursor is inside of row

Get width of list of stories
Get width of screen
On scroll right => slide width of screen so that all new items are shown
If reach end of files, don't show the scroll right button

*/

class FeaturedCategory extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      leftScroll: 0,
      isAtEnd: false,
    };
  }

  render() {
    const { category, names } = this.props;

    return (
      <div className="card-row card-row--small">
        <h3 className="card-row__header">
          {category}
          {category &&
            category.match(/^community/i) &&
            <ToolTip
              label={__("What's this?")}
              body={__(
                'Community Content is a public space where anyone can share content with the rest of the LBRY community. Bid on the names "one," "two," "three," "four" and "five" to put your content here!'
              )}
              className="tooltip--header"
            />}
        </h3>
        <div className="card-row-container">
          {!!this.state.leftScroll &&
            <div className="card-row__left-scroll">
              <button
                onClick={() =>
                  this.setState({ leftScroll: this.state.leftScroll + 500 })}
              >
                Scroll left
              </button>
            </div>}
          {names &&
            <div style={{ marginLeft: this.state.leftScroll }}>
              {names.map(name =>
                <FileCard
                  key={name}
                  displayStyle="card"
                  uri={lbryuri.normalize(name)}
                />
              )}
            </div>}
          {!this.state.isAtEnd &&
            <div className="card-row__right-scroll">
              <button
                onClick={() =>
                  this.setState({ leftScroll: this.state.leftScroll - 500 })}
              >
                Scroll right
              </button>
            </div>}
        </div>
      </div>
    );
  }
}

export default FeaturedCategory;
