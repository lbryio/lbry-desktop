import React from "react";

const LoadingScreen = ({ statusMessage }) =>
  <div className="video--loading--screen">
    <div className="loading--spinner" />

    <div>
      {statusMessage}
    </div>
  </div>;

export default LoadingScreen;
