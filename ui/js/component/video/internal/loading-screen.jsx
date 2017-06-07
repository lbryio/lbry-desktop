import React from "react";

const LoadingScreen = ({ statusMessage }) =>
  <div className="video--loading--screen">
    <div className="loading--spinner" />

    <div className="video--loading--status">
      {statusMessage}
    </div>
  </div>;

export default LoadingScreen;
