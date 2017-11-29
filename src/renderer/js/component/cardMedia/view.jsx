import React from "react";

class CardMedia extends React.PureComponent {
  static AUTO_THUMB_CLASSES = [
    "purple",
    "red",
    "pink",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "yellow",
    "orange",
  ];

  componentWillMount() {
    this.setState({
      autoThumbClass:
        CardMedia.AUTO_THUMB_CLASSES[
          Math.floor(Math.random() * CardMedia.AUTO_THUMB_CLASSES.length)
        ],
    });
  }

  render() {
    const { title, thumbnail } = this.props;
    const atClass = this.state.autoThumbClass;

    if (thumbnail) {
      return (
        <div
          className="card__media"
          style={{ backgroundImage: "url('" + thumbnail + "')" }}
        />
      );
    }

    return (
      <div className={`card__media card__media--autothumb ${atClass}`}>
        <div className="card__autothumb__text">
          {title &&
            title
              .replace(/\s+/g, "")
              .substring(0, Math.min(title.replace(" ", "").length, 5))
              .toUpperCase()}
        </div>
      </div>
    );
  }
}

export default CardMedia;
